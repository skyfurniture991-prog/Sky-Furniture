import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { categoryName } from "../../data/products";
import { useUI } from "../../contexts/UIContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { formatPrice } from "../../lib/format";
import { searchProducts } from "../../lib/search";
import { useLocalStorage } from "../../lib/useLocalStorage";
import { EASE } from "../../lib/motion";
import { useScrollLock } from "../../lib/useScrollLock";
import Icon from "../ui/Icon";

import SmartImage from "../ui/SmartImage";

const POPULAR = ["Sofa L", "Retro", "Beludru", "Boucle", "Meja kopi", "Chesterfield"];

function SearchPanel({ onClose }) {
  const navigate = useNavigate();
  const wishlist = useWishlist();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [recentQueries, setRecentQueries] = useLocalStorage("sky.searches.v1", []);
  const listRef = useRef(null);

  const results = useMemo(() => (query.trim() ? searchProducts(query, 6) : []), [query]);
  const hasQuery = query.trim().length > 0;
  const totalRows = results.length + (hasQuery ? 1 : 0);

  const remember = (q) => {
    const v = q.trim();
    if (v) setRecentQueries((prev) => [v, ...prev.filter((x) => x.toLowerCase() !== v.toLowerCase())].slice(0, 5));
  };

  const goProduct = (p) => {
    remember(query);
    onClose();
    navigate(`/produk/${p.slug}`);
  };

  const goCatalog = (q) => {
    remember(q);
    onClose();
    navigate(`/katalog?q=${encodeURIComponent(q.trim())}`);
  };

  const onKeyDown = (e) => {
    if (!hasQuery) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % totalRows);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + totalRows) % totalRows);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active < results.length) goProduct(results[active]);
      else goCatalog(query);
    }
  };

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <div className="fixed inset-0 z-[110] flex items-start justify-center px-4 pt-[10vh]" role="dialog" aria-modal="true" aria-label="Pencarian produk">
      <motion.div
        className="absolute inset-0 bg-inverse-surface/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: -24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-lift"
      >
        <div className="flex items-center gap-3 border-b border-outline-variant/40 px-5">
          <Icon name="search" className="text-2xl text-primary-container" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Cari sofa, bahan, warna, atau aksesoris..."
            className="h-16 flex-1 bg-transparent text-body-lg text-on-surface placeholder:text-outline"
            aria-label="Kata kunci pencarian"
          />
          <button onClick={onClose} className="rounded-md border border-outline-variant/70 px-2 py-1 text-[11px] font-semibold text-outline hover:text-on-surface">
            ESC
          </button>
        </div>

        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-3" data-lenis-prevent>
          {hasQuery ? (
            <>
              {results.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <Icon name="search_off" className="text-5xl text-outline" />
                  <p className="font-title-md text-title-md text-on-surface">Tidak ada hasil untuk &ldquo;{query}&rdquo;</p>
                  <p className="text-body-sm text-on-surface-variant">Coba kata kunci lain, misalnya &ldquo;sofa L&rdquo; atau &ldquo;retro&rdquo;.</p>
                </div>
              )}
              {results.map((p, i) => (
                <button
                  key={p.id}
                  data-active={active === i}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => goProduct(p)}
                  className={`flex w-full items-center gap-4 rounded-xl p-2.5 text-left transition-colors ${
                    active === i ? "bg-surface-container" : ""
                  }`}
                >
                  <SmartImage src={p.image} alt="" className="h-14 w-14 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-title-md font-title-md text-on-surface">{p.name}</p>
                    <p className="truncate text-body-sm text-outline">
                      {categoryName(p.category)} · {p.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-title-md font-title-md text-primary">{formatPrice(p.price)}</span>
                </button>
              ))}
              {results.length > 0 && (
                <button
                  data-active={active === results.length}
                  onMouseEnter={() => setActive(results.length)}
                  onClick={() => goCatalog(query)}
                  className={`mt-1 flex w-full items-center justify-between rounded-xl px-4 py-3 text-label-lg font-label-lg text-primary transition-colors ${
                    active === results.length ? "bg-surface-container" : ""
                  }`}
                >
                  Lihat semua hasil untuk &ldquo;{query}&rdquo;
                  <Icon name="arrow_forward" className="text-xl" />
                </button>
              )}
            </>
          ) : (
            <div className="space-y-6 p-2">
              {recentQueries.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="eyebrow !text-outline">Terakhir dicari</p>
                    <button onClick={() => setRecentQueries([])} className="text-label-md font-label-md text-primary hover:underline">
                      Hapus
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentQueries.map((q) => (
                      <button key={q} onClick={() => goCatalog(q)} className="chip">
                        <Icon name="history" className="text-base" />
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="eyebrow mb-2 !text-outline">Pencarian populer</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR.map((q) => (
                    <button key={q} onClick={() => goCatalog(q)} className="chip">
                      <Icon name="trending_up" className="text-base" />
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              {wishlist.recent.length > 0 && (
                <div>
                  <p className="eyebrow mb-2 !text-outline">Baru Anda lihat</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {wishlist.recent.slice(0, 4).map((p) => (
                      <button key={p.id} onClick={() => goProduct(p)} className="group text-left">
                        <SmartImage src={p.image} alt="" className="aspect-[4/3] rounded-lg" imgClassName="transition-transform duration-500 group-hover:scale-105" />
                        <p className="mt-1.5 truncate text-label-lg font-label-lg text-on-surface">{p.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden items-center gap-4 border-t border-outline-variant/40 bg-surface px-5 py-2.5 text-[11px] text-outline sm:flex">
          <span className="flex items-center gap-1"><kbd className="rounded border border-outline-variant/70 px-1">↑</kbd><kbd className="rounded border border-outline-variant/70 px-1">↓</kbd> navigasi</span>
          <span className="flex items-center gap-1"><kbd className="rounded border border-outline-variant/70 px-1">Enter</kbd> pilih</span>
          <span className="flex items-center gap-1"><kbd className="rounded border border-outline-variant/70 px-1">Esc</kbd> tutup</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function SearchOverlay() {
  const { searchOpen, openSearch, closeSearch } = useUI();
  useScrollLock(searchOpen);

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target?.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        openSearch();
      } else if (e.key === "Escape") {
        closeSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSearch, closeSearch]);

  return createPortal(
    <AnimatePresence>{searchOpen && <SearchPanel key="search" onClose={closeSearch} />}</AnimatePresence>,
    document.body
  );
}
