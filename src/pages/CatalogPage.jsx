import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { Link, useSearchParams } from "react-router-dom";
import CatalogFilters from "../components/catalog/CatalogFilters";
import {
  PER_PAGE,
  PRICE_MAX,
  PRICE_MIN,
  SORTS,
  activeFilterCount,
  filterProducts,
  parseFilters,
} from "../components/catalog/catalogQuery";
import ProductCard from "../components/product/ProductCard";
import RecentlyViewed from "../components/product/RecentlyViewed";
import Breadcrumb from "../components/ui/Breadcrumb";
import Icon from "../components/ui/Icon";
import { Drawer } from "../components/ui/Modal";
import { CATEGORIES, COLORS, categoryName } from "../data/products";
import { formatPrice } from "../lib/format";
import { useDocumentTitle } from "../lib/useDocumentTitle";

function EmptyState({ onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-6 py-16 text-center"
    >
      <motion.div
        animate={{ rotate: [0, -8, 8, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container"
      >
        <Icon name="search_off" className="text-5xl text-primary-container" />
      </motion.div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface">Produk tidak ditemukan</h3>
      <p className="mt-1 max-w-sm text-body-md text-on-surface-variant">
        Tidak ada produk yang cocok dengan filter Anda. Coba longgarkan filter atau reset pencarian.
      </p>
      <button onClick={onReset} className="btn-primary mt-6">
        <Icon name="restart_alt" className="text-xl" />
        Reset Semua Filter
      </button>
    </motion.div>
  );
}

function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Halaman">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Halaman sebelumnya"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition hover:border-primary-container hover:text-primary disabled:opacity-30"
      >
        <Icon name="arrow_back" className="text-xl" />
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          aria-current={n === page ? "page" : undefined}
          className={`relative h-10 w-10 rounded-lg text-label-lg font-label-lg transition-colors ${
            n === page ? "text-on-primary" : "border border-outline-variant text-on-surface hover:border-primary-container hover:text-primary"
          }`}
        >
          {n === page && (
            <motion.span
              layoutId="page-pill"
              className="absolute inset-0 rounded-lg bg-primary-container"
              transition={{ type: "spring", stiffness: 500, damping: 36 }}
            />
          )}
          <span className="relative">{n}</span>
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === pages}
        aria-label="Halaman berikutnya"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition hover:border-primary-container hover:text-primary disabled:opacity-30"
      >
        <Icon name="arrow_forward" className="text-xl" />
      </button>
    </nav>
  );
}

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const lenis = useLenis();
  const filters = useMemo(() => parseFilters(params), [params]);

  useDocumentTitle(filters.q ? `Hasil “${filters.q}”` : "Katalog Sofa Premium");

  const update = useCallback(
    (patch, { keepPage = false } = {}) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([key, value]) => {
            const v = Array.isArray(value) ? value.join(",") : value;
            const isDefault =
              v === "" ||
              v == null ||
              (key === "min" && Number(v) <= PRICE_MIN) ||
              (key === "max" && Number(v) >= PRICE_MAX) ||
              (key === "urut" && v === "unggulan") ||
              (key === "tampilan" && v === "grid") ||
              (key === "hal" && Number(v) <= 1);
            if (isDefault) next.delete(key);
            else next.set(key, String(v));
          });
          if (!keepPage && !("hal" in patch)) next.delete("hal");
          return next;
        },
        { replace: true }
      );
    },
    [setParams]
  );

  const reset = () => setParams({}, { replace: true });

  const results = useMemo(() => filterProducts(filters), [filters]);
  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const page = Math.min(filters.hal, pages);
  const visible = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const activeCount = activeFilterCount(filters);

  const goPage = (n) => {
    update({ hal: n }, { keepPage: true });
    const top = document.getElementById("hasil-katalog");
    if (top) lenis?.scrollTo(top, { offset: -110 });
  };

  const chips = [
    ...(filters.q ? [{ key: "q", label: `“${filters.q}”`, clear: () => update({ q: "" }) }] : []),
    ...filters.kategori.map((id) => ({
      key: `k-${id}`,
      label: categoryName(id),
      clear: () => update({ kategori: filters.kategori.filter((x) => x !== id) }),
    })),
    ...filters.bahan.map((m) => ({ key: `b-${m}`, label: m, clear: () => update({ bahan: filters.bahan.filter((x) => x !== m) }) })),
    ...filters.warna.map((c) => ({
      key: `w-${c}`,
      label: COLORS[c]?.name ?? c,
      clear: () => update({ warna: filters.warna.filter((x) => x !== c) }),
    })),
    ...(filters.rating ? [{ key: "r", label: `Rating ${filters.rating}+`, clear: () => update({ rating: "" }) }] : []),
    ...(filters.min > PRICE_MIN || filters.max < PRICE_MAX
      ? [
          {
            key: "p",
            label: `${formatPrice(filters.min)} – ${formatPrice(filters.max)}`,
            clear: () => update({ min: PRICE_MIN, max: PRICE_MAX }),
          },
        ]
      : []),
  ];

  const isList = filters.tampilan === "list";

  return (
    <>
      <section className="relative overflow-hidden border-b border-outline-variant/30 bg-gradient-to-b from-surface-container-low to-surface-container-lowest py-8 lg:py-10">
        <div className="dots-bg pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="container-page relative">
          <Breadcrumb
            className="mb-4"
            items={[{ label: "Beranda", href: "/", icon: "home" }, { label: "Katalog Sofa" }]}
          />
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="eyebrow">
                <Icon name="verified" className="text-base" />
                Koleksi Unggulan Jepara
              </span>
              <h1 className="mt-2 font-headline-xl text-headline-xl text-on-background">
                {filters.q ? (
                  <>
                    Hasil untuk <span className="text-primary">“{filters.q}”</span>
                  </>
                ) : (
                  "Katalog Sofa Premium"
                )}
              </h1>
              <p className="mt-1 text-body-md text-on-surface-variant">
                Menampilkan <span className="font-semibold text-primary">{results.length}</span> produk
                {activeCount > 0 && " sesuai filter Anda"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="sr-only" htmlFor="sort-select">Urutkan</label>
              <div className="relative">
                <select
                  id="sort-select"
                  value={filters.urut}
                  onChange={(e) => update({ urut: e.target.value })}
                  className="field cursor-pointer appearance-none !py-2.5 !pr-10 text-body-sm"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <Icon name="expand_more" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xl text-outline" />
              </div>
              <div className="relative hidden rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-1 sm:flex">
                {[
                  { id: "grid", icon: "grid_view", label: "Tampilan grid" },
                  { id: "list", icon: "view_list", label: "Tampilan daftar" },
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => update({ tampilan: v.id }, { keepPage: true })}
                    aria-label={v.label}
                    aria-pressed={filters.tampilan === v.id}
                    className={`relative flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
                      filters.tampilan === v.id ? "text-on-primary" : "text-on-surface-variant hover:text-primary"
                    }`}
                  >
                    {filters.tampilan === v.id && (
                      <motion.span
                        layoutId="view-pill"
                        className="absolute inset-0 rounded-md bg-primary-container"
                        transition={{ type: "spring", stiffness: 500, damping: 36 }}
                      />
                    )}
                    <Icon name={v.icon} className="relative text-xl" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="no-scrollbar -mx-1 mt-6 flex gap-2 overflow-x-auto px-1 pb-1">
            {[{ id: "all", name: "Semua" }, ...CATEGORIES].map((c) => {
              const active = c.id === "all" ? filters.kategori.length === 0 : filters.kategori.length === 1 && filters.kategori[0] === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => update({ kategori: c.id === "all" ? [] : [c.id] })}
                  className={`relative shrink-0 rounded-full px-4 py-2 text-label-lg font-label-lg transition-colors ${
                    active ? "text-on-primary" : "border border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant hover:border-primary-container hover:text-primary"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="cat-pill"
                      className="absolute inset-0 rounded-full bg-primary-container shadow-glow"
                      transition={{ type: "spring", stiffness: 500, damping: 36 }}
                    />
                  )}
                  <span className="relative">{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div id="hasil-katalog" className="container-page py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-soft custom-scrollbar" data-lenis-prevent>
              <CatalogFilters filters={filters} onChange={update} onReset={reset} />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <button onClick={() => setFilterOpen(true)} className="btn-secondary !px-4 !py-2 lg:!hidden">
                <Icon name="tune" className="text-xl" />
                Filter
                {activeCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-container px-1 text-[11px] text-on-primary">
                    {activeCount}
                  </span>
                )}
              </button>
              <AnimatePresence initial={false}>
                {chips.map((chip) => (
                  <motion.span
                    key={chip.key}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1 rounded-full bg-surface-container py-1 pl-3 pr-1.5 text-label-md font-label-md text-primary"
                  >
                    {chip.label}
                    <button onClick={chip.clear} aria-label={`Hapus filter ${chip.label}`} className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-primary-container hover:text-on-primary">
                      <Icon name="close" className="text-sm" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
              {chips.length > 1 && (
                <button onClick={reset} className="text-label-md font-label-md text-outline underline-offset-2 hover:text-error hover:underline">
                  Hapus semua
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <EmptyState onReset={reset} />
            ) : (
              <div className={`grid gap-6 ${isList ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"}`}>
                <AnimatePresence mode="popLayout" initial={false}>
                  {visible.map((p, i) => (
                    <motion.div
                      key={`${p.id}-${filters.tampilan}`}
                      layout
                      initial={{ opacity: 0, y: 24, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full"
                    >
                      <ProductCard product={p} layout={isList ? "list" : "grid"} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            <Pagination page={page} pages={pages} onChange={goPage} />

            {results.length > 0 && (
              <p className="mt-4 text-center text-body-sm text-outline">
                Halaman {page} dari {pages} · Butuh model khusus?{" "}
                <Link to="/" className="text-primary hover:underline">
                  Konsultasi custom
                </Link>
              </p>
            )}
          </div>
        </div>

        <RecentlyViewed />
      </div>

      <Drawer open={filterOpen} onClose={() => setFilterOpen(false)} side="bottom" label="Filter produk">
        <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-outline-variant" />
        <div className="flex-1 overflow-y-auto px-5 pb-4 pt-2" data-lenis-prevent>
          <CatalogFilters filters={filters} onChange={update} onReset={reset} />
        </div>
        <div className="border-t border-outline-variant/40 p-4">
          <button onClick={() => setFilterOpen(false)} className="btn-primary w-full">
            Tampilkan {results.length} Produk
          </button>
        </div>
      </Drawer>
    </>
  );
}
