import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import clsx from 'clsx'

export const Tabs = TabsPrimitive.Root
export const TabsContent = TabsPrimitive.Content

type TabsListElement = React.ElementRef<typeof TabsPrimitive.List>
type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
export const TabsList = React.forwardRef<TabsListElement, TabsListProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <TabsPrimitive.List
        {...props}
        ref={forwardedRef}
        className={clsx('flex gap-1 pl-4', className)}
      />
    )
  },
)
TabsList.displayName = 'TabsList'

type TabsTriggerElement = React.ElementRef<typeof TabsPrimitive.Trigger>
type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
export const TabsTrigger = React.forwardRef<TabsTriggerElement, TabsTriggerProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <TabsPrimitive.Trigger
        {...props}
        ref={forwardedRef}
        className={clsx(
          'px-3 py-2 rounded-t-md relative border border-mauve6',
          'data-[state=active]:text-mauve12 data-[state=active]:bg-white data-[state=active]:border-b-white',
          'data-[state=inactive]:text-mauve11 data-[state=inactive]:bg-mauve2 data-[state=inactive]:hover:bg-white',
          className,
        )}
      />
    )
  },
)
TabsTrigger.displayName = 'TabsTrigger'
