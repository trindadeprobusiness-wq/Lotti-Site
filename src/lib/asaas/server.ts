import "server-only";

import type { CheckoutRequest } from "@/lib/checkout/validation";
import type { BillingCycle, CheckoutPlan } from "@/lib/checkout/catalog";

type AsaasErrorPayload = {
  errors?: Array<{ code?: string; description?: string }>;
};

type AsaasCustomer = {
  id: string;
  email?: string | null;
  cpfCnpj?: string | null;
};

type AsaasSubscription = {
  id: string;
  status?: string;
};

export type AsaasPayment = {
  id: string;
  status: string;
  externalReference?: string | null;
  subscription?: string | null;
  billingType?: string | null;
  value?: number;
  creditCard?: {
    creditCardNumber?: string | null;
    creditCardBrand?: string | null;
  } | null;
};

type AsaasList<T> = { data: T[]; totalCount?: number };

export type PixQrCode = {
  encodedImage: string;
  payload: string;
  expirationDate: string;
};

export class AsaasApiError extends Error {
  constructor(
    public readonly publicCode: "CARD_REFUSED" | "INVALID_DATA" | "GATEWAY_UNAVAILABLE",
    public readonly status: number,
  ) {
    super(publicCode);
  }
}

function getAsaasConfig() {
  const apiKey = process.env.ASAAS_API_KEY;
  const environment = process.env.ASAAS_ENVIRONMENT;

  if (!apiKey || (environment !== "sandbox" && environment !== "production")) {
    throw new Error("ASAAS_NOT_CONFIGURED");
  }

  return {
    apiKey,
    baseUrl:
      environment === "production"
        ? "https://api.asaas.com/v3"
        : "https://api-sandbox.asaas.com/v3",
  };
}

export function isAsaasConfigured(): boolean {
  return Boolean(
    process.env.ASAAS_API_KEY
      && (process.env.ASAAS_ENVIRONMENT === "sandbox"
        || process.env.ASAAS_ENVIRONMENT === "production"),
  );
}

async function asaasFetch<T>(
  path: string,
  init: Omit<RequestInit, "signal"> = {},
): Promise<T> {
  const { apiKey, baseUrl } = getAsaasConfig();
  let response: Response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        accept: "application/json",
        access_token: apiKey,
        ...(init.body ? { "content-type": "application/json" } : {}),
        ...init.headers,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(65_000),
    });
  } catch {
    throw new AsaasApiError("GATEWAY_UNAVAILABLE", 503);
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as AsaasErrorPayload;
    const code = payload.errors?.[0]?.code?.toLowerCase() ?? "";
    const description = payload.errors?.[0]?.description?.toLowerCase() ?? "";
    const refused = response.status === 400
      && /credit|cart|refus|denied|not authorized|transa/.test(`${code} ${description}`);

    throw new AsaasApiError(refused ? "CARD_REFUSED" : "INVALID_DATA", response.status);
  }

  return (await response.json()) as T;
}

async function findMatchingCustomer(email: string, cpfCnpj: string): Promise<AsaasCustomer | null> {
  const query = new URLSearchParams({ cpfCnpj, email, limit: "10" });
  const result = await asaasFetch<AsaasList<AsaasCustomer>>(`/customers?${query}`);
  return result.data.find(
    (customer) => customer.email?.trim().toLowerCase() === email
      && customer.cpfCnpj?.replace(/\D/g, "") === cpfCnpj,
  ) ?? null;
}

export async function findOrCreateAsaasCustomer(
  orderId: string,
  checkout: CheckoutRequest,
): Promise<AsaasCustomer> {
  const existing = await findMatchingCustomer(checkout.email, checkout.cpfCnpj);
  if (existing) return existing;

  return asaasFetch<AsaasCustomer>("/customers", {
    method: "POST",
    body: JSON.stringify({
      name: checkout.name,
      email: checkout.email,
      cpfCnpj: checkout.cpfCnpj,
      mobilePhone: checkout.mobilePhone,
      externalReference: orderId,
      notificationDisabled: true,
    }),
  });
}

function todayIsoDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

async function listSubscriptionPayments(subscriptionId: string): Promise<AsaasPayment[]> {
  const result = await asaasFetch<AsaasList<AsaasPayment>>(
    `/subscriptions/${encodeURIComponent(subscriptionId)}/payments?limit=10&offset=0`,
  );
  return result.data;
}

export async function getFirstAsaasSubscriptionPayment(
  subscriptionId: string,
): Promise<AsaasPayment | undefined> {
  return (await listSubscriptionPayments(subscriptionId))[0];
}

async function waitForFirstPayment(subscriptionId: string): Promise<AsaasPayment> {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const [payment] = await listSubscriptionPayments(subscriptionId);
    if (payment) return payment;
    await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
  }
  throw new AsaasApiError("GATEWAY_UNAVAILABLE", 503);
}

export async function createAsaasSubscription(input: {
  orderId: string;
  customerId: string;
  checkout: CheckoutRequest;
  plan: CheckoutPlan;
  amount: number;
  billingCycle: BillingCycle;
  remoteIp: string;
  onSubscriptionCreated?: (subscription: AsaasSubscription) => Promise<void>;
  onPaymentCreated?: (payment: AsaasPayment) => Promise<void>;
}): Promise<{
  subscription: AsaasSubscription;
  payment: AsaasPayment;
  pixQrCode?: PixQrCode;
}> {
  const { checkout } = input;
  const cardPayload = checkout.paymentMethod === "CREDIT_CARD" && checkout.card
    ? {
        creditCard: {
          holderName: checkout.card.holderName,
          number: checkout.card.number,
          expiryMonth: checkout.card.expiryMonth,
          expiryYear: checkout.card.expiryYear,
          ccv: checkout.card.ccv,
        },
        creditCardHolderInfo: {
          name: checkout.name,
          email: checkout.email,
          cpfCnpj: checkout.cpfCnpj,
          postalCode: checkout.postalCode,
          addressNumber: checkout.addressNumber,
          mobilePhone: checkout.mobilePhone,
        },
        remoteIp: input.remoteIp,
      }
    : {};

  const subscription = await asaasFetch<AsaasSubscription>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      customer: input.customerId,
      billingType: checkout.paymentMethod,
      value: input.amount,
      nextDueDate: todayIsoDate(),
      cycle: input.billingCycle === "annual" ? "YEARLY" : "MONTHLY",
      description: input.billingCycle === "annual"
        ? `${input.plan.name} — assinatura anual via Pix`
        : `${input.plan.name} — assinatura mensal no cartão`,
      externalReference: input.orderId,
      ...cardPayload,
    }),
  });

  await input.onSubscriptionCreated?.(subscription);

  const payment = await waitForFirstPayment(subscription.id);
  await input.onPaymentCreated?.(payment);
  if (checkout.paymentMethod === "CREDIT_CARD") return { subscription, payment };

  const pixQrCode = await getAsaasPixQrCode(payment.id);
  return { subscription, payment, pixQrCode };
}

export async function getAsaasPixQrCode(paymentId: string): Promise<PixQrCode> {
  return asaasFetch<PixQrCode>(`/payments/${encodeURIComponent(paymentId)}/pixQrCode`);
}
