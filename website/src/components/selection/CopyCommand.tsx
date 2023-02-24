import * as React from 'react'
import * as Selection from 'selection-popover'
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import { PACKAGE_MANAGERS_COMMAND, PACKAGE_MANAGERS } from '@/lib/constants'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  Button,
} from '@/components'
import {
  isValidPackageManager,
  usePackageManagerPreference,
} from '@/components/PackageManagerPreference'

import type { PackageManager } from '@/lib/constants'

export const SelectionCopyCommand = ({ children }: { children: React.ReactNode }) => {
  const [copied, setCopied] = React.useState(false)
  const [packageManager, setPackageManager] = usePackageManagerPreference()
  const [value, setValue] = React.useState<PackageManager>(packageManager)
  const [open, setOpen] = React.useState(false)

  const handleValueChange = (value: string) => {
    if (isValidPackageManager(value)) {
      handleCopy(value)
      setValue(value)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) setPackageManager(value)
    setOpen(open)
  }

  const handleCopy = async (value: PackageManager = packageManager) => {
    await navigator.clipboard.writeText(PACKAGE_MANAGERS_COMMAND[value])
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Selection.Root open={open} onOpenChange={handleOpenChange}>
      <Selection.Trigger asChild>{children}</Selection.Trigger>
      <Selection.Portal>
        <Selection.Content
          sideOffset={8}
          className={clsx(
            'flex items-center w-full min-w-max rounded-md bg-white shadow-xl shadow-blackA6 px-2.5 h-10',
            'data-[state=open]:animate-slideDownAndFade data-[state=closed]:animate-slideUpAndFade',
          )}
        >
          <Select defaultValue={packageManager} onValueChange={handleValueChange}>
            <SelectTrigger />
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Install with</SelectLabel>
                {PACKAGE_MANAGERS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={() => handleCopy()}>
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Selection.Arrow className="fill-white" />
        </Selection.Content>
      </Selection.Portal>
    </Selection.Root>
  )
}
