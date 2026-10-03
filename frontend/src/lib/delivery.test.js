import { describe, expect, it } from "vitest";

import { computeDeliveryFee, haversineKm } from "./delivery";

const cfg = { baseFee: 80, baseKm: 3, perKm: 26 };

describe("computeDeliveryFee", () => {
    it("charges the base fee within the base radius", () => {
        expect(computeDeliveryFee(0, cfg)).toBe(80);
        expect(computeDeliveryFee(3, cfg)).toBe(80);
    });

    it("adds the per-km charge beyond the base radius", () => {
        expect(computeDeliveryFee(4, cfg)).toBe(106);
        expect(computeDeliveryFee(5.5, cfg)).toBe(145);
    });

    it("falls back to the base fee for unknown or invalid distances", () => {
        expect(computeDeliveryFee("", cfg)).toBe(80);
        expect(computeDeliveryFee(null, cfg)).toBe(80);
        expect(computeDeliveryFee("abc", cfg)).toBe(80);
    });

    it("accepts string distances from inputs", () => {
        expect(computeDeliveryFee("4", cfg)).toBe(106);
    });
});

describe("haversineKm", () => {
    it("is zero for the same point and ~111 km per degree of latitude", () => {
        expect(haversineKm(31.5, 74.3, 31.5, 74.3)).toBe(0);
        expect(haversineKm(31, 74, 32, 74)).toBeCloseTo(111.2, 0);
    });
});
