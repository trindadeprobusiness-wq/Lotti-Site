"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { siteConfig, isPending } from "@/config/site";
import { form as formCopy } from "@/content/landing";

export type DemoFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<FieldName, string>>;
  values?: Partial<Record<FieldName, string>>;
};

type FieldName = "name" | "whatsapp" | "email" | "creci" | "portfolio";

export const initialDemoFormState: DemoFormState = { status: "idle" };

const onlyDigits = (value: string) => value.replace(/\D/g, "");

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Diga como podemos te chamar.")
    .max(120, "Nome muito longo."),
  whatsapp: z
    .string()
    .trim()
    .transform(onlyDigits)
    .refine((digits) => digits.length >= 10 && digits.length <= 13, {
      message: "Informe DDD e número, ex.: (11) 98765-4321.",
    }),
  email: z.email("Confira o e-mail — parece incompleto.").max(160),
  creci: z.string().trim().max(40, "CRECI muito longo.").optional(),
  portfolio: z
    .string()
    .trim()
    .refine((value) => formCopy.portfolioOptions.includes(value as never), {
      message: "Escolha uma das opções.",
    }),
});

/**
 * Throttle best-effort por IP. Em serverless a memória é por instância, então
 * isso segura repetição acidental e ruído de bot — não é proteção contra
 * ataque distribuído. Para isso, o Vercel Firewall.
 */
const attempts = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 4;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function scheduleDemo(
  _prev: DemoFormState,
  formData: FormData,
): Promise<DemoFormState> {
  // Honeypot: só um bot preenche um campo escondido. Devolve sucesso para
  // não ensinar o bot qual foi o erro.
  if ((formData.get("empresa") as string | null)?.trim()) {
    return { status: "success" };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    email: String(formData.get("email") ?? ""),
    creci: String(formData.get("creci") ?? ""),
    portfolio: String(formData.get("portfolio") ?? ""),
  };

  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<FieldName, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as FieldName | undefined;
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return {
      status: "error",
      fieldErrors,
      values: raw,
      message: "Confira os campos destacados.",
    };
  }

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return {
      status: "error",
      values: raw,
      message: "Muitos envios seguidos. Aguarde um minuto e tente de novo.",
    };
  }

  const lead = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_INBOX_EMAIL ?? siteConfig.leadInbox;
  const from = process.env.RESEND_FROM ?? "Lotti <onboarding@resend.dev>";

  if (!apiKey || isPending(to)) {
    // Não engolir o lead em silêncio: registra no servidor para recuperação
    // manual e avisa o visitante, que ainda tem a saída pelo WhatsApp.
    console.error(
      "[lotti] Envio de lead não configurado (RESEND_API_KEY ou LEAD_INBOX_EMAIL ausente). Lead recebido:",
      lead,
    );
    return { status: "error", values: raw, message: formCopy.genericError };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: lead.email,
        subject: `Demonstração — ${lead.name}`,
        text: [
          "Novo pedido de demonstração pelo site.",
          "",
          `Nome:      ${lead.name}`,
          `WhatsApp:  ${lead.whatsapp}`,
          `E-mail:    ${lead.email}`,
          `CRECI:     ${lead.creci || "—"}`,
          `Carteira:  ${lead.portfolio}`,
          "",
          `Origem: ${siteConfig.url}`,
        ].join("\n"),
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("[lotti] Resend respondeu", response.status, detail, lead);
      return { status: "error", values: raw, message: formCopy.genericError };
    }
  } catch (error) {
    console.error("[lotti] Falha ao enviar lead:", error, lead);
    return { status: "error", values: raw, message: formCopy.genericError };
  }

  return { status: "success" };
}
