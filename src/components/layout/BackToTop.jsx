import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useLenis } from "lenis/react";
import Icon from "../ui/Icon";

export default function BackToTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 700));

  const toTop = () => (lenis ? lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: "smooth" }));

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
          onClick={toTop}
          aria-label="Kembali ke atas"
          className="fixed bottom-24 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/50 bg-surface-container-lowest text-primary shadow-lift sm:bottom-6 sm:right-24"
        >
          <Icon name="arrow_upward" className="text-xl" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
