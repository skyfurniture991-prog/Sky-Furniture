import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function Breadcrumb({ items, className = "" }) {
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1.5 text-body-sm text-outline ${className}`}>
      {items.map((item, idx) => (
        <span key={idx} className="flex min-w-0 items-center gap-1.5">
          {idx > 0 && <Icon name="chevron_right" className="text-base text-outline-variant" />}
          {item.href ? (
            <Link to={item.href} className="flex items-center gap-1 transition-colors hover:text-primary">
              {item.icon && <Icon name={item.icon} className="text-[18px]" />}
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="truncate font-medium text-on-surface">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
