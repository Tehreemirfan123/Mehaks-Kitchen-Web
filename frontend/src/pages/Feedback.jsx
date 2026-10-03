import { useState } from "react";

import WhatsAppIcon from "../components/WhatsAppIcon";
import { useMenu } from "../hooks/useMenu";
import { buildFeedbackMessage, openWhatsapp } from "../lib/whatsapp";

const input =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-700/40";

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

export default function Feedback() {
    const { menu } = useMenu();

    const [rating, setRating] = useState(0);
    const [wouldReorder, setWouldReorder] = useState(true);
    const [dish, setDish] = useState("");
    const [comment, setComment] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    function submit(e) {
        e.preventDefault();
        setError("");
        if (!rating) {
            setError("Please choose a star rating.");
            return;
        }
        openWhatsapp(
            buildFeedbackMessage({
                rating,
                wouldReorder,
                dish,
                comment: comment.trim(),
                name: name.trim(),
            })
        );
        setSent(true);
    }

    return (
        <main className="max-w-xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-maroon-700">How was your meal?</h1>
            <p className="text-sm text-gray-500 mt-1">
                Your feedback goes straight to the kitchen on WhatsApp.
            </p>

            <form onSubmit={submit} className="bg-white rounded-xl shadow-sm p-5 mt-5 space-y-4">
                <fieldset>
                    <legend className="text-sm text-gray-600 mb-1">Your rating</legend>
                    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <button
                                key={n}
                                type="button"
                                role="radio"
                                aria-checked={rating === n}
                                aria-label={`${n} star${n === 1 ? "" : "s"}`}
                                onClick={() => setRating(n)}
                                className={`text-3xl leading-none ${
                                    n <= rating ? "text-gold-500" : "text-gray-300"
                                }`}
                            >
                                ★
                            </button>
                        ))}
                        {rating > 0 && (
                            <span className="ml-2 text-sm text-gray-600">
                                {RATING_LABELS[rating]}
                            </span>
                        )}
                    </div>
                </fieldset>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={wouldReorder}
                        onChange={(e) => setWouldReorder(e.target.checked)}
                    />
                    I would order again
                </label>

                <label className="block text-sm">
                    <span className="text-gray-600">Which dish did you have? (optional)</span>
                    <select
                        value={dish}
                        onChange={(e) => setDish(e.target.value)}
                        className={`${input} mt-1`}
                    >
                        <option value="">—</option>
                        {menu.map((m) => (
                            <option key={m.id} value={m.name}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block text-sm">
                    <span className="text-gray-600">Comments (optional)</span>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        maxLength={1000}
                        className={`${input} mt-1`}
                    />
                </label>

                <label className="block text-sm">
                    <span className="text-gray-600">Your name (optional)</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        maxLength={80}
                        className={`${input} mt-1`}
                    />
                </label>

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
                    Send feedback on WhatsApp
                </button>

                {sent && (
                    <p className="text-center text-sm text-sage-700" role="status">
                        Thank you! WhatsApp has opened with your feedback — tap{" "}
                        <strong>Send</strong> there to deliver it.
                    </p>
                )}
            </form>
        </main>
    );
}
