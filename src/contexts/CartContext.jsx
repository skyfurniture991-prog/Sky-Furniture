/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo } from "react";
import { PRODUCT_BY_ID, getBonusProduct } from "../data/products";
import { MAX_QTY } from "../data/store";
import { evaluatePromo, unitOriginalPrice, unitPrice } from "../lib/pricing";
import { useLocalStorage } from "../lib/useLocalStorage";

const CartContext = createContext(null);

export const orientationLabel = (o) => (o === "kanan" ? "L-Kanan" : o === "kiri" ? "L-Kiri" : null);

export const defaultOptions = (product) => ({
  color: product.colors[0]?.name ?? null,
  material: product.material ?? null,
  orientation: product.hasOrientation ? "kiri" : null,
});

export const optionLabels = (item) =>
  [item.color, item.material, orientationLabel(item.orientation)].filter(Boolean);

const lineKey = (productId, { color, material, orientation }) =>
  [productId, color, material, orientation].join("|");

export function CartProvider({ children }) {
  const [lines, setLines] = useLocalStorage("sky.cart.v1", []);
  const [promoCode, setPromoCode] = useLocalStorage("sky.promo.v1", "");

  const items = useMemo(
    () =>
      lines
        .map((l) => {
          const product = PRODUCT_BY_ID[l.productId];
          if (!product) return null;
          const unit = unitPrice(product, l.material);
          const original = unitOriginalPrice(product, l.material);
          return { ...l, product, unit, original, total: unit * l.qty, originalTotal: original * l.qty };
        })
        .filter(Boolean),
    [lines]
  );

  const bonusItems = useMemo(
    () =>
      items
        .map((it) => {
          const bonus = getBonusProduct(it.product);
          return bonus
            ? {
                key: `bonus-${it.key}`,
                product: bonus,
                qty: it.qty,
                color: bonus.colors[0]?.name,
                material: null,
                orientation: null,
                from: it.product.name,
                value: bonus.price * it.qty,
              }
            : null;
        })
        .filter(Boolean),
    [items]
  );

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.total, 0), [items]);
  const originalSubtotal = useMemo(() => items.reduce((s, i) => s + i.originalTotal, 0), [items]);
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const bonusValue = useMemo(() => bonusItems.reduce((s, i) => s + i.value, 0), [bonusItems]);

  const promoResult = useMemo(
    () => (promoCode ? evaluatePromo(promoCode, subtotal) : null),
    [promoCode, subtotal]
  );
  const promo = promoResult?.valid ? promoResult.promo : null;

  const addItem = useCallback(
    (product, opts = {}) => {
      const options = { ...defaultOptions(product), ...opts };
      const qty = Math.max(1, Math.min(MAX_QTY, opts.qty ?? 1));
      const key = lineKey(product.id, options);
      setLines((prev) => {
        const found = prev.find((l) => l.key === key);
        if (found) {
          return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
        }
        return [
          ...prev,
          {
            key,
            productId: product.id,
            qty,
            color: options.color,
            material: options.material,
            orientation: options.orientation,
            addedAt: Date.now(),
          },
        ];
      });
      return key;
    },
    [setLines]
  );

  const updateQty = useCallback(
    (key, qty) =>
      setLines((prev) =>
        prev.map((l) => (l.key === key ? { ...l, qty: Math.max(1, Math.min(MAX_QTY, qty)) } : l))
      ),
    [setLines]
  );

  const removeItem = useCallback(
    (key) => {
      const removed = lines.find((l) => l.key === key) ?? null;
      setLines((prev) => prev.filter((l) => l.key !== key));
      return removed;
    },
    [lines, setLines]
  );

  const restoreItem = useCallback(
    (line) => {
      if (!line) return;
      setLines((prev) => (prev.some((l) => l.key === line.key) ? prev : [...prev, line]));
    },
    [setLines]
  );

  const clear = useCallback(() => {
    setLines([]);
    setPromoCode("");
  }, [setLines, setPromoCode]);

  const applyPromo = useCallback(
    (code) => {
      const result = evaluatePromo(code, subtotal);
      if (result.valid) setPromoCode(result.code);
      return result;
    },
    [subtotal, setPromoCode]
  );

  const removePromo = useCallback(() => setPromoCode(""), [setPromoCode]);

  const value = useMemo(
    () => ({
      items,
      bonusItems,
      subtotal,
      originalSubtotal,
      count,
      bonusValue,
      promo,
      promoCode,
      promoResult,
      addItem,
      updateQty,
      removeItem,
      restoreItem,
      clear,
      applyPromo,
      removePromo,
    }),
    [
      items,
      bonusItems,
      subtotal,
      originalSubtotal,
      count,
      bonusValue,
      promo,
      promoCode,
      promoResult,
      addItem,
      updateQty,
      removeItem,
      restoreItem,
      clear,
      applyPromo,
      removePromo,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
