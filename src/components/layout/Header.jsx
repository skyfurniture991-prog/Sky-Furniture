import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { LOGO_URL } from "../../data/products";
import { waLink } from "../../data/store";
import { useCart } from "../../contexts/CartContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useUI } from "../../contexts/UIContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { useAdmin } from "../../contexts/AdminContext";
import { useAuth } from "../../contexts/AuthContext";
import { Drawer } from "../ui/Modal";
import Icon from "../ui/Icon";

function GoogleIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

const NAV = [
  { name: "Beranda", to: "/" },
  { name: "Katalog", to: "/katalog" },
  { name: "Promo", to: "/katalog?urut=diskon" },
];

const navActive = (item, loc) => {
  const promoPage = loc.pathname === "/katalog" && new URLSearchParams(loc.search).get("urut") === "diskon";
  if (item.name === "Promo") return promoPage;
  if (item.to === "/") return loc.pathname === "/";
  if (item.to === "/katalog") return loc.pathname === "/katalog" && !promoPage;
  return loc.pathname.startsWith(item.to);
};

function Logo({ className = "" }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`} aria-label="Sky Furniture - Beranda">
      <img src={LOGO_URL} alt="" className="h-10 w-auto object-contain" />
      <span className="font-headline-md text-xl font-semibold tracking-tight text-primary">Sky Furniture</span>
    </Link>
  );
}

function IconButton({ label, onClick, to, badge, children }) {
  const cls =
    "relative flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary";
  const content = (
    <>
      {children}
      <AnimatePresence>
        {badge > 0 && (
          <motion.span
            key={badge}
            initial={{ scale: 0.4 }}
            animate={{ scale: [1.5, 1] }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-on-secondary"
          >
            {badge}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );
  return to ? (
    <Link to={to} aria-label={label} title={label} className={cls}>
      {content}
    </Link>
  ) : (
    <button onClick={onClick} aria-label={label} title={label} className={cls}>
      {content}
    </button>
  );
}

function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <IconButton label={isDark ? "Mode terang" : "Mode gelap"} onClick={toggle}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
          className="flex"
        >
          <Icon name={isDark ? "light_mode" : "dark_mode"} className="text-[22px]" />
        </motion.span>
      </AnimatePresence>
    </IconButton>
  );
}

function UserAuthButton() {
  const { isAuthenticated, userName, userEmail, userAvatar, signInWithGoogle, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Tutup dropdown bila klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  // Jika sudah login pelanggan
  if (isAuthenticated) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full border border-outline-variant/60 bg-surface-container-low py-1 pl-1 pr-2.5 text-on-surface transition-all hover:border-primary/40 hover:bg-surface-container"
          aria-expanded={open}
          aria-label="Menu Akun Pengguna"
        >
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="h-7 w-7 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {(userName || "U")[0].toUpperCase()}
            </div>
          )}
          <span className="hidden max-w-[90px] truncate text-xs font-semibold md:inline-block">
            {userName.split(" ")[0]}
          </span>
          <Icon name="expand_more" className="text-sm text-outline" />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-60 origin-top-right rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-2 shadow-lift z-50"
            >
              <div className="border-b border-outline-variant/40 px-3 py-2.5">
                <p className="truncate text-title-sm font-semibold text-on-surface">{userName}</p>
                <p className="truncate text-body-xs text-on-surface-variant">{userEmail}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/pesanan"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-body-sm font-medium text-on-surface transition-colors hover:bg-surface-container hover:text-primary"
                >
                  <Icon name="inventory_2" className="text-lg text-primary" />
                  <span>Pesanan Saya</span>
                </Link>
              </div>

              <div className="border-t border-outline-variant/40 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-body-sm font-medium text-error transition-colors hover:bg-error/10"
                >
                  <Icon name="logout" className="text-lg" />
                  <span>Keluar</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Jika belum login: Tombol Pil [Google Logo] Masuk
  return (
    <button
      type="button"
      onClick={() => signInWithGoogle()}
      className="inline-flex items-center gap-2 rounded-full border border-outline-variant/70 bg-surface-container-low px-3.5 py-1.5 text-label-md font-semibold text-on-surface shadow-soft transition-all hover:border-primary/50 hover:bg-surface-container hover:text-primary active:scale-95"
      title="Masuk dengan Akun Google"
    >
      <GoogleIcon className="h-4 w-4" />
      <span>Masuk</span>
    </button>
  );
}

function AdminIconButton() {
  const { isAuthenticated, adminUser } = useAdmin();

  const cls =
    "relative flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary";

  return isAuthenticated ? (
    <Link to="/admin" aria-label="Buka panel admin" title={`Panel Admin (${adminUser?.email || ""})`} className={cls}>
      <Icon name="person" className="text-[22px]" />
      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-surface-container-lowest" />
      <span className="sr-only">Buka panel admin</span>
    </Link>
  ) : (
    <Link to="/admin/login" aria-label="Masuk Admin" title="Masuk Panel Admin" className={cls}>
      <Icon name="person" className="text-[22px]" />
      <span className="sr-only">Masuk Admin</span>
    </Link>
  );
}

export default function Header({ minimal = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const { count } = useCart();
  const wishlist = useWishlist();
  const { openCart, openSearch } = useUI();
  const { isAuthenticated: isUser, userName, userEmail, userAvatar, signInWithGoogle, signOut } = useAuth();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));


  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-outline-variant/40 bg-surface-container-lowest/85 shadow-soft backdrop-blur-xl"
            : "border-transparent bg-surface-container-lowest"
        }`}
      >
        <div
          className={`container-page flex items-center justify-between gap-4 transition-all duration-300 ${
            scrolled ? "py-2.5" : "py-4"
          }`}
        >
          <Logo />

          {minimal ? (
            <>
              <div className="hidden items-center gap-2 text-body-sm text-on-surface-variant md:flex">
                <Icon name="shield_lock" className="text-lg text-primary" />
                Checkout Aman &amp; Terenkripsi
              </div>
              <Link to="/keranjang" className="flex items-center gap-1 text-label-lg font-label-lg text-primary hover:underline">
                <Icon name="arrow_back" className="text-lg" />
                Kembali ke Keranjang
              </Link>
            </>
          ) : (
            <>
              <nav className="relative hidden items-center gap-1 xl:flex" aria-label="Navigasi utama">
                {NAV.map((item) => {
                  const active = navActive(item, location);
                  return (
                    <Link
                      key={item.name}
                      to={item.to}
                      aria-current={active ? "page" : undefined}
                      className={`relative rounded-lg px-3.5 py-2 text-title-md font-title-md transition-colors ${
                        active ? "text-primary" : "text-on-surface-variant hover:text-primary"
                      }`}
                    >
                      {item.name}
                      {active && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-primary-container"
                          transition={{ type: "spring", stiffness: 500, damping: 36 }}
                        />
                      )}
                    </Link>
                  );
                })}
                <a
                  href={waLink("Halo, saya ingin custom sofa di workshop Sky Furniture.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg px-3.5 py-2 text-title-md font-title-md text-on-surface-variant transition-colors hover:text-primary"
                >
                  Custom Workshop
                </a>
              </nav>

              <button
                onClick={openSearch}
                className="group hidden h-10 w-64 items-center gap-2 rounded-full border border-outline-variant/60 bg-surface px-4 text-left text-body-sm text-outline transition-all hover:border-primary-container hover:shadow-soft lg:flex xl:w-72"
              >
                <Icon name="search" className="text-lg" />
                <span className="flex-1 truncate">Cari sofa, kain, atau dimensi...</span>
                <kbd className="rounded border border-outline-variant/70 px-1.5 py-0.5 text-[10px] font-semibold text-outline">Ctrl K</kbd>
              </button>

              <div className="flex items-center gap-0.5">
                <span className="lg:hidden">
                  <IconButton label="Cari" onClick={openSearch}>
                    <Icon name="search" className="text-[22px]" />
                  </IconButton>
                </span>
                <ThemeToggle />
                <IconButton label="Wishlist" to="/wishlist" badge={wishlist.count}>
                  <Icon name="favorite" className="text-[22px]" />
                </IconButton>
                <IconButton label="Keranjang" onClick={openCart} badge={count}>
                  <Icon name="shopping_bag" className="text-[22px]" />
                </IconButton>
                <div className="hidden sm:flex items-center gap-1.5 ml-1">
                  <UserAuthButton />
                  <AdminIconButton />
                </div>
                <span className="xl:hidden">
                  <IconButton label="Menu" onClick={() => setMenuOpen(true)}>
                    <Icon name="menu" className="text-[26px]" />
                  </IconButton>
                </span>
              </div>
            </>
          )}
        </div>
      </header>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} side="left" label="Menu navigasi">
        <div className="flex items-center justify-between border-b border-outline-variant/40 p-5">
          <Logo />
          <button onClick={() => setMenuOpen(false)} aria-label="Tutup menu" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-container">
            <Icon name="close" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4" data-lenis-prevent>
          {isUser ? (
            <>
              <div className="mb-3 flex items-center justify-between rounded-2xl border border-outline-variant/50 bg-surface-container-low p-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  {userAvatar ? (
                    <img src={userAvatar} alt="" className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {(userName || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-title-sm font-semibold text-on-surface">{userName}</p>
                    <p className="truncate text-body-xs text-on-surface-variant">{userEmail}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  className="btn-tonal !p-2 text-error"
                  title="Keluar"
                >
                  <Icon name="logout" className="text-xl" />
                </button>
              </div>

              <Link
                to="/pesanan"
                onClick={() => setMenuOpen(false)}
                className="mb-3 flex items-center gap-2.5 rounded-xl bg-primary/10 px-4 py-2.5 text-title-sm font-bold text-primary transition-colors hover:bg-primary/20"
              >
                <Icon name="inventory_2" className="text-lg" />
                <span>Pesanan Saya</span>
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                signInWithGoogle();
              }}
              className="mb-3 flex w-full items-center justify-center gap-2.5 rounded-2xl border border-outline-variant/60 bg-surface-container-low px-4 py-3 text-title-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
            >
              <GoogleIcon className="h-5 w-5" />
              <span>Masuk dengan Google</span>
            </button>
          )}

          {[...NAV, { name: "Wishlist", to: "/wishlist" }, { name: "Keranjang", to: "/keranjang" }].map((item, i) => (
            <motion.div key={item.name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.05 }}>
              <Link
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-title-lg font-title-lg text-on-surface transition-colors hover:bg-surface-container hover:text-primary"
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
          <Link
            to="/admin"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 rounded-xl border border-outline-variant/60 bg-surface-container-low px-4 py-3 text-title-md font-bold text-primary transition-colors hover:bg-primary hover:text-on-primary mt-2"
          >
            <Icon name="admin_panel_settings" className="text-xl" />
            <span>Panel Admin</span>
          </Link>
          <a
            href={waLink("Halo, saya ingin custom sofa.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-4"
          >
            <Icon name="chat" className="text-xl" />
            Konsultasi Custom
          </a>
        </nav>
      </Drawer>
    </>
  );
}
