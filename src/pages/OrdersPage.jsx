import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/ui/Breadcrumb";
import Icon from "../components/ui/Icon";
import { Stagger, StaggerItem } from "../components/ui/Reveal";
import SmartImage from "../components/ui/SmartImage";
import { ORDER_STAGES } from "../data/store";
import { orderStageIndex, useOrders } from "../contexts/OrdersContext";
import { useAuth } from "../contexts/AuthContext";
import { formatDateTime, formatPrice } from "../lib/format";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useNow } from "../lib/useNow";

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

export default function OrdersPage() {
  const { orders, loadingOrders, getOrder } = useOrders();
  const { isAuthenticated, userEmail, userName, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const now = useNow(5000);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  useDocumentTitle("Pesanan Saya");

  const lookup = (e) => {
    e.preventDefault();
    const found = getOrder(query);
    if (found) navigate(`/pesanan/${found.id}`);
    else setError("Nomor pesanan tidak ditemukan di perangkat ini. Contoh format: SKY-20261102-12345");
  };

  return (
    <main className="container-page py-8 lg:py-12">
      <Breadcrumb className="mb-6" items={[{ label: "Beranda", href: "/", icon: "home" }, { label: "Pesanan Saya" }]} />

      <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <span className="eyebrow">Lacak Pesanan</span>
          <h1 className="mt-2 font-headline-xl text-headline-xl text-on-background">Pesanan Saya</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">Pantau progres pembuatan dan pengiriman sofa Anda.</p>
        </div>
        <form onSubmit={lookup} className="w-full max-w-md" noValidate>
          <label htmlFor="order-lookup" className="mb-1.5 block text-label-lg font-label-lg text-on-surface">
            Cari dengan nomor pesanan
          </label>
          <div className="flex gap-2">
            <input
              id="order-lookup"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setError("");
              }}
              placeholder="SKY-20261102-12345"
              className={`field uppercase ${error ? "field-error" : ""}`}
            />
            <button className="btn-primary !px-5">
              <Icon name="search" className="text-xl" />
              Lacak
            </button>
          </div>
          {error && <p className="mt-1.5 text-body-sm text-error">{error}</p>}
        </form>
      </div>

      {!isAuthenticated ? (
        <div className="mx-auto max-w-lg rounded-3xl border border-outline-variant/60 bg-surface-container-lowest p-8 text-center shadow-soft">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon name="lock" className="text-3xl" />
          </div>
          <h2 className="font-headline-md text-xl font-bold text-on-surface">Masuk untuk Melihat Pesanan Saya</h2>
          <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
            Riwayat pesanan Anda disimpan secara privat dan aman. Silakan masuk dengan akun Google Anda untuk mengakses, melihat rincian sofa, dan memantau progres workshop secara real-time.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => signInWithGoogle("/pesanan")}
              className="flex items-center gap-3 rounded-full border border-outline-variant/60 bg-surface-container px-6 py-3 text-sm font-bold text-on-surface shadow-soft hover:bg-surface-container-high hover:border-primary active:scale-95 transition-all"
            >
              <GoogleIcon className="h-5 w-5" />
              <span>Masuk dengan Google</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between text-body-sm text-on-surface-variant">
            <p>
              Menampilkan riwayat pesanan untuk akun <span className="font-semibold text-primary">{userEmail}</span> ({orders.length} pesanan)
            </p>
          </div>

          {loadingOrders ? (
            <div className="flex items-center justify-center py-20">
              <Icon name="progress_activity" className="animate-spin text-4xl text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-6 py-20 text-center"
            >
              <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-surface-container">
                <Icon name="inventory_2" className="text-5xl text-primary-container" />
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Belum ada pesanan</h2>
              <p className="mt-2 max-w-md text-body-md text-on-surface-variant">
                Pesanan yang Anda buat akan muncul di sini beserta status pengerjaan workshop dan pelacakannya.
              </p>
              <Link to="/katalog" className="btn-primary mt-6">
                Mulai Belanja
              </Link>
            </motion.div>
          ) : (
            <Stagger className="space-y-4" gap={0.07}>
              {orders.map((order) => {
                const stage = ORDER_STAGES[orderStageIndex(order, now)];
                const delivered = stage.id === "delivered";
                return (
                  <StaggerItem key={order.id}>
                    <motion.div whileHover={{ y: -3 }}>
                      <Link
                        to={`/pesanan/${order.id}`}
                        className="flex flex-col gap-5 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-soft transition-shadow hover:shadow-lift sm:flex-row sm:items-center"
                      >
                        <div className="flex -space-x-3">
                          {order.items.slice(0, 3).map((it, i) => (
                            <SmartImage key={i} src={it.image} alt="" className="h-16 w-16 rounded-xl border-2 border-surface-container-lowest" />
                          ))}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-title-lg font-title-lg text-primary">{order.id}</p>
                          <p className="truncate text-body-sm text-on-surface-variant">
                            {order.items.map((i) => i.name).join(", ")}
                          </p>
                          <p className="text-label-md font-label-md text-outline">{formatDateTime(order.createdAt)}</p>
                        </div>
                        <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end sm:gap-1">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-label-md font-label-md ${
                              delivered ? "bg-success-container text-on-success-container" : "bg-secondary-container text-on-secondary-container"
                            }`}
                          >
                            <Icon name={stage.icon} className="text-base" />
                            {stage.label}
                          </span>
                          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">{formatPrice(order.totals.total)}</span>
                        </div>
                        <Icon name="chevron_right" className="hidden text-2xl text-outline sm:block" />
                      </Link>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          )}
        </>
      )}
    </main>
  );
}
