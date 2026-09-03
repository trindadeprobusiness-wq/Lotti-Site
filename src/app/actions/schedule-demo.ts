"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { form as formCopy } from "@/content/landing";

type FieldName = "name" | "whatsapp" | "email" | "creci" | "portfolio";

export type DemoFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<FieldName, string>>;
  values?: Partial<Record<FieldName, string>>;
};

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
  email: z.string().email("Confira o e-mail, parece incompleto.").max(160),
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

/** E-mail de destino fixo para leads do site */
const LEAD_EMAIL = "uselottiapp@gmail.com";

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
  const to = LEAD_EMAIL;
  const from = process.env.RESEND_FROM ?? "Lotti <onboarding@resend.dev>";

  if (!apiKey) {
    // Sem API key do Resend — registra no servidor para recuperação manual
    console.error(
      "[lotti] RESEND_API_KEY ausente. Lead recebido:",
      lead,
    );
    return { status: "error", values: raw, message: formCopy.genericError };
  }

  try {
    const now = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

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
        subject: `🏠 Novo Lead — ${lead.name}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
            <div style="background: linear-gradient(135deg, #093323, #0d4a32); padding: 32px 24px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">Novo Lead pelo Site</h1>
              <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin-top: 6px;">Recebido em ${now}</p>
            </div>

            <div style="padding: 28px 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; width: 140px;">Nome</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 15px;">${lead.name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">WhatsApp</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 15px;">
                    <a href="https://wa.me/${lead.whatsapp}" style="color: #093323; text-decoration: none; font-weight: 500;">${lead.whatsapp}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">E-mail</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 15px;">
                    <a href="mailto:${lead.email}" style="color: #093323; text-decoration: none; font-weight: 500;">${lead.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">CRECI</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 15px;">${lead.creci || "Não informado"}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Carteira</td>
                  <td style="padding: 12px 0; color: #111827; font-size: 15px; font-weight: 500;">${lead.portfolio}</td>
                </tr>
              </table>
            </div>

            <div style="background: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">Enviado automaticamente pelo site ${siteConfig.url}</p>
            </div>
          </div>
        `,
        text: [
          "Novo lead pelo site Lotti",
          "",
          `Nome:      ${lead.name}`,
          `WhatsApp:  ${lead.whatsapp}`,
          `E-mail:    ${lead.email}`,
          `CRECI:     ${lead.creci || "-"}`,
          `Carteira:  ${lead.portfolio}`,
          "",
          `Recebido em: ${now}`,
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
