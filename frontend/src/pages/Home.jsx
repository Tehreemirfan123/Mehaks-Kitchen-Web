import { Link } from "react-router-dom";

import heroImg from "../assets/hero.png";
import DishCard from "../components/DishCard";
import { BUSINESS } from "../config";
import { useMenu } from "../hooks/useMenu";
import { todayKey } from "../lib/menu";
import { whatsappUrl } from "../lib/whatsapp";

const IMG = "?w=600&q=60&auto=format&fit=crop";

const HIGHLIGHTS = [
    {
        title: "Fresh Daily",
        text: "A focused daily menu keeps every meal fresh and consistent.",
        image: "https://images.unsplash.com/photo-1596797038530-2c107229654b",
    },
    {
        title: "Homemade Taste",
        text: "Comforting local favourites made for lunch and dinner.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    },
    {
        title: "Pickup & Delivery",
        text: "Order on WhatsApp for pickup or local delivery.",
        image: "https://images.unsplash.com/photo-1526367790999-0150786686a2",
    },
    {
        title: "Local & Convenient",
        text: "Serving nearby offices, students, hostels and households.",
        // Chicken karahi with roti.
        image: "https://images.unsplash.com/photo-1708782340793-ec5f2159a689",
    },
];

export default function Home() {
    const { menu } = useMenu();
    const today = todayKey();
    const todays = menu.filter((item) => item.day_of_week === today);

    return (
        <div>
            <section className="relative">
                <img
                    src={heroImg}
                    alt=""
                    className="w-full h-128 md:h-170 object-cover"
                />
                <div className="absolute inset-0 bg-maroon-900/60 flex items-center">
                    <div className="max-w-5xl mx-auto px-6 w-full text-white">
                        <p className="text-gold-200 uppercase tracking-wide text-sm">
                            {BUSINESS.tagline}
                        </p>
                        <h1 className="text-3xl md:text-5xl font-bold mt-2 max-w-xl">
                            Fresh Homemade Meals, Prepared Daily
                        </h1>
                        <p className="mt-3 text-cream-100 max-w-lg">
                            One day, one main dish — comforting lunch and dinner
                            for pickup or delivery.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                to="/menu"
                                className="bg-gold-500 hover:bg-gold-600 text-maroon-900 font-bold px-5 py-2.5 rounded-xl"
                            >
                                View Menu
                            </Link>
                            <a
                                href={whatsappUrl(
                                    `Hi ${BUSINESS.name}, I'd like to order today's dish.`
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-700 hover:brightness-95 text-white font-bold px-5 py-2.5 rounded-xl"
                            >
                                Order on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-6 py-10">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {HIGHLIGHTS.map((h) => (
                        <div
                            key={h.title}
                            className="bg-cream-50 rounded-xl shadow-sm overflow-hidden flex flex-col"
                        >
                            <img
                                src={h.image + IMG}
                                alt=""
                                loading="lazy"
                                className="w-full h-32 object-cover"
                            />
                            <div className="p-5">
                                <h3 className="font-semibold text-maroon-700">{h.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{h.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="max-w-3xl mx-auto px-6 pb-12">
                <div className="text-center mb-5">
                    <p className="text-sm text-gold-600 font-medium capitalize tracking-wide capitalize">
                        {today}&apos;s menu
                    </p>
                    <h2 className="text-2xl font-bold text-maroon-700">Available Today</h2>
                </div>

                {todays.length === 0 ? (
                    <p className="text-center text-gray-600">
                        See the full menu for this week&apos;s dishes.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {todays.map((item) => (
                            <DishCard key={item.id} item={item} orderable />
                        ))}
                    </div>
                )}

                <div className="text-center mt-6">
                    <Link
                        to="/menu"
                        className="inline-block bg-maroon-700 hover:bg-maroon-800 text-white font-semibold px-6 py-2.5 rounded-lg"
                    >
                        See the weekly menu
                    </Link>
                </div>
            </section>
        </div>
    );
}
