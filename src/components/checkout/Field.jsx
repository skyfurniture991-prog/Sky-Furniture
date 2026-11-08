import { AnimatePresence, motion } from "framer-motion";
import { useCheckout } from "../../contexts/CheckoutContext";
import Icon from "../ui/Icon";

export function FieldShell({ id, label, required, error, hint, className = "", children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-label-lg font-label-lg text-on-surface">
        {label}
        {required && <span className="ml-0.5 text-error">*</span>}
      </label>
      {children}
      <AnimatePresence initial={false} mode="wait">
        {error ? (
          <motion.p
            key="err"
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 flex items-start gap-1 text-body-sm text-error"
          >
            <Icon name="error" className="mt-0.5 text-base" />
            {error}
          </motion.p>
        ) : hint ? (
          <p key="hint" className="mt-1.5 text-body-sm text-outline">
            {hint}
          </p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** Input teks yang terhubung ke CheckoutContext (nilai, validasi, touched). */
export function TextField({ name, label, required, hint, prefix, className, as = "input", transform, ...rest }) {
  const { form, setField, touch, errorFor } = useCheckout();
  const id = `ck-${name}`;
  const error = errorFor(name);
  const Tag = as;
  const input = (
    <Tag
      id={id}
      data-field={name}
      value={form[name]}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      onChange={(e) => setField(name, transform ? transform(e.target.value) : e.target.value)}
      onBlur={() => touch(name)}
      className={`field ${prefix ? "rounded-l-none" : ""} ${as === "textarea" ? "resize-none" : ""} ${error ? "field-error" : ""}`}
      {...rest}
    />
  );
  return (
    <FieldShell id={id} label={label} required={required} error={error} hint={hint} className={className}>
      {prefix ? (
        <div className="flex">
          <span className="flex items-center rounded-l-lg border border-r-0 border-outline-variant/70 bg-surface-container px-3 text-body-md text-on-surface-variant">
            {prefix}
          </span>
          {input}
        </div>
      ) : (
        input
      )}
    </FieldShell>
  );
}
