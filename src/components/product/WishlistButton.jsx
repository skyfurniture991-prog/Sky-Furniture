import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "../../contexts/ToastContext";
import { useWishlist } from "../../contexts/WishlistContext";
import Icon from "../ui/Icon";

const SPARKS = [0, 60, 120, 180, 240, 300];

/** Tombol hati dengan animasi "pop" dan percikan kecil saat ditambahkan. */
export default function WishlistButton({ product, className = "", withLabel = false }) {
  const { has, toggle } = useWishlist();
  const toast = useToast();
  const [burst, setBurst] = useState(0);
  const active = has(product.id);

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggle(product.id);
    if (added) {
      setBurst((n) => n + 1);
      toast.success("Disimpan ke wishlist", product.name, { label: "Lihat Wishlist", to: "/wishlist" });
    } else {
      toast.info("Dihapus dari wishlist", product.name);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.8 }}
      aria-pressed={active}
      aria-label={active ? "Hapus dari wishlist" : "Simpan ke wishlist"}
      className={`relative flex items-center justify-center gap-1.5 ${className}`}
    >
      <motion.span
        initial={false}
        animate={{ scale: active ? [0.6, 1.3, 1] : 1 }}
        transition={{ duration: 0.4 }}
        className={`flex ${active ? "text-error" : ""}`}
      >
        <Icon name="favorite" fill={active} className="text-xl" />
      </motion.span>
      {withLabel && <span>{active ? "Tersimpan" : "Simpan"}</span>}
      {burst > 0 && (
        <span key={burst} className="pointer-events-none absolute inset-0" aria-hidden="true">
          {SPARKS.map((deg) => (
            <motion.span
              key={deg}
              className="absolute left-1/2 top-1/2 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-error"
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: Math.cos((deg * Math.PI) / 180) * 20,
                y: Math.sin((deg * Math.PI) / 180) * 20,
                scale: 0,
                opacity: 0,
              }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
          ))}
        </span>
      )}
    </motion.button>
  );
}
