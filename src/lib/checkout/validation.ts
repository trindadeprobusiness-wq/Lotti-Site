import { z } from "zod";
import {
  billingCycleForPayment,
  billingCycles,
  paymentMethods,
  planCodes,
} from "./catalog";

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function allDigitsEqual(value: string): boolean {
  return /^(\d)\1+$/.test(value);
}

function validateCpf(value: string): boolean {
  if (value.length !== 11 || allDigitsEqual(value)) return false;

  const calculate = (length: number) => {
    let sum = 0;
    for (let index = 0; index < length; index += 1) {
      sum += Number(value[index]) * (length + 1 - index);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return calculate(9) === Number(value[9]) && calculate(10) === Number(value[10]);
}

function validateCnpj(value: string): boolean {
  if (value.length !== 14 || allDigitsEqual(value)) return false;

  const calculate = (base: string, weights: number[]) => {
    const sum = base
      .split("")
      .reduce((total, digit, index) => total + Number(digit) * weights[index], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const first = calculate(value.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = calculate(`${value.slice(0, 12)}${first}`, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return first === Number(value[12]) && second === Number(value[13]);
}

export function isValidCpfCnpj(value: string): boolean {
  const normalized = digitsOnly(value);
  return validateCpf(normalized) || validateCnpj(normalized);
}

export function passesLuhn(value: string): boolean {
  const normalized = digitsOnly(value);
  if (normalized.length < 13 || normalized.length > 19 || allDigitsEqual(normalized)) {
    return false;
  }

  let sum = 0;
  let double = false;
  for (let index = normalized.length - 1; index >= 0; index -= 1) {
    let digit = Number(normalized[index]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

export function isFutureExpiration(month: string, year: string): boolean {
  const numericMonth = Number(month);
  const numericYear = Number(year);
  if (numericMonth < 1 || numericMonth > 12 || numericYear < 2024) return false;

  const now = new Date();
  return numericYear > now.getFullYear()
    || (numericYear === now.getFullYear() && numericMonth >= now.getMonth() + 1);
}

export const checkoutRequestSchema = z
  .object({
    checkoutAttemptId: z.uuid(),
    checkoutAttemptToken: z.string().regex(/^[a-f0-9]{64}$/),
    planCode: z.enum(planCodes),
    billingCycle: z.enum(billingCycles),
    paymentMethod: z.enum(paymentMethods),
    name: z.string().trim().min(3).max(120),
    email: z.email().transform((value) => value.trim().toLowerCase()),
    cpfCnpj: z.string().transform(digitsOnly).refine(isValidCpfCnpj),
    mobilePhone: z
      .string()
      .transform(digitsOnly)
      .refine((value) => value.length === 10 || value.length === 11),
    postalCode: z.string().transform(digitsOnly).optional(),
    addressNumber: z.string().trim().max(20).optional(),
    card: z
      .object({
        number: z.string().transform(digitsOnly).refine(passesLuhn),
        holderName: z.string().trim().min(3).max(120),
        expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/),
        expiryYear: z.string().regex(/^20\d{2}$/),
        ccv: z.string().regex(/^\d{3,4}$/),
      })
      .optional(),
    acceptedTerms: z.literal(true),
  })
  .superRefine((value, context) => {
    if (value.billingCycle !== billingCycleForPayment(value.paymentMethod)) {
      context.addIssue({
        code: "custom",
        path: ["billingCycle"],
        message: value.paymentMethod === "PIX"
          ? "Pix exige cobrança anual"
          : "Cartão exige cobrança mensal",
      });
    }

    if (value.paymentMethod !== "CREDIT_CARD") return;

    if (!value.card) {
      context.addIssue({ code: "custom", path: ["card"], message: "Dados do cartão ausentes" });
      return;
    }

    if (!value.postalCode || value.postalCode.length !== 8) {
      context.addIssue({ code: "custom", path: ["postalCode"], message: "CEP inválido" });
    }
    if (!value.addressNumber) {
      context.addIssue({ code: "custom", path: ["addressNumber"], message: "Número obrigatório" });
    }
    if (!isFutureExpiration(value.card.expiryMonth, value.card.expiryYear)) {
      context.addIssue({ code: "custom", path: ["card", "expiryYear"], message: "Cartão vencido" });
    }
  });

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
