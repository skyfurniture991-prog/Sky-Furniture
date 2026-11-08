import { motion } from "framer-motion";
import { REVIEW_POOL } from "../../data/products";
import Icon from "../ui/Icon";
import { Reveal, Stagger, StaggerItem } from "../ui/Reveal";
import RatingStars from "../product/RatingStars";

export default function Testimonials() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-page">
        <Reveal className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">Kata Pelanggan</span>
            <h2 className="mt-2 font-headline-lg text-headline-lg text-balance text-on-background sm:text-4xl">
              Dipercaya Ribuan Keluarga Indonesia
            </h2>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest px-5 py-3 shadow-soft">
            <span className="font-headline-lg text-4xl font-semibold text-primary">4.9</span>
            <div>
              <RatingStars rating={4.9} />
              <p className="text-[11px] text-outline">dari 1.200+ ulasan terverifikasi</p>
            </div>
          </div>
        </Reveal>

        <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" gap={0.09}>
          {REVIEW_POOL.map((r) => (
            <StaggerItem key={r.name}>
              <motion.figure
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-soft"
              >
                <Icon name="format_quote" fill className="absolute -right-1 -top-2 text-8xl text-surface-container-high" />
                <RatingStars rating={r.rating} />
                <blockquote className="relative flex-1 text-body-md text-on-surface-variant">&ldquo;{r.comment}&rdquo;</blockquote>
                <figcaption className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${r.avatarBg} ${r.avatarText}`}>
                    {r.initials}
                  </span>
                  <span>
                    <span className="block text-label-lg font-label-lg text-on-surface">{r.name}</span>
                    <span className="flex items-center gap-1 text-[11px] text-outline">
                      <Icon name="location_on" className="text-sm" />
                      {r.city}
                      <Icon name="verified" fill className="ml-1 text-sm text-success" />
                      Pembeli terverifikasi
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
