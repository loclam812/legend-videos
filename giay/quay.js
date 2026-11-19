// Renders a paper-cut story frame by frame (no dropped frames) over xuat/am.m4a, the sound nhac.js writes.
// Usage: node giay/quay.js <story-folder>          <story-folder>/<story-folder>.mp4
//        node giay/quay.js <story-folder> sheet    xuat/kiem.jpg: three frames of every shot
const { chromium } = require(process.env.PLAYWRIGHT_PATH);
const { spawn, execFileSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const FPS = 25;
const PORT = 8770;
const repo = path.join(__dirname, "..");
const story = path.basename(path.resolve(process.argv[2]));
const dir = path.join(repo, story);
const mode = process.argv[3];
const ff = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args]);

const SHOTS = new Function(fs.readFileSync(path.join(dir, "loi.js"), "utf8") + "\nreturn SHOTS;")();
const durs = JSON.parse(fs.readFileSync(path.join(dir, "xuat", "durs.json"), "utf8"));
const cut = SHOTS.map((s, i) => ({ label: s.label, hot: s.hot || [], lines: s.lines.map(([, text], j) => ({ text, dur: durs[i][j] / 1000 })) }));
fs.writeFileSync(path.join(dir, "xuat", "cut.js"), `window.CUT = ${JSON.stringify(cut)};\n`);

(async () => {
  const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { cwd: repo, stdio: "ignore" });
  let browser;
  try {
    await new Promise((done) => setTimeout(done, 800));
    // CHROME (from .env) points at another installed build when this Playwright's own one is missing
    browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
    const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
    page.on("pageerror", (e) => console.log("pageerror", e.message));
    await page.goto(`http://127.0.0.1:${PORT}/giay/trang.html?truyen=${story}`);
    await page.waitForFunction("window.ready === true || window.failed", null, { timeout: 60000 });
    const failed = await page.evaluate("window.failed");
    if (failed) throw new Error(failed);
    const shot = async (t, file) => {
      await page.evaluate((s) => new Promise((done) => { window.renderAt(s); requestAnimationFrame(() => requestAnimationFrame(done)); }), t);
      await page.screenshot({ path: file, type: "jpeg", quality: 93 });
    };
    const frames = path.join(dir, "xuat", "khung");
    fs.rmSync(frames, { recursive: true, force: true });
    fs.mkdirSync(frames);
    const name = (i) => path.join(frames, `${String(i).padStart(4, "0")}.jpg`);
    if (mode === "sheet") {
      const starts = await page.evaluate("window.STARTS");
      let n = 0;
      for (const [, t0, len] of starts) for (const k of [0.25, 0.6, 0.95]) await shot(t0 + (len - 0.5) * k, name(n++));
      const out = path.join(dir, "xuat", "kiem.jpg");
      ff(["-framerate", "1", "-i", path.join(frames, "%04d.jpg"), "-vf", `scale=216:384,tile=12x${Math.ceil(n / 12)}`, "-frames:v", "1", out]);
      console.log(out);
    } else {
      const total = await page.evaluate("window.TOTAL");
      const count = Math.round(total * FPS);
      const started = Date.now();
      for (let i = 0; i < count; i++) await shot(i / FPS, name(i));
      console.log(`rendered ${count} frames in ${((Date.now() - started) / 1000).toFixed(0)}s`);
      const out = path.join(dir, `${story}.mp4`);
      // crf 21: paper grain is expensive to encode, and 18 made a 100 s short weigh 180 MB
      ff(["-framerate", String(FPS), "-i", path.join(frames, "%04d.jpg"), "-i", path.join(dir, "xuat", "am.m4a"), "-map", "0:v", "-map", "1:a",
        "-c:v", "libx264", "-crf", "21", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-af", "apad", "-t", String(total), "-movflags", "+faststart", out]);
      console.log(out);
    }
    fs.rmSync(frames, { recursive: true, force: true });
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
})();
