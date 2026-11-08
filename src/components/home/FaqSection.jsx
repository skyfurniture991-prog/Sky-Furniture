import { FAQS, waLink } from "../../data/store";
import Accordion from "../ui/Accordion";
import Icon from "../ui/Icon";
import { Reveal } from "../ui/Reveal";

export default function FaqSection() {
  return (
    <section className="border-t border-outline-variant/30 bg-surface-container-low py-16 lg:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <span className="eyebrow">Pertanyaan Umum</span>
          <h2 className="mt-2 font-headline-lg text-headline-lg text-balance text-on-background sm:text-4xl">Ada yang ingin ditanyakan?</h2>
          <p className="mt-3 text-body-md text-on-surface-variant">
            Jawaban singkat seputar produksi, pengiriman, garansi, dan pemesanan custom. Belum menemukan jawabannya?
          </p>
          <a href={waLink("Halo, saya punya pertanyaan.")} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6">
            <Icon name="chat" className="text-xl" />
            Tanya via WhatsApp
          </a>
        </Reveal>
        <Reveal className="lg:col-span-8" delay={0.1}>
          <Accordion items={FAQS} />
        </Reveal>
      </div>
    </section>
  );
}
