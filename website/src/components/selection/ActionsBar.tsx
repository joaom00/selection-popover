import * as Selection from 'selection-popover'
import { TwitterLogoIcon, GitHubLogoIcon, CopyIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'

import { Button, Tooltip } from '@/components'

export const SelectionActionsBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <Selection.Root>
      <Selection.Trigger asChild>{children}</Selection.Trigger>
      <Selection.Portal>
        <Selection.Content
          sideOffset={8}
          className={clsx(
            'flex items-center gap-1 w-full min-w-max rounded-md bg-white shadow-xl shadow-blackA6 px-2.5 h-10',
            'data-[state=open]:animate-slideDownAndFade data-[state=closed]:animate-slideUpAndFade',
          )}
        >
          <Tooltip content="Copy">
            <Button>
              <CopyIcon className="w-5 h-5" />
            </Button>
          </Tooltip>
          <Tooltip content="Share on Twitter">
            <Button asChild>
              <a href="https://twitter.com/joaom__00" target="_blank" rel="noreferrer noopener">
                <TwitterLogoIcon className="w-5 h-5" />
              </a>
            </Button>
          </Tooltip>
          <Tooltip content="Share on GitHub">
            <Button asChild>
              <a href="https://github.com/joaom00" target="_blank" rel="noreferrer noopener">
                <GitHubLogoIcon className="w-5 h-5" />
              </a>
            </Button>
          </Tooltip>
          <Selection.Arrow className="fill-white" />
        </Selection.Content>
      </Selection.Portal>
    </Selection.Root>
  )
}
