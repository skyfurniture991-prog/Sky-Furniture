import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { Suspense, useCallback } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { pageVariants } from "../../lib/motion";
import AnnouncementBar from "./AnnouncementBar";
import BackToTop from "./BackToTop";
import CartDrawer from "./CartDrawer";
import Footer from "./Footer";
import Header from "./Header";
import ScrollProgress from "./ScrollProgress";
import SearchOverlay from "./SearchOverlay";
import ToastViewport from "./ToastViewport";
import ChatbotWidget from "./ChatbotWidget";
import QuickView from "../product/QuickView";

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();
  const lenis = useLenis();
  const isCheckout = location.pathname === "/checkout";

  const scrollTop = useCallback(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [lenis]);

  return (
    <>
      <ScrollProgress />
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
      >
        Lewati ke konten
      </a>
      {!isCheckout && <AnnouncementBar />}
      <Header minimal={isCheckout} />

      <AnimatePresence mode="wait" initial={false} onExitComplete={scrollTop}>
        <motion.div
          id="konten"
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          className="min-h-[70vh]"
        >
          <Suspense fallback={<div className="min-h-[60vh]" />}>{outlet}</Suspense>
        </motion.div>
      </AnimatePresence>

      <Footer />

      <CartDrawer />
      <SearchOverlay />
      <QuickView />
      <ToastViewport />
      <ChatbotWidget />
      <BackToTop />
    </>
  );
}
