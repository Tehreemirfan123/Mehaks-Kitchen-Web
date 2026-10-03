import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import { BUSINESS, DEVELOPER } from "../config";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { whatsappUrl } from "../lib/whatsapp";
import FloatingWhatsAppButton from "./FloatingWhatsAppButton";

const LINKS = [
    { to: "/", label: "Home", end: true },
    { to: "/about", label: "About Us" },
    { to: "/menu", label: "Menu" },
    { to: "/feedback", label: "Feedback" },
    { to: "/contact", label: "Contact" },
];

// Pages whose main action is already a WhatsApp button.
const NO_FLOATING_BUTTON = ["/", "/cart", "/feedback"];

function navClass({ isActive }) {
    return `px-3 py-1.5 rounded-lg whitespace-nowrap ${
        isActive ? "bg-white/15 font-medium" : "text-gold-100 hover:bg-white/10"
    }`;
}

export default function Layout() {
    const { totalItems } = useCart();
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const { pathname } = useLocation();

    // Close the mobile menu on navigation (adjusting state during render,
    // per React's "you might not need an effect" guidance).
    const [lastPath, setLastPath] = useState(pathname);
    if (pathname !== lastPath) {
        setLastPath(pathname);
        setMenuOpen(false);
    }

    // Start each page at the top.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="min-h-screen flex flex-col bg-cream-100">
            <header className="bg-maroon-700 text-white sticky top-0 z-20">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/" className="font-bold text-lg leading-none">
                        {BUSINESS.name}
                        <span className="block my-1 text-[15px] font-normal text-gold-200">
                            {BUSINESS.tagline}
                        </span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <nav className="hidden md:flex items-center gap-1 text-sm">
                            {LINKS.map((l) => (
                                <NavLink key={l.to} to={l.to} end={l.end} className={navClass}>
                                    {l.label}
                                </NavLink>
                            ))}
                        </nav>

                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                            className="bg-white/15 hover:bg-white/25 rounded-lg p-2 text-base leading-none"
                        >
                            {theme === "dark" ? "☀️" : "🌙"}
                        </button>

                        <Link
                            to="/cart"
                            className="relative bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-medium"
                            aria-label={`Cart, ${totalItems} item${totalItems === 1 ? "" : "s"}`}
                        >
                            Cart
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-white text-maroon-800 text-xs font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        <button
                            type="button"
                            onClick={() => setMenuOpen((o) => !o)}
                            aria-label="Menu"
                            aria-expanded={menuOpen}
                            className="md:hidden p-2 rounded-lg hover:bg-white/10 text-xl leading-none"
                        >
                            ☰
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <nav className="md:hidden border-t border-white/10 px-4 py-2 flex flex-col">
                        {LINKS.map((l) => (
                            <NavLink key={l.to} to={l.to} end={l.end} className={navClass}>
                                {l.label}
                            </NavLink>
                        ))}
                    </nav>
                )}
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="bg-maroon-900 text-gold-100 mt-10">
                <div className="max-w-5xl mx-auto px-4 py-8 grid gap-6 sm:grid-cols-3 text-sm">
                    <div>
                        <p className="font-bold text-white text-base">{BUSINESS.name}</p>
                        <p className="mt-1 text-gold-200">
                            Fresh homemade meals, prepared daily.
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold text-white mb-1">Visit us</p>
                        <p>{BUSINESS.address}</p>
                        <p className="mt-1">Open daily {BUSINESS.hours}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-white mb-1">Order</p>
                        <a
                            href={whatsappUrl(`Hi ${BUSINESS.name}, I'd like to order.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#25D366] font-medium"
                        >
                            WhatsApp {BUSINESS.phoneDisplay}
                        </a>
                        <p className="mt-2">
                            <Link to="/feedback" className="hover:underline">
                                Share your feedback
                            </Link>
                        </p>
                    </div>
                </div>
                <div className="border-t border-white/10 py-3 text-center text-xs text-gold-200">
                    © {new Date().getFullYear()} {BUSINESS.name} · Website by{" "}
                    <a
                        href={DEVELOPER.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-white"
                    >
                        {DEVELOPER.name}
                    </a>
                </div>
            </footer>

            {!NO_FLOATING_BUTTON.includes(pathname) && <FloatingWhatsAppButton />}
        </div>
    );
}
