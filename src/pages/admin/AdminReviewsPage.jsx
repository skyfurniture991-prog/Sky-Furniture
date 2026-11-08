import { useState } from "react";
import { useAdmin } from "../../contexts/AdminContext";
import Icon from "../../components/ui/Icon";
import { formatDateTime } from "../../lib/format";

export default function AdminReviewsPage() {
  const { reviews, toggleReviewApproval, deleteReview } = useAdmin();
  const [filter, setFilter] = useState("all");

  const filtered = reviews.filter((r) => {
    if (filter === "approved") return r.is_approved !== false;
    if (filter === "pending") return r.is_approved === false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-headline-sm text-xl font-bold text-on-surface">Ulasan & Testimoni Pelanggan</h2>
          <p className="text-xs text-on-surface-variant">
            Moderasi kepuasan pembeli yang tampil di halaman beranda dan detail produk
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
              filter === "all"
                ? "bg-primary-container text-on-primary"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            Semua ({reviews.length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
              filter === "approved"
                ? "bg-primary-container text-on-primary"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            Disetujui ({reviews.filter((r) => r.is_approved !== false).length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
              filter === "pending"
                ? "bg-primary-container text-on-primary"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            Menunggu Moderasi ({reviews.filter((r) => r.is_approved === false).length})
          </button>
        </div>
      </div>

      {/* ─── LIST ULASAN ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((r) => {
          const isApproved = r.is_approved !== false;

          return (
            <div
              key={r.id}
              className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-on-surface">{r.name}</h4>
                  <p className="text-[11px] text-on-surface-variant">
                    {r.city ? `${r.city} • ` : ""}
                    {r.created_at ? formatDateTime(r.created_at) : "Baru saja"}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: r.rating || 5 }).map((_, i) => (
                    <Icon key={i} name="star" fill className="text-sm" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-on-surface leading-relaxed italic bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
                "{r.comment}"
              </p>

              <div className="flex items-center justify-between border-t border-outline-variant/40 pt-3 text-xs">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    isApproved ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isApproved ? "bg-emerald-500" : "bg-amber-500"}`} />
                  {isApproved ? "Tayang di Toko" : "Disembunyikan"}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleReviewApproval(r.id)}
                    className="btn-secondary py-1 px-2.5 text-xs"
                  >
                    {isApproved ? "Sembunyikan" : "Setujui & Tampilkan"}
                  </button>
                  <button
                    onClick={() => deleteReview(r.id)}
                    className="text-error p-1 hover:bg-error/10 rounded"
                    title="Hapus"
                  >
                    <Icon name="delete" className="text-base" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
