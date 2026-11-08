import { motion } from "framer-motion";

const COLORS = ["#38bdf8", "#0369a1", "#febc79", "#84531a", "#94ccff", "#4ade80"];

// Pseudo-random deterministik agar render murni (tanpa Math.random).
const rnd = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const PIECES = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  x: (rnd(i + 1) - 0.5) * 520,
  y: -(120 + rnd(i + 50) * 260),
  rotate: (rnd(i + 100) - 0.5) * 720,
  color: COLORS[i % COLORS.length],
  size: 6 + rnd(i + 150) * 7,
  delay: rnd(i + 200) * 0.25,
  round: i % 3 === 0,
}));

/** Ledakan konfeti singkat dari titik tengah. */
export default function Confetti() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-24 z-10" aria-hidden="true">
      {PIECES.map((p) => (
        <motion.span
          key={p.id}
          className={`absolute block ${p.round ? "rounded-full" : "rounded-[2px]"}`}
          style={{ width: p.size, height: p.size * (p.round ? 1 : 1.8), backgroundColor: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 420], opacity: [1, 1, 0], rotate: p.rotate, scale: 1 }}
          transition={{ duration: 2.4, delay: p.delay, ease: "easeOut", times: [0, 0.4, 1] }}
        />
      ))}
    </div>
  );
}
