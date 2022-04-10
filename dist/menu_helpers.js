"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForMenuItemStatus = exports.waitForMenuItem = exports.findMenuItem = exports.getApplicationMenu = exports.getMenuItemById = exports.getMenuItemAttribute = exports.clickMenuItemById = void 0;
const general_helpers_1 = require("./general_helpers");
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
function clickMenuItemById(electronApp, id) {
    return electronApp.evaluate(({ Menu }, menuId) => {
        const menu = Menu.getApplicationMenu();
        if (!menu) {
            throw new Error('No application menu found');
        }
        const menuItem = menu.getMenuItemById(menuId);
        if (menuItem) {
            return menuItem.click();
        }
        else {
            throw new Error(`Menu item with id ${menuId} not found`);
        }
    }, id);
}
exports.clickMenuItemById = clickMenuItemById;
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
function getMenuItemAttribute(electronApp, menuId, attribute) {
    const attr = attribute;
    const resultPromise = electronApp.evaluate(({ Menu }, { menuId, attr }) => {
        const menu = Menu.getApplicationMenu();
        if (!menu) {
            throw new Error('No application menu found');
        }
        const menuItem = menu.getMenuItemById(menuId);
        if (!menuItem) {
            throw new Error(`Menu item with id "${menuId}" not found`);
        }
        else if (menuItem[attr] === undefined) {
            throw new Error(`Menu item with id "${menuId}" has no attribute "${attr}"`);
        }
        else {
            return menuItem[attr];
        }
    }, { menuId, attr });
    return resultPromise;
}
exports.getMenuItemAttribute = getMenuItemAttribute;
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
function getMenuItemById(electronApp, menuId) {
    return electronApp.evaluate(({ Menu }, { menuId }) => {
        // we need this function to be in scope
        function cleanMenuItem(menuItem) {
            const returnValue = {};
            Object.entries(menuItem).forEach(([key, value]) => {
                // if value is a primitive
                if (typeof value === 'string' ||
                    typeof value === 'number' ||
                    typeof value === 'boolean' ||
                    value === null) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    returnValue[key] = value;
                }
            });
            if (menuItem.type === 'submenu' && menuItem.submenu) {
                returnValue['submenu'] = menuItem.submenu.items.map(cleanMenuItem);
            }
            return returnValue;
        }
        const menu = Menu.getApplicationMenu();
        if (!menu) {
            throw new Error('No application menu found');
        }
        const menuItem = menu.getMenuItemById(menuId);
        if (menuItem) {
            return cleanMenuItem(menuItem);
        }
        else {
            throw new Error(`Menu item with id ${menuId} not found`);
        }
    }, { menuId });
}
exports.getMenuItemById = getMenuItemById;
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
function getApplicationMenu(electronApp) {
    const promise = electronApp.evaluate(({ Menu }) => {
        // we need this function to be in scope
        function cleanMenuItem(menuItem) {
            const returnValue = {};
            Object.entries(menuItem).forEach(([key, value]) => {
                // if value is a primitive
                if (typeof value === 'string' ||
                    typeof value === 'number' ||
                    typeof value === 'boolean' ||
                    value === null) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore - we know it's a primitive
                    returnValue[key] = value;
                }
            });
            if (menuItem.type === 'submenu' && menuItem.submenu) {
                returnValue['submenu'] = menuItem.submenu.items.map(cleanMenuItem);
            }
            return returnValue;
        }
        const menu = Menu.getApplicationMenu();
        if (!menu) {
            throw new Error('No application menu found');
        }
        const cleanItems = menu.items.map(cleanMenuItem);
        return cleanItems;
    });
    return promise;
}
exports.getApplicationMenu = getApplicationMenu;
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
async function findMenuItem(electronApp, property, value, menuItems) {
    if (!menuItems) {
        const menu = await getApplicationMenu(electronApp);
        return findMenuItem(electronApp, property, value, menu);
    }
    if (Array.isArray(menuItems)) {
        for (const menuItem of menuItems) {
            const found = await findMenuItem(electronApp, property, value, menuItem);
            if (found) {
                return found;
            }
        }
    }
    else {
        if (menuItems[property] === value) {
            return menuItems;
        }
        else if (menuItems.submenu) {
            return findMenuItem(electronApp, property, value, menuItems.submenu);
        }
    }
}
exports.findMenuItem = findMenuItem;
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
async function waitForMenuItem(electronApp, id) {
    await (0, general_helpers_1.electronWaitForFunction)(electronApp, ({ Menu }, id) => {
        const menu = Menu.getApplicationMenu();
        if (!menu) {
            throw new Error('No application menu found');
        }
        return !!menu.getMenuItemById(id);
    }, id);
}
exports.waitForMenuItem = waitForMenuItem;
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
async function waitForMenuItemStatus(electronApp, id, property, value) {
    await (0, general_helpers_1.electronWaitForFunction)(electronApp, ({ Menu }, { id, value, property }) => {
        const menu = Menu.getApplicationMenu();
        if (!menu) {
            throw new Error('No application menu found');
        }
        const menuItem = menu.getMenuItemById(id);
        if (!menuItem) {
            throw new Error(`Menu item with id "${id}" not found`);
        }
        return menuItem[property] === value;
    }, { id, value, property });
}
exports.waitForMenuItemStatus = waitForMenuItemStatus;
//# sourceMappingURL=menu_helpers.js.map