import * as React from 'react'
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect'
import { DEFAULT_PACKAGE_MANAGER, PACKAGE_MANAGERS } from '@/lib/constants'
import type { PackageManager } from '@/lib/constants'

const LOCAL_STORAGE_KEY = '@selection-popover/package-manager'

type PackageManagerPreferenceContextValue = {
  preferredPackageManager: PackageManager
  setPreferredPackageManager: (packageManager: PackageManager) => void
}

const PackageManagerPreferenceContext =
  React.createContext<PackageManagerPreferenceContextValue | null>(null)

const PackageManagerPreferenceProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [preferredPackageManager, setPreferredPackageManager] =
    React.useState<PackageManager>(DEFAULT_PACKAGE_MANAGER)

  const savePreferredPackageManager = React.useCallback((packageManager: unknown) => {
    if (isValidPackageManager(packageManager)) {
      setPreferredPackageManager(packageManager)
      setLocalStoragePackageManager(packageManager)
    } else {
      setPreferredPackageManager(DEFAULT_PACKAGE_MANAGER)
      setLocalStoragePackageManager(DEFAULT_PACKAGE_MANAGER)
    }
  }, [])

  useLayoutEffect(() => {
    const localStoragePackageManager = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    savePreferredPackageManager(localStoragePackageManager)
  }, [savePreferredPackageManager])

  const contextValue = React.useMemo(
    () => ({
      preferredPackageManager: preferredPackageManager,
      setPreferredPackageManager: savePreferredPackageManager,
    }),
    [preferredPackageManager, savePreferredPackageManager],
  )

  return (
    <PackageManagerPreferenceContext.Provider value={contextValue}>
      {children}
    </PackageManagerPreferenceContext.Provider>
  )
}

const usePackageManagerPreference = () => {
  const context = React.useContext(PackageManagerPreferenceContext)
  if (!context) {
    throw new TypeError(
      '`usePackageManagerPreference` must be called from within a `PackageManagerPreferenceProvider`.',
    )
  }
  const {
    preferredPackageManager: preferredCssLib,
    setPreferredPackageManager: setPreferredCssLib,
  } = context
  return [preferredCssLib, setPreferredCssLib] as const
}

function setLocalStoragePackageManager(packageManager: PackageManager) {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, packageManager)
}

const isValidPackageManager = (packageManager: unknown): packageManager is PackageManager =>
  PACKAGE_MANAGERS.includes(packageManager as PackageManager)

export { PackageManagerPreferenceProvider, usePackageManagerPreference, isValidPackageManager }
