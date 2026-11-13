// Makes a 1280x720 YouTube thumbnail from one frame of a story's mp4 plus a title.
// Usage: node bia.js <story-folder> <seconds> "<title>" ["<small line>"]   ->  <story-folder>/bia.jpg
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const env = path.join(__dirname, ".env");
if (fs.existsSync(env)) for (const line of fs.readFileSync(env, "utf8").split("\n")) { const [k, v] = line.split("="); if (v && !process.env[k]) process.env[k] = v.trim(); }
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");

const [dir, seconds, title, small = ""] = process.argv.slice(2);
const root = path.resolve(dir);
const mp4 = fs.readdirSync(root).find((f) => f.endsWith(".mp4"));
const frame = execFileSync("ffmpeg", ["-loglevel", "error", "-ss", seconds, "-i", path.join(root, mp4), "-frames:v", "1", "-f", "image2pipe", "-c:v", "png", "-"], { maxBuffer: 1 << 26 });
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
// the title sits on the sky at the top; the frame is enlarged so its burnt-in caption falls off the bottom edge
const html = `<body style="margin:0;width:1280px;height:720px;overflow:hidden;font-family:'Avenir Next','Helvetica Neue',Arial,sans-serif">
  <img src="data:image/png;base64,${frame.toString("base64")}" style="position:absolute;width:1486px;height:836px;left:-103px;top:0">
  <div style="position:absolute;inset:0;background:linear-gradient(#1c130ecc 8%,#0000 52%)"></div>
  <div style="position:absolute;left:52px;right:52px;top:26px;color:#f6c453;font-weight:900;font-size:124px;line-height:1.02;letter-spacing:-2px;-webkit-text-stroke:10px #2a1608;paint-order:stroke fill;text-shadow:0 8px 0 #2a1608">
    <div style="color:#fffaf0;font-size:46px;letter-spacing:0;-webkit-text-stroke:7px #2a1608;text-shadow:none;margin-bottom:6px">${esc(small)}</div>${esc(title)}</div></body>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.setContent(html);
  const out = path.join(root, "bia.jpg");
  await page.screenshot({ path: out, type: "jpeg", quality: 92 });
  await browser.close();
  console.log(out);
})();
