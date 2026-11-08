import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PRODUCTS } from "../../data/products";
import { PROMO_CODES } from "../../data/store";
import { useToast } from "../../contexts/ToastContext";
import Icon from "../ui/Icon";
import { Reveal } from "../ui/Reveal";
import ProductGrid from "../product/ProductGrid";

const secondsUntilMidnight = () => {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((end - now) / 1000));
};

function Digit({ value, label }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white/10 font-headline-md text-2xl font-semibold tabular-nums text-inverse-on-surface ring-1 ring-white/15 sm:h-16 sm:w-16 sm:text-3xl">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            initial={{ y: "-70%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "70%", opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] font-label-sm uppercase tracking-widest text-inverse-on-surface/60">{label}</span>
    </div>
  );
}

function Countdown() {
  const [left, setLeft] = useState(secondsUntilMidnight);
  useEffect(() => {
    const t = setInterval(() => setLeft(secondsUntilMidnight()), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;
  return (
    <div className="flex items-center gap-2" role="timer" aria-label="Sisa waktu promo hari ini">
      <Digit value={h} label="Jam" />
      <span className="pb-5 text-2xl font-bold text-inverse-on-surface/40">:</span>
      <Digit value={m} label="Menit" />
      <span className="pb-5 text-2xl font-bold text-inverse-on-surface/40">:</span>
      <Digit value={s} label="Detik" />
    </div>
  );
}

export default function FlashSale() {
  const toast = useToast();
  const deals = [...PRODUCTS].filter((p) => p.category !== "aksesoris").sort((a, b) => b.discount - a.discount).slice(0, 4);
  const promo = PROMO_CODES.SKYBIRU;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(promo.code);
      toast.success("Kode promo disalin", `${promo.code} — ${promo.label}`);
    } catch {
      toast.info("Kode promo", promo.code);
    }
  };

  return (
    <section className="py-16 lg:py-20">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-inverse-surface via-[#0f2b45] to-primary p-6 text-inverse-on-surface shadow-lift sm:p-10">
            <div aria-hidden="true" className="dots-bg pointer-events-none absolute inset-0 opacity-10" />
            <motion.div
              aria-hidden="true"
              animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
              transition={{ repeat: Infinity, duration: 7 }}
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-secondary-container/40 blur-3xl"
            />
            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-3 py-1 text-label-sm font-label-sm uppercase tracking-wider text-on-secondary-container">
                  <motion.span animate={{ rotate: [0, 18, -12, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} className="flex">
                    <Icon name="bolt" fill className="text-base" />
                  </motion.span>
                  Promo Hari Ini
                </span>
                <h2 className="mt-3 font-headline-lg text-headline-lg text-inverse-on-surface sm:text-4xl">
                  Diskon Workshop Terbesar, Berakhir Tengah Malam
                </h2>
                <p className="mt-2 text-body-md text-inverse-on-surface/70">
                  Pilih koleksi dengan potongan terbaik hari ini. Tambahkan kode promo di keranjang untuk hemat lebih banyak.
                </p>
                <button
                  onClick={copy}
                  className="mt-5 inline-flex items-center gap-3 rounded-xl border border-dashed border-white/40 bg-white/10 px-4 py-2.5 text-left transition hover:bg-white/20"
                >
                  <Icon name="sell" className="text-2xl text-secondary-container" />
                  <span>
                    <span className="block font-headline-sm text-lg font-bold tracking-widest">{promo.code}</span>
                    <span className="block text-[11px] text-inverse-on-surface/70">{promo.label} · min. belanja Rp 1 juta</span>
                  </span>
                  <Icon name="content_copy" className="ml-2 text-xl text-inverse-on-surface/70" />
                </button>
              </div>
              <Countdown />
            </div>
          </div>
        </Reveal>

        <div className="mt-8">
          <ProductGrid products={deals} />
        </div>
        <Reveal className="mt-8 text-center">
          <Link to="/katalog?urut=diskon" className="btn-secondary">
            Lihat Semua Promo
            <Icon name="arrow_forward" className="text-xl" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
