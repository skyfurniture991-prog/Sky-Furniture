import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import Breadcrumb from "../components/ui/Breadcrumb";
import Icon from "../components/ui/Icon";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export default function WishlistPage() {
  const { products, clear } = useWishlist();
  const { addItem } = useCart();
  const toast = useToast();
  useDocumentTitle("Wishlist");

  const addAll = () => {
    products.forEach((p) => addItem(p));
    toast.success("Semua produk ditambahkan ke keranjang", `${products.length} produk dengan pilihan bawaan.`, { label: "Lihat Keranjang", to: "/keranjang" });
  };

  return (
    <main className="container-page py-8 lg:py-12">
      <Breadcrumb className="mb-6" items={[{ label: "Beranda", href: "/", icon: "home" }, { label: "Wishlist" }]} />

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="eyebrow">Tersimpan</span>
          <h1 className="mt-2 font-headline-xl text-headline-xl text-on-background">
            Wishlist <span className="ml-1 font-body-lg text-body-lg text-outline">({products.length})</span>
          </h1>
        </div>
        {products.length > 0 && (
          <div className="flex gap-2">
            <button onClick={clear} className="btn-secondary !py-2.5 hover:!border-error hover:!text-error">
              <Icon name="delete" className="text-xl" />
              Kosongkan
            </button>
            <button onClick={addAll} className="btn-primary !py-2.5">
              <Icon name="add_shopping_cart" className="text-xl" />
              Tambah Semua ke Keranjang
            </button>
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-6 py-20 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-error-container"
          >
            <Icon name="favorite" fill className="text-5xl text-error" />
          </motion.div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Wishlist masih kosong</h2>
          <p className="mt-2 max-w-md text-body-md text-on-surface-variant">
            Tekan ikon hati pada produk untuk menyimpannya di sini dan membandingkannya nanti.
          </p>
          <Link to="/katalog" className="btn-primary mt-6">
            Jelajahi Katalog
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {products.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35 }}
                className="h-full"
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}
