// Apply the saved theme before first paint to avoid a light flash. Loaded as
// a blocking external script so the Content-Security-Policy needs no inline JS.
try {
    if (localStorage.getItem("mk_theme") === "dark") {
        document.documentElement.classList.add("dark");
    }
} catch {
    // storage unavailable
}
