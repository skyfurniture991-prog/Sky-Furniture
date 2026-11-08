import { motion, useScroll, useSpring } from "framer-motion";

/** Garis progres scroll tipis di bagian paling atas halaman. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[120] h-[3px] origin-left bg-gradient-to-r from-primary-container via-tertiary-fixed-dim to-secondary-container"
    />
  );
}
