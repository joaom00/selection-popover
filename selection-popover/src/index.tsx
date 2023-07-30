import * as React from 'react'
import { createContext } from '@radix-ui/react-context'
import { useComposedRefs } from '@radix-ui/react-compose-refs'
import { Presence } from '@radix-ui/react-presence'
import { useControllableState } from '@radix-ui/react-use-controllable-state'
import { Primitive } from '@radix-ui/react-primitive'
import { useSize } from '@radix-ui/react-use-size'
import { Portal as PortalPrimitive } from '@radix-ui/react-portal'
import { DismissableLayer } from '@radix-ui/react-dismissable-layer'
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect'
import * as ArrowPrimitive from '@radix-ui/react-arrow'
import {
  useFloating,
  autoUpdate,
  offset,
  shift,
  limitShift,
  flip,
  hide,
  arrow as floatingUIarrow,
  inline,
} from '@floating-ui/react-dom'

import type { Placement, Middleware } from '@floating-ui/react-dom'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

type Side = (typeof SIDE_OPTIONS)[number]
type Align = (typeof ALIGN_OPTIONS)[number]

/* -------------------------------------------------------------------------------------------------
 * Selection
 * -----------------------------------------------------------------------------------------------*/

type VirtualReference = {
  getBoundingClientRect(): DOMRect
  getClientRects(): DOMRectList
}
type SelectionContextValue = {
  open: boolean
  onOpenChange(open: boolean): void
  onOpen(callback: () => void): void
  onClose(): void
  whileSelect: boolean
  virtualRef: VirtualReference
  onVirtualRefChange(virtualRef: VirtualReference): void
  content: HTMLDivElement | null
  onContentChange(content: HTMLDivElement | null): void
  disabled: boolean
}
const [SelectionProvider, useSelectionContext] = createContext<SelectionContextValue>('Selection')

interface SelectionProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
  whileSelect?: boolean
  disabled?: boolean
  openDelay?: number
  closeDelay?: number
}
const Selection = (props: SelectionProps) => {
  const {
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    whileSelect = false,
    disabled = false,
    openDelay,
    closeDelay,
  } = props
  const openTimerRef = React.useRef(0)
  const closeTimerRef = React.useRef(0)
  const [content, setContent] = React.useState<HTMLDivElement | null>(null)
  const [virtualRef, setVirtualRef] = React.useState({
    getBoundingClientRect: () => DOMRect.fromRect(),
    getClientRects: () => new DOMRectList(),
  })
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  })
  const handleOpen = React.useCallback(
    (callback: () => void) => {
      clearTimeout(closeTimerRef.current)
      openTimerRef.current = window.setTimeout(callback, openDelay)
    },
    [openDelay],
  )
  const handleClose = React.useCallback(() => {
    clearTimeout(openTimerRef.current)
    closeTimerRef.current = window.setTimeout(() => setOpen(false), closeDelay)
  }, [closeDelay, setOpen])

  return (
    <SelectionProvider
      open={open}
      onOpenChange={setOpen}
      onOpen={handleOpen}
      onClose={handleClose}
      whileSelect={whileSelect}
      virtualRef={virtualRef}
      onVirtualRefChange={setVirtualRef}
      content={content}
      onContentChange={setContent}
      disabled={disabled}
    >
      {children}
    </SelectionProvider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * SelectionTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'SelectionTrigger'

type SelectionTriggerElement = SelectionTriggerImplElement
interface SelectionTriggerProps extends SelectionTriggerImplProps { }

const SelectionTrigger = React.forwardRef<SelectionTriggerElement, SelectionTriggerProps>(
  (props, forwardedRef) => {
    const context = useSelectionContext(TRIGGER_NAME)
    const ref = React.useRef<HTMLDivElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)

    return context.whileSelect ? (
      <SelectionTriggerWhileSelect {...props} ref={forwardedRef} />
    ) : (
      <SelectionTriggerImpl
        {...props}
        ref={composedRefs}
        onPointerUp={(event) => {
          props.onPointerUp?.(event)

          if (event.pointerType !== 'mouse') return

          context.onOpen(() => {
            const selection = document.getSelection()
            if (!selection) return
            const trigger = ref.current
            const wasSelectionInsideTrigger = trigger?.contains(selection.anchorNode)
            if (!wasSelectionInsideTrigger) return
            if (selection.toString().trim() === '') return
            if (selection.isCollapsed) return
            const range = selection.getRangeAt(0)
            context.onOpenChange(true)
            context.onVirtualRefChange({
              getBoundingClientRect: () => range.getBoundingClientRect(),
              getClientRects: () => range.getClientRects(),
            })
          })
        }}
      />
    )
  },
)

SelectionTrigger.displayName = TRIGGER_NAME

/* ---------------------------------------------------------------------------------------------- */

let originalBodyUserSelect: string

type SelectionTriggerWhileSelectElement = SelectionTriggerImplElement
interface SelectionTriggerWhileSelectProps extends SelectionTriggerImplProps { }

const SelectionTriggerWhileSelect = React.forwardRef<
  SelectionTriggerWhileSelectElement,
  SelectionTriggerWhileSelectProps
>((props, forwardedRef) => {
  const context = useSelectionContext(TRIGGER_NAME)
  const [containSelection, setContainSelection] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const pointerTypeRef = React.useRef('')
  const hasOpenedRef = React.useRef(false)
  const composedRefs = useComposedRefs(forwardedRef, ref)
  const handlePointerUp = React.useCallback(() => {
    setContainSelection(false)
  }, [])

  const { onOpen, onOpenChange, onVirtualRefChange } = context

  React.useEffect(() => {
    if (!context.disabled) {
      const handleSelection = () => {
        if (pointerTypeRef.current !== 'mouse') return
        const selection = document.getSelection()
        if (!selection) return
        const node = ref.current
        const wasSelectionInsideTrigger = node?.contains(selection.anchorNode)
        if (!wasSelectionInsideTrigger) {
          hasOpenedRef.current = false
          return
        }
        if (selection.isCollapsed) {
          hasOpenedRef.current = false
          return
        }
        const hasTextSelected = selection.toString().trim() !== ''
        if (hasTextSelected) {
          const range = selection?.getRangeAt(0)
          if (!hasOpenedRef.current) onOpen(() => onOpenChange(true))
          hasOpenedRef.current = true
          onVirtualRefChange({
            getBoundingClientRect: () => range.getBoundingClientRect(),
            getClientRects: () => range.getClientRects(),
          })
        }
      }
      document.addEventListener('selectionchange', handleSelection)
      return () => document.removeEventListener('selectionchange', handleSelection)
    }
  }, [context.disabled, onOpenChange, onOpen, onVirtualRefChange])

  React.useEffect(() => {
    if (containSelection) {
      const body = document.body

      // Safari requires prefix
      originalBodyUserSelect = body.style.userSelect || body.style.webkitUserSelect

      body.style.userSelect = 'none'
      body.style.webkitUserSelect = 'none'

      return () => {
        body.style.userSelect = originalBodyUserSelect
        body.style.webkitUserSelect = originalBodyUserSelect
      }
    }
  }, [containSelection])

  React.useEffect(() => {
    return () => document.removeEventListener('pointerup', handlePointerUp)
  }, [handlePointerUp])

  return (
    <SelectionTriggerImpl
      {...props}
      ref={composedRefs}
      onPointerDown={(event) => {
        props.onPointerDown?.(event)

        pointerTypeRef.current = event.pointerType
        setContainSelection(true)
        document.addEventListener('pointerup', handlePointerUp, { once: true })
      }}
      style={{
        userSelect: containSelection ? 'text' : undefined,
        WebkitUserSelect: containSelection ? 'text' : undefined,
        ...props.style,
      }}
    />
  )
})

/* ---------------------------------------------------------------------------------------------- */

type SelectionTriggerImplElement = React.ElementRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
interface SelectionTriggerImplProps extends PrimitiveDivProps { }

const SelectionTriggerImpl = React.forwardRef<
  SelectionTriggerImplElement,
  SelectionTriggerImplProps
>((props, forwardedRef) => {
  const context = useSelectionContext(TRIGGER_NAME)
  const [disablePointerEvents, setDisablePointerEvents] = React.useState(false)
  const handlePointerUp = React.useCallback(() => {
    setDisablePointerEvents(false)
  }, [])

  React.useEffect(() => {
    if (context.content && disablePointerEvents) {
      const content = context.content
      const originalContentPointerEvents = content.style.pointerEvents

      content.style.pointerEvents = 'none'

      return () => {
        content.style.pointerEvents = originalContentPointerEvents
      }
    }
  }, [context.content, disablePointerEvents])

  React.useEffect(() => {
    return () => document.removeEventListener('pointerup', handlePointerUp)
  }, [handlePointerUp])

  return (
    <Primitive.div
      {...props}
      ref={forwardedRef}
      onPointerDown={(event) => {
        props.onPointerDown?.(event)

        setDisablePointerEvents(true)
        document.addEventListener('pointerup', handlePointerUp, { once: true })
      }}
    />
  )
})

/* -------------------------------------------------------------------------------------------------
 * SelectionPortal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'SelectionPortal'

type PortalContextValue = { forceMount?: true }
const [PortalProvider, usePortalContext] = createContext<PortalContextValue>(PORTAL_NAME, {
  forceMount: undefined,
})

type PortalProps = React.ComponentPropsWithoutRef<typeof PortalPrimitive>
interface SelectionPortalProps extends Omit<PortalProps, 'asChild'> {
  children?: React.ReactNode
  forceMount?: true
}

const SelectionPortal = (props: SelectionPortalProps) => {
  const { forceMount, container, children } = props
  const context = useSelectionContext(PORTAL_NAME)
  return (
    <PortalProvider forceMount={forceMount}>
      <Presence present={forceMount || context.open}>
        <PortalPrimitive asChild container={container}>
          {children}
        </PortalPrimitive>
      </Presence>
    </PortalProvider>
  )
}

SelectionPortal.displayName = PORTAL_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectionContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'SelectionContent'

type SelectionContentElement = SelectionContentImplElement
interface SelectionContentProps extends SelectionContentImplProps {
  forceMount?: true
}

const SelectionContent = React.forwardRef<SelectionContentElement, SelectionContentProps>(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME)
    const { forceMount = portalContext.forceMount, ...contentProps } = props
    const context = useSelectionContext(CONTENT_NAME)
    return (
      <Presence present={forceMount || context.open}>
        <SelectionContentImpl {...contentProps} ref={forwardedRef} />
      </Presence>
    )
  },
)

/* ---------------------------------------------------------------------------------------------- */

type SelectionContentContextValue = {
  placedSide: Side
  onArrowChange(arrow: HTMLSpanElement | null): void
  arrowX?: number
  arrowY?: number
  shouldHideArrow: boolean
}

const [SelectionContentProvider, useContentContext] =
  createContext<SelectionContentContextValue>(CONTENT_NAME)

type Boundary = Element | null

type SelectionContentImplElement = React.ElementRef<typeof Primitive.div>
type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>
interface SelectionContentImplProps extends PrimitiveDivProps {
  side?: Side
  sideOffset?: number
  align?: Align
  alignOffset?: number
  arrowPadding?: number
  collisionBoundary?: Boundary | Boundary[]
  collisionPadding?: number | Partial<Record<Side, number>>
  sticky?: 'partial' | 'always'
  hideWhenDetached?: boolean
  avoidCollisions?: boolean
  onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown']
  onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside']
  onFocusOutside?: DismissableLayerProps['onFocusOutside']
  onInteractOutside?: DismissableLayerProps['onInteractOutside']
}

const SelectionContentImpl = React.forwardRef<
  SelectionContentImplElement,
  SelectionContentImplProps
>((props, forwardedRef) => {
  const {
    side = 'top',
    sideOffset = 0,
    align = 'center',
    alignOffset = 0,
    arrowPadding = 0,
    sticky = 'partial',
    collisionBoundary = [],
    collisionPadding: collisionPaddingProp = 0,
    hideWhenDetached = false,
    avoidCollisions = true,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    ...contentProps
  } = props
  const context = useSelectionContext(CONTENT_NAME)
  const { onClose, onContentChange } = context
  const [content, setContent] = React.useState<HTMLDivElement | null>(null)
  const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node))

  const [arrow, setArrow] = React.useState<HTMLSpanElement | null>(null)
  const arrowSize = useSize(arrow)
  const arrowWidth = arrowSize?.width ?? 0
  const arrowHeight = arrowSize?.height ?? 0

  const desiredPlacement = (side + (align !== 'center' ? '-' + align : '')) as Placement

  const collisionPadding =
    typeof collisionPaddingProp === 'number'
      ? collisionPaddingProp
      : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp }

  const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary]
  const hasExplicitBoundaries = boundary.length > 0

  const detectOverflowOptions = {
    padding: collisionPadding,
    boundary: boundary.filter(isNotNull),
    altBoundary: hasExplicitBoundaries,
  }

  const { x, y, strategy, placement, refs, middlewareData, isPositioned } = useFloating({
    strategy: 'fixed',
    placement: desiredPlacement,
    whileElementsMounted: autoUpdate,
    middleware: [
      inline(),
      anchorCssProperties(),
      offset({ mainAxis: sideOffset + arrowHeight, alignmentAxis: alignOffset }),
      avoidCollisions ? flip(detectOverflowOptions) : undefined,
      avoidCollisions
        ? shift({
          mainAxis: true,
          crossAxis: false,
          limiter: sticky === 'partial' ? limitShift() : undefined,
          ...detectOverflowOptions,
        })
        : undefined,
      arrow ? floatingUIarrow({ element: arrow, padding: arrowPadding }) : undefined,
      transformOrigin({ arrowWidth, arrowHeight }),
      hideWhenDetached ? hide({ strategy: 'referenceHidden' }) : undefined,
    ],
  })

  useLayoutEffect(() => {
    refs.setReference(context.virtualRef)
    onContentChange(refs.floating.current as HTMLDivElement)
  }, [context.virtualRef, onContentChange, refs])

  const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement)

  const arrowX = middlewareData.arrow?.x
  const arrowY = middlewareData.arrow?.y
  const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0

  const [contentZIndex, setContentZIndex] = React.useState<string>()
  useLayoutEffect(() => {
    if (content) setContentZIndex(window.getComputedStyle(content).zIndex)
  }, [content])

  return (
    <div
      ref={refs.setFloating}
      style={{
        position: strategy,
        top: 0,
        left: 0,
        transform: isPositioned
          ? `translate3d(${Math.round(x ?? 0)}px, ${Math.round(y ?? 0)}px, 0)`
          : 'translate3d(0, -200%, 0)',
        minWidth: 'max-content',
        zIndex: contentZIndex,
      }}
    >
      <SelectionContentProvider
        placedSide={placedSide}
        onArrowChange={setArrow}
        arrowX={arrowX}
        arrowY={arrowY}
        shouldHideArrow={cannotCenterArrow}
      >
        <DismissableLayer
          asChild
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={onPointerDownOutside}
          onFocusOutside={onFocusOutside}
          onInteractOutside={onInteractOutside}
          onDismiss={onClose}
        >
          <Primitive.div
            data-side={placedSide}
            data-align={placedAlign}
            data-state={context.open ? 'open' : 'closed'}
            {...contentProps}
            ref={composedRefs}
            style={{
              userSelect: 'none',
              ...contentProps.style,
              animation: !isPositioned ? 'none' : undefined,
              opacity: middlewareData.hide?.referenceHidden ? 0 : undefined,
              ['--selection-popover-content-transform-origin' as any]: [
                middlewareData.transformOrigin?.x,
                middlewareData.transformOrigin?.y,
              ].join(' '),
            }}
          />
        </DismissableLayer>
      </SelectionContentProvider>
    </div>
  )
})

SelectionContent.displayName = CONTENT_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectionArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'SelectionArrow'

const OPPOSITE_SIDE: Record<Side, Side> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
}

type SelectionArrowElement = React.ElementRef<typeof ArrowPrimitive.Root>
type ArrowProps = React.ComponentPropsWithoutRef<typeof ArrowPrimitive.Root>
interface SelectionArrowProps extends ArrowProps { }

const SelectionArrow = React.forwardRef<SelectionArrowElement, SelectionArrowProps>(
  (props, forwardedRef) => {
    const contentContext = useContentContext(ARROW_NAME)
    const baseSide = OPPOSITE_SIDE[contentContext.placedSide]

    return (
      <span
        ref={contentContext.onArrowChange}
        style={{
          position: 'absolute',
          left: contentContext.arrowX,
          top: contentContext.arrowY,
          [baseSide]: 0,
          transformOrigin: {
            top: '',
            right: '0 0',
            bottom: 'center 0',
            left: '100% 0',
          }[contentContext.placedSide],
          transform: {
            top: 'translateY(100%)',
            right: 'translateY(50%) rotate(90deg) translateX(-50%)',
            bottom: 'rotate(180deg)',
            left: 'translateY(50%) rotate(-90deg) translateX(50%)',
          }[contentContext.placedSide],
          visibility: contentContext.shouldHideArrow ? 'hidden' : undefined,
        }}
      >
        <ArrowPrimitive.Root
          {...props}
          ref={forwardedRef}
          style={{ ...props.style, display: 'block' }}
        />
      </span>
    )
  },
)

SelectionArrow.displayName = ARROW_NAME

/* -----------------------------------------------------------------------------------------------*/

function isNotNull<T>(value: T | null): value is T {
  return value !== null
}

function getSideAndAlignFromPlacement(placement: Placement) {
  const [side, align = 'center'] = placement.split('-')
  return [side as Side, align as Align] as const
}

const anchorCssProperties = (): Middleware => ({
  name: 'anchorCssProperties',
  async fn(data) {
    const { rects, elements, platform } = data
    const { width, height } = rects.reference
    const { width: popoverWidth, height: popoverHeight } = rects.floating
    elements.floating.style.setProperty('--selection-popover-select-width', `${width}px`)
    elements.floating.style.setProperty('--selection-popover-select-height', `${height}px`)
    const newDimensions = await platform.getDimensions(elements.floating)
    if (popoverWidth !== newDimensions.width || popoverHeight !== newDimensions.height) {
      return { reset: { rects: true } }
    }
    return {}
  },
})

const transformOrigin = (options: { arrowWidth: number; arrowHeight: number }): Middleware => ({
  name: 'transformOrigin',
  options,
  fn(data) {
    const { placement, rects, middlewareData } = data

    const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0
    const isArrowHidden = cannotCenterArrow
    const arrowWidth = isArrowHidden ? 0 : options.arrowWidth
    const arrowHeight = isArrowHidden ? 0 : options.arrowHeight

    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement)
    const noArrowAlign = { start: '0%', center: '50%', end: '100%' }[placedAlign]

    const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2
    const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2

    let x = ''
    let y = ''

    if (placedSide === 'bottom') {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`
      y = `${-arrowHeight}px`
    } else if (placedSide === 'top') {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`
      y = `${rects.floating.height + arrowHeight}px`
    } else if (placedSide === 'right') {
      x = `${-arrowHeight}px`
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`
    } else if (placedSide === 'left') {
      x = `${rects.floating.width + arrowHeight}px`
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`
    }
    return { data: { x, y } }
  },
})

export {
  Selection as Root,
  SelectionTrigger as Trigger,
  SelectionPortal as Portal,
  SelectionContent as Content,
  SelectionArrow as Arrow,
}
