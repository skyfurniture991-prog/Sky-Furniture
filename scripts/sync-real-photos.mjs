/**
 * Mengganti foto dummy (online) di Supabase dengan foto asli toko Shopee SKY FURNITUR.
 *
 *  1. Unggah semua file di public/produk/ ke Storage bucket "media" (folder produk/).
 *  2. Tambah warna "maroon" & kategori "set" bila belum ada.
 *  3. Update image + gallery produk yang sudah ada, nonaktifkan produk tanpa foto asli,
 *     dan tambahkan produk baru (id 10-15) dari src/data/products.js.
 *
 * Butuh akun admin (anon key saja tidak boleh menulis). Kredensial TIDAK disimpan:
 *   node scripts/sync-real-photos.mjs                  -> ditanya email & password
 *   $env:SKY_ADMIN_EMAIL="..."; $env:SKY_ADMIN_PASSWORD="..."; node scripts/sync-real-photos.mjs
 *
 * Aman dijalankan ulang (upload memakai upsert, update bersifat idempoten).
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PHOTO_DIR = resolve(root, "public", "produk");
const BUCKET = "media";
const FOLDER = "produk";

/* ---------- konfigurasi ---------- */
const env = Object.fromEntries(
  readFileSync(resolve(root, ".env"), "utf8")
    .split(/\r?\n/)
    .filter((l) => l.trim() && !l.trim().startsWith("#") && l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);
const url = (env.VITE_SUPABASE_URL || "").replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
const anonKey = env.VITE_SUPABASE_ANON_KEY;
if (!url || !anonKey) throw new Error("VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diisi di .env");

const ask = (question, hidden = false) =>
  new Promise((done) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = (s) => {
        if (s.startsWith(question)) rl.output.write(question);
        else if (!/\r?\n/.test(s)) rl.output.write("*");
        else rl.output.write(s);
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      done(answer.trim());
    });
  });

const email = process.env.SKY_ADMIN_EMAIL || (await ask("Email admin   : "));
const password = process.env.SKY_ADMIN_PASSWORD || (await ask("Password admin: ", true));

/* ---------- login admin ---------- */
const supabase = createClient(url, anonKey, { auth: { persistSession: false } });
const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
if (loginErr) throw new Error(`Login gagal: ${loginErr.message}`);
const { data: isAdmin } = await supabase.rpc("is_admin");
if (!isAdmin) throw new Error("Akun ini bukan admin (tabel public.admins).");
console.log("✓ Login admin berhasil");

/* ---------- 1. upload foto ---------- */
const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
const files = readdirSync(PHOTO_DIR).filter((f) => MIME[extname(f).toLowerCase()]);
const publicUrl = {};
for (const file of files) {
  const path = `${FOLDER}/${file}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, readFileSync(resolve(PHOTO_DIR, file)), {
    contentType: MIME[extname(file).toLowerCase()],
    cacheControl: "31536000",
    upsert: true,
  });
  if (error) throw new Error(`Upload ${file} gagal: ${error.message}`);
  publicUrl[`/produk/${file}`] = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  console.log(`✓ Upload ${path}`);
}
const toStorage = (src) => {
  if (!src) return null;
  if (!src.startsWith("/produk/")) return src;
  if (!publicUrl[src]) throw new Error(`Foto ${src} tidak ditemukan di public/produk/`);
  return publicUrl[src];
};

/* ---------- data katalog lokal ---------- */
const vite = await createServer({
  root,
  logLevel: "error",
  appType: "custom",
  server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true, include: [] },
});
const catalog = await vite.ssrLoadModule("/src/data/products.js");
await vite.close();

const must = async (label, promise) => {
  const { error } = await promise;
  if (error) throw new Error(`${label}: ${error.message}`);
  console.log(`✓ ${label}`);
};

/* ---------- 2. warna & kategori baru ---------- */
const colorIdx = catalog.COLOR_LIST.findIndex((c) => c.key === "maroon");
const maroon = catalog.COLOR_LIST[colorIdx];
await must(
  "Warna maroon",
  supabase.from("colors").upsert(
    { key: maroon.key, name: maroon.name, hex: maroon.hex, sort_order: colorIdx },
    { onConflict: "key", ignoreDuplicates: true }
  )
);
const catIdx = catalog.CATEGORIES.findIndex((c) => c.id === "set");
const cat = catalog.CATEGORIES[catIdx];
await must(
  "Kategori Sofa Set Minimalis",
  supabase.from("categories").upsert(
    { id: cat.id, name: cat.name, icon: cat.icon, blurb: cat.blurb, sort_order: catIdx },
    { onConflict: "id", ignoreDuplicates: true }
  )
);

/* ---------- 3. produk ---------- */
const badgeStyleOf = (badge) =>
  ({
    "bg-primary": "primary",
    "bg-secondary": "secondary",
    "bg-tertiary": "tertiary",
    "bg-secondary-container": "amber",
    "bg-primary-fixed": "soft",
  })[badge?.color] ?? "primary";

const galleryOf = (p) => (p.gallery && p.gallery.length > 1 ? p.gallery.map(toStorage) : []);

const { data: existing, error: listErr } = await supabase.from("products").select("id");
if (listErr) throw new Error(`Gagal membaca produk: ${listErr.message}`);
const existingIds = new Set(existing.map((r) => r.id));

for (const [i, p] of catalog.ALL_PRODUCTS.entries()) {
  if (!p.isActive) {
    // Produk dummy tanpa foto asli: disembunyikan, datanya tetap ada.
    if (existingIds.has(p.id)) {
      await must(`Nonaktifkan #${p.id} ${p.name}`, supabase.from("products").update({ is_active: false }).eq("id", p.id));
    }
    continue;
  }

  if (existingIds.has(p.id)) {
    // Produk lama: cukup ganti fotonya (data lain yang mungkin sudah diedit admin tidak disentuh).
    const patch = { image: toStorage(p.image), gallery: galleryOf(p), is_active: true };
    if (!p.bonusProductId) patch.bonus_product_id = null; // bonus lama (Meja Kopi) sudah nonaktif
    await must(`Foto #${p.id} ${p.name}`, supabase.from("products").update(patch).eq("id", p.id));
    continue;
  }

  // Produk baru dari foto asli toko.
  await must(
    `Tambah #${p.id} ${p.name}`,
    supabase.from("products").insert({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category_id: p.category,
      subtitle: p.subtitle,
      description: p.description,
      about: p.about,
      image: toStorage(p.image),
      gallery: galleryOf(p),
      badge_text: p.badge?.text ?? null,
      badge_style: badgeStyleOf(p.badge),
      rating: p.rating,
      review_count: p.reviewCount,
      sold_count: p.soldCount,
      original_price: p.originalPrice,
      price: p.price,
      colors: p.colors.map((c) => c.key),
      materials: p.materials,
      material: p.material,
      footprint_p: p.footprint.p,
      footprint_l: p.footprint.l,
      footprint_t: p.footprint.t,
      frame: p.frame,
      cushion: p.cushion,
      stock_label: p.stock ?? null,
      stock_qty: p.stockQty,
      lead_time: p.leadTime,
      has_orientation: p.hasOrientation,
      seats: p.seats,
      featured: Boolean(p.featured),
      is_active: true,
      specs: p.specs,
      sort_order: i,
      created_at: new Date(Date.now() - p.daysOld * 86400000).toISOString(),
    })
  );
}

await supabase.auth.signOut();
console.log("\nSelesai. Semua foto produk sekarang memakai foto asli dari Supabase Storage.");
process.exit(0);

