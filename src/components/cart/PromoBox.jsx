import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PROMO_CODES } from "../../data/store";
import { useCart } from "../../contexts/CartContext";
import { useToast } from "../../contexts/ToastContext";
import { formatPrice } from "../../lib/format";
import Icon from "../ui/Icon";

export default function PromoBox() {
  const { promo, promoCode, promoResult, subtotal, applyPromo, removePromo } = useCart();
  const toast = useToast();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const apply = (code) => {
    const result = applyPromo(code);
    if (result.valid) {
      setError("");
      setValue("");
      toast.success("Kode promo diterapkan", PROMO_CODES[result.code].label);
    } else {
      setError(result.message);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    apply(value);
  };

  // Kode tersimpan tetapi sudah tidak memenuhi syarat (mis. subtotal turun).
  const stale = promoCode && promoResult && !promoResult.valid;

  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        {promo ? (
          <motion.div
            key="applied"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-xl border border-success/40 bg-success-container p-3 text-on-success-container"
          >
            <Icon name="sell" fill className="text-2xl" />
            <div className="min-w-0 flex-1">
              <p className="font-label-lg text-label-lg tracking-wider">{promo.code}</p>
              <p className="text-body-sm opacity-90">{promo.label}</p>
            </div>
            <button onClick={removePromo} className="text-label-md font-label-md underline underline-offset-2 hover:opacity-70">
              Hapus
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} noValidate>
            <label htmlFor="promo-input" className="mb-1.5 block text-label-lg font-label-lg text-on-surface">
              Punya kode promo?
            </label>
            <div className="flex gap-2">
              <input
                id="promo-input"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value.toUpperCase());
                  setError("");
                }}
                placeholder="Contoh: SKYBIRU"
                className={`field !py-2.5 uppercase tracking-wider ${error ? "field-error" : ""}`}
                autoComplete="off"
              />
              <button type="submit" className="btn-tonal !px-5 !py-2.5">
                Pakai
              </button>
            </div>
            <AnimatePresence>
              {(error || stale) && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-1.5 flex items-start gap-1 text-body-sm text-error"
                >
                  <Icon name="error" className="mt-0.5 text-base" />
                  {error || promoResult.message}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.values(PROMO_CODES).map((p) => {
                const usable = subtotal >= p.min;
                return (
                  <button
                    type="button"
                    key={p.code}
                    onClick={() => apply(p.code)}
                    title={`${p.label} · min. ${formatPrice(p.min)}`}
                    className={`chip !px-2.5 !py-1 !text-[11px] ${usable ? "" : "opacity-50"}`}
                  >
                    <Icon name="sell" className="text-sm" />
                    {p.code}
                  </button>
                );
              })}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
