import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LOGO_URL } from "../../data/products";
import { waLink } from "../../data/store";
import { useToast } from "../../contexts/ToastContext";
import { useLocalStorage } from "../../lib/useLocalStorage";
import Icon from "../ui/Icon";
import { Reveal } from "../ui/Reveal";

function Newsletter() {
  const toast = useToast();
  const [subscribed, setSubscribed] = useLocalStorage("sky.newsletter.v1", null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Masukkan alamat email yang valid.");
      return;
    }
    setError("");
    setSubscribed(email);
    toast.success("Berhasil berlangganan", "Kami akan mengirim inspirasi ruang & promo eksklusif ke email Anda.");
    setEmail("");
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
      <div className="grid items-center gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-headline-md text-headline-md text-inverse-on-surface">Inspirasi ruang & promo eksklusif</h3>
          <p className="mt-1 text-body-md text-inverse-on-surface/60">
            Dapatkan tips menata ruang tamu dan kabar koleksi terbaru. Tanpa spam, bisa berhenti kapan saja.
          </p>
        </div>
        <div>
          <AnimatePresence mode="wait" initial={false}>
            {subscribed ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 rounded-xl bg-white/10 p-4"
              >
                <Icon name="mark_email_read" className="text-3xl text-tertiary-fixed-dim" />
                <div className="text-body-sm text-inverse-on-surface">
                  Terima kasih! Email <strong>{subscribed}</strong> sudah terdaftar.
                  <button onClick={() => setSubscribed(null)} className="ml-2 underline opacity-70 hover:opacity-100">
                    Ubah
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@contoh.com"
                    aria-label="Alamat email"
                    className="h-12 flex-1 rounded-lg border border-white/15 bg-white/10 px-4 text-inverse-on-surface placeholder:text-inverse-on-surface/40 focus:border-tertiary-fixed-dim"
                  />
                  <button type="submit" className="btn bg-secondary-container text-on-secondary-container hover:brightness-105">
                    Berlangganan
                  </button>
                </div>
                {error && <p className="mt-2 text-body-sm text-error-container">{error}</p>}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const linkCls = "text-sm text-inverse-on-surface/60 transition-colors hover:text-inverse-on-surface";

export default function Footer() {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface">
      <div className="container-page py-16">
        <Reveal>
          <Newsletter />
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <Link to="/" className="mb-4 inline-flex items-center gap-2.5">
              <img src={LOGO_URL} alt="" className="h-10 w-auto rounded bg-white/90 p-1" />
              <span className="font-headline-md text-xl font-semibold">Sky Furniture</span>
            </Link>
            <p className="max-w-sm text-body-md text-inverse-on-surface/60">
              Pusat sofa premium langsung dari workshop Sky Furniture Palembang. Menghadirkan kenyamanan ruang keluarga di seluruh Sumatera Selatan.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { icon: "photo_camera", label: "Instagram" },
                { icon: "play_circle", label: "YouTube" },
                { icon: "alternate_email", label: "Email" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  onClick={(e) => e.preventDefault()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:-translate-y-0.5 hover:bg-white/20"
                >
                  <Icon name={s.icon} className="text-xl" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="mb-4 font-title-md text-title-md">Belanja</h4>
            <ul className="space-y-2.5">
              <li><Link to="/katalog" className={linkCls}>Semua Produk</Link></li>
              <li><Link to="/katalog?kategori=sudut" className={linkCls}>Sofa L Sudut</Link></li>
              <li><Link to="/katalog?kategori=retro" className={linkCls}>Sofa Retro</Link></li>
              <li><Link to="/katalog?kategori=aksesoris" className={linkCls}>Aksesoris Ruang</Link></li>
              <li><Link to="/katalog?urut=diskon" className={linkCls}>Promo</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="mb-4 font-title-md text-title-md">Akun</h4>
            <ul className="space-y-2.5">
              <li><Link to="/keranjang" className={linkCls}>Keranjang</Link></li>
              <li><Link to="/wishlist" className={linkCls}>Wishlist</Link></li>
              <li><Link to="/pesanan" className={linkCls}>Lacak Pesanan</Link></li>
              <li><Link to="/laporan" className={linkCls}>Laporan Proyek</Link></li>
              <li>
                <Link to="/admin" className="inline-flex items-center gap-1 font-semibold text-primary-fixed hover:text-white transition-colors">
                  <Icon name="admin_panel_settings" className="text-sm" />
                  <span>Panel Admin</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3">
            <h4 className="mb-4 font-title-md text-title-md">Kontak</h4>
            <ul className="space-y-3 text-sm text-inverse-on-surface/60">
              <li className="flex items-start gap-2">
                <Icon name="location_on" className="mt-0.5 text-lg" />
                Workshop Sky Furniture, Kota Palembang, Sumatera Selatan
              </li>
              <li>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-inverse-on-surface">
                  <Icon name="phone" className="text-lg" />
                  +62 811-2345-6789
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="schedule" className="text-lg" />
                Senin - Sabtu, 08.00 - 17.00
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <p className="text-sm text-inverse-on-surface/40">© {new Date().getFullYear()} Sky Furniture. Hak Cipta Dilindungi.</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["BCA", "Mandiri", "BNI", "GoPay", "OVO", "ShopeePay"].map((b) => (
              <span key={b} className="rounded border border-white/15 px-2 py-1 text-[10px] font-bold tracking-wide text-inverse-on-surface/60">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
