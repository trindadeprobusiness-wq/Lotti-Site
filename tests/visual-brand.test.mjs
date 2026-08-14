import assert from "node:assert/strict";
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
