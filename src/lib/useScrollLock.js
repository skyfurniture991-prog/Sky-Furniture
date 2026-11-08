import { useEffect } from "react";
import { useLenis } from "lenis/react";

let lockCount = 0;

/** Mengunci scroll halaman (Lenis + native) selama overlay terbuka. Aman untuk overlay bertumpuk. */
export function useScrollLock(locked) {
  const lenis = useLenis();
  useEffect(() => {
    if (!locked) return undefined;
    lockCount += 1;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        lenis?.start();
        document.documentElement.style.overflow = "";
      }
    };
  }, [locked, lenis]);
}
