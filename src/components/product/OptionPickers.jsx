import { useId } from "react";
import { motion } from "framer-motion";
import { MATERIALS } from "../../data/products";
import { formatPrice } from "../../lib/format";
import { materialDelta } from "../../lib/pricing";
import Icon from "../ui/Icon";

export function ColorPicker({ colors, value, onChange, size = "md" }) {
  const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const groupId = useId();
  return (
    <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Pilihan warna">
      {colors.map((c) => {
        const active = value === c.name;
        const light = c.hex === "#f1f5f9" || c.hex === "#ffffff";
        return (
          <motion.button
            key={c.key}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={c.name}
            title={c.name}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(c.name)}
            className={`relative flex ${dim} items-center justify-center rounded-full ${
              light ? "border border-outline-variant" : ""
            }`}
            style={{ backgroundColor: c.hex }}
          >
            {active && (
              <>
                <motion.span
                  layoutId={`color-ring-${groupId}`}
                  className="absolute -inset-1.5 rounded-full border-2 border-primary-container"
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                />
                <Icon
                  name="check"
                  className={`text-lg ${light || c.hex === "#febc79" || c.hex === "#38bdf8" ? "text-inverse-surface" : "text-white"}`}
                />
              </>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

export function MaterialPicker({ product, value, onChange, cols = "grid-cols-2 sm:grid-cols-3" }) {
  const list = MATERIALS.filter((m) => product.materials.includes(m.name));
  return (
    <div className={`grid gap-2 ${cols}`} role="radiogroup" aria-label="Pilihan bahan cover">
      {list.map((m) => {
        const active = value === m.name;
        const delta = materialDelta(product, m.name);
        return (
          <button
            key={m.name}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(m.name)}
            className={`relative rounded-lg border px-3 py-2.5 text-left transition-all ${
              active
                ? "border-primary-container bg-primary-container/10 shadow-soft"
                : "border-outline-variant/60 hover:border-primary-container/60"
            }`}
          >
            <span className={`block text-label-lg font-label-lg ${active ? "text-primary" : "text-on-surface"}`}>{m.name}</span>
            <span className="block text-[11px] text-outline">
              {delta === 0 ? m.desc : `${delta > 0 ? "+" : "−"}${formatPrice(Math.abs(delta))}`}
            </span>
            {active && (
              <Icon name="check_circle" fill className="absolute right-2 top-2 text-lg text-primary-container" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function OrientationPicker({ value, onChange }) {
  const opts = [
    { id: "kiri", label: "Sudut Kiri", sub: "L-Kiri" },
    { id: "kanan", label: "Sudut Kanan", sub: "L-Kanan" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Orientasi sudut sofa">
      {opts.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.id)}
            className={`flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all ${
              active ? "border-primary-container bg-primary-container/10" : "border-outline-variant/50 hover:border-outline"
            }`}
          >
            <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${active ? "bg-primary-container text-on-primary" : "bg-surface-container text-on-surface-variant"}`}>
              <Icon name="chair" className={`text-xl ${o.id === "kanan" ? "-scale-x-100" : ""}`} />
            </span>
            <span>
              <span className={`block text-label-lg font-label-lg ${active ? "text-primary" : "text-on-surface"}`}>{o.label}</span>
              <span className="block text-[11px] text-outline">{o.sub}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
