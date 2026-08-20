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

test("renderiza a assinatura correta em fundos claros e escuros", async () => {
  const { response, body } = await get("/");

  assert.equal(response.status, 200);
  assert.match(body, /\/brand\/lotti-linear-dark\.svg/);
  assert.match(body, /\/brand\/lotti-white\.svg/);
  assert.match(body, /<title>Lotti<\/title>/);
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

test("mantém o seletor de planos próximo do título da seção", async () => {
  const pricingCards = await readFile(
    new URL("../src/components/site/pricing/PricingCards.tsx", import.meta.url),
    "utf8",
  );

  assert.match(pricingCards, /<section className="section pt-0 pb-16">/);
});
