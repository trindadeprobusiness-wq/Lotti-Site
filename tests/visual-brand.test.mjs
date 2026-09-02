import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const baseUrl = process.env.TEST_BASE_URL ?? "http://localhost:3000";

async function get(path) {
  const response = await fetch(`${baseUrl}${path}`);
  return { response, body: await response.text() };
}

test("serve as duas assinaturas lineares oficiais", async () => {
  const dark = await get("/brand/lotti-linear-dark.svg");
  const light = await get("/brand/lotti-linear-light.svg");

  assert.equal(dark.response.status, 200);
  assert.match(dark.body, /#093323/i);
  assert.match(
    dark.body,
    /stop-color="black"|stop-color="#000000"|<stop offset="1"\s*\/>/i,
  );

  assert.equal(light.response.status, 200);
  assert.match(light.body, /#093323/i);
  assert.match(light.body, /stop-color="white"|stop-color="#ffffff"/i);
});

test("renderiza a assinatura oficial legível no cabeçalho escuro", async () => {
  const { response, body } = await get("/");

  assert.equal(response.status, 200);
  assert.match(body, /\/brand\/lotti-white\.svg/);
  assert.match(body, /<title>Lotti<\/title>/);
});

test("mantém o cabeçalho Lotti em uma cápsula responsiva e animada", async () => {
  const header = await readFile(
    new URL("../src/components/site/Header.tsx", import.meta.url),
    "utf8",
  );
  const styles = await readFile(
    new URL("../src/app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(header, /data-site-header=""/);
  assert.match(header, /data-header-open=\{open \? "true" : "false"\}/);
  assert.match(header, /data-mobile-nav=""/);
  assert.match(header, /data-menu-toggle=""/);
  assert.equal(header.match(/data-menu-line=""/g)?.length, 2);
  assert.match(header, /<Logo tone="paper"/);
  assert.match(styles, /\.site-header-shell[\s\S]*border-radius: 1\.35rem/);
  assert.match(styles, /\.site-mobile-menu[\s\S]*grid-template-rows: 0fr/);
  assert.match(
    styles,
    /\.site-header-shell\.is-open \.site-mobile-menu[\s\S]*grid-template-rows: 1fr/,
  );
  assert.match(styles, /\.site-header-shell\.is-open \.site-menu-line-top[\s\S]*rotate\(45deg\)/);
  assert.match(styles, /@media \(min-width: 64rem\)[\s\S]*\.site-header-desktop-nav/);
});

test("não exibe vídeo no hero", async () => {
  const { response, body } = await get("/");

  assert.equal(response.status, 200);
  assert.doesNotMatch(body, /<video[^>]+src="\/product\/hero-demo\.mp4"/);
  assert.match(body, /aspect-ratio:1919 \/ 867/);
});

test("usa verde Lotti no lado escuro do degradê do título do hero", async () => {
  const { body } = await get("/");
  const styles = await readFile(
    new URL("../src/app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(body, /text-gradient-forest/);
  assert.match(body, /class="block text-ink" aria-label="Pare de operar\."/);
  assert.match(
    styles,
    /\.text-gradient-forest\s*\{\s*background:\s*linear-gradient\(to right, #093323, #000000\)/,
  );
});

test("exibe no hero as telas do produto em carrossel a cada 3,5 segundos", async () => {
  const { response, body } = await get("/");

  assert.equal(response.status, 200);
  assert.match(body, /data-product-carousel=""/);
  assert.match(body, /data-carousel-interval="3500"/);

  const carouselSource = await readFile(
    new URL("../src/components/ui/ProductCarousel.tsx", import.meta.url),
    "utf8",
  );
  assert.match(carouselSource, /CAROUSEL_INTERVAL_MS = 3_500/);
  assert.match(carouselSource, /duration-500/);
  assert.match(carouselSource, /opacity-0/);
  assert.match(carouselSource, /object-contain object-top/);
  assert.doesNotMatch(
    body.match(/data-product-carousel=""[^>]*class="[^"]*"/)?.[0] ?? "",
    /border-beam-wrapper/,
  );
  for (const src of [
    "/product/tela-funil.png",
    "/product/tela-midias.png",
    "/product/tela-fachadas.png",
    "/product/tela-assistente-ia.png",
    "/product/tela-juridico.png",
    "/product/tela-financeiro.png",
    "/product/tela-alugueis.png",
    "/product/tela-imoveis.png",
    "/product/tela-clientes.png",
    "/product/tela-inicio.png",
  ]) {
    assert.ok(carouselSource.includes(src), `faltando ${src}`);
  }

  const expectedOrder = [
    "/product/tela-inicio.png",
    "/product/tela-clientes.png",
    "/product/tela-imoveis.png",
    "/product/tela-funil.png",
    "/product/tela-alugueis.png",
    "/product/tela-financeiro.png",
    "/product/tela-juridico.png",
    "/product/tela-midias.png",
    "/product/tela-fachadas.png",
    "/product/tela-assistente-ia.png",
  ];
  assert.deepEqual(
    expectedOrder.map((src) => carouselSource.indexOf(src)),
    [...expectedOrder.map((src) => carouselSource.indexOf(src))].sort((a, b) => a - b),
  );
});

test("mantém todas as telas do hero no mesmo enquadramento", async () => {
  const screenshots = [
    "tela-inicio",
    "tela-clientes",
    "tela-imoveis",
    "tela-funil",
    "tela-alugueis",
    "tela-financeiro",
    "tela-juridico",
    "tela-midias",
    "tela-fachadas",
    "tela-assistente-ia",
  ];

  for (const name of screenshots) {
    const response = await fetch(`${baseUrl}/product/${name}.png`);
    const image = Buffer.from(await response.arrayBuffer());

    assert.equal(response.status, 200);
    assert.equal(image.readUInt32BE(16), 1919, name);
    assert.equal(image.readUInt32BE(20), 867, name);
  }
});

test("exibe a captura de Kanban no recurso de funil de vendas", async () => {
  const { response, body } = await get("/");

  assert.equal(response.status, 200);
  assert.match(body, /<img[^>]+funil-etapas\.png/);
  assert.match(body, /<img(?=[^>]+funil-etapas\.png)(?=[^>]+object-cover)/);
  assert.match(body, /aspect-ratio:1608 \/ 857/);
  assert.match(
    body,
    /<article[^>]*class="[^"]*lg:grid-cols-2/,
  );

  const image = await fetch(`${baseUrl}/product/funil-etapas.png`, { method: "HEAD" });
  assert.equal(image.status, 200);
  assert.match(image.headers.get("content-type") ?? "", /image\/png/);
});

test("exibe a captura real do app no recurso de fachadas", async () => {
  const { response, body } = await get("/");

  assert.equal(response.status, 200);
  assert.match(body, /<img[^>]+fachadas-qr-atual\.png/);
  assert.match(body, /<img(?=[^>]+fachadas-qr-atual\.png)(?=[^>]+object-cover)/);
  assert.match(body, /aspect-ratio:1901 \/ 866/);
  assert.match(body, /leading-\[1\.15\] pt-1/);

  const image = await fetch(`${baseUrl}/product/fachadas-qr-atual.png`, { method: "HEAD" });
  assert.equal(image.status, 200);
  assert.match(image.headers.get("content-type") ?? "", /image\/png/);
});

test("preenche o carrossel sem lacunas e remove os quadros do CTA", async () => {
  const { body } = await get("/");
  const marqueeCopies = body.match(/data-marquee-copy=/g) ?? [];
  const trustCards = body.match(/data-trust-card=/g) ?? [];
  const reassuranceItems = body.match(/data-reassurance-item=/g) ?? [];

  assert.equal(marqueeCopies.length, 2);
  assert.equal(trustCards.length, 12);
  assert.equal(reassuranceItems.length, 0);
  assert.match(body, /data-final-logo=""/);
  assert.doesNotMatch(
    body,
    /data-final-logo=""[^>]*class="[^"]*hover:scale-105/,
  );
});

test("mantém o selo do plano destacado fora da camada que recorta o efeito", async () => {
  const { response, body } = await get("/planos");

  assert.equal(response.status, 200);
  assert.match(
    body,
    /data-pricing-card="highlighted"[^>]*class="[^"]*overflow-visible/,
  );
  assert.match(
    body,
    /data-pricing-beam=""[^>]*class="[^"]*border-beam-wrapper/,
  );
});

test("apresenta os limites comerciais revisados nos três planos", async () => {
  const { response, body } = await get("/planos");
  const renderedText = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

  assert.equal(response.status, 200);
  for (const content of [
    "Imóveis ativos Até 5",
    "Contratos de aluguel ativos Até 5",
    "Gerações ou análises com IA 10/mês",
    "Suporte por e-mail",
    "Imóveis ativos Até 20",
    "Contratos de aluguel ativos Até 15",
    "Fachadas Inteligentes 20",
    "Imóveis ativos Até 100",
    "Contratos de aluguel ativos Até 100",
    "Gerações ou análises com IA 60/mês",
  ]) {
    assert.ok(renderedText.includes(content), `faltando conteúdo do plano: ${content}`);
  }
});

test("usa o símbolo oficial da Lotti no ícone da aba", async () => {
  const icon = await readFile(
    new URL("../src/app/icon.svg", import.meta.url),
    "utf8",
  );

  assert.match(icon, /M124\.5 74\.5L0 187\.5/);
  assert.match(icon, /stop-color="#093323"/);
  assert.match(icon, /stop-color="#000000"/);
});

test("mantém a indicação de cobrança mensal próxima dos planos", async () => {
  const pricingCards = await readFile(
    new URL("../src/components/site/pricing/PricingCards.tsx", import.meta.url),
    "utf8",
  );

  assert.match(pricingCards, /<section className="section pt-0 pb-16">/);
});

test("usa o verde Lotti como acento em ações e progresso", async () => {
  const styles = await readFile(
    new URL("../src/app/globals.css", import.meta.url),
    "utf8",
  );
  const steps = await readFile(
    new URL("../src/components/site/HowItWorks.tsx", import.meta.url),
    "utf8",
  );

  assert.match(styles, /--color-forest: #093323/);
  assert.match(
    styles,
    /\.btn-primary\s*\{\s*background: linear-gradient\(to right, var\(--color-forest\), var\(--color-ink\)\)/,
  );
  assert.match(
    styles,
    /\.eyebrow::before\s*\{[^}]*background: linear-gradient\(to right, var\(--color-forest\), var\(--color-ink\)\)/,
  );
  assert.match(
    styles,
    /\.link-underline::after\s*\{[^}]*background: linear-gradient\(to right, var\(--color-forest\), var\(--color-ink\)\)/,
  );
  assert.match(
    styles,
    /\.checkout-progress \.is-current span,[\s\S]*?background: var\(--color-forest\)/,
  );
  assert.match(steps, /text-eyebrow uppercase text-forest/);
});

test("leva cada plano mensal para o checkout", async () => {
  const { response, body } = await get("/planos");

  assert.equal(response.status, 200);
  assert.match(body, /\/checkout\?plano=essencial/);
  assert.match(body, /\/checkout\?plano=profissional/);
  assert.match(body, /\/checkout\?plano=imobiliaria/);
  assert.match(body, />Assinar agora</);
  assert.match(body, /Até 5/);
  assert.match(body, /Até 20/);
  assert.match(body, /Até 100/);
  assert.doesNotMatch(body, /Faturado .* por ano|Economize 2 meses|Teste grátis por 14 dias/);
});

test("renderiza cartão à esquerda e Pix anual com 12 mensalidades", async () => {
  const { response, body } = await get("/checkout?plano=profissional");

  assert.equal(response.status, 200);
  assert.match(body, /Ambiente de pagamento seguro/);
  assert.match(body, /Lotti Profissional/);
  assert.match(body, /Pix/);
  assert.match(body, /Cartão/);
  assert.ok(body.indexOf("<strong>Cartão</strong>") < body.indexOf("<strong>Pix</strong>"));
  assert.match(body, /12 meses em um pagamento/);
  assert.match(body, /referente a 12 meses de/);
  assert.match(body, /R\$\s*1\.788,00/);
  assert.match(body, /R\$\s*149,00/);
  assert.match(body, /único endereço autorizado a criar a senha inicial/);
  assert.match(body, /Processado com segurança pelo Asaas/);
  assert.match(body, /Até 20 imóveis e 15 contratos de aluguel ativos/);
  assert.match(body, /20 Fachadas Inteligentes/);
  assert.match(body, /renovação anual/i);
  assert.doesNotMatch(body, /Card Holder|Expiration Date|Complete all fields/);
});

test("mantém segredos e cartão fora do cliente e da persistência", async () => {
  const checkoutRoute = await readFile(
    new URL("../src/app/api/checkout/route.ts", import.meta.url),
    "utf8",
  );
  const repository = await readFile(
    new URL("../src/lib/checkout/repository.ts", import.meta.url),
    "utf8",
  );
  const migration = await readFile(
    new URL("../supabase/migrations/20260826090000_asaas_saas_checkout.sql", import.meta.url),
    "utf8",
  );
  const asaasServer = await readFile(
    new URL("../src/lib/asaas/server.ts", import.meta.url),
    "utf8",
  );
  const provisioning = await readFile(
    new URL("../src/lib/checkout/provisioning.ts", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(checkoutRoute, /NEXT_PUBLIC_(ASAAS|SUPABASE_SECRET|SUPABASE_SERVICE)/);
  const sensitiveColumn = /^\s*(card_number|credit_card_number|cvv|ccv)\s+/im;
  assert.doesNotMatch(repository, sensitiveColumn);
  assert.doesNotMatch(migration, sensitiveColumn);
  assert.match(migration, /ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /claim_asaas_checkout_event/);
  assert.match(migration, /claim_checkout_order_provisioning/);
  assert.match(migration, /REVOKE ALL ON TABLE public\.checkout_orders FROM PUBLIC, anon, authenticated/);
  assert.match(asaasServer, /input\.billingCycle === "annual" \? "YEARLY" : "MONTHLY"/);
  assert.match(provisioning, /cycle === "annual" \? 12 : 1/);
});
