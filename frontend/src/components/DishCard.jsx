import { BUSINESS } from "../config";
import { useCart } from "../context/CartContext";
import { formatRs } from "../lib/format";
import { isSpecial } from "../lib/menu";
import { whatsappUrl } from "../lib/whatsapp";
import QuantityStepper from "./QuantityStepper";

/**
 * One dish. Today's dish gets Add / a quantity stepper, other days show
 * "Not today", and advance-order specials get an "Ask on WhatsApp" button.
 */
export default function DishCard({ item, orderable }) {
    const { items, addItem, setQuantity } = useCart();
    const quantity = items.find((i) => i.id === item.id)?.quantity ?? 0;
    const special = isSpecial(item);

    let action;
    if (special) {
        action = (
            <a
                href={whatsappUrl(
                    `Hi ${BUSINESS.name}, I'd like to ask about ${item.name} (advance order).`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 bg-[#25D366] hover:brightness-95 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
                Ask on WhatsApp
            </a>
        );
    } else if (!orderable) {
        action = <span className="shrink-0 text-xs text-gray-400">Not today</span>;
    } else if (quantity > 0) {
        action = (
            <QuantityStepper
                name={item.name}
                quantity={quantity}
                onChange={(q) => setQuantity(item.id, q)}
            />
        );
    } else {
        action = (
            <button
                type="button"
                onClick={() => addItem(item)}
                className="shrink-0 bg-maroon-700 hover:bg-maroon-800 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
                Add to cart
            </button>
        );
    }

    return (
        <div className="bg-cream-50 rounded-xl shadow-sm overflow-hidden flex">
            {item.image_url && (
                <img
                    src={item.image_url}
                    alt={item.name}
                    loading="lazy"
                    className="w-24 sm:w-32 object-cover shrink-0"
                />
            )}
            <div className="p-4 flex flex-1 justify-between items-center gap-4 min-w-0">
                <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    {item.description && (
                        <p className="text-sm text-gray-500 mt-0.5">
                            {item.description}
                        </p>
                    )}
                    <p className="text-gold-600 font-semibold text-sm mt-1">
                        {special
                            ? "Advance order — ask for details"
                            : formatRs(item.price)}
                    </p>
                </div>
                {action}
            </div>
        </div>
    );
}
