// Validates src/data/menu.json and turns it into the dish objects the site
// uses. Dependency-free so it runs both in the browser and in vite.config.js,
// where it blocks any build (and so any Vercel deploy) with a broken menu.
//
// Dish fields in menu.json:
//   name         required, unique
//   description  optional
//   price        PKR. Required for dishes with a day; omit for specials.
//   category     starters | mains | desserts | drinks   (default: mains)
//   day          monday … sunday. Omit for an advance-order special
//                (shown without a price, with "Ask on WhatsApp").
//   image_url    optional, must start with https://
//   available    true/false (default true). false hides the dish.

export const CATEGORIES = ["starters", "mains", "desserts", "drinks"];

export const WEEKDAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];

const FIELDS = new Set([
    "name",
    "description",
    "price",
    "category",
    "day",
    "image_url",
    "available",
]);

export class MenuError extends Error {
    constructor(problems) {
        super(
            "src/data/menu.json has errors:\n" +
                problems.map((p) => `  - ${p}`).join("\n")
        );
        this.name = "MenuError";
        this.problems = problems;
    }
}

/** Stable id for a dish, used as the React key and the cart line id. */
export function dishId(name) {
    return name
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function checkDish(dish, label, problems) {
    if (dish === null || typeof dish !== "object" || Array.isArray(dish)) {
        problems.push(`${label}: must be an object`);
        return;
    }

    for (const key of Object.keys(dish)) {
        if (!FIELDS.has(key)) problems.push(`${label} -> ${key}: unknown field`);
    }

    const { name, description, price, category, day, image_url, available } = dish;

    if (typeof name !== "string" || !name.trim() || name.trim().length > 150) {
        problems.push(`${label} -> name: required, 1–150 characters`);
    } else if (!dishId(name)) {
        problems.push(`${label} -> name: must contain letters or numbers`);
    }
    if (description != null && typeof description !== "string") {
        problems.push(`${label} -> description: must be text`);
    }
    if (
        price != null &&
        (typeof price !== "number" ||
            !Number.isFinite(price) ||
            price <= 0 ||
            // At most 2 decimal places (tolerance absorbs float error, e.g. 19.99).
            Math.abs(price * 100 - Math.round(price * 100)) > 1e-6)
    ) {
        problems.push(`${label} -> price: must be a positive number of rupees`);
    }
    if (category != null && !CATEGORIES.includes(category)) {
        problems.push(`${label} -> category: must be one of ${CATEGORIES.join(", ")}`);
    }
    if (day != null && !WEEKDAYS.includes(day)) {
        problems.push(`${label} -> day: must be one of ${WEEKDAYS.join(", ")}`);
    }
    if (
        image_url != null &&
        (typeof image_url !== "string" || !image_url.startsWith("https://"))
    ) {
        problems.push(`${label} -> image_url: must start with https://`);
    }
    if (available != null && typeof available !== "boolean") {
        problems.push(`${label} -> available: must be true or false`);
    }
    if (day != null && price == null) {
        problems.push(`${label}: a dish with a day needs a price`);
    }
    if (day == null && price != null) {
        problems.push(
            `${label}: advance-order specials (no day) are priced on WhatsApp; ` +
                "remove the price or give the dish a day"
        );
    }
}

/**
 * Validate the parsed menu.json and return the available dishes, sorted by
 * name, in the shape the site uses:
 * { id, name, description, price, category, day_of_week, image_url }.
 * Throws MenuError listing every problem found.
 */
export function validateMenu(raw) {
    const problems = [];

    if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
        throw new MenuError(['the file must be an object like { "dishes": [ … ] }']);
    }
    for (const key of Object.keys(raw)) {
        if (key !== "dishes") problems.push(`${key}: unknown top-level field`);
    }
    if (!Array.isArray(raw.dishes)) {
        throw new MenuError([...problems, "dishes: must be a list"]);
    }

    const seenIds = new Map();
    raw.dishes.forEach((dish, index) => {
        const named = dish && typeof dish.name === "string" ? ` "${dish.name}"` : "";
        const label = `dish #${index + 1}${named}`;
        checkDish(dish, label, problems);

        if (dish && typeof dish.name === "string" && dishId(dish.name)) {
            const id = dishId(dish.name);
            if (seenIds.has(id)) {
                problems.push(`${label}: duplicate of dish #${seenIds.get(id) + 1}`);
            } else {
                seenIds.set(id, index);
            }
        }
    });

    if (problems.length) throw new MenuError(problems);

    return raw.dishes
        .filter((dish) => dish.available !== false)
        .map((dish) => ({
            id: dishId(dish.name),
            name: dish.name.trim(),
            description: dish.description?.trim() || null,
            price: dish.price ?? null,
            category: dish.category ?? "mains",
            day_of_week: dish.day ?? null,
            image_url: dish.image_url ?? null,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
}
