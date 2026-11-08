/**
 * Membuat supabase/seed.sql dari data statis di src/data/*.
 * Jalankan: node scripts/generate-seed.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const vite = await createServer({
  root,
  logLevel: "error",
  appType: "custom",
  server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true, include: [] },
});

const products = await vite.ssrLoadModule("/src/data/products.js");
const store = await vite.ssrLoadModule("/src/data/store.js");
const images = await vite.ssrLoadModule("/src/data/images.js");

/* ---------- helper SQL ---------- */
const q = (v) => (v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const n = (v) => (v === null || v === undefined ? "null" : String(v));
const b = (v) => (v ? "true" : "false");
const arr = (list) =>
  !list || list.length === 0 ? "'{}'::text[]" : `array[${list.map(q).join(", ")}]::text[]`;
const json = (v) => `${q(JSON.stringify(v))}::jsonb`;

const insert = (table, cols, rows, conflict = "") => {
  if (!rows.length) return "";
  const body = rows.map((r) => `  (${r.join(", ")})`).join(",\n");
  return `insert into public.${table} (${cols.join(", ")}) values\n${body}\n${conflict || "on conflict do nothing"};\n`;
};

const section = (title) => `\n-- ${"-".repeat(66)}\n-- ${title}\n-- ${"-".repeat(66)}\n`;

const badgeStyleOf = (badge) => {
  if (!badge) return "primary";
  const map = {
    "bg-primary": "primary",
    "bg-secondary": "secondary",
    "bg-tertiary": "tertiary",
    "bg-secondary-container": "amber",
    "bg-primary-fixed": "soft",
  };
  return map[badge.color] ?? "primary";
};

const whyStyle = (bg) =>
  ({
    "bg-primary-container": "primary",
    "bg-secondary-container": "secondary",
    "bg-surface-container-high": "surface",
    "bg-tertiary-fixed": "tertiary",
  })[bg] ?? "primary";

let sql = `-- =====================================================================
-- SKY FURNITURE - Data awal (seed)
-- Dibuat otomatis oleh scripts/generate-seed.mjs dari src/data/*.
-- Jalankan SETELAH supabase/schema.sql. Aman dijalankan ulang
-- (baris yang sudah ada tidak ditimpa).
-- =====================================================================
`;

/* ---------- warna, bahan, kategori ---------- */
sql += section("Warna");
sql += insert(
  "colors",
  ["key", "name", "hex", "sort_order"],
  products.COLOR_LIST.map((c, i) => [q(c.key), q(c.name), q(c.hex), n(i)]),
  "on conflict (key) do nothing"
);

sql += section("Bahan cover");
sql += insert(
  "materials",
  ["name", "price", "description", "sort_order"],
  products.MATERIALS.map((m, i) => [q(m.name), n(m.price), q(m.desc), n(i)]),
  "on conflict (name) do nothing"
);

sql += section("Kategori katalog");
sql += insert(
  "categories",
  ["id", "name", "icon", "blurb", "sort_order"],
  products.CATEGORIES.map((c, i) => [q(c.id), q(c.name), q(c.icon), q(c.blurb), n(i)]),
  "on conflict (id) do nothing"
);

/* ---------- produk ---------- */
sql += section("Produk");
const allList = products.ALL_PRODUCTS || products.PRODUCTS;
const productRows = allList.map((p, i) => {
  const gallery = p.gallery && p.gallery.length > 1 ? p.gallery : [];
  return [
    n(p.id),
    q(p.slug),
    q(p.name),
    q(p.category),
    q(p.subtitle),
    q(p.description),
    q(p.about),
    q(p.image || null),
    arr(gallery),
    q(p.badge?.text ?? null),
    q(badgeStyleOf(p.badge)),
    n(p.rating),
    n(p.reviewCount),
    n(p.soldCount),
    n(p.originalPrice),
    n(p.price),
    arr(p.colors.map((c) => c.key)),
    arr(p.materials),
    q(p.material),
    n(p.footprint.p),
    n(p.footprint.l),
    n(p.footprint.t),
    q(p.frame),
    q(p.cushion),
    q(p.stock ?? null),
    n(p.stockQty),
    q(p.leadTime),
    b(p.hasOrientation),
    n(p.seats),
    b(p.featured),
    b(p.isActive ?? true),
    json(p.specs),
    n(i),
    `now() - interval '${p.daysOld} days'`,
  ];
});
sql += insert(
  "products",
  [
    "id", "slug", "name", "category_id", "subtitle", "description", "about", "image", "gallery",
    "badge_text", "badge_style", "rating", "review_count", "sold_count", "original_price", "price",
    "colors", "materials", "material", "footprint_p", "footprint_l", "footprint_t", "frame", "cushion",
    "stock_label", "stock_qty", "lead_time", "has_orientation", "seats", "featured", "is_active", "specs",
    "sort_order", "created_at",
  ],
  productRows,
  "on conflict (id) do nothing"
);

const bonusUpdates = allList.filter((p) => p.bonusProductId)
  .map((p) => `update public.products set bonus_product_id = ${p.bonusProductId} where id = ${p.id} and bonus_product_id is null;`)
  .join("\n");
if (bonusUpdates) sql += `\n${bonusUpdates}\n`;
sql += `\nselect setval(pg_get_serial_sequence('public.products', 'id'), (select max(id) from public.products));\n`;

/* ---------- ulasan ---------- */
sql += section("Ulasan: testimoni umum (product_id kosong) + ulasan produk");
const reviewCols = ["product_id", "name", "city", "rating", "comment", "image", "created_at"];
const poolRows = products.REVIEW_POOL.map((r, i) => [
  "null", q(r.name), q(r.city), n(r.rating), q(r.comment), q(r.image ?? null), `now() - interval '${20 + i * 7} days'`,
]);
const productReviewRows = products.PRODUCTS.filter((p) => p.reviews).flatMap((p) =>
  p.reviews.map((r) => [
    n(p.id), q(r.name), q(r.city), n(r.rating), q(r.comment), q(r.image ?? null), `now() - interval '${r.daysAgo} days'`,
  ])
);
sql += `-- hanya diisi bila tabel reviews masih kosong\n`;
sql += `do $seed$\nbegin\n  if not exists (select 1 from public.reviews) then\n`;
sql += insert("reviews", reviewCols, [...poolRows, ...productReviewRows]).replace(/^/gm, "    ");
sql += `  end if;\nend\n$seed$;\n`;

/* ---------- konten beranda ---------- */
sql += section("Pengumuman (bilah atas)");
const announcements = [
  { icon: "local_shipping", text: "Gratis ongkir se-Jawa & Bali untuk belanja di atas Rp 3 juta" },
  { icon: "verified", text: "Garansi rangka kayu mahoni 5 tahun resmi workshop" },
  { icon: "sell", text: "Gunakan kode SKYBIRU untuk diskon 10% hari ini" },
];
sql += `do $seed$\nbegin\n  if not exists (select 1 from public.announcements) then\n`;
sql += insert(
  "announcements",
  ["icon", "text", "sort_order"],
  announcements.map((a, i) => [q(a.icon), q(a.text), n(i)])
).replace(/^/gm, "    ");
sql += `  end if;\nend\n$seed$;\n`;

sql += section("Bilah kepercayaan (marquee)");
sql += `do $seed$\nbegin\n  if not exists (select 1 from public.trust_items) then\n`;
sql += insert(
  "trust_items",
  ["icon", "text", "sort_order"],
  store.TRUST_ITEMS.map((t, i) => [q(t.icon), q(t.text), n(i)])
).replace(/^/gm, "    ");
sql += `  end if;\nend\n$seed$;\n`;

sql += section("Mengapa Sky Furniture");
sql += `do $seed$\nbegin\n  if not exists (select 1 from public.why_us) then\n`;
sql += insert(
  "why_us",
  ["icon", "title", "description", "style", "sort_order"],
  store.WHY_US.map((w, i) => [q(w.icon), q(w.title), q(w.description), q(whyStyle(w.bgColor)), n(i)])
).replace(/^/gm, "    ");
sql += `  end if;\nend\n$seed$;\n`;

sql += section("Proses pemesanan");
sql += `do $seed$\nbegin\n  if not exists (select 1 from public.process_steps) then\n`;
sql += insert(
  "process_steps",
  ["icon", "title", "description", "sort_order"],
  store.PROCESS_STEPS.map((s, i) => [q(s.icon), q(s.title), q(s.desc), n(i)])
).replace(/^/gm, "    ");
sql += `  end if;\nend\n$seed$;\n`;

sql += section("FAQ");
sql += `do $seed$\nbegin\n  if not exists (select 1 from public.faqs) then\n`;
sql += insert(
  "faqs",
  ["question", "answer", "sort_order"],
  store.FAQS.map((f, i) => [q(f.q), q(f.a), n(i)])
).replace(/^/gm, "    ");
sql += `  end if;\nend\n$seed$;\n`;

sql += section("Kategori pilihan di beranda");
sql += insert(
  "home_categories",
  ["id", "name", "sub", "icon", "featured", "color", "sort_order"],
  store.CATEGORIES_BAR.map((c, i) => [q(c.id), q(c.name), q(c.sub), q(c.icon), b(c.featured), q(c.color ?? null), n(i)]),
  "on conflict (id) do nothing"
);

/* ---------- promo, pengiriman, pembayaran ---------- */
sql += section("Kode promo");
sql += insert(
  "promo_codes",
  ["code", "label", "type", "value", "max_discount", "min_subtotal"],
  Object.values(store.PROMO_CODES).map((p) => [q(p.code), q(p.label), q(p.type), n(p.value), n(p.max ?? null), n(p.min)]),
  "on conflict (code) do nothing"
);

sql += section("Metode pengiriman");
sql += insert(
  "shipping_methods",
  ["id", "name", "description", "price", "free_above", "days_min", "days_max", "icon", "sort_order"],
  store.SHIPPING_METHODS.map((s, i) => [
    q(s.id), q(s.name), q(s.desc), n(s.price), n(s.freeAbove ?? null), n(s.days[0]), n(s.days[1]), q(s.icon), n(i),
  ]),
  "on conflict (id) do nothing"
);

sql += section("Metode pembayaran");
let order = 0;
const paymentRows = Object.entries(store.PAYMENT_METHODS).flatMap(([group, list]) =>
  list.map((p) => [q(p.id), q(group), q(p.name), q(p.code), q(p.desc), n(order++)])
);
sql += insert(
  "payment_methods",
  ["id", "group_key", "name", "code", "description", "sort_order"],
  paymentRows,
  "on conflict (id) do nothing"
);

/* ---------- pengaturan ---------- */
sql += section("Pengaturan toko");
const settings = {
  store_name: "Sky Furniture",
  logo_url: images.LOGO_URL,
  whatsapp_number: store.WHATSAPP_NUMBER,
  free_shipping_threshold: store.FREE_SHIPPING_THRESHOLD,
  tax_rate: store.TAX_RATE,
  max_qty: store.MAX_QTY,
  featured_promo_code: "SKYBIRU",
  footer_description:
    "Pusat sofa premium Jepara dengan estetika Skandinavia. Ribuan keluarga Indonesia sudah mempercayakan kenyamanan rumahnya kepada kami.",
  address: "Jl. Workshop Jepara No. 1, Jawa Tengah",
  phone_display: "+62 811-2345-6789",
  business_hours: "Senin - Sabtu, 08.00 - 17.00",
  email: "",
  instagram_url: "",
  youtube_url: "",
  manual_transfer_info: "Transfer ke rekening BCA 123-456-7890 a.n. Sky Furniture Jepara lalu konfirmasi bukti transfer via WhatsApp.",
  hero: {
    badge: store.HERO_DATA.badge,
    title: store.HERO_DATA.title,
    subtitle: store.HERO_DATA.subtitle,
    image: store.HERO_DATA.image,
    floatingProductId: store.HERO_DATA.floatingProductId,
    stats: store.HERO_DATA.stats,
  },
};
sql += insert(
  "site_settings",
  ["key", "value"],
  Object.entries(settings).map(([k, v]) => [q(k), json(v)]),
  "on conflict (key) do nothing"
);

const out = resolve(root, "supabase", "seed.sql");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, sql, "utf8");
console.log(`seed.sql ditulis: ${out} (${sql.length} karakter)`);

await vite.close();
