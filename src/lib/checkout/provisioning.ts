import "server-only";

import type { User } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  claimCheckoutOrderProvisioning,
  updateCheckoutOrder,
  type CheckoutOrder,
} from "./repository";

type CorretorRow = {
  id: string;
  user_id: string;
};

function periodEnd(cycle: CheckoutOrder["billing_cycle"]): string {
  const end = new Date();
  end.setUTCMonth(end.getUTCMonth() + (cycle === "annual" ? 12 : 1));
  return end.toISOString();
}

async function findCorretorByEmail(email: string): Promise<CorretorRow | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("corretores")
    .select("id,user_id")
    .ilike("email", email)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`PROVISION_PROFILE_LOOKUP_FAILED:${error.code ?? "unknown"}`);
  return data as CorretorRow | null;
}

async function findCorretorByUserId(userId: string): Promise<CorretorRow> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("corretores")
    .select("id,user_id")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    throw new Error(`PROVISION_PROFILE_CREATE_FAILED:${error?.code ?? "missing"}`);
  }
  return data as CorretorRow;
}

async function inviteOrFindUser(order: CheckoutOrder): Promise<{
  user: User | null;
  corretor: CorretorRow;
  invited: boolean;
}> {
  const existing = await findCorretorByEmail(order.payer_email);
  if (existing) return { user: null, corretor: existing, invited: false };

  const redirectTo = process.env.LOTTI_APP_PASSWORD_SETUP_URL;
  if (!redirectTo) throw new Error("PROVISION_REDIRECT_NOT_CONFIGURED");

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(order.payer_email, {
    redirectTo,
    data: {
      nome: order.payer_name,
      telefone: order.payer_phone,
      cnpj: order.payer_document,
      origem: "checkout_asaas",
    },
  });

  if (error || !data.user) {
    const profileAfterConflict = await findCorretorByEmail(order.payer_email);
    if (profileAfterConflict) {
      return { user: null, corretor: profileAfterConflict, invited: false };
    }
    throw new Error("PROVISION_INVITE_FAILED");
  }

  const corretor = await findCorretorByUserId(data.user.id);
  return { user: data.user, corretor, invited: true };
}

async function activateSubscription(order: CheckoutOrder, corretorId: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { data: plan, error: planError } = await supabase
    .from("plans")
    .select("id")
    .eq("code", order.plan_code)
    .eq("active", true)
    .single();

  if (planError || !plan) {
    throw new Error(`PROVISION_PLAN_NOT_FOUND:${planError?.code ?? "missing"}`);
  }

  const { data: current, error: currentError } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("corretor_id", corretorId)
    .in("status", ["trialing", "active", "past_due", "read_only"])
    .limit(1)
    .maybeSingle();

  if (currentError) {
    throw new Error(`PROVISION_SUBSCRIPTION_LOOKUP_FAILED:${currentError.code ?? "unknown"}`);
  }

  const values = {
    plan_id: plan.id,
    billing_cycle: order.billing_cycle,
    status: "active",
    trial_started_at: null,
    trial_ends_at: null,
    current_period_start: new Date().toISOString(),
    current_period_end: periodEnd(order.billing_cycle),
    cancel_at_period_end: false,
    canceled_at: null,
    cancel_reason: null,
    external_subscription_id: order.asaas_subscription_id,
  };

  const mutation = current
    ? supabase.from("subscriptions").update(values).eq("id", current.id)
    : supabase.from("subscriptions").insert({ ...values, corretor_id: corretorId });
  const { error } = await mutation;
  if (error) throw new Error(`PROVISION_SUBSCRIPTION_WRITE_FAILED:${error.code ?? "unknown"}`);
}

async function sendRecoveryEmail(email: string): Promise<void> {
  const redirectTo = process.env.LOTTI_APP_PASSWORD_SETUP_URL;
  if (!redirectTo) throw new Error("PROVISION_REDIRECT_NOT_CONFIGURED");

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw new Error("PROVISION_RECOVERY_EMAIL_FAILED");
}

export async function provisionPaidOrder(order: CheckoutOrder): Promise<void> {
  const claimed = await claimCheckoutOrderProvisioning(order.id);
  if (!claimed) return;

  try {
    const account = await inviteOrFindUser(order);
    await activateSubscription(order, account.corretor.id);

    if (!account.invited && !order.access_email_sent_at) {
      await sendRecoveryEmail(order.payer_email);
    }

    await updateCheckoutOrder(order.id, {
      status: "active",
      provisioned_user_id: account.corretor.user_id,
      access_email_sent_at: order.access_email_sent_at ?? new Date().toISOString(),
      provisioning_started_at: null,
      failure_code: null,
    });
  } catch (error) {
    await updateCheckoutOrder(order.id, {
      status: "processing",
      provisioning_started_at: null,
      failure_code: "PROVISIONING_RETRY",
    }).catch(() => undefined);
    throw error;
  }
}

export async function updateSubscriptionLifecycle(
  order: CheckoutOrder,
  status: "active" | "past_due" | "canceled",
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status,
      ...(status === "canceled"
        ? { canceled_at: new Date().toISOString(), cancel_reason: "asaas_payment_reversed" }
        : {}),
    })
    .eq("external_subscription_id", order.asaas_subscription_id);

  if (error) throw new Error(`PROVISION_LIFECYCLE_UPDATE_FAILED:${error.code ?? "unknown"}`);
}
