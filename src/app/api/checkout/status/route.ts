import { NextResponse, type NextRequest } from "next/server";
import { getCheckoutOrder, tokensMatch, updateCheckoutOrder } from "@/lib/checkout/repository";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { getAsaasPixQrCode, getFirstAsaasSubscriptionPayment } from "@/lib/asaas/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const orderId = request.nextUrl.searchParams.get("pedido") ?? "";
  const token = request.nextUrl.searchParams.get("token") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(orderId) || token.length < 32 || token.length > 128) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const order = await getCheckoutOrder(orderId).catch(() => null);
  if (!order || !tokensMatch(token, order.access_token_hash)) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  let paymentId = order.asaas_payment_id;
  if (order.payment_method === "PIX" && !paymentId && order.asaas_subscription_id) {
    const payment = await getFirstAsaasSubscriptionPayment(order.asaas_subscription_id)
      .catch(() => undefined);
    paymentId = payment?.id ?? null;
    if (paymentId) {
      await updateCheckoutOrder(order.id, {
        status: "awaiting_payment",
        asaas_payment_id: paymentId,
      }).catch(() => undefined);
    }
  }

  const pix = order.payment_method === "PIX" && paymentId
    ? await getAsaasPixQrCode(paymentId).catch(() => undefined)
    : undefined;

  return NextResponse.json({
    ok: true,
    status: paymentId && order.status === "processing" ? "awaiting_payment" : order.status,
    accessEmailSent: Boolean(order.access_email_sent_at),
    failureCode: order.failure_code ?? null,
    pix,
  });
}
