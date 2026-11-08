import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getBonusProduct, stockInfo } from "../../data/products";
import { waLink } from "../../data/store";
import { useToast } from "../../contexts/ToastContext";
import { addDays, formatDate, formatPrice } from "../../lib/format";
import { useAddToCart } from "../../lib/useAddToCart";
import Icon from "../ui/Icon";
import { AnimatedPrice } from "../ui/AnimatedNumber";
import QuantityStepper from "../ui/QuantityStepper";
import SmartImage from "../ui/SmartImage";
import { ColorPicker, MaterialPicker, OrientationPicker } from "./OptionPickers";
import RatingStars from "./RatingStars";
import WishlistButton from "./WishlistButton";

function Section({ title, aside, children }) {
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-label-lg font-label-lg text-on-surface">{title}</span>
        {aside}
      </div>
      {children}
    </div>
  );
}

export default function ProductConfigurator({ product, opts, ctaRef, onShowReviews, reviewCount }) {
  const navigate = useNavigate();
  const toast = useToast();
  const add = useAddToCart();
  const stock = stockInfo(product);
  const bonus = getBonusProduct(product);
  const saved = opts.originalPrice - opts.price;

  const baseDays = product.stockQty === 0 ? 14 : product.category === "aksesoris" ? 1 : 3;
  const eta = `${formatDate(addDays(new Date(), baseDays + 3), { day: "numeric", month: "short" })} – ${formatDate(
    addDays(new Date(), baseDays + 5),
    { day: "numeric", month: "short" }
  )}`;

  const share = async () => {
    const data = { title: product.name, text: `${product.name} - Sky Furniture`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(data.url);
        toast.success("Tautan disalin", "Bagikan ke keluarga atau teman Anda.");
      }
    } catch {
      /* dibatalkan pengguna */
    }
  };

  const buyNow = () => {
    add(product, opts.payload);
    navigate("/checkout");
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-soft sm:p-8 lg:col-span-5">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm text-outline">
          <RatingStars rating={product.rating} />
          <span className="font-label-lg text-on-surface">{product.rating}</span>
          <span>•</span>
          <span>{product.soldCount}+ terjual</span>
          <span>•</span>
          <button onClick={onShowReviews} className="text-primary hover:underline">
            {reviewCount} ulasan
          </button>
        </div>
        <h1 className="font-headline-md text-headline-md text-balance text-on-surface">{product.name}</h1>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <AnimatedPrice value={opts.price} className="font-headline-lg text-headline-lg text-primary" />
          {saved > 0 && (
            <>
              <span className="text-body-md text-outline line-through">{formatPrice(opts.originalPrice)}</span>
              <span className="rounded bg-secondary-container px-2 py-0.5 text-label-sm font-label-sm text-on-secondary-container">
                Hemat {product.discount}%
              </span>
            </>
          )}
        </div>
        {opts.price >= 1500000 && (
          <p className="mt-1.5 flex items-center gap-1.5 text-body-sm text-on-surface-variant">
            <Icon name="credit_score" className="text-lg text-primary" />
            Cicilan 0% mulai <strong className="text-on-surface">{formatPrice(opts.price / 12)}</strong>/bulan
          </p>
        )}
      </div>

      {bonus && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 rounded-xl border border-dashed border-secondary/60 bg-secondary-fixed/40 p-3"
        >
          <SmartImage src={bonus.image} alt="" className="h-14 w-14 shrink-0 rounded-lg" />
          <div className="min-w-0 text-body-sm">
            <p className="flex items-center gap-1 font-label-lg text-label-lg text-secondary">
              <Icon name="card_giftcard" className="text-base" /> BONUS GRATIS
            </p>
            <p className="truncate text-on-surface">{bonus.name}</p>
            <p className="text-outline">senilai {formatPrice(bonus.price)} · otomatis ditambahkan ke keranjang</p>
          </div>
        </motion.div>
      )}

      <div className="h-px bg-outline-variant/40" />

      {product.hasOrientation && (
        <Section title="Orientasi Sudut Sofa">
          <OrientationPicker value={opts.orientation} onChange={opts.setOrientation} />
          <p className="mt-1.5 text-body-sm text-outline">Posisi selonjoran saat Anda duduk menghadap ke sofa.</p>
        </Section>
      )}

      <Section
        title={
          <>
            Pilihan Warna: <span className="font-semibold text-primary">{opts.color}</span>
          </>
        }
        aside={
          <a
            href={waLink(`Halo, saya ingin minta sampel kain untuk ${product.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-label-md font-label-md text-primary underline underline-offset-2"
          >
            Minta Sampel Kain
          </a>
        }
      >
        <ColorPicker colors={product.colors} value={opts.color} onChange={opts.setColor} />
      </Section>

      {product.materials.length > 0 && (
        <Section title="Pilihan Bahan Cover">
          <MaterialPicker product={product} value={opts.material} onChange={opts.setMaterial} />
        </Section>
      )}

      <div className="space-y-2 rounded-xl border border-outline-variant/40 bg-surface-container-low p-4 text-body-sm text-on-surface-variant">
        <div className="flex items-start gap-2.5">
          <Icon name="aspect_ratio" className="mt-0.5 text-lg text-primary" />
          <span><strong className="text-on-surface">Dimensi:</strong> {product.dimensions}</span>
        </div>
        <div className="flex items-start gap-2.5">
          <Icon name="forest" className="mt-0.5 text-lg text-primary" />
          <span><strong className="text-on-surface">Rangka:</strong> {product.frame}</span>
        </div>
        {product.cushion && (
          <div className="flex items-start gap-2.5">
            <Icon name="layers" className="mt-0.5 text-lg text-primary" />
            <span><strong className="text-on-surface">Bantalan:</strong> {product.cushion}</span>
          </div>
        )}
        <div className="flex items-start gap-2.5">
          <Icon name="event_available" className="mt-0.5 text-lg text-primary" />
          <span><strong className="text-on-surface">Estimasi tiba:</strong> {eta}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-label-lg font-label-lg text-on-surface">Jumlah</span>
          <QuantityStepper value={opts.qty} onChange={opts.setQty} />
        </div>
        <div
          className={`flex items-center gap-1.5 text-body-sm font-medium ${stock.tone === "ok" ? "text-success" : "text-secondary"}`}
        >
          <span className={`h-2 w-2 animate-pulse rounded-full ${stock.tone === "ok" ? "bg-success" : "bg-secondary"}`} />
          {stock.label}
        </div>
      </div>

      <div ref={ctaRef} className="flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between px-0.5 text-body-sm text-on-surface-variant">
          <span>Total ({opts.qty} unit)</span>
          <AnimatedPrice value={opts.total} className="font-title-lg text-title-lg text-on-surface" />
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button onClick={() => add(product, opts.payload)} className="btn-secondary !border-primary-container/40 !text-primary">
            <Icon name="shopping_bag" className="text-xl" />
            Tambah ke Keranjang
          </button>
          <button onClick={buyNow} className="btn-primary">
            <Icon name="bolt" className="text-xl" />
            Beli Sekarang
          </button>
        </div>
        <div className="grid grid-cols-[1fr_auto_auto] gap-2.5">
          <a
            href={waLink(`Halo, saya tertarik dengan ${product.name}. Boleh konsultasi?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !py-2.5 hover:!border-[#25D366] hover:!text-on-surface"
          >
            <Icon name="chat" className="text-xl text-[#25D366]" />
            Tanya Desainer via WhatsApp
          </a>
          <WishlistButton
            product={product}
            className="h-11 w-11 rounded-lg border border-outline-variant/70 text-on-surface-variant transition hover:border-error hover:text-error"
          />
          <button
            onClick={share}
            aria-label="Bagikan produk"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-outline-variant/70 text-on-surface-variant transition hover:border-primary-container hover:text-primary"
          >
            <Icon name="share" className="text-xl" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-outline-variant/30 pt-4 text-center">
        {[
          { icon: "local_shipping", title: "Pengiriman Aman", sub: "Se-Indonesia" },
          { icon: "verified_user", title: "Garansi Rangka", sub: "5 Tahun Resmi" },
          { icon: "published_with_changes", title: "Tukar Model", sub: "7 Hari" },
        ].map((b) => (
          <div key={b.title} className="rounded-lg bg-surface-container-low/60 p-2">
            <Icon name={b.icon} className="mb-1 text-[22px] text-primary" />
            <p className="text-label-sm font-label-sm font-bold leading-tight text-on-surface">{b.title}</p>
            <p className="text-[10px] text-outline">{b.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
