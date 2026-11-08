import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "../ui/Icon";

const MESSAGES = [
  { icon: "local_shipping", text: "Gratis ongkir se-Sumatera Selatan untuk belanja di atas Rp 3 juta" },
  { icon: "verified", text: "Garansi rangka kayu mahoni 5 tahun resmi workshop" },
  { icon: "sell", text: "Gunakan kode SKYBIRU untuk diskon 10% hari ini" },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [closed, setClosed] = useState(() => sessionStorage.getItem("sky.announce") === "closed");

  useEffect(() => {
    if (closed) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 4200);
    return () => clearInterval(t);
  }, [closed]);

  const close = () => {
    sessionStorage.setItem("sky.announce", "closed");
    setClosed(true);
  };

  const msg = MESSAGES[index];

  return (
    <AnimatePresence initial={false}>
      {!closed && (
        <motion.aside
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative overflow-hidden bg-inverse-surface text-inverse-on-surface"
        >
          <div className="relative mx-auto flex h-9 max-w-[1440px] items-center justify-center px-10 text-xs font-label-md tracking-wider">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={index}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="inline-flex items-center gap-2"
              >
                <Icon name={msg.icon} className="text-base text-secondary-fixed-dim" />
                {msg.text}
              </motion.span>
            </AnimatePresence>
            <button
              onClick={close}
              aria-label="Tutup pengumuman"
              className="absolute right-3 flex h-6 w-6 items-center justify-center rounded-full opacity-60 transition hover:bg-white/10 hover:opacity-100"
            >
              <Icon name="close" className="text-base" />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
