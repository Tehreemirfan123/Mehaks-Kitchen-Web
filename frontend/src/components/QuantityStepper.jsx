import { MAX_QUANTITY } from "../lib/menu";

export default function QuantityStepper({ name, quantity, onChange }) {
    const button =
        "w-8 h-8 rounded-full bg-gold-100 text-maroon-900 font-bold leading-none disabled:opacity-40";
    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={() => onChange(quantity - 1)}
                className={button}
                aria-label={`One less ${name}`}
            >
                −
            </button>
            <span className="w-6 text-center font-medium" aria-live="polite">
                {quantity}
            </span>
            <button
                type="button"
                onClick={() => onChange(quantity + 1)}
                disabled={quantity >= MAX_QUANTITY}
                className={button}
                aria-label={`One more ${name}`}
            >
                +
            </button>
        </div>
    );
}
