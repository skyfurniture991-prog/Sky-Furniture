import { TRUST_ITEMS } from "../../data/store";
import Icon from "../ui/Icon";

/** Pita berjalan berisi jaminan toko; berhenti saat di-hover. */
export default function TrustMarquee() {
  return (
    <div className="marquee overflow-hidden border-y border-outline-variant/30 bg-surface-container-lowest py-4" aria-label="Keunggulan Sky Furniture">
      <div className="marquee-track">
        {[0, 1].map((dup) => (
          <ul key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
            {TRUST_ITEMS.map((item) => (
              <li key={item.text} className="flex shrink-0 items-center gap-2.5 px-8 text-label-lg font-label-lg text-on-surface-variant">
                <Icon name={item.icon} className="text-xl text-primary-container" />
                {item.text}
                <span className="ml-8 h-1.5 w-1.5 rounded-full bg-outline-variant" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
