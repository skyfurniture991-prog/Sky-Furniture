import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";
import Icon from "../../components/ui/Icon";
import { LOGO_URL } from "../../data/products";

const BG_IMAGE = "/images/admin-login-bg.jpg";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setErrorMsg(err.message || "Gagal masuk. Periksa email & kata sandi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      {/* Latar foto sofa dengan efek blur agar tidak menabrak form */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={BG_IMAGE}
          alt=""
          className="h-full w-full scale-110 object-cover blur-[3px]"
          loading="eager"
          decoding="async"
        />
        {/* Lapisan penenang warna agar kontras foto turun dan form tetap terbaca */}
        <div className="absolute inset-0 bg-surface/70 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/25 via-primary/10 to-primary/35" />
      </div>

      {/* Kartu login: sempit & memanjang ke bawah */}
      <div className="relative w-full max-w-[21.5rem]">
        <div className="rounded-2xl border border-white/50 bg-surface-container-lowest/95 p-6 shadow-lift backdrop-blur-sm sm:p-7">
          {/* Brand */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex rounded-2xl transition-transform hover:scale-105 dark:bg-white/90 dark:p-2"
            >
              <img
                src={LOGO_URL}
                alt="Sky Furniture"
                className="mx-auto h-24 w-auto object-contain sm:h-28"
              />
            </Link>
            <h1 className="mt-4 font-headline-sm text-xl font-bold leading-tight text-on-surface">
              Sky Admin Panel
            </h1>
            <p className="mt-1 text-[11px] leading-relaxed text-on-surface-variant">
              Sistem Manajemen Konten &amp; Pemesanan Toko
            </p>
          </div>

          <div className="my-5 h-px bg-outline-variant/50" />

          {errorMsg && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-error/10 p-2.5 text-[11px] text-error">
              <Icon name="error" className="shrink-0 text-base" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-on-surface">Email Admin</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email admin"
                  autoComplete="username"
                  required
                  className="field py-2.5 pl-10 text-[13px]"
                />
                <Icon
                  name="mail"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-outline"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-on-surface">Kata Sandi</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="field py-2.5 pl-10 text-[13px]"
                />
                <Icon
                  name="lock"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-outline"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary mt-1 w-full py-2.5 text-[13px]"
            >
              {submitting ? (
                <>
                  <Icon name="progress_activity" className="animate-spin text-base" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <Icon name="login" className="text-base" />
                  <span>Masuk</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-5 border-t border-outline-variant/50 pt-4">
            <Link
              to="/"
              className="mx-auto flex items-center justify-center gap-1.5 text-[11px] text-on-surface-variant transition-colors hover:text-primary"
            >
              <Icon name="arrow_back" className="text-sm" />
              <span>Kembali ke Halaman Toko</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
