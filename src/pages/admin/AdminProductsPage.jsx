import { useMemo, useState } from "react";
import { useAdmin } from "../../contexts/AdminContext";
import Icon from "../../components/ui/Icon";
import { formatPrice } from "../../lib/format";
import { uploadImage, isSupabaseConfigured } from "../../lib/supabase";
import { useToast } from "../../contexts/ToastContext";

const EMPTY_PRODUCT = {
  id: null,
  name: "",
  slug: "",
  category_id: "sudut",
  subtitle: "",
  description: "",
  about: "",
  image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
  gallery: [],
  badge_text: "",
  badge_style: "primary",
  original_price: 3200000,
  price: 2785000,
  colors: ["azure", "misty", "mocca"],
  materials: ["Kanvas Linen", "Velvet Mewah", "Beludru"],
  material: "Kanvas Linen",
  footprint_p: 210,
  footprint_l: 160,
  footprint_t: 85,
  frame: "Kayu Mahoni Solid Oven Anti Rayap",
  cushion: "Busa Rebounded D24 + High-Density Foam D30",
  stock_label: "Ready Rangka (Jahit 3 Hari)",
  stock_qty: 10,
  lead_time: "Jahit 3 hari",
  has_orientation: true,
  seats: 5,
  featured: false,
  is_active: true,
  specs: [
    { label: "Konstruksi Rangka", value: "Kayu Mahoni Solid Oven Kiln-Dried MC 12%" },
    { label: "Kepadatan Busa", value: "Busa Rebounded D24 + High-Density Foam D30" },
    { label: "Garansi", value: "5 Tahun Garansi Rangka Kayu & Pegas Patah" },
  ],
};

export default function AdminProductsPage() {
  const { products, categories, colors, materials, saveProduct, deleteProduct } = useAdmin();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.slug || "").toLowerCase().includes(search.toLowerCase());
      const cat = p.category_id || p.category;
      const matchCat = selectedCategory === "all" || cat === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, search, selectedCategory]);

  const handleOpenCreate = () => {
    setEditingProduct({
      ...EMPTY_PRODUCT,
      id: Date.now(),
      slug: `sofa-${Date.now().toString().slice(-4)}`,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct({
      ...prod,
      category_id: prod.category_id || prod.category || "sudut",
      original_price: prod.original_price ?? prod.originalPrice ?? 0,
      price: prod.price ?? 0,
      stock_qty: prod.stock_qty ?? prod.stockQty ?? 0,
      stock_label: prod.stock_label || prod.stockLabel || "",
      lead_time: prod.lead_time || prod.leadTime || "",
      has_orientation: Boolean(prod.has_orientation ?? prod.hasOrientation),
      badge_text: prod.badge_text || (typeof prod.badge === "object" ? prod.badge?.text : "") || "",
      badge_style: prod.badge_style || "primary",
      specs: Array.isArray(prod.specs) ? prod.specs : [],
      colors: Array.isArray(prod.colors)
        ? prod.colors.map((c) => (typeof c === "string" ? c : c.key))
        : [],
      materials: Array.isArray(prod.materials) ? prod.materials : [],
    });
    setModalOpen(true);
  };

  const handleSlugify = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name) => {
    setEditingProduct((prev) => ({
      ...prev,
      name,
      slug: prev.id && prev.slug ? prev.slug : handleSlugify(name),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSupabaseConfigured) {
      const previewUrl = URL.createObjectURL(file);
      setEditingProduct((prev) => ({ ...prev, image: previewUrl }));
      toast.info("Foto Ditambahkan", "Gunakan input URL foto untuk menyimpan gambar secara permanen.");
      return;
    }

    setUploadingImage(true);
    try {
      const publicUrl = await uploadImage(file, "produk");
      setEditingProduct((prev) => ({ ...prev, image: publicUrl }));
      toast.success("Foto Berhasil Diunggah", "Foto produk tersimpan.");
    } catch (err) {
      toast.error("Gagal Upload Gambar", err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingProduct.name.trim()) {
      toast.error("Validasi", "Nama produk tidak boleh kosong.");
      return;
    }

    setSaving(true);
    try {
      await saveProduct(editingProduct);
      setModalOpen(false);
    } catch (err) {
      toast.error("Gagal Menyimpan", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setDeleteConfirmId(null);
    } catch (err) {
      toast.error("Gagal Menghapus", err.message);
    }
  };

  // Helper dynamic specs
  const handleAddSpec = () => {
    setEditingProduct((prev) => ({
      ...prev,
      specs: [...(prev.specs || []), { label: "", value: "" }],
    }));
  };

  const handleRemoveSpec = (idx) => {
    setEditingProduct((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== idx),
    }));
  };

  const handleSpecChange = (idx, field, val) => {
    setEditingProduct((prev) => ({
      ...prev,
      specs: prev.specs.map((s, i) => (i === idx ? { ...s, [field]: val } : s)),
    }));
  };

  return (
    <div className="space-y-6">
      {/* ─── HEADER & TOMBOL TAMBAH ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-headline-sm text-xl font-bold text-on-surface">Katalog Produk (CMS)</h2>
          <p className="text-xs text-on-surface-variant">
            Atur foto, varian kain, harga coret, spesifikasi rangka, dan stok sofa
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn-primary py-2.5 px-4 text-xs">
          <Icon name="add" className="text-lg" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* ─── FILTER & CARI ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/60">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau slug..."
            className="field pl-9 py-2 text-xs"
          />
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-outline" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-on-surface-variant shrink-0 font-medium">Kategori:</span>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-lg px-2.5 py-1.5 font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-primary-container text-on-primary"
                : "bg-surface-container text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`rounded-lg px-2.5 py-1.5 font-medium whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* ─── DAFTAR PRODUK (TABEL / GRID) ─── */}
      <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest shadow-sm overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-on-surface-variant">
            <Icon name="chair" className="mx-auto text-4xl text-outline mb-2" />
            <p className="font-semibold text-sm text-on-surface">Tidak ada produk ditemukan</p>
            <p className="mt-1">Coba atur filter atau tambahkan produk pertama Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-outline-variant/40 bg-surface-container-low text-on-surface-variant">
                  <th className="py-3 px-4 font-semibold">Produk</th>
                  <th className="py-3 px-4 font-semibold">Kategori</th>
                  <th className="py-3 px-4 font-semibold">Harga Jual</th>
                  <th className="py-3 px-4 font-semibold">Stok & Lead Time</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {filteredProducts.map((p) => {
                  const catName = categories.find((c) => c.id === (p.category_id || p.category))?.name || "Koleksi";
                  const price = p.price || 0;
                  const origPrice = p.original_price ?? p.originalPrice ?? 0;
                  const qty = p.stock_qty ?? p.stockQty ?? 0;
                  const isActive = p.is_active !== false;

                  return (
                    <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-14 w-14 rounded-xl object-cover bg-surface-container shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-on-surface text-sm truncate max-w-xs">{p.name}</p>
                            <p className="text-[11px] text-on-surface-variant font-mono truncate">{p.slug}</p>
                            {p.badge_text && (
                              <span className="inline-block mt-1 rounded bg-primary/10 px-1.5 py-0.2 text-[10px] font-semibold text-primary">
                                {p.badge_text}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="rounded-lg bg-surface-container px-2.5 py-1 text-[11px] font-medium text-on-surface">
                          {catName}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-bold text-on-surface text-sm">{formatPrice(price)}</p>
                        {origPrice > price && (
                          <p className="text-[11px] text-outline line-through">{formatPrice(origPrice)}</p>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className={`font-mono font-bold ${qty <= 3 ? "text-rose-600" : "text-emerald-600"}`}>
                          {qty} Unit
                        </p>
                        <p className="text-[11px] text-on-surface-variant">{p.lead_time || p.leadTime || "Jahit 3 hari"}</p>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-outline/10 text-outline"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-outline"}`} />
                            {isActive ? "Aktif" : "Nonaktif"}
                          </span>
                          {p.featured && (
                            <span className="text-[10px] font-medium text-amber-600 flex items-center gap-0.5">
                              <Icon name="star" className="text-xs" /> Unggulan
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="rounded-lg border border-outline-variant p-1.5 text-on-surface hover:bg-surface-container"
                            title="Edit Produk"
                          >
                            <Icon name="edit" className="text-base" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="rounded-lg border border-error/30 p-1.5 text-error hover:bg-error/10"
                            title="Hapus Produk"
                          >
                            <Icon name="delete" className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── MODAL FORM TAMBAH / EDIT PRODUK ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl bg-surface-container-lowest shadow-2xl overflow-hidden border border-outline-variant">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-outline-variant/60 px-6 py-4 bg-surface-container-low">
              <h3 className="font-headline-sm text-base font-bold text-on-surface">
                {editingProduct.id ? "Edit Data Produk" : "Tambah Produk Baru"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container"
              >
                <Icon name="close" className="text-xl" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Seksi 1: Informasi Dasar */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Informasi Dasar</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-on-surface">Nama Produk *</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Contoh: Sofa L Sudut Nordic Minimalis"
                      required
                      className="field text-xs py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-on-surface">URL Slug *</label>
                    <input
                      type="text"
                      value={editingProduct.slug}
                      onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                      placeholder="sofa-l-sudut-nordic"
                      required
                      className="field text-xs py-2 font-mono"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-on-surface">Kategori *</label>
                    <select
                      value={editingProduct.category_id}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                      className="field text-xs py-2"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-on-surface">Subjudul / Seri</label>
                    <input
                      type="text"
                      value={editingProduct.subtitle}
                      onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                      placeholder="Contoh: Living Room Scandinavian Series"
                      className="field text-xs py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-on-surface">Deskripsi Singkat</label>
                  <textarea
                    rows={2}
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    placeholder="Ringkasan 1-2 kalimat keunggulan produk..."
                    className="field text-xs py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-on-surface">Cerita / Detail Lengkap Produk</label>
                  <textarea
                    rows={3}
                    value={editingProduct.about}
                    onChange={(e) => setEditingProduct({ ...editingProduct, about: e.target.value })}
                    placeholder="Penjelasan detail filosofi pengerjaan pengrajin Jepara..."
                    className="field text-xs py-2"
                  />
                </div>
              </div>

              {/* Seksi 2: Foto & Media */}
              <div className="space-y-4 border-t border-outline-variant/40 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Media & Foto Produk</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-on-surface">Foto Utama</label>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-surface-container border border-outline-variant relative">
                      <img
                        src={editingProduct.image}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      {uploadingImage && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs">
                          <Icon name="progress_activity" className="animate-spin text-xl mr-1" />
                          <span>Mengunggah...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-on-surface">
                        Upload Foto Produk
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="text-xs text-on-surface-variant file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-container file:text-on-primary hover:file:opacity-90"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-on-surface">Atau Input URL Foto</label>
                      <input
                        type="url"
                        value={editingProduct.image}
                        onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                        placeholder="https://..."
                        className="field text-xs py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seksi 3: Harga & Stok */}
              <div className="space-y-4 border-t border-outline-variant/40 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Harga & Manajemen Stok</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-on-surface">Harga Jual (Rp) *</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      required
                      className="field text-xs py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-on-surface">Harga Coret (Rp)</label>
                    <input
                      type="number"
                      value={editingProduct.original_price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, original_price: Number(e.target.value) })}
                      className="field text-xs py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-on-surface">Stok Tersedia</label>
                    <input
                      type="number"
                      value={editingProduct.stock_qty}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock_qty: Number(e.target.value) })}
                      className="field text-xs py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-on-surface">Lead Time</label>
                    <input
                      type="text"
                      value={editingProduct.lead_time}
                      onChange={(e) => setEditingProduct({ ...editingProduct, lead_time: e.target.value })}
                      placeholder="Jahit 3 hari"
                      className="field text-xs py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-on-surface">Badge Promo</label>
                    <input
                      type="text"
                      value={editingProduct.badge_text}
                      onChange={(e) => setEditingProduct({ ...editingProduct, badge_text: e.target.value })}
                      placeholder="Contoh: Best Seller / Diskon 20%"
                      className="field text-xs py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-on-surface">Label Ketersediaan</label>
                    <input
                      type="text"
                      value={editingProduct.stock_label}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock_label: e.target.value })}
                      placeholder="Ready Rangka (Jahit 3 Hari)"
                      className="field text-xs py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Seksi 4: Dimensi & Bahan */}
              <div className="space-y-4 border-t border-outline-variant/40 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Dimensi & Konstruksi</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-on-surface">Panjang (cm)</label>
                    <input
                      type="number"
                      value={editingProduct.footprint_p}
                      onChange={(e) => setEditingProduct({ ...editingProduct, footprint_p: Number(e.target.value) })}
                      className="field text-xs py-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-on-surface">Lebar (cm)</label>
                    <input
                      type="number"
                      value={editingProduct.footprint_l}
                      onChange={(e) => setEditingProduct({ ...editingProduct, footprint_l: Number(e.target.value) })}
                      className="field text-xs py-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-on-surface">Tinggi (cm)</label>
                    <input
                      type="number"
                      value={editingProduct.footprint_t}
                      onChange={(e) => setEditingProduct({ ...editingProduct, footprint_t: Number(e.target.value) })}
                      className="field text-xs py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-on-surface">Spesifikasi Rangka</label>
                    <input
                      type="text"
                      value={editingProduct.frame}
                      onChange={(e) => setEditingProduct({ ...editingProduct, frame: e.target.value })}
                      placeholder="Kayu Mahoni Solid Oven Anti Rayap"
                      className="field text-xs py-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-on-surface">Kepadatan Busa</label>
                    <input
                      type="text"
                      value={editingProduct.cushion}
                      onChange={(e) => setEditingProduct({ ...editingProduct, cushion: e.target.value })}
                      placeholder="Busa Royal D24 + Dacron Silicon"
                      className="field text-xs py-2"
                    />
                  </div>
                </div>

                {/* Varian Warna */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-on-surface">
                    Pilihan Warna yang Berlaku untuk Produk Ini:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => {
                      const isChecked = editingProduct.colors?.includes(c.key);
                      return (
                        <label
                          key={c.key}
                          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs cursor-pointer select-none transition-all ${
                            isChecked
                              ? "border-primary-container bg-primary-container/10 text-primary font-semibold"
                              : "border-outline-variant bg-surface-container-low text-on-surface-variant"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const curr = editingProduct.colors || [];
                              const next = e.target.checked
                                ? [...curr, c.key]
                                : curr.filter((k) => k !== c.key);
                              setEditingProduct({ ...editingProduct, colors: next });
                            }}
                            className="hidden"
                          />
                          <span
                            className="h-3 w-3 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Varian Bahan Cover */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-on-surface">
                    Pilihan Bahan Cover:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {materials.map((m) => {
                      const isChecked = editingProduct.materials?.includes(m.name);
                      return (
                        <label
                          key={m.name}
                          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs cursor-pointer select-none transition-all ${
                            isChecked
                              ? "border-primary-container bg-primary-container/10 text-primary font-semibold"
                              : "border-outline-variant bg-surface-container-low text-on-surface-variant"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const curr = editingProduct.materials || [];
                              const next = e.target.checked
                                ? [...curr, m.name]
                                : curr.filter((n) => n !== m.name);
                              setEditingProduct({ ...editingProduct, materials: next });
                            }}
                            className="hidden"
                          />
                          <span>{m.name}</span>
                          {m.price > 0 && <span className="text-[10px] opacity-75">(+{formatPrice(m.price)})</span>}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Spesifikasi Kustom Dinamis */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-on-surface">Spesifikasi Tambahan</label>
                    <button
                      type="button"
                      onClick={handleAddSpec}
                      className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      <Icon name="add" className="text-sm" /> Tambah Baris
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(editingProduct.specs || []).map((s, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={s.label}
                          onChange={(e) => handleSpecChange(idx, "label", e.target.value)}
                          placeholder="Label (mis. Garansi)"
                          className="field text-xs py-1.5 w-1/3"
                        />
                        <input
                          type="text"
                          value={s.value}
                          onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                          placeholder="Nilai (mis. 5 Tahun Rangka)"
                          className="field text-xs py-1.5 flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(idx)}
                          className="text-error p-1 hover:bg-error/10 rounded"
                        >
                          <Icon name="delete" className="text-base" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Seksi 5: Toggles & Status */}
              <div className="border-t border-outline-variant/40 pt-4 flex flex-wrap gap-6 items-center">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-on-surface">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_active}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                    className="h-4 w-4 rounded border-outline-variant text-primary"
                  />
                  <span>Tampilkan di Katalog (Status Aktif)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-on-surface">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="h-4 w-4 rounded border-outline-variant text-primary"
                  />
                  <span>Produk Unggulan (Tampil di Beranda)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-on-surface">
                  <input
                    type="checkbox"
                    checked={editingProduct.has_orientation}
                    onChange={(e) => setEditingProduct({ ...editingProduct, has_orientation: e.target.checked })}
                    className="h-4 w-4 rounded border-outline-variant text-primary"
                  />
                  <span>Ada Pilihan L-Kiri / L-Kanan</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-outline-variant/60 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary py-2 px-4 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary py-2 px-6 text-xs"
                >
                  {saving ? "Menyimpan..." : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL KONFIRMASI HAPUS ─── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-surface-container-lowest p-6 shadow-xl border border-outline-variant text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error mb-4">
              <Icon name="delete" className="text-2xl" />
            </div>
            <h3 className="font-headline-sm text-base font-bold text-on-surface">Hapus Produk Ini?</h3>
            <p className="mt-1 text-xs text-on-surface-variant">
              Tindakan ini akan menghapus produk dari katalog toko.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-secondary flex-1 py-2 text-xs"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="btn-primary flex-1 py-2 text-xs bg-error hover:bg-error/90 text-white"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
