import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { isPlanCode } from "@/lib/checkout/catalog";

export const metadata: Metadata = {
  title: "Checkout seguro",
  description: "Contrate seu plano Lotti com pagamento seguro processado pelo Asaas.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false },
};

type CheckoutPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const query = await searchParams;
  const requestedPlan = first(query.plano);
  return (
    <CheckoutForm
      initialPlanCode={isPlanCode(requestedPlan) ? requestedPlan : "profissional"}
    />
  );
}
