"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, MessageCircle } from "lucide-react";
import {
  type DemoFormState,
  scheduleDemo,
} from "@/app/actions/schedule-demo";
import { form as copy } from "@/content/landing";
import { whatsappUrl } from "@/config/site";
import { Button } from "./Button";

const initialState: DemoFormState = { status: "idle" };

export function DemoForm() {
  const [state, action] = useActionState(scheduleDemo, initialState);
  const ids = useId();
  const whatsapp = whatsappUrl();

  const fieldId = (name: string) => `${ids}-${name}`;
  const errorId = (name: string) => `${ids}-${name}-error`;

  if (state.status === "success") {
    return (
      <div className="rounded-[var(--radius-card)] border border-white/20 bg-white/5 p-8">
        <CheckCircle2 size={24} strokeWidth={1.75} className="text-paper" />
        <p className="mt-4 text-h3 text-paper">{copy.success.title}</p>
        <p className="mt-2 text-small text-white/70">{copy.success.description}</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="flex flex-col gap-4">
      <h3 className="sr-only">{copy.title}</h3>

      {/* Honeypot — invisível para gente, irresistível para bot */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor={fieldId("empresa")}>Empresa</label>
        <input
          id={fieldId("empresa")}
          name="empresa"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id={fieldId("name")}
          errorId={errorId("name")}
          name="name"
          label={copy.fields.name.label}
          placeholder={copy.fields.name.placeholder}
          autoComplete="name"
          defaultValue={state.values?.name}
          error={state.fieldErrors?.name}
          className="sm:col-span-2"
        />

        <Field
          id={fieldId("whatsapp")}
          errorId={errorId("whatsapp")}
          name="whatsapp"
          type="tel"
          inputMode="tel"
          label={copy.fields.whatsapp.label}
          placeholder={copy.fields.whatsapp.placeholder}
          autoComplete="tel"
          defaultValue={state.values?.whatsapp}
          error={state.fieldErrors?.whatsapp}
        />

        <Field
          id={fieldId("email")}
          errorId={errorId("email")}
          name="email"
          type="email"
          inputMode="email"
          label={copy.fields.email.label}
          placeholder={copy.fields.email.placeholder}
          autoComplete="email"
          defaultValue={state.values?.email}
          error={state.fieldErrors?.email}
        />

        <Field
          id={fieldId("creci")}
          errorId={errorId("creci")}
          name="creci"
          label={copy.fields.creci.label}
          placeholder={copy.fields.creci.placeholder}
          optional
          defaultValue={state.values?.creci}
          error={state.fieldErrors?.creci}
        />

        <div className="flex flex-col gap-2">
          <label
            htmlFor={fieldId("portfolio")}
            className="text-eyebrow leading-[1.5] uppercase text-white/60"
          >
            {copy.fields.portfolio.label}
          </label>
          <select
            id={fieldId("portfolio")}
            name="portfolio"
            className="field"
            defaultValue={state.values?.portfolio ?? copy.portfolioOptions[1]}
            aria-invalid={state.fieldErrors?.portfolio ? "true" : undefined}
            aria-describedby={
              state.fieldErrors?.portfolio ? errorId("portfolio") : undefined
            }
          >
            {copy.portfolioOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {state.fieldErrors?.portfolio ? (
            <p id={errorId("portfolio")} className="text-small text-paper">
              {state.fieldErrors.portfolio}
            </p>
          ) : null}
        </div>
      </div>

      <p aria-live="polite" className="min-h-0">
        {state.status === "error" && state.message ? (
          <span className="text-small text-paper">{state.message}</span>
        ) : null}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton />
        {whatsapp ? (
          <Button
            variant="inverted-ghost"
            href={whatsapp}
            className="w-full sm:w-auto"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
            {copy.whatsappAlt}
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="inverted"
      arrow={!pending}
      disabled={pending}
      className="w-full sm:w-auto"
    >
      {pending ? copy.submitting : copy.submit}
    </Button>
  );
}

type FieldProps = {
  id: string;
  errorId: string;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  inputMode?: "tel" | "email" | "text";
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
  optional?: boolean;
  className?: string;
};

function Field({
  id,
  errorId,
  name,
  label,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  defaultValue,
  error,
  optional = false,
  className,
}: FieldProps) {
  return (
    <div className={["flex flex-col gap-2", className].filter(Boolean).join(" ")}>
      <label
        htmlFor={id}
        className="text-eyebrow leading-[1.5] uppercase text-white/60"
      >
        {label}
        {optional ? <span className="normal-case tracking-normal"> (opcional)</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        className="field"
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error ? (
        <p id={errorId} className="text-small text-paper">
          {error}
        </p>
      ) : null}
    </div>
  );
}
