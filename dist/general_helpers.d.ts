import 'electron';
import { ElectronApplication } from 'playwright';
import { PageFunctionOn } from 'playwright/node_modules/playwright-core/types/structs';
/**
 * Wait for a function to evaluate to true in the main Electron process. This really
 * should be part of the Playwright API, but it's not.
 *
 * This function is to `electronApp.evaluate()`
 * as `page.waitForFunction()` is `page.evaluate()`.
 *
 * @param electronApp {ElectronApplication} - the Playwright ElectronApplication
 * @param fn {Function} - the function to evaluate in the main process - must return a boolean
 * @param arg {Any} optional - an argument to pass to the function
 * @returns {Promise<void>}
 * @fulfil {void} Resolves when the function returns true
 */
export declare function electronWaitForFunction<R, Arg>(electronApp: ElectronApplication, fn: PageFunctionOn<typeof Electron.CrossProcessExports, Arg, R>, arg?: Arg): Promise<void>;
//# sourceMappingURL=general_helpers.d.ts.map