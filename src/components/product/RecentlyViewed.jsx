import { useWishlist } from "../../contexts/WishlistContext";
import { Reveal } from "../ui/Reveal";
import ProductGrid from "./ProductGrid";

/** Produk yang terakhir dilihat pengguna (disimpan lokal). */
export default function RecentlyViewed({ excludeId, limit = 4, className = "mt-20" }) {
  const { recent } = useWishlist();
  const list = recent.filter((p) => p.id !== excludeId).slice(0, limit);
  if (list.length === 0) return null;

  return (
    <section className={className}>
      <Reveal className="mb-6">
        <span className="eyebrow">Untuk Anda</span>
        <h2 className="mt-1 font-headline-md text-headline-md text-on-surface">Terakhir Anda Lihat</h2>
      </Reveal>
      <ProductGrid products={list} layout="compact" />
    </section>
  );
}
