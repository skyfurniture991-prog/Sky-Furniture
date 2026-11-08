import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";
import Icon from "../../components/ui/Icon";
import { formatPrice } from "../../lib/format";

export default function AdminDashboard() {
  const { orders, products } = useAdmin();

  // Metrics calculation
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let pendingCount = 0;
    let inProgressCount = 0;
    let deliveredCount = 0;

    orders.forEach((o) => {
      const tot = o.totals?.total ?? o.total ?? 0;
      totalRevenue += tot;
      const st = o.status;
      if (st === "received" || st === "paid") pendingCount++;
      else if (st === "production" || st === "qc" || st === "shipping") inProgressCount++;
      else if (st === "delivered") deliveredCount++;
    });

    const activeProducts = products.filter((p) => p.is_active !== false).length;
    const lowStockProducts = products.filter((p) => (p.stock_qty ?? p.stockQty ?? 0) <= 5);

    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingCount,
      inProgressCount,
      deliveredCount,
      activeProducts,
      lowStockProducts,
    };
  }, [orders, products]);

  const recentOrders = orders.slice(0, 5);

  const getStatusBadge = (st) => {
    const map = {
      received: { label: "Diterima", bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
      paid: { label: "Terbayar", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
      production: { label: "Produksi", bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
      qc: { label: "QC", bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
      shipping: { label: "Pengiriman", bg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
      delivered: { label: "Selesai", bg: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-300" },
      cancelled: { label: "Batal", bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
    };
    return map[st] || { label: st || "Proses", bg: "bg-surface-container text-on-surface" };
  };

  return (
    <div className="space-y-6">
      {/* ─── METRIC CARDS ─── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Omset */}
        <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-on-surface-variant">Total Nilai Pesanan</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <Icon name="payments" className="text-2xl" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-headline-sm text-2xl font-bold text-on-surface">
              {formatPrice(stats.totalRevenue)}
            </h3>
            <p className="mt-1 text-xs text-on-surface-variant">Dari {stats.totalOrders} total pesanan</p>
          </div>
        </div>

        {/* Butuh Diproses */}
        <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-on-surface-variant">Perlu Tindakan</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <Icon name="pending_actions" className="text-2xl" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-headline-sm text-2xl font-bold text-on-surface">
              {stats.pendingCount} <span className="text-sm font-normal text-on-surface-variant">Pesanan</span>
            </h3>
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">Menunggu pembayaran / verifikasi</p>
          </div>
        </div>

        {/* Dalam Produksi / Kirim */}
        <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-on-surface-variant">Dalam Pengerjaan / Kirim</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon name="handyman" className="text-2xl" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-headline-sm text-2xl font-bold text-on-surface">
              {stats.inProgressCount} <span className="text-sm font-normal text-on-surface-variant">Pesanan</span>
            </h3>
            <p className="mt-1 text-xs text-primary">Tahap workshop, QC, atau armada</p>
          </div>
        </div>

        {/* Produk Aktif */}
        <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-on-surface-variant">Produk Katalog Aktif</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
              <Icon name="chair" className="text-2xl" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-headline-sm text-2xl font-bold text-on-surface">
              {stats.activeProducts} <span className="text-sm font-normal text-on-surface-variant">Model</span>
            </h3>
            <p className="mt-1 text-xs text-on-surface-variant">Tampil di etalase toko</p>
          </div>
        </div>
      </div>

      {/* ─── QUICK ACTIONS & SHORTCUTS ─── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link
          to="/admin/pesanan"
          className="flex items-center gap-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-3.5 transition-all hover:border-primary hover:shadow-sm"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
            <Icon name="receipt_long" className="text-xl" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-on-surface">Kelola Pesanan</p>
            <p className="truncate text-[11px] text-on-surface-variant">Cek status & kirim resi</p>
          </div>
        </Link>

        <Link
          to="/admin/produk"
          className="flex items-center gap-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-3.5 transition-all hover:border-primary hover:shadow-sm"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
            <Icon name="add_circle" className="text-xl" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-on-surface">Tambah Produk</p>
            <p className="truncate text-[11px] text-on-surface-variant">Input varian sofa baru</p>
          </div>
        </Link>

        <Link
          to="/admin/konten"
          className="flex items-center gap-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-3.5 transition-all hover:border-primary hover:shadow-sm"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
            <Icon name="edit_note" className="text-xl" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-on-surface">Edit Konten Toko</p>
            <p className="truncate text-[11px] text-on-surface-variant">Banner & pengaturan</p>
          </div>
        </Link>

        <Link
          to="/admin/ulasan"
          className="flex items-center gap-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-3.5 transition-all hover:border-primary hover:shadow-sm"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
            <Icon name="rate_review" className="text-xl" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-on-surface">Ulasan Pelanggan</p>
            <p className="truncate text-[11px] text-on-surface-variant">Moderasi & balasan</p>
          </div>
        </Link>
      </div>

      {/* ─── DUA KOLOM: PESANAN TERBARU & STOK RENDAH ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom 1 & 2: Pesanan Terbaru */}
        <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">Pesanan Terbaru Masuk</h3>
              <p className="text-xs text-on-surface-variant">Daftar transaksi pesanan terakhir</p>
            </div>
            <Link
              to="/admin/pesanan"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>Lihat Semua</span>
              <Icon name="chevron_right" className="text-base" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-outline-variant p-8 text-center text-xs text-on-surface-variant">
              Belum ada pesanan masuk. Pesanan yang dibuat pelanggan di checkout akan otomatis muncul di sini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/40 text-on-surface-variant">
                    <th className="pb-3 font-semibold">Kode Pesanan</th>
                    <th className="pb-3 font-semibold">Pelanggan</th>
                    <th className="pb-3 font-semibold">Total</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 text-right font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {recentOrders.map((ord) => {
                    const id = ord.code || ord.id;
                    const custName = ord.customer?.name || ord.customer_name || "Pelanggan";
                    const total = ord.totals?.total ?? ord.total ?? 0;
                    const badge = getStatusBadge(ord.status);

                    return (
                      <tr key={id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3 font-mono font-bold text-primary">{id}</td>
                        <td className="py-3">
                          <p className="font-medium text-on-surface">{custName}</p>
                          <p className="text-[11px] text-on-surface-variant">
                            {ord.customer?.phone || ord.customer_phone || "-"}
                          </p>
                        </td>
                        <td className="py-3 font-semibold text-on-surface">{formatPrice(total)}</td>
                        <td className="py-3">
                          <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            to={`/admin/pesanan?id=${id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-outline-variant px-2.5 py-1 text-[11px] font-medium text-on-surface hover:bg-surface-container"
                          >
                            <span>Detail</span>
                            <Icon name="arrow_forward" className="text-xs" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Kolom 3: Alert Stok & Varian */}
        <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-headline-sm text-base font-bold text-on-surface">Peringatan Stok</h3>
            <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-600">
              {stats.lowStockProducts.length} Produk
            </span>
          </div>

          <p className="mb-3 text-xs text-on-surface-variant">Produk dengan kuota sisa sedikit atau ready terbatas:</p>

          <div className="space-y-3">
            {stats.lowStockProducts.slice(0, 5).map((p) => {
              const qty = p.stock_qty ?? p.stockQty ?? 0;
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-outline-variant/40 bg-surface-container-low p-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-10 w-10 rounded-lg object-cover bg-surface-container shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-on-surface">{p.name}</p>
                      <p className="text-[11px] text-on-surface-variant">{p.lead_time || p.leadTime || "Jahit 3 hari"}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span
                      className={`font-mono text-xs font-bold ${
                        qty <= 2 ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {qty} unit
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 border-t border-outline-variant/40 pt-3">
            <Link
              to="/admin/produk"
              className="block w-full text-center text-xs font-semibold text-primary hover:underline"
            >
              Kelola Semua Stok Produk →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
