"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  CircleAlert,
  Copy,
  CreditCard,
  LoaderCircle,
  LockKeyhole,
  Mail,
  QrCode,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { CreditCardForm, type CreditCardData } from "@/components/ui/CreditCardForm";
import {
  billingCycleForPayment,
  checkoutPlans,
  formatCurrency,
  planPrice,
  type BillingCycle,
  type PaymentMethod,
  type PlanCode,
} from "@/lib/checkout/catalog";
import { checkoutRequestSchema, digitsOnly, isValidCpfCnpj } from "@/lib/checkout/validation";

type CheckoutStatus =
  | "idle"
  | "submitting"
  | "awaiting_payment"
  | "processing"
  | "active"
  | "failed"
  | "overdue"
  | "refunded";

type CheckoutResponse = {
  ok: boolean;
  orderId?: string;
  statusToken?: string;
  status?: CheckoutStatus;
  message?: string;
  pix?: {
    encodedImage: string;
    payload: string;
    expirationDate: string;
  };
};

type CheckoutFormProps = {
  initialPlanCode: PlanCode;
};

const emptyCard: CreditCardData = {
  number: "",
  holderName: "",
  expiryMonth: "",
  expiryYear: "",
  ccv: "",
};

function formatCpfCnpj(value: string): string {
  const digits = digitsOnly(value).slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");
  }
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function formatPhone(value: string): string {
  const digits = digitsOnly(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

function formatPostalCode(value: string): string {
  return digitsOnly(value).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
}

export function CheckoutForm({ initialPlanCode }: CheckoutFormProps) {
  const [planCode, setPlanCode] = useState(initialPlanCode);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PIX");
  const billingCycle: BillingCycle = billingCycleForPayment(paymentMethod);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [card, setCard] = useState(emptyCard);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<CheckoutStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [order, setOrder] = useState<{ id: string; token: string } | null>(null);
  const [pix, setPix] = useState<CheckoutResponse["pix"]>();
  const [copied, setCopied] = useState(false);
  const checkoutAttempt = useRef<{ id: string; token: string } | null>(null);

  const plan = checkoutPlans[planCode];
  const monthlyAmount = planPrice(plan, "monthly");
  const amount = planPrice(plan, billingCycle);
  const isBusy = status === "submitting";
  const hasFinished = status !== "idle" && status !== "submitting" && Boolean(order);
  const documentInvalid = submitted && !isValidCpfCnpj(cpfCnpj);
  const phoneInvalid = submitted && ![10, 11].includes(digitsOnly(mobilePhone).length);

  const payload = {
    planCode,
    billingCycle,
    paymentMethod,
    name,
    email,
    cpfCnpj,
    mobilePhone,
    postalCode: paymentMethod === "CREDIT_CARD" ? postalCode : undefined,
    addressNumber: paymentMethod === "CREDIT_CARD" ? addressNumber : undefined,
    card: paymentMethod === "CREDIT_CARD"
      ? {
          number: card.number,
          holderName: card.holderName,
          expiryMonth: card.expiryMonth,
          expiryYear: card.expiryYear,
          ccv: card.ccv,
        }
      : undefined,
    acceptedTerms,
  };

  const resetAttempt = () => {
    checkoutAttempt.current = null;
    setSubmitted(false);
    setErrorMessage("");
  };

  const choosePaymentMethod = (method: PaymentMethod) => {
    if (method === paymentMethod) return;
    resetAttempt();
    setPaymentMethod(method);
  };

  const choosePlan = (code: PlanCode) => {
    if (code === planCode) return;
    resetAttempt();
    setPlanCode(code);
  };

  useEffect(() => {
    if (!order || status === "active" || status === "failed" || status === "refunded") return;

    let cancelled = false;
    const checkStatus = async () => {
      const query = new URLSearchParams({ pedido: order.id, token: order.token });
      const response = await fetch(`/api/checkout/status?${query}`, { cache: "no-store" }).catch(() => null);
      if (!response?.ok || cancelled) return;
      const data = await response.json() as {
        status?: CheckoutStatus;
        pix?: CheckoutResponse["pix"];
      };
      if (data.status) setStatus(data.status);
      if (data.pix) setPix(data.pix);
    };

    void checkStatus();
    const timer = window.setInterval(() => void checkStatus(), 4_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [order, status]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setErrorMessage("");

    checkoutAttempt.current ??= {
      id: crypto.randomUUID(),
      token: `${crypto.randomUUID().replaceAll("-", "")}${crypto.randomUUID().replaceAll("-", "")}`,
    };
    const parsed = checkoutRequestSchema.safeParse({
      ...payload,
      checkoutAttemptId: checkoutAttempt.current.id,
      checkoutAttemptToken: checkoutAttempt.current.token,
    });
    if (!parsed.success) {
      setErrorMessage("Revise os campos indicados antes de continuar.");
      return;
    }

    setStatus("submitting");
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(parsed.data),
    }).catch(() => null);
    const data = response
      ? await response.json().catch(() => ({ ok: false })) as CheckoutResponse
      : { ok: false };

    if (!response?.ok || !data.ok || !data.orderId || !data.statusToken) {
      setStatus("idle");
      checkoutAttempt.current = null;
      setCard((current) => ({ ...current, ccv: "" }));
      setErrorMessage(
        data.message ?? "Não foi possível conectar ao pagamento. Verifique sua internet e tente novamente.",
      );
      return;
    }

    setOrder({ id: data.orderId, token: data.statusToken });
    setPix(data.pix);
    setStatus(data.status === "awaiting_payment" ? "awaiting_payment" : "processing");
    setCard(emptyCard);
  };

  const copyPix = async () => {
    if (!pix?.payload) return;
    await navigator.clipboard.writeText(pix.payload);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2_000);
  };

  return (
    <div className="min-h-screen bg-surface/60">
      <header className="border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex min-h-[4.75rem] max-w-[84rem] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
          <Link href="/" aria-label="Voltar para o início da Lotti">
            <Logo size={27} />
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted sm:text-sm">
            <LockKeyhole size={16} className="text-forest" aria-hidden="true" />
            Ambiente de pagamento seguro
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[84rem] px-5 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/planos" className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-ink">
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar aos planos
          </Link>
          <ol className="checkout-progress" aria-label="Etapas da contratação">
            <li className="is-current"><span>1</span>Identificação</li>
            <li className={hasFinished ? "is-complete" : ""}><span>2</span>Pagamento</li>
            <li className={status === "active" ? "is-complete" : ""}><span>3</span>Acesso</li>
          </ol>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:gap-10">
          <section className="overflow-hidden rounded-[1.35rem] border border-line bg-paper shadow-[0_24px_70px_rgba(9,51,35,0.08)]">
            <div className="flex items-center justify-between gap-4 bg-forest px-5 py-4 text-white lg:hidden">
              <div className="min-w-0">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/65">Plano selecionado</p>
                <p className="mt-1 truncate text-sm font-semibold">{plan.name}</p>
              </div>
              <div className="shrink-0 text-right">
                <p data-numeric className="font-semibold">{formatCurrency(amount)}</p>
                <p className="text-[0.65rem] text-white/65">
                  {paymentMethod === "PIX" ? "12 meses via Pix" : "por mês"}
                </p>
              </div>
            </div>
            {hasFinished ? (
              <div className="p-6 sm:p-9 lg:p-11">
                {status === "active" ? (
                  <div className="mx-auto max-w-xl py-8 text-center" aria-live="polite">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest text-white">
                      <Check size={30} aria-hidden="true" />
                    </span>
                    <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-forest">Pagamento confirmado</p>
                    <h1 className="mt-3 text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">
                      Seu acesso está a caminho.
                    </h1>
                    <p className="mx-auto mt-5 max-w-[48ch] text-muted">
                      Enviamos para <strong className="font-semibold text-ink">{email}</strong> o link exclusivo para criar sua senha e iniciar o onboarding da Lotti.
                    </p>
                    <div className="mt-8 rounded-xl border border-line bg-surface p-5 text-left text-sm text-muted">
                      <p className="flex gap-3"><Mail size={18} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" /> Confira também as abas Promoções e Spam. O link é pessoal e não deve ser compartilhado.</p>
                    </div>
                  </div>
                ) : status === "failed" || status === "refunded" ? (
                  <div className="mx-auto max-w-xl py-10 text-center" role="alert">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-700">
                      <CircleAlert size={30} aria-hidden="true" />
                    </span>
                    <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-red-700">
                      {status === "refunded" ? "Pagamento estornado" : "Pagamento não concluído"}
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
                      O acesso não foi liberado.
                    </h1>
                    <p className="mx-auto mt-4 max-w-[48ch] text-muted">
                      Nenhuma conta foi ativada por este pedido. Volte aos planos para escolher novamente a forma de pagamento.
                    </p>
                    <Link href="/planos" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-white transition-colors hover:bg-black">
                      Voltar aos planos
                    </Link>
                  </div>
                ) : status === "overdue" ? (
                  <div className="mx-auto max-w-xl py-10 text-center" aria-live="polite">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-800">
                      <CircleAlert size={30} aria-hidden="true" />
                    </span>
                    <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Pagamento vencido</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">Este pedido ainda não liberou acesso.</h1>
                    <p className="mx-auto mt-4 max-w-[48ch] text-muted">Evite pagar um QR Code vencido. A página continuará verificando uma eventual confirmação do Asaas.</p>
                  </div>
                ) : paymentMethod === "PIX" && pix ? (
                  <div className="mx-auto max-w-2xl" aria-live="polite">
                    <div className="text-center">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">Pix gerado</p>
                      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">Escaneie para concluir</h1>
                      <p className="mt-3 text-muted">A confirmação acontece automaticamente. Não feche esta página até o pagamento aparecer como aprovado.</p>
                    </div>
                    <div className="mt-8 grid gap-7 rounded-2xl border border-line bg-surface/70 p-5 sm:grid-cols-[15rem_1fr] sm:p-7">
                      <div className="mx-auto rounded-2xl border border-line bg-white p-3 shadow-sm">
                        <Image
                          src={`data:image/png;base64,${pix.encodedImage}`}
                          alt="QR Code Pix desta assinatura"
                          width={216}
                          height={216}
                          unoptimized
                        />
                      </div>
                      <div className="flex min-w-0 flex-col justify-center">
                        <p className="text-sm font-semibold text-ink">Pix copia e cola</p>
                        <p className="mt-2 line-clamp-4 break-all rounded-lg bg-paper p-3 font-mono text-xs leading-relaxed text-muted">
                          {pix.payload}
                        </p>
                        <button type="button" onClick={copyPix} className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-white transition-colors hover:bg-black">
                          {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                          {copied ? "Código copiado" : "Copiar código Pix"}
                        </button>
                        <p className="mt-4 flex items-center gap-2 text-xs text-muted">
                          <LoaderCircle size={14} className="animate-spin text-forest" aria-hidden="true" />
                          Aguardando confirmação do Asaas
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto max-w-xl py-14 text-center" aria-live="polite">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface text-forest">
                      <LoaderCircle size={30} className="animate-spin" aria-hidden="true" />
                    </span>
                    <h1 className="mt-7 text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">Confirmando seu pagamento</h1>
                    <p className="mx-auto mt-4 max-w-[46ch] text-muted">O cartão foi enviado para análise do Asaas. Assim que o webhook confirmar, seu convite será enviado para {email}.</p>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="border-b border-line px-6 py-7 sm:px-9 lg:px-11 lg:py-9">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest text-white">
                      <UserRound size={20} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest">Seus dados</p>
                      <h1 className="mt-1 text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">Quem vai acessar a Lotti?</h1>
                      <p className="mt-2 max-w-[58ch] text-sm text-muted">O e-mail informado aqui será o único endereço autorizado a criar a senha inicial.</p>
                    </div>
                  </div>

                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="checkout-label" htmlFor="checkout-name">Nome completo ou razão social</label>
                      <input id="checkout-name" className="checkout-input" autoComplete="name" value={name} disabled={isBusy} aria-invalid={submitted && name.trim().length < 3} onChange={(event) => setName(event.target.value)} placeholder="Como devemos chamar você?" />
                    </div>
                    <div>
                      <label className="checkout-label" htmlFor="checkout-email">E-mail de acesso</label>
                      <input id="checkout-email" className="checkout-input" type="email" inputMode="email" autoComplete="email" value={email} disabled={isBusy} aria-invalid={submitted && !/^\S+@\S+\.\S+$/.test(email)} onChange={(event) => setEmail(event.target.value)} placeholder="voce@empresa.com.br" />
                    </div>
                    <div>
                      <label className="checkout-label" htmlFor="checkout-document">CPF ou CNPJ</label>
                      <input id="checkout-document" className="checkout-input" inputMode="numeric" autoComplete="off" value={formatCpfCnpj(cpfCnpj)} disabled={isBusy} aria-invalid={documentInvalid} onChange={(event) => setCpfCnpj(digitsOnly(event.target.value).slice(0, 14))} placeholder="000.000.000-00" />
                      {documentInvalid ? <p className="checkout-error">Informe um CPF ou CNPJ válido.</p> : null}
                    </div>
                    <div>
                      <label className="checkout-label" htmlFor="checkout-phone">Celular</label>
                      <input id="checkout-phone" className="checkout-input" inputMode="tel" autoComplete="tel" value={formatPhone(mobilePhone)} disabled={isBusy} aria-invalid={phoneInvalid} onChange={(event) => setMobilePhone(digitsOnly(event.target.value).slice(0, 11))} placeholder="(11) 99999-9999" />
                      {phoneInvalid ? <p className="checkout-error">Informe um telefone com DDD.</p> : null}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-7 sm:px-9 lg:px-11 lg:py-9">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface text-forest">
                      <CreditCard size={20} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest">Pagamento</p>
                      <h2 className="mt-1 text-2xl font-semibold tracking-[-0.025em] text-ink">Como você prefere pagar?</h2>
                    </div>
                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Forma de pagamento">
                    <button type="button" role="radio" aria-checked={paymentMethod === "CREDIT_CARD"} className={`checkout-payment-option ${paymentMethod === "CREDIT_CARD" ? "is-selected" : ""}`} disabled={isBusy} onClick={() => choosePaymentMethod("CREDIT_CARD")}>
                      <CreditCard size={21} aria-hidden="true" />
                      <span><strong>Cartão</strong><small>Cobrança mensal automática</small></span>
                      {paymentMethod === "CREDIT_CARD" ? <Check size={17} className="ml-auto" aria-hidden="true" /> : null}
                    </button>
                    <button type="button" role="radio" aria-checked={paymentMethod === "PIX"} className={`checkout-payment-option ${paymentMethod === "PIX" ? "is-selected" : ""}`} disabled={isBusy} onClick={() => choosePaymentMethod("PIX")}>
                      <QrCode size={21} aria-hidden="true" />
                      <span><strong>Pix</strong><small>12 meses em um pagamento</small></span>
                      {paymentMethod === "PIX" ? <Check size={17} className="ml-auto" aria-hidden="true" /> : null}
                    </button>
                  </div>

                  <div className="mt-8">
                    {paymentMethod === "CREDIT_CARD" ? (
                      <>
                        <CreditCardForm value={card} onChange={setCard} disabled={isBusy} forceErrors={submitted} />
                        <div className="mt-7 grid gap-5 sm:grid-cols-[1fr_0.55fr]">
                          <div>
                            <label className="checkout-label" htmlFor="checkout-postal-code">CEP do titular</label>
                            <input id="checkout-postal-code" className="checkout-input" inputMode="numeric" autoComplete="postal-code" value={formatPostalCode(postalCode)} disabled={isBusy} aria-invalid={submitted && digitsOnly(postalCode).length !== 8} onChange={(event) => setPostalCode(digitsOnly(event.target.value).slice(0, 8))} placeholder="00000-000" />
                          </div>
                          <div>
                            <label className="checkout-label" htmlFor="checkout-address-number">Número</label>
                            <input id="checkout-address-number" className="checkout-input" autoComplete="address-line2" value={addressNumber} disabled={isBusy} aria-invalid={submitted && !addressNumber.trim()} onChange={(event) => setAddressNumber(event.target.value.slice(0, 20))} placeholder="123" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/70 p-6 sm:p-8">
                        <div className="absolute -right-10 -top-14 h-40 w-40 rotate-[28deg] rounded-[2.5rem] bg-forest/10" aria-hidden="true" />
                        <div className="relative flex items-start gap-4">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-forest shadow-sm"><QrCode size={23} aria-hidden="true" /></span>
                          <div>
                            <h3 className="font-semibold text-ink">Pagamento anual via Pix</h3>
                            <p className="mt-2 max-w-[55ch] text-sm text-muted">
                              O total de <strong className="font-semibold text-ink">{formatCurrency(amount)}</strong> é referente a 12 meses de <strong className="font-semibold text-ink">{formatCurrency(monthlyAmount)}</strong>. Seu acesso só será liberado quando o Asaas confirmar o recebimento.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <label className="mt-8 flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface/55 p-4 text-sm text-muted">
                    <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#093323]" checked={acceptedTerms} disabled={isBusy} onChange={(event) => setAcceptedTerms(event.target.checked)} />
                    {paymentMethod === "PIX" ? (
                      <span>Confirmo que os dados estão corretos e autorizo a cobrança anual de <strong className="font-semibold text-ink">{formatCurrency(amount)}</strong>, referente a 12 mensalidades de <strong className="font-semibold text-ink">{formatCurrency(monthlyAmount)}</strong>, com renovação a cada 12 meses até o cancelamento.</span>
                    ) : (
                      <span>Confirmo que os dados estão corretos e autorizo a cobrança mensal recorrente de <strong className="font-semibold text-ink">{formatCurrency(amount)}</strong>, até o cancelamento.</span>
                    )}
                  </label>

                  {errorMessage ? (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
                      {errorMessage}
                    </div>
                  ) : null}

                  <button type="submit" disabled={isBusy} className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-forest px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(9,51,35,0.22)] transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60">
                    {isBusy ? <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> : paymentMethod === "PIX" ? <QrCode size={18} aria-hidden="true" /> : <LockKeyhole size={18} aria-hidden="true" />}
                    {isBusy ? "Conectando ao Asaas..." : paymentMethod === "PIX" ? `Gerar Pix de ${formatCurrency(amount)}` : `Pagar ${formatCurrency(amount)} com cartão`}
                  </button>
                  <p className="mt-4 text-center text-xs leading-relaxed text-muted">A Lotti não armazena o número completo do cartão nem o código de segurança.</p>
                </div>
              </form>
            )}
          </section>

          <aside className="sticky top-6 overflow-hidden rounded-[1.35rem] border border-line bg-paper shadow-[0_18px_55px_rgba(9,51,35,0.07)]">
            <div className="bg-forest p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/65">Sua assinatura</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">{plan.name}</h2>
                  <p className="mt-1 text-sm text-white/70">{plan.audience}</p>
                </div>
                <BadgeCheck size={24} className="shrink-0 text-white/85" aria-hidden="true" />
              </div>
            </div>

            <div className="p-6">
              {!hasFinished ? (
                <>
                  <label className="checkout-label" htmlFor="checkout-plan">Plano</label>
                  <select id="checkout-plan" className="checkout-input" value={planCode} disabled={isBusy} onChange={(event) => choosePlan(event.target.value as PlanCode)}>
                    {Object.values(checkoutPlans).map((option) => <option key={option.code} value={option.code}>{option.name}</option>)}
                  </select>
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-sm">
                    <span className="text-muted">Ciclo de cobrança</span>
                    <strong className="font-semibold text-ink">{paymentMethod === "PIX" ? "Anual via Pix" : "Mensal no cartão"}</strong>
                  </div>
                </>
              ) : null}

              <ul className="mt-6 grid gap-3 border-b border-line pb-6">
                {plan.checkoutFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-muted"><Check size={16} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" />{feature}</li>
                ))}
              </ul>

              <div className="pt-6">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-sm text-muted">Mensalidade</span>
                  <strong data-numeric className="text-xl font-semibold tracking-[-0.03em] text-ink">{formatCurrency(monthlyAmount)}</strong>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4 border-t border-dashed border-line pt-4">
                  <span className="font-semibold text-ink">Total hoje</span>
                  <strong data-numeric className="text-2xl font-semibold tracking-[-0.04em] text-forest">{formatCurrency(amount)}</strong>
                </div>
                <p className="mt-2 text-right text-xs text-muted">
                  {paymentMethod === "PIX"
                    ? `Referente a 12 meses de ${formatCurrency(monthlyAmount)} · renovação anual`
                    : "Renovação mensal"}
                </p>
              </div>

              <div className="mt-6 grid gap-3 border-t border-line pt-6 text-xs text-muted">
                <p className="flex items-center gap-2"><ShieldCheck size={16} className="text-forest" aria-hidden="true" /> Processado com segurança pelo Asaas</p>
                <p className="flex items-center gap-2"><Mail size={16} className="text-forest" aria-hidden="true" /> Acesso enviado ao e-mail do pagamento</p>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-line pt-5 text-[0.68rem] font-bold tracking-[0.08em] text-muted/80" aria-label="Meios de pagamento aceitos">
                <span>PIX</span><span>VISA</span><span>MASTERCARD</span><span>ELO</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
