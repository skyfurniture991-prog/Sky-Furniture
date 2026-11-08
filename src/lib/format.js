export const formatPrice = (n) => "Rp " + Math.round(n || 0).toLocaleString("id-ID");

export const formatDate = (date, opts = { day: "numeric", month: "short", year: "numeric" }) =>
  new Date(date).toLocaleDateString("id-ID", opts);

export const formatDateTime = (date) =>
  new Date(date).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const timeAgo = (days) => {
  if (days <= 0) return "Hari ini";
  if (days < 7) return `${days} hari lalu`;
  if (days < 30) return `${Math.round(days / 7)} minggu lalu`;
  return `${Math.round(days / 30)} bulan lalu`;
};
