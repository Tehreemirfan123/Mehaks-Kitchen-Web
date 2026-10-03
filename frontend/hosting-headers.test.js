import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

// The site can be hosted on Vercel (vercel.json) or Cloudflare Pages
// (public/_headers). Both must send exactly the same headers.

function vercelHeaders() {
    const { headers } = JSON.parse(
        readFileSync(new URL("./vercel.json", import.meta.url), "utf-8")
    );
    const toPattern = (source) =>
        source === "/(.*)" ? "/*" : source.replace("(.*)", "*");
    return Object.fromEntries(
        headers.map((rule) => [
            toPattern(rule.source),
            Object.fromEntries(rule.headers.map((h) => [h.key, h.value])),
        ])
    );
}

function cloudflareHeaders() {
    const rules = {};
    let current = null;
    for (const line of readFileSync(
        new URL("./public/_headers", import.meta.url),
        "utf-8"
    ).split(/\r?\n/)) {
        if (!line.trim() || line.trimStart().startsWith("#")) continue;
        if (!/^\s/.test(line)) {
            current = rules[line.trim()] = {};
        } else {
            const at = line.indexOf(":");
            current[line.slice(0, at).trim()] = line.slice(at + 1).trim();
        }
    }
    return rules;
}

describe("hosting headers", () => {
    it("are identical for Vercel and Cloudflare Pages", () => {
        expect(cloudflareHeaders()).toEqual(vercelHeaders());
    });

    it("include a strict Content-Security-Policy", () => {
        const csp = vercelHeaders()["/*"]["Content-Security-Policy"];
        expect(csp).toContain("script-src 'self';");
        expect(csp).toContain("connect-src 'self';");
        expect(csp).toContain("frame-ancestors 'none'");
    });
});
