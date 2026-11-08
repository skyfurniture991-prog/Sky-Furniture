import { AnimatePresence, motion } from "framer-motion";
import { MAX_QTY } from "../../data/store";
import Icon from "./Icon";

export default function QuantityStepper({ value, onChange, min = 1, max = MAX_QTY, size = "md", label = "Jumlah" }) {
  const btn =
    size === "sm"
      ? "h-8 w-8 text-base"
      : "h-10 w-10 text-lg";

  return (
    <div
      className="inline-flex items-center overflow-hidden rounded-lg border border-outline-variant/70 bg-surface-container-lowest"
      role="group"
      aria-label={label}
    >
      <motion.button
        type="button"
        whileTap={{ scale: 0.85 }}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        aria-label="Kurangi"
        className={`${btn} flex items-center justify-center text-on-surface transition-colors hover:bg-surface-container disabled:opacity-30`}
      >
        <Icon name="remove" />
      </motion.button>
      <div className="relative flex h-full w-9 items-center justify-center overflow-hidden text-label-lg font-label-lg tabular-nums">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <motion.button
        type="button"
        whileTap={{ scale: 0.85 }}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        aria-label="Tambah"
        className={`${btn} flex items-center justify-center text-on-surface transition-colors hover:bg-surface-container disabled:opacity-30`}
      >
        <Icon name="add" />
      </motion.button>
    </div>
  );
}
