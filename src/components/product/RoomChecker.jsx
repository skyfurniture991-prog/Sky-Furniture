import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PRODUCTS } from "../../data/products";
import Icon from "../ui/Icon";

const toNum = (v) => {
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

/** Cek apakah sofa muat di ruangan (ruang gerak minimal sudah dihitung di product.minRoom). */
function evaluate(product, w, l) {
  const need = product.minRoom;
  const marginA = Math.min(w - need.w, l - need.l);
  const marginB = Math.min(l - need.w, w - need.l);
  const margin = Math.max(marginA, marginB);
  const swapped = marginB > marginA;
  if (margin >= 0.4) return { tone: "good", margin, swapped, title: "Muat dengan leluasa", icon: "check_circle" };
  if (margin >= 0) return { tone: "tight", margin, swapped, title: "Muat, ruang gerak terbatas", icon: "warning" };
  return { tone: "bad", margin, swapped, title: "Ruangan terlalu sempit", icon: "cancel" };
}

const TONES = {
  good: "border-success/40 bg-success-container text-on-success-container",
  tight: "border-secondary/40 bg-secondary-fixed text-on-secondary-fixed",
  bad: "border-error/40 bg-error-container text-on-error-container",
};

function Diagram({ product, w, l, swapped }) {
  const fp = product.footprint;
  const pw = (swapped ? fp.l : fp.p) / 100;
  const ph = (swapped ? fp.p : fp.l) / 100;
  const scale = Math.min(280 / Math.max(w, 0.5), 150 / Math.max(l, 0.5));
  const rw = w * scale;
  const rh = l * scale;
  const sw = Math.min(pw * scale, rw);
  const sh = Math.min(ph * scale, rh);

  return (
    <svg viewBox="0 0 320 190" className="mx-auto w-full max-w-xs" role="img" aria-label="Denah ruangan dengan posisi sofa">
      <motion.rect
        x={160 - rw / 2}
        y={95 - rh / 2}
        width={rw}
        height={rh}
        rx="6"
        className="fill-surface-container-low stroke-outline"
        strokeWidth="2"
        strokeDasharray="6 4"
        initial={false}
        animate={{ x: 160 - rw / 2, y: 95 - rh / 2, width: rw, height: rh }}
      />
      <motion.rect
        rx="6"
        className="fill-primary-container/80 stroke-primary"
        strokeWidth="1.5"
        initial={false}
        animate={{ x: 160 - rw / 2 + 8, y: 95 + rh / 2 - sh - 8, width: sw, height: sh }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
      />
      <text x="160" y="14" textAnchor="middle" className="fill-outline text-[10px]">
        {w.toFixed(1)} m
      </text>
      <text x="8" y="98" className="fill-outline text-[10px]" transform="rotate(-90 8 98)" textAnchor="middle">
        {l.toFixed(1)} m
      </text>
    </svg>
  );
}

export default function RoomChecker({ product }) {
  const [width, setWidth] = useState("3.5");
  const [length, setLength] = useState("3");
  const w = toNum(width);
  const l = toNum(length);
  const valid = w > 0 && l > 0;

  const result = useMemo(() => (valid ? evaluate(product, w, l) : null), [product, w, l, valid]);

  const alternatives = useMemo(() => {
    if (!result || result.tone !== "bad") return [];
    return PRODUCTS.filter(
      (p) =>
        p.id !== product.id &&
        p.category !== "aksesoris" &&
        evaluate(p, w, l).margin >= 0 &&
        p.footprint.p * p.footprint.l < product.footprint.p * product.footprint.l
    ).slice(0, 2);
  }, [result, product, w, l]);

  const need = product.minRoom;

  return (
    <section className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-soft sm:p-6" aria-labelledby="room-check-title">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-container text-primary">
          <Icon name="straighten" className="text-2xl" />
        </span>
        <div>
          <h3 id="room-check-title" className="font-title-lg text-title-lg text-on-surface">
            Cek Muat Ruangan
          </h3>
          <p className="text-body-sm text-on-surface-variant">
            Disarankan ruang minimal <strong className="text-on-surface">{need.w.toFixed(1)}m × {need.l.toFixed(1)}m</strong> agar tetap nyaman dilalui.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-3">
          {[
            { label: "Lebar ruangan (m)", value: width, set: setWidth },
            { label: "Panjang ruangan (m)", value: length, set: setLength },
          ].map((f) => (
            <label key={f.label} className="block">
              <span className="mb-1 block text-label-md font-label-md text-on-surface">{f.label}</span>
              <input
                type="number"
                inputMode="decimal"
                min="0.5"
                step="0.1"
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                className="field"
              />
            </label>
          ))}
          <motion.div
            key={result?.tone ?? "none"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-2.5 rounded-xl border p-3 ${result ? TONES[result.tone] : "border-outline-variant bg-surface-container"}`}
            aria-live="polite"
          >
            <Icon name={result?.icon ?? "info"} fill className="mt-0.5 text-2xl" />
            <div className="text-body-sm">
              <p className="font-label-lg text-label-lg">{result?.title ?? "Masukkan ukuran ruangan"}</p>
              {result && (
                <p className="opacity-90">
                  {result.margin >= 0
                    ? `Sisa ruang gerak sekitar ${Math.round(result.margin * 100)} cm.`
                    : `Kurang sekitar ${Math.abs(Math.round(result.margin * 100))} cm dari ukuran minimal.`}
                  {result.swapped && " Putar sofa mengikuti sisi ruangan yang lebih panjang."}
                </p>
              )}
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col justify-center">
          {valid && <Diagram product={product} w={w} l={l} swapped={result.swapped} />}
          <p className="mt-1 text-center text-[11px] text-outline">Ilustrasi denah (tampak atas) · tidak sesuai skala sebenarnya</p>
        </div>
      </div>

      {alternatives.length > 0 && (
        <div className="mt-4 border-t border-outline-variant/40 pt-4">
          <p className="mb-2 text-label-md font-label-md text-on-surface-variant">Alternatif yang muat di ruangan Anda:</p>
          <div className="flex flex-wrap gap-2">
            {alternatives.map((p) => (
              <Link key={p.id} to={`/produk/${p.slug}`} className="chip">
                {p.name}
                <Icon name="arrow_forward" className="text-base" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
