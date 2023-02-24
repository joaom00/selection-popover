import * as React from 'react'
import * as ToolbarPrimitive from '@radix-ui/react-toolbar'
import clsx from 'clsx'

import { Button } from '@/components'

export const Toolbar = ToolbarPrimitive.Root
export const ToolbarToggleGroup = ToolbarPrimitive.ToggleGroup

type ToolbarButtonElement = React.ComponentRef<typeof ToolbarPrimitive.Button>
type ToolbarButtonProps = React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Button>
export const ToolbarButton = React.forwardRef<ToolbarButtonElement, ToolbarButtonProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <ToolbarPrimitive.Button
        {...props}
        ref={forwardedRef}
        className={clsx(
          'h-6 px-1 rounded text-mauve11 hover:bg-violet3 hover:text-violet11 ml-0.5 first:ml-0 inline-flex items-center gap-1 text-sm',
          'focus:ring-2 focus:ring-violet7',
          className,
        )}
      />
    )
  },
)
ToolbarButton.displayName = 'ToolbarButton'

type ToolbarLinkElement = React.ElementRef<typeof ToolbarPrimitive.Link>
type ToolbarLinkProps = React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Link>
export const ToolbarLink = React.forwardRef<ToolbarLinkElement, ToolbarLinkProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <ToolbarPrimitive.Link
        {...props}
        ref={forwardedRef}
        className={clsx(
          'h-6 px-1 rounded text-mauve11 hover:bg-violet3 hover:text-violet11 ml-0.5 first:ml-0 inline-flex items-center gap-1 text-sm',
          'focus:ring-2 focus:ring-violet7',
          className,
        )}
      />
    )
  },
)
ToolbarLink.displayName = 'ToolbarLink'

type ToolbarToggleItemElement = React.ElementRef<typeof ToolbarPrimitive.ToggleItem>
type ToolbarToggleItemProps = React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.ToggleItem>
export const ToolbarToggleItem = React.forwardRef<ToolbarToggleItemElement, ToolbarToggleItemProps>(
  ({ className, children, ...props }, forwardedRef) => {
    return (
      <ToolbarPrimitive.ToggleItem asChild {...props} ref={forwardedRef}>
        <Button
          className={clsx(
            'ml-0.5 first:ml-0 h-6',
            'data-[state=on]:bg-violet5 data-[state=on]:text-violet11',
            className,
          )}
        >{children}</Button>
      </ToolbarPrimitive.ToggleItem>
    )
  },
)
ToolbarToggleItem.displayName = 'ToolbarToggleItem'

type ToolbarSeparatorProps = React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Separator>
export const ToolbarSeparator = ({ className, ...props }: ToolbarSeparatorProps) => {
  return (
    <ToolbarPrimitive.Separator
      {...props}
      className={clsx('bg-mauve6 w-px mx-2.5 h-full', className)}
    />
  )
}
