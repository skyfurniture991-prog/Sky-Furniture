import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getBonusProduct } from "../../data/products";
import Icon from "../ui/Icon";
import { Modal } from "../ui/Modal";
import SmartImage from "../ui/SmartImage";
import WishlistButton from "./WishlistButton";

const VIRTUAL_VIEWS = [
  { label: "Tampak utama", scale: 1, origin: "50% 50%" },
  { label: "Detail kain", scale: 1.9, origin: "50% 55%" },
  { label: "Detail sandaran", scale: 1.9, origin: "78% 30%" },
  { label: "Detail kaki", scale: 1.9, origin: "22% 85%" },
];

function buildViews(product) {
  if (product.gallery?.length > 1) {
    return product.gallery.map((src, i) => ({ src, label: `Tampak ${i + 1}`, scale: 1, origin: "50% 50%" }));
  }
  return VIRTUAL_VIEWS.map((v) => ({ ...v, src: product.image }));
}

function Lightbox({ views, index, onChange, name }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") onChange((index + 1) % views.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + views.length) % views.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, views.length, onChange]);

  const view = views[index];
  const go = (d) => onChange((index + d + views.length) % views.length);

  return (
    <div className="relative bg-inverse-surface">
      <div className="relative flex h-[70vh] items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="h-full w-full cursor-grab active:cursor-grabbing"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) go(1);
              else if (info.offset.x > 80) go(-1);
            }}
          >
            <img
              src={view.src}
              alt={`${name} - ${view.label}`}
              draggable={false}
              className="h-full w-full object-contain"
              style={{ transform: `scale(${view.scale})`, transformOrigin: view.origin }}
            />
          </motion.div>
        </AnimatePresence>
        {[-1, 1].map((d) => (
          <button
            key={d}
            onClick={() => go(d)}
            aria-label={d > 0 ? "Gambar berikutnya" : "Gambar sebelumnya"}
            className={`absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 ${
              d > 0 ? "right-4" : "left-4"
            }`}
          >
            <Icon name={d > 0 ? "chevron_right" : "chevron_left"} className="text-3xl" />
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between px-5 py-3 text-sm text-inverse-on-surface">
        <span>{view.label}</span>
        <span className="tabular-nums opacity-70">
          {index + 1} / {views.length}
        </span>
      </div>
    </div>
  );
}

export default function ProductGallery({ product }) {
  const views = useMemo(() => buildViews(product), [product]);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(null);
  const [lightbox, setLightbox] = useState(false);
  const bonus = getBonusProduct(product);
  const view = views[index];

  const onMove = (e) => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="flex flex-col gap-4 lg:col-span-7">
      <div
        className="group relative cursor-zoom-in overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-soft"
        onMouseMove={onMove}
        onMouseLeave={() => setZoom(null)}
        onClick={() => setLightbox(true)}
      >
        <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-col items-start gap-2">
          {product.badge && (
            <span className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-label-sm font-label-sm shadow-soft ${product.badge.color} ${product.badge.textColor}`}>
              <Icon name="verified" fill className="text-[14px]" />
              {product.badge.text}
            </span>
          )}
          {bonus && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-secondary px-3 py-1 text-label-sm font-label-sm text-on-secondary shadow-soft">
              <Icon name="card_giftcard" className="text-[14px]" />
              Gratis {bonus.name}
            </span>
          )}
        </div>

        <div className="absolute right-4 top-4 z-10 flex gap-2">
          <WishlistButton
            product={product}
            className="h-10 w-10 rounded-full bg-surface-container-lowest/90 text-outline shadow-soft backdrop-blur hover:text-error"
          />
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-lowest/90 text-primary shadow-soft backdrop-blur">
            <Icon name="zoom_in" className="text-xl" />
          </span>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container-low">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <SmartImage
                src={view.src}
                alt={`${product.name} - ${view.label}`}
                className="h-full w-full"
                imgClassName="!transition-transform duration-200 ease-out"
                imgStyle={{
                  transform: `scale(${view.scale * (zoom ? 1.6 : 1)})`,
                  transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : view.origin,
                }}
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-4 lg:grid-cols-5">
        {views.map((v, i) => (
          <button
            key={v.label}
            onClick={() => setIndex(i)}
            aria-label={v.label}
            aria-current={i === index}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-outline-variant/40"
          >
            <SmartImage
              src={v.src}
              alt={v.label}
              className="h-full w-full"
              imgClassName="transition-transform duration-500 group-hover:scale-110"
              imgStyle={{ transform: `scale(${v.scale})`, transformOrigin: v.origin }}
            />
            {i === index ? (
              <motion.span
                layoutId="gallery-thumb-ring"
                className="absolute inset-0 rounded-lg border-2 border-primary-container"
                transition={{ type: "spring", stiffness: 500, damping: 36 }}
              />
            ) : (
              <span className="absolute inset-0 bg-surface-container-lowest/30 transition-opacity group-hover:opacity-0" />
            )}
          </button>
        ))}
      </div>

      <Modal open={lightbox} onClose={() => setLightbox(false)} label="Galeri foto produk" className="max-w-5xl overflow-hidden !p-0">
        <Lightbox views={views} index={index} onChange={setIndex} name={product.name} />
      </Modal>
    </div>
  );
}
