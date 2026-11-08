import { Link } from "react-router-dom";
import { getRelatedProducts } from "../../data/products";
import Icon from "../ui/Icon";
import { Reveal } from "../ui/Reveal";
import ProductGrid from "./ProductGrid";

export default function RelatedProducts({ product }) {
  const related = getRelatedProducts(product, 4);
  return (
    <section className="mt-20">
      <Reveal className="mb-8 flex items-end justify-between">
        <div>
          <span className="eyebrow">Harmoni Penataan Ruang</span>
          <h2 className="mt-1 font-headline-md text-headline-md text-on-surface">Lengkapi Ruang Tamu Anda</h2>
        </div>
        <Link to="/katalog" className="inline-flex items-center gap-1 text-label-lg font-label-lg text-primary hover:underline">
          Lihat Semua
          <Icon name="arrow_forward" className="text-lg" />
        </Link>
      </Reveal>
      <ProductGrid products={related} layout="compact" />
    </section>
  );
}
