import { useState } from "react";
import { useAdmin } from "../../contexts/AdminContext";
import Icon from "../../components/ui/Icon";
import { formatPrice } from "../../lib/format";

export default function AdminPromosPage() {
  const { promos, shippingMethods } = useAdmin();

  const [activeTab, setActiveTab] = useState("promos");

  return (
    <div className="space-y-6">
      {/* ─── HEADER ─── */}
      <div>
        <h2 className="font-headline-sm text-xl font-bold text-on-surface">Promo & Pengiriman</h2>
        <p className="text-xs text-on-surface-variant">
          Kelola voucher diskon, tarif kurir, dan ambang batas gratis ongkir
        </p>
      </div>

      {/* ─── TABS ─── */}
      <div className="flex border-b border-outline-variant/60 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("promos")}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === "promos"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Icon name="local_offer" className="text-base" />
          <span>Voucher Promo ({promos.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("shipping")}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === "shipping"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Icon name="local_shipping" className="text-base" />
          <span>Layanan Pengiriman ({shippingMethods.length})</span>
        </button>
      </div>

      {/* ─── TAB PROMO ─── */}
      {activeTab === "promos" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {promos.map((p) => (
            <div
              key={p.code}
              className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-lg">
                  {p.code}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {p.type === "percent" ? "Diskon %" : p.type === "shipping" ? "Bebas Ongkir" : "Potongan Flat"}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-xs text-on-surface">{p.label}</h4>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Minimal belanja: {formatPrice(p.min || 0)}
                </p>
                {p.max && (
                  <p className="text-[11px] text-on-surface-variant">
                    Maks. potongan: {formatPrice(p.max)}
                  </p>
                )}
              </div>

              <div className="border-t border-outline-variant/40 pt-2 flex items-center justify-between text-[11px] text-on-surface-variant">
                <span>Status: Aktif</span>
                <span className="text-primary font-semibold">Tervalidasi di Checkout</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── TAB SHIPPING ─── */}
      {activeTab === "shipping" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-outline-variant/40 bg-surface-container-low text-on-surface-variant">
                  <th className="py-3 px-4 font-semibold">Layanan Kurir</th>
                  <th className="py-3 px-4 font-semibold">Estimasi Hari</th>
                  <th className="py-3 px-4 font-semibold">Ongkir Standar</th>
                  <th className="py-3 px-4 font-semibold">Ketentuan Bebas Ongkir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {shippingMethods.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Icon name={s.icon || "local_shipping"} className="text-primary text-lg" />
                        <div>
                          <p className="font-bold text-on-surface">{s.name}</p>
                          <p className="text-[11px] text-on-surface-variant">{s.desc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {s.days ? `${s.days[0]}–${s.days[1]} hari kerja` : "3–5 hari"}
                    </td>
                    <td className="py-3 px-4 font-bold text-on-surface whitespace-nowrap">
                      {formatPrice(s.price)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-on-surface-variant">
                      {s.freeAbove ? `Gratis jika belanja >= ${formatPrice(s.freeAbove)}` : "Tarif flat"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
