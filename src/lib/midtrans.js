/**
 * Midtrans Payment Gateway Client
 * Mendukung Snap Popup (QRIS, GoPay, ShopeePay, Virtual Account Bank, Kartu Kredit).
 */

const RAW_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "SB-Mid-client-UyevMYjnqoZw125p";
// Pastikan prefix SB- terpasang jika di sandbox
const CLIENT_KEY = RAW_CLIENT_KEY.startsWith("Mid-") && !RAW_CLIENT_KEY.startsWith("SB-")
  ? `SB-${RAW_CLIENT_KEY}`
  : RAW_CLIENT_KEY;

const IS_PROD = import.meta.env.MIDTRANS_IS_PRODUCTION === "true" || (!CLIENT_KEY.startsWith("SB-") && !CLIENT_KEY.includes("sandbox"));
const SNAP_URL = IS_PROD
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

let snapScriptLoaded = false;
let snapScriptPromise = null;

/**
 * Memuat library Snap JS secara dinamis bila belum terpasang.
 */
export function loadSnapScript() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.snap) return Promise.resolve(window.snap);
  if (snapScriptLoaded && window.snap) return Promise.resolve(window.snap);
  if (snapScriptPromise) return snapScriptPromise;

  snapScriptPromise = new Promise((resolve, reject) => {
    // Cek apakah script sudah ada di DOM
    const existing = document.querySelector(`script[src*="snap/snap.js"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.snap));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = SNAP_URL;
    script.setAttribute("data-client-key", CLIENT_KEY);
    script.async = true;
    script.onload = () => {
      snapScriptLoaded = true;
      resolve(window.snap);
    };
    script.onerror = (err) => {
      snapScriptPromise = null;
      reject(new Error("Gagal memuat library Midtrans Snap. Periksa koneksi internet Anda."));
    };
    document.body.appendChild(script);
  });

  return snapScriptPromise;
}

/**
 * Meminta Snap Token transaksi dari backend proxy Vite.
 *
 * @param {object} payload
 * @param {string|number} payload.orderId
 * @param {number} payload.grossAmount
 * @param {object} payload.customer
 * @param {Array} payload.items
 * @param {string} [payload.paymentMethod]
 * @param {Array<string>} [payload.enabledPayments]
 * @returns {Promise<{token: string, redirect_url: string}>}
 */
export async function createSnapToken({ orderId, grossAmount, customer, items, paymentMethod, enabledPayments }) {
  const res = await fetch("/api/midtrans/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId,
      grossAmount,
      customer,
      items,
      paymentMethod,
      enabledPayments,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const msg =
      (Array.isArray(errData?.error_messages) && errData.error_messages.join(", ")) ||
      errData?.error ||
      errData?.message ||
      `Gagal membuat transaksi Midtrans (${res.status})`;
    throw new Error(msg);
  }

  return res.json();
}

/**
 * Membuka jendela popup pembayaran Midtrans Snap.
 *
 * @param {string} token Snap token dari createSnapToken
 * @param {object} callbacks
 * @param {(result: object) => void} callbacks.onSuccess
 * @param {(result: object) => void} callbacks.onPending
 * @param {(result: object) => void} callbacks.onError
 * @param {() => void} callbacks.onClose
 */
export async function payWithSnap(token, { onSuccess, onPending, onError, onClose } = {}) {
  const snap = await loadSnapScript();
  if (!snap) throw new Error("Midtrans Snap belum siap. Silakan muat ulang halaman.");

  snap.pay(token, {
    onSuccess: (result) => {
      if (onSuccess) onSuccess(result);
    },
    onPending: (result) => {
      if (onPending) onPending(result);
    },
    onError: (result) => {
      if (onError) onError(result);
    },
    onClose: () => {
      if (onClose) onClose();
    },
  });
}

/**
 * Mengecek status pembayaran langsung dari Midtrans API.
 *
 * @param {string} orderId Kode nomor pesanan (contoh: SKY-20261106-13347)
 * @returns {Promise<{isPaid: boolean, status: string, statusCode?: string, paymentType?: string, raw?: object, message?: string}|null>}
 */
export async function checkMidtransStatus(orderId) {
  if (!orderId) return null;
  try {
    const res = await fetch(`/api/midtrans/status?orderId=${encodeURIComponent(orderId)}`);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        isPaid: false,
        status: json.transaction_status || "not_found",
        statusCode: json.status_code || String(res.status),
        message: json.status_message || json.error || `HTTP ${res.status}`,
        raw: json,
      };
    }
    const st = json.transaction_status;
    const isPaid =
      st === "settlement" ||
      (st === "capture" && (json.fraud_status === "accept" || !json.fraud_status));

    return {
      isPaid,
      status: st || "pending",
      statusCode: json.status_code,
      paymentType: json.payment_type || "midtrans",
      settlementTime: json.settlement_time || json.transaction_time,
      grossAmount: json.gross_amount,
      message: json.status_message,
      raw: json,
    };
  } catch (e) {
    console.warn("Gagal cek status Midtrans:", e);
    return { isPaid: false, error: e.message };
  }
}

