import { useMemo, useState } from "react";
import { defaultOptions } from "../contexts/CartContext";
import { unitOriginalPrice, unitPrice } from "./pricing";

/** State pilihan varian (warna, bahan, orientasi, jumlah) beserta harga turunannya. */
export function useProductOptions(product) {
  const [options, setOptions] = useState(() => defaultOptions(product));
  const [qty, setQty] = useState(1);

  const price = useMemo(() => unitPrice(product, options.material), [product, options.material]);
  const originalPrice = useMemo(() => unitOriginalPrice(product, options.material), [product, options.material]);

  const set = (key) => (value) => setOptions((o) => ({ ...o, [key]: value }));

  return {
    ...options,
    qty,
    setQty,
    setColor: set("color"),
    setMaterial: set("material"),
    setOrientation: set("orientation"),
    price,
    originalPrice,
    total: price * qty,
    payload: { ...options, qty },
  };
}
