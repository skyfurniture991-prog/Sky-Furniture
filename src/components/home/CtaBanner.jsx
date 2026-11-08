import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { waLink } from "../../data/store";
import Icon from "../ui/Icon";
import { Reveal } from "../ui/Reveal";

export default function CtaBanner() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-primary py-20 lg:py-28">
      <motion.div style={{ y: y1 }} aria-hidden="true" className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-on-primary/10 blur-3xl" />
      <motion.div style={{ y: y2 }} aria-hidden="true" className="pointer-events-none absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-secondary-container/20 blur-3xl" />
      <div className="container-page relative text-center">
        <Reveal>
          <h2 className="font-headline-lg text-4xl text-on-primary text-balance sm:text-5xl">Siap Wujudkan Ruang Impian Anda?</h2>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-on-primary/80">
            Konsultasi gratis dengan desainer kami. Bawa foto ruang tamu Anda dan kami bantu pilih sofa yang sempurna.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href={waLink("Halo, saya ingin konsultasi desain ruang tamu.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn bg-on-primary !px-8 !py-3.5 text-primary shadow-lift hover:-translate-y-0.5 hover:brightness-95"
          >
            <Icon name="chat" className="text-xl" />
            Chat via WhatsApp
          </a>
          <Link to="/katalog" className="btn border-2 border-on-primary/70 !px-8 !py-3.5 text-on-primary hover:bg-on-primary/10">
            <Icon name="grid_view" className="text-xl" />
            Lihat Katalog
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
