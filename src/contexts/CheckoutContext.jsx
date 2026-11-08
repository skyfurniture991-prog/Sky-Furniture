/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "../lib/useLocalStorage";
import { useAuth } from "./AuthContext";

const CheckoutContext = createContext(null);

const EMPTY = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  province: "sumsel",
  city: "Kota Palembang",
  district: "",
  postalCode: "",
  notes: "",
  shippingId: "direct",
  payTab: "transfer",
  paymentId: "",
  cicilanTerm: 3,
  workshopNotes: "",
};

/** Layanan pengiriman khusus wilayah Sumatera Selatan */
export function shippingUnavailable(methodId, province) {
  if (!province) return null;
  if (province !== "sumsel") return "Pengiriman saat ini hanya melayani wilayah Sumatera Selatan";
  return null;
}

export const codUnavailable = (province, total) => {
  if (province && province !== "sumsel") return "COD hanya tersedia untuk wilayah Sumatera Selatan";
  if (total > 10000000) return "COD tidak tersedia untuk pesanan di atas Rp 10 juta";
  return null;
};

const validPhone = (v) => {
  const d = v.replace(/\D/g, "").replace(/^(62|0)/, "");
  return d.length >= 8 && d.length <= 13;
};

export function validate(form, card) {
  const e = {};
  if (form.fullName.trim().length < 3) e.fullName = "Nama lengkap minimal 3 karakter.";
  if (!validPhone(form.phone)) e.phone = "Nomor WhatsApp tidak valid (contoh: 812 3456 7890).";
  if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Format email tidak valid.";
  if (form.address.trim().length < 8) e.address = "Alamat terlalu singkat, tulis nama jalan & nomor.";
  if (!form.province) e.province = "Pilih provinsi.";
  if (form.city.trim().length < 2) e.city = "Isi kota / kabupaten.";
  if (form.district.trim().length < 2) e.district = "Isi kecamatan.";
  if (!/^\d{5}$/.test(form.postalCode)) e.postalCode = "Kode pos harus 5 digit.";
  const shipErr = shippingUnavailable(form.shippingId, form.province);
  if (shipErr) e.shippingId = shipErr;
  if (!form.paymentId) e.paymentId = "Pilih metode pembayaran.";

  if (form.paymentId === "cicilan") {
    const num = card.number.replace(/\D/g, "");
    if (num.length < 13 || num.length > 19) e.cardNumber = "Nomor kartu tidak valid.";
    const m = card.expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!m || +m[1] < 1 || +m[1] > 12) e.cardExpiry = "Format MM/YY.";
    else {
      const now = new Date();
      const exp = new Date(2000 + +m[2], +m[1], 0, 23, 59);
      if (exp < now) e.cardExpiry = "Kartu sudah kedaluwarsa.";
    }
    if (!/^\d{3,4}$/.test(card.cvv)) e.cardCvv = "CVV 3-4 digit.";
  }
  return e;
}

/** Draf formulir checkout (tersimpan lokal) beserta status interaksi untuk validasi. */
export function CheckoutProvider({ children }) {
  const { user, userName, userEmail } = useAuth();
  const [form, setForm] = useLocalStorage("sky.checkout.v1", EMPTY);
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Otomatis isi nama & email saat login dengan akun Google
  useEffect(() => {
    if (user) {
      setForm((p) => ({
        ...EMPTY,
        ...p,
        fullName: p.fullName || userName || "",
        email: p.email || userEmail || "",
      }));
    }
  }, [user, userName, userEmail, setForm]);

  const safeForm = useMemo(() => ({ ...EMPTY, ...form }), [form]);
  const errors = useMemo(() => validate(safeForm, card), [safeForm, card]);

  const setField = useCallback((field, value) => setForm((p) => ({ ...EMPTY, ...p, [field]: value })), [setForm]);
  const touch = useCallback((field) => setTouched((t) => (t[field] ? t : { ...t, [field]: true })), []);
  const setCardField = useCallback((field, value) => setCard((c) => ({ ...c, [field]: value })), []);
  const reset = useCallback(() => {
    setForm(EMPTY);
    setCard({ number: "", expiry: "", cvv: "" });
    setTouched({});
    setSubmitted(false);
  }, [setForm]);

  const errorFor = useCallback((field) => (submitted || touched[field] ? errors[field] : undefined), [errors, submitted, touched]);

  const value = useMemo(
    () => ({ form: safeForm, card, errors, errorFor, setField, setCardField, touch, submitted, setSubmitted, reset }),
    [safeForm, card, errors, errorFor, setField, setCardField, touch, submitted, reset]
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within a CheckoutProvider");
  return ctx;
}
