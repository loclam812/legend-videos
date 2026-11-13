// Builds a contact sheet from a story's mp4: the middle and the last frame of every shot, in order.
// Usage: node kiem.js <story-folder>   ->  <story-folder>/xuat/khung-hinh.jpg
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(process.argv[2]);
const mp4 = fs.readdirSync(root).find((f) => f.endsWith(".mp4"));
if (!mp4) throw new Error(`no mp4 in ${root}: run ./xuat.sh first`);
const durs = JSON.parse(fs.readFileSync(path.join(root, "xuat", "durs.json"), "utf8"));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "khung-"));
const ff = (args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args]);

let at = 0;
let n = 0;
for (const lines of durs) {
  const len = lines.reduce((a, b) => a + b, 500) / 1000;
  for (const t of [at + len / 2, at + len - 0.7]) ff(["-ss", t.toFixed(2), "-i", path.join(root, mp4), "-frames:v", "1", "-vf", "scale=480:270", path.join(tmp, `${String(n++).padStart(3, "0")}.png`)]);
  at += len;
}
const out = path.join(root, "xuat", "khung-hinh.jpg");
ff(["-i", path.join(tmp, "%03d.png"), "-vf", `tile=6x${Math.ceil(n / 6)}`, "-frames:v", "1", out]);
fs.rmSync(tmp, { recursive: true });
console.log(out);
