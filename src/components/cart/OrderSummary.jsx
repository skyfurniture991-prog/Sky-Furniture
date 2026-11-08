import { Link } from "react-router-dom";
import { optionLabels, useCart } from "../../contexts/CartContext";
import { formatPrice } from "../../lib/format";
import { calcTotals } from "../../lib/pricing";
import Icon from "../ui/Icon";
import { AnimatedPrice } from "../ui/AnimatedNumber";
import SmartImage from "../ui/SmartImage";
import PromoBox from "./PromoBox";

function Row({ label, icon, children, tone = "" }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${tone}`}>
      <span className="flex items-center gap-1.5 text-on-surface-variant">
        {icon && <Icon name={icon} className="text-base" />}
        {label}
      </span>
      <span className="text-right font-medium text-on-surface">{children}</span>
    </div>
  );
}

/** Ringkasan pesanan yang dipakai di halaman keranjang dan checkout. */
export default function OrderSummary({ variant = "cart", shippingId = "direct" }) {
  const { items, bonusItems, subtotal, count, promo, bonusValue } = useCart();
  const totals = calcTotals({ subtotal, promo, shippingId });
  const isCart = variant === "cart";

  return (
    <div className="sticky top-24 space-y-5 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-soft">
      <h2 className="font-headline-md text-headline-md text-on-surface">Ringkasan Pesanan</h2>

      {!isCart && (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.key} className="flex gap-3">
              <div className="relative shrink-0">
                <SmartImage src={item.product.image} alt="" className="h-16 w-16 rounded-lg" />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-inverse-surface px-1 text-[11px] font-bold text-inverse-on-surface">
                  {item.qty}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-title-md font-title-md text-on-surface">{item.product.name}</p>
                <p className="truncate text-label-md font-label-md text-outline">{optionLabels(item).join(" · ")}</p>
                <p className="mt-0.5 text-label-lg font-label-lg text-primary">{formatPrice(item.total)}</p>
              </div>
            </li>
          ))}
          {bonusItems.map((b) => (
            <li key={b.key} className="flex gap-3">
              <SmartImage src={b.product.image} alt="" className="h-16 w-16 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-title-md font-title-md text-on-surface">
                  {b.product.name} <span className="ml-1 text-label-sm text-secondary">BONUS</span>
                </p>
                <p className="mt-0.5 text-label-lg font-label-lg text-success">GRATIS</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <PromoBox />

      <div className="h-px bg-outline-variant/40" />

      <div className="space-y-2.5 text-body-md">
        <Row label={`Subtotal (${count} item)`}>{formatPrice(totals.subtotal)}</Row>
        {totals.discount > 0 && (
          <Row label={`Promo ${promo.code}`} icon="discount" tone="text-success">
            <span className="text-success">− {formatPrice(totals.discount)}</span>
          </Row>
        )}
        <Row label={isCart ? "Ongkos Kirim (estimasi)" : "Ongkos Kirim"} icon="local_shipping">
          {totals.shipping === 0 ? <span className="font-semibold text-success">GRATIS</span> : formatPrice(totals.shipping)}
        </Row>
        {bonusValue > 0 && (
          <Row label="Bonus gratis" icon="card_giftcard">
            <span className="text-secondary">senilai {formatPrice(bonusValue)}</span>
          </Row>
        )}
      </div>

      <div className="h-px bg-outline-variant/40" />

      <div className="flex items-baseline justify-between gap-4">
        <span className="font-title-lg text-title-lg text-on-surface">Total</span>
        <div className="text-right">
          <AnimatedPrice value={totals.total} className="font-headline-md text-headline-md font-bold text-primary" />
          <p className="text-label-md font-label-md text-outline">Termasuk PPN 11% ({formatPrice(totals.tax)})</p>
        </div>
      </div>

      {isCart ? (
        <Link
          to={items.length ? "/checkout" : "#"}
          aria-disabled={!items.length}
          onClick={(e) => !items.length && e.preventDefault()}
          className={`btn-primary w-full !py-3.5 ${items.length ? "" : "pointer-events-none opacity-50"}`}
        >
          <Icon name="lock" className="text-xl" />
          Lanjut ke Checkout
        </Link>
      ) : null}

      <p className="flex items-center justify-center gap-1 text-center text-label-md font-label-md text-outline">
        <Icon name="shield_lock" className="text-base" />
        Pembayaran aman dienkripsi 256-bit SSL
      </p>
    </div>
  );
}
