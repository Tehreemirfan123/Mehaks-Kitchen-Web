import { describe, expect, it } from "vitest";

import { buildFeedbackMessage, buildOrderMessage, whatsappUrl } from "./whatsapp";

const items = [
    { id: "a", name: "Chicken Biryani", price: 320, quantity: 2 },
    { id: "b", name: "Raita", price: 50, quantity: 1 },
];

describe("whatsappUrl", () => {
    it("builds a wa.me link with an encoded message", () => {
        expect(whatsappUrl("Hi & bye", "923001234567")).toBe(
            "https://wa.me/923001234567?text=Hi%20%26%20bye"
        );
        expect(whatsappUrl("", "923001234567")).toBe("https://wa.me/923001234567");
    });
});

describe("buildOrderMessage", () => {
    it("formats a pickup order without delivery lines", () => {
        const text = buildOrderMessage({
            items,
            orderType: "pickup",
            name: "Ali",
            payment: "Cash",
        });
        expect(text).toBe(
            [
                "Hi Mehak's Kitchen, I'd like to place an order:",
                "",
                "• 2 × Chicken Biryani — Rs. 640",
                "• 1 × Raita — Rs. 50",
                "",
                "Subtotal: Rs. 690",
                "Total: Rs. 690",
                "",
                "Order type: Pickup",
                "Name: Ali",
                "Payment: Cash",
            ].join("\n")
        );
    });

    it("includes delivery fee, distance and address for deliveries", () => {
        const text = buildOrderMessage({
            items,
            orderType: "delivery",
            address: "House 1, Iqbal Town",
            distanceKm: 4,
            deliveryFee: 106,
            notes: "less spicy",
        });
        expect(text).toContain("Delivery (~4 km): Rs. 106 (estimate)");
        expect(text).toContain("Total: Rs. 796");
        expect(text).toContain("Order type: Delivery");
        expect(text).toContain("Address: House 1, Iqbal Town");
        expect(text).toContain("Notes: less spicy");
        expect(text).not.toContain("Name:");
    });

    it("formats thousands with separators", () => {
        const text = buildOrderMessage({
            items: [{ id: "a", name: "Biryani", price: 320, quantity: 10 }],
            orderType: "pickup",
        });
        expect(text).toContain("Total: Rs. 3,200");
    });
});

describe("buildFeedbackMessage", () => {
    it("includes rating stars and optional fields", () => {
        const text = buildFeedbackMessage({
            rating: 4,
            wouldReorder: true,
            dish: "Chicken Nihari",
            comment: "Lovely, a bit salty.",
            name: "Sana",
        });
        expect(text).toBe(
            [
                "Feedback for Mehak's Kitchen",
                "",
                "Rating: ★★★★☆ (4/5)",
                "Dish: Chicken Nihari",
                "Would order again: Yes",
                "",
                "Lovely, a bit salty.",
                "",
                "— Sana",
            ].join("\n")
        );
    });

    it("omits empty optional fields", () => {
        const text = buildFeedbackMessage({ rating: 2, wouldReorder: false });
        expect(text).toBe(
            [
                "Feedback for Mehak's Kitchen",
                "",
                "Rating: ★★☆☆☆ (2/5)",
                "Would order again: No",
            ].join("\n")
        );
    });
});
