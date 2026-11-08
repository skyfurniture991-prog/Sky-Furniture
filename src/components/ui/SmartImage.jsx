import { useCallback, useState } from "react";
import Icon from "./Icon";

/**
 * Gambar dengan skeleton shimmer saat memuat dan fallback elegan bila gagal / kosong.
 * `className` diterapkan pada pembungkus (atur ukuran/aspect di sana).
 */
export default function SmartImage({
  src,
  alt = "",
  className = "",
  imgClassName = "",
  imgStyle,
  fallbackIcon = "chair",
  priority = false,
  ...rest
}) {
  const [state, setState] = useState(src ? "loading" : "error");
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setState(src ? "loading" : "error");
  }

  const imgRef = useCallback((el) => {
    if (el && el.complete && el.naturalWidth > 0) setState("loaded");
  }, []);

  return (
    <div className={`relative overflow-hidden bg-surface-container ${className}`}>
      {state === "loading" && <div className="skeleton absolute inset-0" />}
      {state === "error" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-surface-container to-surface-container-high text-outline">
          <Icon name={fallbackIcon} className="text-4xl opacity-60" />
          <span className="text-[11px] font-label-sm uppercase tracking-wider opacity-70">Sky Furniture</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          onLoad={() => setState("loaded")}
          onError={() => setState("error")}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            state === "loaded" ? "opacity-100" : "opacity-0"
          } ${imgClassName}`}
          style={imgStyle}
          {...rest}
        />
      )}
    </div>
  );
}
