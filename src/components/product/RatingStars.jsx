import Icon from "../ui/Icon";

const SIZES = { xs: "text-[14px]", sm: "text-base", md: "text-lg", lg: "text-xl", xl: "text-2xl" };

/** Bintang rating (mendukung setengah bintang). */
export default function RatingStars({ rating, size = "sm", className = "" }) {
  const cls = `text-amber-500 ${SIZES[size]}`;
  return (
    <div className={`inline-flex items-center ${className}`} role="img" aria-label={`Rating ${rating} dari 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        const diff = rating - i;
        if (diff >= 0.75) return <Icon key={i} name="star" fill className={cls} />;
        if (diff >= 0.25) return <Icon key={i} name="star_half" fill className={cls} />;
        return <Icon key={i} name="star" className={`${cls} opacity-40`} />;
      })}
    </div>
  );
}
