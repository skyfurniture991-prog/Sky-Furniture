import { createClient } from "@supabase/supabase-js";

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Bersihkan URL jika user menyalin URL REST API (berisi /rest/v1/) atau ada spasi/trailing slash
const url = rawUrl
  ? rawUrl.trim().replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "")
  : "";
const anonKey = rawAnonKey ? rawAnonKey.trim() : "";

/** false bila kredensial belum diisi: storefront memakai data statis bawaan. */
export const isSupabaseConfigured = Boolean(url && anonKey);

// Migrasi satu kali jika ada sesi admin lama di sky.auth.session
if (typeof window !== "undefined") {
  try {
    const oldSession = localStorage.getItem("sky.auth.session");
    if (oldSession && !localStorage.getItem("sky.auth.admin")) {
      const parsed = JSON.parse(oldSession);
      if (parsed?.user?.email === "admin@skyfurniture.id" || parsed?.user?.app_metadata?.provider === "email") {
        localStorage.setItem("sky.auth.admin", oldSession);
      }
    }
  } catch {}
}

/** Client Supabase untuk Pembeli / Storefront (Google Login) */
export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: "sky.auth.customer" },
    })
  : null;

/** Client Supabase terpisah khusus Administrator Toko (Email & Password) */
export const supabaseAdmin = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: "sky.auth.admin" },
    })
  : null;

/** Mengubah error layanan data menjadi pesan yang mudah dibaca. */
export const errorMessage = (error) => {
  if (!error) return "";
  const msg = error.message || String(error);
  if (/Failed to fetch|NetworkError/i.test(msg)) return "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
  if (/Invalid login credentials/i.test(msg)) return "Email atau kata sandi salah.";
  if (/Email not confirmed/i.test(msg)) return "Email belum diverifikasi. Hubungi pengembang aplikasi.";
  if (/rate limit|Too many requests/i.test(msg)) return "Terlalu banyak percobaan. Coba lagi beberapa saat.";
  return msg;
};

/** Mengunggah gambar ke bucket "media" dan mengembalikan URL publiknya. */
export async function uploadImage(file, folder = "umum") {
  if (!supabase) throw new Error("Layanan penyimpanan belum tersedia.");
  if (!file.type.startsWith("image/")) throw new Error("File harus berupa gambar.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Ukuran gambar maksimal 5 MB.");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || "jpg"}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
  });
  if (error) throw error;
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

/* ---------------------------------------------------------------------
 * ADMIN AUTH & CHECKS
 * ------------------------------------------------------------------- */

const adminClient = () => supabaseAdmin || supabase;

export async function signInAdmin(email, password) {
  const client = adminClient();
  if (!client) throw new Error("Layanan data belum dikonfigurasi.");
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error(errorMessage(error));

  // Verifikasi role admin di database
  const { data: isAdmin, error: adminErr } = await client.rpc("is_admin");
  if (adminErr || !isAdmin) {
    await client.auth.signOut();
    throw new Error("Akun ini tidak memiliki akses administrator.");
  }
  return data;
}

export async function signOutAdmin() {
  const client = adminClient();
  if (!client) return;
  await client.auth.signOut();
}

export async function checkIsAdmin() {
  const client = adminClient();
  if (!client) return false;
  try {
    const { data: { session } } = await client.auth.getSession();
    if (!session) return false;
    const { data: isAdmin, error } = await client.rpc("is_admin");
    return !error && Boolean(isAdmin);
  } catch {
    return false;
  }
}

/* ---------------------------------------------------------------------
 * ORDER MANAGEMENT HELPERS (ADMIN)
 * ------------------------------------------------------------------- */

export async function fetchAdminOrders() {
  const client = adminClient();
  if (!client) return [];
  const { data, error } = await client
    .from("orders")
    .select(`
      *,
      items:order_items(*),
      history:order_status_history(*)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateAdminOrderStatus(orderId, newStatus, statusNote = "") {
  const client = adminClient();
  if (!client) throw new Error("Layanan data belum dikonfigurasi.");
  const payload = {
    status: newStatus,
    status_note: statusNote || null,
  };
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
  const filterCol = isUuid ? "id" : "code";

  const { data, error } = await client
    .from("orders")
    .update(payload)
    .eq(filterCol, orderId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateAdminOrderPayment(orderId, paymentStatus) {
  const client = adminClient();
  if (!client) throw new Error("Layanan data belum dikonfigurasi.");
  const isPaid = paymentStatus === "paid";
  const payload = {
    payment_status: paymentStatus,
    ...(isPaid ? { status: "paid", paid_at: new Date().toISOString() } : {}),
  };

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
  const filterCol = isUuid ? "id" : "code";

  const { data, error } = await client
    .from("orders")
    .update(payload)
    .eq(filterCol, orderId)
    .select()
    .maybeSingle();

  if (error && isPaid) {
    try {
      const rpcRes = await client.rpc("mark_order_paid", { p_code: String(orderId) });
      if (!rpcRes.error) {
        return { id: orderId, code: orderId, payment_status: "paid", status: "paid" };
      }
    } catch {}
  }

  if (error) throw error;
  return data;
}

export async function updateAdminOrderTracking(orderId, trackingNumber) {
  const client = adminClient();
  if (!client) throw new Error("Layanan data belum dikonfigurasi.");
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
  const filterCol = isUuid ? "id" : "code";

  const { data, error } = await client
    .from("orders")
    .update({ tracking_number: trackingNumber || null })
    .eq(filterCol, orderId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateAdminOrderNotes(orderId, adminNotes) {
  const client = adminClient();
  if (!client) throw new Error("Layanan data belum dikonfigurasi.");
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
  const filterCol = isUuid ? "id" : "code";

  const { data, error } = await client
    .from("orders")
    .update({ admin_notes: adminNotes })
    .eq(filterCol, orderId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

/* ---------------------------------------------------------------------
 * PRODUCT & CONTENT MANAGEMENT HELPERS (ADMIN)
 * ------------------------------------------------------------------- */

export async function fetchAdminProducts() {
  const client = adminClient();
  if (!client) return [];
  const { data, error } = await client
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function upsertAdminProduct(productData) {
  const client = adminClient();
  if (!client) throw new Error("Layanan data belum dikonfigurasi.");
  const { data, error } = await client
    .from("products")
    .upsert(productData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAdminProduct(productId) {
  const client = adminClient();
  if (!client) throw new Error("Layanan data belum dikonfigurasi.");
  const { error } = await client
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) throw error;
  return true;
}
