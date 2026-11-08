import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export default function NotFoundPage({ title = "Halaman tidak ditemukan", message }) {
  const navigate = useNavigate();
  useDocumentTitle(title);

  return (
    <main className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="relative mb-8"
      >
        <span className="font-headline-xl text-[9rem] font-bold leading-none tracking-tighter text-surface-container-high sm:text-[12rem]">
          404
        </span>
        <motion.span
          animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Icon name="weekend" className="text-[5rem] text-primary-container sm:text-[7rem]" />
        </motion.span>
      </motion.div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface">{title}</h1>
      <p className="mt-2 max-w-md text-body-md text-on-surface-variant">
        {message ?? "Sepertinya sofa yang Anda cari sudah pindah ruangan. Kembali ke beranda atau jelajahi katalog kami."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-secondary">
          <Icon name="arrow_back" className="text-xl" />
          Kembali
        </button>
        <Link to="/" className="btn-primary">
          <Icon name="home" className="text-xl" />
          Ke Beranda
        </Link>
        <Link to="/katalog" className="btn-tonal">
          <Icon name="grid_view" className="text-xl" />
          Lihat Katalog
        </Link>
      </div>
    </main>
  );
}
