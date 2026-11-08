import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { Link, useNavigate } from "react-router-dom";
import OrderSummary from "../components/cart/OrderSummary";
import ProgressSteps from "../components/cart/ProgressSteps";
import CheckoutForm from "../components/checkout/CheckoutForm";
import Icon from "../components/ui/Icon";
import { PAYMENT_METHODS } from "../data/store";
import { CheckoutProvider, codUnavailable, useCheckout } from "../contexts/CheckoutContext";
import { optionLabels, useCart } from "../contexts/CartContext";
import { useOrders } from "../contexts/OrdersContext";
import { useToast } from "../contexts/ToastContext";
import { useAuth } from "../contexts/AuthContext";
import { addDays } from "../lib/format";
import { calcTotals } from "../lib/pricing";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { createSnapToken, payWithSnap } from "../lib/midtrans";

function GoogleIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

const FIELD_ORDER = [
  "fullName",
  "phone",
  "email",
  "address",
  "province",
  "city",
  "district",
  "postalCode",
  "shippingId",
  "paymentId",
  "cardNumber",
  "cardExpiry",
  "cardCvv",
];

const allPayments = Object.values(PAYMENT_METHODS).flat();

function CheckoutContent() {
  const navigate = useNavigate();
  const lenis = useLenis();
  const toast = useToast();
  const { user, isAuthenticated, userName, userEmail, userAvatar, signInWithGoogle, signOut, loading: authLoading } = useAuth();
  const { items, bonusItems, subtotal, promo, clear } = useCart();
  const { createOrder, markOrderPaid } = useOrders();
  const { form, errors, setSubmitted, reset } = useCheckout();
  const [placing, setPlacing] = useState(false);
  const [finished, setFinished] = useState(false);
  useDocumentTitle("Checkout");

  const totals = calcTotals({ subtotal, promo, shippingId: form.shippingId });

  const focusFirstError = (errs) => {
    const first = FIELD_ORDER.find((f) => errs[f]);
    const el = first && document.querySelector(`[data-field="${first}"]`);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -160, duration: 0.8 });
    else el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => el.focus?.({ preventScroll: true }), 300);
  };

  const submit = async () => {
    if (!isAuthenticated) {
      toast.error("Wajib Masuk", "Silakan masuk dengan akun Google Anda untuk menyelesaikan pesanan.");
      signInWithGoogle("/checkout");
      return;
    }

    setSubmitted(true);
    const extra = {};
    if (form.paymentId === "cod") {
      const msg = codUnavailable(form.province, totals.total);
      if (msg) extra.paymentId = msg;
    }
    if (form.paymentId === "cicilan" && totals.total < 1500000) {
      extra.paymentId = "Cicilan 0% minimal transaksi Rp 1.500.000.";
    }
    const merged = { ...errors, ...extra };
    if (Object.keys(merged).length) {
      toast.error("Lengkapi data pesanan", Object.values(merged)[0]);
      focusFirstError(merged);
      return;
    }

    setPlacing(true);

    const payment = allPayments.find((p) => p.id === form.paymentId);
    const orderData = {
      userId: user?.id || null,
      items: items.map((i) => ({
        productId: i.product.id,
        slug: i.product.slug,
        name: i.product.name,
        image: i.product.image,
        options: optionLabels(i),
        qty: i.qty,
        unit: i.unit,
        total: i.total,
      })),
      bonusItems: bonusItems.map((b) => ({ productId: b.product.id, name: b.product.name, image: b.product.image, qty: b.qty, value: b.value })),
      customer: {
        name: form.fullName.trim() || userName,
        phone: `+62${form.phone.replace(/\D/g, "").replace(/^(62|0)/, "")}`,
        email: form.email.trim() || userEmail,
        address: form.address.trim(),
        city: form.city.trim(),
        district: form.district.trim(),
        province: form.province,
        postalCode: form.postalCode,
        notes: form.notes.trim(),
        workshopNotes: form.workshopNotes.trim(),
      },
      shipping: {
        id: totals.method.id,
        name: totals.method.name,
        fee: totals.shipping,
        eta: addDays(new Date(), totals.method.days[1] + 3).toISOString(),
      },
      payment: { id: payment?.id, name: form.paymentId === "cicilan" ? `${payment?.name} ${form.cicilanTerm}x` : payment?.name },
      promoCode: promo?.code ?? null,
      totals: { subtotal: totals.subtotal, discount: totals.discount, shipping: totals.shipping, tax: totals.tax, total: totals.total },
    };

    // Jika COD (Bayar di Tempat): pesanan langsung dibuat, bayar tunai saat sofa tiba
    if (form.paymentId === "cod") {
      const order = await createOrder({
        ...orderData,
        status: "received",
        payment_status: "pending",
      });
      setFinished(true);
      clear();
      reset();
      navigate(`/pesanan/${order.id}`, { replace: true, state: { justPlaced: true } });
      return;
    }

    // Pembayaran otomatis via Midtrans Snap (Virtual Account, GoPay, ShopeePay, Card)
    // Pesanan HANYA dibuat dan diterima jika pembayaran berhasil diselesaikan!
    try {
      const now = new Date();
      const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
      const tempOrderCode = `SKY-${ymd}-${Math.floor(10000 + Math.random() * 90000)}`;

      const snapData = await createSnapToken({
        orderId: tempOrderCode,
        grossAmount: totals.total,
        paymentMethod: form.paymentId,
        customer: {
          fullName: orderData.customer.name,
          phone: `0${form.phone.replace(/\D/g, "").replace(/^(62|0)/, "")}`,
          email: orderData.customer.email,
          address: orderData.customer.address,
          city: orderData.customer.city,
          postalCode: orderData.customer.postalCode,
        },
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          unit: i.unit,
          qty: i.qty,
        })),
      });

      if (snapData?.token) {
        setPlacing(false);
        payWithSnap(snapData.token, {
          onSuccess: async () => {
            // Pembayaran lunas terverifikasi di Midtrans: simpan pesanan sebagai "paid"
            const order = await createOrder({
              ...orderData,
              code: tempOrderCode,
              status: "paid",
              payment_status: "paid",
              paidAt: new Date().toISOString(),
            });
            await markOrderPaid(order.id);
            toast.success("Pembayaran Berhasil!", "Terima kasih, pembayaran Anda telah diterima Midtrans.");
            setFinished(true);
            clear();
            reset();
            navigate(`/pesanan/${order.id}`, { replace: true, state: { justPlaced: true } });
          },
          onPending: () => {
            // Pengguna sedang melihat instruksi VA/QRIS di pop-up Midtrans.
            // Jangan buat pesanan sebelum pembayaran diselesaikan.
            console.log("Menunggu pembayaran di Midtrans Snap...");
          },
          onError: () => {
            // Transaksi gagal: jangan buat pesanan & jangan hapus keranjang
            setPlacing(false);
            toast.error("Pembayaran Belum Berhasil", "Transaksi gagal diproses. Keranjang belanja Anda tetap tersimpan, silakan coba lagi.");
          },
          onClose: () => {
            // Pop-up ditutup / dibatalkan tanpa menyelesaikan pembayaran:
            // Pesanan TIDAK dibuat, keranjang tetap utuh, tetap di halaman checkout!
            setPlacing(false);
            toast.warning("Pembayaran Belum Selesai", "Jendela pembayaran ditutup. Pesanan belum dibuat sebelum pembayaran diselesaikan.");
          },
        });
        return;
      }
    } catch (snapErr) {
      console.warn("Midtrans Snap error:", snapErr);
      setPlacing(false);
      toast.error("Gagal Membuka Pembayaran", snapErr.message || "Tidak dapat terhubung ke Midtrans. Silakan coba lagi.");
    }
  };

  if (finished) {
    return (
      <main className="container-page flex min-h-[50vh] items-center justify-center py-20">
        <Icon name="progress_activity" className="animate-spin text-5xl text-primary-container" />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
        <Icon name="shopping_bag" className="text-6xl text-outline" />
        <h1 className="font-headline-md text-headline-md text-on-surface">Keranjang Anda kosong</h1>
        <p className="text-body-md text-on-surface-variant">Tambahkan produk terlebih dahulu sebelum checkout.</p>
        <Link to="/katalog" className="btn-primary">
          Lihat Katalog
        </Link>
      </main>
    );
  }

  return (
    <>
      <ProgressSteps current={1} />
      <main className="container-page py-8 lg:py-10">
        <h1 className="mb-6 font-headline-xl text-headline-xl text-on-background">Konfirmasi &amp; Checkout</h1>

        {!isAuthenticated && !authLoading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto my-6 max-w-xl rounded-3xl border border-primary/20 bg-surface-container-lowest p-8 shadow-lift text-center"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon name="lock" className="text-3xl" />
            </div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Masuk untuk Menyelesaikan Pesanan
            </h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Untuk menjaga privasi pesanan Anda dan memantau status pembuatan sofa langsung dari akun Anda, silakan masuk menggunakan akun Google.
            </p>

            <div className="my-6 space-y-2.5 rounded-2xl bg-surface-container-low p-4 text-left text-body-sm text-on-surface-variant">
              <div className="flex items-center gap-2.5">
                <Icon name="check_circle" className="text-primary text-base" />
                <span>Privasi penuh: riwayat pesanan tersimpan aman hanya untuk akun Anda</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Icon name="check_circle" className="text-primary text-base" />
                <span>Pantau tahap perakitan &amp; jadwal pengiriman armada langsung</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Icon name="check_circle" className="text-primary text-base" />
                <span>Satu klik tanpa ribet mengisi kata sandi</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => signInWithGoogle("/checkout")}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-outline-variant/60 bg-surface-container px-6 py-4 text-title-md font-semibold text-on-surface shadow-soft transition-all hover:border-primary hover:bg-surface-container-high hover:shadow-lift active:scale-[0.98]"
            >
              <GoogleIcon className="h-6 w-6" />
              <span>Masuk dengan Google</span>
            </button>
          </motion.div>
        )}

        {isAuthenticated && (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
              <div className="flex items-center gap-3">
                {userAvatar ? (
                  <img src={userAvatar} alt="" className="h-9 w-9 rounded-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {(userName || "U")[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-on-surface">Masuk sebagai <span className="text-primary">{userName}</span></p>
                  <p className="text-xs text-on-surface-variant">{userEmail} • Pesanan akan tersimpan secara privat di akun Anda</p>
                </div>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="text-xs font-medium text-on-surface-variant hover:text-error transition-colors"
              >
                Ganti Akun
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-7">
                <CheckoutForm totals={totals} subtotal={subtotal} promo={promo} />

                <div>
                  <motion.button
                    onClick={submit}
                    disabled={placing}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary relative w-full overflow-hidden !py-4 text-base"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {placing ? (
                        <motion.span key="p" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                          <Icon name="progress_activity" className="animate-spin text-xl" />
                          Memproses pesanan...
                        </motion.span>
                      ) : (
                        <motion.span key="i" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                          <Icon name="lock" className="text-xl" />
                          Konfirmasi &amp; Bayar Sekarang
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-label-md font-label-md text-outline">
                    {[
                      { icon: "shield_lock", text: "SSL Aman" },
                      { icon: "verified_user", text: "Garansi 5 Tahun" },
                      { icon: "local_shipping", text: "Gratis Ongkir > Rp 3 Juta" },
                    ].map((b) => (
                      <span key={b.text} className="flex items-center gap-1">
                        <Icon name={b.icon} className="text-base text-primary" />
                        {b.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <OrderSummary variant="checkout" shippingId={form.shippingId} />
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  );
}
