import { motion } from "framer-motion";
import { WHY_US } from "../../data/store";
import Icon from "../ui/Icon";
import { Reveal, Stagger, StaggerItem } from "../ui/Reveal";

export default function WhyUs() {
  return (
    <section className="border-y border-outline-variant/30 bg-surface-container-low py-16 lg:py-24">
      <div className="container-page">
        <Reveal className="mb-12 text-center">
          <span className="eyebrow">Mengapa Memilih Kami</span>
          <h2 className="mt-2 font-headline-lg text-headline-lg text-balance text-on-background sm:text-4xl">
            Standar Premium, Harga Workshop Langsung
          </h2>
        </Reveal>
        <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" gap={0.1}>
          {WHY_US.map((item) => (
            <StaggerItem key={item.title}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group h-full rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 text-center shadow-soft transition-shadow hover:shadow-lift"
              >
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${item.bgColor}`}>
                  <Icon name={item.icon} className={`text-3xl ${item.iconColor}`} />
                </div>
                <h3 className="mb-2 font-headline-sm text-headline-sm text-on-surface">{item.title}</h3>
                <p className="text-body-sm text-on-surface-variant">{item.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
