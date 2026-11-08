import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { PROCESS_STEPS } from "../../data/store";
import Icon from "../ui/Icon";
import { Reveal } from "../ui/Reveal";

export default function ProcessTimeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 65%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <section ref={ref} className="py-16 lg:py-24">
      <div className="container-page">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <span className="eyebrow">Proses Pembuatan</span>
          <h2 className="mt-2 font-headline-lg text-headline-lg text-balance text-on-background sm:text-4xl">
            Dari Workshop Palembang ke Ruang Tamu Anda
          </h2>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Lima langkah transparan, dari konsultasi pertama hingga sofa terpasang rapi di rumah.
          </p>
        </Reveal>

        <div className="relative">
          {/* garis progres: horizontal di desktop, vertikal di mobile */}
          <div className="absolute left-6 top-6 h-[calc(100%-3rem)] w-0.5 bg-outline-variant/50 lg:left-[10%] lg:right-[10%] lg:top-7 lg:h-0.5 lg:w-auto">
            <motion.div
              style={{ scaleY: progress }}
              className="h-full w-full origin-top bg-gradient-to-b from-primary-container to-tertiary-fixed-dim lg:hidden"
            />
            <motion.div
              style={{ scaleX: progress }}
              className="hidden h-full w-full origin-left bg-gradient-to-r from-primary-container to-tertiary-fixed-dim lg:block"
            />
          </div>

          <ol className="relative grid gap-8 lg:grid-cols-5 lg:gap-4">
            {PROCESS_STEPS.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-4 lg:flex-col lg:items-center lg:text-center"
              >
                <motion.span
                  whileHover={{ scale: 1.1, rotate: -6 }}
                  className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-container text-on-primary shadow-glow lg:h-14 lg:w-14"
                >
                  <Icon name={step.icon} className="text-2xl" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-secondary-container text-[11px] font-bold text-on-secondary-container">
                    {i + 1}
                  </span>
                </motion.span>
                <div className="lg:mt-3">
                  <h3 className="text-title-lg font-title-lg text-on-surface">{step.title}</h3>
                  <p className="mt-1 text-body-sm text-on-surface-variant">{step.desc}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
