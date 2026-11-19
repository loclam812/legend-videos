// Renders the paper-cut cut (giay.html) frame by frame over am.m4a, the sound nhac.js writes.
// It has the same shots and line lengths as bach-dang-shorts, so that cut's narration fits as it is.
// Usage: node bach-dang-ai/giay-quay.js          bach-dang-giay.mp4
//        node bach-dang-ai/giay-quay.js sheet    giay-kiem.jpg: three frames of every shot
const { chromium } = require(process.env.PLAYWRIGHT_PATH);
const { spawn, execFileSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const FPS = 25;
const PORT = 8769;
const shorts = path.join(__dirname, "..", "bach-dang-shorts");
const mode = process.argv[2];
const ff = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args]);

const read = (f) => fs.readFileSync(path.join(shorts, f), "utf8");
const SHOTS = new Function(["helpers.js", "people.js", "shots-a.js", "shots-b.js"].map(read).join("\n") + "\nreturn SHOTS;")();
const durs = JSON.parse(read("xuat/durs.json"));
const cut = SHOTS.map((s, i) => ({ label: s.label, tr: s.tr, text: s.lines[0][1], hot: s.hot || [], dur: durs[i][0] / 1000 }));
fs.writeFileSync(path.join(__dirname, "cut.js"), `window.CUT = ${JSON.stringify(cut)};\n`);

(async () => {
  const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { cwd: __dirname, stdio: "ignore" });
  let browser;
  try {
    await new Promise((done) => setTimeout(done, 800));
    // shortcut: CHROME points at another installed build when this Playwright's own one is missing
    browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
    const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
    page.on("pageerror", (e) => console.log("pageerror", e.message));
    await page.goto(`http://127.0.0.1:${PORT}/giay.html`);
    await page.waitForFunction("window.ready === true || window.failed", null, { timeout: 60000 });
    const failed = await page.evaluate("window.failed");
    if (failed) throw new Error(failed);
    const shot = async (t, file) => {
      await page.evaluate((s) => new Promise((done) => { window.renderAt(s); requestAnimationFrame(() => requestAnimationFrame(done)); }), t);
      await page.screenshot({ path: file, type: "jpeg", quality: 93 });
    };
    const frames = path.join(__dirname, "frames");
    fs.rmSync(frames, { recursive: true, force: true });
    fs.mkdirSync(frames);
    const name = (i) => path.join(frames, `${String(i).padStart(4, "0")}.jpg`);
    if (mode === "sheet") {
      const starts = await page.evaluate("window.STARTS");
      let n = 0;
      for (const [, t0, len] of starts) for (const k of [0.25, 0.6, 0.95]) await shot(t0 + (len - 0.5) * k, name(n++));
      const out = path.join(__dirname, "giay-kiem.jpg");
      ff(["-framerate", "1", "-i", path.join(frames, "%04d.jpg"), "-vf", `scale=216:384,tile=12x${Math.ceil(n / 12)}`, "-frames:v", "1", out]);
      console.log(out);
    } else {
      const total = await page.evaluate("window.TOTAL");
      const count = Math.round(total * FPS);
      const started = Date.now();
      for (let i = 0; i < count; i++) await shot(i / FPS, name(i));
      console.log(`rendered ${count} frames in ${((Date.now() - started) / 1000).toFixed(0)}s`);
      const out = path.join(__dirname, "bach-dang-giay.mp4");
      ff(["-framerate", String(FPS), "-i", path.join(frames, "%04d.jpg"), "-i", path.join(__dirname, "am.m4a"), "-map", "0:v", "-map", "1:a",
        "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-af", "apad", "-t", String(total), "-movflags", "+faststart", out]);
      console.log(out);
    }
    fs.rmSync(frames, { recursive: true, force: true });
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
})();
