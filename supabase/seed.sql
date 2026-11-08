-- =====================================================================
-- SKY FURNITURE - Data awal (seed)
-- Dibuat otomatis oleh scripts/generate-seed.mjs dari src/data/*.
-- Jalankan SETELAH supabase/schema.sql. Aman dijalankan ulang
-- (baris yang sudah ada tidak ditimpa).
-- =====================================================================

-- ------------------------------------------------------------------
-- Warna
-- ------------------------------------------------------------------
insert into public.colors (key, name, hex, sort_order) values
  ('azure', 'Biru Langit Azure', '#38bdf8', 0),
  ('misty', 'Abu Misty', '#94a3b8', 1),
  ('mocca', 'Mocca Latte', '#b59a80', 2),
  ('white', 'Broken White', '#f1f5f9', 3),
  ('emerald', 'Emerald Dark', '#064e3b', 4),
  ('horizon', 'Biru Horizon', '#0369a1', 5),
  ('navy', 'Navy Malam', '#213145', 6),
  ('amber', 'Amber Madu', '#febc79', 7),
  ('charcoal', 'Arang Charcoal', '#40474f', 8),
  ('walnut', 'Walnut Klasik', '#84531a', 9),
  ('oak', 'Natural Oak', '#c8a572', 10),
  ('maroon', 'Merah Maroon', '#8b1e2d', 11)
on conflict (key) do nothing;

-- ------------------------------------------------------------------
-- Bahan cover
-- ------------------------------------------------------------------
insert into public.materials (name, price, description, sort_order) values
  ('Kanvas Linen', 0, 'Adem & tahan serat', 0),
  ('Velvet Mewah', 150000, 'Lembut, kilau halus', 1),
  ('Beludru', 200000, 'Tebal & hangat', 2),
  ('Boucle', 250000, 'Tekstur wol modern', 3),
  ('Oscar Kulit', 400000, 'Kulit sintetis premium', 4)
on conflict (name) do nothing;

-- ------------------------------------------------------------------
-- Kategori katalog
-- ------------------------------------------------------------------
insert into public.categories (id, name, icon, blurb, sort_order) values
  ('sudut', 'Sofa L Sudut', 'weekend', 'Keluarga & santai', 0),
  ('retro', 'Sofa Retro', 'chair_alt', '2 & 3 seater klasik', 1),
  ('chester', 'Chesterfield', 'auto_awesome', 'Kancing tufted', 2),
  ('turki', 'Sofa Turki', 'king_bed', 'Luxury set ukir', 3),
  ('bed', 'Sofa Bed', 'single_bed', '2-in-1 multifungsi', 4),
  ('set', 'Sofa Set Minimalis', 'living', 'Paket sofa + meja + puff', 5),
  ('aksesoris', 'Aksesoris Ruang', 'table_restaurant', 'Meja, karpet, bantal', 6)
on conflict (id) do nothing;

-- ------------------------------------------------------------------
-- Produk
-- ------------------------------------------------------------------
insert into public.products (id, slug, name, category_id, subtitle, description, about, image, gallery, badge_text, badge_style, rating, review_count, sold_count, original_price, price, colors, materials, material, footprint_p, footprint_l, footprint_t, frame, cushion, stock_label, stock_qty, lead_time, has_orientation, seats, featured, is_active, specs, sort_order, created_at) values
  (9, 'sofa-l-sudut-minimalis-modern-sky', 'Sofa L Sudut Minimalis Modern Sky', 'sudut', 'Sofa L Sudut Series', 'Sectional minimalis, bantalan ganda standar hotel resor', 'Hadirkan ketenangan atmosfer horizon ke dalam ruang tamu keluarga Anda dengan Sofa L Sudut Minimalis Modern Sky. Dibuat dengan presisi arsitektural kontemporer, sofa sectional ini mengombinasikan siluet garis bersih khas Skandinavia dengan kenyamanan bantalan ganda berstandar hotel resor.', '/produk/sofa-l-sudut-minimalis-modern-sky-1.jpg', array['/produk/sofa-l-sudut-minimalis-modern-sky-1.jpg', '/produk/sofa-l-sudut-minimalis-modern-sky-2.jpg']::text[], 'Best Seller No. 1', 'primary', 5, 210, 420, 3200000, 2785000, array['azure', 'misty', 'mocca', 'white', 'emerald', 'horizon']::text[], array['Kanvas Linen', 'Velvet Mewah', 'Beludru', 'Boucle', 'Oscar Kulit']::text[], 'Kanvas Linen', 210, 160, 85, 'Kayu Mahoni Solid Oven Anti Rayap', 'Busa Rebounded D24 + High-Density Foam D30', 'Ready Rangka (Jahit 3 Hari)', 7, 'Jahit 3 hari', true, 5, true, true, '[{"label":"Konstruksi Rangka","value":"Kayu Mahoni Solid (Oven Kiln-Dried MC 12%) anti rayap dan bubuk"},{"label":"Struktur Pegas","value":"Per Baja Zig-zag (S-Spring) elastis tinggi dipadu webbing elastis 7cm"},{"label":"Kepadatan Busa","value":"Lapisan Dasar Busa Rebounded D24 + Top Layer High-Density Foam D30"},{"label":"Kaki Sofa","value":"Kayu Jati Solid finishing Walnut Natural dengan alas felt anti gores lantai"},{"label":"Garansi Konstruksi","value":"5 Tahun Garansi Rangka Kayu & Pegas Patah dari Workshop Sky Furniture"}]'::jsonb, 0, now() - interval '8 days'),
  (1, 'sofa-retro-3-seater', 'Sofa Retro 3 Seater', 'retro', 'Sofa Retro Series', 'Busa Royal D24, Mahoni Oven 190x80cm', 'Sofa Retro 3 Seater dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. Busa Royal D24, Mahoni Oven 190x80cm. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.', '/produk/sofa-retro-3-seater.jpg', '{}'::text[], 'Best Seller', 'primary', 4.9, 189, 416, 2450000, 1895000, array['horizon', 'misty', 'mocca', 'navy', 'emerald', 'amber']::text[], array['Kanvas Linen', 'Velvet Mewah', 'Beludru', 'Boucle', 'Oscar Kulit']::text[], 'Kanvas Linen', 190, 80, 85, 'Kayu Mahoni Oven 190×80cm, sambungan dowel & lem PVAc', 'Busa Royal D24', null, 12, 'Jahit 3 hari', false, 3, true, true, '[{"label":"Konstruksi Rangka","value":"Kayu Mahoni Oven 190×80cm, sambungan dowel & lem PVAc"},{"label":"Kepadatan Busa","value":"Busa Royal D24"},{"label":"Dimensi","value":"P 190cm × L 80cm × T 85cm"},{"label":"Pilihan Bahan Cover","value":"Kanvas Linen, Velvet Mewah, Beludru, Boucle, Oscar Kulit"},{"label":"Garansi","value":"5 Tahun garansi rangka kayu & pegas patah dari workshop Sky Furniture"}]'::jsonb, 1, now() - interval '30 days'),
  (2, 'sofa-l-jumbo', 'Sofa L Jumbo', 'sudut', 'Sectional Family', 'Kapasitas 6 Orang, Kain Beludru Impor', 'Sofa L Jumbo dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. Kapasitas 6 Orang, Kain Beludru Impor. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.', '/produk/sofa-l-jumbo.jpg', '{}'::text[], 'Diskon 25%', 'secondary', 4.9, 245, 539, 4250000, 3415000, array['horizon', 'charcoal', 'amber', 'emerald', 'misty']::text[], array['Kanvas Linen', 'Velvet Mewah', 'Beludru', 'Boucle', 'Oscar Kulit']::text[], 'Beludru', 300, 190, 85, 'Kayu Mahoni Solid dengan penguat besi hollow di sudut', 'Busa Rebounded D24 + Dacron Silicon', null, 4, 'Jahit 3 hari', true, 6, true, true, '[{"label":"Konstruksi Rangka","value":"Kayu Mahoni Solid dengan penguat besi hollow di sudut"},{"label":"Kepadatan Busa","value":"Busa Rebounded D24 + Dacron Silicon"},{"label":"Dimensi","value":"P 300cm × L 190cm × T 85cm"},{"label":"Pilihan Bahan Cover","value":"Kanvas Linen, Velvet Mewah, Beludru, Boucle, Oscar Kulit"},{"label":"Garansi","value":"5 Tahun garansi rangka kayu & pegas patah dari workshop Sky Furniture"}]'::jsonb, 2, now() - interval '14 days'),
  (3, 'sofa-l-beranak', 'Sofa L Beranak', 'sudut', 'Smart Living', 'Disertai 2 Puff Simpanan Praktis', 'Sofa L Beranak dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. Disertai 2 Puff Simpanan Praktis. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.', '/produk/sofa-l-beranak.jpg', '{}'::text[], 'Multifungsi', 'tertiary', 4.9, 132, 290, 4500000, 3565000, array['azure', 'charcoal', 'white', 'mocca']::text[], array['Kanvas Linen', 'Velvet Mewah', 'Beludru', 'Boucle', 'Oscar Kulit']::text[], 'Kanvas Linen', 270, 170, 85, 'Kayu Mahoni Solid, puff dengan ruang simpan bawah', 'Busa Royal D24 + Dacron Silicon', null, 12, 'Jahit 3 hari', true, 5, true, true, '[{"label":"Konstruksi Rangka","value":"Kayu Mahoni Solid, puff dengan ruang simpan bawah"},{"label":"Kepadatan Busa","value":"Busa Royal D24 + Dacron Silicon"},{"label":"Dimensi","value":"P 270cm × L 170cm × T 85cm"},{"label":"Pilihan Bahan Cover","value":"Kanvas Linen, Velvet Mewah, Beludru, Boucle, Oscar Kulit"},{"label":"Garansi","value":"5 Tahun garansi rangka kayu & pegas patah dari workshop Sky Furniture"}]'::jsonb, 3, now() - interval '21 days'),
  (4, 'sofa-turki-321-luxury', 'Sofa Turki 321 Luxury', 'turki', 'Classic Royalty', 'Set Formasi Lengkap Meja Kaca Tempered', 'Sofa Turki 321 Luxury dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. Set Formasi Lengkap Meja Kaca Tempered. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.', '/produk/sofa-turki-321-luxury-1.jpg', array['/produk/sofa-turki-321-luxury-1.jpg', '/produk/sofa-turki-321-luxury-2.jpg']::text[], 'Sultan Suite', 'amber', 5, 98, 216, 7800000, 6375000, array['horizon', 'amber', 'white', 'emerald']::text[], array['Kanvas Linen', 'Velvet Mewah', 'Beludru', 'Boucle', 'Oscar Kulit']::text[], 'Kanvas Linen', 320, 95, 95, 'Kayu Mahoni ukir Jepara, finishing melamic doff', 'Busa Royal D28 + Dacron Silicon', null, 0, 'Pre-Order 14 hari', false, 6, true, true, '[{"label":"Konstruksi Rangka","value":"Kayu Mahoni ukir Jepara, finishing melamic doff"},{"label":"Kepadatan Busa","value":"Busa Royal D28 + Dacron Silicon"},{"label":"Dimensi","value":"P 320cm × L 95cm × T 95cm"},{"label":"Pilihan Bahan Cover","value":"Kanvas Linen, Velvet Mewah, Beludru, Boucle, Oscar Kulit"},{"label":"Garansi","value":"5 Tahun garansi rangka kayu & pegas patah dari workshop Sky Furniture"}]'::jsonb, 4, now() - interval '45 days'),
  (5, 'sofa-l-kancing-meja', 'Sofa L Kancing Meja', 'chester', 'Tufted Chesterfield', 'Free Bantal Dacron Silicon 5 Pcs', 'Sofa L Kancing Meja dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. Free Bantal Dacron Silicon 5 Pcs. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.', '/produk/sofa-l-kancing-meja-1.jpg', array['/produk/sofa-l-kancing-meja-1.jpg', '/produk/sofa-l-kancing-meja-2.jpg', '/produk/sofa-l-kancing-meja-3.jpg', '/produk/sofa-l-kancing-meja-4.webp']::text[], 'Paket Hemat Meja', 'soft', 4.9, 310, 682, 3350000, 2735000, array['horizon', 'misty', 'walnut', 'navy']::text[], array['Kanvas Linen', 'Velvet Mewah', 'Beludru', 'Boucle', 'Oscar Kulit']::text[], 'Kanvas Linen', 260, 160, 75, 'Kayu Mahoni solid, kancing tufted dijahit tangan', 'Busa Royal D24 + Dacron Silicon', null, 12, 'Jahit 3 hari', true, 5, true, true, '[{"label":"Konstruksi Rangka","value":"Kayu Mahoni solid, kancing tufted dijahit tangan"},{"label":"Kepadatan Busa","value":"Busa Royal D24 + Dacron Silicon"},{"label":"Dimensi","value":"P 260cm × L 160cm × T 75cm"},{"label":"Pilihan Bahan Cover","value":"Kanvas Linen, Velvet Mewah, Beludru, Boucle, Oscar Kulit"},{"label":"Garansi","value":"5 Tahun garansi rangka kayu & pegas patah dari workshop Sky Furniture"}]'::jsonb, 5, now() - interval '19 days'),
  (6, 'sofa-retro-2-seater', 'Sofa Retro 2 Seater', 'retro', 'Apartment Friendly', 'Ukuran Ringkas 140x78cm Cocok Ruang Mini', 'Sofa Retro 2 Seater dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. Ukuran Ringkas 140x78cm Cocok Ruang Mini. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.', '/produk/sofa-retro-2-seater.jpg', '{}'::text[], null, 'primary', 4.8, 85, 187, 1950000, 1490000, array['azure', 'white', 'navy', 'mocca']::text[], array['Kanvas Linen', 'Velvet Mewah', 'Beludru', 'Boucle', 'Oscar Kulit']::text[], 'Kanvas Linen', 140, 78, 85, 'Kayu Mahoni Oven 140×78cm', 'Busa Royal D24', null, 15, 'Jahit 3 hari', false, 2, true, true, '[{"label":"Konstruksi Rangka","value":"Kayu Mahoni Oven 140×78cm"},{"label":"Kepadatan Busa","value":"Busa Royal D24"},{"label":"Dimensi","value":"P 140cm × L 78cm × T 85cm"},{"label":"Pilihan Bahan Cover","value":"Kanvas Linen, Velvet Mewah, Beludru, Boucle, Oscar Kulit"},{"label":"Garansi","value":"5 Tahun garansi rangka kayu & pegas patah dari workshop Sky Furniture"}]'::jsonb, 6, now() - interval '70 days'),
  (7, 'sofa-bed-sky-comfort', 'Sofa Bed Sky Comfort', 'bed', 'Multi Function', 'Mekanisme Engsel Baja 3 Posisi Rebah', 'Sofa Bed Sky Comfort dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. Mekanisme Engsel Baja 3 Posisi Rebah. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQzA2_WVAiBub1stpUBjet3kLQ9XIvaSasHoH1dmGHhNor1yXxeV4VMy7wb4vE7nhAX5Pj75MrhVd8keiqQC1YglnW9sHZ4p3R85dugyvRqT93ADKdrVO-DOM82316RSF0UkrlRIt35AbfPEZHH2kyDyFjpVBGhxizc_5xj-1qUdlLFtWcddQ7zoKNsWImd0XnmFSLec26JTgvEeH5S8vdeDfWx6_Sf-e_-jo_LyZX', '{}'::text[], '2-in-1 Recliner', 'soft', 4.9, 176, 387, 2900000, 2250000, array['horizon', 'misty', 'walnut', 'charcoal']::text[], array['Kanvas Linen', 'Velvet Mewah', 'Beludru', 'Boucle', 'Oscar Kulit']::text[], 'Kanvas Linen', 190, 90, 85, 'Rangka besi hollow + kayu mahoni, engsel baja 3 posisi', 'Busa Royal D24 padat', null, 6, 'Jahit 3 hari', false, 3, true, false, '[{"label":"Konstruksi Rangka","value":"Rangka besi hollow + kayu mahoni, engsel baja 3 posisi"},{"label":"Kepadatan Busa","value":"Busa Royal D24 padat"},{"label":"Dimensi","value":"P 190cm × L 90cm × T 85cm"},{"label":"Pilihan Bahan Cover","value":"Kanvas Linen, Velvet Mewah, Beludru, Boucle, Oscar Kulit"},{"label":"Garansi","value":"5 Tahun garansi rangka kayu & pegas patah dari workshop Sky Furniture"}]'::jsonb, 7, now() - interval '11 days'),
  (8, 'sofa-puff-ottoman', 'Sofa Puff Ottoman', 'aksesoris', 'Aksen Ruang', 'Boucle Premium Mahoni Plinth Base', 'Sofa Puff Ottoman dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. Boucle Premium Mahoni Plinth Base. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDshF88xOK47OIK2EE2mVS0xcSM2M4Vz2fFsSghFcrPdjT-vR7d4FsYVdEwgr-LaiN9Q40E1KC-C5DXQw49_j5KrOuyT11jKyasq005-MKXD0HRsP_q2F82CTgqjnqapTzCPolRL3nj4NwjM3SXXakZBFMttfHY-aFcYHTfU3GktNl09lils-GcoD4jiDCp3UR9R_ZSGAOcBWe5LeLENW9HB5rqBNFSHiJkoJ8OucRz', '{}'::text[], null, 'primary', 4.8, 64, 141, 980000, 750000, array['azure', 'white', 'emerald']::text[], array['Boucle', 'Velvet Mewah', 'Kanvas Linen']::text[], 'Boucle', 60, 60, 40, 'Plinth base kayu mahoni, penutup boucle premium', 'Busa Royal D24', null, 20, 'Kirim 1-2 hari', false, null, false, false, '[{"label":"Konstruksi Rangka","value":"Plinth base kayu mahoni, penutup boucle premium"},{"label":"Kepadatan Busa","value":"Busa Royal D24"},{"label":"Dimensi","value":"P 60cm × L 60cm × T 40cm"},{"label":"Pilihan Bahan Cover","value":"Boucle, Velvet Mewah, Kanvas Linen"},{"label":"Garansi","value":"1 Tahun garansi konstruksi dari workshop Sky Furniture"}]'::jsonb, 8, now() - interval '90 days'),
  (101, 'meja-kopi-nordik-oak', 'Meja Kopi Nordik Oak', 'aksesoris', 'Aksesoris Ruang', 'Kayu Jati Solid Natural', 'Meja Kopi Nordik Oak dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. Kayu Jati Solid Natural. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfoSDKrBGpF6sj_M7TSkD1UTz-I6ASAS67LFYN-tCvZNiMKaVcw0mQcJOGN0uEwQUh1gZs5Rx-xjdUXDbxbNegzi1vDMw8b60nerhViY4M1ek_r_WqRjWZPC2pzrZ2y2VSDNB4KvjMiDAHhQhXNvwlSy4ZKg9oSbRorhsxextKL1q-BAsAmH__o-PJZWozZE_6Hyo5gUHuurQTVqxMGrHwgcx-8HZL6TAwbjEsxGjp', '{}'::text[], null, 'primary', 4.8, 58, 128, 1350000, 1150000, array['oak', 'walnut']::text[], '{}'::text[], null, 100, 50, 45, 'Kayu jati solid finishing natural oil', null, null, 18, 'Kirim 1-2 hari', false, null, false, false, '[{"label":"Konstruksi Rangka","value":"Kayu jati solid finishing natural oil"},{"label":"Dimensi","value":"P 100cm × L 50cm × T 45cm"},{"label":"Garansi","value":"1 Tahun garansi konstruksi dari workshop Sky Furniture"}]'::jsonb, 9, now() - interval '40 days'),
  (102, 'armchair-boucle-sky-line', 'Armchair Bouclé Sky Line', 'aksesoris', 'Kursi Santai', 'Kain Wol Bouclé Premium', 'Armchair Bouclé Sky Line dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. Kain Wol Bouclé Premium. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuSzQBVg9PrJmFBQmxSlUbRqBt-ZX1pOgULsllSxQbdzJN8wsBqJU-ybDQy7Tt-qDF7MyEnbcl0KaiTPyki425LoGSaOggjXdmcCTXz1HCEoUbCzp4n0FZF8CjFNTBR88MSaragdNOG-BYgUNs2uUylIjSj0gbPBLDdDdbNHrwXRCks4auybVJGRqP5gYhUvNwjEEEpQglcppsdF6MSy0uTp3ausn91ZLCtvnLW4Nt', '{}'::text[], 'Baru', 'amber', 4.9, 41, 90, 2150000, 1850000, array['white', 'mocca', 'azure']::text[], array['Boucle', 'Kanvas Linen', 'Velvet Mewah']::text[], 'Boucle', 80, 78, 82, 'Kayu mahoni solid, kaki jati walnut', 'Busa Royal D24', null, 9, 'Kirim 1-2 hari', false, 1, false, false, '[{"label":"Konstruksi Rangka","value":"Kayu mahoni solid, kaki jati walnut"},{"label":"Kepadatan Busa","value":"Busa Royal D24"},{"label":"Dimensi","value":"P 80cm × L 78cm × T 82cm"},{"label":"Pilihan Bahan Cover","value":"Boucle, Kanvas Linen, Velvet Mewah"},{"label":"Garansi","value":"1 Tahun garansi konstruksi dari workshop Sky Furniture"}]'::jsonb, 10, now() - interval '5 days'),
  (103, 'buffet-tv-minimalis', 'Buffet TV Minimalis', 'aksesoris', 'Furnitur Penyimpanan', 'Panjang 180cm Mahoni', 'Buffet TV Minimalis dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. Panjang 180cm Mahoni. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKKZneB_rHsOAxxFjQyAvLA1Uwln1Mb4KUnSSBEaMzoDWw_mSySuUZWGb-Ex1T5MJphx2k2LdKQ_ML1-aLsFHYdqPqKswrOus0VxEvzvxCMXxUqYZypZM0jZ7H4GZsdqUyBTVNXyYSimELZFa3f9tVZUot7fqjSn1IHdkukKca1xXHQVHIS7LWJCniKk7l57NWLdBAS0wnmKuW-QiWyw7Xxzo-GgxOG_jX_EEMu1oa', '{}'::text[], null, 'primary', 4.7, 73, 161, 2850000, 2450000, array['walnut', 'oak', 'white']::text[], '{}'::text[], null, 180, 40, 50, 'Kayu mahoni solid + blockboard, handle tersembunyi', null, null, 8, 'Kirim 1-2 hari', false, null, false, false, '[{"label":"Konstruksi Rangka","value":"Kayu mahoni solid + blockboard, handle tersembunyi"},{"label":"Dimensi","value":"P 180cm × L 40cm × T 50cm"},{"label":"Garansi","value":"1 Tahun garansi konstruksi dari workshop Sky Furniture"}]'::jsonb, 11, now() - interval '33 days'),
  (104, 'karpet-tenun-azure-wave', 'Karpet Tenun Azure Wave', 'aksesoris', 'Dekorasi Lantai', 'Serat Wool Organik 200x150', 'Karpet Tenun Azure Wave dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. Serat Wool Organik 200x150. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9GjLbg9Lco_b_H5MAFdE6jhiuumafMpCvpxyZPS8iGAbhQqvALBPz-BaJmddcettx9ELC1DYo0lsnFnFg0u-_5rLDXrw7aPnEXC1EcLgF78ihpgIC5Z9eoIv7q9-HoGJE7a7_-ccbyrLnbE6L8PgHK67j5ztDTNtYESIWydXbfBrPs8KEfJzkK149V0UQLftizEvpigzYPYu3n5ecFKFAchPWYKuhI0rwIGKWLRdP', '{}'::text[], null, 'primary', 4.8, 37, 81, 1050000, 875000, array['azure', 'misty', 'mocca']::text[], '{}'::text[], null, 200, 150, 2, 'Tenun tangan serat wool organik, backing anti slip', null, null, 25, 'Kirim 1-2 hari', false, null, false, false, '[{"label":"Konstruksi Rangka","value":"Tenun tangan serat wool organik, backing anti slip"},{"label":"Dimensi","value":"P 200cm × L 150cm × T 2cm"},{"label":"Garansi","value":"1 Tahun garansi konstruksi dari workshop Sky Furniture"}]'::jsonb, 12, now() - interval '25 days'),
  (105, 'bantal-dakron-linen', 'Bantal Dakron Linen', 'aksesoris', 'Aksesoris Sofa', 'Isi Dacron Silicon, Sarung Linen Bisa Dilepas', 'Bantal Dakron Linen dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. Isi Dacron Silicon, Sarung Linen Bisa Dilepas. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.', null, '{}'::text[], null, 'primary', 4.9, 120, 264, 335000, 285000, array['azure', 'white', 'mocca', 'navy']::text[], '{}'::text[], null, 45, 45, 12, 'Sarung linen dengan resleting tersembunyi', 'Dacron Silicon premium', null, 60, 'Kirim 1-2 hari', false, null, false, false, '[{"label":"Konstruksi Rangka","value":"Sarung linen dengan resleting tersembunyi"},{"label":"Kepadatan Busa","value":"Dacron Silicon premium"},{"label":"Dimensi","value":"P 45cm × L 45cm × T 12cm"},{"label":"Garansi","value":"1 Tahun garansi konstruksi dari workshop Sky Furniture"}]'::jsonb, 13, now() - interval '100 days'),
  (10, 'sofa-l-kulit-jumbo-meja-2-puff', 'Sofa L Kulit Jumbo + Meja & 2 Puff', 'sudut', 'Sofa L Kulit Series', 'Kulit sintetis Oscar, lengan bulat ber-rivet, bonus meja kaca & 2 puff', 'Sofa L Kulit Jumbo + Meja & 2 Puff dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. Kulit sintetis Oscar, lengan bulat ber-rivet, bonus meja kaca & 2 puff. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.', '/produk/sofa-l-kulit-jumbo-1.jpg', array['/produk/sofa-l-kulit-jumbo-1.jpg', '/produk/sofa-l-kulit-jumbo-2.jpg']::text[], 'Paket Lengkap', 'secondary', 4.9, 74, 163, 5500000, 4650000, array['walnut', 'charcoal']::text[], array['Kanvas Linen', 'Velvet Mewah', 'Beludru', 'Boucle', 'Oscar Kulit']::text[], 'Oscar Kulit', 320, 200, 85, 'Kayu Mahoni Solid Oven, lengan bulat dengan aksen rivet', 'Busa Royal D24 + Dacron Silicon', null, 5, 'Jahit 3 hari', true, 7, true, true, '[{"label":"Konstruksi Rangka","value":"Kayu Mahoni Solid Oven, lengan bulat dengan aksen rivet"},{"label":"Kepadatan Busa","value":"Busa Royal D24 + Dacron Silicon"},{"label":"Dimensi","value":"P 320cm × L 200cm × T 85cm"},{"label":"Pilihan Bahan Cover","value":"Kanvas Linen, Velvet Mewah, Beludru, Boucle, Oscar Kulit"},{"label":"Garansi","value":"5 Tahun garansi rangka kayu & pegas patah dari workshop Sky Furniture"}]'::jsonb, 14, now() - interval '12 days'),
  (11, 'sofa-l-kulit-minimalis-meja', 'Sofa L Kulit Minimalis + Meja', 'sudut', 'Sofa L Kulit Series', 'Kulit sintetis Oscar cokelat, kancing kristal, bonus meja kaca', 'Sofa L Kulit Minimalis + Meja dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. Kulit sintetis Oscar cokelat, kancing kristal, bonus meja kaca. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.', '/produk/sofa-l-kulit-minimalis.jpg', '{}'::text[], null, 'primary', 4.8, 52, 114, 4200000, 3450000, array['walnut', 'charcoal']::text[], array['Kanvas Linen', 'Velvet Mewah', 'Beludru', 'Boucle', 'Oscar Kulit']::text[], 'Oscar Kulit', 240, 170, 85, 'Kayu Mahoni Solid Oven, lengan bulat dengan aksen rivet', 'Busa Royal D24 + Dacron Silicon', null, 6, 'Jahit 3 hari', true, 5, false, true, '[{"label":"Konstruksi Rangka","value":"Kayu Mahoni Solid Oven, lengan bulat dengan aksen rivet"},{"label":"Kepadatan Busa","value":"Busa Royal D24 + Dacron Silicon"},{"label":"Dimensi","value":"P 240cm × L 170cm × T 85cm"},{"label":"Pilihan Bahan Cover","value":"Kanvas Linen, Velvet Mewah, Beludru, Boucle, Oscar Kulit"},{"label":"Garansi","value":"5 Tahun garansi rangka kayu & pegas patah dari workshop Sky Furniture"}]'::jsonb, 15, now() - interval '26 days'),
  (12, 'sofa-minimalis-3-seater-meja-2-puff', 'Sofa Minimalis 3 Seater + Meja & 2 Puff', 'set', 'Sofa Set Minimalis', 'Paket hemat sofa 3 dudukan, meja laci kaca, dan 2 puff kotak', 'Sofa Minimalis 3 Seater + Meja & 2 Puff dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. Paket hemat sofa 3 dudukan, meja laci kaca, dan 2 puff kotak. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.', '/produk/sofa-minimalis-3-seater-meja-puff.jpg', '{}'::text[], 'Paket Hemat', 'soft', 4.9, 96, 211, 3100000, 2550000, array['maroon', 'navy', 'misty', 'mocca']::text[], array['Kanvas Linen', 'Velvet Mewah', 'Beludru', 'Boucle', 'Oscar Kulit']::text[], 'Kanvas Linen', 190, 80, 80, 'Kayu Mahoni Oven, sambungan dowel & lem PVAc', 'Busa Royal D24', null, 10, 'Jahit 3 hari', false, 3, true, true, '[{"label":"Konstruksi Rangka","value":"Kayu Mahoni Oven, sambungan dowel & lem PVAc"},{"label":"Kepadatan Busa","value":"Busa Royal D24"},{"label":"Dimensi","value":"P 190cm × L 80cm × T 80cm"},{"label":"Pilihan Bahan Cover","value":"Kanvas Linen, Velvet Mewah, Beludru, Boucle, Oscar Kulit"},{"label":"Garansi","value":"5 Tahun garansi rangka kayu & pegas patah dari workshop Sky Furniture"}]'::jsonb, 16, now() - interval '9 days'),
  (13, 'sofa-minimalis-2-seater-meja-2-puff', 'Sofa Minimalis 2 Seater + Meja & 2 Puff', 'set', 'Sofa Set Minimalis', 'Ringkas untuk ruang mini: sofa 2 dudukan, meja laci kaca, dan 2 puff', 'Sofa Minimalis 2 Seater + Meja & 2 Puff dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. Ringkas untuk ruang mini: sofa 2 dudukan, meja laci kaca, dan 2 puff. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.', '/produk/sofa-minimalis-2-seater-meja-puff.jpg', '{}'::text[], null, 'primary', 4.8, 81, 178, 2600000, 2150000, array['mocca', 'walnut', 'misty', 'navy']::text[], array['Kanvas Linen', 'Velvet Mewah', 'Beludru', 'Boucle', 'Oscar Kulit']::text[], 'Kanvas Linen', 140, 78, 80, 'Kayu Mahoni Oven, sambungan dowel & lem PVAc', 'Busa Royal D24', null, 11, 'Jahit 3 hari', false, 2, true, true, '[{"label":"Konstruksi Rangka","value":"Kayu Mahoni Oven, sambungan dowel & lem PVAc"},{"label":"Kepadatan Busa","value":"Busa Royal D24"},{"label":"Dimensi","value":"P 140cm × L 78cm × T 80cm"},{"label":"Pilihan Bahan Cover","value":"Kanvas Linen, Velvet Mewah, Beludru, Boucle, Oscar Kulit"},{"label":"Garansi","value":"5 Tahun garansi rangka kayu & pegas patah dari workshop Sky Furniture"}]'::jsonb, 17, now() - interval '18 days'),
  (14, 'sofa-set-minimalis-321', 'Sofa Set Minimalis 321', 'set', 'Sofa Set Minimalis', 'Set lengkap 3+2+1 dudukan dengan meja tamu minimalis', 'Sofa Set Minimalis 321 dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. Set lengkap 3+2+1 dudukan dengan meja tamu minimalis. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.', '/produk/sofa-set-minimalis-321.jpg', '{}'::text[], 'Set Keluarga', 'tertiary', 4.9, 67, 147, 5200000, 4350000, array['navy', 'misty', 'charcoal', 'mocca']::text[], array['Kanvas Linen', 'Velvet Mewah', 'Beludru', 'Boucle', 'Oscar Kulit']::text[], 'Kanvas Linen', 190, 80, 80, 'Kayu Mahoni Oven, sambungan dowel & lem PVAc', 'Busa Royal D24', null, 4, 'Jahit 3 hari', false, 6, true, true, '[{"label":"Konstruksi Rangka","value":"Kayu Mahoni Oven, sambungan dowel & lem PVAc"},{"label":"Kepadatan Busa","value":"Busa Royal D24"},{"label":"Dimensi","value":"P 190cm × L 80cm × T 80cm"},{"label":"Pilihan Bahan Cover","value":"Kanvas Linen, Velvet Mewah, Beludru, Boucle, Oscar Kulit"},{"label":"Garansi","value":"5 Tahun garansi rangka kayu & pegas patah dari workshop Sky Furniture"}]'::jsonb, 18, now() - interval '15 days'),
  (15, 'sofa-retro-set-211-meja-2-puff', 'Sofa Retro Set 211 + Meja & 2 Puff', 'retro', 'Sofa Retro Series', 'Sofa retro 2 dudukan + 1 single, meja putih kaki kayu, dan 2 puff bulat', 'Sofa Retro Set 211 + Meja & 2 Puff dibuat langsung oleh pengrajin workshop Sky Furniture di Palembang dengan standar presisi yang sama untuk setiap unit. Sofa retro 2 dudukan + 1 single, meja putih kaki kayu, dan 2 puff bulat. Setiap pesanan melewati pemeriksaan kualitas sebelum dikirim, dan Anda dapat berkonsultasi gratis dengan desainer kami untuk menyesuaikan warna, bahan, maupun dimensi.', '/produk/sofa-retro-set-211.webp', '{}'::text[], null, 'primary', 4.9, 58, 128, 4300000, 3600000, array['mocca', 'misty', 'charcoal', 'navy']::text[], array['Kanvas Linen', 'Velvet Mewah', 'Beludru', 'Boucle', 'Oscar Kulit']::text[], 'Kanvas Linen', 140, 78, 85, 'Kayu Mahoni Oven, kaki kayu bulat finishing putih', 'Busa Royal D24', null, 7, 'Jahit 3 hari', false, 4, true, true, '[{"label":"Konstruksi Rangka","value":"Kayu Mahoni Oven, kaki kayu bulat finishing putih"},{"label":"Kepadatan Busa","value":"Busa Royal D24"},{"label":"Dimensi","value":"P 140cm × L 78cm × T 85cm"},{"label":"Pilihan Bahan Cover","value":"Kanvas Linen, Velvet Mewah, Beludru, Boucle, Oscar Kulit"},{"label":"Garansi","value":"5 Tahun garansi rangka kayu & pegas patah dari workshop Sky Furniture"}]'::jsonb, 19, now() - interval '22 days')
on conflict (id) do nothing;

select setval(pg_get_serial_sequence('public.products', 'id'), (select max(id) from public.products));

-- ------------------------------------------------------------------
-- Ulasan: testimoni umum (product_id kosong) + ulasan produk
-- ------------------------------------------------------------------
-- hanya diisi bila tabel reviews masih kosong
do $seed$
begin
  if not exists (select 1 from public.reviews) then
    insert into public.reviews (product_id, name, city, rating, comment, image, created_at) values
      (null, 'Dimas Rahardian', 'Tangerang', 5, 'Warnanya bener-bener pas dengan cat dinding rumah scandi saya. Busanya empuk tapi padat, gak amblas.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4KaYGxNFXlBs24V9mcW4TindGciVqj2SoO5VB_0Rzr1Dh12wFfmA04_7idTAlE2INIzVnaRVC8eTVttMaair1pKzklDVNnR9aSIJU_ycUPBU9w9Iana0qQEH7v4-df34f0d4fN3ye2f6ljx9slw8xFXR8SdACTFlJ5epKJFEgdurA--DaVbXzf5YScj0tuHX9T9OxfTnN7e3zuL1wIiKfgRWZVSer-CyW_ykQreTU', now() - interval '20 days'),
      (null, 'Anisa Maharani', 'BSD', 5, 'Kualitas jahitannya rapi banget, pengiriman ke BSD cuma 3 hari setelah jahitan beres. Packing aman berlapis.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtGlK6h68HFwaLlH4sMQS0Zlys09FZS-L89uH0nL3LinXGoWFkbvdnIg3Qo8gZ59tmn34_RFYJ3NJSuoDc9zJE_LZmKEk2rrxQqOIQoJXwHv7O-TZyehUJx5dLPLDpR56QODgt8NA1ozoa-vNmQJ-BPcH4nAYWJem2ILfwTHTKjlfkRz4eKNeu4X0Ox7e3YPJ9nHG7u4BftfudwXI2-aGEO7aCby-QyvGgb-OoaCOu', now() - interval '27 days'),
      (null, 'Bambang Prakoso', 'Jakarta Selatan', 5, 'Ukurannya pas banget di ruang keluarga apartemen saya. Efisien tempat tapi tetap muat 4-5 orang.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhu6Ia99FSHreURoyhzHFzUa0fHVGx-t8S-F0awi8sQz1ae60CSmljxyJqOD3Xl_DNZzk-lVebBwDqsJXr9VxvY3GdkogyyQhEYadqn1rkFRgOnXBXfUnxBwuxKk84N5WyX5cRMopIYjsSFWGgxGLUQNLqk8-5M4aRLp3arqMf9OdUv2hsPGXmPrLSax2xNuXPNrOwfDdT9AyQ_grJ8GJ8Xs4wDQ6tLLhZ55o5bkis', now() - interval '34 days'),
      (null, 'Citra Lestari', 'Bandung', 5, 'Admin responsif, bisa request ganti kain dan hasilnya sesuai foto. Tukang pasangnya juga ramah dan rapi.', null, now() - interval '41 days'),
      (null, 'Eko Wicaksono', 'Surabaya', 4, 'Overall bagus, rangka kokoh dan finishing halus. Pengiriman lewat kargo agak lama tapi barang sampai tanpa lecet.', null, now() - interval '48 days'),
      (null, 'Fitri Handayani', 'Semarang', 5, 'Sudah 8 bulan dipakai tiap hari, busanya tidak kempes sama sekali. Worth it banget untuk harga workshop langsung.', null, now() - interval '55 days'),
      (9, 'Dimas Rahardian', 'Tangerang', 5, 'Warna Biru Azure-nya bener-bener pas banget dengan cat dinding rumah scandi saya. Busanya empuk tapi padat, gak amblas.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4KaYGxNFXlBs24V9mcW4TindGciVqj2SoO5VB_0Rzr1Dh12wFfmA04_7idTAlE2INIzVnaRVC8eTVttMaair1pKzklDVNnR9aSIJU_ycUPBU9w9Iana0qQEH7v4-df34f0d4fN3ye2f6ljx9slw8xFXR8SdACTFlJ5epKJFEgdurA--DaVbXzf5YScj0tuHX9T9OxfTnN7e3zuL1wIiKfgRWZVSer-CyW_ykQreTU', now() - interval '4 days'),
      (9, 'Anisa Maharani', 'BSD', 5, 'Kualitas jahitannya rapi banget, pengiriman ke BSD cuma 3 hari setelah jahitan beres. Bonus meja tamunya juga kokoh.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtGlK6h68HFwaLlH4sMQS0Zlys09FZS-L89uH0nL3LinXGoWFkbvdnIg3Qo8gZ59tmn34_RFYJ3NJSuoDc9zJE_LZmKEk2rrxQqOIQoJXwHv7O-TZyehUJx5dLPLDpR56QODgt8NA1ozoa-vNmQJ-BPcH4nAYWJem2ILfwTHTKjlfkRz4eKNeu4X0Ox7e3YPJ9nHG7u4BftfudwXI2-aGEO7aCby-QyvGgb-OoaCOu', now() - interval '10 days'),
      (9, 'Bambang Prakoso', 'Jakarta Selatan', 5, 'Sudut L-nya pas banget di sudut ruang keluarga apartemen saya. Sangat efisien tempat tapi muat duduk 4-5 orang.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhu6Ia99FSHreURoyhzHFzUa0fHVGx-t8S-F0awi8sQz1ae60CSmljxyJqOD3Xl_DNZzk-lVebBwDqsJXr9VxvY3GdkogyyQhEYadqn1rkFRgOnXBXfUnxBwuxKk84N5WyX5cRMopIYjsSFWGgxGLUQNLqk8-5M4aRLp3arqMf9OdUv2hsPGXmPrLSax2xNuXPNrOwfDdT9AyQ_grJ8GJ8Xs4wDQ6tLLhZ55o5bkis', now() - interval '16 days')
    on conflict do nothing;
      end if;
end
$seed$;

-- ------------------------------------------------------------------
-- Pengumuman (bilah atas)
-- ------------------------------------------------------------------
do $seed$
begin
  if not exists (select 1 from public.announcements) then
    insert into public.announcements (icon, text, sort_order) values
      ('local_shipping', 'Gratis ongkir se-Jawa & Bali untuk belanja di atas Rp 3 juta', 0),
      ('verified', 'Garansi rangka kayu mahoni 5 tahun resmi workshop', 1),
      ('sell', 'Gunakan kode SKYBIRU untuk diskon 10% hari ini', 2)
    on conflict do nothing;
      end if;
end
$seed$;

-- ------------------------------------------------------------------
-- Bilah kepercayaan (marquee)
-- ------------------------------------------------------------------
do $seed$
begin
  if not exists (select 1 from public.trust_items) then
    insert into public.trust_items (icon, text, sort_order) values
      ('forest', 'Rangka Mahoni Oven Anti Rayap', 0),
      ('verified_user', 'Garansi Rangka 5 Tahun', 1),
      ('local_shipping', 'Gratis Ongkir Area Sumsel', 2),
      ('design_services', 'Konsultasi Desain Gratis', 3),
      ('payments', 'Cicilan 0% Hingga 12 Bulan', 4),
      ('workspace_premium', 'Workshop Pengrajin Palembang', 5)
    on conflict do nothing;
      end if;
end
$seed$;

-- ------------------------------------------------------------------
-- Mengapa Sky Furniture
-- ------------------------------------------------------------------
do $seed$
begin
  if not exists (select 1 from public.why_us) then
    insert into public.why_us (icon, title, description, style, sort_order) values
      ('forest', 'Kayu Mahoni 100%', 'Rangka solid kiln-dried MC12%, anti rayap, anti jamur, tahan 15+ tahun', 'primary', 0),
      ('verified_user', 'Garansi 5 Tahun', 'Garansi resmi rangka kayu dan pegas patah dari workshop Sky Furniture', 'secondary', 1),
      ('local_shipping', 'Ongkir Bebas', 'Gratis ongkir se-Sumatera Selatan untuk belanja di atas Rp 3 juta, diantar langsung armada toko', 'surface', 2),
      ('design_services', 'Custom Bebas', 'Dimensi, warna, kain, dan model sesuai keinginan dengan konsultasi gratis', 'tertiary', 3)
    on conflict do nothing;
      end if;
end
$seed$;

-- ------------------------------------------------------------------
-- Proses pemesanan
-- ------------------------------------------------------------------
do $seed$
begin
  if not exists (select 1 from public.process_steps) then
    insert into public.process_steps (icon, title, description, sort_order) values
      ('chat', 'Konsultasi', 'Ceritakan ukuran ruang & gaya rumah Anda. Desainer kami bantu memilih model yang tepat.', 0),
      ('palette', 'Pilih Bahan & Warna', 'Lihat sampel kain dan finishing kayu. Kami kirim contoh fisik bila diperlukan.', 1),
      ('construction', 'Produksi Workshop', 'Pengrajin Jepara merakit rangka mahoni oven dan menjahit sarung dengan tangan.', 2),
      ('fact_check', 'Quality Control', 'Setiap unit diuji kekuatan rangka, kepadatan busa, dan kerapian jahitan.', 3),
      ('local_shipping', 'Kirim & Instalasi', 'Armada khusus mebel mengantar, memasang, dan membersihkan area setelahnya.', 4)
    on conflict do nothing;
      end if;
end
$seed$;

-- ------------------------------------------------------------------
-- FAQ
-- ------------------------------------------------------------------
do $seed$
begin
  if not exists (select 1 from public.faqs) then
    insert into public.faqs (question, answer, sort_order) values
      ('Berapa lama proses pembuatan sofa?', 'Untuk model ready rangka, proses jahit kain memerlukan sekitar 3 hari kerja. Pesanan custom dimensi memerlukan 10–14 hari kerja, tergantung kerumitan model.', 0),
      ('Apakah saya bisa mengganti warna dan bahan kain?', 'Bisa. Setiap produk memiliki pilihan warna dan bahan cover di halaman detail. Selisih harga bahan akan otomatis dihitung. Untuk kain di luar katalog, hubungi desainer kami via WhatsApp.', 1),
      ('Bagaimana cara klaim garansi rangka 5 tahun?', 'Simpan nomor pesanan Anda, lalu kirim foto kerusakan ke WhatsApp kami. Tim akan menjadwalkan pengecekan dan perbaikan di rumah Anda tanpa biaya selama kerusakan bukan akibat pemakaian tidak wajar.', 2),
      ('Apakah ongkir sudah termasuk instalasi?', 'Layanan Sky Direct sudah termasuk pengantaran, perakitan, dan instalasi. Untuk kargo luar Jawa, sofa dikirim dalam kondisi rakit sebagian dengan panduan pemasangan.', 3),
      ('Apakah bisa retur jika ukuran tidak muat?', 'Gunakan fitur ''Cek Muat Ruangan'' di halaman produk sebelum membeli. Jika tetap tidak sesuai, kami menerima penukaran model dalam 7 hari dengan ongkir ditanggung pembeli.', 4)
    on conflict do nothing;
      end if;
end
$seed$;

-- ------------------------------------------------------------------
-- Kategori pilihan di beranda
-- ------------------------------------------------------------------
insert into public.home_categories (id, name, sub, icon, featured, color, sort_order) values
  ('retro', 'Sofa Retro', '2 & 3 Seater', 'chair_alt', false, null, 0),
  ('sudut', 'Sofa L Sudut', 'Keluarga & Santai', 'weekend', true, null, 1),
  ('chester', 'Sofa Kancing', 'Chesterfield Klasik', 'auto_awesome', false, null, 2),
  ('turki', 'Sofa Turki', 'Luxury Set Ukir', 'king_bed', false, null, 3),
  ('custom', 'Custom Bebas', 'Dimensi, Busa & Warna', 'design_services', true, 'secondary', 4)
on conflict (id) do nothing;

-- ------------------------------------------------------------------
-- Kode promo
-- ------------------------------------------------------------------
insert into public.promo_codes (code, label, type, value, max_discount, min_subtotal) values
  ('SKYBIRU', 'Diskon 10% (maks. Rp 500.000)', 'percent', 10, 500000, 1000000),
  ('JEPARA150', 'Potongan Rp 150.000', 'flat', 150000, null, 2000000),
  ('ONGKIRGRATIS', 'Gratis ongkir semua layanan', 'shipping', 0, null, 500000)
on conflict (code) do nothing;

-- ------------------------------------------------------------------
-- Metode pengiriman
-- ------------------------------------------------------------------
insert into public.shipping_methods (id, name, description, price, free_above, days_min, days_max, icon, sort_order) values
  ('direct', 'Sky Direct (Armada Toko)', '1–3 hari kerja setelah jahit selesai. Khusus Palembang & Banyuasin. Termasuk perakitan', 100000, 3000000, 1, 3, 'local_shipping', 0),
  ('express', 'Sky Express Palembang', '1–2 hari kerja untuk sofa ready stok area Kota Palembang', 150000, null, 1, 2, 'bolt', 1),
  ('cargo', 'Kargo Darat Antar Kabupaten Sumsel', '3–5 hari kerja. Meliputi Ogan Ilir, OKI, Prabumulih, Muara Enim, Lahat, Lubuklinggau, dll.', 250000, null, 3, 5, 'local_shipping', 2)
on conflict (id) do nothing;

-- ------------------------------------------------------------------
-- Metode pembayaran
-- ------------------------------------------------------------------
insert into public.payment_methods (id, group_key, name, code, description, sort_order) values
  ('bca', 'transfer', 'BCA Virtual Account', 'BCA', 'Pembayaran otomatis, konfirmasi instan', 0),
  ('mandiri', 'transfer', 'Mandiri Virtual Account', 'Mandiri', 'Berlaku 24 jam, bayar via ATM / M-Banking', 1),
  ('bni', 'transfer', 'BNI Virtual Account', 'BNI', 'Pembayaran ATM / Internet Banking BNI', 2),
  ('manual', 'transfer', 'Transfer Manual ke Rekening', null, 'Konfirmasi via WhatsApp, proses 1×24 jam', 3),
  ('gopay', 'ewallet', 'GoPay', 'GoPay', 'Scan QR atau bayar via Gojek App', 4),
  ('shopeepay', 'ewallet', 'ShopeePay', 'SPay', 'Bayar via aplikasi Shopee', 5),
  ('ovo', 'ewallet', 'OVO', 'OVO', 'Bayar via aplikasi OVO', 6),
  ('cod', 'cod', 'Bayar di Tempat (COD)', null, 'Bayar tunai saat tim kami tiba', 7),
  ('cicilan', 'cicilan', 'Cicilan Kartu Kredit 0%', null, 'BCA, Mandiri, BNI, dan CIMB', 8)
on conflict (id) do nothing;

-- ------------------------------------------------------------------
-- Pengaturan toko
-- ------------------------------------------------------------------
insert into public.site_settings (key, value) values
  ('store_name', '"Sky Furniture"'::jsonb),
  ('logo_url', '"https://lh3.googleusercontent.com/aida-public/AB6AXuBtS4O_XswpGqzhkvYi-HKow4baNtwsQMbzXWDKfW0CVOwI-QR6JcTj-Dx1ChVQIqSZ2gpbaa3bG3ttIzG0V2WPtqiOcpv29WUDSkVBFDa9jQmscYdiYcc0GSKad0qPu2ZbyLT4nz8K826A0q1IOlcUgQ7o4Pmzg_jqsIDi1Oyx-jnEuXgFh9arCJvpTdnD59JQXbxdDnfk6Hfj91dRflg2DFIPFKAhkrSgkjSBPxYLPBUV8vOJ0vlc1CPG6fpMVu2W_zI"'::jsonb),
  ('whatsapp_number', '"6281123456789"'::jsonb),
  ('free_shipping_threshold', '3000000'::jsonb),
  ('tax_rate', '0.11'::jsonb),
  ('max_qty', '10'::jsonb),
  ('featured_promo_code', '"SKYBIRU"'::jsonb),
  ('footer_description', '"Pusat sofa premium Jepara dengan estetika Skandinavia. Ribuan keluarga Indonesia sudah mempercayakan kenyamanan rumahnya kepada kami."'::jsonb),
  ('address', '"Jl. Workshop Jepara No. 1, Jawa Tengah"'::jsonb),
  ('phone_display', '"+62 811-2345-6789"'::jsonb),
  ('business_hours', '"Senin - Sabtu, 08.00 - 17.00"'::jsonb),
  ('email', '""'::jsonb),
  ('instagram_url', '""'::jsonb),
  ('youtube_url', '""'::jsonb),
  ('manual_transfer_info', '"Transfer ke rekening BCA 123-456-7890 a.n. Sky Furniture Jepara lalu konfirmasi bukti transfer via WhatsApp."'::jsonb),
  ('hero', '{"badge":"Koleksi Signature Mahoni & Boucle","title":"Kenyamanan Mewah dengan Nuansa Biru Langit dan Kayu Mahoni Alami","subtitle":"Estetika arsitektural Skandinavia yang dirancang khusus untuk kenyamanan ruang keluarga. Dibuat presisi langsung oleh pengrajin workshop Sky Furniture Palembang dengan busa tahan kempes & kain premium bertekstur sejuk.","image":"https://lh3.googleusercontent.com/aida-public/AB6AXuC1amBK1Pw2_YguE0pkhxH21IYlkzQn4xFikDoju-r6gkEMbaFzdHCBSvmB7zH-KXbE9je1h_sjfGfwHKvoVUWlGqCMpYSZU7NL8Kze1o4cKLkSdU8NlXgiyI3qU9WSIPnPX4mAIOIZjFcjTueODG6ElHETc9iAa8OqRMU4B8ccOgUrnKIgJJtICQWr9x5iFV-ASy4nVBGRY8Unt600gaI2JrSSZjCi0ufvY0a-TnUL","floatingProductId":9,"stats":[{"value":5,"suffix":" Tahun","label":"Garansi Rangka"},{"value":100,"suffix":"%","label":"Kayu Mahoni Oven"},{"value":4.9,"suffix":"/5.0","label":"Ulasan Kepuasan","decimals":1}]}'::jsonb)
on conflict (key) do nothing;
