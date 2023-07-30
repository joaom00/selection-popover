import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { clsx } from 'clsx'

import { Button } from '@/components'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group

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
            'text-violet11 hover:bg-mauve3 bg-white px-3',
            'focus:ring-inset focus:ring-black',
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
          className="overflow-hidden rounded-md bg-white shadow-2xl"
        >
          <SelectPrimitive.ScrollUpButton className="bg-mauve1 text-mauve11 flex h-6 items-center justify-center">
            <ChevronUpIcon />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="bg-mauve1 text-mauve11 flex h-6 items-center justify-center">
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
        className="text-mauve11 px-6 text-xs leading-6"
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
          'text-violet11 relative flex h-7 select-none items-center gap-1.5 rounded-sm pr-9 pl-6 text-sm leading-none outline-none',
          'data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1',
          'data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none',
        )}
        {...props}
        ref={forwardedRef}
      >
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator className="absolute left-0 inline-flex w-6 items-center justify-center">
          <CheckIcon />
        </SelectPrimitive.ItemIndicator>
      </SelectPrimitive.Item>
    )
  },
)
SelectItem.displayName = 'SelectItem'

export { Select, SelectTrigger, SelectContent, SelectItem, SelectGroup, SelectLabel }
