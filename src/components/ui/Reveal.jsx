import { motion } from "framer-motion";
import { EASE, fadeUp, stagger } from "../../lib/motion";

const VIEWPORT = { once: true, amount: 0.2, margin: "0px 0px -60px 0px" };

/** Memunculkan elemen (fade + naik) saat masuk viewport. */
export function Reveal({ as = "div", delay = 0, y = 28, className = "", children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Container yang menganimasikan anak-anaknya berurutan (gunakan bersama StaggerItem). */
export function Stagger({ as = "div", gap = 0.08, delay = 0, className = "", children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={stagger(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({ as = "div", className = "", children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={fadeUp} {...rest}>
      {children}
    </Tag>
  );
}
