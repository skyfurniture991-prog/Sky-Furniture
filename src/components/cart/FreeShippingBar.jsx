import { motion } from "framer-motion";
import { FREE_SHIPPING_THRESHOLD } from "../../data/store";
import { formatPrice } from "../../lib/format";
import Icon from "../ui/Icon";

/** Progres menuju gratis ongkir. */
export default function FreeShippingBar({ subtotal, className = "" }) {
  const progress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);
  const done = progress >= 1;

  return (
    <div className={`rounded-xl border border-tertiary/20 bg-tertiary-fixed/50 p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <motion.span
          animate={done ? { rotate: [0, -12, 12, 0], scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.6 }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tertiary text-on-tertiary"
        >
          <Icon name={done ? "celebration" : "local_shipping"} className="text-xl" />
        </motion.span>
        <p className="text-body-sm text-on-surface">
          {done ? (
            <>
              Selamat! Pesanan Anda mendapat <strong className="text-primary">gratis ongkir</strong> Sky Direct.
            </>
          ) : (
            <>
              Tambah <strong className="text-primary">{formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> lagi untuk
              mendapat <strong>gratis ongkir</strong>.
            </>
          )}
        </p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-container-lowest/80">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary-container to-tertiary-fixed-dim"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
