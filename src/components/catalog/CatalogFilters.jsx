import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORIES, COLOR_LIST, MATERIAL_NAMES, PRODUCTS } from "../../data/products";
import { formatPrice } from "../../lib/format";
import Icon from "../ui/Icon";
import RatingStars from "../product/RatingStars";
import { PRICE_MAX, PRICE_MIN, PRICE_STEP } from "./catalogQuery";

function Section({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-outline-variant/30 py-4 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="text-label-md font-label-md uppercase tracking-wider text-on-surface">{title}</h3>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-outline">
          <Icon name="expand_more" className="text-xl" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const toggleIn = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

function PriceInput({ label, value, onCommit }) {
  const [draft, setDraft] = useState(null);
  const shown = draft ?? (value ? value.toLocaleString("id-ID") : "0");
  const commit = () => {
    if (draft !== null) {
      const n = Number(draft.replace(/\D/g, ""));
      onCommit(Number.isFinite(n) ? n : value);
      setDraft(null);
    }
  };
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-label-sm uppercase tracking-wider text-outline">{label}</span>
      <div className="flex items-center rounded-lg border border-outline-variant/70 bg-surface-container-lowest focus-within:border-primary-container focus-within:ring-4 focus-within:ring-primary-container/15">
        <span className="pl-3 text-body-sm text-outline">Rp</span>
        <input
          inputMode="numeric"
          value={shown}
          onFocus={() => setDraft(String(value))}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          className="w-full bg-transparent px-2 py-2 text-body-sm text-on-surface"
        />
      </div>
    </label>
  );
}

export default function CatalogFilters({ filters, onChange, onReset }) {
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.id, PRODUCTS.filter((p) => p.category === c.id).length]));

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <h2 className="font-title-lg text-title-lg text-on-surface">Filter Produk</h2>
        <button onClick={onReset} className="text-label-md font-label-md text-primary hover:underline">
          Reset Semua
        </button>
      </div>

      <Section title="Kategori">
        <div className="space-y-1">
          {CATEGORIES.map((c) => {
            const checked = filters.kategori.includes(c.id);
            return (
              <label key={c.id} className="group flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 transition-colors hover:bg-surface-container-low">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onChange({ kategori: toggleIn(filters.kategori, c.id) })}
                  className="h-4 w-4 rounded border-outline-variant accent-primary-container"
                />
                <span className={`flex-1 text-body-md transition-colors ${checked ? "font-semibold text-primary" : "text-on-surface group-hover:text-primary"}`}>
                  {c.name}
                </span>
                <span className="rounded bg-surface-container px-1.5 py-0.5 text-label-sm text-outline">{counts[c.id]}</span>
              </label>
            );
          })}
        </div>
      </Section>

      <Section title="Rentang Harga">
        <div className="mb-3 grid grid-cols-2 gap-2">
          <PriceInput label="Minimum" value={filters.min} onCommit={(v) => onChange({ min: Math.min(v, filters.max) })} />
          <PriceInput label="Maksimum" value={filters.max} onCommit={(v) => onChange({ max: Math.max(v, filters.min) })} />
        </div>
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={filters.max}
          onChange={(e) => onChange({ max: Math.max(Number(e.target.value), filters.min) })}
          className="w-full accent-primary-container"
          aria-label="Harga maksimum"
        />
        <div className="mt-1 flex justify-between text-[11px] text-outline">
          <span>{formatPrice(PRICE_MIN)}</span>
          <span>{formatPrice(PRICE_MAX)}</span>
        </div>
      </Section>

      <Section title="Bahan Cover">
        <div className="flex flex-wrap gap-2">
          {MATERIAL_NAMES.map((m) => (
            <button
              key={m}
              onClick={() => onChange({ bahan: toggleIn(filters.bahan, m) })}
              aria-pressed={filters.bahan.includes(m)}
              className={`chip ${filters.bahan.includes(m) ? "chip-active" : ""}`}
            >
              {m}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Warna">
        <div className="flex flex-wrap gap-2.5">
          {COLOR_LIST.map((c) => {
            const on = filters.warna.includes(c.key);
            const light = c.hex === "#f1f5f9";
            return (
              <motion.button
                key={c.key}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onChange({ warna: toggleIn(filters.warna, c.key) })}
                aria-pressed={on}
                aria-label={c.name}
                title={c.name}
                className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-shadow ${light ? "border border-outline-variant" : ""} ${
                  on ? "ring-2 ring-primary-container ring-offset-2 ring-offset-surface-container-lowest" : ""
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {on && <Icon name="check" className={`text-base ${light || c.key === "amber" || c.key === "azure" || c.key === "oak" ? "text-inverse-surface" : "text-white"}`} />}
              </motion.button>
            );
          })}
        </div>
      </Section>

      <Section title="Rating Minimal">
        <div className="space-y-1">
          {[
            { value: "", label: "Semua rating" },
            { value: "4.5", label: "4.5 ke atas", stars: 4.5 },
            { value: "4", label: "4.0 ke atas", stars: 4 },
          ].map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 hover:bg-surface-container-low">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === opt.value}
                onChange={() => onChange({ rating: opt.value })}
                className="accent-primary-container"
              />
              {opt.stars ? <RatingStars rating={opt.stars} /> : null}
              <span className="text-body-sm text-on-surface-variant">{opt.label}</span>
            </label>
          ))}
        </div>
      </Section>
    </div>
  );
}
