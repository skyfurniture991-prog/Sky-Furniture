import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useParams } from "react-router-dom";
import Confetti from "../components/orders/Confetti";
import OrderTimeline from "../components/orders/OrderTimeline";
import ProgressSteps from "../components/cart/ProgressSteps";
import Breadcrumb from "../components/ui/Breadcrumb";
import Icon from "../components/ui/Icon";
import SmartImage from "../components/ui/SmartImage";
import { PROVINCES, waLink } from "../data/store";
import { dbToStoreOrder, useOrders } from "../contexts/OrdersContext";
import { useToast } from "../contexts/ToastContext";
import { formatDate, formatDateTime, formatPrice } from "../lib/format";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { createSnapToken, payWithSnap, checkMidtransStatus } from "../lib/midtrans";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import NotFoundPage from "./NotFoundPage";

function Card({ title, icon, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-soft ${className}`}>
      <h2 className="mb-4 flex items-center gap-2 font-headline-sm text-headline-sm text-on-surface">
        <Icon name={icon} className="text-2xl text-primary-container" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function PaymentInfo({ order, onMarkPaid }) {
  const toast = useToast();
  const [paying, setPaying] = useState(false);
  const [checking, setChecking] = useState(false);
  const isPaid = order.payment_status === "paid" || order.status === "paid" || (order.payment?.id !== "cod" && order.status !== "cancelled");
  const isVa = ["bca", "mandiri", "bni"].includes(order.payment?.id);
  const isCod = order.payment?.id === "cod";
  const va = `8808${(order.id || "").toString().replace(/\D/g, "").slice(-12)}`;
  const deadline = formatDateTime((order.createdAt || Date.now()) + 24 * 60 * 60 * 1000);

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} disalin`, text);
    } catch {
      toast.info(label, text);
    }
  };

  const verifyPayment = async (silent = false) => {
    if (isPaid || !order) return;
    setChecking(true);
    try {
      const code = order.code || order.id;
      const res = await checkMidtransStatus(code);
      if (res?.isPaid) {
        if (onMarkPaid) await onMarkPaid(order.id);
        toast.success("Pembayaran Terverifikasi!", "Terima kasih, pembayaran Anda telah berhasil dikonfirmasi Lunas.");
      } else if (!silent) {
        toast.info(
          "Status Pembayaran",
          res?.message || "Pembayaran belum terdeteksi. Silakan selesaikan pembayaran terlebih dahulu."
        );
      }
    } catch (e) {
      if (!silent) toast.error("Gagal Memeriksa Pembayaran", e.message);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (!isPaid && !isCod && order) {
      verifyPayment(true);
    }
  }, [isPaid, isCod, order?.id, order?.code]);

  const handleMidtransPay = async () => {
    setPaying(true);
    try {
      // Gunakan ID unik untuk sesi pembayaran ulang agar Midtrans tidak menolak 400 (order_id duplicate)
      const payOrderId = `${order.code || order.id}-PAY${Date.now().toString().slice(-4)}`;
      const snapData = await createSnapToken({
        orderId: payOrderId,
        grossAmount: order.totals?.total || 0,
        paymentMethod: order.payment?.id,
        customer: {
          fullName: order.customer?.name || "Pelanggan",
          phone: order.customer?.phone || "081234567890",
          email: order.customer?.email || "customer@skyfurniture.com",
          address: order.customer?.address || "",
          city: order.customer?.city || "",
          postalCode: order.customer?.postalCode || "",
        },
        items: (order.items || []).map((i) => ({
          productId: i.productId,
          name: i.name,
          unit: i.unit,
          qty: i.qty,
        })),
      });

      if (snapData?.token) {
        payWithSnap(snapData.token, {
          onSuccess: async () => {
            if (onMarkPaid) await onMarkPaid(order.id);
            toast.success("Pembayaran Berhasil!", "Terima kasih, pembayaran Anda telah diterima.");
          },
          onPending: () => {
            toast.info("Menunggu Pembayaran", "Silakan selesaikan pembayaran sesuai instruksi.");
          },
          onError: () => {
            toast.error("Pembayaran Belum Berhasil", "Silakan coba lagi.");
          },
        });
      }
    } catch (err) {
      toast.error("Gagal Membuka Pembayaran", err.message);
    } finally {
      setPaying(false);
    }
  };

  return (
    <Card title="Pembayaran" icon="payments">
      <div className="flex items-center justify-between">
        <p className="text-body-md text-on-surface">{order.payment?.name || "Midtrans Payment"}</p>
        {isPaid && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Icon name="check_circle" className="text-sm" />
            Lunas
          </span>
        )}
      </div>

      {!isPaid && !isCod && (
        <button
          type="button"
          disabled={paying}
          onClick={handleMidtransPay}
          className="btn-primary mt-4 flex w-full items-center justify-center gap-2"
        >
          <Icon name="payments" className="text-lg" />
          {paying ? "Menyiapkan Pembayaran..." : "Bayar Sekarang via Midtrans"}
        </button>
      )}

      {isVa && !isPaid && (
        <div className="mt-3 rounded-xl bg-surface-container p-4">
          <p className="text-label-md font-label-md text-outline">Nomor Virtual Account</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="font-headline-sm text-xl font-bold tracking-wider text-primary">{va}</p>
            <button onClick={() => copy(va, "Nomor VA")} className="btn-tonal !px-3 !py-1.5 !text-label-md">
              <Icon name="content_copy" className="text-base" />
              Salin
            </button>
          </div>
          <p className="mt-2 text-body-sm text-on-surface-variant">
            Bayar sebelum <strong>{deadline}</strong> sebesar <strong>{formatPrice(order.totals?.total || 0)}</strong>.
          </p>
        </div>
      )}
      {isCod && (
        <p className="mt-3 rounded-xl bg-surface-container p-4 text-body-sm text-on-surface-variant">
          Siapkan pembayaran tunai {formatPrice(order.totals?.total || 0)} saat sofa tiba. Tim kami akan menghubungi H-1.
        </p>
      )}
    </Card>
  );
}

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const { getOrder, markOrderPaid, loadingOrders } = useOrders();
  const [fetchedOrder, setFetchedOrder] = useState(null);
  const [fetching, setFetching] = useState(false);

  const localOrder = getOrder(orderId);

  // Jika tidak ditemukan di state lokal (misal refresh browser), coba ambil dari Supabase
  useEffect(() => {
    if (!localOrder && orderId && isSupabaseConfigured && supabase) {
      let active = true;
      setFetching(true);

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
      const query = supabase
        .from("orders")
        .select(`
          *,
          items:order_items(*),
          history:order_status_history(*)
        `);

      if (isUuid) {
        query.eq("id", orderId);
      } else {
        query.eq("code", orderId);
      }

      query
        .maybeSingle()
        .then(({ data, error }) => {
          if (active && !error && data) {
            setFetchedOrder(dbToStoreOrder(data));
          }
        })
        .catch((err) => {
          console.warn("Gagal fetch detail pesanan:", err);
        })
        .finally(() => {
          if (active) setFetching(false);
        });

      return () => {
        active = false;
      };
    }
  }, [localOrder, orderId]);

  const order = localOrder || fetchedOrder;
  useDocumentTitle(order ? `Pesanan ${order.id}` : "Detail Pesanan");

  if (loadingOrders || fetching) {
    return (
      <main className="container-page flex min-h-[50vh] items-center justify-center py-20">
        <Icon name="progress_activity" className="animate-spin text-5xl text-primary" />
      </main>
    );
  }

  if (!order) {
    return (
      <NotFoundPage
        title="Pesanan tidak ditemukan"
        message="Nomor pesanan tidak ditemukan di akun atau perangkat ini."
      />
    );
  }

  const justPlaced = location.state?.justPlaced;
  const province = PROVINCES.find((p) => p.value === order.customer?.province)?.label ?? order.customer?.province;

  return (
    <>
      {justPlaced && <ProgressSteps current={2} />}
      <main className="container-page relative py-8 lg:py-10">
        {justPlaced && <Confetti />}

        {justPlaced ? (
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-10 max-w-2xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
              className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-success-container"
            >
              <svg viewBox="0 0 52 52" className="h-14 w-14 text-success" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <motion.circle cx="26" cy="26" r="22" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />
                <motion.path d="M15 27l8 8 14-16" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.7 }} />
              </svg>
            </motion.div>
            <h1 className="font-headline-xl text-headline-xl text-on-background">Pesanan Berhasil Dibuat!</h1>
            <p className="mt-2 text-body-lg text-on-surface-variant">
              Terima kasih, {(order.customer?.name || "Pelanggan").split(" ")[0]}. Tim Sky Furniture akan menghubungi Anda via WhatsApp dalam 1×24 jam untuk konfirmasi.
            </p>
          </motion.header>
        ) : (
          <Breadcrumb
            className="mb-6"
            items={[{ label: "Beranda", href: "/", icon: "home" }, { label: "Pesanan Saya", href: "/pesanan" }, { label: order.id }]}
          />
        )}

        <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-soft sm:flex-row sm:items-center">
          <div>
            <p className="text-label-md font-label-md uppercase tracking-wider text-outline">Nomor Pesanan</p>
            <p className="font-headline-md text-headline-md text-primary">{order.id}</p>
            <p className="text-body-sm text-outline">Dipesan {formatDateTime(order.createdAt)}</p>
          </div>
          <div className="flex flex-wrap gap-2 no-print">
            <button onClick={() => window.print()} className="btn-secondary !py-2.5">
              <Icon name="print" className="text-xl" />
              Cetak Invoice
            </button>
            <a
              href={waLink(`Halo Sky Furniture, saya ingin menanyakan pesanan ${order.id}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !py-2.5"
            >
              <Icon name="chat" className="text-xl" />
              Hubungi via WhatsApp
            </a>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <Card title="Status Pesanan" icon="local_shipping">
              <OrderTimeline order={order} />
            </Card>
            <Card title="Produk Dipesan" icon="inventory_2">
              <ul className="divide-y divide-outline-variant/30">
                {(order.items || []).map((it, i) => (
                  <li key={i} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                    <SmartImage src={it.image} alt="" className="h-16 w-16 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <Link to={`/produk/${it.slug || ""}`} className="text-title-md font-title-md text-on-surface hover:text-primary">
                        {it.name}
                      </Link>
                      <p className="text-label-md font-label-md text-outline">{(it.options || []).join(" · ")}</p>
                      <p className="text-body-sm text-on-surface-variant">
                        {it.qty} × {formatPrice(it.unit)}
                      </p>
                    </div>
                    <p className="text-title-md font-title-md text-primary">{formatPrice(it.total)}</p>
                  </li>
                ))}
                {(order.bonusItems || []).map((b, i) => (
                  <li key={`b${i}`} className="flex items-center gap-4 py-3 last:pb-0">
                    <SmartImage src={b.image} alt="" className="h-16 w-16 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <p className="text-title-md font-title-md text-on-surface">{b.name}</p>
                      <p className="text-body-sm text-secondary">Bonus · {b.qty} unit</p>
                    </div>
                    <p className="text-label-lg font-label-lg text-success">GRATIS</p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <Card title="Ringkasan Pembayaran" icon="receipt_long">
              <dl className="space-y-2.5 text-body-md">
                <div className="flex justify-between"><dt className="text-on-surface-variant">Subtotal</dt><dd>{formatPrice(order.totals?.subtotal || 0)}</dd></div>
                {order.totals?.discount > 0 && (
                  <div className="flex justify-between text-success"><dt>Promo {order.promoCode}</dt><dd>− {formatPrice(order.totals.discount)}</dd></div>
                )}
                <div className="flex justify-between"><dt className="text-on-surface-variant">Ongkir ({order.shipping?.name || "Kurir"})</dt><dd>{order.totals?.shipping === 0 ? <span className="font-semibold text-success">GRATIS</span> : formatPrice(order.totals?.shipping || 0)}</dd></div>
                <div className="flex justify-between border-t border-outline-variant/40 pt-3 font-title-lg text-title-lg"><dt>Total</dt><dd className="text-primary">{formatPrice(order.totals?.total || 0)}</dd></div>
                <p className="text-right text-label-md text-outline">Termasuk PPN 11% ({formatPrice(order.totals?.tax || 0)})</p>
              </dl>
            </Card>
            <PaymentInfo order={order} onMarkPaid={markOrderPaid} />
            <Card title="Alamat Pengiriman" icon="location_on">
              <p className="text-title-md font-title-md text-on-surface">{order.customer?.name}</p>
              <p className="text-body-sm text-on-surface-variant">{order.customer?.phone}</p>
              <p className="mt-2 text-body-md text-on-surface-variant">
                {order.customer?.address}, Kec. {order.customer?.district}, {order.customer?.city}, {province} {order.customer?.postalCode}
              </p>
              <p className="mt-3 flex items-center gap-1.5 text-body-sm text-primary">
                <Icon name="event_available" className="text-lg" />
                Estimasi tiba paling lambat {formatDate(order.shipping?.eta || new Date(), { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </Card>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3 no-print">
          <Link to="/pesanan" className="btn-secondary">Semua Pesanan Saya</Link>
          <Link to="/katalog" className="btn-primary">
            <Icon name="grid_view" className="text-xl" />
            Lanjut Belanja
          </Link>
        </div>
      </main>
    </>
  );
}
