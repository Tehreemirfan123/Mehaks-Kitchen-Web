import { BUSINESS } from "../config";

export const DAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];

/** Weekday key ("monday" …) in the kitchen's timezone. */
export function todayKey(date = new Date(), timeZone = BUSINESS.timeZone) {
    return date
        .toLocaleDateString("en-US", { weekday: "long", timeZone })
        .toLowerCase();
}

/** Advance-order specials have no fixed day and no listed price. */
export function isSpecial(item) {
    return !item.day_of_week;
}

export function isOrderableToday(item, today) {
    return item.day_of_week === today && item.price != null;
}

/** Split the menu into { byDay: { monday: [...] , ... }, specials: [...] }. */
export function groupMenu(menu) {
    const byDay = Object.fromEntries(DAYS.map((d) => [d, []]));
    const specials = [];
    for (const item of menu) {
        if (isSpecial(item)) specials.push(item);
        else byDay[item.day_of_week]?.push(item);
    }
    return { byDay, specials };
}

/** Most of one dish a single cart line can hold. */
export const MAX_QUANTITY = 50;

/**
 * Keep only well-formed lines from a cart read out of browser storage, so a
 * corrupted or hand-edited value can't break the page.
 */
export function sanitizeCart(raw) {
    if (!Array.isArray(raw)) return [];
    return raw
        .filter(
            (line) =>
                line &&
                typeof line.id === "string" &&
                typeof line.name === "string" &&
                Number.isFinite(line.price) &&
                line.price > 0 &&
                Number.isInteger(line.quantity) &&
                line.quantity > 0
        )
        .map((line) => ({
            id: line.id,
            name: line.name.slice(0, 150),
            price: line.price,
            quantity: Math.min(line.quantity, MAX_QUANTITY),
        }));
}

/**
 * Bring a saved cart in line with the live menu: refresh names/prices and
 * drop anything that's no longer on the menu or not orderable today (e.g. a
 * cart left over from yesterday).
 */
export function reconcileCart(items, menu, today) {
    const byId = new Map(menu.map((m) => [m.id, m]));
    const kept = [];
    const removed = [];
    let changed = false;

    for (const line of items) {
        const dish = byId.get(line.id);
        if (!dish || !isOrderableToday(dish, today)) {
            removed.push(line.name);
            changed = true;
            continue;
        }
        if (dish.name !== line.name || dish.price !== line.price) {
            changed = true;
        }
        kept.push({ ...line, name: dish.name, price: dish.price });
    }

    return { kept, removed, changed };
}
