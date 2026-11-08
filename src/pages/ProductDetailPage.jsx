import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/ui/Breadcrumb";
import ProductConfigurator from "../components/product/ProductConfigurator";
import ProductGallery from "../components/product/ProductGallery";
import ProductTabs from "../components/product/ProductTabs";
import { TAB_IDS } from "../components/product/tabIds";
import RecentlyViewed from "../components/product/RecentlyViewed";
import RelatedProducts from "../components/product/RelatedProducts";
import RoomChecker from "../components/product/RoomChecker";
import StickyBuyBar from "../components/product/StickyBuyBar";
import { Reveal } from "../components/ui/Reveal";
import { categoryName, getProduct } from "../data/products";
import { useWishlist } from "../contexts/WishlistContext";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useProductOptions } from "../lib/useProductOptions";
import NotFoundPage from "./NotFoundPage";

function ProductDetail({ product }) {
  const opts = useProductOptions(product);
  const { trackView } = useWishlist();
  const lenis = useLenis();
  const ctaRef = useRef(null);
  const [tab, setTab] = useState(TAB_IDS.description);

  useDocumentTitle(product.name);

  useEffect(() => {
    trackView(product.id);
  }, [product.id, trackView]);

  const showReviews = useCallback(() => {
    setTab(TAB_IDS.reviews);
    const el = document.getElementById("detail-tabs");
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -100 });
    else el.scrollIntoView({ behavior: "smooth" });
  }, [lenis]);

  return (
    <>
      <div className="border-b border-outline-variant/30 bg-surface-container-lowest">
        <div className="container-page py-3">
          <Breadcrumb
            items={[
              { label: "Beranda", href: "/", icon: "home" },
              { label: "Katalog", href: "/katalog" },
              { label: categoryName(product.category), href: `/katalog?kategori=${product.category}` },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <main className="container-page py-8 lg:py-12">
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <ProductGallery product={product} />
            {product.category !== "aksesoris" && (
              <Reveal>
                <RoomChecker product={product} />
              </Reveal>
            )}
          </div>
          <ProductConfigurator
            product={product}
            opts={opts}
            ctaRef={ctaRef}
            onShowReviews={showReviews}
            reviewCount={product.reviewCount}
          />
        </section>

        <ProductTabs product={product} active={tab} onChange={setTab} />
        <RelatedProducts product={product} />
        <RecentlyViewed excludeId={product.id} />
      </main>

      <StickyBuyBar product={product} opts={opts} targetRef={ctaRef} />
    </>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const product = getProduct(slug);
  if (!product) {
    return <NotFoundPage title="Produk tidak ditemukan" message="Produk yang Anda cari mungkin sudah tidak tersedia." />;
  }
  return <ProductDetail key={product.id} product={product} />;
}
