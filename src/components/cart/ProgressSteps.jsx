import { motion } from "framer-motion";
import Icon from "../ui/Icon";

const STEPS = ["Keranjang", "Pengiriman & Pembayaran", "Selesai"];

/** Indikator langkah belanja. `current` bernilai 0-2. */
export default function ProgressSteps({ current = 0 }) {
  return (
    <div className="border-b border-outline-variant/30 bg-surface-container-lowest py-5">
      <ol className="container-page mx-auto flex max-w-2xl items-center" aria-label="Langkah belanja">
        {STEPS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`} aria-current={active ? "step" : undefined}>
              <div className="flex items-center gap-2.5">
                <motion.span
                  initial={false}
                  animate={{ scale: active ? 1.1 : 1 }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-label-lg font-label-lg transition-colors ${
                    done || active
                      ? "bg-primary-container text-on-primary shadow-glow"
                      : "border border-outline-variant bg-surface-container text-on-surface-variant"
                  }`}
                >
                  {done ? <Icon name="check" className="text-xl" /> : i + 1}
                </motion.span>
                <span className={`hidden text-title-md font-title-md sm:block ${active ? "text-primary" : "text-on-surface-variant"}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mx-3 h-0.5 flex-1 overflow-hidden rounded-full bg-outline-variant/50">
                  <motion.div
                    className="h-full bg-primary-container"
                    initial={false}
                    animate={{ width: done ? "100%" : "0%" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
