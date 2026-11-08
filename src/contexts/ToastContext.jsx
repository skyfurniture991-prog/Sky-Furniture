/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback(
    ({ type = "success", title, message, action, duration = 3800 }) => {
      const id = ++idRef.current;
      setToasts((t) => [...t.slice(-3), { id, type, title, message, action }]);
      if (duration) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      toast: push,
      success: (title, message, action) => push({ type: "success", title, message, action }),
      error: (title, message) => push({ type: "error", title, message }),
      info: (title, message, action) => push({ type: "info", title, message, action }),
    }),
    [push]
  );

  const value = useMemo(() => ({ ...api, toasts, dismiss }), [api, toasts, dismiss]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
