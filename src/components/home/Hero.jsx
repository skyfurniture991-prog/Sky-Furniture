import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { PRODUCT_BY_ID } from "../../data/products";
import { HERO_DATA, waLink } from "../../data/store";
import { EASE } from "../../lib/motion";
import { formatPrice } from "../../lib/format";
import Icon from "../ui/Icon";
import { CountUp } from "../ui/AnimatedNumber";
import SmartImage from "../ui/SmartImage";
import RatingStars from "../product/RatingStars";

const HIGHLIGHT = new Set(["Biru", "Langit", "Mahoni", "Alami"]);

function AnimatedTitle({ text }) {
  const words = text.split(" ");
  return (
    <h1 className="font-headline-xl text-4xl leading-[1.1] text-on-background sm:text-5xl xl:text-[3.5rem]" aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden="true">
          <motion.span
            className={`inline-block ${HIGHLIGHT.has(w) ? "bg-gradient-to-r from-primary-container to-tertiary-fixed-dim bg-clip-text text-transparent" : ""}`}
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.05 }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);
  const blobY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 160]);

  const featured = PRODUCT_BY_ID[HERO_DATA.floatingProductId];

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-surface-container-lowest via-surface to-surface-container-low pb-24 pt-10 lg:pb-32 lg:pt-14">
      <motion.div style={{ y: blobY }} aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
          className="absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-primary-container/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
          className="absolute -left-32 top-1/2 h-96 w-96 rounded-full bg-secondary-container/25 blur-3xl"
        />
        <div className="dots-bg absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
      </motion.div>

      <div className="container-page relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <motion.div style={{ y: textY }} className="flex flex-col items-start space-y-6 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex items-center gap-2 rounded-full border border-outline-variant/50 bg-surface-container-lowest/80 px-3.5 py-1.5 text-primary shadow-soft backdrop-blur"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-container opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-container" />
              </span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider">{HERO_DATA.badge}</span>
            </motion.div>

            <AnimatedTitle text={HERO_DATA.title} />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
              className="max-w-lg text-body-lg text-on-surface-variant"
            >
              {HERO_DATA.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.85 }}
              className="flex w-full flex-wrap items-center gap-3 pt-2 sm:w-auto"
            >
              <Link to="/katalog" className="btn-primary group w-full !px-7 !py-3.5 sm:w-auto">
                Lihat Katalog Lengkap
                <Icon name="arrow_forward" className="text-xl transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={waLink("Halo, saya ingin konsultasi custom sofa.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full !px-6 !py-3.5 sm:w-auto"
              >
                <Icon name="tune" className="text-xl text-primary" />
                Konsultasi Custom
              </a>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05, duration: 0.8 }}
              className="grid w-full grid-cols-3 gap-4 border-t border-outline-variant/40 pt-6"
            >
              {HERO_DATA.stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-headline-md text-2xl text-primary">
                    <CountUp to={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} />
                  </dd>
                  <p className="text-label-sm font-label-sm text-outline">{s.label}</p>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
            className="relative lg:col-span-7"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-outline-variant/40 shadow-lift lg:aspect-[16/11]">
              <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0 -top-8 h-[calc(100%+4rem)]">
                <SmartImage src={HERO_DATA.image} alt="Ruang tamu mewah dengan sofa biru langit" className="h-full w-full" priority />
              </motion.div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-inverse-surface/40 via-transparent to-transparent" />
              <div className="glass absolute left-4 top-4 flex items-center gap-2 rounded-full px-3.5 py-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-surface-tint" />
                <span className="font-label-sm text-label-sm text-primary">Katalog Unggulan {new Date().getFullYear()}</span>
              </div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                className="absolute right-5 top-5 hidden items-center gap-2.5 rounded-full bg-inverse-surface/85 px-4 py-2 text-inverse-on-surface shadow-lift backdrop-blur-md md:flex"
              >
                <Icon name="view_in_ar" className="text-lg text-tertiary-fixed-dim" />
                <span className="font-label-sm text-xs">Cek muat ruangan di tiap produk</span>
              </motion.div>
            </div>

            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
                className="mt-4 sm:absolute sm:-bottom-10 sm:-left-8 sm:mt-0"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Link
                    to={`/produk/${featured.slug}`}
                    className="glass flex max-w-sm items-center gap-4 rounded-2xl p-4 shadow-lift"
                  >
                    <SmartImage src={featured.image} alt={featured.name} className="h-20 w-20 shrink-0 rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 flex items-center gap-1.5 text-xs">
                        <RatingStars rating={featured.rating} size="xs" />
                        <span className="font-label-sm text-secondary">{featured.soldCount}+ terjual</span>
                      </div>
                      <h4 className="truncate text-title-md font-title-md text-on-surface">{featured.name}</h4>
                      <p className="font-headline-sm text-lg font-bold text-primary">{formatPrice(featured.price)}</p>
                      <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-label-sm text-secondary">
                        Lihat Detail <Icon name="arrow_forward" className="text-sm" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
