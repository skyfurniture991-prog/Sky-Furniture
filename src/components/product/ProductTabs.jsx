import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SHIPPING_METHODS } from "../../data/store";
import { getReviews } from "../../data/products";
import { formatPrice } from "../../lib/format";
import Icon from "../ui/Icon";
import ReviewsSection from "./ReviewsSection";
import { TAB_IDS } from "./tabIds";

function Description({ product }) {
  const highlights = [
    { icon: "architecture", title: "Rancangan Presisi", text: "Setiap sambungan dikerjakan dengan dowel dan lem PVAc untuk rangka yang tidak berderit." },
    { icon: "water_drop", title: "Kain Tahan Serat & Adem", text: "Tekstur kain bernapas sehingga tetap sejuk saat diduduki berjam-jam." },
    { icon: "recycling", title: "Cover Bisa Diganti", text: "Pilih bahan dan warna sesuai selera, selisih harga dihitung otomatis." },
    { icon: "support_agent", title: "Konsultasi Gratis", text: "Desainer kami siap membantu menyesuaikan ukuran dengan ruangan Anda." },
  ];
  return (
    <div className="max-w-4xl space-y-6">
      <p className="text-body-lg text-on-surface-variant">{product.about}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {highlights.map((h) => (
          <div key={h.title} className="rounded-xl border border-outline-variant/40 bg-surface-container-low/50 p-5">
            <Icon name={h.icon} className="mb-2 text-3xl text-primary" />
            <h3 className="mb-1 text-title-md font-title-md text-on-surface">{h.title}</h3>
            <p className="text-body-md text-on-surface-variant">{h.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Specs({ product }) {
  return (
    <div className="max-w-4xl overflow-hidden rounded-xl border border-outline-variant/40">
      <table className="w-full border-collapse text-left">
        <tbody>
          {product.specs.map((spec, i) => (
            <tr key={spec.label} className={i % 2 ? "bg-surface-container-low/50" : ""}>
              <th className="w-1/3 px-5 py-3.5 align-top text-label-lg font-label-lg text-on-surface">{spec.label}</th>
              <td className="px-5 py-3.5 text-body-md text-on-surface-variant">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Shipping() {
  return (
    <div className="max-w-4xl space-y-5">
      <p className="text-body-md text-on-surface-variant">
        Sofa dikirim dengan armada interior khusus berpenutup terpal tebal dan tim perakit profesional agar tiba tanpa cacat.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {SHIPPING_METHODS.map((m) => (
          <div key={m.id} className="rounded-xl border border-outline-variant/40 bg-surface-container-low/50 p-5">
            <Icon name={m.icon} className="mb-2 text-3xl text-primary" />
            <p className="text-title-md font-title-md text-on-surface">{m.name}</p>
            <p className="mt-1 text-body-sm text-on-surface-variant">{m.desc}</p>
            <p className="mt-3 text-title-md font-title-md text-primary">
              {formatPrice(m.price)}
              {m.freeAbove && <span className="ml-1 text-body-sm font-normal text-success">(gratis di atas {formatPrice(m.freeAbove)})</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductTabs({ product, active, onChange }) {
  const baseReviews = useMemo(() => getReviews(product), [product]);

  const tabs = [
    { id: TAB_IDS.description, label: "Deskripsi" },
    { id: TAB_IDS.specs, label: "Spesifikasi" },
    { id: TAB_IDS.shipping, label: "Pengiriman" },
    { id: TAB_IDS.reviews, label: `Ulasan (${product.reviewCount})` },
  ];

  return (
    <section id="detail-tabs" className="mt-16 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-soft lg:p-10">
      <div className="no-scrollbar -mx-2 flex gap-2 overflow-x-auto border-b border-outline-variant/40 px-2" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative whitespace-nowrap px-4 pb-3.5 pt-1 text-title-md font-title-md transition-colors ${
              active === tab.id ? "text-primary" : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {tab.label}
            {active === tab.id && (
              <motion.span
                layoutId="product-tab-underline"
                className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary-container"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="py-8" role="tabpanel">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {active === TAB_IDS.description && <Description product={product} />}
            {active === TAB_IDS.specs && <Specs product={product} />}
            {active === TAB_IDS.shipping && <Shipping />}
            {active === TAB_IDS.reviews && <ReviewsSection product={product} baseReviews={baseReviews} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
