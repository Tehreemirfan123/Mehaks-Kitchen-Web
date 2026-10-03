import { describe, expect, it } from "vitest";

import {
    MAX_QUANTITY,
    groupMenu,
    isOrderableToday,
    reconcileCart,
    sanitizeCart,
    todayKey,
} from "./menu";

describe("sanitizeCart", () => {
    it("keeps well-formed lines and caps quantities", () => {
        const good = { id: "a", name: "Biryani", price: 320, quantity: 2 };
        expect(sanitizeCart([good])).toEqual([good]);
        expect(sanitizeCart([{ ...good, quantity: 9999 }])[0].quantity).toBe(
            MAX_QUANTITY
        );
    });

    it("drops anything malformed or tampered with", () => {
        expect(sanitizeCart("not an array")).toEqual([]);
        expect(
            sanitizeCart([
                null,
                { id: "a", name: "x", price: "320", quantity: 1 },
                { id: "a", name: "x", price: -5, quantity: 1 },
                { id: "a", name: "x", price: 320, quantity: 1.5 },
                { id: "a", name: "x", price: 320, quantity: 0 },
                { id: 1, name: "x", price: 320, quantity: 1 },
                { id: "a", name: { evil: true }, price: 320, quantity: 1 },
            ])
        ).toEqual([]);
    });
});

const biryani = { id: "a", name: "Chicken Biryani", price: 320, day_of_week: "sunday" };
const nihari = { id: "b", name: "Chicken Nihari", price: 260, day_of_week: "saturday" };
const kunna = { id: "c", name: "Mutton Kunna", price: null, day_of_week: null };

describe("todayKey", () => {
    it("uses the kitchen's timezone, not the visitor's", () => {
        // 20:00 UTC Saturday is already 01:00 Sunday in Pakistan (UTC+5).
        const date = new Date("2026-10-03T20:00:00Z");
        expect(todayKey(date, "Asia/Karachi")).toBe("sunday");
        expect(todayKey(date, "UTC")).toBe("saturday");
    });
});

describe("groupMenu", () => {
    it("groups by day and separates specials", () => {
        const { byDay, specials } = groupMenu([biryani, nihari, kunna]);
        expect(byDay.sunday).toEqual([biryani]);
        expect(byDay.saturday).toEqual([nihari]);
        expect(byDay.monday).toEqual([]);
        expect(specials).toEqual([kunna]);
    });
});

describe("isOrderableToday", () => {
    it("only allows today's priced dish", () => {
        expect(isOrderableToday(biryani, "sunday")).toBe(true);
        expect(isOrderableToday(biryani, "monday")).toBe(false);
        expect(isOrderableToday(kunna, "sunday")).toBe(false);
    });
});

describe("reconcileCart", () => {
    it("refreshes prices and drops dishes not orderable today", () => {
        const cart = [
            { id: "a", name: "Chicken Biryani", price: 300, quantity: 2 },
            { id: "b", name: "Chicken Nihari", price: 260, quantity: 1 },
            { id: "gone", name: "Old Dish", price: 100, quantity: 1 },
        ];
        const { kept, removed, changed } = reconcileCart(
            cart,
            [biryani, nihari, kunna],
            "sunday"
        );
        expect(kept).toEqual([
            { id: "a", name: "Chicken Biryani", price: 320, quantity: 2 },
        ]);
        expect(removed).toEqual(["Chicken Nihari", "Old Dish"]);
        expect(changed).toBe(true);
    });

    it("reports no change when the cart is already current", () => {
        const cart = [{ id: "a", name: "Chicken Biryani", price: 320, quantity: 1 }];
        const result = reconcileCart(cart, [biryani], "sunday");
        expect(result.changed).toBe(false);
        expect(result.removed).toEqual([]);
    });
});
