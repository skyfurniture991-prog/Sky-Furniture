import { PRODUCTS, categoryName } from "../data/products";

export const normalize = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const haystack = (p) =>
  normalize(
    [
      p.name,
      p.subtitle,
      p.description,
      categoryName(p.category),
      p.material,
      ...p.materials,
      ...p.colors.map((c) => c.name),
    ].join(" ")
  );

const INDEX = PRODUCTS.map((p) => ({ p, hay: haystack(p), name: normalize(p.name) }));

/** Pencarian sederhana: semua kata kunci harus cocok; kecocokan di nama diberi bobot lebih. */
export function searchProducts(query, limit = Infinity) {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (!tokens.length) return PRODUCTS.slice(0, limit);

  return INDEX.map(({ p, hay, name }) => {
    let score = 0;
    for (const t of tokens) {
      if (!hay.includes(t)) return null;
      score += name.includes(t) ? 3 : 1;
      if (name.startsWith(t)) score += 1;
    }
    return { p, score };
  })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}
