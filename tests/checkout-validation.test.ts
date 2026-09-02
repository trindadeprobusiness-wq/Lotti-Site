import assert from "node:assert/strict";
import test from "node:test";
import {
  billingCycleForPayment,
  checkoutPlans,
  planPrice,
} from "../src/lib/checkout/catalog";
import {
  checkoutRequestSchema,
  isFutureExpiration,
  isValidCpfCnpj,
  passesLuhn,
} from "../src/lib/checkout/validation";

test("valida CPF e CNPJ pelos dígitos verificadores", () => {
  assert.equal(isValidCpfCnpj("529.982.247-25"), true);
  assert.equal(isValidCpfCnpj("11.222.333/0001-81"), true);
  assert.equal(isValidCpfCnpj("111.111.111-11"), false);
  assert.equal(isValidCpfCnpj("11.222.333/0001-82"), false);
});

test("aplica Luhn e rejeita sequências repetidas", () => {
  assert.equal(passesLuhn("4111 1111 1111 1111"), true);
  assert.equal(passesLuhn("5555 5555 5555 4444"), true);
  assert.equal(passesLuhn("4111 1111 1111 1112"), false);
  assert.equal(passesLuhn("0000 0000 0000 0000"), false);
});

test("aceita somente validade atual ou futura", () => {
  const now = new Date();
  assert.equal(
    isFutureExpiration(String(now.getMonth() + 1).padStart(2, "0"), String(now.getFullYear())),
    true,
  );
  assert.equal(isFutureExpiration("12", String(now.getFullYear() - 1)), false);
  assert.equal(isFutureExpiration("13", String(now.getFullYear() + 1)), false);
});

test("exige endereço do titular apenas no cartão", () => {
  const base = {
    checkoutAttemptId: "a5da9e74-bc4a-4c4f-af53-e0a679884fc2",
    checkoutAttemptToken: "a".repeat(64),
    planCode: "profissional" as const,
    billingCycle: "annual" as const,
    name: "Pessoa de Teste",
    email: "teste@example.com",
    cpfCnpj: "52998224725",
    mobilePhone: "11999999999",
    acceptedTerms: true as const,
  };

  assert.equal(
    checkoutRequestSchema.safeParse({ ...base, paymentMethod: "PIX" }).success,
    true,
  );
  assert.equal(
    checkoutRequestSchema.safeParse({
      ...base,
      paymentMethod: "CREDIT_CARD",
      billingCycle: "monthly",
      card: {
        number: "4111111111111111",
        holderName: "PESSOA DE TESTE",
        expiryMonth: "12",
        expiryYear: "2030",
        ccv: "123",
      },
    }).success,
    false,
  );
});

test("mantém os preços cobrados no catálogo do servidor", () => {
  assert.equal(planPrice(checkoutPlans.essencial, "monthly"), 99);
  assert.equal(planPrice(checkoutPlans.profissional, "monthly"), 149);
  assert.equal(planPrice(checkoutPlans.imobiliaria, "monthly"), 299);
  assert.equal(planPrice(checkoutPlans.essencial, "annual"), 1188);
  assert.equal(planPrice(checkoutPlans.profissional, "annual"), 1788);
  assert.equal(planPrice(checkoutPlans.imobiliaria, "annual"), 3588);
  assert.equal(billingCycleForPayment("CREDIT_CARD"), "monthly");
  assert.equal(billingCycleForPayment("PIX"), "annual");
});

test("aceita Pix anual e cartão mensal, sem combinações divergentes", () => {
  const base = {
    checkoutAttemptId: "a5da9e74-bc4a-4c4f-af53-e0a679884fc2",
    checkoutAttemptToken: "a".repeat(64),
    planCode: "profissional" as const,
    paymentMethod: "PIX" as const,
    name: "Pessoa de Teste",
    email: "teste@example.com",
    cpfCnpj: "52998224725",
    mobilePhone: "11999999999",
    acceptedTerms: true as const,
  };

  assert.equal(checkoutRequestSchema.safeParse({ ...base, billingCycle: "annual" }).success, true);
  assert.equal(checkoutRequestSchema.safeParse({ ...base, billingCycle: "monthly" }).success, false);

  const card = {
    number: "4111111111111111",
    holderName: "PESSOA DE TESTE",
    expiryMonth: "12",
    expiryYear: String(new Date().getFullYear() + 2),
    ccv: "123",
  };
  const creditCardBase = {
    ...base,
    paymentMethod: "CREDIT_CARD" as const,
    postalCode: "01310100",
    addressNumber: "100",
    card,
  };
  assert.equal(checkoutRequestSchema.safeParse({ ...creditCardBase, billingCycle: "monthly" }).success, true);
  assert.equal(checkoutRequestSchema.safeParse({ ...creditCardBase, billingCycle: "annual" }).success, false);
});

test("mantém no checkout os limites oficiais dos três planos", () => {
  assert.deepEqual(checkoutPlans.essencial.checkoutFeatures.slice(0, 3), [
    "Até 5 imóveis e 5 contratos de aluguel ativos",
    "5 Fachadas Inteligentes",
    "10 gerações ou análises de contrato com IA por mês",
  ]);
  assert.deepEqual(checkoutPlans.profissional.checkoutFeatures.slice(0, 3), [
    "Até 20 imóveis e 15 contratos de aluguel ativos",
    "20 Fachadas Inteligentes",
    "20 gerações ou análises de contrato com IA por mês",
  ]);
  assert.deepEqual(checkoutPlans.imobiliaria.checkoutFeatures.slice(0, 3), [
    "Até 100 imóveis e 100 contratos de aluguel ativos",
    "100 Fachadas Inteligentes",
    "60 gerações ou análises de contrato com IA por mês",
  ]);
});
