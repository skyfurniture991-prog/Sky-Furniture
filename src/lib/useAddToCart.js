import { useCallback } from "react";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { useUI } from "../contexts/UIContext";

/** Menambah produk ke keranjang sekaligus menampilkan notifikasi dengan aksi cepat. */
export function useAddToCart() {
  const { addItem } = useCart();
  const toast = useToast();
  const { openCart } = useUI();

  return useCallback(
    (product, opts = {}) => {
      const key = addItem(product, opts);
      toast.success("Ditambahkan ke keranjang", product.name, {
        label: "Lihat Keranjang",
        onClick: openCart,
      });
      return key;
    },
    [addItem, toast, openCart]
  );
}
