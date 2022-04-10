import type { ElectronApplication } from 'playwright';
/**
 * Execute the `.click()` method on the element with the given id.
 *
 * @category Menu
 *
 * @param electronApp {ElectronApplication} - the Electron application object (from Playwright)
 * @param id {string} - the id of the MenuItem to click
 * @returns {Promise<void>}
 * @fulfil {void} resolves with the result of the `click()` method - probably `undefined`
 */
export declare function clickMenuItemById(electronApp: ElectronApplication, id: string): Promise<unknown>;
/**
 * Get a given attribute the MenuItem with the given id.
 *
 * @category Menu
 *
 * @param electronApp {ElectronApplication} - the Electron application object (from Playwright)
 * @param menuId {string} - the id of the MenuItem to retrieve the attribute from
 * @param attribute {string} - the attribute to retrieve
 * @returns {Promise<string>}
 * @fulfil {string} resolves with the attribute value
 */
export declare function getMenuItemAttribute<T extends keyof Electron.MenuItem>(electronApp: ElectronApplication, menuId: string, attribute: T): Promise<Electron.MenuItem[T]>;
declare type PickByType<T, Value> = {
    [P in keyof T as T[P] extends Value | undefined ? P : never]: T[P];
};
/** Limit to just primitive MenuItem attributes */
declare type MenuItemPrimitive = PickByType<Electron.MenuItem, string | number | boolean>;
/**
 * A MenuItemConstructorOptions-like Electron MenuItem
 * containing only primitive and null values
 */
export declare type MenuItemPartial = MenuItemPrimitive & {
    submenu?: MenuItemPartial[];
};
/**
 * Get information about the MenuItem with the given id
 *
 * @category Menu
 *
 * @param electronApp {ElectronApplication} - the Electron application object (from Playwright)
 * @param menuId {string} - the id of the MenuItem to retrieve
 * @returns {Promise<MenuItemPartial>}
 * @fulfil {MenuItemPartial} the MenuItem with the given id
 */
export declare function getMenuItemById(electronApp: ElectronApplication, menuId: string): Promise<MenuItemPartial>;
/**
 * Get the current state of the application menu. Contains only primitive values and submenus..
 * Very similar to menu
 * [construction template structure](https://www.electronjs.org/docs/latest/api/menu#examples)
 * in Electron.
 *
 * @category Menu
 *
 * @param electronApp {ElectronApplication} - the Electron application object (from Playwright)
 * @returns {Promise<MenuItemPartial[]>}
 * @fulfil {MenuItemPartial[]} an array of MenuItem-like objects
 */
export declare function getApplicationMenu(electronApp: ElectronApplication): Promise<MenuItemPartial[]>;
/**
 * Find a MenuItem by any of its properties
 *
 * @category Menu
 *
 * @param electronApp {ElectronApplication} - the Electron application object (from Playwright)
 * @param property {string} - the property to search for
 * @param value {string} - the value to search for
 * @param menuItems {MenuItemPartial | MenuItemPartial[]} optional - single MenuItem or array - if not provided, will be retrieved from the application menu
 * @returns {Promise<MenuItemPartial>}
 * @fulfil {MenuItemPartial} the first MenuItem with the given property and value
 */
export declare function findMenuItem<P extends keyof MenuItemPartial>(electronApp: ElectronApplication, property: P, value: MenuItemPartial[P], menuItems?: MenuItemPartial | MenuItemPartial[]): Promise<MenuItemPartial | undefined>;
/**
 * Wait for a MenuItem to exist
 *
 * @category Menu
 *
 * @param electronApp {ElectronApplication} - the Electron application object (from Playwright)
 * @param id {string} - the id of the MenuItem to wait for
 * @returns {Promise<void>}
 * @fulfil {void} resolves when the MenuItem is found
 */
export declare function waitForMenuItem(electronApp: ElectronApplication, id: string): Promise<void>;
/**
 * Wait for a MenuItem to have a specific attribute value.
 * For example, wait for a MenuItem to be enabled... or be visible.. etc
 *
 * @category Menu
 *
 * @param electronApp {ElectronApplication} - the Electron application object (from Playwright)
 * @param id {string} - the id of the MenuItem to wait for
 * @param property {string} - the property to search for
 * @param value {string | number | boolean} - the value to search for
 * @returns {Promise<void>}
 * @fulfil {void} resolves when the MenuItem with correct status is found
 */
export declare function waitForMenuItemStatus<P extends keyof Electron.MenuItem>(electronApp: ElectronApplication, id: string, property: P, value: Electron.MenuItem[P]): Promise<void>;
export {};
//# sourceMappingURL=menu_helpers.d.ts.map