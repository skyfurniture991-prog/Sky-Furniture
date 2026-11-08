/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  checkIsAdmin,
  deleteAdminProduct,
  fetchAdminOrders,
  fetchAdminProducts,
  isSupabaseConfigured,
  signInAdmin,
  signOutAdmin,
  supabase,
  supabaseAdmin,
  updateAdminOrderNotes,
  updateAdminOrderPayment,
  updateAdminOrderStatus,
  updateAdminOrderTracking,
  upsertAdminProduct,
} from "../lib/supabase";
import { CATEGORIES, COLOR_LIST, MATERIALS, PRODUCTS, REVIEW_POOL } from "../data/products";
import { FAQS, HERO_DATA, PROCESS_STEPS, PROMO_CODES, SHIPPING_METHODS, TRUST_ITEMS, WHY_US } from "../data/store";
import { useToast } from "./ToastContext";

const AdminContext = createContext(null);

// Data lokal dipakai sebagai cadangan bila layanan database belum tersambung.
const LOCAL_STORAGE_KEY = "sky.admin.local_state.v1";
const LEGACY_LOCAL_STORAGE_KEY = "sky.admin.demo_state.v1";

function getInitialLocalData() {
  let parsed = null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem(LEGACY_LOCAL_STORAGE_KEY);
    if (raw) parsed = JSON.parse(raw);
  } catch (err) {
    console.error("Gagal membaca data admin lokal:", err);
  }

  // Ambil pesanan yang mungkin sudah dibuat di storefront localStorage
  let initialOrders = [];
  try {
    const localOrders = localStorage.getItem("sky.orders.v1");
    if (localOrders) initialOrders = JSON.parse(localOrders);
  } catch {
    // ignore
  }

  const existingOrders = parsed?.orders?.length ? parsed.orders : initialOrders;
  // Perbarui status pesanan lama yang sudah dibayar agar tidak lagi berstatus "Menunggu"
  const cleanedOrders = existingOrders.map((o) => {
    if (o.paymentStatus === "pending" || o.payment_status === "pending") {
      return {
        ...o,
        paymentStatus: "paid",
        payment_status: "paid",
        status: o.status === "received" ? "paid" : o.status,
      };
    }
    return o;
  });

  if (parsed) {
    parsed.orders = cleanedOrders;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
      localStorage.setItem("sky.orders.v1", JSON.stringify(cleanedOrders));
    } catch {}
    return parsed;
  }

  return {
    orders: cleanedOrders,
    products: PRODUCTS.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category_id: p.category,
      subtitle: p.subtitle || "",
      description: p.description || "",
      about: p.about || "",
      image: p.image || "",
      gallery: p.gallery || [],
      badge_text: p.badge?.text || null,
      badge_style: p.badge?.color ? "primary" : "primary",
      rating: p.rating || 5,
      review_count: p.reviewCount || 0,
      sold_count: p.soldCount || 0,
      original_price: p.originalPrice || 0,
      price: p.price || 0,
      colors: (p.colors || []).map((c) => (typeof c === "string" ? c : c.key)),
      materials: p.materials || [],
      material: p.material || "Kanvas Linen",
      footprint_p: p.footprint?.p || 100,
      footprint_l: p.footprint?.l || 80,
      footprint_t: p.footprint?.t || 80,
      frame: p.frame || "Kayu Mahoni Solid",
      cushion: p.cushion || "Busa Royal D24",
      stock_label: p.stockLabel || "Ready Rangka",
      stock_qty: p.stockQty ?? 12,
      lead_time: p.leadTime || "Jahit 3 hari",
      has_orientation: Boolean(p.hasOrientation),
      seats: p.seats || null,
      featured: Boolean(p.featured),
      is_active: true,
      specs: p.specs || [],
      sort_order: 0,
    })),
    orders: initialOrders,
    categories: CATEGORIES.map((c, i) => ({ ...c, sort_order: i, is_active: true })),
    materials: MATERIALS.map((m, i) => ({ ...m, sort_order: i })),
    colors: COLOR_LIST.map((c, i) => ({ ...c, sort_order: i })),
    reviews: REVIEW_POOL.map((r, i) => ({
      id: i + 1,
      name: r.name,
      city: r.city,
      rating: r.rating,
      comment: r.comment,
      is_approved: true,
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
    })),
    faqs: FAQS.map((f, i) => ({ id: i + 1, question: f.q, answer: f.a, sort_order: i, is_active: true })),
    trustItems: TRUST_ITEMS.map((t, i) => ({ id: i + 1, icon: t.icon, text: t.text, sort_order: i, is_active: true })),
    whyUs: WHY_US.map((w, i) => ({ id: i + 1, icon: w.icon, title: w.title, description: w.description, style: "primary", sort_order: i, is_active: true })),
    processSteps: PROCESS_STEPS.map((s, i) => ({ id: i + 1, icon: s.icon, title: s.title, description: s.desc, sort_order: i, is_active: true })),
    promos: Object.values(PROMO_CODES).map((p) => ({ ...p, is_active: true })),
    shippingMethods: SHIPPING_METHODS.map((s, i) => ({ ...s, sort_order: i, is_active: true })),
    settings: {
      store_name: "Sky Furniture",
      whatsapp: "6281123456789",
      free_shipping_threshold: 3000000,
      tax_rate: 0.11,
      hero: HERO_DATA,
    },
  };
}

export function AdminProvider({ children }) {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  // Data state
  const [localData, setLocalData] = useState(getInitialLocalData);
  const [dbOrders, setDbOrders] = useState([]);
  const [dbProducts, setDbProducts] = useState([]);

  const persistLocalData = useCallback((updater) => {
    setLocalData((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.error("Gagal menyimpan data admin lokal:", err);
      }
      return next;
    });
  }, []);

  // Muat data pesanan & produk saat sesi aktif
  const loadDbData = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const [ords, prods] = await Promise.all([
        fetchAdminOrders().catch((e) => {
          console.warn("Gagal memuat pesanan:", e);
          return [];
        }),
        fetchAdminProducts().catch((e) => {
          console.warn("Gagal memuat produk:", e);
          return [];
        }),
      ]);

      const cleanedDbOrders = (ords || []).map((o) => {
        const isCancelled = o.status === "cancelled";
        const isFailed = o.payment_status === "failed";
        const isRefunded = o.payment_status === "refunded";
        const isPaid = !isCancelled && !isFailed && !isRefunded;

        if (isPaid && o.payment_status !== "paid") {
          // Sinkronkan ke database Supabase agar status pembayaran tersimpan permanen sebagai paid
          updateAdminOrderPayment(o.id || o.code, "paid").catch(() => {});
        }

        return {
          ...o,
          payment_status: isPaid ? "paid" : o.payment_status,
          paymentStatus: isPaid ? "paid" : o.payment_status,
          status: (o.status === "received" && isPaid) ? "paid" : o.status,
        };
      });

      setDbOrders(cleanedDbOrders);
      setDbProducts(prods);
    } catch (err) {
      console.error("Gagal memuat data admin:", err);
    }
  }, []);

  // Inisialisasi Sesi Admin
  useEffect(() => {
    let mounted = true;
    const client = supabaseAdmin || supabase;

    async function initAuth() {
      if (isSupabaseConfigured && client) {
        try {
          const { data: { session: currentSession } } = await client.auth.getSession();
          if (currentSession) {
            const isAdmin = await checkIsAdmin();
            if (isAdmin && mounted) {
              setSession(currentSession);
              setAdminUser(currentSession.user);
              await loadDbData();
            }
          }
        } catch (err) {
          console.warn("Gagal memeriksa sesi admin:", err);
        }
      }

      if (mounted) setLoading(false);
    }

    initAuth();

    let authSub = null;
    if (isSupabaseConfigured && client) {
      const { data } = client.auth.onAuthStateChange(async (event, newSession) => {
        if (!mounted) return;
        if (event === "SIGNED_IN" && newSession) {
          const isAdmin = await checkIsAdmin();
          if (isAdmin) {
            setSession(newSession);
            setAdminUser(newSession.user);
            await loadDbData();
          }
        } else if (event === "SIGNED_OUT") {
          setSession(null);
          setAdminUser(null);
        }
      });
      authSub = data?.subscription;
    }

    return () => {
      mounted = false;
      authSub?.unsubscribe?.();
    };
  }, [loadDbData]);

  // Auth actions
  const login = useCallback(
    async (email, password) => {
      if (!isSupabaseConfigured) {
        throw new Error("Layanan data belum dikonfigurasi. Hubungi pengembang aplikasi.");
      }
      setLoading(true);
      try {
        const data = await signInAdmin(email, password);
        setSession(data.session);
        setAdminUser(data.user);
        await loadDbData();
        toast.success("Login Berhasil", `Selamat datang kembali, ${data.user.email}`);
        return true;
      } catch (err) {
        toast.error("Gagal Login", err.message || "Email atau password salah.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadDbData, toast]
  );

  const logout = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      await signOutAdmin();
    }
    setSession(null);
    setAdminUser(null);
    toast.info("Logout Berhasil", "Sesi admin telah diakhiri.");
  }, [toast]);

  /* ------------------------------------------------------------------
   * MANAJEMEN PESANAN
   * ---------------------------------------------------------------- */
  const orders = useMemo(() => {
    const list = isSupabaseConfigured && dbOrders.length > 0 ? dbOrders : localData.orders;
    return list.map((o) => {
      const isCancelled = o.status === "cancelled";
      const isFailed = o.payment_status === "failed" || o.paymentStatus === "failed";
      const isRefunded = o.payment_status === "refunded" || o.paymentStatus === "refunded";
      const isPaid = !isCancelled && !isFailed && !isRefunded;

      return {
        ...o,
        payment_status: isPaid ? "paid" : (o.payment_status || "paid"),
        paymentStatus: isPaid ? "paid" : (o.paymentStatus || "paid"),
        status: (o.status === "received" && isPaid) ? "paid" : o.status,
      };
    });
  }, [dbOrders, localData.orders]);

  const updateOrderStatus = useCallback(
    async (orderId, newStatus, statusNote = "") => {
      // Selalu update localData & localStorage agar UI instan merespons
      persistLocalData((prev) => {
        const nextOrders = prev.orders.map((o) => {
          if (o.id === orderId || o.uuid === orderId || o.code === orderId) {
            const hist = o.history || [];
            return {
              ...o,
              status: newStatus,
              history: [
                ...hist,
                { status: newStatus, note: statusNote || "Diperbarui oleh Admin", at: Date.now() },
              ],
            };
          }
          return o;
        });

        try {
          localStorage.setItem("sky.orders.v1", JSON.stringify(nextOrders));
        } catch {}

        return { ...prev, orders: nextOrders };
      });

      if (isSupabaseConfigured) {
        try {
          await updateAdminOrderStatus(orderId, newStatus, statusNote);
          await loadDbData();
        } catch (err) {
          console.warn("Gagal update status di server database:", err);
        }
      }

      toast.success("Status Pesanan Diperbarui", `Status diubah ke: ${newStatus}`);
    },
    [loadDbData, persistLocalData, toast]
  );

  const updateOrderPayment = useCallback(
    async (orderId, paymentStatus) => {
      // Selalu update localData & localStorage agar UI instan merespons
      persistLocalData((prev) => {
        const nextOrders = prev.orders.map((o) =>
          o.id === orderId || o.uuid === orderId || o.code === orderId
            ? { ...o, paymentStatus, payment_status: paymentStatus, status: paymentStatus === "paid" ? "paid" : o.status }
            : o
        );
        try {
          localStorage.setItem("sky.orders.v1", JSON.stringify(nextOrders));
        } catch {}
        return { ...prev, orders: nextOrders };
      });

      if (isSupabaseConfigured) {
        try {
          await updateAdminOrderPayment(orderId, paymentStatus);
          await loadDbData();
        } catch (err) {
          console.warn("Gagal update pembayaran di server database:", err);
        }
      }

      toast.success("Status Pembayaran Diperbarui", `Diubah ke: ${paymentStatus === "paid" ? "Lunas" : paymentStatus}`);
    },
    [loadDbData, persistLocalData, toast]
  );

  const updateOrderTracking = useCallback(
    async (orderId, trackingNumber) => {
      if (isSupabaseConfigured) {
        try {
          await updateAdminOrderTracking(orderId, trackingNumber);
          toast.success("Nomor Resi Disimpan", `Resi: ${trackingNumber}`);
          await loadDbData();
          return;
        } catch (err) {
          toast.error("Gagal Simpan Resi", err.message);
          throw err;
        }
      }

      persistLocalData((prev) => {
        const nextOrders = prev.orders.map((o) =>
          o.id === orderId || o.uuid === orderId
            ? { ...o, trackingNumber, tracking_number: trackingNumber }
            : o
        );
        try {
          localStorage.setItem("sky.orders.v1", JSON.stringify(nextOrders));
        } catch {
          // ignore
        }
        return { ...prev, orders: nextOrders };
      });
      toast.success("Nomor Resi Disimpan", `Resi: ${trackingNumber}`);
    },
    [loadDbData, persistLocalData, toast]
  );

  const updateOrderNotes = useCallback(
    async (orderId, adminNotes) => {
      if (isSupabaseConfigured) {
        try {
          await updateAdminOrderNotes(orderId, adminNotes);
          toast.success("Catatan Disimpan");
          await loadDbData();
          return;
        } catch (err) {
          toast.error("Gagal Simpan Catatan", err.message);
          throw err;
        }
      }

      persistLocalData((prev) => {
        const nextOrders = prev.orders.map((o) =>
          o.id === orderId || o.uuid === orderId ? { ...o, adminNotes, admin_notes: adminNotes } : o
        );
        return { ...prev, orders: nextOrders };
      });
      toast.success("Catatan Admin Disimpan");
    },
    [loadDbData, persistLocalData, toast]
  );

  /* ------------------------------------------------------------------
   * MANAJEMEN PRODUK
   * ---------------------------------------------------------------- */
  const products = useMemo(() => {
    if (isSupabaseConfigured && dbProducts.length > 0) {
      return dbProducts;
    }
    return localData.products;
  }, [dbProducts, localData.products]);

  const saveProduct = useCallback(
    async (productData) => {
      if (isSupabaseConfigured) {
        try {
          await upsertAdminProduct(productData);
          toast.success("Produk Disimpan", `${productData.name} berhasil diperbarui di database.`);
          await loadDbData();
          return;
        } catch (err) {
          toast.error("Gagal Menyimpan Produk", err.message);
          throw err;
        }
      }

      persistLocalData((prev) => {
        const exists = prev.products.some((p) => p.id === productData.id);
        const nextProds = exists
          ? prev.products.map((p) => (p.id === productData.id ? { ...p, ...productData } : p))
          : [{ ...productData, id: productData.id || Date.now() }, ...prev.products];
        return { ...prev, products: nextProds };
      });
      toast.success("Produk Disimpan", `${productData.name} berhasil disimpan.`);
    },
    [loadDbData, persistLocalData, toast]
  );

  const deleteProduct = useCallback(
    async (productId) => {
      if (isSupabaseConfigured) {
        try {
          await deleteAdminProduct(productId);
          toast.success("Produk Dihapus", "Produk telah dihapus dari katalog.");
          await loadDbData();
          return;
        } catch (err) {
          toast.error("Gagal Menghapus Produk", err.message);
          throw err;
        }
      }

      persistLocalData((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p.id !== productId),
      }));
      toast.success("Produk Dihapus");
    },
    [loadDbData, persistLocalData, toast]
  );

  /* ------------------------------------------------------------------
   * MANAJEMEN KATEGORI, KONTEN, ULASAN
   * ---------------------------------------------------------------- */
  const saveCategory = useCallback(
    (cat) => {
      persistLocalData((prev) => {
        const exists = prev.categories.some((c) => c.id === cat.id);
        const next = exists
          ? prev.categories.map((c) => (c.id === cat.id ? { ...c, ...cat } : c))
          : [...prev.categories, cat];
        return { ...prev, categories: next };
      });
      toast.success("Kategori Disimpan", cat.name);
    },
    [persistLocalData, toast]
  );

  const deleteCategory = useCallback(
    (catId) => {
      persistLocalData((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c.id !== catId),
      }));
      toast.success("Kategori Dihapus");
    },
    [persistLocalData, toast]
  );

  const saveFaq = useCallback(
    (faq) => {
      persistLocalData((prev) => {
        const exists = prev.faqs.some((f) => f.id === faq.id);
        const next = exists
          ? prev.faqs.map((f) => (f.id === faq.id ? { ...f, ...faq } : f))
          : [...prev.faqs, { ...faq, id: Date.now() }];
        return { ...prev, faqs: next };
      });
      toast.success("FAQ Disimpan");
    },
    [persistLocalData, toast]
  );

  const deleteFaq = useCallback(
    (id) => {
      persistLocalData((prev) => ({
        ...prev,
        faqs: prev.faqs.filter((f) => f.id !== id),
      }));
      toast.success("FAQ Dihapus");
    },
    [persistLocalData, toast]
  );

  const toggleReviewApproval = useCallback(
    (id) => {
      persistLocalData((prev) => ({
        ...prev,
        reviews: prev.reviews.map((r) => (r.id === id ? { ...r, is_approved: !r.is_approved } : r)),
      }));
      toast.success("Status Ulasan Diperbarui");
    },
    [persistLocalData, toast]
  );

  const deleteReview = useCallback(
    (id) => {
      persistLocalData((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((r) => r.id !== id),
      }));
      toast.success("Ulasan Dihapus");
    },
    [persistLocalData, toast]
  );

  const resetLocalData = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LEGACY_LOCAL_STORAGE_KEY);
    setLocalData(getInitialLocalData());
    toast.info("Data Direset", "Data lokal telah dikembalikan ke pengaturan awal.");
  }, [toast]);

  const value = useMemo(
    () => ({
      // Auth
      loading,
      session,
      adminUser,
      isAuthenticated: Boolean(adminUser),
      login,
      logout,

      // Orders
      orders,
      updateOrderStatus,
      updateOrderPayment,
      updateOrderTracking,
      updateOrderNotes,
      refreshOrders: loadDbData,

      // Products
      products,
      saveProduct,
      deleteProduct,
      refreshProducts: loadDbData,

      // Taxonomy & Content
      categories: localData.categories,
      saveCategory,
      deleteCategory,
      materials: localData.materials,
      colors: localData.colors,
      reviews: localData.reviews,
      toggleReviewApproval,
      deleteReview,
      faqs: localData.faqs,
      saveFaq,
      deleteFaq,
      trustItems: localData.trustItems,
      whyUs: localData.whyUs,
      processSteps: localData.processSteps,
      promos: localData.promos,
      shippingMethods: localData.shippingMethods,
      settings: localData.settings,
      resetLocalData,
    }),
    [
      loading,
      session,
      adminUser,
      login,
      logout,
      orders,
      updateOrderStatus,
      updateOrderPayment,
      updateOrderTracking,
      updateOrderNotes,
      loadDbData,
      products,
      saveProduct,
      deleteProduct,
      localData,
      saveCategory,
      deleteCategory,
      toggleReviewApproval,
      deleteReview,
      saveFaq,
      deleteFaq,
      resetLocalData,
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
