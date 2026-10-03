import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

import { validateMenu } from "./src/data/validateMenu.js";

const MENU_FILE = new URL("./src/data/menu.json", import.meta.url);

// Fails `vite build` (and so any Vercel deploy) when menu.json has a mistake,
// so a broken menu never goes live. In `vite dev` it reports the same errors.
function validateMenuFile() {
    return {
        name: "validate-menu",
        buildStart() {
            this.addWatchFile(fileURLToPath(MENU_FILE));
            let raw;
            try {
                raw = JSON.parse(readFileSync(MENU_FILE, "utf-8"));
            } catch (err) {
                this.error(`src/data/menu.json is not valid JSON: ${err.message}`);
            }
            try {
                validateMenu(raw);
            } catch (err) {
                this.error(err.message);
            }
        },
    };
}

function vercelSiteHeaders() {
    const { headers } = JSON.parse(
        readFileSync(new URL("./vercel.json", import.meta.url), "utf-8")
    );
    const site = headers.find((h) => h.source === "/(.*)");
    // HSTS is meaningless (and sticky) on plain-http localhost.
    return Object.fromEntries(
        site.headers
            .filter((h) => h.key !== "Strict-Transport-Security")
            .map((h) => [h.key, h.value])
    );
}

export default defineConfig({
    plugins: [validateMenuFile(), react(), tailwindcss()],
    // `npm run preview` serves the same security headers as Vercel, so the
    // production CSP can be checked locally before deploying.
    preview: { headers: vercelSiteHeaders() },
    test: {
        environment: "node",
    },
});
