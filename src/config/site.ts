/**
 * Fonte única de verdade para dados da empresa.
 * Tudo que for contato, domínio ou rede social sai daqui — header, footer,
 * CTAs, metadados, Open Graph e JSON-LD. Troque em um lugar só.
 *
 * Campos marcados com PENDING ainda precisam ser preenchidos. Enquanto
 * estiverem assim, os componentes mostram o texto de aviso em vez de gerar
 * um link quebrado (wa.me/[PREENCHER] etc).
 */

export const PENDING = "[PREENCHER]" as const;

export function isPending(value: string): boolean {
  return value === PENDING || value.trim() === "";
}

export const siteConfig = {
  name: "Lotti",
  tagline: "Gestão Imobiliária Inteligente",
  description:
    "CRM imobiliário com IA para corretores e pequenas imobiliárias. Captação por QR Code, funil de vendas, contratos gerados por IA e aluguéis com financeiro automático.",

  /** Domínio de produção — usado em canonical, sitemap e Open Graph. */
  domain: "lotti.com.br",
  url: "https://lotti.com.br",

  /** Só dígitos, com DDI e DDD. Ex.: "5511987654321" */
  whatsapp: PENDING as string,
  /** Como o número aparece escrito na página. Ex.: "(11) 98765-4321" */
  whatsappLabel: PENDING as string,

  email: PENDING as string,

  /** Para onde o formulário de demonstração envia os leads. */
  leadInbox: PENDING as string,

  social: {
    instagram: PENDING as string,
    linkedin: PENDING as string,
  },

  /**
   * Vire para true depois de colocar os arquivos oficiais em public/brand/.
   * Enquanto for false, o site desenha um símbolo provisório em SVG inline
   * e compõe o wordmark em Sora. Ver README.
   */
  useOfficialBrandFiles: false,

  /**
   * Vire para true depois de colocar os prints em public/product/.
   * Enquanto for false, cada espaço de imagem mostra a moldura de sistema
   * SaaS do manual, sem inventar dado de tela. Ver README.
   */
  useProductScreenshots: false,
} as const;

/** Link de WhatsApp com mensagem pronta, ou null se o número não foi preenchido. */
export function whatsappUrl(message?: string): string | null {
  if (isPending(siteConfig.whatsapp)) return null;
  const text = message ?? "Olá! Gostaria de agendar uma demonstração da Lotti.";
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function mailtoUrl(subject?: string): string | null {
  if (isPending(siteConfig.email)) return null;
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${siteConfig.email}${query}`;
}
