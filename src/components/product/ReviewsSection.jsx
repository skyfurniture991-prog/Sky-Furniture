import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getRatingDistribution } from "../../data/products";
import { useToast } from "../../contexts/ToastContext";
import { timeAgo } from "../../lib/format";
import { useLocalStorage } from "../../lib/useLocalStorage";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import RatingStars from "./RatingStars";

const AVATAR_STYLES = [
  ["bg-primary-fixed", "text-primary"],
  ["bg-secondary-fixed", "text-secondary"],
  ["bg-tertiary-fixed", "text-tertiary"],
];

const initialsOf = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join("");

function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label="Beri rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} bintang`}
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.15 }}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className="text-amber-500"
        >
          <Icon name="star" fill={n <= shown} className={`text-3xl ${n <= shown ? "" : "opacity-40"}`} />
        </motion.button>
      ))}
    </div>
  );
}

function ReviewForm({ onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (name.trim().length < 2) err.name = "Nama minimal 2 karakter.";
    if (!rating) err.rating = "Pilih jumlah bintang.";
    if (comment.trim().length < 10) err.comment = "Ulasan minimal 10 karakter.";
    setErrors(err);
    if (Object.keys(err).length) return;
    onSubmit({ name: name.trim(), rating, comment: comment.trim() });
  };

  return (
    <motion.form
      onSubmit={submit}
      noValidate
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="space-y-4 rounded-xl border border-outline-variant/40 bg-surface-container-low/50 p-5">
        <div>
          <p className="mb-1 text-label-lg font-label-lg text-on-surface">Rating Anda</p>
          <StarInput value={rating} onChange={setRating} />
          {errors.rating && <p className="mt-1 text-body-sm text-error">{errors.rating}</p>}
        </div>
        <div>
          <label className="mb-1 block text-label-lg font-label-lg text-on-surface" htmlFor="rv-name">Nama</label>
          <input id="rv-name" value={name} onChange={(e) => setName(e.target.value)} className={`field ${errors.name ? "field-error" : ""}`} placeholder="Nama Anda" />
          {errors.name && <p className="mt-1 text-body-sm text-error">{errors.name}</p>}
        </div>
        <div>
          <label className="mb-1 block text-label-lg font-label-lg text-on-surface" htmlFor="rv-comment">Ulasan</label>
          <textarea
            id="rv-comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={`field resize-none ${errors.comment ? "field-error" : ""}`}
            placeholder="Ceritakan pengalaman Anda: kenyamanan, kualitas, pengiriman..."
          />
          {errors.comment && <p className="mt-1 text-body-sm text-error">{errors.comment}</p>}
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary !py-2.5">Kirim Ulasan</button>
          <button type="button" onClick={onCancel} className="btn-secondary !py-2.5">Batal</button>
        </div>
      </div>
    </motion.form>
  );
}

export default function ReviewsSection({ product, baseReviews }) {
  const toast = useToast();
  const [stored, setStored] = useLocalStorage("sky.reviews.v1", {});
  const [writing, setWriting] = useState(false);

  const mine = useMemo(() => stored[product.id] ?? [], [stored, product.id]);
  const reviews = useMemo(() => [...mine, ...baseReviews], [mine, baseReviews]);

  const total = product.reviewCount + mine.length;
  const avg = useMemo(() => {
    if (!mine.length) return product.rating;
    const sum = product.rating * product.reviewCount + mine.reduce((s, r) => s + r.rating, 0);
    return sum / total;
  }, [mine, product.rating, product.reviewCount, total]);
  const distribution = getRatingDistribution(avg);

  const submit = (data) => {
    const review = { ...data, id: `u-${Date.now()}`, daysAgo: 0, verified: false };
    setStored((prev) => ({ ...prev, [product.id]: [review, ...(prev[product.id] ?? [])] }));
    setWriting(false);
    toast.success("Terima kasih atas ulasan Anda!", "Ulasan sudah ditampilkan di halaman produk.");
  };

  return (
    <div className="space-y-8">
      <div className="grid items-center gap-8 md:grid-cols-[240px_1fr_auto]">
        <div className="text-center md:text-left">
          <p className="font-headline-xl text-6xl font-semibold text-on-surface">{avg.toFixed(1)}</p>
          <RatingStars rating={avg} size="lg" className="mt-1" />
          <p className="mt-1 text-body-sm text-outline">dari {total} ulasan pembeli</p>
        </div>
        <div className="space-y-1.5">
          {distribution.map((d) => (
            <div key={d.stars} className="flex items-center gap-3 text-body-sm">
              <span className="flex w-8 items-center gap-0.5 text-on-surface-variant">
                {d.stars}
                <Icon name="star" fill className="text-sm text-amber-500" />
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container">
                <motion.div
                  className="h-full rounded-full bg-amber-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${d.share * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: (5 - d.stars) * 0.07 }}
                />
              </div>
              <span className="w-10 text-right tabular-nums text-outline">{Math.round(d.share * 100)}%</span>
            </div>
          ))}
        </div>
        <button onClick={() => setWriting((w) => !w)} className="btn-secondary self-start md:self-center">
          <Icon name={writing ? "close" : "edit"} className="text-xl" />
          {writing ? "Tutup Form" : "Tulis Ulasan"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {writing && <ReviewForm onSubmit={submit} onCancel={() => setWriting(false)} />}
      </AnimatePresence>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence initial={false}>
          {reviews.map((review, i) => {
            const [bg, text] = review.avatarBg ? [review.avatarBg, review.avatarText] : AVATAR_STYLES[i % 3];
            return (
              <motion.article
                key={review.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-3 rounded-xl border border-outline-variant/40 bg-surface-container-low/40 p-5"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${bg} ${text}`}>
                    {review.initials ?? initialsOf(review.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-label-lg font-label-lg text-on-surface">{review.name}</p>
                    <div className="flex items-center gap-2">
                      <RatingStars rating={review.rating} size="xs" />
                      <span className="text-[11px] text-outline">{timeAgo(review.daysAgo)}</span>
                    </div>
                  </div>
                  {review.verified !== false && (
                    <span className="flex items-center gap-0.5 text-[11px] font-label-sm text-success" title="Pembeli terverifikasi">
                      <Icon name="verified" fill className="text-base" />
                      Terverifikasi
                    </span>
                  )}
                </div>
                <p className="text-body-sm text-on-surface-variant">&ldquo;{review.comment}&rdquo;</p>
                {review.city && <p className="text-[11px] text-outline">📍 {review.city}</p>}
                {review.image && <SmartImage src={review.image} alt="Foto ulasan pelanggan" className="h-32 rounded-lg" />}
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
