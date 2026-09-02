"use client";

import { useId, useMemo, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { LottiMark } from "@/components/brand/LottiMark";
import { digitsOnly, isFutureExpiration, passesLuhn } from "@/lib/checkout/validation";

export type CreditCardData = {
  number: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
};

type CardField = keyof CreditCardData;

type CreditCardFormProps = {
  value: CreditCardData;
  onChange: (value: CreditCardData) => void;
  disabled?: boolean;
  forceErrors?: boolean;
};

function formatCardNumber(value: string): string {
  return digitsOnly(value).replace(/(.{4})/g, "$1 ").trim();
}

function formatPreviewNumber(value: string): string {
  return value
    .padEnd(16, "•")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function cardBrand(number: string): string {
  const digits = digitsOnly(number);
  if (/^4/.test(digits)) return "VISA";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "MASTERCARD";
  if (/^(4011|4312|4389|4514|4576|5041|5066|5090|6277|6362|6363|650|6516|6550)/.test(digits)) return "ELO";
  if (/^(606282|3841)/.test(digits)) return "HIPERCARD";
  return "CARTÃO";
}

export function CreditCardForm({
  value,
  onChange,
  disabled = false,
  forceErrors = false,
}: CreditCardFormProps) {
  const baseId = useId();
  const [focused, setFocused] = useState<CardField | null>(null);
  const [touched, setTouched] = useState<Partial<Record<CardField, boolean>>>({});
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: 12 }, (_, index) => String(currentYear + index)),
    [currentYear],
  );
  const months = useMemo(
    () => Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0")),
    [],
  );

  const errors: Partial<Record<CardField, string>> = {
    number: passesLuhn(value.number) ? undefined : "Confira o número do cartão.",
    holderName: value.holderName.trim().length >= 3 ? undefined : "Informe o nome impresso no cartão.",
    expiryMonth: value.expiryMonth ? undefined : "Escolha o mês.",
    expiryYear: isFutureExpiration(value.expiryMonth, value.expiryYear)
      ? undefined
      : "Confira a validade.",
    ccv: /^\d{3,4}$/.test(value.ccv) ? undefined : "Use 3 ou 4 números.",
  };

  const update = (field: CardField, nextValue: string) => {
    onChange({ ...value, [field]: nextValue });
  };

  const markTouched = (field: CardField) => {
    setTouched((current) => ({ ...current, [field]: true }));
    setFocused(null);
  };

  const showError = (field: CardField) => Boolean(errors[field] && (forceErrors || touched[field]));
  const brand = cardBrand(value.number);
  const previewNumber = formatPreviewNumber(value.number);

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(17rem,0.86fr)_minmax(19rem,1.14fr)] xl:items-start">
      <div className="mx-auto w-full max-w-[25rem] xl:sticky xl:top-8">
        <div className={`checkout-credit-card ${focused === "ccv" ? "is-flipped" : ""}`}>
          <div className="checkout-credit-card-inner">
            <div className="checkout-credit-card-face checkout-credit-card-front">
              <div className="checkout-card-blades" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <LottiMark tone="paper" className="h-10 w-auto opacity-95" />
                  <span className="text-[0.68rem] font-semibold tracking-[0.16em] text-white/75">
                    {brand}
                  </span>
                </div>

                <p
                  data-numeric
                  className={`checkout-card-number ${focused === "number" ? "is-focused" : ""}`}
                  aria-hidden="true"
                >
                  {previewNumber}
                </p>

                <div className="grid grid-cols-[1fr_auto] gap-5">
                  <div className={focused === "holderName" ? "checkout-card-detail is-focused" : "checkout-card-detail"}>
                    <span>Titular</span>
                    <strong>{value.holderName.trim() || "SEU NOME"}</strong>
                  </div>
                  <div className={focused === "expiryMonth" || focused === "expiryYear" ? "checkout-card-detail is-focused" : "checkout-card-detail"}>
                    <span>Validade</span>
                    <strong data-numeric>
                      {value.expiryMonth || "MM"}/{value.expiryYear ? value.expiryYear.slice(-2) : "AA"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="checkout-credit-card-face checkout-credit-card-back">
              <div className="mt-7 h-11 w-full bg-black/80" />
              <div className="px-6 pt-7">
                <div className="mb-2 flex items-center justify-between text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-white/70">
                  <span>Código de segurança</span>
                  <LockKeyhole size={14} aria-hidden="true" />
                </div>
                <div className="flex h-12 items-center justify-end rounded-lg bg-white px-4 font-semibold tracking-[0.25em] text-black">
                  {value.ccv ? "•".repeat(value.ccv.length) : "•••"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted">
          <LockKeyhole size={14} aria-hidden="true" />
          Os dados do cartão são transmitidos para o processamento seguro do Asaas.
        </p>
      </div>

      <div className="grid gap-5">
        <div>
          <label className="checkout-label" htmlFor={`${baseId}-card-number`}>
            Número do cartão
          </label>
          <input
            id={`${baseId}-card-number`}
            className="checkout-input"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="0000 0000 0000 0000"
            value={formatCardNumber(value.number)}
            maxLength={23}
            disabled={disabled}
            aria-invalid={showError("number")}
            aria-describedby={showError("number") ? `${baseId}-card-number-error` : undefined}
            onChange={(event) => update("number", digitsOnly(event.target.value).slice(0, 19))}
            onFocus={() => setFocused("number")}
            onBlur={() => markTouched("number")}
          />
          {showError("number") ? (
            <p id={`${baseId}-card-number-error`} className="checkout-error">
              {errors.number}
            </p>
          ) : null}
        </div>

        <div>
          <label className="checkout-label" htmlFor={`${baseId}-holder`}>
            Nome impresso no cartão
          </label>
          <input
            id={`${baseId}-holder`}
            className="checkout-input uppercase"
            type="text"
            autoComplete="cc-name"
            placeholder="NOME COMO ESTÁ NO CARTÃO"
            value={value.holderName}
            maxLength={120}
            disabled={disabled}
            aria-invalid={showError("holderName")}
            aria-describedby={showError("holderName") ? `${baseId}-holder-error` : undefined}
            onChange={(event) => update("holderName", event.target.value.toUpperCase())}
            onFocus={() => setFocused("holderName")}
            onBlur={() => markTouched("holderName")}
          />
          {showError("holderName") ? (
            <p id={`${baseId}-holder-error`} className="checkout-error">
              {errors.holderName}
            </p>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-[1fr_1fr_0.85fr]">
          <div>
            <label className="checkout-label" htmlFor={`${baseId}-month`}>Mês</label>
            <select
              id={`${baseId}-month`}
              className="checkout-input"
              autoComplete="cc-exp-month"
              value={value.expiryMonth}
              disabled={disabled}
              aria-invalid={showError("expiryMonth")}
              onChange={(event) => update("expiryMonth", event.target.value)}
              onFocus={() => setFocused("expiryMonth")}
              onBlur={() => markTouched("expiryMonth")}
            >
              <option value="">Mês</option>
              {months.map((month) => <option key={month} value={month}>{month}</option>)}
            </select>
          </div>
          <div>
            <label className="checkout-label" htmlFor={`${baseId}-year`}>Ano</label>
            <select
              id={`${baseId}-year`}
              className="checkout-input"
              autoComplete="cc-exp-year"
              value={value.expiryYear}
              disabled={disabled}
              aria-invalid={showError("expiryYear")}
              onChange={(event) => update("expiryYear", event.target.value)}
              onFocus={() => setFocused("expiryYear")}
              onBlur={() => markTouched("expiryYear")}
            >
              <option value="">Ano</option>
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
          <div>
            <label className="checkout-label" htmlFor={`${baseId}-ccv`}>CVV</label>
            <input
              id={`${baseId}-ccv`}
              className="checkout-input"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              value={value.ccv}
              maxLength={4}
              disabled={disabled}
              aria-invalid={showError("ccv")}
              aria-describedby={showError("ccv") ? `${baseId}-ccv-error` : undefined}
              onChange={(event) => update("ccv", digitsOnly(event.target.value).slice(0, 4))}
              onFocus={() => setFocused("ccv")}
              onBlur={() => markTouched("ccv")}
            />
          </div>
        </div>
        {(showError("expiryMonth") || showError("expiryYear") || showError("ccv")) ? (
          <p id={`${baseId}-ccv-error`} className="checkout-error">
            {errors.expiryYear ?? errors.expiryMonth ?? errors.ccv}
          </p>
        ) : null}
      </div>
    </div>
  );
}
