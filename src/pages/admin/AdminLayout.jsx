import { useState } from "react";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";
import Icon from "../../components/ui/Icon";
import { LOGO_URL } from "../../data/products";

const NAV_ITEMS = [
  { path: "/admin", label: "Ringkasan", icon: "dashboard", exact: true },
  { path: "/admin/pesanan", label: "Pesanan", icon: "receipt_long" },
  { path: "/admin/produk", label: "Katalog Produk", icon: "chair" },
  { path: "/admin/kategori", label: "Kategori & Varian", icon: "category" },
  { path: "/admin/konten", label: "Konten Toko", icon: "campaign" },
  { path: "/admin/ulasan", label: "Ulasan Pelanggan", icon: "rate_review" },
  { path: "/admin/promo", label: "Promo & Pengiriman", icon: "local_offer" },
];

export default function AdminLayout() {
  const { isAuthenticated, adminUser, logout, loading } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Icon name="progress_activity" className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="flex min-h-screen bg-surface-container-low text-on-surface">
      {/* ─── SIDEBAR DESKTOP ─── */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-outline-variant/60 bg-surface-container-lowest lg:flex">
        {/* Logo Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-outline-variant/50 px-6">
          <img src={LOGO_URL} alt="Sky Furniture" className="h-8 w-auto object-contain" />
          <div className="flex flex-col">
            <span className="font-headline-sm text-sm font-bold tracking-tight text-primary">Sky Admin</span>
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">Content & Orders</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary-container text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`
              }
            >
              <Icon name={item.icon} className="text-xl" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User profile with Pop-up Menu */}
        <div className="relative border-t border-outline-variant/50 p-3">
          {/* Pop-up Menu saat akun di-klik */}
          {accountMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setAccountMenuOpen(false)}
              />
              <div className="absolute bottom-full left-3 right-3 z-50 mb-2 overflow-hidden rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                {/* Header Info */}
                <div className="flex items-center gap-3 border-b border-outline-variant/40 p-2.5 mb-1 bg-surface-container-low/60 rounded-xl">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary font-bold text-sm shadow-sm">
                    {adminUser?.email ? adminUser.email.charAt(0).toUpperCase() : "A"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-on-surface">{adminUser?.email || "Admin"}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Superadmin Aktif
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      setProfileModalOpen(true);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <Icon name="person" className="text-base text-primary" />
                    <span>Lihat Profil Admin</span>
                  </button>

                  <div className="my-1 border-t border-outline-variant/40" />

                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-error hover:bg-error/10 transition-colors"
                  >
                    <Icon name="logout" className="text-base text-error" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Trigger Button Akun */}
          <button
            type="button"
            onClick={() => setAccountMenuOpen((prev) => !prev)}
            className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all ${
              accountMenuOpen
                ? "bg-surface-container shadow-sm ring-1 ring-primary/20"
                : "hover:bg-surface-container/70"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
              {adminUser?.email ? adminUser.email.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-on-surface">{adminUser?.email || "Admin"}</p>
              <p className="truncate text-[11px] text-on-surface-variant">Superadmin</p>
            </div>
            <Icon
              name={accountMenuOpen ? "expand_more" : "expand_less"}
              className="text-lg text-outline transition-transform"
            />
          </button>
        </div>
      </aside>

      {/* ─── MOBILE DRAWER MENU ─── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex w-72 flex-col bg-surface-container-lowest p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-outline-variant/50 pb-4">
              <div className="flex items-center gap-2">
                <img src={LOGO_URL} alt="Sky Furniture" className="h-7 w-auto" />
                <span className="font-bold text-primary">Sky Admin</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-1 text-on-surface-variant">
                <Icon name="close" className="text-xl" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive
                        ? "bg-primary-container text-on-primary"
                        : "text-on-surface-variant hover:bg-surface-container"
                    }`
                  }
                >
                  <Icon name={item.icon} className="text-xl" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-4 border-t border-outline-variant/50 pt-4 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setProfileModalOpen(true);
                }}
                className="flex w-full items-center gap-3 rounded-xl bg-surface-container p-2.5 text-left"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {adminUser?.email ? adminUser.email.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-on-surface">{adminUser?.email || "Admin"}</p>
                  <p className="truncate text-[11px] text-on-surface-variant">Superadmin • Lihat Profil</p>
                </div>
                <Icon name="chevron_right" className="text-base text-outline" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-error/10 py-2.5 text-xs font-semibold text-error hover:bg-error/20 transition-colors"
              >
                <Icon name="logout" className="text-base" />
                <span>Keluar (Logout)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant/60 bg-surface-container-lowest/80 px-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container lg:hidden"
            >
              <Icon name="menu" className="text-2xl" />
            </button>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Sky CMS & Pemesanan</span>
              <h1 className="font-headline-sm text-lg font-bold text-on-surface">Panel Administrasi</h1>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* ─── MODAL PROFIL ADMIN ─── */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setProfileModalOpen(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-outline-variant/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-xl shadow-sm">
                  {adminUser?.email ? adminUser.email.charAt(0).toUpperCase() : "A"}
                </div>
                <div>
                  <h3 className="font-headline-sm text-base font-bold text-on-surface">Profil Administrator</h3>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <Icon name="verified" className="text-xs" /> Terverifikasi • Superadmin
                  </span>
                </div>
              </div>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="rounded-lg p-1.5 text-outline hover:bg-surface-container hover:text-on-surface"
              >
                <Icon name="close" className="text-xl" />
              </button>
            </div>

            <div className="mt-5 space-y-3.5 text-xs">
              <div className="rounded-xl bg-surface-container-low p-3.5 space-y-2">
                <div>
                  <p className="text-[11px] font-semibold text-on-surface-variant">Email Terdaftar</p>
                  <p className="font-medium text-sm text-on-surface">{adminUser?.email || "admin@skyfurniture.id"}</p>
                </div>
                <div className="border-t border-outline-variant/30 pt-2">
                  <p className="text-[11px] font-semibold text-on-surface-variant">Hak Akses</p>
                  <p className="font-medium text-on-surface">Superadmin (Akses Penuh Manajemen Toko, Pesanan, & CMS)</p>
                </div>
                <div className="border-t border-outline-variant/30 pt-2">
                  <p className="text-[11px] font-semibold text-on-surface-variant">Status Akun</p>
                  <p className="font-medium text-emerald-600">Aktif & Aman</p>
                </div>
              </div>

              <div className="rounded-xl border border-outline-variant/50 p-3 text-on-surface-variant text-[11px] space-y-1">
                <p className="font-semibold text-on-surface flex items-center gap-1.5">
                  <Icon name="security" className="text-sm text-primary" /> Keamanan Sesi
                </p>
                <p>Sesi login terenkripsi melalui autentikasi Supabase terisolasi khusus Admin.</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-outline-variant/40 pt-4">
              <button
                onClick={() => {
                  setProfileModalOpen(false);
                  logout();
                }}
                className="btn-secondary !text-error hover:!bg-error/10 !py-2 !px-4 text-xs font-semibold flex items-center gap-1.5"
              >
                <Icon name="logout" className="text-sm" />
                Logout
              </button>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="btn-primary !py-2 !px-5 text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
