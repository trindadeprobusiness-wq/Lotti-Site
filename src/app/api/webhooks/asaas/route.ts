import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import type { AsaasPayment } from "@/lib/asaas/server";
import {
  claimWebhookEvent,
  findCheckoutOrderForPayment,
  finishWebhookEvent,
  updateCheckoutOrder,
} from "@/lib/checkout/repository";
import { provisionPaidOrder, updateSubscriptionLifecycle } from "@/lib/checkout/provisioning";

export const runtime = "nodejs";

type AsaasWebhook = {
  id?: string;
  event?: string;
  payment?: AsaasPayment;
};

const paidEvents = new Set(["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"]);
const overdueEvents = new Set(["PAYMENT_OVERDUE"]);
const reversedEvents = new Set([
  "PAYMENT_REFUNDED",
  "PAYMENT_PARTIALLY_REFUNDED",
  "PAYMENT_CHARGEBACK_REQUESTED",
  "PAYMENT_CHARGEBACK_DISPUTE",
  "PAYMENT_DELETED",
]);

function safeTokenMatch(received: string, expected: string): boolean {
  const left = Buffer.from(received, "utf8");
  const right = Buffer.from(expected, "utf8");
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function POST(request: NextRequest) {
  const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN;
  const receivedToken = request.headers.get("asaas-access-token") ?? "";
  if (!expectedToken || !safeTokenMatch(receivedToken, expectedToken)) {
    return NextResponse.json({ received: false }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as AsaasWebhook | null;
  if (!body?.id || !body.event || !body.payment?.id) {
    return NextResponse.json({ received: false }, { status: 400 });
  }

  let claimed = false;
  try {
    claimed = await claimWebhookEvent({
      id: body.id,
      eventType: body.event,
      paymentId: body.payment.id,
    });
    if (!claimed) return NextResponse.json({ received: true });

    const order = await findCheckoutOrderForPayment({
      externalReference: body.payment.externalReference,
      subscriptionId: body.payment.subscription,
    });
    if (!order) {
      await finishWebhookEvent(body.id, "ignored");
      return NextResponse.json({ received: true });
    }

    await updateCheckoutOrder(order.id, {
      asaas_payment_id: body.payment.id,
      asaas_subscription_id: body.payment.subscription ?? order.asaas_subscription_id,
    });

    const refreshed = {
      ...order,
      asaas_payment_id: body.payment.id,
      asaas_subscription_id: body.payment.subscription ?? order.asaas_subscription_id,
    };

    if (paidEvents.has(body.event)) {
      if (!order.access_email_sent_at) await provisionPaidOrder(refreshed);
      else {
        await updateSubscriptionLifecycle(refreshed, "active");
        await updateCheckoutOrder(order.id, { status: "active", failure_code: null });
      }
    } else if (overdueEvents.has(body.event)) {
      await updateSubscriptionLifecycle(refreshed, "past_due");
      await updateCheckoutOrder(order.id, { status: "overdue", failure_code: "PAYMENT_OVERDUE" });
    } else if (reversedEvents.has(body.event)) {
      await updateSubscriptionLifecycle(refreshed, "canceled");
      await updateCheckoutOrder(order.id, { status: "refunded", failure_code: body.event });
    } else {
      await finishWebhookEvent(body.id, "ignored");
      return NextResponse.json({ received: true });
    }

    await finishWebhookEvent(body.id, "processed");
    return NextResponse.json({ received: true });
  } catch {
    if (claimed) {
      await finishWebhookEvent(body.id, "failed", "PROCESSING_FAILED").catch(() => undefined);
    }
    return NextResponse.json({ received: false }, { status: 500 });
  }
}
