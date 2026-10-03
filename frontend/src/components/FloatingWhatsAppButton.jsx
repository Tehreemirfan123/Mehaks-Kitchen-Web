import { BUSINESS } from "../config";
import { whatsappUrl } from "../lib/whatsapp";
import WhatsAppIcon from "./WhatsAppIcon";

export default function FloatingWhatsAppButton() {
    return (
        <a
            href={whatsappUrl(`Hi ${BUSINESS.name}, I'd like to order.`)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            title="Chat with us on WhatsApp"
            className="fixed bottom-5 right-5 z-30 bg-[#25D366] hover:brightness-95 text-white rounded-full p-3.5 shadow-lg"
        >
            <WhatsAppIcon className="w-7 h-7" />
        </a>
    );
}
