/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

const isStoreAdminUser = (u) => {
  if (!u) return false;
  return u.email === "admin@skyfurniture.id" || u.user_metadata?.role === "admin";
};

export function AuthProvider({ children }) {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inisialisasi sesi saat aplikasi dimuat & pasang event listener
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function initSession() {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (isMounted) {
          const sUser = initialSession?.user ?? null;
          // Akun admin toko tidak boleh dianggap sebagai login pelanggan/pembeli
          if (isStoreAdminUser(sUser)) {
            setSession(null);
            setUser(null);
          } else {
            setSession(initialSession);
            setUser(sUser);
          }
        }
      } catch (err) {
        console.warn("Gagal mengambil sesi auth:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMounted) {
        const sUser = newSession?.user ?? null;
        if (isStoreAdminUser(sUser)) {
          setSession(null);
          setUser(null);
        } else {
          setSession(newSession);
          setUser(sUser);
        }
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * Masuk dengan akun Google via Supabase OAuth.
   *
   * @param {string} [returnPath="/checkout"] Halaman tujuan setelah berhasil login
   */
  const signInWithGoogle = useCallback(async (returnPath = window.location.pathname) => {
    if (!isSupabaseConfigured || !supabase) {
      toast.error("Layanan Autentikasi Belum Siap", "Supabase belum terkonfigurasi dengan benar.");
      return;
    }

    try {
      // Simpan returnPath agar setelah login bisa diarahkan kembali
      if (returnPath) {
        sessionStorage.setItem("sky.auth.returnPath", returnPath);
      }

      const redirectUrl = `${window.location.origin}${returnPath.startsWith("/") ? returnPath : `/${returnPath}`}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error("Gagal memulai Google Sign-In:", err);
      toast.error("Gagal Masuk dengan Google", err.message || "Silakan coba lagi.");
    }
  }, [toast]);

  /**
   * Keluar dari akun
   */
  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setUser(null);
      setSession(null);
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      toast.success("Berhasil Keluar", "Anda telah keluar dari akun.");
    } catch (err) {
      console.error("Gagal keluar:", err);
      toast.error("Gagal Keluar", err.message || "Terjadi kesalahan.");
    }
  }, [toast]);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      isAuthenticated: Boolean(user),
      userName: user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Pelanggan",
      userEmail: user?.email || "",
      userAvatar: user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null,
      signInWithGoogle,
      signOut,
    }),
    [user, session, loading, signInWithGoogle, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return ctx;
}

