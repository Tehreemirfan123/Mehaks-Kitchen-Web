# Mehak's Kitchen — website

The customer-facing website for Mehak's Kitchen (Iqbal Town, Lahore).
Customers browse the weekly menu, build a cart, and **send their order and
feedback to the kitchen on WhatsApp**. There is no admin panel, no login, and
no payment processing — payment is Cash on Delivery or an online transfer
(JazzCash / Easypaisa / bank) arranged on WhatsApp.

```
frontend/   React 19 + Vite + Tailwind v4 — the whole website, served as static files
```

There is no backend or database: the menu is a JSON file built into the
site. The only thing that changes it is a developer editing that file, so a
server and database would add cost, latency and failure modes without adding
anything. (An earlier version fetched the menu from a FastAPI + Postgres API;
it was removed for that reason.)

## How it works

| Feature | Where | Notes |
|---|---|---|
| Menu | `src/data/menu.json` → `pages/Menu.jsx` | Validated and built into the site. Each dish has a day; only **today's** dish (Pakistan time) can be added to the cart. Dishes with no day are advance-order specials: no price, "Ask on WhatsApp". |
| Cart | `context/CartContext.jsx`, `pages/Cart.jsx` | Saved in the browser. Quantities, subtotal, delivery fee, total. On load it drops dishes that aren't available today and refreshes prices from the menu. |
| Delivery fee | `lib/delivery.js`, `config.js` | Rs. 80 within 3 km, then Rs. 26 per extra km. "Use my location" estimates straight-line distance. Shown as an estimate; confirmed on WhatsApp. |
| Ordering | `lib/whatsapp.js` | "Send order on WhatsApp" opens WhatsApp with the full order typed out; the customer taps Send. |
| Feedback | `pages/Feedback.jsx` | Rating, would-order-again, dish, comment, name → opens WhatsApp with the feedback typed out. |

## Updating the menu

Edit [`frontend/src/data/menu.json`](frontend/src/data/menu.json), then
commit and push — Vercel rebuilds and the new menu is live in about a minute.

```json
{ "name": "Chicken Biryani", "description": "Traditional spicy chicken biryani", "price": 320, "day": "sunday" }
```

| Field | |
|---|---|
| `name` | Required, unique. |
| `description` | Optional. |
| `price` | Rupees. Required for dishes with a day; leave out for specials. |
| `category` | `starters`, `mains`, `desserts` or `drinks` (default `mains`). |
| `day` | `monday` … `sunday`. Leave out for an advance-order special. |
| `image_url` | Optional `https://` link to a photo. |
| `available` | `false` hides the dish without deleting it (default `true`). |

Every build checks the file ([`src/data/validateMenu.js`](frontend/src/data/validateMenu.js)):
a typo, unknown field, missing price or duplicate dish **stops the build with
a message naming the dish**, so a broken menu can never go live. Check before
pushing with `npm run build` (or just `npm run dev`, which reports the same
errors).

## Other settings

Business details (phone, WhatsApp number, address, hours) and delivery rates
are in [`frontend/src/config.js`](frontend/src/config.js). Change, commit, and
the next deploy picks them up.

## Local development

Requires Node 22+.

```bash
cd frontend
npm install
npm run dev                     # http://localhost:5173
```

`npm run build && npm run preview` serves the production build with the same
security headers as Vercel. `docker compose up --build` serves it through
nginx instead, at http://localhost:5173.

## Tests

```bash
cd frontend
npm test
npm run lint
```

CI (`.github/workflows/ci.yml`) audits dependencies for known
vulnerabilities, lints, tests, and builds (which validates the menu).
Dependabot opens monthly update PRs.

## Deployment

A static site: build command `npm run build`, output directory `dist`, root
directory `frontend`. No environment variables or secrets. It runs on either:

- **Cloudflare Pages** (free plan allows commercial use) — security headers
  come from [`frontend/public/_headers`](frontend/public/_headers); with no
  `404.html`, Pages serves `index.html` for every route.
- **Vercel** — headers and routing come from
  [`frontend/vercel.json`](frontend/vercel.json). Note Vercel's free Hobby
  plan is for non-commercial use only; a business site needs Pro.

`hosting-headers.test.js` keeps the two header files identical. Share the
project's production URL, not per-deployment preview URLs.
