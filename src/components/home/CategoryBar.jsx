import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CATEGORIES_BAR, waLink } from "../../data/store";
import Icon from "../ui/Icon";
import { Stagger, StaggerItem } from "../ui/Reveal";

export default function CategoryBar() {
  return (
    <section className="bg-surface-container-lowest py-10">
      <div className="container-page">
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="eyebrow !text-outline">Kategori Pilihan</p>
          <Link to="/katalog" className="flex items-center gap-1 text-label-lg font-label-lg text-primary hover:underline">
            Semua Tipe
            <Icon name="arrow_forward" className="text-lg" />
          </Link>
        </div>
        <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-5" gap={0.07}>
          {CATEGORIES_BAR.map((cat) => {
            const custom = cat.id === "custom";
            const cls = custom
              ? "border-dashed border-secondary/60 bg-secondary-fixed/30 hover:bg-secondary-fixed/50"
              : cat.featured
              ? "border-2 border-primary-container/70 bg-surface-container-low"
              : "border-outline-variant/50 bg-surface hover:border-primary-container/50 hover:bg-surface-container-low";
            const iconCls = custom
              ? "bg-secondary text-on-secondary"
              : cat.featured
              ? "bg-primary-container text-on-primary"
              : "bg-surface-container text-primary group-hover:bg-primary-container group-hover:text-on-primary";

            const body = (
              <>
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${iconCls}`}>
                  <Icon name={cat.icon} className="text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                </span>
                <div className="min-w-0">
                  <p className={`truncate text-sm font-semibold ${custom ? "text-on-secondary-container" : cat.featured ? "font-bold text-primary" : "text-on-surface"}`}>
                    {cat.name}
                  </p>
                  <p className={`truncate text-xs ${custom ? "text-secondary" : "text-outline"}`}>{cat.sub}</p>
                </div>
              </>
            );

            return (
              <StaggerItem key={cat.id}>
                <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}>
                  {custom ? (
                    <a
                      href={waLink("Halo, saya ingin pesan sofa custom.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center gap-3 rounded-xl border p-3 transition-colors ${cls}`}
                    >
                      {body}
                    </a>
                  ) : (
                    <Link to={`/katalog?kategori=${cat.id}`} className={`group flex items-center gap-3 rounded-xl border p-3 transition-colors ${cls}`}>
                      {body}
                    </Link>
                  )}
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
