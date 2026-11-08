import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { categoryName, stockInfo } from "../../data/products";
import { optionLabels } from "../../contexts/CartContext";
import { formatPrice } from "../../lib/format";
import Icon from "../ui/Icon";
import { AnimatedPrice } from "../ui/AnimatedNumber";
import QuantityStepper from "../ui/QuantityStepper";
import SmartImage from "../ui/SmartImage";

/** Baris produk di halaman keranjang (juga dipakai untuk item bonus). */
export default function CartItem({ item, bonus = false, onQty, onRemove, onSaveForLater }) {
  const { product } = item;
  const stock = stockInfo(product);
  const to = `/produk/${product.slug}`;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 80, transition: { duration: 0.25 } }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col gap-5 rounded-2xl border p-5 shadow-soft sm:flex-row ${
        bonus ? "border-dashed border-secondary/60 bg-secondary-fixed/30" : "border-outline-variant/40 bg-surface-container-lowest"
      }`}
    >
      <Link to={to} className="shrink-0">
        <SmartImage src={product.image} alt={product.name} className="h-40 w-full rounded-xl sm:h-28 sm:w-28" />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-0.5 text-label-sm font-label-sm uppercase tracking-wider text-outline">{categoryName(product.category)}</p>
            <h3 className="font-title-lg text-title-lg leading-snug text-on-surface">
              <Link to={to} className="transition-colors hover:text-primary">
                {product.name}
              </Link>
              {bonus && (
                <span className="ml-2 inline-flex items-center gap-1 rounded bg-secondary-container px-2 py-0.5 align-middle text-label-sm font-label-sm text-on-secondary-container">
                  <Icon name="card_giftcard" className="text-sm" />
                  BONUS
                </span>
              )}
            </h3>
          </div>
          {!bonus && (
            <button
              onClick={() => onRemove(item)}
              aria-label={`Hapus ${product.name}`}
              className="shrink-0 rounded-lg p-1.5 text-outline transition-colors hover:bg-error-container hover:text-error"
            >
              <Icon name="delete" className="text-xl" />
            </button>
          )}
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {optionLabels(item).map((opt) => (
            <span key={opt} className="rounded-md bg-surface-container px-2 py-0.5 text-label-md font-label-md text-on-surface-variant">
              {opt}
            </span>
          ))}
          {!bonus && stock.tone !== "ok" && (
            <span className="rounded-md bg-secondary-container px-2 py-0.5 text-label-md font-label-md text-on-secondary-container">{stock.label}</span>
          )}
        </div>

        {bonus && <p className="mb-3 text-body-sm text-outline">Bonus dari pembelian {item.from}</p>}

        <div className="flex flex-wrap items-center justify-between gap-4">
          {bonus ? (
            <span className="text-body-md text-on-surface-variant">Jumlah: {item.qty}</span>
          ) : (
            <div className="flex items-center gap-4">
              <QuantityStepper value={item.qty} onChange={(q) => onQty(item.key, q)} />
              <button
                onClick={() => onSaveForLater(item)}
                className="hidden items-center gap-1 text-label-md font-label-md text-primary hover:underline sm:inline-flex"
              >
                <Icon name="favorite" className="text-base" />
                Simpan ke wishlist
              </button>
            </div>
          )}
          <div className="text-right">
            {bonus ? (
              <>
                <p className="text-label-md text-outline line-through">{formatPrice(item.value)}</p>
                <p className="font-headline-sm text-headline-sm font-bold text-success">GRATIS</p>
              </>
            ) : (
              <>
                {item.originalTotal > item.total && <p className="text-label-md text-outline line-through">{formatPrice(item.originalTotal)}</p>}
                <AnimatedPrice value={item.total} className="font-headline-sm text-headline-sm font-bold text-primary" />
              </>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
