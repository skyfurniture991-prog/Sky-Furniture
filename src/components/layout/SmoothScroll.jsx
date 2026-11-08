import { useReducedMotion } from "framer-motion";
import { ReactLenis } from "lenis/react";

const OPTIONS = {
  lerp: 0.1,
  wheelMultiplier: 1,
  smoothWheel: true,
  anchors: { offset: -96 },
};

/** Smooth scroll (Lenis) untuk seluruh aplikasi; dimatikan bila pengguna meminta gerak berkurang. */
export default function SmoothScroll({ children }) {
  const reduce = useReducedMotion();
  if (reduce) return children;
  return (
    <ReactLenis root options={OPTIONS}>
      {children}
    </ReactLenis>
  );
}
