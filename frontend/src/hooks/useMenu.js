import { MENU } from "../data/menu";

/** { menu } — the dishes built into the site from src/data/menu.json. */
export function useMenu() {
    return { menu: MENU };
}
