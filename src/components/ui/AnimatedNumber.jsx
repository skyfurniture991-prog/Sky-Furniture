import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { formatPrice } from "../../lib/format";

/** Hitung naik dari 0 saat elemen terlihat. */
export function CountUp({ to, decimals = 0, duration = 1.6, prefix = "", suffix = "", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current) return undefined;
    const node = ref.current;
    if (reduce) {
      node.textContent = `${prefix}${to.toFixed(decimals)}${suffix}`;
      return undefined;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, to, decimals, duration, prefix, suffix, reduce]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

/** Harga yang bergulir halus setiap kali nilainya berubah. */
export function AnimatedPrice({ value, className = "" }) {
  const ref = useRef(null);
  const prev = useRef(value);
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (reduce || prev.current === value) {
      node.textContent = formatPrice(value);
      prev.current = value;
      return undefined;
    }
    const controls = animate(prev.current, value, {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = formatPrice(v);
      },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, reduce]);

  return (
    <span ref={ref} className={className}>
      {formatPrice(value)}
    </span>
  );
}
