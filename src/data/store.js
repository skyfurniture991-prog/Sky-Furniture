import { IMG } from "./images";

/* Konfigurasi toko: kontak, promo, pengiriman, pembayaran, konten marketing */

export const WHATSAPP_NUMBER = "6281123456789";

export const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const FREE_SHIPPING_THRESHOLD = 3000000;
export const TAX_RATE = 0.11;
export const MAX_QTY = 10;

export const PROMO_CODES = {
  SKYBIRU: {
    code: "SKYBIRU",
    label: "Diskon 10% (maks. Rp 500.000)",
    type: "percent",
    value: 10,
    max: 500000,
    min: 1000000,
  },
  JEPARA150: {
    code: "JEPARA150",
    label: "Potongan Rp 150.000",
    type: "flat",
    value: 150000,
    min: 2000000,
  },
  ONGKIRGRATIS: {
    code: "ONGKIRGRATIS",
    label: "Gratis ongkir semua layanan",
    type: "shipping",
    value: 0,
    min: 500000,
  },
};

export const SHIPPING_METHODS = [
  {
    id: "direct",
    name: "Sky Direct (Armada Toko)",
    desc: "1–3 hari kerja setelah jahit selesai. Khusus Palembang & Banyuasin. Termasuk perakitan",
    price: 100000,
    freeAbove: FREE_SHIPPING_THRESHOLD,
    days: [1, 3],
    icon: "local_shipping",
  },
  {
    id: "express",
    name: "Sky Express Palembang",
    desc: "1–2 hari kerja untuk sofa ready stok area Kota Palembang",
    price: 150000,
    days: [1, 2],
    icon: "bolt",
  },
  {
    id: "cargo",
    name: "Kargo Darat Antar Kabupaten Sumsel",
    desc: "3–5 hari kerja. Meliputi Ogan Ilir, OKI, Prabumulih, Muara Enim, Lahat, Lubuklinggau, dll.",
    price: 250000,
    days: [3, 5],
    icon: "local_shipping",
  },
];

export const PAYMENT_METHODS = {
  transfer: [
    { id: "bca", name: "BCA Virtual Account", code: "BCA", desc: "Pembayaran otomatis, konfirmasi instan" },
    { id: "mandiri", name: "Mandiri Virtual Account", code: "Mandiri", desc: "Berlaku 24 jam, bayar via ATM / M-Banking" },
    { id: "bni", name: "BNI Virtual Account", code: "BNI", desc: "Pembayaran ATM / Internet Banking BNI" },
    { id: "bri", name: "BRI Virtual Account", code: "BRI", desc: "Pembayaran otomatis via BRIMO / ATM BRI" },
  ],
  ewallet: [
    { id: "gopay", name: "GoPay", code: "GoPay", desc: "Scan QR atau bayar via Gojek App" },
    { id: "shopeepay", name: "ShopeePay", code: "SPay", desc: "Bayar via aplikasi Shopee" },
  ],
  cod: [{ id: "cod", name: "Bayar di Tempat (COD)", code: null, desc: "Bayar tunai saat armada toko tiba di lokasi" }],
  cicilan: [{ id: "cicilan", name: "Cicilan Kartu Kredit 0%", code: null, desc: "BCA, Mandiri, BNI, dan CIMB" }],
};

export const PROVINCES = [
  { value: "sumsel", label: "Sumatera Selatan" },
];

export const SUMSEL_CITIES = [
  "Kota Palembang",
  "Kab. Banyuasin",
  "Kab. Ogan Ilir (Indralaya)",
  "Kab. Ogan Komering Ilir (Kayuagung)",
  "Kota Prabumulih",
  "Kab. Muara Enim",
  "Kota Pagar Alam",
  "Kota Lubuklinggau",
  "Kab. Lahat",
  "Kab. Musi Banyuasin (Sekayu)",
  "Kab. Ogan Komering Ulu (Baturaja)",
  "Kab. OKU Timur",
  "Kab. OKU Selatan",
  "Kab. Musi Rawas",
  "Kab. Musi Rawas Utara",
  "Kab. PALI",
  "Kab. Empat Lawang",
];

export const ORDER_STAGES = [
  { id: "received", label: "Pesanan Diterima", desc: "Pesanan Anda sudah masuk ke sistem kami.", icon: "receipt_long" },
  { id: "paid", label: "Pembayaran Terverifikasi", desc: "Pembayaran dikonfirmasi oleh tim finance.", icon: "payments" },
  { id: "production", label: "Produksi di Workshop", desc: "Pengrajin merakit rangka & penjahitan cover sofa.", icon: "construction" },
  { id: "qc", label: "Quality Control", desc: "Pemeriksaan kekuatan rangka, busa, dan jahitan.", icon: "fact_check" },
  { id: "shipping", label: "Dalam Pengiriman", desc: "Armada mebel menuju alamat Anda di Sumsel.", icon: "local_shipping" },
  { id: "delivered", label: "Tiba & Terpasang", desc: "Sofa tiba dan dirapikan oleh tim instalasi.", icon: "home_work" },
];

/* Konten marketing ------------------------------------------------- */

export const HERO_DATA = {
  badge: "Koleksi Signature Mahoni & Boucle",
  title: "Kenyamanan Mewah dengan Nuansa Biru Langit dan Kayu Mahoni Alami",
  subtitle:
    "Estetika arsitektural Skandinavia yang dirancang khusus untuk kenyamanan ruang keluarga. Dibuat presisi langsung oleh pengrajin workshop Sky Furniture Palembang dengan busa tahan kempes & kain premium bertekstur sejuk.",
  image: IMG.hero,
  floatingProductId: 9,
  stats: [
    { value: 5, suffix: " Tahun", label: "Garansi Rangka" },
    { value: 100, suffix: "%", label: "Kayu Mahoni Oven" },
    { value: 4.9, suffix: "/5.0", label: "Ulasan Kepuasan", decimals: 1 },
  ],
};

export const TRUST_ITEMS = [
  { icon: "forest", text: "Rangka Mahoni Oven Anti Rayap" },
  { icon: "verified_user", text: "Garansi Rangka 5 Tahun" },
  { icon: "local_shipping", text: "Gratis Ongkir Area Sumsel" },
  { icon: "design_services", text: "Konsultasi Desain Gratis" },
  { icon: "payments", text: "Cicilan 0% Hingga 12 Bulan" },
  { icon: "workspace_premium", text: "Workshop Pengrajin Palembang" },
];

export const WHY_US = [
  {
    title: "Kayu Mahoni 100%",
    description: "Rangka solid kiln-dried MC12%, anti rayap, anti jamur, tahan 15+ tahun",
    icon: "forest",
    bgColor: "bg-primary-container",
    iconColor: "text-on-primary",
  },
  {
    title: "Garansi 5 Tahun",
    description: "Garansi resmi rangka kayu dan pegas patah dari workshop Sky Furniture",
    icon: "verified_user",
    bgColor: "bg-secondary-container",
    iconColor: "text-on-secondary-container",
  },
  {
    title: "Ongkir Bebas",
    description: "Gratis ongkir se-Sumatera Selatan untuk belanja di atas Rp 3 juta, diantar langsung armada toko",
    icon: "local_shipping",
    bgColor: "bg-surface-container-high",
    iconColor: "text-primary",
  },
  {
    title: "Custom Bebas",
    description: "Dimensi, warna, kain, dan model sesuai keinginan dengan konsultasi gratis",
    icon: "design_services",
    bgColor: "bg-tertiary-fixed",
    iconColor: "text-tertiary",
  },
];

export const PROCESS_STEPS = [
  { icon: "chat", title: "Konsultasi", desc: "Ceritakan ukuran ruang & gaya rumah Anda. Desainer kami bantu memilih model yang tepat." },
  { icon: "palette", title: "Pilih Bahan & Warna", desc: "Lihat sampel kain dan finishing kayu. Kami kirim contoh fisik bila diperlukan." },
  { icon: "construction", title: "Produksi Workshop", desc: "Pengrajin Jepara merakit rangka mahoni oven dan menjahit sarung dengan tangan." },
  { icon: "fact_check", title: "Quality Control", desc: "Setiap unit diuji kekuatan rangka, kepadatan busa, dan kerapian jahitan." },
  { icon: "local_shipping", title: "Kirim & Instalasi", desc: "Armada khusus mebel mengantar, memasang, dan membersihkan area setelahnya." },
];

export const FAQS = [
  {
    q: "Berapa lama proses pembuatan sofa?",
    a: "Untuk model ready rangka, proses jahit kain memerlukan sekitar 3 hari kerja. Pesanan custom dimensi memerlukan 10–14 hari kerja, tergantung kerumitan model.",
  },
  {
    q: "Apakah saya bisa mengganti warna dan bahan kain?",
    a: "Bisa. Setiap produk memiliki pilihan warna dan bahan cover di halaman detail. Selisih harga bahan akan otomatis dihitung. Untuk kain di luar katalog, hubungi desainer kami via WhatsApp.",
  },
  {
    q: "Bagaimana cara klaim garansi rangka 5 tahun?",
    a: "Simpan nomor pesanan Anda, lalu kirim foto kerusakan ke WhatsApp kami. Tim akan menjadwalkan pengecekan dan perbaikan di rumah Anda tanpa biaya selama kerusakan bukan akibat pemakaian tidak wajar.",
  },
  {
    q: "Apakah ongkir sudah termasuk instalasi?",
    a: "Layanan Sky Direct sudah termasuk pengantaran, perakitan, dan instalasi. Untuk kargo luar Jawa, sofa dikirim dalam kondisi rakit sebagian dengan panduan pemasangan.",
  },
  {
    q: "Apakah bisa retur jika ukuran tidak muat?",
    a: "Gunakan fitur 'Cek Muat Ruangan' di halaman produk sebelum membeli. Jika tetap tidak sesuai, kami menerima penukaran model dalam 7 hari dengan ongkir ditanggung pembeli.",
  },
];

export const CATEGORIES_BAR = [
  { id: "retro", name: "Sofa Retro", sub: "2 & 3 Seater", icon: "chair_alt" },
  { id: "sudut", name: "Sofa L Sudut", sub: "Keluarga & Santai", icon: "weekend", featured: true },
  { id: "chester", name: "Sofa Kancing", sub: "Chesterfield Klasik", icon: "auto_awesome" },
  { id: "turki", name: "Sofa Turki", sub: "Luxury Set Ukir", icon: "king_bed" },
  { id: "custom", name: "Custom Bebas", sub: "Dimensi, Busa & Warna", icon: "design_services", featured: true, color: "secondary" },
];
