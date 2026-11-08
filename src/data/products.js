import { IMG, LOGO_URL, PRODUCT_IMG } from "./images";

export { LOGO_URL, IMG, PRODUCT_IMG };

/* ------------------------------------------------------------------ */
/* Referensi: warna, bahan, kategori                                    */
/* ------------------------------------------------------------------ */

export const COLORS = {
  azure: { key: "azure", name: "Biru Langit Azure", hex: "#38bdf8" },
  misty: { key: "misty", name: "Abu Misty", hex: "#94a3b8" },
  mocca: { key: "mocca", name: "Mocca Latte", hex: "#b59a80" },
  white: { key: "white", name: "Broken White", hex: "#f1f5f9" },
  emerald: { key: "emerald", name: "Emerald Dark", hex: "#064e3b" },
  horizon: { key: "horizon", name: "Biru Horizon", hex: "#0369a1" },
  navy: { key: "navy", name: "Navy Malam", hex: "#213145" },
  amber: { key: "amber", name: "Amber Madu", hex: "#febc79" },
  charcoal: { key: "charcoal", name: "Arang Charcoal", hex: "#40474f" },
  walnut: { key: "walnut", name: "Walnut Klasik", hex: "#84531a" },
  oak: { key: "oak", name: "Natural Oak", hex: "#c8a572" },
  maroon: { key: "maroon", name: "Merah Maroon", hex: "#8b1e2d" },
};

export const COLOR_LIST = Object.values(COLORS);

// Selisih harga bahan dihitung relatif terhadap bahan bawaan produk.
export const MATERIALS = [
  { name: "Kanvas Linen", price: 0, desc: "Adem & tahan serat" },
  { name: "Velvet Mewah", price: 150000, desc: "Lembut, kilau halus" },
  { name: "Beludru", price: 200000, desc: "Tebal & hangat" },
  { name: "Boucle", price: 250000, desc: "Tekstur wol modern" },
  { name: "Oscar Kulit", price: 400000, desc: "Kulit sintetis premium" },
];

export const MATERIAL_NAMES = MATERIALS.map((m) => m.name);

export const CATEGORIES = [
  { id: "sudut", name: "Sofa L Sudut", icon: "weekend", blurb: "Keluarga & santai" },
  { id: "retro", name: "Sofa Retro", icon: "chair_alt", blurb: "2 & 3 seater klasik" },
  { id: "chester", name: "Chesterfield", icon: "auto_awesome", blurb: "Kancing tufted" },
  { id: "turki", name: "Sofa Turki", icon: "king_bed", blurb: "Luxury set ukir" },
  { id: "bed", name: "Sofa Bed", icon: "single_bed", blurb: "2-in-1 multifungsi" },
  { id: "set", name: "Sofa Set Minimalis", icon: "living", blurb: "Paket sofa + meja + puff" },
  { id: "aksesoris", name: "Aksesoris Ruang", icon: "table_restaurant", blurb: "Meja, karpet, bantal" },
];

export const categoryName = (id) => CATEGORIES.find((c) => c.id === id)?.name ?? "Lainnya";

/* ------------------------------------------------------------------ */
/* Ulasan                                                               */
/* ------------------------------------------------------------------ */

export const REVIEW_POOL = [
  {
    name: "Dimas Rahardian",
    initials: "DR",
    avatarBg: "bg-primary-fixed",
    avatarText: "text-primary",
    rating: 5,
    city: "Tangerang",
    comment:
      "Warnanya bener-bener pas dengan cat dinding rumah scandi saya. Busanya empuk tapi padat, gak amblas.",
    image: IMG.review1,
  },
  {
    name: "Anisa Maharani",
    initials: "AM",
    avatarBg: "bg-secondary-fixed",
    avatarText: "text-secondary",
    rating: 5,
    city: "BSD",
    comment:
      "Kualitas jahitannya rapi banget, pengiriman ke BSD cuma 3 hari setelah jahitan beres. Packing aman berlapis.",
    image: IMG.review2,
  },
  {
    name: "Bambang Prakoso",
    initials: "BP",
    avatarBg: "bg-tertiary-fixed",
    avatarText: "text-tertiary",
    rating: 5,
    city: "Jakarta Selatan",
    comment:
      "Ukurannya pas banget di ruang keluarga apartemen saya. Efisien tempat tapi tetap muat 4-5 orang.",
    image: IMG.review3,
  },
  {
    name: "Citra Lestari",
    initials: "CL",
    avatarBg: "bg-primary-fixed",
    avatarText: "text-primary",
    rating: 5,
    city: "Bandung",
    comment:
      "Admin responsif, bisa request ganti kain dan hasilnya sesuai foto. Tukang pasangnya juga ramah dan rapi.",
  },
  {
    name: "Eko Wicaksono",
    initials: "EW",
    avatarBg: "bg-secondary-fixed",
    avatarText: "text-secondary",
    rating: 4,
    city: "Surabaya",
    comment:
      "Overall bagus, rangka kokoh dan finishing halus. Pengiriman lewat kargo agak lama tapi barang sampai tanpa lecet.",
  },
  {
    name: "Fitri Handayani",
    initials: "FH",
    avatarBg: "bg-tertiary-fixed",
    avatarText: "text-tertiary",
    rating: 5,
    city: "Semarang",
    comment:
      "Sudah 8 bulan dipakai tiap hari, busanya tidak kempes sama sekali. Worth it banget untuk harga workshop langsung.",
  },
];

/* ------------------------------------------------------------------ */
/* Katalog                                                              */
/* ------------------------------------------------------------------ */

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const fmtCm = (fp) => `P ${fp.p}cm × L ${fp.l}cm × T ${fp.t}cm`;

const buildSpecs = (p) => {
  const rows = [{ label: "Konstruksi Rangka", value: p.frame }];
  if (p.cushion) rows.push({ label: "Kepadatan Busa", value: p.cushion });
  rows.push({ label: "Dimensi", value: fmtCm(p.footprint) });
  if (p.materials.length) {
    rows.push({ label: "Pilihan Bahan Cover", value: p.materials.join(", ") });
  }
  rows.push({
    label: "Garansi",
    value:
      p.category === "aksesoris"
        ? "1 Tahun garansi konstruksi dari workshop Sky Furniture"
        : "5 Tahun garansi rangka kayu & pegas patah dari workshop Sky Furniture",
  });
  return rows;
};

const defaultAbout = (p) =>
  `${p.name} dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. ${p.description}. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.`;

const make = (o) => {
  const materials = o.materials ?? (o.category === "aksesoris" ? [] : MATERIAL_NAMES);
  const product = {
    soldCount: Math.round(o.reviewCount * 2.2),
    stockQty: 12,
    leadTime: o.category === "aksesoris" ? "Kirim 1-2 hari" : "Jahit 3 hari",
    hasOrientation: false,
    daysOld: 60,
    seats: null,
    isActive: true,
    ...o,
    materials,
    material: o.material ?? (materials.length ? "Kanvas Linen" : null),
    slug: o.slug ?? slugify(o.name),
    colors: o.colors.map((k) => COLORS[k]).filter(Boolean),
  };
  product.dimensions = fmtCm(product.footprint);
  product.minRoom = {
    w: (product.footprint.p + 70) / 100,
    l: (product.footprint.l + 80) / 100,
  };
  product.about = o.about ?? defaultAbout(product);
  product.specs = o.specs ?? buildSpecs(product);
  product.discount =
    product.originalPrice > 0 ? Math.max(0, Math.round((1 - product.price / product.originalPrice) * 100)) : 0;
  product.reviews = o.reviews ?? null;
  return product;
};

const sudut1Reviews = REVIEW_POOL.slice(0, 3).map((r, i) => ({
  ...r,
  id: i + 1,
  daysAgo: 4 + i * 6,
  comment: [
    "Warna Biru Azure-nya bener-bener pas banget dengan cat dinding rumah scandi saya. Busanya empuk tapi padat, gak amblas.",
    "Kualitas jahitannya rapi banget, pengiriman ke BSD cuma 3 hari setelah jahitan beres. Bonus meja tamunya juga kokoh.",
    "Sudut L-nya pas banget di sudut ruang keluarga apartemen saya. Sangat efisien tempat tapi muat duduk 4-5 orang.",
  ][i],
}));

export const ALL_PRODUCTS = [
  make({
    id: 9,
    name: "Sofa L Sudut Minimalis Modern Sky",
    category: "sudut",
    subtitle: "Sofa L Sudut Series",
    description: "Sectional minimalis, bantalan ganda standar hotel resor",
    about:
      "Hadirkan ketenangan atmosfer horizon ke dalam ruang tamu keluarga Anda dengan Sofa L Sudut Minimalis Modern Sky. Dibuat dengan presisi arsitektural kontemporer, sofa sectional ini mengombinasikan siluet garis bersih khas Skandinavia dengan kenyamanan bantalan ganda berstandar hotel resor.",
    image: PRODUCT_IMG.sudutMinimalis1,
    gallery: [PRODUCT_IMG.sudutMinimalis1, PRODUCT_IMG.sudutMinimalis2],
    badge: { text: "Best Seller No. 1", color: "bg-primary", textColor: "text-on-primary" },
    rating: 5.0,
    reviewCount: 210,
    soldCount: 420,
    originalPrice: 3200000,
    price: 2785000,
    colors: ["azure", "misty", "mocca", "white", "emerald", "horizon"],
    footprint: { p: 210, l: 160, t: 85 },
    frame: "Kayu Mahoni Solid Oven Anti Rayap",
    cushion: "Busa Rebounded D24 + High-Density Foam D30",
    stock: "Ready Rangka (Jahit 3 Hari)",
    stockQty: 7,
    hasOrientation: true,
    seats: 5,
    daysOld: 8,
    featured: true,
    specs: [
      { label: "Konstruksi Rangka", value: "Kayu Mahoni Solid (Oven Kiln-Dried MC 12%) anti rayap dan bubuk" },
      { label: "Struktur Pegas", value: "Per Baja Zig-zag (S-Spring) elastis tinggi dipadu webbing elastis 7cm" },
      { label: "Kepadatan Busa", value: "Lapisan Dasar Busa Rebounded D24 + Top Layer High-Density Foam D30" },
      { label: "Kaki Sofa", value: "Kayu Jati Solid finishing Walnut Natural dengan alas felt anti gores lantai" },
      { label: "Garansi Konstruksi", value: "5 Tahun Garansi Rangka Kayu & Pegas Patah dari Workshop Sky Furniture" },
    ],
    reviews: sudut1Reviews,
  }),
  make({
    id: 1,
    name: "Sofa Retro 3 Seater",
    category: "retro",
    subtitle: "Sofa Retro Series",
    description: "Busa Royal D24, Mahoni Oven 190x80cm",
    image: PRODUCT_IMG.retro3,
    badge: { text: "Best Seller", color: "bg-primary", textColor: "text-on-primary" },
    rating: 4.9,
    reviewCount: 189,
    originalPrice: 2450000,
    price: 1895000,
    colors: ["horizon", "misty", "mocca", "navy", "emerald", "amber"],
    footprint: { p: 190, l: 80, t: 85 },
    frame: "Kayu Mahoni Oven 190×80cm, sambungan dowel & lem PVAc",
    cushion: "Busa Royal D24",
    seats: 3,
    daysOld: 30,
    featured: true,
  }),
  make({
    id: 2,
    name: "Sofa L Jumbo",
    category: "sudut",
    subtitle: "Sectional Family",
    description: "Kapasitas 6 Orang, Kain Beludru Impor",
    image: PRODUCT_IMG.lJumbo,
    badge: { text: "Diskon 25%", color: "bg-secondary", textColor: "text-on-secondary" },
    rating: 4.9,
    reviewCount: 245,
    originalPrice: 4250000,
    price: 3415000,
    colors: ["horizon", "charcoal", "amber", "emerald", "misty"],
    material: "Beludru",
    footprint: { p: 300, l: 190, t: 85 },
    frame: "Kayu Mahoni Solid dengan penguat besi hollow di sudut",
    cushion: "Busa Rebounded D24 + Dacron Silicon",
    stockQty: 4,
    seats: 6,
    hasOrientation: true,
    daysOld: 14,
    featured: true,
  }),
  make({
    id: 3,
    name: "Sofa L Beranak",
    category: "sudut",
    subtitle: "Smart Living",
    description: "Disertai 2 Puff Simpanan Praktis",
    image: PRODUCT_IMG.lBeranak,
    badge: { text: "Multifungsi", color: "bg-tertiary", textColor: "text-on-tertiary" },
    rating: 4.9,
    reviewCount: 132,
    originalPrice: 4500000,
    price: 3565000,
    colors: ["azure", "charcoal", "white", "mocca"],
    footprint: { p: 270, l: 170, t: 85 },
    frame: "Kayu Mahoni Solid, puff dengan ruang simpan bawah",
    cushion: "Busa Royal D24 + Dacron Silicon",
    seats: 5,
    hasOrientation: true,
    daysOld: 21,
    featured: true,
  }),
  make({
    id: 4,
    name: "Sofa Turki 321 Luxury",
    category: "turki",
    subtitle: "Classic Royalty",
    description: "Set Formasi Lengkap Meja Kaca Tempered",
    image: PRODUCT_IMG.turki1,
    gallery: [PRODUCT_IMG.turki1, PRODUCT_IMG.turki2],
    badge: { text: "Sultan Suite", color: "bg-secondary-container", textColor: "text-on-secondary-container" },
    rating: 5.0,
    reviewCount: 98,
    originalPrice: 7800000,
    price: 6375000,
    colors: ["horizon", "amber", "white", "emerald"],
    footprint: { p: 320, l: 95, t: 95 },
    frame: "Kayu Mahoni ukir Jepara, finishing melamic doff",
    cushion: "Busa Royal D28 + Dacron Silicon",
    stockQty: 0,
    leadTime: "Pre-Order 14 hari",
    seats: 6,
    daysOld: 45,
    featured: true,
  }),
  make({
    id: 5,
    name: "Sofa L Kancing Meja",
    category: "chester",
    subtitle: "Tufted Chesterfield",
    description: "Free Bantal Dacron Silicon 5 Pcs",
    image: PRODUCT_IMG.kancing1,
    gallery: [PRODUCT_IMG.kancing1, PRODUCT_IMG.kancing2, PRODUCT_IMG.kancing3, PRODUCT_IMG.kancing4],
    badge: { text: "Paket Hemat Meja", color: "bg-primary-fixed", textColor: "text-on-primary-fixed" },
    rating: 4.9,
    reviewCount: 310,
    originalPrice: 3350000,
    price: 2735000,
    colors: ["horizon", "misty", "walnut", "navy"],
    footprint: { p: 260, l: 160, t: 75 },
    frame: "Kayu Mahoni solid, kancing tufted dijahit tangan",
    cushion: "Busa Royal D24 + Dacron Silicon",
    seats: 5,
    hasOrientation: true,
    daysOld: 19,
    featured: true,
  }),
  make({
    id: 6,
    name: "Sofa Retro 2 Seater",
    category: "retro",
    subtitle: "Apartment Friendly",
    description: "Ukuran Ringkas 140x78cm Cocok Ruang Mini",
    image: PRODUCT_IMG.retro2,
    rating: 4.8,
    reviewCount: 85,
    originalPrice: 1950000,
    price: 1490000,
    colors: ["azure", "white", "navy", "mocca"],
    footprint: { p: 140, l: 78, t: 85 },
    frame: "Kayu Mahoni Oven 140×78cm",
    cushion: "Busa Royal D24",
    stockQty: 15,
    seats: 2,
    daysOld: 70,
    featured: true,
  }),
  make({
    id: 7,
    name: "Sofa Bed Sky Comfort",
    category: "bed",
    subtitle: "Multi Function",
    description: "Mekanisme Engsel Baja 3 Posisi Rebah",
    image: IMG.sofaBed,
    isActive: false, // belum ada foto asli
    badge: { text: "2-in-1 Recliner", color: "bg-primary-fixed", textColor: "text-on-primary-fixed" },
    rating: 4.9,
    reviewCount: 176,
    originalPrice: 2900000,
    price: 2250000,
    colors: ["horizon", "misty", "walnut", "charcoal"],
    footprint: { p: 190, l: 90, t: 85 },
    frame: "Rangka besi hollow + kayu mahoni, engsel baja 3 posisi",
    cushion: "Busa Royal D24 padat",
    stockQty: 6,
    seats: 3,
    daysOld: 11,
    featured: true,
  }),
  make({
    id: 8,
    name: "Sofa Puff Ottoman",
    category: "aksesoris",
    subtitle: "Aksen Ruang",
    description: "Boucle Premium Mahoni Plinth Base",
    image: IMG.puff,
    isActive: false, // belum ada foto asli
    rating: 4.8,
    reviewCount: 64,
    originalPrice: 980000,
    price: 750000,
    colors: ["azure", "white", "emerald"],
    material: "Boucle",
    footprint: { p: 60, l: 60, t: 40 },
    frame: "Plinth base kayu mahoni, penutup boucle premium",
    cushion: "Busa Royal D24",
    materials: ["Boucle", "Velvet Mewah", "Kanvas Linen"],
    stockQty: 20,
    daysOld: 90,
    featured: false,
  }),
  make({
    id: 101,
    name: "Meja Kopi Nordik Oak",
    category: "aksesoris",
    subtitle: "Aksesoris Ruang",
    description: "Kayu Jati Solid Natural",
    image: IMG.mejaKopi,
    isActive: false, // belum ada foto asli
    rating: 4.8,
    reviewCount: 58,
    originalPrice: 1350000,
    price: 1150000,
    colors: ["oak", "walnut"],
    footprint: { p: 100, l: 50, t: 45 },
    frame: "Kayu jati solid finishing natural oil",
    cushion: null,
    stockQty: 18,
    daysOld: 40,
  }),
  make({
    id: 102,
    name: "Armchair Bouclé Sky Line",
    category: "aksesoris",
    subtitle: "Kursi Santai",
    description: "Kain Wol Bouclé Premium",
    image: IMG.armchair,
    isActive: false, // belum ada foto asli
    badge: { text: "Baru", color: "bg-secondary-container", textColor: "text-on-secondary-container" },
    rating: 4.9,
    reviewCount: 41,
    originalPrice: 2150000,
    price: 1850000,
    colors: ["white", "mocca", "azure"],
    material: "Boucle",
    materials: ["Boucle", "Kanvas Linen", "Velvet Mewah"],
    footprint: { p: 80, l: 78, t: 82 },
    frame: "Kayu mahoni solid, kaki jati walnut",
    cushion: "Busa Royal D24",
    stockQty: 9,
    seats: 1,
    daysOld: 5,
  }),
  make({
    id: 103,
    name: "Buffet TV Minimalis",
    category: "aksesoris",
    subtitle: "Furnitur Penyimpanan",
    description: "Panjang 180cm Mahoni",
    image: IMG.buffet,
    isActive: false, // belum ada foto asli
    rating: 4.7,
    reviewCount: 73,
    originalPrice: 2850000,
    price: 2450000,
    colors: ["walnut", "oak", "white"],
    footprint: { p: 180, l: 40, t: 50 },
    frame: "Kayu mahoni solid + blockboard, handle tersembunyi",
    cushion: null,
    stockQty: 8,
    daysOld: 33,
  }),
  make({
    id: 104,
    name: "Karpet Tenun Azure Wave",
    category: "aksesoris",
    subtitle: "Dekorasi Lantai",
    description: "Serat Wool Organik 200x150",
    image: IMG.karpet,
    isActive: false, // belum ada foto asli
    rating: 4.8,
    reviewCount: 37,
    originalPrice: 1050000,
    price: 875000,
    colors: ["azure", "misty", "mocca"],
    footprint: { p: 200, l: 150, t: 2 },
    frame: "Tenun tangan serat wool organik, backing anti slip",
    cushion: null,
    stockQty: 25,
    daysOld: 25,
  }),
  make({
    id: 105,
    name: "Bantal Dakron Linen",
    category: "aksesoris",
    subtitle: "Aksesoris Sofa",
    description: "Isi Dacron Silicon, Sarung Linen Bisa Dilepas",
    image: "",
    isActive: false, // belum ada foto asli
    rating: 4.9,
    reviewCount: 120,
    originalPrice: 335000,
    price: 285000,
    colors: ["azure", "white", "mocca", "navy"],
    footprint: { p: 45, l: 45, t: 12 },
    frame: "Sarung linen dengan resleting tersembunyi",
    cushion: "Dacron Silicon premium",
    stockQty: 60,
    daysOld: 100,
  }),

  /* ---- Produk tambahan sesuai foto asli toko Shopee SKY FURNITUR ---- */
  /* Harga & spesifikasi masih perkiraan: sesuaikan lewat panel admin.   */
  make({
    id: 10,
    name: "Sofa L Kulit Jumbo + Meja & 2 Puff",
    category: "sudut",
    subtitle: "Sofa L Kulit Series",
    description: "Kulit sintetis Oscar, lengan bulat ber-rivet, bonus meja kaca & 2 puff",
    image: PRODUCT_IMG.kulitJumbo1,
    gallery: [PRODUCT_IMG.kulitJumbo1, PRODUCT_IMG.kulitJumbo2],
    badge: { text: "Paket Lengkap", color: "bg-secondary", textColor: "text-on-secondary" },
    rating: 4.9,
    reviewCount: 74,
    originalPrice: 5500000,
    price: 4650000,
    colors: ["walnut", "charcoal"],
    material: "Oscar Kulit",
    footprint: { p: 320, l: 200, t: 85 },
    frame: "Kayu Mahoni Solid Oven, lengan bulat dengan aksen rivet",
    cushion: "Busa Royal D24 + Dacron Silicon",
    seats: 7,
    hasOrientation: true,
    stockQty: 5,
    daysOld: 12,
    featured: true,
  }),
  make({
    id: 11,
    name: "Sofa L Kulit Minimalis + Meja",
    category: "sudut",
    subtitle: "Sofa L Kulit Series",
    description: "Kulit sintetis Oscar cokelat, kancing kristal, bonus meja kaca",
    image: PRODUCT_IMG.kulitMinimalis,
    rating: 4.8,
    reviewCount: 52,
    originalPrice: 4200000,
    price: 3450000,
    colors: ["walnut", "charcoal"],
    material: "Oscar Kulit",
    footprint: { p: 240, l: 170, t: 85 },
    frame: "Kayu Mahoni Solid Oven, lengan bulat dengan aksen rivet",
    cushion: "Busa Royal D24 + Dacron Silicon",
    seats: 5,
    hasOrientation: true,
    stockQty: 6,
    daysOld: 26,
  }),
  make({
    id: 12,
    name: "Sofa Minimalis 3 Seater + Meja & 2 Puff",
    category: "set",
    subtitle: "Sofa Set Minimalis",
    description: "Paket hemat sofa 3 dudukan, meja laci kaca, dan 2 puff kotak",
    image: PRODUCT_IMG.minimalis3Puff,
    badge: { text: "Paket Hemat", color: "bg-primary-fixed", textColor: "text-on-primary-fixed" },
    rating: 4.9,
    reviewCount: 96,
    originalPrice: 3100000,
    price: 2550000,
    colors: ["maroon", "navy", "misty", "mocca"],
    footprint: { p: 190, l: 80, t: 80 },
    frame: "Kayu Mahoni Oven, sambungan dowel & lem PVAc",
    cushion: "Busa Royal D24",
    seats: 3,
    stockQty: 10,
    daysOld: 9,
    featured: true,
  }),
  make({
    id: 13,
    name: "Sofa Minimalis 2 Seater + Meja & 2 Puff",
    category: "set",
    subtitle: "Sofa Set Minimalis",
    description: "Ringkas untuk ruang mini: sofa 2 dudukan, meja laci kaca, dan 2 puff",
    image: PRODUCT_IMG.minimalis2Puff,
    rating: 4.8,
    reviewCount: 81,
    originalPrice: 2600000,
    price: 2150000,
    colors: ["mocca", "walnut", "misty", "navy"],
    footprint: { p: 140, l: 78, t: 80 },
    frame: "Kayu Mahoni Oven, sambungan dowel & lem PVAc",
    cushion: "Busa Royal D24",
    seats: 2,
    stockQty: 11,
    daysOld: 18,
    featured: true,
  }),
  make({
    id: 14,
    name: "Sofa Set Minimalis 321",
    category: "set",
    subtitle: "Sofa Set Minimalis",
    description: "Set lengkap 3+2+1 dudukan dengan meja tamu minimalis",
    image: PRODUCT_IMG.set321,
    badge: { text: "Set Keluarga", color: "bg-tertiary", textColor: "text-on-tertiary" },
    rating: 4.9,
    reviewCount: 67,
    originalPrice: 5200000,
    price: 4350000,
    colors: ["navy", "misty", "charcoal", "mocca"],
    footprint: { p: 190, l: 80, t: 80 },
    frame: "Kayu Mahoni Oven, sambungan dowel & lem PVAc",
    cushion: "Busa Royal D24",
    seats: 6,
    stockQty: 4,
    daysOld: 15,
    featured: true,
  }),
  make({
    id: 15,
    name: "Sofa Retro Set 211 + Meja & 2 Puff",
    category: "retro",
    subtitle: "Sofa Retro Series",
    description: "Sofa retro 2 dudukan + 1 single, meja putih kaki kayu, dan 2 puff bulat",
    image: PRODUCT_IMG.retroSet211,
    rating: 4.9,
    reviewCount: 58,
    originalPrice: 4300000,
    price: 3600000,
    colors: ["mocca", "misty", "charcoal", "navy"],
    footprint: { p: 140, l: 78, t: 85 },
    frame: "Kayu Mahoni Oven, kaki kayu bulat finishing putih",
    cushion: "Busa Royal D24",
    seats: 4,
    stockQty: 7,
    daysOld: 22,
    featured: true,
  }),
];

/** Katalog yang tampil di toko (produk nonaktif tetap bisa dicari lewat ID/slug untuk pesanan lama). */
export const PRODUCTS = ALL_PRODUCTS.filter((p) => p.isActive);

export const PRODUCT_BY_ID = Object.fromEntries(ALL_PRODUCTS.map((p) => [p.id, p]));
export const PRODUCT_BY_SLUG = Object.fromEntries(ALL_PRODUCTS.map((p) => [p.slug, p]));

// `let`: ikut berubah saat katalog diganti oleh data dari CMS (live binding).
export let DEFAULT_PRODUCT = PRODUCT_BY_ID[9];

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.featured);

export const getProduct = (idOrSlug) =>
  PRODUCT_BY_SLUG[idOrSlug] ?? PRODUCT_BY_ID[Number(idOrSlug)] ?? null;

export const getBonusProduct = (product) =>
  product?.bonusProductId ? PRODUCT_BY_ID[product.bonusProductId] : null;

/** Produk yang cocok dipasangkan: aksesoris dulu, kemudian kategori yang sama. */
export const getRelatedProducts = (product, limit = 4) => {
  const sameCat = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category);
  const accessories = PRODUCTS.filter((p) => p.id !== product.id && p.category === "aksesoris");
  const rest = PRODUCTS.filter((p) => p.id !== product.id);
  const seen = new Set();
  return [...accessories.slice(0, 2), ...sameCat, ...rest]
    .filter((p) => (seen.has(p.id) ? false : seen.add(p.id)))
    .slice(0, limit);
};

export const getReviews = (product) => {
  if (product.reviews) return product.reviews;
  const start = product.id % REVIEW_POOL.length;
  return [0, 1, 2].map((i) => {
    const base = REVIEW_POOL[(start + i) % REVIEW_POOL.length];
    return { ...base, id: `${product.id}-${i}`, daysAgo: 5 + i * 9 + (product.id % 5), image: undefined };
  });
};

export const getRatingDistribution = (rating) => {
  const d = Math.max(0, 5 - rating);
  const raw = [1 - d * 0.9, d * 0.6, d * 0.25, d * 0.1, d * 0.05];
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map((v, i) => ({ stars: 5 - i, share: v / sum }));
};

export const stockInfo = (product) => {
  if (product.stockQty === 0) return { tone: "warn", label: product.leadTime, short: "Pre-Order" };
  if (product.stockQty < 10) return { tone: "low", label: `Sisa ${product.stockQty} unit`, short: `Sisa ${product.stockQty}` };
  return { tone: "ok", label: product.stock ?? "Ready Stock", short: "Ready" };
};
