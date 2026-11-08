import { useState } from "react";
import { useAdmin } from "../../contexts/AdminContext";
import Icon from "../../components/ui/Icon";
import { useToast } from "../../contexts/ToastContext";
import { formatPrice } from "../../lib/format";

export default function AdminContentPage() {
  const { faqs, saveFaq, deleteFaq, trustItems, whyUs, settings } = useAdmin();
  const toast = useToast();

  const [activeSection, setActiveSection] = useState("settings");

  // Local settings state
  const [storeName, setStoreName] = useState(settings?.store_name || "Sky Furniture");
  const [whatsapp, setWhatsapp] = useState(settings?.whatsapp || "6281123456789");
  const [freeShipping, setFreeShipping] = useState(settings?.free_shipping_threshold || 3000000);
  const [taxRate, setTaxRate] = useState((settings?.tax_rate || 0.11) * 100);

  // FAQ Modal
  const [faqModal, setFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState({ id: null, question: "", answer: "" });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    toast.success("Pengaturan Toko Disimpan", "Informasi kontak dan ambang batas diperbarui.");
  };

  const handleSaveFaq = (e) => {
    e.preventDefault();
    if (!editingFaq.question.trim() || !editingFaq.answer.trim()) {
      toast.error("Validasi", "Pertanyaan dan jawaban wajib diisi.");
      return;
    }
    saveFaq(editingFaq);
    setFaqModal(false);
  };

  return (
    <div className="space-y-6">
      {/* ─── HEADER ─── */}
      <div>
        <h2 className="font-headline-sm text-xl font-bold text-on-surface">Konten & Pengaturan Toko</h2>
        <p className="text-xs text-on-surface-variant">
          Atur informasi kontak WhatsApp, bebas ongkir, banner beranda, dan daftar Tanya Jawab (FAQ)
        </p>
      </div>

      {/* ─── TABS ─── */}
      <div className="flex border-b border-outline-variant/60 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveSection("settings")}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
            activeSection === "settings"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Icon name="tune" className="text-base" />
          <span>Pengaturan Umum Toko</span>
        </button>
        <button
          onClick={() => setActiveSection("faqs")}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
            activeSection === "faqs"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Icon name="quiz" className="text-base" />
          <span>Tanya Jawab (FAQ) ({faqs.length})</span>
        </button>
        <button
          onClick={() => setActiveSection("trust")}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
            activeSection === "trust"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Icon name="verified" className="text-base" />
          <span>Kepercayaan & Nilai ({trustItems.length})</span>
        </button>
      </div>

      {/* ─── TAB 1: PENGATURAN UMUM ─── */}
      {activeSection === "settings" && (
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm space-y-4">
            <h3 className="font-headline-sm text-sm font-bold text-on-surface">Informasi & Kontak Toko</h3>

            <div>
              <label className="mb-1 block text-xs font-semibold text-on-surface">Nama Toko</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="field text-xs py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-on-surface">
                Nomor WhatsApp Customer Service (Format: 628xxxxxxxxxx)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="field text-xs py-2 pl-9 font-mono"
                />
                <Icon name="call" className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-outline" />
              </div>
              <p className="mt-1 text-[11px] text-on-surface-variant">
                Nomor ini akan dipakai untuk tombol hubungi desainer dan konfirmasi pesanan pelanggan.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm space-y-4">
            <h3 className="font-headline-sm text-sm font-bold text-on-surface">Kebijakan Finansial & Ongkir</h3>

            <div>
              <label className="mb-1 block text-xs font-semibold text-on-surface">
                Batas Belanja Gratis Ongkir (Rp)
              </label>
              <input
                type="number"
                value={freeShipping}
                onChange={(e) => setFreeShipping(Number(e.target.value))}
                className="field text-xs py-2"
              />
              <p className="mt-1 text-[11px] text-on-surface-variant">
                Pesanan di atas {formatPrice(freeShipping)} akan otomatis mendapat gratis ongkir di checkout.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-on-surface">Tarif Pajak PPN (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                step="0.1"
                className="field text-xs py-2"
              />
            </div>

            <button type="submit" className="btn-primary py-2.5 px-6 text-xs">
              Simpan Pengaturan
            </button>
          </div>
        </form>
      )}

      {/* ─── TAB 2: FAQS ─── */}
      {activeSection === "faqs" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-on-surface-variant">
              Pertanyaan yang sering diajukan pelanggan di bagian bawah beranda
            </span>
            <button
              onClick={() => {
                setEditingFaq({ id: null, question: "", answer: "" });
                setFaqModal(true);
              }}
              className="btn-primary py-2 px-3 text-xs"
            >
              <Icon name="add" className="text-base" />
              <span>Tambah Tanya Jawab</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div
                key={f.id || i}
                className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-bold text-xs text-on-surface flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        {i + 1}
                      </span>
                      {f.question || f.q}
                    </h4>
                    <p className="text-xs text-on-surface-variant pl-7">{f.answer || f.a}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingFaq({ id: f.id, question: f.question || f.q, answer: f.answer || f.a });
                        setFaqModal(true);
                      }}
                      className="p-1 rounded text-on-surface-variant hover:bg-surface-container"
                    >
                      <Icon name="edit" className="text-base" />
                    </button>
                    <button
                      onClick={() => deleteFaq(f.id)}
                      className="p-1 rounded text-error hover:bg-error/10"
                    >
                      <Icon name="delete" className="text-base" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 3: TRUST & WHY US ─── */}
      {activeSection === "trust" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm space-y-4">
            <h3 className="font-headline-sm text-sm font-bold text-on-surface">Poin Kepercayaan (Trust Marquee)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {trustItems.map((t, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low p-3 text-xs"
                >
                  <Icon name={t.icon} className="text-lg text-primary" />
                  <span className="font-medium text-on-surface">{t.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm space-y-4">
            <h3 className="font-headline-sm text-sm font-bold text-on-surface">Keunggulan Workshop Jepara</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyUs.map((w, idx) => (
                <div key={idx} className="rounded-xl border border-outline-variant/40 p-4 bg-surface-container-low">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs mb-1">
                    <Icon name={w.icon} className="text-lg" />
                    <h4>{w.title}</h4>
                  </div>
                  <p className="text-xs text-on-surface-variant">{w.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL FAQ ─── */}
      {faqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setFaqModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-surface-container-lowest p-6 shadow-xl border border-outline-variant">
            <h3 className="font-headline-sm text-base font-bold text-on-surface mb-4">
              {editingFaq.id ? "Edit Tanya Jawab" : "Tambah Tanya Jawab Baru"}
            </h3>
            <form onSubmit={handleSaveFaq} className="space-y-4 text-xs">
              <div>
                <label className="mb-1 block font-semibold text-on-surface">Pertanyaan Pelanggan</label>
                <input
                  type="text"
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  placeholder="Contoh: Berapa lama waktu pengerjaan sofa custom?"
                  required
                  className="field py-2 text-xs"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-on-surface">Jawaban</label>
                <textarea
                  rows={4}
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  placeholder="Penjelasan resmi dari Sky Furniture..."
                  required
                  className="field py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setFaqModal(false)} className="btn-secondary py-2 px-3">
                  Batal
                </button>
                <button type="submit" className="btn-primary py-2 px-5">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
