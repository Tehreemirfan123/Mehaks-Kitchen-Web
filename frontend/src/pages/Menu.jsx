import { Link } from "react-router-dom";

import DishCard from "../components/DishCard";
import { useCart } from "../context/CartContext";
import { useMenu } from "../hooks/useMenu";
import { formatRs } from "../lib/format";
import { DAYS, groupMenu, todayKey } from "../lib/menu";

export default function Menu() {
    const { menu } = useMenu();
    const { totalItems, subtotal } = useCart();
    const today = todayKey();
    const { byDay, specials } = groupMenu(menu);

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-maroon-700">Our Weekly Menu</h1>
                <p className="text-sm text-gray-500 mt-1">
                    One fresh main dish for every day of the week. Today&apos;s
                    dish is ready to order.
                </p>
            </div>

            {menu.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                    Our menu is being updated — please check back soon.
                </p>
            )}

            {DAYS.map((day) => {
                const dishes = byDay[day];
                if (!dishes.length) return null;
                const isToday = day === today;
                return (
                    <section key={day} className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-lg font-bold text-maroon-700 capitalize">
                                {day}
                            </h2>
                            {isToday && (
                                <span className="text-xs bg-gold-500 text-maroon-900 font-semibold px-2 py-0.5 rounded-full">
                                    Today
                                </span>
                            )}
                        </div>
                        <div className="space-y-3">
                            {dishes.map((item) => (
                                <DishCard key={item.id} item={item} orderable={isToday} />
                            ))}
                        </div>
                    </section>
                );
            })}

            {specials.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-maroon-700 mb-2">
                        Specials (advance order)
                    </h2>
                    <div className="space-y-3">
                        {specials.map((item) => (
                            <DishCard key={item.id} item={item} />
                        ))}
                    </div>
                </section>
            )}

            {totalItems > 0 && (
                // Right padding on small screens clears the floating WhatsApp button.
                <div className="sticky bottom-5 mt-6 pr-18 md:pr-0">
                    <Link
                        to="/cart"
                        className="flex justify-between items-center bg-maroon-700 hover:bg-maroon-800 text-white font-semibold px-5 py-3 rounded-xl shadow-lg"
                    >
                        <span>
                            View cart · {totalItems} item{totalItems === 1 ? "" : "s"}
                        </span>
                        <span>{formatRs(subtotal)}</span>
                    </Link>
                </div>
            )}
        </div>
    );
}
