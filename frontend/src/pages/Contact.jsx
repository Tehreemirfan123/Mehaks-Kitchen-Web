import WhatsAppIcon from "../components/WhatsAppIcon";
import { BUSINESS, DELIVERY } from "../config";
import { whatsappUrl } from "../lib/whatsapp";

export default function Contact() {
    const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
        BUSINESS.address
    )}&output=embed`;

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold text-maroon-700 mb-6">
                Contact &amp; Location
            </h1>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <div className="bg-cream-50 rounded-xl shadow-sm p-5">
                        <h2 className="font-semibold text-maroon-700 mb-1">Address</h2>
                        <p className="text-gray-600 text-sm">{BUSINESS.address}</p>
                    </div>
                    <div className="bg-cream-50 rounded-xl shadow-sm p-5">
                        <h2 className="font-semibold text-maroon-700 mb-1">Hours</h2>
                        <p className="text-gray-600 text-sm">
                            Open daily {BUSINESS.hours} · Lunch &amp; dinner
                        </p>
                    </div>
                    <div className="bg-cream-50 rounded-xl shadow-sm p-5">
                        <h2 className="font-semibold text-maroon-700 mb-1">
                            Orders &amp; enquiries
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Phone / WhatsApp: {BUSINESS.phoneDisplay}
                        </p>
                        <a
                            href={whatsappUrl(`Hi ${BUSINESS.name}, I'd like to order.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-3 bg-[#25D366] hover:brightness-95 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                        >
                            <WhatsAppIcon className="w-4 h-4" />
                            Message on WhatsApp
                        </a>
                    </div>
                    <div className="bg-cream-50 rounded-xl shadow-sm p-5">
                        <h2 className="font-semibold text-maroon-700 mb-1">
                            Delivery &amp; payment
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Rs. {DELIVERY.baseFee} within {DELIVERY.baseKm} km, then Rs.{" "}
                            {DELIVERY.perKm} per extra km. Pay cash on delivery, or by
                            JazzCash / Easypaisa / bank transfer arranged on WhatsApp.
                        </p>
                    </div>
                </div>

                <div className="rounded-xl overflow-hidden shadow-sm min-h-72">
                    <iframe
                        title={`${BUSINESS.name} location`}
                        src={mapSrc}
                        className="w-full h-full min-h-72 border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>
        </div>
    );
}
