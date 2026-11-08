import { useLayoutEffect } from "react";
import reportCss from "./report.css?inline";

// CSS laporan memuat reset & aturan global (body, h2, table, ...). Agar tidak merusak
// halaman toko, stylesheet hanya dipasang selama halaman ini tampil.
const SCOPE_FIX = `
  .report-root { min-height: 100vh; font-family: 'Manrope', sans-serif; font-size: 11pt; line-height: 1.7; color: #0b1c30; }
  @media screen { .report-root { background: #e8ecf0; } }
  @media print { .report-root { background: #fff; } }
`;

export default function ReportPage() {
  useLayoutEffect(() => {
    const style = document.createElement("style");
    style.dataset.report = "true";
    style.textContent = reportCss + SCOPE_FIX;
    document.head.appendChild(style);
    const prevTitle = document.title;
    document.title = "Laporan Proyek · Sky Furniture";
    return () => {
      style.remove();
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="report-root">


{/* PRINT BUTTON */}
<div className="no-print">
  <button className="btn-print" onClick={() => window.print()}>
    🖨️ Simpan sebagai PDF (Ctrl+P)
  </button>
</div>

<div className="page-wrapper">

  {/* ═══════════════════════════════════════════════════
       HALAMAN COVER
  ═══════════════════════════════════════════════════ */}
  <div className="cover">
    <div className="cover-badge">📋 Laporan Proyek Praktikum E-Commerce</div>
    <h1>Sky Furniture<br /><span>E-Commerce</span><br />Platform</h1>
    <p className="subtitle">Pengembangan website toko furnitur premium berbasis desain UI/UX dari Google Stitch — menggabungkan estetika Skandinavia dengan kenyamanan belanja digital modern.</p>

    <div className="cover-stats">
      <div className="cover-stat"><div className="cover-stat-num">5</div><div className="cover-stat-label">Halaman Web</div></div>
      <div className="cover-stat"><div className="cover-stat-num">30+</div><div className="cover-stat-label">Komponen UI</div></div>
      <div className="cover-stat"><div className="cover-stat-num">12</div><div className="cover-stat-label">Produk Katalog</div></div>
      <div className="cover-stat"><div className="cover-stat-num">100%</div><div className="cover-stat-label">Responsif</div></div>
    </div>

    <div className="cover-meta">
      <div className="cover-meta-item"><div className="cover-meta-label">Mata Kuliah</div><div className="cover-meta-value">Praktikum E-Commerce</div></div>
      <div className="cover-meta-item"><div className="cover-meta-label">Teknologi</div><div className="cover-meta-value">React 19 · Vite · TailwindCSS · Framer Motion · Lenis</div></div>
      <div className="cover-meta-item"><div className="cover-meta-label">Design Tool</div><div className="cover-meta-value">Google Stitch AI (Design to Code)</div></div>
      <div className="cover-meta-item"><div className="cover-meta-label">Tanggal</div><div className="cover-meta-value">Oktober 2026</div></div>
    </div>
  </div>

  <div className="main-content">

    {/* Daftar Isi */}
    <div className="section avoid-break">
      <div className="toc">
        <h2>📑 Daftar Isi</h2>
        <ul className="toc-list">
          <li><div className="toc-item"><span className="toc-dot"></span>1. Latar Belakang &amp; Tujuan Proyek</div><span className="toc-page">Hlm. 2</span></li>
          <li><div className="toc-item"><span className="toc-dot"></span>2. Profil Bisnis Sky Furniture</div><span className="toc-page">Hlm. 2</span></li>
          <li><div className="toc-item"><span className="toc-dot"></span>3. Desain UI/UX — Google Stitch Design System</div><span className="toc-page">Hlm. 3</span></li>
          <li><div className="toc-item"><span className="toc-dot"></span>4. Arsitektur &amp; Teknologi</div><span className="toc-page">Hlm. 3</span></li>
          <li><div className="toc-item"><span className="toc-dot"></span>5. Struktur Halaman &amp; Fitur</div><span className="toc-page">Hlm. 4</span></li>
          <li><div className="toc-item"><span className="toc-dot"></span>6. Tampilan Desain Stitch (Screenshot)</div><span className="toc-page">Hlm. 6</span></li>
          <li><div className="toc-item"><span className="toc-dot"></span>7. Fitur Interaktif JavaScript</div><span className="toc-page">Hlm. 8</span></li>
          <li><div className="toc-item"><span className="toc-dot"></span>8. Sistem Desain &amp; Palet Warna</div><span className="toc-page">Hlm. 9</span></li>
          <li><div className="toc-item"><span className="toc-dot"></span>9. Analisis Fungsional</div><span className="toc-page">Hlm. 10</span></li>
          <li><div className="toc-item"><span className="toc-dot"></span>10. Kesimpulan &amp; Saran</div><span className="toc-page">Hlm. 11</span></li>
        </ul>
      </div>
    </div>

    <hr className="divider" />

    {/* ─── BAB 1: LATAR BELAKANG ─── */}
    <div className="section">
      <div className="section-header">
        <div className="section-number">1</div>
        <h2 className="section-title">Latar Belakang &amp; Tujuan Proyek</h2>
      </div>

      <p>Perkembangan teknologi digital dan meningkatnya penetrasi internet di Indonesia telah mendorong pertumbuhan industri e-commerce furnitur secara signifikan. Konsumen semakin beralih dari pembelian offline ke platform digital yang menawarkan kemudahan akses, visualisasi produk yang kaya, serta proses transaksi yang aman dan nyaman.</p>

      <p>Proyek ini dikembangkan sebagai implementasi praktis dari konsep <strong>UI/UX berbasis desain AI</strong>, memanfaatkan <strong>Google Stitch</strong> sebagai design system generator, yang kemudian diimplementasikan menjadi website fungsional menggunakan teknologi web modern.</p>

      <div className="highlight-box">
        <h3>🎯 Tujuan Utama Proyek</h3>
        <p>Merancang dan mengimplementasikan platform e-commerce furnitur premium "Sky Furniture" yang menampilkan pengalaman belanja modern dengan desain estetika Skandinavia — mulai dari halaman produk, katalog terfilter, hingga alur checkout yang lengkap dan interaktif.</p>
      </div>

      <div className="info-grid" style={{marginTop: '16px'}}>
        <div className="info-card">
          <div className="info-card-label">Tujuan Akademis</div>
          <div className="info-card-value">Menerapkan konsep e-commerce dalam proyek nyata menggunakan teknologi web modern</div>
        </div>
        <div className="info-card">
          <div className="info-card-label">Tujuan Teknis</div>
          <div className="info-card-value">Mengintegrasikan AI design tool (Google Stitch) ke implementasi HTML/CSS/JS</div>
        </div>
        <div className="info-card full">
          <div className="info-card-label">Ruang Lingkup</div>
          <div className="info-card-value">Website multi-halaman (Beranda, Katalog, Detail Produk, Keranjang, Checkout) dengan fitur interaktif penuh dan desain responsif mobile-first</div>
        </div>
      </div>
    </div>

    <hr className="divider" />

    {/* ─── BAB 2: PROFIL BISNIS ─── */}
    <div className="section">
      <div className="section-header">
        <div className="section-number">2</div>
        <h2 className="section-title">Profil Bisnis Sky Furniture</h2>
      </div>

      <div className="two-col">
        <div>
          <h3 className="sub-title" style={{marginTop: '0'}}>Identitas Brand</h3>
          <table>
            <tr><td><strong>Nama Brand</strong></td><td>Sky Furniture</td></tr>
            <tr><td><strong>Asal Produksi</strong></td><td>Workshop Sky Furniture, Palembang</td></tr>
            <tr><td><strong>Segmen Pasar</strong></td><td>Premium Mid-Range (Rp 700rb – Rp 8jt)</td></tr>
            <tr><td><strong>Target Konsumen</strong></td><td>Keluarga urban usia 25–45 tahun</td></tr>
            <tr><td><strong>Gaya Desain</strong></td><td>Skandinavia Modern / Arsitektural</td></tr>
            <tr><td><strong>Jangkauan</strong></td><td>Sumatera Selatan (Gratis Ongkir Palembang &amp; Banyuasin)</td></tr>
          </table>
        </div>
        <div>
          <h3 className="sub-title" style={{marginTop: '0'}}>Nilai Unggulan (USP)</h3>
          <ul className="numbered-list">
            <li><span>Rangka kayu mahoni solid 100% tahan rayap (kiln-dried MC 12%)</span></li>
            <li><span>Garansi konstruksi rangka dan pegas selama 5 tahun</span></li>
            <li><span>Layanan kustomisasi bebas: dimensi, warna, kain, dan model</span></li>
            <li><span>Armada pengiriman khusus mebel dengan tim instalasi</span></li>
            <li><span>Konsultasi desainer gratis via WhatsApp</span></li>
          </ul>
        </div>
      </div>

      <div className="callout">
        <strong>Kategori Produk Utama:</strong> Sofa L Sudut (Sectional), Sofa Retro 2&amp;3 Seater, Sofa Chesterfield Kancing, Sofa Turki Luxury Set, Sofa Bed Recliner Multifungsi, dan Aksesoris Ruang Tamu (Meja, Karpet, Bantal Premium).
      </div>
    </div>

    <hr className="divider page-break" />

    {/* ─── BAB 3: DESAIN SISTEM ─── */}
    <div className="section">
      <div className="section-header">
        <div className="section-number">3</div>
        <h2 className="section-title">Desain UI/UX — Google Stitch Design System</h2>
      </div>

      <p><strong>Google Stitch</strong> adalah platform AI-powered design-to-code yang digunakan sebagai fondasi desain proyek ini. Stitch menghasilkan design system lengkap berupa token warna, tipografi, komponen, dan kode HTML siap pakai yang konsisten secara visual.</p>

      <div className="two-col">
        <div className="info-card">
          <div className="info-card-label">Nama Proyek Stitch</div>
          <div className="info-card-value">SkyFurniture E-Commerce Platform</div>
        </div>
        <div className="info-card">
          <div className="info-card-label">Project ID</div>
          <div className="info-card-value" style={{fontFamily: 'monospace', fontSize: '9pt'}}>14584092454384093154</div>
        </div>
      </div>

      <h3 className="sub-title">Sistem Tipografi</h3>
      <table>
        <tr><th>Kategori</th><th>Font Family</th><th>Kegunaan</th></tr>
        <tr><td>Display / Headline</td><td><strong>Epilogue</strong> (400–700)</td><td>Judul halaman, nama produk, heading besar</td></tr>
        <tr><td>Body / Label</td><td><strong>Manrope</strong> (400–700)</td><td>Teks konten, label, deskripsi, tombol aksi</td></tr>
        <tr><td>Icon System</td><td><strong>Material Symbols Outlined</strong></td><td>Seluruh ikon UI (navigasi, aksi, status)</td></tr>
      </table>

      <h3 className="sub-title">Prinsip Desain</h3>
      <div className="three-col" style={{marginTop: '8px'}}>
        <div className="info-card">
          <div className="info-card-label">Visual Style</div>
          <div className="info-card-value">Biru Langit (Sky Blue) + Mahoni sebagai aksen, clean &amp; minimalis</div>
        </div>
        <div className="info-card">
          <div className="info-card-label">Prinsip Layout</div>
          <div className="info-card-value">Grid 12 kolom, max-width 1440px, mobile-first responsive</div>
        </div>
        <div className="info-card">
          <div className="info-card-label">Interaksi</div>
          <div className="info-card-value">Hover effects, micro-animations, smooth transitions 200–300ms</div>
        </div>
      </div>
    </div>

    <hr className="divider" />

    {/* ─── BAB 4: ARSITEKTUR TEKNOLOGI ─── */}
    <div className="section">
      <div className="section-header">
        <div className="section-number">4</div>
        <h2 className="section-title">Arsitektur &amp; Teknologi</h2>
      </div>

      <div className="tech-grid">
        <div className="tech-card">
          <div className="tech-icon">🌐</div>
          <div className="tech-name">HTML5 Semantik</div>
          <div className="tech-desc">Struktur konten dengan elemen &lt;header&gt;, &lt;main&gt;, &lt;section&gt;, &lt;article&gt;, &lt;aside&gt;, &lt;footer&gt;</div>
        </div>
        <div className="tech-card">
          <div className="tech-icon">🎨</div>
          <div className="tech-name">TailwindCSS v3</div>
          <div className="tech-desc">Via CDN dengan konfigurasi custom color token, borderRadius, spacing, fontSize dari Stitch design system</div>
        </div>
        <div className="tech-card">
          <div className="tech-icon">⚡</div>
          <div className="tech-name">Vanilla JavaScript</div>
          <div className="tech-desc">DOM manipulation, event handling, filter/sort, qty stepper, tab switching, animasi interaktif</div>
        </div>
        <div className="tech-card">
          <div className="tech-icon">🔤</div>
          <div className="tech-name">Google Fonts API</div>
          <div className="tech-desc">Epilogue &amp; Manrope via CDN untuk konsistensi tipografi lintas perangkat</div>
        </div>
        <div className="tech-card">
          <div className="tech-icon">🖼️</div>
          <div className="tech-name">Google Stitch CDN</div>
          <div className="tech-desc">Aset gambar produk dari hosted Stitch image delivery (AIDA public)</div>
        </div>
        <div className="tech-card">
          <div className="tech-icon">📱</div>
          <div className="tech-name">Responsive Design</div>
          <div className="tech-desc">Breakpoints sm/md/lg/xl Tailwind, hamburger mobile menu, adaptive grid layout</div>
        </div>
      </div>

      <div className="callout" style={{marginTop: '20px'}}>
        <strong>Pendekatan:</strong> Proyek ini bersifat <em>static multi-page website</em> (tanpa framework backend), setiap halaman adalah file HTML independen yang saling terhubung via tautan navigasi. Seluruh interaktivitas dihandle oleh JavaScript sisi klien.
      </div>
    </div>

    <hr className="divider page-break" />

    {/* ─── BAB 5: STRUKTUR HALAMAN ─── */}
    <div className="section">
      <div className="section-header">
        <div className="section-number">5</div>
        <h2 className="section-title">Struktur Halaman &amp; Fitur</h2>
      </div>

      <div className="feature-grid">
        {/* Halaman 1: Beranda */}
        <div className="feature-card avoid-break">
          <div className="feature-card-header">
            <div className="feature-card-icon">🏠</div>
            <div>
              <div className="feature-card-title">Beranda (index.html)</div>
              <div className="feature-card-subtitle">Halaman utama toko</div>
            </div>
          </div>
          <div className="feature-card-body">
            <ul>
              <li>Hero section dengan headline utama, statistik garansi, dan gambar produk unggulan</li>
              <li>Floating product card dengan harga dan info cepat</li>
              <li>Announcement bar promo ongkir gratis</li>
              <li>Category quick bar 5 tipe sofa</li>
              <li>Grid 8 produk terlaris dengan filter chip (Semua/Retro/Sudut/Chesterfield)</li>
              <li>Why Us section — 4 keunggulan brand</li>
              <li>CTA banner kontak WhatsApp</li>
              <li>Header sticky dengan search bar dan mobile hamburger menu</li>
            </ul>
          </div>
        </div>

        {/* Halaman 2: Katalog */}
        <div className="feature-card avoid-break">
          <div className="feature-card-header">
            <div className="feature-card-icon">🗂️</div>
            <div>
              <div className="feature-card-title">Katalog (katalog.html)</div>
              <div className="feature-card-subtitle">Daftar produk terfilter</div>
            </div>
          </div>
          <div className="feature-card-body">
            <ul>
              <li>Sidebar filter multidimensi: tipe sofa, rentang harga, bahan cover, pilihan warna, rating minimal</li>
              <li>Range slider harga interaktif</li>
              <li>Chip bahan toggle (Kanvas/Velvet/Oscar/Boucle)</li>
              <li>Grid 6 produk dengan hover card dan tombol tambah keranjang</li>
              <li>Toolbar: sort dropdown + toggle tampilan grid/list</li>
              <li>Active filter chips (bisa dihapus satu per satu)</li>
              <li>Breadcrumb navigasi hierarkis</li>
              <li>Pagination dengan navigasi halaman</li>
            </ul>
          </div>
        </div>

        {/* Halaman 3: Detail Produk */}
        <div className="feature-card avoid-break">
          <div className="feature-card-header">
            <div className="feature-card-icon">🛋️</div>
            <div>
              <div className="feature-card-title">Detail Produk (detail-produk.html)</div>
              <div className="feature-card-subtitle">Halaman produk lengkap</div>
            </div>
          </div>
          <div className="feature-card-body">
            <ul>
              <li>Galeri foto utama + 4 thumbnail interaktif (klik ganti foto)</li>
              <li>Pill badge "Simulasi Ruang AR" dan label promosi</li>
              <li>Konfigurator: pilih orientasi sudut (L-Kiri/L-Kanan)</li>
              <li>Selektor warna (5 opsi) dengan label nama warna</li>
              <li>Pilihan bahan cover (3 opsi toggle)</li>
              <li>Qty stepper (+/-) dengan validasi min 1</li>
              <li>Tombol: Tambah Keranjang, Beli Sekarang, Chat WhatsApp</li>
              <li>Trust badges: pengiriman aman, garansi 5 thn, bonus bantal</li>
              <li>Tab content: Deskripsi, Spesifikasi, Ongkir, Ulasan (180 review)</li>
              <li>Produk terkait (related items) — 4 aksesoris ruang</li>
            </ul>
          </div>
        </div>

        {/* Halaman 4: Keranjang */}
        <div className="feature-card avoid-break">
          <div className="feature-card-header">
            <div className="feature-card-icon">🛒</div>
            <div>
              <div className="feature-card-title">Keranjang (keranjang.html)</div>
              <div className="feature-card-subtitle">Cart &amp; ringkasan belanja</div>
            </div>
          </div>
          <div className="feature-card-body">
            <ul>
              <li>Progress bar checkout 3 langkah (Keranjang → Pengiriman → Bayar)</li>
              <li>3 item cart: 2 sofa + 1 meja kopi bonus gratis</li>
              <li>Qty stepper per-item dengan kalkulasi total otomatis</li>
              <li>Animasi remove item (slide out + fade)</li>
              <li>Tombol kosongkan keranjang dengan konfirmasi</li>
              <li>Promo code field (kode SKYBIRU aktif)</li>
              <li>Order summary: subtotal, ongkir gratis, diskon bundling</li>
              <li>Daftar metode pembayaran (Transfer/COD/Cicilan/GoPay/ShopeePay)</li>
              <li>Rekomendasi produk "Lengkapi Ruang" — 4 item</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Checkout full width */}
      <div className="feature-card avoid-break" style={{marginTop: '16px', borderRadius: '12px'}}>
        <div className="feature-card-header" style={{borderRadius: '12px 12px 0 0'}}>
          <div className="feature-card-icon">💳</div>
          <div>
            <div className="feature-card-title">Checkout (checkout.html) — Halaman Terlengkap</div>
            <div className="feature-card-subtitle">Formulir konfirmasi pesanan &amp; pembayaran</div>
          </div>
        </div>
        <div className="feature-card-body">
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
            <ul>
              <li>Formulir informasi penerima (nama, WhatsApp, email)</li>
              <li>Formulir alamat lengkap (provinsi, kota, kecamatan, kode pos, catatan)</li>
              <li>Pilihan layanan pengiriman: Sky Direct (gratis), Sky Express, Kargo Nasional</li>
              <li>Tab metode pembayaran: Transfer Bank VA (BCA/Mandiri/BNI), E-Wallet (GoPay/ShopeePay/OVO)</li>
            </ul>
            <ul>
              <li>Opsi COD (Bayar di Tempat) dengan syarat dan ketentuan</li>
              <li>Cicilan 0% (3x/6x/12x) dengan input kartu kredit &amp; format otomatis</li>
              <li>Order summary sticky sidebar — daftar item + breakdown harga</li>
              <li>Pesan khusus untuk tim workshop</li>
              <li>Success overlay modal setelah klik "Konfirmasi Bayar" dengan ID pesanan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <hr className="divider page-break" />

    {/* ─── BAB 6: SCREENSHOT STITCH ─── */}
    <div className="section">
      <div className="section-header">
        <div className="section-number">6</div>
        <h2 className="section-title">Tampilan Desain Stitch (Screenshot Referensi)</h2>
      </div>
      <p>Berikut adalah tangkapan layar desain UI dari Google Stitch yang menjadi referensi utama implementasi website Sky Furniture. Setiap screen didesain dengan konsistensi visual yang ketat menggunakan design token yang sama.</p>

      {/* Screen 1 */}
      <div className="screen-section avoid-break">
        <div className="screen-label">
          <span className="screen-badge">Screen 01</span>
          <span className="screen-name">Beranda — Tema Biru Langit</span>
        </div>
        <img className="screen-img" src="D:\Praktikum E-Commerce\Sky Furniture\stitch_skyfurniture_e_commerce_platform\stitch_skyfurniture_e_commerce_platform\sky_furniture_beranda_tema_biru_langit\screen.png" alt="Stitch Design - Beranda Sky Furniture" />
        <div className="screen-desc">Halaman utama menampilkan hero section bertema biru langit dengan headline kuat, navigasi header sticky, grid produk terlaris, dan CTA utama. Desain menonjolkan estetika arsitektural Skandinavia dengan palet biru-putih-mahoni.</div>
        <div className="screen-features">
          <span className="screen-tag">Hero Section</span>
          <span className="screen-tag">Navigation Header</span>
          <span className="screen-tag">Product Grid</span>
          <span className="screen-tag">CTA Button</span>
          <span className="screen-tag">Category Bar</span>
        </div>
      </div>

      {/* Screen 2 */}
      <div className="screen-section avoid-break">
        <div className="screen-label">
          <span className="screen-badge">Screen 02</span>
          <span className="screen-name">Katalog &amp; Filter Produk</span>
        </div>
        <img className="screen-img" src="D:\Praktikum E-Commerce\Sky Furniture\stitch_skyfurniture_e_commerce_platform\stitch_skyfurniture_e_commerce_platform\sky_furniture_katalog_filter_produk\screen.png" alt="Stitch Design - Katalog Filter" />
        <div className="screen-desc">Halaman katalog dengan sidebar filter multidimensi di sisi kiri dan grid produk di kanan. Pengguna dapat memfilter berdasarkan tipe sofa, harga, bahan, warna, dan rating. Setiap produk card menampilkan foto, nama, harga, dan tombol aksi.</div>
        <div className="screen-features">
          <span className="screen-tag">Sidebar Filter</span>
          <span className="screen-tag">Price Range Slider</span>
          <span className="screen-tag">Color Swatch</span>
          <span className="screen-tag">Product Card Grid</span>
          <span className="screen-tag">Sort Toolbar</span>
          <span className="screen-tag">Pagination</span>
        </div>
      </div>

      <div className="page-break"></div>

      {/* Screen 3 */}
      <div className="screen-section avoid-break">
        <div className="screen-label">
          <span className="screen-badge">Screen 03</span>
          <span className="screen-name">Detail Produk &amp; Kustomisasi</span>
        </div>
        <img className="screen-img" src="D:\Praktikum E-Commerce\Sky Furniture\stitch_skyfurniture_e_commerce_platform\stitch_skyfurniture_e_commerce_platform\sky_furniture_detail_produk_kustomisasi\screen.png" alt="Stitch Design - Detail Produk" />
        <div className="screen-desc">Halaman detail produk dengan layout dua kolom: galeri foto di kiri dan panel konfigurasi di kanan. Pembeli dapat memilih orientasi sofa, warna kain, jenis bahan, dan jumlah. Dilengkapi tab konten untuk deskripsi, spesifikasi teknis, ongkir, dan ulasan pelanggan.</div>
        <div className="screen-features">
          <span className="screen-tag">Photo Gallery</span>
          <span className="screen-tag">Orientation Picker</span>
          <span className="screen-tag">Color Configurator</span>
          <span className="screen-tag">Material Selector</span>
          <span className="screen-tag">Qty Stepper</span>
          <span className="screen-tag">Review Tabs</span>
          <span className="screen-tag">Related Products</span>
        </div>
      </div>

      {/* Screen 4 */}
      <div className="screen-section avoid-break">
        <div className="screen-label">
          <span className="screen-badge">Screen 04</span>
          <span className="screen-name">Keranjang &amp; Checkout — Bagian 1</span>
        </div>
        <img className="screen-img" src="D:\Praktikum E-Commerce\Sky Furniture\stitch_skyfurniture_e_commerce_platform\stitch_skyfurniture_e_commerce_platform\sky_furniture_keranjang_checkout_1\screen.png" alt="Stitch Design - Keranjang" />
        <div className="screen-desc">Halaman keranjang menampilkan daftar item yang dipilih, opsi kustomisasi per item, summary harga, dan field kode promo. Terdapat progress bar checkout 3 tahap yang mengarahkan pengguna melalui alur belanja secara intuitif.</div>
        <div className="screen-features">
          <span className="screen-tag">Cart Item List</span>
          <span className="screen-tag">Qty Stepper</span>
          <span className="screen-tag">Remove Item</span>
          <span className="screen-tag">Promo Code</span>
          <span className="screen-tag">Order Summary</span>
          <span className="screen-tag">Progress Steps</span>
        </div>
      </div>

      {/* Screen 5 */}
      <div className="screen-section avoid-break">
        <div className="screen-label">
          <span className="screen-badge">Screen 05</span>
          <span className="screen-name">Keranjang &amp; Checkout — Bagian 2 (Pembayaran)</span>
        </div>
        <img className="screen-img" src="D:\Praktikum E-Commerce\Sky Furniture\stitch_skyfurniture_e_commerce_platform\stitch_skyfurniture_e_commerce_platform\sky_furniture_keranjang_checkout_2\screen.png" alt="Stitch Design - Checkout" />
        <div className="screen-desc">Halaman checkout lengkap dengan formulir pengiriman dan pilihan metode pembayaran. Di sisi kanan terdapat ringkasan pesanan sticky. Berbagai opsi pembayaran disediakan: Virtual Account bank, e-wallet, COD, dan cicilan 0% kartu kredit.</div>
        <div className="screen-features">
          <span className="screen-tag">Shipping Form</span>
          <span className="screen-tag">Delivery Options</span>
          <span className="screen-tag">Payment Tabs</span>
          <span className="screen-tag">Bank Transfer</span>
          <span className="screen-tag">E-Wallet</span>
          <span className="screen-tag">Installment</span>
          <span className="screen-tag">Success Modal</span>
        </div>
      </div>
    </div>

    <hr className="divider page-break" />

    {/* ─── BAB 7: FITUR JAVASCRIPT ─── */}
    <div className="section">
      <div className="section-header">
        <div className="section-number">7</div>
        <h2 className="section-title">Fitur Interaktif JavaScript</h2>
      </div>

      <p>Seluruh interaktivitas website diimplementasikan menggunakan <strong>Vanilla JavaScript</strong> murni tanpa library tambahan, memastikan performa ringan dan kompatibilitas luas.</p>

      <table>
        <thead>
          <tr><th>Fitur</th><th>Halaman</th><th>Deskripsi Implementasi</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Product Filter</strong></td><td>Beranda, Katalog</td><td>Filter chip onclick mengubah display:none/block kartu produk berdasarkan data-category attribute</td></tr>
          <tr><td><strong>Mobile Menu Toggle</strong></td><td>Semua Halaman</td><td>classList.toggle('hidden') pada nav mobile, hamburger icon toggle</td></tr>
          <tr><td><strong>Photo Gallery Switcher</strong></td><td>Detail Produk</td><td>Array gambar URL, klik thumbnail mengganti src img utama + active state border</td></tr>
          <tr><td><strong>Color Configurator</strong></td><td>Detail Produk</td><td>Klik swatch warna update nama warna ditampilkan, toggle ring active state</td></tr>
          <tr><td><strong>Material Selector</strong></td><td>Detail Produk</td><td>Button toggle className antara selected/unselected state untuk bahan cover</td></tr>
          <tr><td><strong>Orientation Picker</strong></td><td>Detail Produk</td><td>Radio-style button untuk pilih L-Kiri/L-Kanan dengan visual highlight</td></tr>
          <tr><td><strong>Quantity Stepper</strong></td><td>Detail Produk, Keranjang</td><td>Fungsi changeQty/changeItemQty dengan Math.max(1,...) untuk minimum 1</td></tr>
          <tr><td><strong>Cart Management</strong></td><td>Keranjang</td><td>removeItem() dengan animasi CSS class 'removing' (opacity+translate), updateTotal() kalkulasi otomatis</td></tr>
          <tr><td><strong>Promo Code</strong></td><td>Keranjang</td><td>Validasi kode 'SKYBIRU', response pesan sukses/error dengan warna berbeda</td></tr>
          <tr><td><strong>Payment Tab Switch</strong></td><td>Checkout</td><td>switchPayTab() menampilkan/sembunyi konten, update style tombol aktif</td></tr>
          <tr><td><strong>Cicilan Calculator</strong></td><td>Checkout</td><td>Pilihan 3x/6x/12x dengan update visual selected cicilan</td></tr>
          <tr><td><strong>Card Number Format</strong></td><td>Checkout</td><td>Format otomatis nomor kartu kredit dengan spasi setiap 4 digit</td></tr>
          <tr><td><strong>Success Modal</strong></td><td>Checkout</td><td>Overlay fixed full-screen dengan animasi fade-in, klik luar untuk tutup</td></tr>
          <tr><td><strong>Sort Products</strong></td><td>Katalog</td><td>Dropdown sort tersedia dengan struktur siap expand</td></tr>
          <tr><td><strong>Grid/List View</strong></td><td>Katalog</td><td>Toggle class grid dari 3-kolom ke 1-kolom dengan update state tombol</td></tr>
        </tbody>
      </table>
    </div>

    <hr className="divider page-break" />

    {/* ─── BAB 8: DESIGN SYSTEM ─── */}
    <div className="section">
      <div className="section-header">
        <div className="section-number">8</div>
        <h2 className="section-title">Sistem Desain &amp; Palet Warna</h2>
      </div>

      <p>Design system Sky Furniture menggunakan token warna berbasis Material Design 3 dengan kustomisasi tema "Biru Langit" (Sky Blue) sebagai warna utama dan "Sandstone Mahoni" sebagai aksen sekunder.</p>

      <h3 className="sub-title">Palet Warna Utama</h3>
      <div className="palette-grid">
        <div className="color-swatch">
          <div className="swatch-color" style={{background: '#00507d'}}></div>
          <div className="swatch-info"><div className="swatch-name">Primary</div><div className="swatch-hex">#00507d</div></div>
        </div>
        <div className="color-swatch">
          <div className="swatch-color" style={{background: '#0369a1'}}></div>
          <div className="swatch-info"><div className="swatch-name">Primary Container</div><div className="swatch-hex">#0369a1</div></div>
        </div>
        <div className="color-swatch">
          <div className="swatch-color" style={{background: '#84531a'}}></div>
          <div className="swatch-info"><div className="swatch-name">Secondary</div><div className="swatch-hex">#84531a</div></div>
        </div>
        <div className="color-swatch">
          <div className="swatch-color" style={{background: '#febc79'}}></div>
          <div className="swatch-info"><div className="swatch-name">Secondary Container</div><div className="swatch-hex">#febc79</div></div>
        </div>
        <div className="color-swatch">
          <div className="swatch-color" style={{background: '#005271'}}></div>
          <div className="swatch-info"><div className="swatch-name">Tertiary</div><div className="swatch-hex">#005271</div></div>
        </div>
        <div className="color-swatch">
          <div className="swatch-color" style={{background: '#f8f9ff', border: '1px solid #c0c7d1'}}></div>
          <div className="swatch-info"><div className="swatch-name">Background</div><div className="swatch-hex">#f8f9ff</div></div>
        </div>
        <div className="color-swatch">
          <div className="swatch-color" style={{background: '#e5eeff'}}></div>
          <div className="swatch-info"><div className="swatch-name">Surface Container</div><div className="swatch-hex">#e5eeff</div></div>
        </div>
        <div className="color-swatch">
          <div className="swatch-color" style={{background: '#213145'}}></div>
          <div className="swatch-info"><div className="swatch-name">Inverse Surface</div><div className="swatch-hex">#213145</div></div>
        </div>
        <div className="color-swatch">
          <div className="swatch-color" style={{background: '#0b1c30'}}></div>
          <div className="swatch-info"><div className="swatch-name">On Background</div><div className="swatch-hex">#0b1c30</div></div>
        </div>
        <div className="color-swatch">
          <div className="swatch-color" style={{background: '#94ccff'}}></div>
          <div className="swatch-info"><div className="swatch-name">Primary Fixed Dim</div><div className="swatch-hex">#94ccff</div></div>
        </div>
      </div>

      <h3 className="sub-title">Token Radius &amp; Spacing</h3>
      <table>
        <tr><th>Token</th><th>Nilai</th><th>Penggunaan</th></tr>
        <tr><td>Border Radius Default</td><td>2px (0.125rem)</td><td>Elemen kecil (tag, badge)</td></tr>
        <tr><td>Border Radius lg</td><td>4px (0.25rem)</td><td>Input, dropdown</td></tr>
        <tr><td>Border Radius xl</td><td>8px (0.5rem)</td><td>Card, tombol, section</td></tr>
        <tr><td>Border Radius full</td><td>12px (0.75rem)</td><td>Pill, chip, avatar</td></tr>
        <tr><td>Max Width Layout</td><td>1440px</td><td>Semua konten halaman</td></tr>
        <tr><td>Padding Horizontal Desktop</td><td>56px (3.5rem)</td><td>Margin sisi kiri-kanan halaman</td></tr>
        <tr><td>Padding Horizontal Mobile</td><td>24px (1.5rem)</td><td>Margin sisi kiri-kanan mobile</td></tr>
      </table>
    </div>

    <hr className="divider page-break" />

    {/* ─── BAB 9: ANALISIS FUNGSIONAL ─── */}
    <div className="section">
      <div className="section-header">
        <div className="section-number">9</div>
        <h2 className="section-title">Analisis Fungsional</h2>
      </div>

      <h3 className="sub-title" style={{marginTop: '0'}}>Alur Pengguna (User Flow)</h3>
      <table>
        <thead>
          <tr><th>Langkah</th><th>Halaman</th><th>Aksi Pengguna</th><th>Respons Sistem</th></tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>Beranda</td><td>Membuka website, melihat hero &amp; produk unggulan</td><td>Menampilkan produk terlaris, kategori, dan promo</td></tr>
          <tr><td>2</td><td>Beranda / Katalog</td><td>Klik filter chip atau "Lihat Katalog"</td><td>Filter produk atau navigasi ke katalog.html</td></tr>
          <tr><td>3</td><td>Katalog</td><td>Atur filter sidebar (harga, tipe, warna)</td><td>Menampilkan produk sesuai kriteria</td></tr>
          <tr><td>4</td><td>Katalog</td><td>Klik "Detail" pada kartu produk</td><td>Navigasi ke detail-produk.html</td></tr>
          <tr><td>5</td><td>Detail Produk</td><td>Pilih warna, bahan, orientasi, qty</td><td>Update visual konfigurator secara real-time</td></tr>
          <tr><td>6</td><td>Detail Produk</td><td>Klik "Tambah ke Keranjang"</td><td>Navigasi ke keranjang.html</td></tr>
          <tr><td>7</td><td>Keranjang</td><td>Tinjau item, masukkan kode promo</td><td>Update total harga otomatis</td></tr>
          <tr><td>8</td><td>Keranjang</td><td>Klik "Lanjut ke Checkout"</td><td>Navigasi ke checkout.html</td></tr>
          <tr><td>9</td><td>Checkout</td><td>Isi data penerima, alamat, metode bayar</td><td>Form validasi, pilihan berubah secara interaktif</td></tr>
          <tr><td>10</td><td>Checkout</td><td>Klik "Konfirmasi &amp; Bayar Sekarang"</td><td>Tampilkan success modal dengan ID pesanan</td></tr>
        </tbody>
      </table>

      <h3 className="sub-title">Matriks Fitur per Halaman</h3>
      <table>
        <thead>
          <tr><th>Fitur</th><th>Beranda</th><th>Katalog</th><th>Detail</th><th>Keranjang</th><th>Checkout</th></tr>
        </thead>
        <tbody>
          <tr><td>Header Sticky + Mobile Menu</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>✅</td></tr>
          <tr><td>Search Bar</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>—</td></tr>
          <tr><td>Product Filter</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>—</td></tr>
          <tr><td>Qty Stepper</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>—</td></tr>
          <tr><td>Color / Material Config</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>—</td></tr>
          <tr><td>Tab Content</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>✅</td></tr>
          <tr><td>Order Summary</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>✅</td></tr>
          <tr><td>Promo Code</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>—</td></tr>
          <tr><td>Breadcrumb</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>—</td></tr>
          <tr><td>Progress Steps</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>✅</td></tr>
          <tr><td>WhatsApp CTA</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>—</td></tr>
          <tr><td>Success Modal</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>—</td><td style={{textAlign: 'center'}}>✅</td></tr>
          <tr><td>Footer Navigasi</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>✅</td><td style={{textAlign: 'center'}}>✅</td></tr>
        </tbody>
      </table>
    </div>

    <hr className="divider page-break" />

    {/* ─── BAB 10: KESIMPULAN ─── */}
    <div className="section">
      <div className="section-header">
        <div className="section-number">10</div>
        <h2 className="section-title">Kesimpulan &amp; Saran Pengembangan</h2>
      </div>

      <h3 className="sub-title" style={{marginTop: '0'}}>Kesimpulan</h3>
      <p>Proyek Sky Furniture E-Commerce Platform berhasil mengimplementasikan konsep desain UI/UX dari Google Stitch ke dalam website e-commerce yang fungsional dan estetis. Beberapa pencapaian utama proyek ini:</p>

      <ol className="numbered-list" style={{margin: '12px 0'}}>
        <li><span><strong>Integrasi AI Design System:</strong> Penggunaan Google Stitch berhasil mempercepat proses desain dan memastikan konsistensi visual di seluruh halaman melalui token warna, tipografi, dan komponen yang terdefinisi.</span></li>
        <li><span><strong>Pengalaman Belanja Lengkap:</strong> Website mencakup seluruh alur belanja dari discovery produk (beranda), eksplorasi (katalog), evaluasi (detail), pemilihan (keranjang), hingga transaksi (checkout).</span></li>
        <li><span><strong>Interaktivitas Kaya:</strong> 15+ fitur JavaScript interaktif diimplementasikan tanpa library eksternal, membuktikan kemampuan Vanilla JS dalam menangani kebutuhan UX e-commerce modern.</span></li>
        <li><span><strong>Responsif Mobile-First:</strong> Desain beradaptasi dengan baik di berbagai ukuran layar, dengan hamburger menu, grid adaptive, dan padding yang disesuaikan.</span></li>
        <li><span><strong>Branding Kohesif:</strong> Identitas visual "Biru Langit" konsisten dari warna, ikon (Material Symbols), hingga tone of voice yang premium namun accessible.</span></li>
      </ol>

      <h3 className="sub-title">Saran Pengembangan Lanjutan</h3>
      <div className="info-grid">
        <div className="info-card">
          <div className="info-card-label">📡 Backend Integration</div>
          <div className="info-card-value">Integrasikan dengan Node.js/PHP backend, REST API, dan database MySQL/PostgreSQL untuk manajemen produk dan pesanan yang nyata</div>
        </div>
        <div className="info-card">
          <div className="info-card-label">💳 Payment Gateway</div>
          <div className="info-card-value">Integrasi Midtrans atau Xendit untuk memproses pembayaran nyata (VA, e-wallet, QRIS) dengan webhook konfirmasi</div>
        </div>
        <div className="info-card">
          <div className="info-card-label">🔐 Autentikasi</div>
          <div className="info-card-value">Sistem login/register pelanggan dengan JWT token, halaman akun, histori pesanan, dan wishlist tersimpan</div>
        </div>
        <div className="info-card">
          <div className="info-card-label">🔍 Search Engine</div>
          <div className="info-card-value">Full-text search dengan filter dinamis dari database, autocomplete, dan hasil pencarian berdasarkan relevansi</div>
        </div>
        <div className="info-card">
          <div className="info-card-label">📦 Manajemen Produk</div>
          <div className="info-card-value">Panel admin untuk CRUD produk, upload gambar, manajemen stok, dan pemrosesan pesanan masuk</div>
        </div>
        <div className="info-card">
          <div className="info-card-label">📱 Progressive Web App</div>
          <div className="info-card-value">Konversi ke PWA dengan Service Worker untuk caching offline, push notification, dan ikon home screen</div>
        </div>
      </div>

      <div className="highlight-box" style={{marginTop: '24px'}}>
        <h3>✅ Hasil Akhir Proyek</h3>
        <p>Website Sky Furniture E-Commerce Platform berhasil dibangun sebagai prototipe fungsional yang mencerminkan standar desain e-commerce profesional modern. Dengan 5 halaman lengkap, 15+ fitur interaktif, dan design system konsisten dari Google Stitch, proyek ini membuktikan sinergi antara AI design tools dan implementasi web development konvensional.</p>
      </div>
    </div>

    {/* ─── TANDA TANGAN ─── */}
    <hr className="divider" />
    <div className="section">
      <h3 className="sub-title" style={{marginTop: '0', color: 'var(--on-surface)'}}>Lembar Persetujuan</h3>
      <p>Laporan ini disusun sebagai dokumentasi akhir Proyek Praktikum E-Commerce dengan judul <strong>"Sky Furniture E-Commerce Platform"</strong>.</p>

      <div className="sign-block">
        <div className="sign-item">
          <div className="sign-label">Disusun oleh Mahasiswa</div>
          <div className="sign-line"></div>
          <div className="sign-name">__________________________</div>
          <div className="sign-role">Nama Mahasiswa / NIM</div>
        </div>
        <div className="sign-item">
          <div className="sign-label">Disetujui oleh Dosen Pengampu</div>
          <div className="sign-line"></div>
          <div className="sign-name">__________________________</div>
          <div className="sign-role">Dosen Praktikum E-Commerce</div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="report-footer">
      <div>
        <span className="logo-text">Sky Furniture</span> — Laporan Proyek Praktikum E-Commerce
      </div>
      <div>Oktober 2026 · Dokumen Rahasia Akademis</div>
    </div>

  </div>{/* end main-content */}
</div>{/* end page-wrapper */}


    </div>
  );
}
