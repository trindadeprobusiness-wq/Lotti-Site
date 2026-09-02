import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import type { BillingCycle, PaymentMethod, PlanCode } from "./catalog";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type CheckoutOrderStatus =
  | "creating"
  | "awaiting_payment"
  | "processing"
  | "active"
  | "failed"
  | "overdue"
  | "refunded";

export type CheckoutOrder = {
  id: string;
  payer_name: string;
  payer_email: string;
  payer_document: string;
  payer_phone: string;
  plan_code: PlanCode;
  billing_cycle: BillingCycle;
  payment_method: PaymentMethod;
  amount: number;
  status: CheckoutOrderStatus;
  access_token_hash: string;
  asaas_customer_id: string | null;
  asaas_subscription_id: string | null;
  asaas_payment_id: string | null;
  provisioned_user_id: string | null;
  access_email_sent_at: string | null;
  provisioning_started_at: string | null;
  failure_code: string | null;
};

export function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function tokensMatch(token: string, expectedHash: string): boolean {
  const actual = Buffer.from(sha256(token), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function createCheckoutOrder(input: {
  id: string;
  statusToken: string;
  payerName: string;
  payerEmail: string;
  payerDocument: string;
  payerPhone: string;
  planCode: PlanCode;
  billingCycle: BillingCycle;
  paymentMethod: PaymentMethod;
  amount: number;
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("checkout_orders").insert({
    id: input.id,
    access_token_hash: sha256(input.statusToken),
    payer_name: input.payerName,
    payer_email: input.payerEmail,
    payer_document: input.payerDocument,
    payer_phone: input.payerPhone,
    plan_code: input.planCode,
    billing_cycle: input.billingCycle,
    payment_method: input.paymentMethod,
    amount: input.amount,
    status: "creating",
  });

  if (error) throw new Error(`CHECKOUT_ORDER_CREATE_FAILED:${error.code ?? "unknown"}`);
}

export async function updateCheckoutOrder(
  id: string,
  values: Partial<CheckoutOrder> & { failure_code?: string | null },
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("checkout_orders").update(values).eq("id", id);
  if (error) throw new Error(`CHECKOUT_ORDER_UPDATE_FAILED:${error.code ?? "unknown"}`);
}

export async function getCheckoutOrder(id: string): Promise<CheckoutOrder | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("checkout_orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`CHECKOUT_ORDER_READ_FAILED:${error.code ?? "unknown"}`);
  return data as CheckoutOrder | null;
}

export async function findCheckoutOrderForPayment(input: {
  externalReference?: string | null;
  subscriptionId?: string | null;
}): Promise<CheckoutOrder | null> {
  const supabase = getSupabaseAdmin();

  if (input.externalReference && /^[0-9a-f-]{36}$/i.test(input.externalReference)) {
    const byId = await getCheckoutOrder(input.externalReference);
    if (byId) return byId;
  }

  if (!input.subscriptionId) return null;
  const { data, error } = await supabase
    .from("checkout_orders")
    .select("*")
    .eq("asaas_subscription_id", input.subscriptionId)
    .maybeSingle();

  if (error) throw new Error(`CHECKOUT_ORDER_LOOKUP_FAILED:${error.code ?? "unknown"}`);
  return data as CheckoutOrder | null;
}

export async function claimWebhookEvent(input: {
  id: string;
  eventType: string;
  paymentId?: string | null;
}): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc("claim_asaas_checkout_event", {
    p_event_id: input.id,
    p_event_type: input.eventType,
    p_payment_id: input.paymentId ?? null,
  });

  if (error) throw new Error(`CHECKOUT_EVENT_CLAIM_FAILED:${error.code ?? "unknown"}`);
  return data === true;
}

export async function finishWebhookEvent(
  id: string,
  status: "processed" | "ignored" | "failed",
  errorCode?: string,
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.rpc("finish_asaas_checkout_event", {
    p_event_id: id,
    p_status: status,
    p_error_code: errorCode ?? null,
  });
  if (error) throw new Error(`CHECKOUT_EVENT_FINISH_FAILED:${error.code ?? "unknown"}`);
}

export async function claimCheckoutOrderProvisioning(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc("claim_checkout_order_provisioning", {
    p_order_id: id,
  });

  if (error) throw new Error(`CHECKOUT_PROVISION_CLAIM_FAILED:${error.code ?? "unknown"}`);
  return data === true;
}
