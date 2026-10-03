import rawMenu from "./menu.json";
import { validateMenu } from "./validateMenu";

/**
 * Every dish currently on the menu, built into the site from menu.json.
 * To change the menu, edit menu.json and deploy — see README.
 */
export const MENU = validateMenu(rawMenu);
