import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { MENU } from "../data/menu";
import { MAX_QUANTITY, reconcileCart, sanitizeCart, todayKey } from "../lib/menu";

const CartContext = createContext(null);

const STORAGE_KEY = "mk_cart";

function loadCart() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return sanitizeCart(raw ? JSON.parse(raw) : []);
    } catch {
        return [];
    }
}

// A saved cart may be from another day or hold old prices: bring it in line
// with the menu before the first render.
function initialCart() {
    const { kept, removed } = reconcileCart(loadCart(), MENU, todayKey());
    return { items: kept, removedNames: removed };
}

export function CartProvider({ children }) {
    const [initial] = useState(initialCart);
    // Each line: { id, name, price, quantity }
    const [items, setItems] = useState(initial.items);
    // Names of saved dishes dropped because they're not available today.
    const [removedNames, setRemovedNames] = useState(initial.removedNames);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // Storage unavailable (private mode etc.) — cart stays in memory.
        }
    }, [items]);

    const addItem = useCallback((dish) => {
        setItems((current) => {
            if (current.some((i) => i.id === dish.id)) {
                return current.map((i) =>
                    i.id === dish.id
                        ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QUANTITY) }
                        : i
                );
            }
            return [
                ...current,
                { id: dish.id, name: dish.name, price: dish.price, quantity: 1 },
            ];
        });
    }, []);

    const setQuantity = useCallback((id, quantity) => {
        setItems((current) =>
            quantity <= 0
                ? current.filter((i) => i.id !== id)
                : current.map((i) =>
                      i.id === id
                          ? { ...i, quantity: Math.min(quantity, MAX_QUANTITY) }
                          : i
                  )
        );
    }, []);

    const removeItem = useCallback((id) => {
        setItems((current) => current.filter((i) => i.id !== id));
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const dismissRemovedNotice = useCallback(() => setRemovedNames([]), []);

    const value = useMemo(
        () => ({
            items,
            addItem,
            setQuantity,
            removeItem,
            clearCart,
            removedNames,
            dismissRemovedNotice,
            totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
            subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        }),
        [items, addItem, setQuantity, removeItem, clearCart, removedNames, dismissRemovedNotice]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within a CartProvider");
    return ctx;
}
