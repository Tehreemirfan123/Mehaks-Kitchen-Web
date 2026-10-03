import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { MenuError, WEEKDAYS, dishId, validateMenu } from "./validateMenu";

const shipped = JSON.parse(
    readFileSync(new URL("./menu.json", import.meta.url), "utf-8")
);

function problemsOf(raw) {
    try {
        validateMenu(raw);
    } catch (err) {
        expect(err).toBeInstanceOf(MenuError);
        return err.problems;
    }
    throw new Error("expected the menu to be rejected");
}

describe("the shipped menu.json", () => {
    it("is valid, covers every weekday and has an advance-order special", () => {
        const menu = validateMenu(shipped);
        expect(new Set(menu.map((d) => d.day_of_week).filter(Boolean))).toEqual(
            new Set(WEEKDAYS)
        );
        expect(menu.some((d) => d.day_of_week === null && d.price === null)).toBe(true);
    });
});

describe("validateMenu", () => {
    it("normalises dishes into the shape the site uses, sorted by name", () => {
        const menu = validateMenu({
            dishes: [
                { name: "Chicken Nihari", price: 260, day: "saturday" },
                {
                    name: "Ghoota Daal (Chicken)",
                    description: "  With chawal ",
                    price: 270,
                    day: "monday",
                    category: "mains",
                    image_url: "https://example.com/daal.jpg",
                },
                { name: "Hidden", price: 100, day: "monday", available: false },
            ],
        });
        expect(menu).toEqual([
            {
                id: "chicken-nihari",
                name: "Chicken Nihari",
                description: null,
                price: 260,
                category: "mains",
                day_of_week: "saturday",
                image_url: null,
            },
            {
                id: "ghoota-daal-chicken",
                name: "Ghoota Daal (Chicken)",
                description: "With chawal",
                price: 270,
                category: "mains",
                day_of_week: "monday",
                image_url: "https://example.com/daal.jpg",
            },
        ]);
    });

    it("requires a price for dishes with a day, and none for specials", () => {
        expect(problemsOf({ dishes: [{ name: "Karri Pakora", day: "thursday" }] })).toEqual([
            'dish #1 "Karri Pakora": a dish with a day needs a price',
        ]);
        expect(problemsOf({ dishes: [{ name: "Mutton Kunna", price: 700 }] })[0]).toMatch(
            /priced on WhatsApp/
        );
    });

    it("rejects typos, bad values and duplicates, listing every problem", () => {
        const problems = problemsOf({
            dishes: [
                { name: "Nihari", prcie: 260, day: "saturday" },
                { name: "Biryani", price: -5, day: "someday" },
                { name: "Pilao", price: 300, day: "friday", image_url: "http://x" },
                { name: "nihari!", price: 260, day: "sunday" },
                { name: "Kheer", price: 19.999, day: "monday", category: "sweets" },
            ],
        });
        expect(problems).toEqual(
            expect.arrayContaining([
                'dish #1 "Nihari" -> prcie: unknown field',
                'dish #2 "Biryani" -> price: must be a positive number of rupees',
                expect.stringMatching(/^dish #2 "Biryani" -> day: must be one of/),
                'dish #3 "Pilao" -> image_url: must start with https://',
                'dish #4 "nihari!": duplicate of dish #1',
                'dish #5 "Kheer" -> price: must be a positive number of rupees',
                expect.stringMatching(/^dish #5 "Kheer" -> category: must be one of/),
            ])
        );
    });

    it("accepts prices with up to two decimals", () => {
        expect(validateMenu({ dishes: [{ name: "Chai", price: 19.99, day: "monday" }] })[0].price).toBe(19.99);
    });

    it("rejects a malformed file", () => {
        expect(problemsOf([])).toEqual(['the file must be an object like { "dishes": [ … ] }']);
        expect(problemsOf({ dishes: "none" })).toEqual(["dishes: must be a list"]);
        expect(problemsOf({ dishes: [], extra: 1 })).toEqual([
            "extra: unknown top-level field",
        ]);
    });
});

describe("dishId", () => {
    it("is a stable, URL-safe slug of the name", () => {
        expect(dishId("Sabzi / Daal")).toBe("sabzi-daal");
        expect(dishId("Ghoota Daal (Chicken)")).toBe("ghoota-daal-chicken");
    });
});
