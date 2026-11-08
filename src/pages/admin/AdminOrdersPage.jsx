import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";
import { useToast } from "../../contexts/ToastContext";
import Icon from "../../components/ui/Icon";
import { formatDateTime, formatPrice } from "../../lib/format";
import { ORDER_STAGES } from "../../data/store";
import { checkMidtransStatus } from "../../lib/midtrans";

const STATUS_FILTERS = [
  { id: "all", label: "Semua" },
  { id: "received", label: "Diterima" },
  { id: "paid", label: "Terbayar" },
  { id: "production", label: "Produksi" },
  { id: "qc", label: "QC" },
  { id: "shipping", label: "Kirim" },
  { id: "delivered", label: "Selesai" },
  { id: "cancelled", label: "Batal" },
];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, updateOrderPayment, updateOrderTracking, updateOrderNotes } = useAdmin();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSelectedId = searchParams.get("id");

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(() => {
    if (!initialSelectedId) return null;
    return orders.find((o) => (o.code || o.id) === initialSelectedId) || null;
  });

  // Modal Action states
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [trackingInput, setTrackingInput] = useState("");
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [saving, setSaving] = useState(false);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const code = (o.code || o.id || "").toLowerCase();
      const name = (o.customer?.name || o.customer_name || "").toLowerCase();
      const phone = (o.customer?.phone || o.customer_phone || "").toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchSearch = !q || code.includes(q) || name.includes(q) || phone.includes(q);
      const matchTab = activeTab === "all" || o.status === activeTab;

      return matchSearch && matchTab;
    });
  }, [orders, activeTab, searchQuery]);

  // Counts per tab
  const counts = useMemo(() => {
    const map = { all: orders.length };
    orders.forEach((o) => {
      const st = o.status || "received";
      map[st] = (map[st] || 0) + 1;
    });
    return map;
  }, [orders]);

  // Background Auto-Sync Otomatis: memeriksa status Midtrans di background tanpa tombol di UI
  useEffect(() => {
    let active = true;
    const runBackgroundSync = async () => {
      const pendings = orders.filter(
        (o) => (o.paymentStatus || o.payment_status) === "pending"
      );
      if (pendings.length === 0) return;

      for (const ord of pendings) {
        if (!active) break;
        try {
          const code = ord.code || ord.id;
          const res = await checkMidtransStatus(code);
          if (res?.isPaid) {
            const orderId = ord.uuid || ord.id || ord.code;
            await updateOrderPayment(orderId, "paid");
          }
        } catch {}
      }
    };

    runBackgroundSync();
    const interval = setInterval(runBackgroundSync, 12000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [orders, updateOrderPayment]);

  const STATUS_NOTE_PRESETS = {
    received: "Pesanan telah dikonfirmasi dan masuk antrean workshop.",
    paid: "Pembayaran terverifikasi lunas. Rangka sofa mulai disiapkan.",
    production: "Pengrajin workshop sedang merakit rangka kayu mahoni & penjahitan cover sofa.",
    qc: "Pemeriksaan Quality Control lolos: busa density tinggi presisi & jahitan rapi.",
    shipping: "Pesanan telah dimuat ke armada mebel Sky Direct menuju alamat pemesan.",
    delivered: "Sofa telah tiba di lokasi dengan selamat & selesai dirapikan oleh tim.",
  };

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    const initialStatus = order.status || "received";
    setNewStatus(initialStatus);
    setStatusNote(order.statusNote || order.status_note || STATUS_NOTE_PRESETS[initialStatus] || "");
    setNewPaymentStatus(order.paymentStatus || order.payment_status || "paid");
    setTrackingInput(order.trackingNumber || order.tracking_number || "");
    setAdminNotesInput(order.adminNotes || order.admin_notes || "");
    setSearchParams({ id: order.code || order.id });
  };

  const closeOrderDetail = () => {
    setSelectedOrder(null);
    setSearchParams({});
  };

  const handleGenerateResi = () => {
    if (!selectedOrder) return;
    const code = selectedOrder.code || selectedOrder.id || "SKY";
    const num = code.replace(/\D/g, "").slice(-5) || Math.floor(10000 + Math.random() * 90000);
    setTrackingInput(`SKY-EXP-${num}`);
  };

  const handleSaveTrackingAndStatus = async () => {
    if (!selectedOrder) return;
    setSaving(true);
    try {
      const orderId = selectedOrder.uuid || selectedOrder.id || selectedOrder.code;

      // 1. Simpan Status & Catatan Tracking
      await updateOrderStatus(orderId, newStatus, statusNote);

      // 2. Simpan Nomor Resi jika diisi/diubah
      if (trackingInput !== (selectedOrder.trackingNumber || selectedOrder.tracking_number)) {
        await updateOrderTracking(orderId, trackingInput);
      }

      // 3. Update preview lokal
      setSelectedOrder((prev) => ({
        ...prev,
        status: newStatus,
        statusNote: statusNote || prev.statusNote || prev.status_note,
        status_note: statusNote || prev.statusNote || prev.status_note,
        trackingNumber: trackingInput,
        tracking_number: trackingInput,
        history: [
          ...(prev.history || []),
          { status: newStatus, note: statusNote || "Diperbarui admin", at: Date.now() },
        ],
      }));

      toast.success("Tracking Berhasil Diperbarui!", `Status diubah ke ${newStatus}. Pelanggan dapat langsung melihat perubahannya.`);
    } catch (err) {
      toast.error("Gagal Memperbarui Tracking", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setSaving(true);
    try {
      const orderId = selectedOrder.uuid || selectedOrder.id || selectedOrder.code;
      await updateOrderStatus(orderId, newStatus, statusNote);
      // update local preview
      setSelectedOrder((prev) => ({
        ...prev,
        status: newStatus,
        statusNote: statusNote,
        status_note: statusNote,
        history: [
          ...(prev.history || []),
          { status: newStatus, note: statusNote || "Diperbarui admin", at: Date.now() },
        ],
      }));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePayment = async () => {
    if (!selectedOrder) return;
    setSaving(true);
    try {
      const orderId = selectedOrder.uuid || selectedOrder.id;
      await updateOrderPayment(orderId, newPaymentStatus);
      setSelectedOrder((prev) => ({ ...prev, paymentStatus: newPaymentStatus, payment_status: newPaymentStatus }));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTracking = async () => {
    if (!selectedOrder) return;
    setSaving(true);
    try {
      const orderId = selectedOrder.uuid || selectedOrder.id;
      await updateOrderTracking(orderId, trackingInput);
      setSelectedOrder((prev) => ({ ...prev, trackingNumber: trackingInput, tracking_number: trackingInput }));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAdminNotes = async () => {
    if (!selectedOrder) return;
    setSaving(true);
    try {
      const orderId = selectedOrder.uuid || selectedOrder.id;
      await updateOrderNotes(orderId, adminNotesInput);
      setSelectedOrder((prev) => ({ ...prev, adminNotes: adminNotesInput, admin_notes: adminNotesInput }));
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (st) => {
    const map = {
      received: { label: "Diterima", bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
      paid: { label: "Terbayar", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
      production: { label: "Produksi", bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
      qc: { label: "QC Lolos", bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
      shipping: { label: "Pengiriman", bg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
      delivered: { label: "Tiba / Selesai", bg: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-300" },
      cancelled: { label: "Dibatalkan", bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
    };
    return map[st] || { label: st || "Proses", bg: "bg-surface-container text-on-surface" };
  };

  const getPaymentBadge = (ps) => {
    const map = {
      paid: { label: "Lunas", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
      pending: { label: "Lunas", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
      failed: { label: "Gagal", bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
      refunded: { label: "Refund", bg: "bg-gray-500/10 text-gray-600 dark:text-gray-400" },
    };
    return map[ps] || { label: "Lunas", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" };
  };

  return (
    <div className="space-y-6">
      {/* ─── HEADER & PENCARIAN ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-headline-sm text-xl font-bold text-on-surface">Manajemen Pesanan</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Pantau dan proses pesanan masuk dari pelanggan secara terpusat
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode, nama, atau no HP..."
            className="field pl-9 text-xs"
          />
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-outline" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
            >
              <Icon name="close" className="text-sm" />
            </button>
          )}
        </div>
      </div>

      {/* ─── TABS FILTER STATUS ─── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {STATUS_FILTERS.map((tab) => {
          const count = counts[tab.id] || 0;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 font-medium transition-all ${
                isActive
                  ? "bg-primary-container text-on-primary shadow-sm"
                  : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-on-primary" : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── TABEL PESANAN ─── */}
      <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-on-surface-variant">
            <Icon name="inbox" className="mx-auto text-4xl text-outline mb-2" />
            <p className="font-semibold text-sm text-on-surface">Tidak ada pesanan ditemukan</p>
            <p className="mt-1">Coba gunakan kata kunci pencarian lain atau pilih tab status berbeda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-outline-variant/40 bg-surface-container-low text-on-surface-variant">
                  <th className="py-3 px-4 font-semibold">Kode Pesanan</th>
                  <th className="py-3 px-4 font-semibold">Waktu Dibuat</th>
                  <th className="py-3 px-4 font-semibold">Pelanggan</th>
                  <th className="py-3 px-4 font-semibold">Produk Dipesan</th>
                  <th className="py-3 px-4 font-semibold">Total</th>
                  <th className="py-3 px-4 font-semibold">Pembayaran</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {filteredOrders.map((ord) => {
                  const id = ord.code || ord.id;
                  const dateStr = ord.createdAt || ord.created_at;
                  const custName = ord.customer?.name || ord.customer_name || "Pelanggan";
                  const phone = ord.customer?.phone || ord.customer_phone || "-";
                  const city = ord.customer?.city || ord.city || "";
                  const total = ord.totals?.total ?? ord.total ?? 0;
                  const items = ord.items || ord.order_items || [];
                  const statusBadge = getStatusBadge(ord.status === "received" ? "paid" : ord.status);
                  const isFailed = ord.paymentStatus === "failed" || ord.payment_status === "failed";
                  const isRefunded = ord.paymentStatus === "refunded" || ord.payment_status === "refunded";
                  const payBadge = getPaymentBadge(isFailed ? "failed" : isRefunded ? "refunded" : "paid");

                  return (
                    <tr key={id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-primary">{id}</td>
                      <td className="py-3.5 px-4 text-on-surface-variant whitespace-nowrap">
                        {dateStr ? formatDateTime(dateStr) : "-"}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-on-surface">{custName}</p>
                        <p className="text-[11px] text-on-surface-variant">
                          {city ? `${city} • ` : ""}
                          {phone}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="truncate text-on-surface font-medium">
                          {items.length > 0 ? items.map((i) => i.name).join(", ") : "-"}
                        </p>
                        <p className="text-[11px] text-on-surface-variant">
                          {items.length} jenis item ({items.reduce((s, i) => s + (i.qty || 1), 0)} unit)
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-on-surface whitespace-nowrap">
                        {formatPrice(total)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${payBadge.bg}`}>
                          {payBadge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${statusBadge.bg}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => openOrderDetail(ord)}
                          className="btn-secondary py-1 px-3 text-xs"
                        >
                          <Icon name="visibility" className="text-sm" />
                          <span>Detail & Proses</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── MODAL DETAIL PESANAN ─── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeOrderDetail} />
          <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-surface-container-lowest shadow-2xl overflow-hidden border border-outline-variant">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-outline-variant/60 px-6 py-4 bg-surface-container-low">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-primary">
                    {selectedOrder.code || selectedOrder.id}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                      getStatusBadge(selectedOrder.status).bg
                    }`}
                  >
                    {getStatusBadge(selectedOrder.status).label}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Dipesan pada {formatDateTime(selectedOrder.createdAt || selectedOrder.created_at)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="rounded-lg border border-outline-variant p-2 text-on-surface-variant hover:bg-surface-container"
                  title="Cetak Surat Jalan / Invoice"
                >
                  <Icon name="print" className="text-lg" />
                </button>
                <button
                  onClick={closeOrderDetail}
                  className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container"
                >
                  <Icon name="close" className="text-xl" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Baris 1: Data Pelanggan & Alamat */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-outline-variant/50 p-4 bg-surface-container-low/50">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
                    <Icon name="person" className="text-base" /> Informasi Pemesan
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <p>
                      <span className="text-on-surface-variant">Nama:</span>{" "}
                      <strong className="text-on-surface">
                        {selectedOrder.customer?.name || selectedOrder.customer_name}
                      </strong>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-on-surface-variant">WhatsApp:</span>{" "}
                      <strong className="text-on-surface">
                        {selectedOrder.customer?.phone || selectedOrder.customer_phone}
                      </strong>
                      <a
                        href={`https://wa.me/${(selectedOrder.customer?.phone || selectedOrder.customer_phone || "")
                          .replace(/\D/g, "")
                          .replace(/^0/, "62")}?text=${encodeURIComponent(
                          `Halo Bpk/Ibu ${selectedOrder.customer?.name || selectedOrder.customer_name}, kami dari workshop Sky Furniture ingin mengonfirmasi pesanan ${
                            selectedOrder.code || selectedOrder.id
                          }...`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:underline"
                      >
                        <Icon name="chat" className="text-xs" /> Chat WA
                      </a>
                    </p>
                    <p>
                      <span className="text-on-surface-variant">Email:</span>{" "}
                      <span className="text-on-surface">
                        {selectedOrder.customer?.email || selectedOrder.customer_email || "-"}
                      </span>
                    </p>
                    {selectedOrder.customer?.notes && (
                      <div className="mt-2 rounded bg-surface-container p-2 text-[11px]">
                        <strong>Catatan Pelanggan:</strong> {selectedOrder.customer.notes}
                      </div>
                    )}
                    {selectedOrder.customer?.workshopNotes && (
                      <div className="mt-1 rounded bg-amber-500/10 p-2 text-[11px] text-amber-800 dark:text-amber-300">
                        <strong>Catatan Workshop:</strong> {selectedOrder.customer.workshopNotes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-outline-variant/50 p-4 bg-surface-container-low/50">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
                    <Icon name="local_shipping" className="text-base" /> Alamat & Pengiriman
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <p className="text-on-surface font-medium">
                      {selectedOrder.customer?.address || selectedOrder.address}
                    </p>
                    <p className="text-on-surface-variant">
                      {selectedOrder.customer?.district || selectedOrder.district ? `${selectedOrder.customer?.district || selectedOrder.district}, ` : ""}
                      {selectedOrder.customer?.city || selectedOrder.city ? `${selectedOrder.customer?.city || selectedOrder.city}, ` : ""}
                      {selectedOrder.customer?.province || selectedOrder.province} {selectedOrder.customer?.postalCode || selectedOrder.postal_code}
                    </p>
                    <hr className="my-2 border-outline-variant/40" />
                    <p>
                      <span className="text-on-surface-variant">Layanan:</span>{" "}
                      <strong>{selectedOrder.shipping?.name || selectedOrder.shipping_name || "Sky Direct"}</strong>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="text-on-surface-variant">Nomor Resi:</span>{" "}
                      {trackingInput ? (
                        <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {trackingInput}
                        </span>
                      ) : (
                        <span className="text-outline italic">Belum diterbitkan</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Baris Khusus: Update & Manajemen Tracking Pesanan Customer */}
              <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-primary/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm">
                      <Icon name="local_shipping" className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-on-surface flex items-center gap-2">
                        Update Tracking & Alur Pesanan Customer
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Live Sync
                        </span>
                      </h4>
                      <p className="text-[11px] text-on-surface-variant">
                        Status, nomor resi, dan catatan di sini akan otomatis tampil di halaman pelacakan pelanggan secara real-time.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-[11px] font-semibold text-on-surface-variant">Tahap Saat Ini:</span>
                    <span className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${getStatusBadge(selectedOrder.status).bg}`}>
                      {getStatusBadge(selectedOrder.status).label}
                    </span>
                  </div>
                </div>

                {/* Stepper Pilihan Tahapan Alur */}
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-2">
                    Pilih Tahap Pengerjaan / Pengiriman:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {ORDER_STAGES.map((s, idx) => {
                      const isSelected = newStatus === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setNewStatus(s.id);
                            if (!statusNote || Object.values(STATUS_NOTE_PRESETS).includes(statusNote)) {
                              setStatusNote(STATUS_NOTE_PRESETS[s.id] || "");
                            }
                          }}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                            isSelected
                              ? "border-primary bg-primary text-on-primary shadow-md scale-[1.02]"
                              : "border-outline-variant/60 bg-surface-container hover:bg-surface-container-high text-on-surface"
                          }`}
                        >
                          <span className="text-lg mb-1">
                            <Icon name={s.icon || "check"} />
                          </span>
                          <span className="text-[11px] font-bold line-clamp-1">{s.label}</span>
                          <span className={`text-[10px] mt-0.5 ${isSelected ? "text-white/80" : "text-outline"}`}>
                            Tahap {idx + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Input Nomor Resi & Catatan Workshop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-on-surface">
                        Nomor Resi / Surat Jalan Pengiriman
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateResi}
                        className="text-[10px] font-semibold text-primary hover:underline"
                      >
                        + Buat Resi Otomatis
                      </button>
                    </div>
                    <input
                      type="text"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      placeholder="Contoh: SKY-EXP-202611-13347..."
                      className="field py-2 px-3 text-xs w-full bg-surface-container-lowest"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-on-surface">
                        Catatan Progres Workshop (Terlihat di Customer)
                      </label>
                    </div>
                    <input
                      type="text"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="Contoh: Rangka mahoni telah lolos amplas & siap dibungkus..."
                      className="field py-2 px-3 text-xs w-full bg-surface-container-lowest"
                    />
                  </div>
                </div>

                {/* Template Catatan Cepat (Pill Buttons) */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[10px] font-semibold text-on-surface-variant">Pilihan Catatan Cepat:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(STATUS_NOTE_PRESETS).map(([key, text]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setStatusNote(text)}
                        className={`rounded-lg px-2 py-1 text-[10px] transition-colors border ${
                          statusNote === text
                            ? "bg-primary text-on-primary border-primary font-bold"
                            : "bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:bg-surface-container"
                        }`}
                      >
                        {text.length > 45 ? `${text.slice(0, 45)}...` : text}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tombol Simpan Tracking */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-primary/20">
                  <div className="text-[11px] text-on-surface-variant flex items-center gap-1.5">
                    <Icon name="verified" className="text-sm text-emerald-600" />
                    <span>Tersimpan otomatis ke database Supabase & halaman pelacakan pemesan</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveTrackingAndStatus}
                    disabled={saving}
                    className="btn-primary w-full sm:w-auto py-2.5 px-6 text-xs font-bold shadow-md flex items-center justify-center gap-2"
                  >
                    <Icon name={saving ? "progress_activity" : "save"} className={`text-base ${saving ? "animate-spin" : ""}`} />
                    <span>{saving ? "Menyimpan Tracking..." : "Simpan & Perbarui Tracking Customer"}</span>
                  </button>
                </div>
              </div>

              {/* Baris 2: Daftar Item Produk */}
              <div className="rounded-xl border border-outline-variant/50 p-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
                  <Icon name="chair" className="text-base" /> Produk yang Dipesan
                </h4>
                <div className="divide-y divide-outline-variant/30">
                  {(selectedOrder.items || selectedOrder.order_items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-lg object-cover bg-surface-container shrink-0"
                        />
                        <div>
                          <p className="text-xs font-bold text-on-surface">{item.name}</p>
                          <p className="text-[11px] text-on-surface-variant">
                            {Array.isArray(item.options) ? item.options.join(" • ") : item.options || "-"}
                          </p>
                          <p className="text-[11px] text-primary">
                            {item.qty} × {formatPrice(item.unit || item.price || 0)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-on-surface">{formatPrice(item.total || 0)}</p>
                      </div>
                    </div>
                  ))}

                  {/* Bonus Items jika ada */}
                  {(selectedOrder.bonusItems || []).map((b, idx) => (
                    <div key={`bonus-${idx}`} className="flex items-center justify-between py-2 text-xs bg-amber-500/5 px-2 rounded">
                      <div className="flex items-center gap-2">
                        <Icon name="card_giftcard" className="text-amber-600" />
                        <span>Bonus: <strong>{b.name}</strong> ({b.qty}x)</span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600">GRATIS</span>
                    </div>
                  ))}
                </div>

                {/* Ringkasan Biaya */}
                <div className="mt-4 border-t border-outline-variant/40 pt-3 text-xs space-y-1 text-right">
                  <p>
                    <span className="text-on-surface-variant">Subtotal:</span>{" "}
                    {formatPrice(selectedOrder.totals?.subtotal ?? selectedOrder.subtotal ?? 0)}
                  </p>
                  {(selectedOrder.totals?.discount ?? selectedOrder.discount ?? 0) > 0 && (
                    <p className="text-rose-600">
                      <span>Diskon ({selectedOrder.promoCode || "Promo"}):</span> -
                      {formatPrice(selectedOrder.totals?.discount ?? selectedOrder.discount ?? 0)}
                    </p>
                  )}
                  <p>
                    <span className="text-on-surface-variant">Ongkos Kirim:</span>{" "}
                    {formatPrice(selectedOrder.totals?.shipping ?? selectedOrder.shipping_fee ?? 0)}
                  </p>
                  <p className="text-sm font-bold text-on-surface pt-1 border-t border-outline-variant/30">
                    <span>Total Pembayaran:</span>{" "}
                    <span className="text-primary">
                      {formatPrice(selectedOrder.totals?.total ?? selectedOrder.total ?? 0)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Baris 3: Status Pembayaran & Catatan Internal Admin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Pembayaran */}
                <div className="rounded-xl border border-outline-variant/50 p-4 bg-surface-container-low/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Icon name="payments" className="text-base" /> Status Pembayaran
                    </h4>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                        getPaymentBadge(selectedOrder.paymentStatus || selectedOrder.payment_status).bg
                      }`}
                    >
                      {getPaymentBadge(selectedOrder.paymentStatus || selectedOrder.payment_status).label}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-on-surface-variant">Metode:</span>{" "}
                      <strong className="text-on-surface">
                        {selectedOrder.payment?.name || selectedOrder.payment_name || "Midtrans Payment"}
                      </strong>
                    </div>

                    <div className="pt-2 border-t border-outline-variant/30">
                      <label className="block text-[11px] font-semibold text-on-surface mb-1">
                        Ubah Status Pembayaran
                      </label>
                      <select
                        value={newPaymentStatus}
                        onChange={(e) => setNewPaymentStatus(e.target.value)}
                        className="field py-1.5 px-3 text-xs"
                      >
                        <option value="paid">Lunas (Terverifikasi)</option>
                        <option value="pending">Menunggu Pembayaran</option>
                        <option value="failed">Gagal / Kadaluarsa</option>
                        <option value="refunded">Dikembalikan (Refunded)</option>
                      </select>
                    </div>

                    <button
                      onClick={handleUpdatePayment}
                      disabled={saving}
                      className="btn-secondary w-full py-2 text-xs"
                    >
                      {saving ? "Menyimpan..." : "Perbarui Status Pembayaran"}
                    </button>
                  </div>
                </div>

                {/* Catatan Internal Staf */}
                <div className="rounded-xl border border-outline-variant/50 p-4 bg-surface-container-low/50 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                      <Icon name="lock" className="text-base" /> Catatan Internal Workshop
                    </h4>
                    <p className="text-[11px] text-on-surface-variant mb-2">
                      Catatan ini bersifat rahasia dan hanya dapat dibaca oleh staf / admin toko (tidak tampak oleh pelanggan).
                    </p>
                    <textarea
                      rows={3}
                      value={adminNotesInput}
                      onChange={(e) => setAdminNotesInput(e.target.value)}
                      placeholder="Contoh: Kayu mahoni pesanan batch 4, prioritas pengerjaan sebelum hari Jumat..."
                      className="field py-2 px-3 text-xs w-full resize-none"
                    />
                  </div>
                  <div className="pt-3 border-t border-outline-variant/30 mt-2">
                    <button
                      onClick={handleSaveAdminNotes}
                      disabled={saving}
                      className="btn-secondary w-full py-2 text-xs"
                    >
                      {saving ? "Menyimpan Catatan..." : "Simpan Catatan Internal"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Riwayat Timeline */}
              <div className="rounded-xl border border-outline-variant/50 p-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
                  <Icon name="history" className="text-base" /> Riwayat Perjalanan Pesanan
                </h4>
                <div className="space-y-3">
                  {(selectedOrder.history || []).map((h, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon name="check" className="text-xs" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-on-surface">
                            {getStatusBadge(h.status).label}
                          </span>
                          <span className="text-[10px] text-on-surface-variant">
                            {formatDateTime(h.at || h.created_at)}
                          </span>
                        </div>
                        {h.note && <p className="text-[11px] text-on-surface-variant mt-0.5">{h.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
