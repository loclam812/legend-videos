// Records the page in headless Chromium while it plays on the narration schedule. Prints the trim offset.
const fs = require("fs");
const path = require("path");
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");

const durs = JSON.parse(fs.readFileSync(path.join(__dirname, "durs.json"), "utf8"));
const SIZE = { width: 1280, height: 720 };

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: SIZE, recordVideo: { dir: path.join(__dirname, "hinh"), size: SIZE } });
  await context.addInitScript((d) => { window.DURS = d; }, durs);
  const created = Date.now();
  const page = await context.newPage();
  let finish;
  const done = new Promise((resolve) => { finish = resolve; });
  await page.exposeFunction("recDone", () => finish());
  await page.goto("http://127.0.0.1:8765/index.html");
  await page.addStyleTag({ content: ".controls{display:none}body{background:#000}.stage{width:100vw;height:100vh;border-radius:0;box-shadow:none}" });
  await page.waitForTimeout(1500);
  const offset = (Date.now() - created) / 1000;
  await page.evaluate(() => { play(0); });
  await done;
  const video = await page.video().path();
  await context.close();
  await browser.close();
  fs.writeFileSync(path.join(__dirname, "quay.json"), JSON.stringify({ video, offset }));
  console.log(video, offset.toFixed(2));
})();
