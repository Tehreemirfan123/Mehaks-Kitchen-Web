export function formatRs(amount) {
    return `Rs. ${Math.round(Number(amount)).toLocaleString("en-US")}`;
}
