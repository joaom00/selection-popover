'use client'

import * as React from 'react'
import { createContext } from '@radix-ui/react-context'
import { useComposedRefs } from '@radix-ui/react-compose-refs'
import { Presence } from '@radix-ui/react-presence'
import { useControllableState } from '@radix-ui/react-use-controllable-state'
import { Primitive } from '@radix-ui/react-primitive'
import { useSize } from '@radix-ui/react-use-size'
import { Portal as PortalPrimitive } from '@radix-ui/react-portal'
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect'
import * as ArrowPrimitive from '@radix-ui/react-arrow'
import {
  useFloating,
  autoUpdate,
  offset,
  shift,
  limitShift,
  flip,
  size,
  hide,
  arrow as floatingUIarrow,
} from '@floating-ui/react'

import type { Placement, Middleware } from '@floating-ui/react'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

type Side = (typeof SIDE_OPTIONS)[number]
type Align = (typeof ALIGN_OPTIONS)[number]

/* -------------------------------------------------------------------------------------------------
 * Selection
 * -----------------------------------------------------------------------------------------------*/

type VirtualReference = {
  getBoundingClientRect(): DOMRect
}
type SelectionContextValue = {
  open: boolean
  onOpenChange(open: boolean): void
  whileSelect: boolean
  virtualRef: VirtualReference
  onVirtualRefChange(reference: VirtualReference): void
  trigger: HTMLDivElement | null
  onTriggerChange(trigger: HTMLDivElement | null): void
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
}
const Selection = (props: SelectionProps) => {
  const {
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    whileSelect = false,
    disabled = false,
  } = props
  const [virtualRef, setVirtualRef] = React.useState({
    getBoundingClientRect: () => DOMRect.fromRect(),
  })
  const [trigger, setTrigger] = React.useState<HTMLDivElement | null>(null)
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  })

  return (
    <SelectionProvider
      open={open}
      onOpenChange={setOpen}
      whileSelect={whileSelect}
      virtualRef={virtualRef}
      onVirtualRefChange={setVirtualRef}
      trigger={trigger}
      onTriggerChange={setTrigger}
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

type SelectionTriggerElement = React.ElementRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
interface SelectionTriggerProps extends PrimitiveDivProps {}

const SelectionTrigger = React.forwardRef<SelectionTriggerElement, SelectionTriggerProps>(
  (props, forwardedRef) => {
    const context = useSelectionContext(TRIGGER_NAME)
    const composedRefs = useComposedRefs(forwardedRef, (node) => context.onTriggerChange(node))

    return context.whileSelect ? (
      <SelectionTriggerWhileSelect {...props} ref={composedRefs} />
    ) : (
      <SelectionTriggerNonWhileSelect {...props} ref={composedRefs} />
    )
  },
)

SelectionTrigger.displayName = TRIGGER_NAME

/* ---------------------------------------------------------------------------------------------- */

type SelectionTriggerWhileSelectElement = SelectionTriggerElement
interface SelectionTriggerWhileSelectProps extends SelectionTriggerProps {}

const SelectionTriggerWhileSelect = React.forwardRef<
  SelectionTriggerWhileSelectElement,
  SelectionTriggerWhileSelectProps
>((props, forwardedRef) => {
  const context = useSelectionContext(TRIGGER_NAME)
  const ref = React.useRef<HTMLDivElement>(null)
  const pointerTypeRef = React.useRef('')
  const composedRefs = useComposedRefs(forwardedRef, ref)
  const { onOpenChange, onVirtualRefChange } = context

  React.useEffect(() => {
    if (!context.disabled) {
      const handleSelection = () => {
        if (pointerTypeRef.current !== 'mouse') return
        const selection = document.getSelection()
        if (!selection) return
        if (selection.isCollapsed) return onOpenChange(false)
        const trigger = ref.current
        const wasSelectionInsideTrigger = trigger?.contains(selection.anchorNode)
        if (!wasSelectionInsideTrigger) return
        const hasTextSelected = selection.toString().trim() !== ''
        if (hasTextSelected) {
          const range = selection.getRangeAt(0)
          onOpenChange(true)
          onVirtualRefChange({
            getBoundingClientRect: () => range.getBoundingClientRect(),
          })
        }
      }
      document.addEventListener('selectionchange', handleSelection)
      return () => document.removeEventListener('selectionchange', handleSelection)
    }
  }, [context.disabled, onOpenChange, onVirtualRefChange])

  return (
    <Primitive.div
      {...props}
      ref={composedRefs}
      onPointerDown={(event) => {
        props.onPointerDown?.(event)
        pointerTypeRef.current = event.pointerType
      }}
    />
  )
})

/* ---------------------------------------------------------------------------------------------- */

type SelectionTriggerNonWhileSelectElement = SelectionTriggerElement
interface SelectionTriggerNonWhileSelectProps extends SelectionTriggerProps {}

const SelectionTriggerNonWhileSelect = React.forwardRef<
  SelectionTriggerNonWhileSelectElement,
  SelectionTriggerNonWhileSelectProps
>((props, forwardedRef) => {
  const context = useSelectionContext(TRIGGER_NAME)
  const ref = React.useRef<HTMLDivElement>(null)
  const { onOpenChange, onVirtualRefChange } = context
  const composedRefs = useComposedRefs(forwardedRef, ref)

  React.useEffect(() => {
    if (!context.disabled) {
      const trigger = ref.current
      if (!trigger) return

      const handlePointerUp = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return
        setTimeout(() => {
          const selection = document.getSelection()
          if (!selection) return
          if (selection.isCollapsed) return onOpenChange(false)
          const trigger = ref.current
          const wasSelectionInsideTrigger = trigger?.contains(selection.anchorNode)
          if (!wasSelectionInsideTrigger) return
          const range = selection?.getRangeAt(0)
          if (range) {
            onOpenChange(true)
            onVirtualRefChange({
              getBoundingClientRect: () => range.getBoundingClientRect(),
            })
          }
        })
      }
      trigger.addEventListener('pointerup', handlePointerUp)
      return () => trigger.removeEventListener('pointerup', handlePointerUp)
    }
  }, [onOpenChange, onVirtualRefChange, context.disabled])

  return <Primitive.div {...props} ref={composedRefs} />
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
}

let originalBodyUserSelect: string
let originalTriggerUserSelect: string

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
    ...contentProps
  } = props
  const context = useSelectionContext(CONTENT_NAME)
  const { onOpenChange } = context

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
      anchorCssProperties(),
      offset({ mainAxis: sideOffset + arrowHeight, alignmentAxis: alignOffset }),
      avoidCollisions
        ? shift({
            mainAxis: true,
            crossAxis: false,
            limiter: sticky === 'partial' ? limitShift() : undefined,
            ...detectOverflowOptions,
          })
        : undefined,
      arrow ? floatingUIarrow({ element: arrow, padding: arrowPadding }) : undefined,
      avoidCollisions ? flip(detectOverflowOptions) : undefined,
      size(detectOverflowOptions),
      transformOrigin({ arrowWidth, arrowHeight }),
      hideWhenDetached ? hide({ strategy: 'referenceHidden' }) : undefined,
    ],
  })

  useLayoutEffect(() => {
    refs.setReference(context.virtualRef)
  }, [context.virtualRef, refs])

  React.useEffect(() => {
    if (!context.disabled) {
      const handlePointerDown = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return

        // Ensure to get latest selection
        setTimeout(() => {
          const selection = document.getSelection()
          if (selection?.isCollapsed) {
            onOpenChange(false)
          }
        })
      }
      document.addEventListener('pointerdown', handlePointerDown)
      return () => document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [context.disabled, onOpenChange])

  React.useEffect(() => {
    if (context.whileSelect && context.trigger) {
      const body = document.body
      const trigger = context.trigger

      originalBodyUserSelect = body.style.userSelect
      originalTriggerUserSelect = trigger.style.userSelect

      body.style.userSelect = 'none'
      trigger.style.userSelect = 'text'

      const handlePointerUp = () => {
        body.style.userSelect = originalBodyUserSelect
        trigger.style.userSelect = originalTriggerUserSelect
      }

      document.addEventListener('pointerup', handlePointerUp)

      return () => {
        body.style.userSelect = originalBodyUserSelect
        trigger.style.userSelect = originalTriggerUserSelect
        document.removeEventListener('pointerup', handlePointerUp)
      }
    }
  }, [context.whileSelect, context.trigger])

  const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement)

  const arrowX = middlewareData.arrow?.x
  const arrowY = middlewareData.arrow?.y
  const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0

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
        zIndex: contentProps.style?.zIndex,
      }}
    >
      <SelectionContentProvider
        placedSide={placedSide}
        onArrowChange={setArrow}
        arrowX={arrowX}
        arrowY={arrowY}
        shouldHideArrow={cannotCenterArrow}
      >
        <Primitive.div
          data-side={placedSide}
          data-align={placedAlign}
          data-state={context.open ? 'open' : 'closed'}
          {...contentProps}
          ref={forwardedRef}
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
interface SelectionArrowProps extends ArrowProps {}

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
  fn(data) {
    const { rects, elements } = data
    const { width, height } = rects.reference
    elements.floating.style.setProperty('--selection-popover-select-width', `${width}px`)
    elements.floating.style.setProperty('--selection-popover-select-height', `${height}px`)
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
