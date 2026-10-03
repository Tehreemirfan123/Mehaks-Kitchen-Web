import { useState } from "react";
import { Link } from "react-router-dom";

import QuantityStepper from "../components/QuantityStepper";
import WhatsAppIcon from "../components/WhatsAppIcon";
import { DELIVERY, PAYMENT_OPTIONS } from "../config";
import { useCart } from "../context/CartContext";
import { computeDeliveryFee, estimateDistanceFromLocation } from "../lib/delivery";
import { formatRs } from "../lib/format";
import { buildOrderMessage, openWhatsapp } from "../lib/whatsapp";

const input =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-700/40";

function Toggle({ options, value, onChange, label }) {
    return (
        <div role="radiogroup" aria-label={label} className="flex gap-2">
            {options.map((o) => (
                <button
                    key={o.key}
                    type="button"
                    role="radio"
                    aria-checked={value === o.key}
                    onClick={() => onChange(o.key)}
                    className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium ${
                        value === o.key
                            ? "bg-maroon-700 text-white"
                            : "bg-cream-100 text-maroon-800"
                    }`}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}

export default function Cart() {
    const {
        items,
        setQuantity,
        removeItem,
        clearCart,
        subtotal,
        removedNames,
        dismissRemovedNotice,
    } = useCart();

    const [orderType, setOrderType] = useState("pickup");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [distance, setDistance] = useState("");
    const [locating, setLocating] = useState(false);
    const [payment, setPayment] = useState("cash");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    const isDelivery = orderType === "delivery";
    const deliveryFee = isDelivery ? computeDeliveryFee(distance) : 0;
    const total = subtotal + deliveryFee;
    const paymentOption = PAYMENT_OPTIONS.find((p) => p.key === payment);
    const paymentLabel = isDelivery ? paymentOption.label : paymentOption.pickupLabel;

    async function detectDistance() {
        setError("");
        setLocating(true);
        try {
            setDistance(String(await estimateDistanceFromLocation()));
        } catch (err) {
            setError(err.message);
        } finally {
            setLocating(false);
        }
    }

    function sendOrder(e) {
        e.preventDefault();
        setError("");
        if (isDelivery && !address.trim()) {
            setError("Please enter your delivery address.");
            return;
        }
        openWhatsapp(
            buildOrderMessage({
                items,
                orderType,
                name: name.trim(),
                phone: phone.trim(),
                address: address.trim(),
                distanceKm: isDelivery && distance !== "" ? Number(distance) : null,
                deliveryFee,
                payment: paymentOption.note
                    ? `${paymentLabel} — ${paymentOption.note}`
                    : paymentLabel,
                notes: notes.trim(),
            })
        );
        setSent(true);
    }

    if (items.length === 0) {
        return (
            <main className="max-w-2xl mx-auto p-4 py-8">
                <h1 className="text-xl font-bold text-gray-800 mb-4">Your Cart</h1>
                {removedNames.length > 0 && (
                    <RemovedNotice names={removedNames} onDismiss={dismissRemovedNotice} />
                )}
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <p className="text-gray-500 mb-4">Your cart is empty.</p>
                    <Link to="/menu" className="text-maroon-800 font-medium hover:underline">
                        Browse the menu
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-2xl mx-auto p-4 py-8">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-gray-800">Your Cart</h1>
                <button
                    type="button"
                    onClick={clearCart}
                    className="text-sm text-gray-500 hover:text-red-600"
                >
                    Clear cart
                </button>
            </div>

            {removedNames.length > 0 && (
                <RemovedNotice names={removedNames} onDismiss={dismissRemovedNotice} />
            )}

            <ul className="space-y-3">
                {items.map((item) => (
                    <li
                        key={item.id}
                        className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap items-center gap-3"
                    >
                        <div className="flex-1 min-w-40">
                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                            <span className="text-sm text-gray-500">
                                {formatRs(item.price)} each
                            </span>
                        </div>
                        <QuantityStepper
                            name={item.name}
                            quantity={item.quantity}
                            onChange={(q) => setQuantity(item.id, q)}
                        />
                        <div className="w-20 text-right font-semibold text-gray-800">
                            {formatRs(item.price * item.quantity)}
                        </div>
                        <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-600 text-sm px-1"
                            aria-label={`Remove ${item.name}`}
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>

            <form onSubmit={sendOrder} className="bg-white rounded-xl shadow-sm p-4 mt-4 space-y-4">
                <div className="grid gap-2 sm:grid-cols-2">
                    <label className="text-sm">
                        <span className="text-gray-600">Your name</span>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            maxLength={80}
                            className={`${input} mt-1`}
                        />
                    </label>
                    <label className="text-sm">
                        <span className="text-gray-600">Phone (optional)</span>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            autoComplete="tel"
                            maxLength={20}
                            className={`${input} mt-1`}
                        />
                    </label>
                </div>

                <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Pickup or delivery</p>
                    <Toggle
                        label="Pickup or delivery"
                        value={orderType}
                        onChange={setOrderType}
                        options={[
                            { key: "pickup", label: "Pickup" },
                            { key: "delivery", label: "Delivery" },
                        ]}
                    />
                </div>

                {isDelivery && (
                    <div className="space-y-2">
                        <label className="block text-sm">
                            <span className="text-gray-600">Delivery address</span>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                autoComplete="street-address"
                                rows={2}
                                maxLength={300}
                                required
                                className={`${input} mt-1`}
                            />
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                inputMode="decimal"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                placeholder="Distance from us (km)"
                                aria-label="Distance from the kitchen in km"
                                className={input}
                            />
                            <button
                                type="button"
                                onClick={detectDistance}
                                disabled={locating}
                                className="shrink-0 text-sm border border-maroon-700 text-maroon-700 rounded-lg px-3 py-2 disabled:opacity-60"
                            >
                                {locating ? "Locating…" : "Use my location"}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">
                            First {DELIVERY.baseKm} km: Rs. {DELIVERY.baseFee}, then Rs.{" "}
                            {DELIVERY.perKm} per extra km. This is an estimate — we&apos;ll
                            confirm the exact fee on WhatsApp.
                        </p>
                    </div>
                )}

                <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Payment</p>
                    <Toggle
                        label="Payment"
                        value={payment}
                        onChange={setPayment}
                        options={PAYMENT_OPTIONS.map((p) => ({
                            key: p.key,
                            label: isDelivery ? p.label : p.pickupLabel,
                        }))}
                    />
                    {payment === "online" && (
                        <p className="text-xs text-gray-500 mt-1">
                            We&apos;ll send you our account details on WhatsApp.
                        </p>
                    )}
                </div>

                <label className="block text-sm">
                    <span className="text-gray-600">Notes for the kitchen (optional)</span>
                    <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. less spicy, lunch time"
                        maxLength={200}
                        className={`${input} mt-1`}
                    />
                </label>

                <div className="space-y-1 text-sm text-gray-600 border-t pt-3">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatRs(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>
                            Delivery
                            {isDelivery && distance !== "" ? ` (${distance} km)` : ""}
                        </span>
                        <span>{isDelivery ? formatRs(deliveryFee) : "—"}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold text-gray-800 pt-2">
                        <span>Total</span>
                        <span>{formatRs(total)}</span>
                    </div>
                </div>

                {error && (
                    <p role="alert" className="text-red-600 text-sm">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    className="w-full bg-[#25D366] hover:brightness-95 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
                >
                    <WhatsAppIcon />
                    Send order on WhatsApp
                </button>

                {sent ? (
                    <p className="text-center text-sm text-sage-700" role="status">
                        WhatsApp has opened with your order — tap <strong>Send</strong>{" "}
                        there. We&apos;ll reply to confirm your total and time.
                    </p>
                ) : (
                    <p className="text-center text-xs text-gray-500">
                        Your order opens in WhatsApp, ready to send. Nothing is
                        charged here.
                    </p>
                )}
            </form>
        </main>
    );
}

function RemovedNotice({ names, onDismiss }) {
    return (
        <div
            className="mb-4 rounded-lg bg-gold-100 text-maroon-900 text-sm p-3 flex items-start gap-3"
            role="status"
        >
            <p className="flex-1">
                Removed from your cart because they&apos;re not available today:{" "}
                <span className="font-medium">{names.join(", ")}</span>.
            </p>
            <button type="button" onClick={onDismiss} aria-label="Dismiss" className="px-1">
                ✕
            </button>
        </div>
    );
}
