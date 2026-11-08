import { Stagger, StaggerItem } from "../ui/Reveal";
import ProductCard from "./ProductCard";

/** Grid produk dengan animasi muncul berurutan saat di-scroll. */
export default function ProductGrid({
  products,
  layout = "grid",
  className = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
}) {
  return (
    <Stagger className={`grid gap-6 ${className}`} gap={0.07}>
      {products.map((p) => (
        <StaggerItem key={p.id} className="h-full">
          <ProductCard product={p} layout={layout} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
