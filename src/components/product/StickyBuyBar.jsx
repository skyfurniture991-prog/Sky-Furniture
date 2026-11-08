import { useEffect, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { formatPrice } from "../../lib/format";
import { useAddToCart } from "../../lib/useAddToCart";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";

/** Bar beli yang muncul saat tombol utama di konfigurator keluar dari layar. */
export default function StickyBuyBar({ product, opts, targetRef }) {
  const inView = useInView(targetRef, { margin: "0px 0px -60px 0px" });
  const add = useAddToCart();
  // Tunda sedikit agar tidak berkedip sebelum IntersectionObserver siap.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {ready && !inView && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant/40 bg-surface-container-lowest/90 shadow-lift backdrop-blur-xl"
        >
          <div className="container-page flex items-center gap-4 py-3 pr-24 sm:pr-28">
            <SmartImage src={product.image} alt="" className="hidden h-12 w-12 shrink-0 rounded-lg sm:block" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-title-md font-title-md text-on-surface">{product.name}</p>
              <p className="text-label-lg font-label-lg text-primary">{formatPrice(opts.total)}</p>
            </div>
            <button onClick={() => add(product, opts.payload)} className="btn-primary !px-4 !py-2.5 sm:!px-6">
              <Icon name="add_shopping_cart" className="text-xl" />
              <span className="hidden sm:inline">Tambah ke Keranjang</span>
              <span className="sm:hidden">Tambah</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
