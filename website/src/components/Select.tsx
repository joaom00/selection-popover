import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { clsx } from 'clsx'

import { Button } from '@/components'

const SelectGroup = SelectPrimitive.Group

type SelectRootProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>
const Select = ({ children, ...props }: SelectRootProps) => {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      event.preventDefault()
    }
    if (open) {
      document.addEventListener('pointerdown', handlePointerDown)
    } else {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  return (
    <SelectPrimitive.Root open={open} onOpenChange={setOpen} {...props}>
      {children}
    </SelectPrimitive.Root>
  )
}

type SelectTriggerElement = React.ElementRef<typeof SelectPrimitive.Trigger>
type SelectTriggerProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
const SelectTrigger = React.forwardRef<SelectTriggerElement, SelectTriggerProps>(
  (props, forwardedRef) => {
    const { placeholder, className, ...triggerProps } = props
    return (
      <SelectPrimitive.Trigger asChild>
        <Button
          {...triggerProps}
          ref={forwardedRef}
          className={clsx(
            'bg-white text-violet11 hover:bg-mauve3 px-3',
            'focus:ring-black focus:ring-inset',
            className,
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon className="text-mauve11">
            <ChevronDownIcon />
          </SelectPrimitive.Icon>
        </Button>
      </SelectPrimitive.Trigger>
    )
  },
)
SelectTrigger.displayName = 'SelectTrigger'

type SelectContentElement = React.ElementRef<typeof SelectPrimitive.Content>
type SelectContentProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
const SelectContent = React.forwardRef<SelectContentElement, SelectContentProps>(
  (props, forwardedRef) => {
    const { children, ...contentProps } = props
    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          {...contentProps}
          ref={forwardedRef}
          className="overflow-hidden bg-white rounded-md shadow-2xl"
        >
          <SelectPrimitive.ScrollUpButton className="flex items-center justify-center h-6 bg-mauve1 text-mauve11">
            <ChevronUpIcon />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="flex items-center justify-center h-6 bg-mauve1 text-mauve11">
            <ChevronDownIcon />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    )
  },
)
SelectContent.displayName = 'SelectContent'

type SelectLabelElement = React.ElementRef<typeof SelectPrimitive.Label>
type SelectLabelProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
const SelectLabel = React.forwardRef<SelectLabelElement, SelectLabelProps>(
  (props, forwardedRef) => {
    return (
      <SelectPrimitive.Label
        {...props}
        ref={forwardedRef}
        className="px-6 text-xs leading-6 text-mauve11"
      />
    )
  },
)
SelectLabel.displayName = 'SelectLabel'

type ItemRef = React.ComponentRef<typeof SelectPrimitive.Item>
type ItemProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
const SelectItem = React.forwardRef<ItemRef, ItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <SelectPrimitive.Item
        className={clsx(
          'text-sm leading-none text-violet11 rounded-sm flex gap-1.5 items-center h-7 pr-9 pl-6 relative select-none outline-none',
          'data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1',
          'data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none',
        )}
        {...props}
        ref={forwardedRef}
      >
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
          <CheckIcon />
        </SelectPrimitive.ItemIndicator>
      </SelectPrimitive.Item>
    )
  },
)
SelectItem.displayName = 'SelectItem'

export { Select, SelectTrigger, SelectContent, SelectItem, SelectGroup, SelectLabel }
