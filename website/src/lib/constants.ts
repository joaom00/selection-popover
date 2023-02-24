
const DEFAULT_PACKAGE_MANAGER = 'npm';
const PACKAGE_MANAGERS = [DEFAULT_PACKAGE_MANAGER, 'yarn', 'pnpm'] as const;

type PackageManager = typeof PACKAGE_MANAGERS[number];

const PACKAGE_MANAGERS_COMMAND: Record<PackageManager, string> = {
  npm: 'npm install selection-popover',
  yarn: 'yarn add selection-popover',
  pnpm: 'pnpm add selection-popover',
};

export { DEFAULT_PACKAGE_MANAGER, PACKAGE_MANAGERS, PACKAGE_MANAGERS_COMMAND };
export type { PackageManager };
