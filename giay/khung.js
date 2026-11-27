// Full-size single frames of a story, for what the sheet of quay.js is too small to show (its cells are 216x384 px):
// stills of the page the recorder films, taken before any recording, or the same frames pulled from the recorded
// mp4 afterwards.
// Usage: set -a; . ./.env; set +a       PLAYWRIGHT_PATH (and CHROME when it is set); the mp4 mode needs neither
//        node giay/khung.js <story-folder> [<out dir>] [mp4] <moment>...
//          stills of the page, or with "mp4" the same frames of <story-folder>/<story-folder>.mp4. Without <out dir>
//          they go to <story-folder>/xuat/khung/ (ignored by git, and emptied by every run of quay.js), the mp4 frames
//          to xuat/khung/mp4/ under the same names, so a still and its frame lie side by side
//   moment = <label>:<fraction>   a share of the shot's narration: 0.1 near where it begins, 0.5 its middle, 0.9 near
//                                  where it ends. The label is the one in loi.js ("kết" keeps its diacritic)
//            <label>:+<seconds>   that long after the shot's last word: +0.5 is the first frame of the next shot
//            <label>:cut          every recorded frame across the scene change after the shot, from 0.6 s before the
//                                  first frame of the next shot to 0.6 s after it, in cut-<label>/. A change is centred
//                                  on that first frame (the cover comes before it, the uncovering after it), and
//                                  whether it runs without a pop is seen in its frames side by side, not in one of them.
//                                  Its kind is the cut that the scene of the NEXT shot declares in canh.js ("1:cut" is
//                                  a sheet when the scene of shot 2 has cut: "sheet"), so one label per kind is
//                                  picked from the shots before scenes of that kind
//            <seconds>           since the story began
//            all:<fraction>      every shot at that share, in order (several are allowed: "all:0.5 all:0.98" is the
//                                  middle and the end of every shot)
//   Each moment becomes <seconds>_<hundredths>.jpg (1080x1920, or 1920x1080 in a wide story) and a line with its
//   time, so the same moments can be pulled from the mp4 after the recording and compared with the stills.
//   A detail is read from a crop with room around it, not from the full frame:
//     ffmpeg -v error -y -i <still> -vf crop=w:h:x:y,scale=iw*3:ih*3 <png>
//   and the motion of a change from its frames tiled, eight to a picture at most (a cell narrower than about 250 px
//   shows what moves, not what it looks like: a doubtful cell is opened at full size). n counts the files of the folder:
//     ffmpeg -v error -y -pattern_type glob -i '<out dir>/cut-<label>/*.jpg' -vf "select='between(n,0,7)',scale=270:-2,tile=4x2:padding=4:margin=4" -frames:v 1 <sheet>
//   Two measures for a scratch script, in place of eyes:
//     the mean brightness of each frame of a change rises to ONE peak and falls for a sheet and falls to ONE trough
//     and rises for a band or an iris; two mean a doubled change. A number in small print is not read from a tile:
//       ffmpeg -v error -i <frame> -vf "signalstats,metadata=print:file=-" -f null - | grep YAVG
//     the mean brightness of the difference between a still and the recorded frame of the same name is 0 to 4 from the
//     encoding alone; far more means the frame is not the still's moment:
//       ffmpeg -v error -i <still> -i <mp4 frame> -lavfi "[0:v][1:v]blend=all_mode=difference,format=gray,signalstats,metadata=print:file=-" -f null - | grep YAVG
const path = require("path");
const fs = require("fs");
const { execFileSync, spawn } = require("child_process");

const FPS = 25, GAP = 0.5, PORT = 8771;
const repo = path.join(__dirname, "..");
const story = path.basename(path.resolve(process.argv[2] || ""));
const dir = path.join(repo, story);
const isMoment = (a) => /:/.test(a) || Number.isFinite(Number(a));
const rest = process.argv.slice(3);
const out = rest[0] && rest[0] !== "mp4" && !isMoment(rest[0]) ? rest.shift() : path.join(dir, "xuat", "khung");
const mp4 = rest[0] === "mp4";
if (mp4) rest.shift();
const moments = rest;
if (!process.argv[2] || !moments.length) {
  console.error("usage: node giay/khung.js <story-folder> [<out dir>] [mp4] <label:fraction | label:+seconds | label:cut | seconds | all:fraction>...");
  process.exit(1);
}

// the timing of the page (may.js): a shot lasts its lines and half a second more. The scene change that follows is
// centred on the first frame of the next shot: it begins to cover this shot before the half second is over
const loiFile = path.join(dir, "loi.js"), dursFile = path.join(dir, "xuat", "durs.json");
for (const f of [loiFile, dursFile]) if (!fs.existsSync(f)) { console.error(`no ${path.relative(repo, f)}: /chuanbi writes it`); process.exit(1); }
const { SHOTS, WIDE, SUBS } = new Function(fs.readFileSync(loiFile, "utf8") + "\nreturn { SHOTS, WIDE: typeof WIDE !== \"undefined\" && WIDE, SUBS: typeof SUBS === \"undefined\" || SUBS };")();
const durs = JSON.parse(fs.readFileSync(dursFile, "utf8"));
const shots = SHOTS.map((s, i) => ({ label: s.label, dur: s.lines.reduce((sum, _, j) => sum + durs[i][j] / 1000, 0) }));
let slot = 0;
for (const s of shots) { s.t0 = slot; slot += s.dur + GAP; }

const when = (moment) => {
  const m = moment.match(/^(.+?):([+]?[\d.]+)$/);
  if (!m) return Number(moment);
  const s = shots.find((x) => x.label === m[1]);
  if (!s) { console.error(`no shot labelled "${m[1]}" in ${story}/loi.js`); process.exit(1); }
  return m[2][0] === "+" ? s.t0 + s.dur + Number(m[2].slice(1)) : s.t0 + Number(m[2]) * s.dur;
};
// every all:<fraction> becomes one moment per shot, in its place: "all:0.5 all:0.98" is the middle and the end of every
// shot, shot by shot
for (let i = 0; i < moments.length; i++) {
  const all = moments[i].match(/^all:(.+)$/);
  if (all) moments.splice(i, 1, ...shots.map((s) => `${s.label}:${all[1]}`));
}
const name = (t) => `${t.toFixed(2).padStart(6, "0").replace(".", "_")}.jpg`;
const outDir = mp4 ? path.join(out, "mp4") : out;

// what to take: a time and a file for every frame of every moment. The recorder films frame f at f / FPS seconds
const jobs = [];
for (const moment of moments) {
  const cut = moment.match(/^(.*):cut$/);
  if (!cut) { const t = when(moment); jobs.push({ moment, t, file: path.join(outDir, name(t)) }); continue; }
  const s = shots.find((x) => x.label === cut[1]), next = s && shots[shots.indexOf(s) + 1];
  if (!s) { console.error(`no shot labelled "${cut[1]}" in ${story}/loi.js`); process.exit(1); }
  if (!next) { console.error(`no scene change follows shot "${cut[1]}": nothing comes after the last shot`); process.exit(1); }
  const into = path.join(outDir, `cut-${cut[1]}`);
  fs.rmSync(into, { recursive: true, force: true });
  for (let f = Math.ceil((next.t0 - 0.6) * FPS); f <= Math.floor((next.t0 + 0.6) * FPS + 1e-6); f++) {
    const t = f / FPS;
    jobs.push({ moment, t, file: path.join(into, name(t)) });
  }
}
for (const job of jobs) fs.mkdirSync(path.dirname(job.file), { recursive: true });

if (mp4) {
  const video = path.join(dir, `${story}.mp4`);
  if (!fs.existsSync(video)) { console.error(`no ${video}: record the story first`); process.exit(1); }
  // the recorded frames by their number: a seek to a time lands on the frame after it when the time is a hair past the
  // one meant. The frames asked for are runs of consecutive numbers, and ffmpeg's selector takes only so many terms
  // to an expression, so each pass selects at most fifty runs
  const pick = [...new Set(jobs.map((job) => Math.round(job.t * FPS)))].sort((a, b) => a - b), runs = [];
  for (const f of pick) { const last = runs[runs.length - 1]; if (last && last[1] === f - 1) last[1] = f; else runs.push([f, f]); }
  const from = new Map();
  for (let c = 0; c < runs.length; c += 50) {
    const part = runs.slice(c, c + 50), tmp = path.join(outDir, `chon-${c / 50 + 1}`);
    fs.rmSync(tmp, { recursive: true, force: true });
    fs.mkdirSync(tmp, { recursive: true });
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", video, "-vf", `select='${part.map(([a, b]) => (a === b ? `eq(n,${a})` : `between(n,${a},${b})`)).join("+")}'`, "-fps_mode", "passthrough", "-q:v", "3", path.join(tmp, "%04d.jpg")]);
    const files = fs.readdirSync(tmp).sort(), want = part.reduce((sum, [a, b]) => sum + b - a + 1, 0);
    if (files.length !== want) { console.error(`${files.length} frames came out of ${video} for ${want} asked for`); process.exit(1); }
    let k = 0;
    for (const [a, b] of part) for (let f = a; f <= b; f++) from.set(f, path.join(tmp, files[k++]));
  }
  // copied, not moved: two moments can ask for the same frame (a shot's 0.98 and the first frame of its :cut)
  for (const job of jobs) fs.copyFileSync(from.get(Math.round(job.t * FPS)), job.file);
  for (const dir of fs.readdirSync(outDir)) if (dir.startsWith("chon-")) fs.rmSync(path.join(outDir, dir), { recursive: true, force: true });
  for (const job of jobs) console.log(`${job.moment}  t=${job.t.toFixed(2)}  ${job.file}`);
  process.exit(0);
}

const { chromium } = require(process.env.PLAYWRIGHT_PATH);
// the page reads the timing from xuat/cut.js, which quay.js writes before the sheet and the recording: write the same
// file here when loi.js or the voice is newer than it, so that a still never shows an old timing
const cutFile = path.join(dir, "xuat", "cut.js");
if (!fs.existsSync(cutFile) || fs.statSync(cutFile).mtimeMs < Math.max(fs.statSync(loiFile).mtimeMs, fs.statSync(dursFile).mtimeMs)) {
  const cut = SHOTS.map((s, i) => ({ label: s.label, hot: s.hot || [], lines: s.lines.map(([, text], j) => ({ text, dur: durs[i][j] / 1000 })) }));
  fs.writeFileSync(cutFile, `window.WIDE = ${!!WIDE};\nwindow.SUBS = ${!!SUBS};\nwindow.CUT = ${JSON.stringify(cut)};\n`);
}

(async () => {
  const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { cwd: repo, stdio: "ignore" });
  let browser;
  try {
    await new Promise((done) => setTimeout(done, 800));
    browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
    const page = await browser.newPage({ viewport: WIDE ? { width: 960, height: 540 } : { width: 540, height: 960 }, deviceScaleFactor: 2 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`http://127.0.0.1:${PORT}/giay/trang.html?truyen=${story}`);
    await page.waitForFunction("window.ready === true || window.failed", null, { timeout: 60000 });
    const failed = await page.evaluate("window.failed");
    if (failed) throw new Error(failed);
    // the page's own timing, against the one worked out from durs.json above
    const starts = await page.evaluate("window.STARTS");
    const drift = shots.filter((s, i) => !starts[i] || starts[i][0] !== s.label || Math.abs(starts[i][1] - s.t0) > 0.02);
    if (drift.length) console.log(`warning: the page times these shots differently: ${drift.map((s) => s.label).join(", ")}`);
    for (const job of jobs) {
      await page.evaluate((sec) => new Promise((done) => { window.renderAt(sec); requestAnimationFrame(() => requestAnimationFrame(done)); }), job.t);
      await page.screenshot({ path: job.file, type: "jpeg", quality: 93 });
      console.log(`${job.moment}  t=${job.t.toFixed(2)}  ${job.file}`);
    }
    if (errors.length) console.log(`page errors: ${errors.join(" | ")}`);
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
})().catch((e) => { console.error(e); process.exit(1); });
