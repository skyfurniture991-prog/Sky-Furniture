/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo } from "react";
import { PRODUCT_BY_ID } from "../data/products";
import { useLocalStorage } from "../lib/useLocalStorage";

const WishlistContext = createContext(null);

/** Wishlist + riwayat produk yang baru dilihat. */
export function WishlistProvider({ children }) {
  const [ids, setIds] = useLocalStorage("sky.wishlist.v1", []);
  const [recentIds, setRecentIds] = useLocalStorage("sky.recent.v1", []);

  const has = useCallback((id) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (id) => {
      const added = !ids.includes(id);
      setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
      return added;
    },
    [ids, setIds]
  );

  const remove = useCallback((id) => setIds((prev) => prev.filter((x) => x !== id)), [setIds]);
  const clear = useCallback(() => setIds([]), [setIds]);

  const trackView = useCallback(
    (id) => setRecentIds((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8)),
    [setRecentIds]
  );

  const products = useMemo(() => ids.map((id) => PRODUCT_BY_ID[id]).filter(Boolean), [ids]);
  const recent = useMemo(() => recentIds.map((id) => PRODUCT_BY_ID[id]).filter(Boolean), [recentIds]);

  const value = useMemo(
    () => ({ ids, products, count: products.length, has, toggle, remove, clear, recent, trackView }),
    [ids, products, has, toggle, remove, clear, recent, trackView]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
