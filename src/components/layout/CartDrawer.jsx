import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { optionLabels, useCart } from "../../contexts/CartContext";
import { useToast } from "../../contexts/ToastContext";
import { useUI } from "../../contexts/UIContext";
import { formatPrice } from "../../lib/format";
import FreeShippingBar from "../cart/FreeShippingBar";
import Icon from "../ui/Icon";
import { AnimatedPrice } from "../ui/AnimatedNumber";
import { Drawer } from "../ui/Modal";
import QuantityStepper from "../ui/QuantityStepper";
import SmartImage from "../ui/SmartImage";

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUI();
  const { items, bonusItems, subtotal, count, updateQty, removeItem, restoreItem } = useCart();
  const toast = useToast();

  const handleRemove = (item) => {
    const removed = removeItem(item.key);
    toast.info("Produk dihapus", item.product.name, { label: "Batalkan", onClick: () => restoreItem(removed) });
  };

  return (
    <Drawer open={cartOpen} onClose={closeCart} label="Keranjang belanja">
      <div className="flex items-center justify-between border-b border-outline-variant/40 px-5 py-4">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Keranjang Belanja</h2>
          <p className="text-body-sm text-outline">{count} produk</p>
        </div>
        <button onClick={closeCart} aria-label="Tutup keranjang" className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-surface-container">
          <Icon name="close" />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-surface-container"
          >
            <Icon name="shopping_bag" className="text-5xl text-primary-container" />
          </motion.div>
          <div>
            <p className="font-title-lg text-title-lg text-on-surface">Keranjang masih kosong</p>
            <p className="mt-1 text-body-sm text-on-surface-variant">Temukan sofa impian Anda di katalog kami.</p>
          </div>
          <Link to="/katalog" onClick={closeCart} className="btn-primary">
            Jelajahi Katalog
          </Link>
        </div>
      ) : (
        <>
          <div className="flex-1 space-y-3 overflow-y-auto p-5" data-lenis-prevent>
            <FreeShippingBar subtotal={subtotal} />
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.key}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 60, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-3 rounded-xl border border-outline-variant/40 p-3"
                >
                  <Link to={`/produk/${item.product.slug}`} onClick={closeCart} className="shrink-0">
                    <SmartImage src={item.product.image} alt={item.product.name} className="h-20 w-20 rounded-lg" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/produk/${item.product.slug}`}
                        onClick={closeCart}
                        className="line-clamp-2 text-title-md font-title-md leading-snug text-on-surface hover:text-primary"
                      >
                        {item.product.name}
                      </Link>
                      <button onClick={() => handleRemove(item)} aria-label="Hapus" className="text-outline transition hover:text-error">
                        <Icon name="delete" className="text-xl" />
                      </button>
                    </div>
                    <p className="mt-0.5 truncate text-label-md font-label-md text-outline">{optionLabels(item).join(" · ")}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <QuantityStepper size="sm" value={item.qty} onChange={(q) => updateQty(item.key, q)} />
                      <span className="font-title-md text-title-md text-primary">{formatPrice(item.total)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {bonusItems.map((b) => (
                <motion.div
                  key={b.key}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 rounded-xl border border-dashed border-secondary/50 bg-secondary-fixed/30 p-3"
                >
                  <SmartImage src={b.product.image} alt={b.product.name} className="h-14 w-14 rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 text-label-md font-label-md text-secondary">
                      <Icon name="card_giftcard" className="text-base" /> BONUS
                    </p>
                    <p className="truncate text-title-md font-title-md text-on-surface">{b.product.name}</p>
                  </div>
                  <span className="text-label-lg font-label-lg text-success">GRATIS</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="space-y-3 border-t border-outline-variant/40 bg-surface-container-lowest p-5">
            <div className="flex items-baseline justify-between">
              <span className="text-body-md text-on-surface-variant">Subtotal</span>
              <AnimatedPrice value={subtotal} className="font-headline-sm text-headline-sm text-primary" />
            </div>
            <p className="text-label-md font-label-md text-outline">Ongkir & kode promo dihitung di halaman berikutnya.</p>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/keranjang" onClick={closeCart} className="btn-secondary">
                Lihat Keranjang
              </Link>
              <Link to="/checkout" onClick={closeCart} className="btn-primary">
                <Icon name="lock" className="text-lg" />
                Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
}
