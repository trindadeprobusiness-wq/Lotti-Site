import { chromium } from "playwright";

const OUT = "C:/Users/Gabri/AppData/Local/Temp/claude/d--Lotti-Site/d08ffbc3-7454-483e-b619-3ea554eae787/scratchpad";
const URL = "http://localhost:3000";
const width = Number(process.argv[2] ?? 1440);
const height = Number(process.argv[3] ?? 900);
const tag = process.argv[4] ?? "d";
const only = process.argv[5] ? process.argv[5].split(",").map(Number) : null;

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width, height } });
await page.goto(URL, { waitUntil: "networkidle", timeout: 90000 });

await page.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += 300) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 50));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(800);

const total = await page.evaluate(() => document.documentElement.scrollHeight);
let i = 0;
for (let y = 0; y < total; y += height) {
  if (!only || only.includes(i)) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(350);
    await page.screenshot({ path: `${OUT}/${tag}-${String(i).padStart(2, "0")}.png` });
  }
  i += 1;
}

const overflow = await page.evaluate(() => ({
  scroll: document.documentElement.scrollWidth,
  client: document.documentElement.clientWidth,
}));
console.log(
  `${tag}: ${i} frames, altura ${total}px, overflow ${overflow.scroll > overflow.client ? "❌" : "✓"}`,
);

await browser.close();
