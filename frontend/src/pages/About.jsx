import { DELIVERY } from "../config";

const CARDS = [
    {
        title: "Our promise",
        text: "Fresh, homemade, hygienic and tasty food with dependable portions — the same quality every single day.",
    },
    {
        title: "Who we serve",
        text: "Nearby offices, university students, hostel residents and local households looking for reliable everyday meals.",
    },
    {
        title: "A rotating menu",
        text: "One main dish each day of the week, plus Mutton Kunna on advance special order — predictable variety, carefully prepared.",
    },
    {
        title: "Easy ordering",
        text: `Build your order here and send it to us on WhatsApp. Choose pickup or delivery (Rs. ${DELIVERY.baseFee} within ${DELIVERY.baseKm} km), and pay cash on delivery or by JazzCash / Easypaisa / bank transfer.`,
    },
];

export default function About() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold text-maroon-700">About Us</h1>
            <p className="text-gray-600 mt-4 leading-relaxed">
                Mehak&apos;s Kitchen is a home-based kitchen in Iqbal Town, Lahore,
                serving fresh, homemade lunch and dinner to people who value
                familiar taste, hygiene and convenience but don&apos;t always have
                the time to cook. Every day we prepare one carefully chosen main
                dish, cooked fresh and made to feel like home food — because
                that&apos;s exactly what it is.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 mt-8">
                {CARDS.map((c) => (
                    <div key={c.title} className="bg-cream-50 rounded-xl shadow-sm p-5">
                        <h2 className="font-semibold text-maroon-700">{c.title}</h2>
                        <p className="text-sm text-gray-600 mt-1">{c.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
