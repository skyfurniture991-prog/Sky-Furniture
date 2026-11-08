import { buildSkyBotSystemPrompt } from "../data/aiKnowledge";
import { PRODUCTS } from "../data/products";
import { formatPrice } from "./format";
import { waLink } from "../data/store";

// Endpoints: Pertama lewat Vite Proxy (/api/deploy) untuk menghindari CORS browser,
// lalu fallback ke direct URL jika diakses dari non-proxy.
const DEPLOY_ENDPOINTS = [
  { url: "/api/deploy/api/v1/chat/completions", model: "deepseek-ai/deepseek-v4.1-flash-1017" },
  { url: "https://api-cdn.deploy.com/api/v1/chat/completions", model: "deepseek-ai/deepseek-v4.1-flash-1017" },
  { url: "https://api.deploy.com/api/v1/chat/completions", model: "deepseek-ai/deepseek-v4.1-flash-1017" },
  { url: "https://api.deepseek.com/chat/completions", model: "deepseek-chat" },
];

/**
 * Mengirim pesan percakapan ke DeepSeek AI (via Deploy Portal / DeepSeek).
 * Bila koneksi gagal atau kuota habis, otomatis beralih ke Fallback Asisten Cerdas lokal
 * agar chatbot tetap interaktif dan membantu pengguna.
 *
 * @param {Array<{role: "user"|"assistant"|"system", content: string}>} messages
 * @param {string} [customApiKey]
 * @returns {Promise<{text: string, isFallback?: boolean, notice?: string}>}
 */
export async function sendChatMessage(messages, customApiKey = "") {
  const envKey = (import.meta.env.VITE_DEEPSEEK_API_KEY || "").trim();
  const apiKey = (customApiKey || envKey).trim();
  const systemPrompt = buildSkyBotSystemPrompt();

  const fullMessages = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  // 1. Coba panggil Serverless API /api/chat (Bebas CORS di Vercel & Vite)
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: fullMessages,
        max_tokens: 1000,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const text = data?.text || "";
      if (text) {
        return { text, isFallback: false };
      }
    }
  } catch (err) {
    console.warn("Gagal menghubungi /api/chat:", err);
  }

  // 2. Fallback direct target jika diakses di luar browser/proxy
  if (apiKey) {
    for (const target of DEPLOY_ENDPOINTS) {
      try {
        const payload = {
          model: target.model,
          messages: fullMessages,
          temperature: 0.6,
          max_tokens: 1000,
        };

        const res = await fetch(target.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          const text =
            data?.choices?.[0]?.message?.content ||
            data?.choices?.[0]?.message?.reasoning_content ||
            "";
          if (text) return { text, isFallback: false };
        }
      } catch (err) {
        console.warn(`Gagal memanggil ${target.url}:`, err);
      }
    }
  }

  // 3. Fallback cerdas katalog lokal jika offline/kuota habis
  return generateSmartFallback(
    messages,
    !apiKey ? "API Key belum dikonfigurasi. Berjalan dengan basis data lokal Sky Furniture." : undefined
  );
}

/**
 * Asisten cerdas cadangan berbasis data katalog lokal.
 * Menjamin respons instan, akurat, dan tidak pernah gagal.
 */
function generateSmartFallback(messages, notice = "") {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content?.toLowerCase() || "";

  let reply = "";

  if (/ongkir|kirim|ekspedisi|kargo|daerah|lokasi|antar/i.test(lastUserMsg)) {
    reply = `🚚 **Informasi Pengiriman Sky Furniture:**
- **GRATIS ONGKIR** untuk seluruh wilayah **Sumatera Selatan** dengan minimal belanja Rp 3.000.000!
- Pilihan armada: **Armada Toko Langsung** (khusus Palembang & Banyuasin, diantar & dirakit langsung oleh tim toko), Express Delivery (1-2 hari kerja), dan Kargo Darat Antar Kabupaten se-Sumsel.
- Rangka kayu kami selalu ready di workshop Palembang, proses penjahitan cover sofa hanya memerlukan **3 hari kerja**.`;
  } else if (/garansi|rusak|patah|kualitas|awet/i.test(lastUserMsg)) {
    reply = `🛡️ **Garansi Resmi Workshop Sky Furniture:**
- Setiap sofa mendapatkan **Garansi Resmi 5 Tahun** untuk rangka kayu Mahoni oven dan struktur per pegas (*S-Spring*).
- Kami menggunakan kayu Mahoni solid oven (*Kiln-Dried*) anti rayap, serta lapisan dasar busa Rebounded D24 dipadu busa Royal D24/D30 yang tahan kempes bertahun-tahun.`;
  } else if (/promo|diskon|voucher|potongan|kupon/i.test(lastUserMsg)) {
    reply = `🎁 **Kode Promo Hari Ini:**
Gunakan kode voucher **\`SKYBIRU\`** saat checkout untuk mendapatkan **Diskon 10%** (maksimal potongan Rp 300.000 dengan minimal belanja Rp 2.000.000). Masukkan kodenya di halaman Keranjang atau Checkout ya!`;
  } else if (/custom|ukuran|warna|orientasi|kiri|kanan|kain/i.test(lastUserMsg)) {
    reply = `✨ **Layanan Kustom Sky Furniture:**
- **Warna & Bahan**: Anda bebas memilih warna (Biru Azure, Misty, Mocca, Broken White, Emerald, Navy, Maroon, dll.) dan bahan (Kanvas Linen, Velvet Mewah, Oscar Kulit Sintetis, Bouclé).
- **Orientasi L**: Bisa pilih L-Kiri atau L-Kanan disesuaikan tata letak ruang tamu Anda.
- **Ukuran Khusus**: Mau dimensi khusus? Anda bisa [Konsultasi Desain Langsung via WhatsApp](${waLink("Halo admin Sky Furniture, saya mau tanya custom ukuran sofa.")}) dengan tim pengrajin kami!`;
  } else if (/kulit|oscar/i.test(lastUserMsg)) {
    const kulitProds = PRODUCTS.filter((p) => p.material === "Oscar Kulit");
    reply = `🛋️ **Pilihan Sofa Bahan Oscar Kulit Sintetis:**
Bahan kulit sintetis kami sangat mewah, tidak mudah sobek, dan mudah dibersihkan hanya dengan lap lembap bila ketumpahan air:
${kulitProds.map((p) => `- **[${p.name}](/produk/${p.slug})** — ${formatPrice(p.price)}`).join("\n")}
Sangat cocok untuk keluarga dengan anak kecil atau hewan peliharaan!`;
  } else if (/retro/i.test(lastUserMsg)) {
    const retroProds = PRODUCTS.filter((p) => p.category === "retro");
    reply = `🛋️ **Koleksi Sofa Retro Minimalis Skandinavia:**
${retroProds.map((p) => `- **[${p.name}](/produk/${p.slug})** — ${formatPrice(p.price)} (${p.seats || "2-3"} Seater, kaki kayu natural)`).join("\n")}
Desain timeless yang cocok untuk apartemen dan ruang tamu bernuansa hangat.`;
  } else if (/sudut|letter l|sofa l/i.test(lastUserMsg)) {
    const sudutProds = PRODUCTS.filter((p) => p.category === "sudut").slice(0, 4);
    reply = `🛋️ **Rekomendasi Sofa L Sudut Paling Favorit:**
${sudutProds.map((p) => `- **[${p.name}](/produk/${p.slug})** — ${formatPrice(p.price)} (${p.description})`).join("\n")}
Semua sofa L kami bisa request posisi sudut kiri atau kanan tanpa biaya tambahan!`;
  } else if (/turki|sultan|mewah/i.test(lastUserMsg)) {
    const turki = PRODUCTS.find((p) => p.category === "turki");
    reply = `👑 **Sofa Turki 321 Luxury (Sultan Suite):**
${turki ? `- **[${turki.name}](/produk/${turki.slug})** — ${formatPrice(turki.price)}\nSet lengkap 321 dengan sandaran mahkota tinggi, ukiran mahoni Jepara, tufted kancing kristal, dan meja tamu marmer kaca tempered.` : "Set sofa ruang tamu mewah dengan kain beludru velvet dan aksen gold."}`;
  } else if (/minimalis|ruang tamu|apartemen/i.test(lastUserMsg)) {
    reply = `🛋️ **Rekomendasi Sofa Minimalis untuk Ruang Tamu:**
1. **[Sofa Retro 3 Seater](/produk/sofa-retro-3-seater)** (${formatPrice(1895000)}) — Desain Scandinavian minimalis, hemat ruang dengan kaki kayu Mahoni solid natural. Sangat cocok untuk ruang tamu bernuansa modern & hangat.
2. **[Sofa L Beranak](/produk/sofa-l-beranak)** (${formatPrice(3565000)}) — Pilihan tepat jika ingin santai bersama keluarga tanpa memakan tempat. Meja puff kecil bisa dimasukkan rapi di bawah sofa!
3. **[Sofa Retro 2 Seater](/produk/sofa-retro-2-seater)** (${formatPrice(1450000)}) — Model kompak 2 tempat duduk yang ramping dan estetik.

💡 *Tips:* Untuk ruang tamu minimalis, pilih kain warna netral seperti *Biru Horizon*, *Misty Gray*, atau *Broken White* agar ruangan terasa lebih lega dan terang!`;
  } else if (/rekomendasi|pilihan|murah|budget|best seller|favorit|saran|butuh|perlu/i.test(lastUserMsg)) {
    const top = PRODUCTS.filter((p) => p.featured).slice(0, 4);
    reply = `⭐ **Rekomendasi Terbaik dari Workshop Sky Furniture:**
${top.map((p) => `- **[${p.name}](/produk/${p.slug})** — **${formatPrice(p.price)}** (${p.badge?.text || "Pilihan Terlaris"})`).join("\n")}

Mau yang model santai keluarga (Sofa L) atau model minimalis ringkas (Sofa Retro)? Silakan beri tahu luas ruangan Anda!`;
  } else {
    const featured = PRODUCTS.slice(0, 3);
    reply = `Halo! Saya **SkyBot**, asisten virtual dari **Sky Furniture**.
Ada yang bisa saya bantu untuk ruang tamu impian Anda?

Beberapa hal yang sering ditanyakan:
- 🛋️ **Rekomendasi Sofa**: [${featured[0]?.name}](/produk/${featured[0]?.slug}) (${formatPrice(featured[0]?.price)})
- 🚚 **Pengiriman**: Gratis ongkir se-Sumatera Selatan (min. Rp 3jt)
- 🛡️ **Garansi**: 5 tahun rangka kayu mahoni oven
- 🎨 **Kustomisasi**: Bebas pilih warna kain & posisi L kiri/kanan

Silakan ketik pertanyaan Anda atau pilih salah satu menu di bawah ya!`;
  }

  return {
    text: reply,
    isFallback: true,
    notice,
  };
}

