import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { categoryName, stockInfo } from "../../data/products";
import { useUI } from "../../contexts/UIContext";
import { formatPrice } from "../../lib/format";
import { useAddToCart } from "../../lib/useAddToCart";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import RatingStars from "./RatingStars";
import WishlistButton from "./WishlistButton";

function ColorDots({ colors, max = 4 }) {
  return (
    <div className="flex items-center gap-1.5">
      {colors.slice(0, max).map((c) => (
        <span
          key={c.key}
          title={c.name}
          className="h-4 w-4 rounded-full ring-1 ring-outline-variant ring-offset-1 ring-offset-surface-container-lowest"
          style={{ backgroundColor: c.hex }}
        />
      ))}
      {colors.length > max && <span className="ml-0.5 text-[11px] text-outline">+{colors.length - max}</span>}
    </div>
  );
}

function Badges({ product }) {
  const { badge, discount } = product;
  return (
    <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
      {badge && (
        <span className={`${badge.color} ${badge.textColor} rounded-md px-2.5 py-1 text-[11px] font-label-sm shadow-soft`}>
          {badge.text}
        </span>
      )}
      {discount >= 10 && (
        <span className="rounded-md bg-error px-2 py-0.5 text-[11px] font-bold text-on-error shadow-soft">-{discount}%</span>
      )}
    </div>
  );
}

function PriceBlock({ product, size = "md" }) {
  return (
    <div>
      {product.originalPrice > product.price && (
        <p className="text-[11px] text-outline line-through">{formatPrice(product.originalPrice)}</p>
      )}
      <p className={`font-headline-sm font-bold text-primary ${size === "lg" ? "text-2xl" : "text-lg"}`}>
        {formatPrice(product.price)}
      </p>
    </div>
  );
}

export default function ProductCard({ product, layout = "grid" }) {
  const add = useAddToCart();
  const { openQuickView } = useUI();
  const stock = stockInfo(product);
  const to = `/produk/${product.slug}`;

  if (layout === "compact") {
    return (
      <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
        <Link
          to={to}
          className="group block overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest shadow-soft transition-shadow hover:shadow-lift"
        >
          <SmartImage
            src={product.image}
            alt={product.name}
            className="aspect-[4/3]"
            imgClassName="transition-transform duration-700 group-hover:scale-105"
          />
          <div className="p-4">
            <p className="text-label-md font-label-md uppercase tracking-wider text-outline">{categoryName(product.category)}</p>
            <h3 className="mt-0.5 line-clamp-1 text-title-md font-title-md text-on-surface transition-colors group-hover:text-primary">
              {product.name}
            </h3>
            <div className="mt-1 flex items-center gap-1.5">
              <RatingStars rating={product.rating} size="xs" />
              <span className="text-[11px] text-outline">({product.reviewCount})</span>
            </div>
            <p className="mt-2 text-title-md font-title-md text-primary">{formatPrice(product.price)}</p>
          </div>
        </Link>
      </motion.div>
    );
  }

  const imageBlock = (cls) => (
    <div className={`group/img relative overflow-hidden ${cls}`}>
      <Link to={to} aria-label={product.name} tabIndex={-1} className="block h-full">
        <SmartImage
          src={product.image}
          alt={product.name}
          className="h-full w-full"
          imgClassName="transition-transform duration-700 ease-out group-hover/img:scale-110"
        />
      </Link>
      <Badges product={product} />
      <WishlistButton
        product={product}
        className="absolute right-3 top-3 h-9 w-9 rounded-full bg-surface-container-lowest/90 text-outline shadow-soft backdrop-blur transition-colors hover:text-error"
      />
      <button
        onClick={() => openQuickView(product)}
        className="absolute inset-x-3 bottom-3 hidden translate-y-3 items-center justify-center gap-1.5 rounded-lg bg-surface-container-lowest/95 py-2 text-label-md font-label-md text-primary opacity-0 shadow-soft backdrop-blur transition-all duration-300 hover:bg-primary-container hover:text-on-primary group-hover/img:translate-y-0 group-hover/img:opacity-100 md:flex"
      >
        <Icon name="visibility" className="text-lg" />
        Lihat Cepat
      </button>
    </div>
  );

  if (layout === "list") {
    return (
      <motion.article
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="group flex flex-col overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest shadow-soft transition-shadow hover:shadow-lift sm:flex-row"
      >
        {imageBlock("aspect-[4/3] sm:aspect-auto sm:w-64 sm:shrink-0 lg:w-72")}
        <div className="flex flex-1 flex-col justify-between gap-4 p-5">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-label-sm uppercase tracking-wider text-outline">{categoryName(product.category)}</span>
              <span className="flex items-center gap-1 text-on-surface-variant">
                <RatingStars rating={product.rating} size="xs" /> {product.rating} ({product.reviewCount})
              </span>
            </div>
            <Link to={to}>
              <h3 className="mt-1.5 font-title-lg text-title-lg text-on-surface transition-colors hover:text-primary">{product.name}</h3>
            </Link>
            <p className="mt-1 text-body-sm text-on-surface-variant">{product.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <ColorDots colors={product.colors} max={6} />
              {product.material && <span className="rounded bg-surface-container px-2 py-0.5 text-[11px] font-label-sm text-primary">{product.material}</span>}
              <span
                className={`rounded px-2 py-0.5 text-[11px] font-label-sm ${
                  stock.tone === "ok" ? "bg-success-container text-on-success-container" : "bg-secondary-container text-on-secondary-container"
                }`}
              >
                {stock.short}
              </span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-3">
            <PriceBlock product={product} size="lg" />
            <div className="flex gap-2">
              <Link to={to} className="btn-tonal !px-4 !py-2.5">Detail</Link>
              <button onClick={() => add(product)} className="btn-primary !px-4 !py-2.5">
                <Icon name="add_shopping_cart" className="text-lg" />
                Keranjang
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest shadow-soft transition-[box-shadow,border-color] duration-300 hover:border-primary-container/50 hover:shadow-lift"
    >
      {imageBlock("aspect-[4/3]")}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-label-sm uppercase tracking-wider text-outline">{product.subtitle}</span>
          <span className="flex items-center gap-1 font-bold text-on-surface-variant">
            <Icon name="star" fill className="text-base text-amber-500" />
            {product.rating}
            <span className="font-normal text-outline">({product.reviewCount})</span>
          </span>
        </div>
        <Link to={to}>
          <h3 className="font-title-lg text-title-lg leading-snug text-on-surface transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-body-sm text-on-surface-variant">{product.description}</p>

        <div className="mb-4 mt-3 flex items-center justify-between">
          <ColorDots colors={product.colors} />
          {stock.tone !== "ok" && (
            <span className="rounded bg-secondary-container px-2 py-0.5 text-[11px] font-label-sm text-on-secondary-container">
              {stock.short}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-outline-variant/30 pt-4">
          <PriceBlock product={product} />
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => add(product)}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-container text-on-primary shadow-soft transition-all hover:bg-primary hover:shadow-glow"
          >
            <Icon name="add_shopping_cart" className="text-xl" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
