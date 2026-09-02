import {
  Building2,
  Crown,
  Gauge,
  Headphones,
  Rocket,
} from "lucide-react";
import { officialPlans, planCodes } from "@/content/plans";

export const pricingCopy = {
  title: "Planos claros para cada fase da sua operação imobiliária",
  subtitle:
    "Escolha a capacidade que acompanha sua carteira hoje. Todos os valores são mensais e os limites aparecem sem letras miúdas.",
  highlightBadge: "PARA QUEM ESTÁ CRESCENDO",
  faqTitle: "Perguntas frequentes",
  ctaFinal: {
    title: "Escolha a estrutura certa para a sua operação.",
    subtitle: "Cartão com cobrança mensal ou Pix anual, processados pelo Asaas.",
    cta: "Assinar agora",
  },
} as const;

const planIcons = {
  essencial: Rocket,
  profissional: Crown,
  imobiliaria: Building2,
} as const;

export const plansData = planCodes.map((code) => ({
  ...officialPlans[code],
  icon: planIcons[code],
  highlighted: code === "profissional",
  cta: "Assinar agora",
}));

export const comparisonCategories = [
  { key: "capacidade", label: "Capacidade", icon: Gauge },
  { key: "atendimento", label: "Atendimento", icon: Headphones },
] as const;

export const comparisonFeatures = [
  {
    category: "capacidade",
    label: "Imóveis ativos",
    essencial: "Até 5",
    profissional: "Até 20",
    imobiliaria: "Até 100",
  },
  {
    category: "capacidade",
    label: "Contratos de aluguel ativos",
    essencial: "Até 5",
    profissional: "Até 15",
    imobiliaria: "Até 100",
  },
  {
    category: "capacidade",
    label: "Fachadas Inteligentes",
    essencial: "5",
    profissional: "20",
    imobiliaria: "100",
  },
  {
    category: "capacidade",
    label: "Gerações ou análises de contrato com IA",
    essencial: "10/mês",
    profissional: "20/mês",
    imobiliaria: "60/mês",
  },
  {
    category: "atendimento",
    label: "Suporte",
    essencial: officialPlans.essencial.support,
    profissional: officialPlans.profissional.support,
    imobiliaria: officialPlans.imobiliaria.support,
  },
  {
    category: "atendimento",
    label: "Onboarding",
    essencial: officialPlans.essencial.onboarding,
    profissional: officialPlans.profissional.onboarding,
    imobiliaria: officialPlans.imobiliaria.onboarding,
  },
] as const;

export const pricingFAQ = [
  {
    question: "Quando acontece a migração do Essencial para o Profissional?",
    answer:
      "A migração acontece quando o cliente ultrapassa os limites do plano Essencial.",
  },
  {
    question: "O que significa um item ativo?",
    answer:
      "Os limites de imóveis e contratos de aluguel consideram os itens ativos na operação.",
  },
  {
    question: "Quais recursos não têm limite?",
    answer:
      "Nos planos Essencial e Profissional, CRM, clientes, funil e lançamentos financeiros não têm limite.",
  },
  {
    question: "Como posso pagar a assinatura?",
    answer:
      "O checkout aceita cartão com cobrança mensal ou Pix anual, no valor equivalente a 12 mensalidades. O pagamento é processado com segurança pelo Asaas.",
  },
  {
    question: "Como recebo meu acesso depois do pagamento?",
    answer:
      "Após a confirmação, o link para criar a senha é enviado ao mesmo e-mail informado no checkout. Esse e-mail é o único autorizado a iniciar o onboarding.",
  },
  {
    question: "A integração com Asaas está incluída?",
    answer:
      "A integração com Asaas está incluída nos planos Essencial e Profissional, conforme os benefícios de cada plano.",
  },
] as const;
