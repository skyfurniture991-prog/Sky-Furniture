import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "../../lib/motion";
import { useScrollLock } from "../../lib/useScrollLock";
import Icon from "./Icon";

function useEscape(open, onClose) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
}

function Backdrop({ onClick, className = "" }) {
  return (
    <motion.div
      className={`absolute inset-0 bg-inverse-surface/60 backdrop-blur-sm ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
    />
  );
}

/** Dialog tengah layar. */
export function Modal({ open, onClose, label, className = "", children, closeButton = true }) {
  useScrollLock(open);
  useEscape(open, onClose);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={label}>
          <Backdrop onClick={onClose} />
          <motion.div
            data-lenis-prevent
            className={`relative max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-lift ${className}`}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {closeButton && (
              <button
                onClick={onClose}
                aria-label="Tutup"
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-lowest/90 text-on-surface-variant shadow-soft backdrop-blur transition hover:text-primary"
              >
                <Icon name="close" className="text-xl" />
              </button>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

const SIDES = {
  right: { cls: "right-0 top-0 h-full w-full max-w-md", from: { x: "100%" } },
  left: { cls: "left-0 top-0 h-full w-full max-w-sm", from: { x: "-100%" } },
  bottom: { cls: "bottom-0 left-0 w-full max-h-[88vh] rounded-t-3xl", from: { y: "100%" } },
};

/** Panel geser dari sisi layar. */
export function Drawer({ open, onClose, side = "right", label, className = "", children }) {
  useScrollLock(open);
  useEscape(open, onClose);
  const cfg = SIDES[side];

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={label}>
          <Backdrop onClick={onClose} />
          <motion.aside
            className={`absolute flex flex-col bg-surface-container-lowest shadow-lift ${cfg.cls} ${className}`}
            initial={cfg.from}
            animate={{ x: 0, y: 0 }}
            exit={cfg.from}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            drag={side === "bottom" ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => side === "bottom" && info.offset.y > 120 && onClose()}
          >
            {children}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
