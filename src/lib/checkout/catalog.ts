import {
  officialPlans,
  planCodes,
  type PlanCode,
} from "@/content/plans";

export { planCodes, type PlanCode };

export const billingCycles = ["monthly", "annual"] as const;

export type BillingCycle = (typeof billingCycles)[number];

export const paymentMethods = ["PIX", "CREDIT_CARD"] as const;

export type PaymentMethod = (typeof paymentMethods)[number];

export type CheckoutPlan = {
  code: PlanCode;
  name: string;
  audience: string;
  monthlyPrice: number;
  highlighted: boolean;
  checkoutFeatures: readonly string[];
};

function toCheckoutPlan(code: PlanCode): CheckoutPlan {
  const plan = officialPlans[code];
  return {
    code,
    name: plan.name,
    audience: plan.audience,
    monthlyPrice: plan.monthlyPrice,
    highlighted: code === "profissional",
    checkoutFeatures: [
      `Até ${plan.capacity.properties} imóveis e ${plan.capacity.rentalContracts} contratos de aluguel ativos`,
      `${plan.capacity.facades} Fachadas Inteligentes`,
      `${plan.capacity.aiContracts} gerações ou análises de contrato com IA por mês`,
      ...plan.benefits,
    ],
  };
}

export const checkoutPlans = Object.fromEntries(
  planCodes.map((code) => [code, toCheckoutPlan(code)]),
) as Record<PlanCode, CheckoutPlan>;

export function isPlanCode(value: unknown): value is PlanCode {
  return typeof value === "string" && planCodes.includes(value as PlanCode);
}

export function isBillingCycle(value: unknown): value is BillingCycle {
  return typeof value === "string" && billingCycles.includes(value as BillingCycle);
}

export function planPrice(plan: CheckoutPlan, cycle: BillingCycle): number {
  return cycle === "annual" ? plan.monthlyPrice * 12 : plan.monthlyPrice;
}

export function billingCycleForPayment(method: PaymentMethod): BillingCycle {
  return method === "PIX" ? "annual" : "monthly";
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}
