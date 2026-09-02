import { NextResponse, type NextRequest } from "next/server";
import { isAsaasConfigured, AsaasApiError, createAsaasSubscription, findOrCreateAsaasCustomer, getAsaasPixQrCode } from "@/lib/asaas/server";
import { checkoutPlans, planPrice } from "@/lib/checkout/catalog";
import { createCheckoutOrder, getCheckoutOrder, tokensMatch, updateCheckoutOrder } from "@/lib/checkout/repository";
import { checkoutRequestSchema } from "@/lib/checkout/validation";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function requestIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "127.0.0.1";
}

function hasAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const configured = process.env.CHECKOUT_ALLOWED_ORIGINS
    ?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (configured?.length) return configured.includes(origin);
  return origin === request.nextUrl.origin;
}

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ ok: false, code, message }, { status });
}

export async function POST(request: NextRequest) {
  if (!hasAllowedOrigin(request)) {
    return errorResponse("ORIGIN_NOT_ALLOWED", "Não foi possível iniciar o pagamento por esta origem.", 403);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 24_000) {
    return errorResponse("PAYLOAD_TOO_LARGE", "Os dados enviados excedem o limite permitido.", 413);
  }

  if (!isAsaasConfigured() || !isSupabaseConfigured()) {
    return errorResponse(
      "CHECKOUT_NOT_CONFIGURED",
      "O pagamento online está em configuração. Tente novamente em instantes.",
      503,
    );
  }

  const rawBody = await request.json().catch(() => null);
  const parsed = checkoutRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse(
      "INVALID_CHECKOUT_DATA",
      "Revise os campos destacados e tente novamente.",
      400,
    );
  }

  const checkout = parsed.data;
  const plan = checkoutPlans[checkout.planCode];
  const amount = planPrice(plan, checkout.billingCycle);
  const orderId = checkout.checkoutAttemptId;
  const statusToken = checkout.checkoutAttemptToken;
  let orderPersisted = false;
  let subscriptionCreated = false;

  try {
    const existing = await getCheckoutOrder(orderId);
    if (existing) {
      const sameAttempt = tokensMatch(statusToken, existing.access_token_hash)
        && existing.payer_email === checkout.email
        && existing.payer_document === checkout.cpfCnpj
        && existing.plan_code === checkout.planCode
        && existing.billing_cycle === checkout.billingCycle
        && existing.payment_method === checkout.paymentMethod;
      if (!sameAttempt) {
        return errorResponse("CHECKOUT_ATTEMPT_CONFLICT", "Esta tentativa de pagamento não pode ser reutilizada.", 409);
      }

      if (existing.asaas_subscription_id || existing.status !== "failed") {
        const pix = existing.payment_method === "PIX" && existing.asaas_payment_id
          ? await getAsaasPixQrCode(existing.asaas_payment_id).catch(() => undefined)
          : undefined;
        return NextResponse.json({
          ok: true,
          orderId,
          statusToken,
          status: existing.status === "failed" ? "processing" : existing.status,
          paymentMethod: existing.payment_method,
          pix,
        });
      }
    } else {
      await createCheckoutOrder({
        id: orderId,
        statusToken,
        payerName: checkout.name,
        payerEmail: checkout.email,
        payerDocument: checkout.cpfCnpj,
        payerPhone: checkout.mobilePhone,
        planCode: checkout.planCode,
        billingCycle: checkout.billingCycle,
        paymentMethod: checkout.paymentMethod,
        amount,
      });
    }
    orderPersisted = true;

    const customer = await findOrCreateAsaasCustomer(orderId, checkout);
    await updateCheckoutOrder(orderId, { asaas_customer_id: customer.id });

    const result = await createAsaasSubscription({
      orderId,
      customerId: customer.id,
      checkout,
      plan,
      amount,
      billingCycle: checkout.billingCycle,
      remoteIp: requestIp(request),
      onSubscriptionCreated: async (subscription) => {
        subscriptionCreated = true;
        await updateCheckoutOrder(orderId, { asaas_subscription_id: subscription.id });
      },
      onPaymentCreated: async (payment) => {
        await updateCheckoutOrder(orderId, {
          status: checkout.paymentMethod === "PIX" ? "awaiting_payment" : "processing",
          asaas_payment_id: payment.id,
        });
      },
    });

    await updateCheckoutOrder(orderId, {
      status: checkout.paymentMethod === "PIX" ? "awaiting_payment" : "processing",
      asaas_subscription_id: result.subscription.id,
      asaas_payment_id: result.payment.id,
      failure_code: null,
    });

    return NextResponse.json({
      ok: true,
      orderId,
      statusToken,
      status: checkout.paymentMethod === "PIX" ? "awaiting_payment" : "processing",
      paymentMethod: checkout.paymentMethod,
      pix: result.pixQrCode,
    });
  } catch (error) {
    const publicCode = error instanceof AsaasApiError ? error.publicCode : "CHECKOUT_FAILED";
    if (orderPersisted) {
      await updateCheckoutOrder(orderId, {
        status: subscriptionCreated ? "processing" : "failed",
        failure_code: publicCode,
      }).catch(() => undefined);
    }

    if (subscriptionCreated) {
      return NextResponse.json({
        ok: true,
        orderId,
        statusToken,
        status: "processing",
        paymentMethod: checkout.paymentMethod,
      }, { status: 202 });
    }

    if (publicCode === "CARD_REFUSED") {
      return errorResponse(
        publicCode,
        "O cartão não autorizou esta cobrança. Revise os dados ou use outro cartão.",
        402,
      );
    }
    if (publicCode === "INVALID_DATA") {
      return errorResponse(
        publicCode,
        "O Asaas não aceitou os dados informados. Revise o cadastro e tente novamente.",
        400,
      );
    }
    return errorResponse(
      "CHECKOUT_FAILED",
      "Não foi possível concluir agora. Nenhuma nova tentativa será feita automaticamente.",
      503,
    );
  }
}
