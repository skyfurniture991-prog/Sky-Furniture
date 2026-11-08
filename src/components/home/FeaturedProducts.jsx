import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CATEGORIES, FEATURED_PRODUCTS } from "../../data/products";
import Icon from "../ui/Icon";
import { Reveal } from "../ui/Reveal";
import ProductCard from "../product/ProductCard";

const TABS = [{ id: "all", name: "Semua" }, ...CATEGORIES.filter((c) => c.id !== "aksesoris")];

export default function FeaturedProducts() {
  const [tab, setTab] = useState("all");

  const items = useMemo(
    () => (tab === "all" ? FEATURED_PRODUCTS : FEATURED_PRODUCTS.filter((p) => p.category === tab)),
    [tab]
  );

  return (
    <section className="py-16 lg:py-24">
      <div className="container-page">
        <Reveal className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">
              <Icon name="verified_user" className="text-base" />
              Produk Terlaris Sky Furniture Palembang
            </span>
            <h2 className="mt-2 max-w-2xl font-headline-lg text-headline-lg text-balance text-on-background sm:text-4xl sm:leading-[1.15]">
              Koleksi Sofa Pilihan Keluarga Indonesia
            </h2>
            <p className="mt-2 max-w-xl text-body-md text-on-surface-variant">
              Rangka kayu mahoni solid tahan rayap, busa densitas tinggi tanpa amblas, dan kain premium antibakteri.
            </p>
          </div>
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`relative shrink-0 rounded-full px-4 py-2 text-label-lg font-label-lg transition-colors ${
                  tab === t.id
                    ? "text-on-primary"
                    : "border border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant hover:border-primary-container hover:text-primary"
                }`}
              >
                {tab === t.id && (
                  <motion.span
                    layoutId="featured-tab"
                    className="absolute inset-0 rounded-full bg-primary-container shadow-glow"
                    transition={{ type: "spring", stiffness: 500, damping: 36 }}
                  />
                )}
                <span className="relative">{t.name}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Reveal className="mt-10 text-center">
          <Link to="/katalog" className="btn-secondary">
            Lihat Semua Koleksi
            <Icon name="arrow_forward" className="text-xl" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
