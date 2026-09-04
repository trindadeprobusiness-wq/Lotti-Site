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

  /**
   * Domínio de produção — usado em canonical, sitemap e Open Graph.
   * Provisório: aponta para o domínio da Vercel enquanto o definitivo não
   * é conectado. Não use lotti.com.br — pertence a outro negócio.
   */
  domain: "lotti-site.vercel.app",
  url: "https://lotti-site.vercel.app",

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
   * Arquivos oficiais entregues e em uso em public/brand/.
   *
   * Atenção: hoje esta flag não é lida por nenhum componente. Logo.tsx e
   * LottiMark.tsx servem os SVGs oficiais incondicionalmente — o símbolo
   * provisório em SVG inline não existe mais. Mantida em true para não
   * descrever um estado falso; candidata a remoção. Ver README.
   */
  useOfficialBrandFiles: true,

  /**
   * Prints entregues e em uso em public/product/.
   *
   * Lida só por ProductShot, como padrão para quadros que não passam
   * showScreenshot. Os dois usos atuais (Features.tsx) já passam a prop, então
   * virar esta flag não muda nada hoje — vale para quadros novos. Sem print,
   * ProductShot desenha a moldura de sistema do manual, sem inventar dado de
   * tela. Ver README.
   */
  useProductScreenshots: true,
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
