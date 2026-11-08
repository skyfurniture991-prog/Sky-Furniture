import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import Icon from "../ui/Icon";

const TONES = {
  success: { icon: "check_circle", cls: "text-success" },
  error: { icon: "error", cls: "text-error" },
  info: { icon: "info", cls: "text-primary" },
};

export default function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[150] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:items-start"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const tone = TONES[t.type] ?? TONES.info;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-4 shadow-lift"
            >
              <Icon name={tone.icon} fill className={`mt-0.5 text-2xl ${tone.cls}`} />
              <div className="min-w-0 flex-1">
                <p className="text-label-lg font-label-lg text-on-surface">{t.title}</p>
                {t.message && <p className="mt-0.5 text-body-sm text-on-surface-variant">{t.message}</p>}
                {t.action &&
                  (t.action.to ? (
                    <Link
                      to={t.action.to}
                      onClick={() => dismiss(t.id)}
                      className="mt-1.5 inline-block text-label-md font-label-md text-primary hover:underline"
                    >
                      {t.action.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        t.action.onClick?.();
                        dismiss(t.id);
                      }}
                      className="mt-1.5 text-label-md font-label-md text-primary hover:underline"
                    >
                      {t.action.label}
                    </button>
                  ))}
              </div>
              <button onClick={() => dismiss(t.id)} aria-label="Tutup" className="text-outline transition hover:text-on-surface">
                <Icon name="close" className="text-lg" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
