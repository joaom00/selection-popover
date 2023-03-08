import React from 'react'
import * as Selection from 'selection-popover'
import * as ToolbarPrimitive from '@radix-ui/react-toolbar'
import { FontBoldIcon, FontItalicIcon, StrikethroughIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'

import {
  Toolbar,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components'

type SelectionTextToolbarElement = React.ElementRef<typeof Selection.Trigger>
type SelectionTextToolbarProps = {
  children: React.ReactNode
}
export const SelectionTextToolbar = React.forwardRef<
  SelectionTextToolbarElement,
  SelectionTextToolbarProps
>(({ children }, forwardedRef) => {
  return (
    <Selection.Root whileSelect>
      <Selection.Trigger ref={forwardedRef} asChild>
        {children}
      </Selection.Trigger>
      <Selection.Portal>
        <Selection.Content
          asChild
          sideOffset={8}
          className={clsx(
            'flex items-center w-full min-w-max rounded-md bg-white shadow-xl shadow-blackA6 px-2.5 h-10',
            'data-[state=open]:animate-slideDownAndFade data-[state=closed]:animate-slideUpAndFade',
          )}
        >
          <Toolbar>
            <Select defaultValue={textItems[0]}>
              <ToolbarPrimitive.Button asChild>
                <SelectTrigger />
              </ToolbarPrimitive.Button>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Turn into</SelectLabel>
                  {textItems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <ToolbarSeparator />
            <Select defaultValue={colorItems[0]}>
              <ToolbarPrimitive.Button asChild>
                <SelectTrigger />
              </ToolbarPrimitive.Button>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Color</SelectLabel>
                  {colorItems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <ToolbarSeparator />
            <ToolbarToggleGroup type="multiple">
              <ToolbarToggleItem value="bold">
                <FontBoldIcon />
              </ToolbarToggleItem>
              <ToolbarToggleItem value="italic">
                <FontItalicIcon />
              </ToolbarToggleItem>
              <ToolbarToggleItem value="strike-through">
                <StrikethroughIcon />
              </ToolbarToggleItem>
            </ToolbarToggleGroup>
          </Toolbar>
        </Selection.Content>
      </Selection.Portal>
    </Selection.Root>
  )
})
SelectionTextToolbar.displayName = 'SelectionTextToolbar'

const textItems = [
  'Text',
  'Heading 1',
  'Heading 2',
  'Heading 3',
  'Page',
  'To-do list',
  'Bulleted list',
  'Numbered list',
  'Toggle list',
  'Code',
  'Quote',
  'Callout',
  'Block equation',
]

const colorItems = ['Gray', 'Brown', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink', 'Red']
