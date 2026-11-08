import { useEffect } from "react";

const BASE = "Sky Furniture";

/** Mengatur judul tab browser per halaman. */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : `${BASE} - Sofa Premium Jepara`;
  }, [title]);
}
