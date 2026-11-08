import { PRODUCTS } from "../../data/products";
import { searchProducts } from "../../lib/search";

export const PER_PAGE = 9;
export const PRICE_MIN = 0;
export const PRICE_MAX = 8000000;
export const PRICE_STEP = 100000;

export const SORTS = [
  { id: "unggulan", label: "Unggulan" },
  { id: "terlaris", label: "Terlaris" },
  { id: "terbaru", label: "Terbaru" },
  { id: "diskon", label: "Diskon Terbesar" },
  { id: "harga-asc", label: "Harga: Terendah" },
  { id: "harga-desc", label: "Harga: Tertinggi" },
  { id: "rating", label: "Rating Terbaik" },
];

const list = (v) => (v ? v.split(",").filter(Boolean) : []);
const num = (v, fallback) => {
  const n = Number(v);
  return v !== null && v !== "" && Number.isFinite(n) ? n : fallback;
};

/** Mengubah URLSearchParams menjadi objek filter yang rapi. */
export function parseFilters(params) {
  return {
    q: params.get("q") ?? "",
    kategori: list(params.get("kategori")),
    bahan: list(params.get("bahan")),
    warna: list(params.get("warna")),
    rating: params.get("rating") ?? "",
    min: num(params.get("min"), PRICE_MIN),
    max: num(params.get("max"), PRICE_MAX),
    urut: SORTS.some((s) => s.id === params.get("urut")) ? params.get("urut") : "unggulan",
    hal: Math.max(1, num(params.get("hal"), 1)),
    tampilan: params.get("tampilan") === "list" ? "list" : "grid",
  };
}

const sorters = {
  unggulan: (a, b) => Number(b.featured) - Number(a.featured) || b.soldCount - a.soldCount,
  terlaris: (a, b) => b.soldCount - a.soldCount,
  terbaru: (a, b) => a.daysOld - b.daysOld,
  diskon: (a, b) => b.discount - a.discount,
  "harga-asc": (a, b) => a.price - b.price,
  "harga-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
};

export function filterProducts(f) {
  let items = f.q ? searchProducts(f.q) : [...PRODUCTS];

  if (f.kategori.length) items = items.filter((p) => f.kategori.includes(p.category));
  if (f.bahan.length) items = items.filter((p) => f.bahan.some((m) => p.materials.includes(m)));
  if (f.warna.length) items = items.filter((p) => p.colors.some((c) => f.warna.includes(c.key)));
  if (f.rating) items = items.filter((p) => p.rating >= Number(f.rating));
  items = items.filter((p) => p.price >= f.min && p.price <= f.max);

  // Saat mencari, urutan relevansi dipertahankan kecuali pengguna memilih urutan lain.
  if (!(f.q && f.urut === "unggulan")) items.sort(sorters[f.urut]);
  return items;
}

export const activeFilterCount = (f) =>
  f.kategori.length +
  f.bahan.length +
  f.warna.length +
  (f.rating ? 1 : 0) +
  (f.min > PRICE_MIN || f.max < PRICE_MAX ? 1 : 0) +
  (f.q ? 1 : 0);
