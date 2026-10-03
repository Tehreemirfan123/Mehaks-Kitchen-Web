import { BUSINESS } from "../config";
import { formatRs } from "./format";

/** wa.me link that opens a chat with the kitchen, optionally pre-filled. */
export function whatsappUrl(text, number = BUSINESS.whatsappNumber) {
    const query = text ? `?text=${encodeURIComponent(text)}` : "";
    return `https://wa.me/${number}${query}`;
}

/** Open WhatsApp in a new tab (the WhatsApp app on phones). */
export function openWhatsapp(text) {
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
}

/**
 * The order message the customer sends to the kitchen. The kitchen replies
 * on WhatsApp to confirm the total, delivery time and payment.
 */
export function buildOrderMessage({
    items,
    orderType,
    name = "",
    phone = "",
    address = "",
    distanceKm = null,
    deliveryFee = 0,
    payment = "",
    notes = "",
}) {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const isDelivery = orderType === "delivery";
    const fee = isDelivery ? deliveryFee : 0;

    const lines = [
        `Hi ${BUSINESS.name}, I'd like to place an order:`,
        "",
        ...items.map(
            (i) => `• ${i.quantity} × ${i.name} — ${formatRs(i.price * i.quantity)}`
        ),
        "",
        `Subtotal: ${formatRs(subtotal)}`,
    ];

    if (isDelivery) {
        const km = distanceKm ? ` (~${distanceKm} km)` : "";
        lines.push(`Delivery${km}: ${formatRs(fee)} (estimate)`);
    }
    lines.push(`Total: ${formatRs(subtotal + fee)}`, "");

    lines.push(`Order type: ${isDelivery ? "Delivery" : "Pickup"}`);
    if (name) lines.push(`Name: ${name}`);
    if (phone) lines.push(`Phone: ${phone}`);
    if (isDelivery) lines.push(`Address: ${address}`);
    if (payment) lines.push(`Payment: ${payment}`);
    if (notes) lines.push(`Notes: ${notes}`);

    return lines.join("\n");
}

/** The feedback message the customer sends to the kitchen. */
export function buildFeedbackMessage({
    rating,
    wouldReorder,
    dish = "",
    comment = "",
    name = "",
}) {
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
    const lines = [
        `Feedback for ${BUSINESS.name}`,
        "",
        `Rating: ${stars} (${rating}/5)`,
    ];
    if (dish) lines.push(`Dish: ${dish}`);
    lines.push(`Would order again: ${wouldReorder ? "Yes" : "No"}`);
    if (comment) lines.push("", comment);
    if (name) lines.push("", `— ${name}`);
    return lines.join("\n");
}
