import { useState } from "react";
import { useAdmin } from "../../contexts/AdminContext";
import Icon from "../../components/ui/Icon";
import { formatPrice } from "../../lib/format";
import { useToast } from "../../contexts/ToastContext";

export default function AdminTaxonomyPage() {
  const { categories, saveCategory, deleteCategory, materials, colors } = useAdmin();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState("categories");

  // Category state
  const [catModal, setCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState({ id: "", name: "", icon: "weekend", blurb: "" });

  const handleOpenAddCat = () => {
    setEditingCat({ id: "", name: "", icon: "chair", blurb: "" });
    setCatModal(true);
  };

  const handleSaveCat = (e) => {
    e.preventDefault();
    if (!editingCat.id.trim() || !editingCat.name.trim()) {
      toast.error("Validasi", "ID dan nama kategori wajib diisi.");
      return;
    }
    saveCategory({ ...editingCat, id: editingCat.id.toLowerCase().trim() });
    setCatModal(false);
  };

  return (
    <div className="space-y-6">
      {/* ─── HEADER ─── */}
      <div>
        <h2 className="font-headline-sm text-xl font-bold text-on-surface">Kategori & Varian Sofa</h2>
        <p className="text-xs text-on-surface-variant">
          Kelola kategori etalase, daftar bahan cover (kain), dan palet warna produk
        </p>
      </div>

      {/* ─── TABS ─── */}
      <div className="flex border-b border-outline-variant/60 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === "categories"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Icon name="category" className="text-base" />
          <span>Kategori Katalog ({categories.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("materials")}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === "materials"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Icon name="texture" className="text-base" />
          <span>Bahan Cover Kain ({materials.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("colors")}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === "colors"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Icon name="palette" className="text-base" />
          <span>Palet Warna ({colors.length})</span>
        </button>
      </div>

      {/* ─── TAB 1: KATEGORI ─── */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-on-surface-variant">
              Kategori yang ditampilkan di bilah beranda dan filter katalog
            </span>
            <button onClick={handleOpenAddCat} className="btn-primary py-2 px-3 text-xs">
              <Icon name="add" className="text-base" />
              <span>Tambah Kategori</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-start justify-between rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-4 shadow-sm"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon name={c.icon || "weekend"} className="text-2xl" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-on-surface">{c.name}</h4>
                    <p className="text-[11px] font-mono text-primary">/katalog?kategori={c.id}</p>
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{c.blurb || "-"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setEditingCat(c);
                      setCatModal(true);
                    }}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container"
                    title="Edit"
                  >
                    <Icon name="edit" className="text-base" />
                  </button>
                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="p-1 rounded text-error hover:bg-error/10"
                    title="Hapus"
                  >
                    <Icon name="delete" className="text-base" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 2: BAHAN COVER ─── */}
      {activeTab === "materials" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-outline-variant/40 bg-surface-container-low text-on-surface-variant">
                  <th className="py-3 px-4 font-semibold">Nama Bahan Cover</th>
                  <th className="py-3 px-4 font-semibold">Karakteristik & Deskripsi</th>
                  <th className="py-3 px-4 font-semibold">Tambahan Harga Relatif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {materials.map((m) => (
                  <tr key={m.name} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-4 font-bold text-on-surface">{m.name}</td>
                    <td className="py-3 px-4 text-on-surface-variant">{m.desc || m.description || "-"}</td>
                    <td className="py-3 px-4 font-bold text-primary">
                      {m.price === 0 ? "Bahan Standar (Rp 0)" : `+${formatPrice(m.price)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 3: WARNA ─── */}
      {activeTab === "colors" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {colors.map((c) => (
              <div
                key={c.key}
                className="flex items-center gap-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-3.5 shadow-sm"
              >
                <div
                  className="h-10 w-10 rounded-full border border-black/10 shrink-0 shadow-sm"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="min-w-0">
                  <p className="font-bold text-xs text-on-surface truncate">{c.name}</p>
                  <p className="font-mono text-[11px] text-outline uppercase">{c.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── MODAL EDIT KATEGORI ─── */}
      {catModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCatModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-xl border border-outline-variant">
            <h3 className="font-headline-sm text-base font-bold text-on-surface mb-4">
              {editingCat.id ? "Edit Kategori" : "Tambah Kategori Baru"}
            </h3>
            <form onSubmit={handleSaveCat} className="space-y-4 text-xs">
              <div>
                <label className="mb-1 block font-semibold text-on-surface">ID Kategori (URL Slug)</label>
                <input
                  type="text"
                  value={editingCat.id}
                  onChange={(e) => setEditingCat({ ...editingCat, id: e.target.value })}
                  placeholder="mis. minimalis"
                  required
                  className="field py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-on-surface">Nama Tampilan Kategori</label>
                <input
                  type="text"
                  value={editingCat.name}
                  onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                  placeholder="Sofa Minimalis Modern"
                  required
                  className="field py-2 text-xs"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-on-surface">
                  Ikon Material Symbol (mis. weekend, chair, chair_alt)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingCat.icon}
                    onChange={(e) => setEditingCat({ ...editingCat, icon: e.target.value })}
                    placeholder="weekend"
                    className="field py-2 text-xs flex-1"
                  />
                  <div className="h-9 w-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <Icon name={editingCat.icon || "weekend"} className="text-xl" />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-on-surface">Blurb Singkat</label>
                <input
                  type="text"
                  value={editingCat.blurb}
                  onChange={(e) => setEditingCat({ ...editingCat, blurb: e.target.value })}
                  placeholder="Keluarga & santai"
                  className="field py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCatModal(false)} className="btn-secondary py-2 px-3">
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
