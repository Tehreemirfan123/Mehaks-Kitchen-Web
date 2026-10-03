import { DELIVERY } from "../config";

/**
 * Delivery fee for a distance in km: the base fee covers the first baseKm,
 * then perKm for each km beyond. Unknown distance -> base fee.
 */
export function computeDeliveryFee(distanceKm, cfg = DELIVERY) {
    if (distanceKm == null || distanceKm === "") return cfg.baseFee;
    const d = Number(distanceKm);
    if (!Number.isFinite(d) || d <= cfg.baseKm) return cfg.baseFee;
    return Math.round(cfg.baseFee + (d - cfg.baseKm) * cfg.perKm);
}

/** Straight-line (haversine) distance in km between two lat/lng points. */
export function haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const toRad = (x) => (x * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Estimate the distance from the kitchen using the browser's location.
 * Straight-line, so it's usually a little shorter than the road distance.
 */
export function estimateDistanceFromLocation(cfg = DELIVERY) {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Location isn't available on this device."));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const km = haversineKm(
                    cfg.kitchenLat,
                    cfg.kitchenLng,
                    pos.coords.latitude,
                    pos.coords.longitude
                );
                resolve(Math.round(km * 10) / 10);
            },
            (err) =>
                reject(
                    new Error(
                        err.code === err.PERMISSION_DENIED
                            ? "Location permission was denied. Enter the distance instead."
                            : "Couldn't get your location. Enter the distance instead."
                    )
                ),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    });
}
