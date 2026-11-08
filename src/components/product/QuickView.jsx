import { useState } from "react";
import { Link } from "react-router-dom";
import { categoryName, stockInfo } from "../../data/products";
import { useUI } from "../../contexts/UIContext";
import { useAddToCart } from "../../lib/useAddToCart";
import { useProductOptions } from "../../lib/useProductOptions";
import Icon from "../ui/Icon";
import { AnimatedPrice } from "../ui/AnimatedNumber";
import { Modal } from "../ui/Modal";
import QuantityStepper from "../ui/QuantityStepper";
import SmartImage from "../ui/SmartImage";
import { ColorPicker, MaterialPicker } from "./OptionPickers";
import RatingStars from "./RatingStars";
import WishlistButton from "./WishlistButton";

function QuickViewContent({ product, onClose }) {
  const opts = useProductOptions(product);
  const add = useAddToCart();
  const stock = stockInfo(product);

  const handleAdd = () => {
    add(product, opts.payload);
    onClose();
  };

  return (
    <div className="grid md:grid-cols-2">
      <div className="relative">
        <SmartImage src={product.image} alt={product.name} className="aspect-[4/3] h-full min-h-[260px] md:aspect-auto" />
        <WishlistButton
          product={product}
          className="absolute left-3 top-3 h-10 w-10 rounded-full bg-surface-container-lowest/90 text-outline shadow-soft backdrop-blur hover:text-error"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 sm:p-8">
        <div>
          <p className="eyebrow !text-outline">{categoryName(product.category)}</p>
          <h2 className="mt-1 font-headline-md text-headline-md text-on-surface">{product.name}</h2>
          <div className="mt-1.5 flex items-center gap-2 text-body-sm text-outline">
            <RatingStars rating={product.rating} />
            <span>
              {product.rating} · {product.reviewCount} ulasan
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <AnimatedPrice value={opts.price} className="font-headline-lg text-headline-lg text-primary" />
          {product.originalPrice > product.price && (
            <span className="text-body-md text-outline line-through">
              Rp {opts.originalPrice.toLocaleString("id-ID")}
            </span>
          )}
        </div>

        <p className="text-body-md text-on-surface-variant">{product.description}</p>

        <div>
          <p className="mb-2 text-label-lg font-label-lg text-on-surface">
            Warna: <span className="text-primary">{opts.color}</span>
          </p>
          <ColorPicker colors={product.colors} value={opts.color} onChange={opts.setColor} size="sm" />
        </div>

        {product.materials.length > 0 && (
          <div>
            <p className="mb-2 text-label-lg font-label-lg text-on-surface">Bahan cover</p>
            <MaterialPicker product={product} value={opts.material} onChange={opts.setMaterial} cols="grid-cols-2" />
          </div>
        )}

        <div className="flex items-center gap-3">
          <QuantityStepper value={opts.qty} onChange={opts.setQty} />
          <span
            className={`text-body-sm font-medium ${
              stock.tone === "ok" ? "text-success" : "text-secondary"
            }`}
          >
            {stock.label}
          </span>
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row">
          <button onClick={handleAdd} className="btn-primary flex-1">
            <Icon name="add_shopping_cart" className="text-xl" />
            Tambah ke Keranjang
          </button>
          <Link to={`/produk/${product.slug}`} onClick={onClose} className="btn-secondary">
            Detail Lengkap
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function QuickView() {
  const { quickViewProduct, closeQuickView } = useUI();
  // Simpan produk terakhir agar konten tidak kosong saat animasi tutup berjalan.
  const [last, setLast] = useState(null);
  if (quickViewProduct && quickViewProduct !== last) setLast(quickViewProduct);
  const product = quickViewProduct ?? last;

  return (
    <Modal open={!!quickViewProduct} onClose={closeQuickView} label="Tampilan cepat produk" className="max-w-4xl">
      {product && <QuickViewContent key={product.id} product={product} onClose={closeQuickView} />}
    </Modal>
  );
}
