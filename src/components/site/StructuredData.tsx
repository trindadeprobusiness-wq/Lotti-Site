import { isPending, siteConfig } from "@/config/site";

/**
 * JSON-LD para o Google entender que a Lotti é um software de gestão
 * imobiliária brasileiro. Campos ainda não preenchidos simplesmente não
 * entram — dado vazio em schema é pior que dado ausente.
 */
export function StructuredData() {
  const organization = {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    ...(isPending(siteConfig.email) ? {} : { email: siteConfig.email }),
    ...(isPending(siteConfig.whatsapp)
      ? {}
      : { telephone: `+${siteConfig.whatsapp}` }),
    ...(() => {
      const profiles = Object.values(siteConfig.social).filter(
        (url) => !isPending(url),
      );
      return profiles.length > 0 ? { sameAs: profiles } : {};
    })(),
  };

  const software = {
    "@type": "SoftwareApplication",
    "@id": `${siteConfig.url}/#software`,
    name: siteConfig.name,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "CRM imobiliário",
    operatingSystem: "Web",
    inLanguage: "pt-BR",
    description: siteConfig.description,
    url: siteConfig.url,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    audience: {
      "@type": "Audience",
      audienceType: "Corretores de imóveis e imobiliárias",
      geographicArea: { "@type": "Country", name: "Brasil" },
    },
    featureList: [
      "Funil de vendas visual em Kanban",
      "Captação por QR Code em placas de fachada",
      "Geração e leitura de contratos por IA",
      "Gestão de aluguéis com faturas e repasses automáticos",
      "Assistente de IA sobre os dados do CRM",
    ],
  };

  const payload = {
    "@context": "https://schema.org",
    "@graph": [organization, software],
  };

  return (
    <script
      type="application/ld+json"
      // O conteúdo é montado aqui mesmo, sem entrada de usuário.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
