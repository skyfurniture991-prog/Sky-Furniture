/** Pembungkus Material Symbols agar pemakaian ikon konsisten. */
export default function Icon({ name, fill = false, className = "", style, ...rest }) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined select-none ${className}`}
      style={fill ? { fontVariationSettings: "'FILL' 1", ...style } : style}
      {...rest}
    >
      {name}
    </span>
  );
}
