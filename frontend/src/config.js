// Business details shown across the site. There is no admin panel: this file
// (plus src/data/menu.json for dishes) is where the site's settings live.

export const BUSINESS = {
    name: "Mehak's Kitchen",
    tagline: "Khanoon ki Mehak",
    phoneDisplay: "0324-7509762",
    // International format, digits only — used for wa.me links.
    whatsappNumber: "923247509762",
    address:
        "Plot #327/A, Al Hamad Road, Al Hamad Colony, Neelum Block, Iqbal Town, Lahore",
    hours: "11:00 AM – 11:00 PM",
    // "Today's dish" is worked out in the kitchen's timezone, not the visitor's.
    timeZone: "Asia/Karachi",
};

// Developer credit shown in the footer. Replace `your-username` with your
// GitHub username before launch.
export const DEVELOPER = {
    name: "Tehreem Irfan",
    url: "https://github.com/Tehreemirfan123",
};

// Delivery fee = baseFee within baseKm, plus perKm for every km beyond.
// The fee shown on the site is an estimate; it's confirmed on WhatsApp.
export const DELIVERY = {
    baseFee: 80,
    baseKm: 3,
    perKm: 26,
    // Kitchen location (Iqbal Town, Lahore) for "Use my location".
    kitchenLat: 31.51,
    kitchenLng: 74.29,
};

// Payment is never processed on the site — it's Cash on Delivery, or an
// online transfer arranged with the kitchen over WhatsApp. `note` is added
// to the WhatsApp order message after the label.
export const PAYMENT_OPTIONS = [
    {
        key: "cash",
        label: "Cash on Delivery",
        pickupLabel: "Cash at pickup",
    },
    {
        key: "online",
        label: "JazzCash / Easypaisa / Bank",
        pickupLabel: "JazzCash / Easypaisa / Bank",
        note: "please share account details",
    },
];
