import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

type ButtonElement = React.ElementRef<'button'>
type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  asChild?: boolean
}

export const Button = React.forwardRef<ButtonElement, ButtonProps>(
  ({ className, asChild = false, ...props }, forwardedRef) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        {...props}
        ref={forwardedRef}
        className={cn(
          'h-7 px-1 rounded text-mauve11 hover:bg-violet3 hover:text-violet11 inline-flex items-center justify-center gap-2 text-sm outline-none leading-none',
          'focus:ring-2 focus:ring-violet7',
          className,
        )}
      />
    )
  },
)
Button.displayName = 'Button'
