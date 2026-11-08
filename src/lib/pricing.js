import { MATERIALS } from "../data/products";
import { FREE_SHIPPING_THRESHOLD, PROMO_CODES, SHIPPING_METHODS, TAX_RATE } from "../data/store";
import { formatPrice } from "./format";

const materialPrice = (name) => MATERIALS.find((m) => m.name === name)?.price ?? 0;

/** Selisih harga bahan relatif terhadap bahan bawaan produk. */
export const materialDelta = (product, material) => {
  if (!product.materials.length || !material) return 0;
  return materialPrice(material) - materialPrice(product.material);
};

export const unitPrice = (product, material) => product.price + materialDelta(product, material);
export const unitOriginalPrice = (product, material) =>
  product.originalPrice + materialDelta(product, material);

/** Validasi kode promo terhadap subtotal. */
export function evaluatePromo(rawCode, subtotal) {
  const code = (rawCode || "").trim().toUpperCase();
  if (!code) return { valid: false, message: "Masukkan kode promo terlebih dahulu." };
  const promo = PROMO_CODES[code];
  if (!promo) return { valid: false, message: "Kode promo tidak ditemukan." };
  if (subtotal < promo.min) {
    return {
      valid: false,
      message: `Kode ${code} berlaku untuk belanja minimal ${formatPrice(promo.min)}.`,
    };
  }
  return { valid: true, code, promo };
}

export const promoDiscount = (promo, subtotal) => {
  if (!promo || subtotal < promo.min) return 0;
  if (promo.type === "percent") return Math.min(Math.round((subtotal * promo.value) / 100), promo.max ?? Infinity);
  if (promo.type === "flat") return Math.min(promo.value, subtotal);
  return 0;
};

export const shippingMethodById = (id) => SHIPPING_METHODS.find((m) => m.id === id) ?? SHIPPING_METHODS[0];

export const shippingFee = (method, subtotal, promo) => {
  if (subtotal <= 0) return 0;
  if (promo?.type === "shipping" && subtotal >= promo.min) return 0;
  if (method.freeAbove && subtotal >= method.freeAbove) return 0;
  return method.price;
};

export function calcTotals({ subtotal, promo, shippingId = "direct" }) {
  const method = shippingMethodById(shippingId);
  const discount = promoDiscount(promo, subtotal);
  const shipping = shippingFee(method, subtotal, promo);
  const total = Math.max(0, subtotal - discount + shipping);
  const tax = Math.round((total * TAX_RATE) / (1 + TAX_RATE));
  const freeShippingGap = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  return { subtotal, discount, shipping, total, tax, method, freeShippingGap };
}
