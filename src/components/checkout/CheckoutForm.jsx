import { motion } from "framer-motion";
import { PAYMENT_METHODS, PROVINCES, SHIPPING_METHODS, SUMSEL_CITIES } from "../../data/store";
import { codUnavailable, shippingUnavailable, useCheckout } from "../../contexts/CheckoutContext";
import { addDays, formatDate, formatPrice } from "../../lib/format";
import { shippingFee } from "../../lib/pricing";
import Icon from "../ui/Icon";
import { FieldShell, TextField } from "./Field";

function Card({ step, title, done, aside, children }) {
  return (
    <section className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-soft">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <motion.span
            initial={false}
            animate={{ scale: done ? [1, 1.25, 1] : 1 }}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-label-lg font-label-lg transition-colors ${
              done ? "bg-success text-white" : "bg-primary-container text-on-primary"
            }`}
          >
            {done ? <Icon name="check" className="text-xl" /> : step}
          </motion.span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">{title}</h2>
        </div>
        {aside}
      </header>
      {children}
    </section>
  );
}

const digits = (v) => v.replace(/\D/g, "");
const formatCard = (v) => digits(v).slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
const formatExpiry = (v) => {
  const d = digits(v).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

const PAY_TABS = [
  { id: "transfer", label: "Transfer Bank", icon: "account_balance" },
  { id: "ewallet", label: "E-Wallet", icon: "account_balance_wallet" },
  { id: "cod", label: "COD", icon: "payments" },
  { id: "cicilan", label: "Cicilan 0%", icon: "credit_card" },
];

function PaymentOption({ method, selected, disabled, reason, onSelect }) {
  return (
    <label
      className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : selected
          ? "cursor-pointer border-2 border-primary-container bg-primary-container/10"
          : "cursor-pointer border-outline-variant/50 hover:border-primary-container/60"
      }`}
    >
      <input
        type="radio"
        name="paymethod"
        disabled={disabled}
        checked={selected}
        onChange={onSelect}
        className="accent-primary-container"
      />
      <div className="min-w-0 flex-1">
        <p className="text-title-md font-title-md text-on-surface">{method.name}</p>
        <p className="text-body-sm text-on-surface-variant">{disabled ? reason : method.desc}</p>
      </div>
      {method.code ? (
        <span className="rounded bg-primary-container px-3 py-1.5 text-label-sm font-bold text-on-primary">{method.code}</span>
      ) : (
        <Icon name="account_balance" className="text-2xl text-outline" />
      )}
    </label>
  );
}

export default function CheckoutForm({ totals, subtotal, promo }) {
  const { form, errors, errorFor, setField, touch, card, setCardField } = useCheckout();

  const tab = form.payTab;
  const sectionDone = {
    1: !errors.fullName && !errors.phone && !errors.email && form.fullName && form.phone,
    2: !errors.address && !errors.province && !errors.city && !errors.district && !errors.postalCode && !errors.shippingId && form.address && form.province,
    3: !errors.paymentId && !errors.cardNumber && !errors.cardExpiry && !errors.cardCvv,
  };

  const choosePayment = (id) => setField("paymentId", id);
  const cod = codUnavailable(form.province, totals.total);
  const monthly = (term) => totals.total / term;
  const paymentError = errorFor("paymentId");

  return (
    <div className="space-y-6">
      <Card step={1} title="Informasi Penerima" done={!!sectionDone[1]}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField name="fullName" label="Nama Lengkap" required placeholder="Contoh: Dimas Rahardian" autoComplete="name" />
          <TextField
            name="phone"
            label="Nomor WhatsApp / HP"
            required
            prefix="+62"
            type="tel"
            inputMode="tel"
            placeholder="812 3456 7890"
            autoComplete="tel-national"
            transform={(v) => v.replace(/[^\d\s-]/g, "")}
          />
          <TextField
            name="email"
            label="Email (opsional)"
            type="email"
            placeholder="email@contoh.com"
            autoComplete="email"
            className="sm:col-span-2"
            hint="Kami kirim bukti pesanan ke email ini."
          />
        </div>
      </Card>

      <Card step={2} title="Alamat & Pengiriman" done={!!sectionDone[2]}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            name="address"
            label="Nama Jalan / Perumahan"
            required
            placeholder="Jl. Sudirman No. 123, Blok A2, Perumahan Grand Garden"
            autoComplete="street-address"
            className="sm:col-span-2"
          />
          <FieldShell id="ck-province" label="Provinsi" required error={errorFor("province")}>
            <select
              id="ck-province"
              data-field="province"
              value={form.province}
              onChange={(e) => setField("province", e.target.value)}
              onBlur={() => touch("province")}
              className={`field ${errorFor("province") ? "field-error" : ""}`}
            >
              <option value="">Pilih provinsi</option>
              {PROVINCES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label} (Area Layanan)
                </option>
              ))}
            </select>
          </FieldShell>
          <FieldShell id="ck-city" label="Kota / Kabupaten (Sumsel)" required error={errorFor("city")}>
            <select
              id="ck-city"
              data-field="city"
              value={form.city}
              onChange={(e) => setField("city", e.target.value)}
              onBlur={() => touch("city")}
              className={`field ${errorFor("city") ? "field-error" : ""}`}
            >
              <option value="">Pilih Kota / Kabupaten</option>
              {SUMSEL_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FieldShell>
          <TextField name="district" label="Kecamatan" required placeholder="Contoh: Ilir Barat I / Sukarami" />
          <TextField
            name="postalCode"
            label="Kode Pos"
            required
            inputMode="numeric"
            maxLength={5}
            placeholder="30139"
            autoComplete="postal-code"
            transform={digits}
          />
          <TextField
            name="notes"
            as="textarea"
            rows={3}
            label="Catatan untuk Kurir"
            placeholder="Contoh: Rumah di ujung gang, pagar besi merah. Tolong WA dulu sebelum tiba."
            className="sm:col-span-2"
          />
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-label-lg font-label-lg text-on-surface">Layanan Pengiriman</h3>
          <div className="space-y-3" role="radiogroup" aria-label="Layanan pengiriman">
            {SHIPPING_METHODS.map((m) => {
              const reason = shippingUnavailable(m.id, form.province);
              const selected = form.shippingId === m.id;
              const fee = shippingFee(m, subtotal, promo);
              const eta = `${formatDate(addDays(new Date(), m.days[0] + 3), { day: "numeric", month: "short" })} – ${formatDate(
                addDays(new Date(), m.days[1] + 3),
                { day: "numeric", month: "short" }
              )}`;
              return (
                <label
                  key={m.id}
                  className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                    reason
                      ? "cursor-not-allowed opacity-50"
                      : selected
                      ? "cursor-pointer border-2 border-primary-container bg-primary-container/10"
                      : "cursor-pointer border-outline-variant/50 hover:border-primary-container/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    disabled={!!reason}
                    checked={selected}
                    onChange={() => setField("shippingId", m.id)}
                    className="accent-primary-container"
                  />
                  <span className={`hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:flex ${selected ? "bg-primary-container text-on-primary" : "bg-surface-container text-primary"}`}>
                    <Icon name={m.icon} className="text-xl" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-title-md font-title-md text-on-surface">{m.name}</p>
                    <p className="text-body-sm text-on-surface-variant">{reason ?? m.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-title-md font-title-md ${fee === 0 ? "text-success" : "text-on-surface"}`}>
                      {fee === 0 ? "GRATIS" : formatPrice(fee)}
                    </p>
                    <p className="text-label-md font-label-md text-outline">Tiba {eta}</p>
                  </div>
                </label>
              );
            })}
          </div>
          {errorFor("shippingId") && <p className="mt-2 text-body-sm text-error">{errorFor("shippingId")}</p>}
        </div>
      </Card>

      <Card step={3} title="Metode Pembayaran" done={!!sectionDone[3] && !!form.paymentId}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-2 text-xs text-primary">
          <div className="flex items-center gap-2">
            <Icon name="verified_user" className="text-base text-primary" />
            <span className="font-medium">Pembayaran Otomatis Aman via Midtrans</span>
          </div>
          <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-primary">
            QRIS • VA BCA/Mandiri/BNI/BRI • GoPay • ShopeePay
          </span>
        </div>

        <div className="relative mb-6 flex flex-wrap gap-2 border-b border-outline-variant/40 pb-4" role="tablist">
          {PAY_TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setField("payTab", t.id);
                  if (t.id === "cod" || t.id === "cicilan") setField("paymentId", t.id);
                  else if (form.paymentId === "cod" || form.paymentId === "cicilan") setField("paymentId", "");
                }}
                className={`relative flex items-center gap-1.5 rounded-lg px-4 py-2 text-label-lg font-label-lg transition-colors ${
                  active ? "text-on-primary" : "border border-outline-variant/60 text-on-surface-variant hover:border-primary-container hover:text-primary"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="pay-tab"
                    className="absolute inset-0 rounded-lg bg-primary-container"
                    transition={{ type: "spring", stiffness: 500, damping: 36 }}
                  />
                )}
                <Icon name={t.icon} className="relative text-lg" />
                <span className="relative">{t.label}</span>
              </button>
            );
          })}
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} data-field="paymentId" tabIndex={-1}>
          {(tab === "transfer" || tab === "ewallet") && (
            <div className="space-y-3" role="radiogroup" aria-label="Metode pembayaran">
              {PAYMENT_METHODS[tab].map((m) => (
                <PaymentOption key={m.id} method={m} selected={form.paymentId === m.id} onSelect={() => choosePayment(m.id)} />
              ))}
            </div>
          )}

          {tab === "cod" && (
            <div className="space-y-3 rounded-xl border border-outline-variant/40 bg-surface-container-low p-5">
              <div className="flex items-center gap-3">
                <Icon name="payments" className="text-3xl text-primary" />
                <div>
                  <p className="text-title-md font-title-md text-on-surface">Bayar di Tempat (COD)</p>
                  <p className="text-body-sm text-on-surface-variant">Bayar tunai saat tim kami tiba dengan armada khusus mebel.</p>
                </div>
              </div>
              <ul className="space-y-1.5 text-body-sm text-on-surface-variant">
                {["Tersedia untuk wilayah Palembang & sekitarnya (Sumsel)", "Tim konfirmasi jadwal H-1 via WhatsApp", "Tidak tersedia untuk pesanan di atas Rp 10 juta"].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <Icon name="check_circle" className="mt-0.5 text-base text-primary" />
                    {t}
                  </li>
                ))}
              </ul>
              {cod && (
                <p className="flex items-start gap-1.5 rounded-lg bg-error-container p-3 text-body-sm text-on-error-container">
                  <Icon name="error" className="mt-0.5 text-base" />
                  {cod}
                </p>
              )}
            </div>
          )}

          {tab === "cicilan" && (
            <div className="space-y-4">
              <p className="text-body-md text-on-surface-variant">
                Cicilan 0% untuk kartu kredit BCA, Mandiri, BNI, dan CIMB dengan minimum transaksi Rp 1.500.000.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[3, 6, 12].map((term) => {
                  const active = form.cicilanTerm === term;
                  return (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setField("cicilanTerm", term)}
                      className={`rounded-xl border px-3 py-3 text-center transition-all ${
                        active ? "border-2 border-primary-container bg-primary-container/10" : "border-outline-variant/50 hover:border-primary-container/60"
                      }`}
                    >
                      <p className={`text-lg font-bold ${active ? "text-primary" : "text-on-surface"}`}>{term}x</p>
                      <p className="text-label-md font-label-md text-outline">{formatPrice(monthly(term))}/bln</p>
                    </button>
                  );
                })}
              </div>
              <FieldShell id="ck-cardNumber" label="Nomor Kartu Kredit" required error={errorFor("cardNumber")}>
                <input
                  id="ck-cardNumber"
                  data-field="cardNumber"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  value={card.number}
                  onChange={(e) => setCardField("number", formatCard(e.target.value))}
                  onBlur={() => touch("cardNumber")}
                  className={`field ${errorFor("cardNumber") ? "field-error" : ""}`}
                />
              </FieldShell>
              <div className="grid grid-cols-2 gap-4">
                <FieldShell id="ck-cardExpiry" label="Berlaku Hingga" required error={errorFor("cardExpiry")}>
                  <input
                    id="ck-cardExpiry"
                    data-field="cardExpiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(e) => setCardField("expiry", formatExpiry(e.target.value))}
                    onBlur={() => touch("cardExpiry")}
                    className={`field ${errorFor("cardExpiry") ? "field-error" : ""}`}
                  />
                </FieldShell>
                <FieldShell id="ck-cardCvv" label="CVV" required error={errorFor("cardCvv")}>
                  <input
                    id="ck-cardCvv"
                    data-field="cardCvv"
                    type="password"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    maxLength={4}
                    placeholder="•••"
                    value={card.cvv}
                    onChange={(e) => setCardField("cvv", digits(e.target.value))}
                    onBlur={() => touch("cardCvv")}
                    className={`field ${errorFor("cardCvv") ? "field-error" : ""}`}
                  />
                </FieldShell>
              </div>
              <p className="flex items-center gap-1.5 text-label-md font-label-md text-outline">
                <Icon name="info" className="text-base" />
                Ini hanya simulasi praktikum; data kartu tidak dikirim atau disimpan.
              </p>
            </div>
          )}
        </motion.div>
        {paymentError && <p className="mt-3 flex items-center gap-1 text-body-sm text-error"><Icon name="error" className="text-base" />{paymentError}</p>}
      </Card>

      <Card step={4} title="Pesan untuk Workshop" done={false}>
        <TextField
          name="workshopNotes"
          as="textarea"
          rows={3}
          label="Catatan produksi (opsional)"
          placeholder="Contoh: Tolong warna biru langit yang lebih muda. Jahitan polos tanpa aksen kancing."
          hint="Tim kami akan menghubungi via WhatsApp bila ada pertanyaan tentang pesanan Anda."
        />
      </Card>
    </div>
  );
}
