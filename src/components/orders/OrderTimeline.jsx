import { motion } from "framer-motion";
import { ORDER_STAGES } from "../../data/store";
import { STAGE_INTERVAL_MS, orderStageIndex } from "../../contexts/OrdersContext";
import { formatDateTime } from "../../lib/format";
import { useNow } from "../../lib/useNow";
import { useToast } from "../../contexts/ToastContext";
import Icon from "../ui/Icon";

/** Linimasa status pesanan dengan pelacakan real-time & catatan workshop */
export default function OrderTimeline({ order }) {
  const toast = useToast();
  const now = useNow(5000);
  const current = orderStageIndex(order, now);

  const trackingNum = order.trackingNumber || order.tracking_number || order.shipping?.trackingNumber;
  const latestNote = order.statusNote || order.status_note;

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} disalin`, text);
    } catch {
      toast.info(label, text);
    }
  };

  return (
    <div>
      {/* Box Nomor Resi / Surat Jalan jika sudah diisi Admin */}
      {trackingNum && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-on-primary">
              <Icon name="local_shipping" className="text-lg" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-on-surface-variant">
                Nomor Resi / Surat Jalan ({order.shipping?.name || "Sky Direct"})
              </p>
              <p className="font-mono text-sm font-bold text-primary">{trackingNum}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => copy(trackingNum, "Nomor Resi")}
            className="btn-secondary !py-1 !px-2.5 text-xs flex items-center gap-1 shadow-sm"
          >
            <Icon name="content_copy" className="text-xs" />
            Salin Resi
          </button>
        </div>
      )}

      {/* Catatan Terkini dari Workshop jika diupdate Admin */}
      {latestNote && (
        <div className="mb-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-300 mb-1">
            <Icon name="campaign" className="text-base" />
            <span>Update Terkini dari Workshop:</span>
          </div>
          <p className="font-medium text-on-surface pl-5">{latestNote}</p>
        </div>
      )}

      <ol className="relative space-y-1">
        {ORDER_STAGES.map((stage, i) => {
          const done = i < current;
          const active = i === current;
          const reached = i <= current;
          return (
            <motion.li
              key={stage.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {i < ORDER_STAGES.length - 1 && (
                <span className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-0.5 overflow-hidden rounded bg-outline-variant/50">
                  <motion.span
                    className="block w-full bg-primary-container"
                    initial={{ height: 0 }}
                    animate={{ height: done ? "100%" : 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  />
                </span>
              )}
              <span className="relative">
                {active && <span className="absolute inset-0 animate-ping rounded-full bg-primary-container/40" />}
                <span
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    reached ? "bg-primary-container text-on-primary" : "border border-outline-variant bg-surface-container text-outline"
                  }`}
                >
                  <Icon name={done ? "check" : stage.icon} className="text-xl" />
                </span>
              </span>
              <div className="pt-1.5">
                <p className={`text-title-md font-title-md ${reached ? "text-on-surface" : "text-outline"}`}>
                  {stage.label}
                  {active && i < ORDER_STAGES.length - 1 && (
                    <span className="ml-2 rounded-full bg-secondary-container px-2 py-0.5 align-middle text-[10px] font-label-sm uppercase tracking-wider text-on-secondary-container">
                      Saat ini
                    </span>
                  )}
                </p>
                <p className="text-body-sm text-on-surface-variant">{stage.desc}</p>
                {reached && <p className="mt-0.5 text-[11px] text-outline">{formatDateTime(order.createdAt + i * STAGE_INTERVAL_MS)}</p>}
              </div>
            </motion.li>
          );
        })}
      </ol>

      <p className="mt-4 flex items-center gap-1.5 rounded-lg bg-surface-container p-2.5 text-[11px] text-on-surface-variant">
        <Icon name="verified" className="text-sm text-emerald-600" />
        <span>Status pelacakan tersinkronisasi otomatis dengan pembaruan dari tim workshop Sky Furniture.</span>
      </p>
    </div>
  );
}
