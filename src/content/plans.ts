export const planCodes = ["essencial", "profissional", "imobiliaria"] as const;

export type PlanCode = (typeof planCodes)[number];

export type OfficialPlan = {
  readonly code: PlanCode;
  readonly name: string;
  readonly audience: string;
  readonly monthlyPrice: number;
  readonly capacity: {
    readonly properties: number;
    readonly rentalContracts: number;
    readonly facades: number;
    readonly aiContracts: number;
  };
  readonly benefits: readonly string[];
  readonly support: string;
  readonly onboarding: string;
  readonly migrationNote?: string;
};

export const officialPlans: Record<PlanCode, OfficialPlan> = {
  essencial: {
    code: "essencial",
    name: "Lotti Essencial",
    audience: "Para corretor autônomo começando",
    monthlyPrice: 99,
    capacity: {
      properties: 5,
      rentalContracts: 5,
      facades: 5,
      aiContracts: 10,
    },
    benefits: [
      "CRM, clientes, funil e lançamentos financeiros sem limite",
      "Integração com Asaas",
      "Financeiro básico",
      "Suporte por e-mail",
    ],
    support: "Por e-mail",
    onboarding: "—",
  },
  profissional: {
    code: "profissional",
    name: "Lotti Profissional",
    audience: "Para corretores com operação maior ou pequenas equipes",
    monthlyPrice: 149,
    capacity: {
      properties: 20,
      rentalContracts: 15,
      facades: 20,
      aiContracts: 20,
    },
    benefits: [
      "CRM, clientes, funil e lançamentos financeiros sem limite",
      "Financeiro completo",
      "Gestão de aluguéis",
      "Integração com Asaas",
      "Relatórios e automações",
      "Suporte prioritário",
    ],
    support: "Prioritário",
    onboarding: "—",
    migrationNote: "A migração acontece quando os limites do Essencial são ultrapassados.",
  },
  imobiliaria: {
    code: "imobiliaria",
    name: "Lotti Imobiliária",
    audience: "Para imobiliárias com equipe e carteira maior",
    monthlyPrice: 299,
    capacity: {
      properties: 100,
      rentalContracts: 100,
      facades: 100,
      aiContracts: 60,
    },
    benefits: [
      "Onboarding orientado",
      "Suporte prioritário",
    ],
    support: "Prioritário",
    onboarding: "Orientado",
  },
};

export function planCapacityItems(plan: OfficialPlan) {
  return [
    { label: "Imóveis ativos", value: `Até ${plan.capacity.properties}` },
    { label: "Contratos de aluguel ativos", value: `Até ${plan.capacity.rentalContracts}` },
    { label: "Fachadas Inteligentes", value: String(plan.capacity.facades) },
    { label: "Gerações ou análises com IA", value: `${plan.capacity.aiContracts}/mês` },
  ] as const;
}
