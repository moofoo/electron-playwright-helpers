import { ElectronApplication, Page } from 'playwright';
/**
 * Send an `ipcRenderer.send()` (to main process) from a given window.
 *
 * Note: nodeIntegration must be true and contextIsolation must be false
 * in the webPreferences for this BrowserWindow.
 *
 * @category IPCRenderer
 *
 * @param page {Page} the Playwright Page to send the ipcRenderer.send() from
 * @param channel {string} the channel to send the ipcRenderer.send() to
 * @param args {...unknown} one or more arguments to send to the `ipcRenderer.send()`
 * @returns {Promise<unknown>}
 * @fulfil {unknown} resolves with the result of `ipcRenderer.send()`
 */
export declare function ipcRendererSend(window: Page, channel: string, ...args: unknown[]): Promise<unknown>;
/**
 * Send an ipcRenderer.invoke() from a given window.
 *
 * Note: nodeIntegration must be true and contextIsolation must be false
 * in the webPreferences for this window
 *
 * @category IPCRenderer
 *
 * @param page {Page} the Playwright Page to send the ipcRenderer.invoke() from
 * @param message {string} the channel to send the ipcRenderer.invoke() to
 * @param args {...unknown} one or more arguments to send to the ipcRenderer.invoke()
 * @returns {Promise<unknown>}
 * @fulfil {unknown} resolves with the result of ipcRenderer.invoke()
 */
export declare function ipcRendererInvoke(window: Page, message: string, ...args: unknown[]): Promise<unknown>;
/**
 * Call just the first listener for a given ipcRenderer channel in a given window.
 * *UNLIKE MOST Electron ipcRenderer listeners*, this function SHOULD return a value.
 *
 * This function does not send data between main and renderer processes.
 * It simply retrieves data from the renderer process.
 *
 * Note: nodeIntegration must be true for this BrowserWindow.
 *
 * @category IPCRenderer
 *
 * @param window {Page} The Playwright Page to with the `ipcRenderer.on()` listener
 * @param message {string} The channel to call the first listener for
 * @param args {...unknown} optional - One or more arguments to send to the ipcRenderer.on() listener
 * @returns {Promise<unknown>}
 * @fulfil {unknown} the result of the first `ipcRenderer.on()` listener
 */
export declare function ipcRendererCallFirstListener(window: Page, message: string, ...args: unknown[]): Promise<unknown>;
/**
 * Emit an IPC event to a given window.
 * This will trigger all ipcRenderer listeners for the event.
 *
 * This does not transfer data between main and renderer processes.
 * It simply emits an event in the renderer process.
 *
 * Note: nodeIntegration must be true for this window
 *
 * @category IPCRenderer
 *
 * @param window {Page} - the Playwright Page to with the ipcRenderer.on() listener
 * @param message {string} - the channel to call all ipcRenderer listeners for
 * @param args {...unknown} optional - one or more arguments to send
 * @returns {Promise<boolean>}
 * @fulfil {boolean} true if the event was emitted
 * @reject {Error} if there are no ipcRenderer listeners for the event
 */
export declare function ipcRendererEmit(window: Page, message: string, ...args: unknown[]): Promise<boolean>;
/**
 * Emit an ipcMain message from the main process.
 * This will trigger all ipcMain listeners for the event.
 *
 * This does not transfer data between main and renderer processes.
 * It simply emits an event in the main process.
 *
 * @category IPCMain
 *
 * @param electronApp {ElectronApplication} - the ElectronApplication object from Playwright
 * @param message {string} - the channel to call all ipcMain listeners for
 * @param args {...unknown} - one or more arguments to send
 * @returns {Promise<boolean>}
 * @fulfil {boolean} true if there were listeners for this message
 * @reject {Error} if there are no ipcMain listeners for the event
 */
export declare function ipcMainEmit(electronApp: ElectronApplication, message: string, ...args: unknown[]): Promise<boolean>;
/**
 * Call the first listener for a given ipcMain message in the main process
 * and return its result.
 *
 * NOTE: ipcMain listeners usually don't return a value, but we're using
 * this to retrieve test data from the main process.
 *
 * Generally, it's probably better to use `ipcMainInvokeHandler()` instead.
 *
 * @category IPCMain
 *
 * @param electronApp {ElectronApplication} - the ElectronApplication object from Playwright
 * @param message {string} - the channel to call the first listener for
 * @param args {...unknown} - one or more arguments to send
 * @returns {Promise<unknown>}
 * @fulfil {unknown} resolves with the result of the function
 * @reject {Error} if there are no ipcMain listeners for the event
 */
export declare function ipcMainCallFirstListener(electronApp: ElectronApplication, message: string, ...args: unknown[]): Promise<unknown>;
/**
 * Get the return value of an `ipcMain.handle()` function
 *
 * @category IPCMain
 *
 * @param electronApp {ElectronApplication} - the ElectronApplication object from Playwright
 * @param message {string} - the channel to call the first listener for
 * @param args {...unknown} - one or more arguments to send
 * @returns {Promise<unknown>}
 * @fulfil {unknown} resolves with the result of the function called in main process
 */
export declare function ipcMainInvokeHandler(electronApp: ElectronApplication, message: string, ...args: unknown[]): Promise<void>;
//# sourceMappingURL=ipc_helpers.d.ts.map