/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ORDER_STAGES } from "../data/store";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const OrdersContext = createContext(null);

const makeOrderId = () => {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `SKY-${ymd}-${Math.floor(10000 + Math.random() * 90000)}`;
};

export const STAGE_INTERVAL_MS = 60 * 1000;

export const orderStageIndex = (order, now = Date.now()) => {
  if (order.status) {
    const idx = ORDER_STAGES.findIndex((s) => s.id === order.status);
    if (idx !== -1) return idx;
  }
  return Math.min(ORDER_STAGES.length - 1, Math.floor((now - (order.createdAt || Date.now())) / STAGE_INTERVAL_MS));
};

export function dbToStoreOrder(db) {
  return {
    id: db.code || db.id,
    dbId: db.id,
    code: db.code,
    status: db.status,
    statusNote: db.status_note || "",
    payment_status: db.payment_status,
    createdAt: db.created_at ? new Date(db.created_at).getTime() : Date.now(),
    trackingNumber: db.tracking_number || null,
    history: db.history || [],
    customer: {
      name: db.customer_name || "",
      phone: db.customer_phone || "",
      email: db.customer_email || "",
      address: db.address || "",
      city: db.city || "",
      district: db.district || "",
      province: db.province || "",
      postalCode: db.postal_code || "",
      notes: db.customer_notes || "",
      workshopNotes: db.workshop_notes || "",
    },
    shipping: {
      id: db.shipping_id || "direct",
      name: db.shipping_name || "Sky Direct",
      fee: db.shipping_fee || 0,
      eta: db.shipping_eta || null,
      trackingNumber: db.tracking_number || null,
    },
    payment: {
      id: db.payment_id || "bca",
      name: db.payment_name || "BCA Virtual Account",
    },
    totals: {
      subtotal: db.subtotal || 0,
      discount: db.discount || 0,
      shipping: db.shipping_fee || 0,
      tax: db.tax || 0,
      total: db.total || 0,
    },
    bonusItems: db.bonus_items || db.bonusItems || [],
    items: (db.items || []).map((it) => ({
      productId: it.product_id,
      name: it.name,
      image: it.image,
      qty: it.qty,
      unit: it.unit,
      total: it.total,
      options: it.options || [],
    })),
  };
}

export function OrdersProvider({ children }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Muat pesanan milik akun yang sedang login (atau guest)
  useEffect(() => {
    let mounted = true;

    async function loadUserOrders() {
      setLoadingOrders(true);
      try {
        if (!user) {
          // Mode tamu (belum login): baca dari cache guest / lokal
          const raw = localStorage.getItem("sky.orders.guest") || localStorage.getItem("sky.orders.v1");
          if (raw && mounted) {
            try {
              setOrders(JSON.parse(raw));
            } catch {
              setOrders([]);
            }
          } else if (mounted) {
            setOrders([]);
          }
          return;
        }

        let remoteOrders = null;

        // Ambil pesanan dari Supabase yang milik user ini
        if (isSupabaseConfigured && supabase && user.email) {
          try {
            const { data, error } = await supabase
              .from("orders")
              .select(`
                *,
                items:order_items(*),
                history:order_status_history(*)
              `)
              .eq("customer_email", user.email)
              .order("created_at", { ascending: false });

            if (!error && Array.isArray(data) && data.length > 0) {
              remoteOrders = data.map(dbToStoreOrder);
            }
          } catch (err) {
            console.warn("Gagal memuat pesanan user dari server:", err);
          }
        }

        if (remoteOrders && mounted) {
          setOrders(remoteOrders);
          try {
            localStorage.setItem(`sky.orders.${user.id}`, JSON.stringify(remoteOrders));
          } catch {}
        } else if (mounted) {
          // Fallback ke penyimpanan lokal
          const raw =
            localStorage.getItem(`sky.orders.${user.id}`) ||
            localStorage.getItem("sky.orders.v1") ||
            localStorage.getItem("sky.orders.guest");
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              setOrders(Array.isArray(parsed) ? parsed : []);
            } catch {
              setOrders([]);
            }
          } else {
            setOrders([]);
          }
        }
      } catch (e) {
        console.warn("Kesalahan proses sinkronisasi pesanan:", e);
      } finally {
        if (mounted) setLoadingOrders(false);
      }
    }

    loadUserOrders();
    return () => {
      mounted = false;
    };
  }, [user]);

  const createOrder = useCallback(
    async (payload) => {
      const storageKey = user ? `sky.orders.${user.id}` : "sky.orders.guest";

      // Jika Supabase aktif, simpan melalui RPC place_order
      if (isSupabaseConfigured && supabase) {
        try {
          const knownPaymentIds = ["bca", "mandiri", "bni", "bri", "manual", "gopay", "shopeepay", "ovo", "cod", "cicilan"];
          const rawPayId = payload.payment?.id || "bca";
          const safePaymentId = knownPaymentIds.includes(rawPayId) ? rawPayId : "bca";

          const rpcPayload = {
            userId: user?.id || null,
            code: payload.code || payload.id || null,
            items: (payload.items || []).map((i) => ({
              productId: i.productId,
              qty: i.qty,
              unit: i.unit,
              material: i.options?.find((o) => typeof o === "string" && o.includes("Kanvas|Velvet|Beludru|Boucle|Oscar")) || null,
              options: i.options || [],
            })),
            customer: payload.customer || {},
            shippingId: payload.shipping?.id || "direct",
            paymentId: safePaymentId,
            paymentLabel: payload.payment?.name || "BCA Virtual Account",
            promoCode: payload.promoCode || null,
          };

          const { data, error } = await supabase.rpc("place_order", { p_payload: rpcPayload });
          if (!error && data) {
            const dbOrder = { ...payload, ...data, id: data.id || data.code };
            if (payload.status === "paid") {
              await supabase
                .from("orders")
                .update({ payment_status: "paid", status: "paid", paid_at: new Date().toISOString() })
                .eq("code", dbOrder.code || dbOrder.id);
            }
            setOrders((prev) => {
              const next = [dbOrder, ...prev];
              try {
                localStorage.setItem(storageKey, JSON.stringify(next));
              } catch {}
              return next;
            });
            return dbOrder;
          } else if (error) {
            console.warn("RPC place_order gagal, mencoba direct insert:", error);
          }
        } catch (err) {
          console.warn("Gagal menyimpan pesanan ke server, beralih ke penyimpanan lokal:", err);
        }
      }

      // Fallback lokal
      const localOrder = { id: makeOrderId(), createdAt: Date.now(), status: "received", ...payload };
      setOrders((prev) => {
        const next = [localOrder, ...prev];
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {}
        return next;
      });
      return localOrder;
    },
    [user]
  );

  const getOrder = useCallback(
    (id) => {
      if (!id) return null;
      const target = String(id).trim().toLowerCase();

      // 1. Cek dari state memori orders
      const fromState = orders.find((o) => (o.id || o.code || "").toLowerCase() === target);
      if (fromState) return fromState;

      // 2. Cek di cache local storage
      try {
        const keys = [user ? `sky.orders.${user.id}` : null, "sky.orders.v1", "sky.orders.guest"].filter(Boolean);
        for (const k of keys) {
          const raw = localStorage.getItem(k);
          if (raw) {
            const list = JSON.parse(raw);
            const found = (Array.isArray(list) ? list : []).find(
              (o) => (o.id || o.code || "").toLowerCase() === target
            );
            if (found) return found;
          }
        }
      } catch {}

      return null;
    },
    [orders, user]
  );

  const markOrderPaid = useCallback(
    async (orderId) => {
      setOrders((prev) => {
        const next = prev.map((o) =>
          o.id === orderId || o.code === orderId
            ? { ...o, status: "paid", payment_status: "paid", paidAt: new Date().toISOString() }
            : o
        );
        const storageKey = user ? `sky.orders.${user.id}` : "sky.orders.guest";
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {}
        return next;
      });

      if (isSupabaseConfigured && supabase) {
        try {
          const filter = isNaN(Number(orderId)) ? `code.eq.${orderId}` : `id.eq.${orderId}`;
          await supabase
            .from("orders")
            .update({ payment_status: "paid", status: "paid" })
            .or(filter);
        } catch (e) {
          console.warn("Gagal update status pembayaran di server:", e);
        }
      }
    },
    [user]
  );

  const value = useMemo(
    () => ({ orders, loadingOrders, createOrder, getOrder, markOrderPaid }),
    [orders, loadingOrders, createOrder, getOrder, markOrderPaid]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within an OrdersProvider");
  return ctx;
}
