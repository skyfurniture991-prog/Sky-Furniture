import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import CartItem from "../components/cart/CartItem";
import FreeShippingBar from "../components/cart/FreeShippingBar";
import OrderSummary from "../components/cart/OrderSummary";
import ProgressSteps from "../components/cart/ProgressSteps";
import ProductGrid from "../components/product/ProductGrid";
import RecentlyViewed from "../components/product/RecentlyViewed";
import Breadcrumb from "../components/ui/Breadcrumb";
import Icon from "../components/ui/Icon";
import { Reveal } from "../components/ui/Reveal";
import { FEATURED_PRODUCTS, getRelatedProducts } from "../data/products";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useDocumentTitle } from "../lib/useDocumentTitle";

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-6 py-20 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-surface-container"
      >
        <Icon name="shopping_bag" className="text-6xl text-primary-container" />
      </motion.div>
      <h2 className="font-headline-md text-headline-md text-on-surface">Keranjang Belanja Anda Kosong</h2>
      <p className="mt-2 max-w-md text-body-md text-on-surface-variant">
        Belum ada sofa di keranjang. Temukan model favorit Anda dan mulai dari sini.
      </p>
      <Link to="/katalog" className="btn-primary mt-6">
        <Icon name="grid_view" className="text-xl" />
        Lihat Katalog Produk
      </Link>
    </motion.div>
  );
}

export default function CartPage() {
  const { items, bonusItems, subtotal, count, updateQty, removeItem, restoreItem, clear } = useCart();
  const { toggle, has } = useWishlist();
  const toast = useToast();
  useDocumentTitle("Keranjang Belanja");

  const handleRemove = (item) => {
    const removed = removeItem(item.key);
    toast.info("Produk dihapus dari keranjang", item.product.name, { label: "Batalkan", onClick: () => restoreItem(removed) });
  };

  const handleSave = (item) => {
    if (!has(item.product.id)) toggle(item.product.id);
    removeItem(item.key);
    toast.success("Dipindahkan ke wishlist", item.product.name, { label: "Lihat Wishlist", to: "/wishlist" });
  };

  const handleClear = () => {
    const snapshot = items.map(({ key, productId, qty, color, material, orientation, addedAt }) => ({ key, productId, qty, color, material, orientation, addedAt }));
    clear();
    toast.info("Keranjang dikosongkan", undefined, { label: "Batalkan", onClick: () => snapshot.forEach(restoreItem) });
  };

  const suggestions = useMemo(() => {
    const inCart = new Set(items.map((i) => i.product.id));
    const base = items[0] ? getRelatedProducts(items[0].product, 8) : FEATURED_PRODUCTS;
    return base.filter((p) => !inCart.has(p.id)).slice(0, 4);
  }, [items]);

  return (
    <>
      <ProgressSteps current={0} />
      <main className="container-page py-8 lg:py-10">
        <Breadcrumb className="mb-6" items={[{ label: "Beranda", href: "/", icon: "home" }, { label: "Keranjang Belanja" }]} />

        <h1 className="mb-8 font-headline-xl text-headline-xl text-on-background">
          Keranjang Belanja <span className="ml-2 font-body-lg text-body-lg text-outline">({count} item)</span>
        </h1>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7 xl:col-span-8">
              <FreeShippingBar subtotal={subtotal} />

              <AnimatePresence initial={false} mode="popLayout">
                {items.map((item) => (
                  <CartItem key={item.key} item={item} onQty={updateQty} onRemove={handleRemove} onSaveForLater={handleSave} />
                ))}
                {bonusItems.map((b) => (
                  <CartItem key={b.key} item={b} bonus />
                ))}
              </AnimatePresence>

              <div className="flex items-center justify-between pt-2">
                <Link to="/katalog" className="inline-flex items-center gap-2 text-label-lg font-label-lg text-primary hover:underline">
                  <Icon name="arrow_back" className="text-xl" />
                  Lanjut Belanja
                </Link>
                <button onClick={handleClear} className="text-label-md font-label-md text-error hover:underline">
                  Kosongkan Keranjang
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 xl:col-span-4">
              <OrderSummary variant="cart" />
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <section className="mt-20">
            <Reveal className="mb-6">
              <span className="eyebrow">Rekomendasi</span>
              <h2 className="mt-1 font-headline-md text-headline-md text-on-background">Lengkapi Ruang Tamu Anda</h2>
            </Reveal>
            <ProductGrid products={suggestions} />
          </section>
        )}
        <RecentlyViewed className="mt-16" />
      </main>
    </>
  );
}
