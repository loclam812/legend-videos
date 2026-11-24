// Reads every narration line into <project>/xuat/tieng/ and writes line timings.
// Usage: node doc.js <project-folder> [say]   Default is the free Microsoft neural voices through edge-tts, which need the network
// and sometimes refuse a request; "say" uses the built-in macOS voice instead, which never fails but is one voice for everyone.
// A story whose loi.js sets LANG = "en" is read by Kokoro-82M on this machine instead (see giay/doc_en.py).
// A recording of your own at <project-folder>/thu/<shot label>-<line index>.wav (or .m4a, .mp3) replaces that line's voice.
// A line written as [who, "", milliseconds] is a silent pause of that length (title cards).
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const root = path.resolve(process.argv[2]);
const out = path.join(root, "xuat", "tieng");
const keep = path.join(root, "xuat", "giong-luu");
const tts = path.join(__dirname, ".venv", "bin", "edge-tts");
// loi.js declares SHOTS and may declare TEMPO, how much faster than the voice's own pace the story is read (1.1 = 10 % faster),
// and LANG, "vi" unless set
const { SHOTS, TEMPO, LANG } = new Function(fs.readFileSync(path.join(root, "loi.js"), "utf8") + "\nreturn { SHOTS, TEMPO: typeof TEMPO === \"undefined\" ? 1 : TEMPO, LANG: typeof LANG === \"undefined\" ? \"vi\" : LANG };")();
const PAD = 0.3;
const NU = "vi-VN-HoaiMyNeural";
const NAM = "vi-VN-NamMinhNeural";
// [voice, pitch]: the narrator and anyone not listed use the first entry
const VOICES = {
  "": [NU, ""],
  "An Tiêm": [NAM, ""],
  "Vua Hùng": [NAM, "-12Hz"],
  "Nàng Ba": [NU, "+12Hz"],
  "Con trai": [NU, "+40Hz"],
  "Sơn Tinh": [NAM, "+6Hz"],
  "Thủy Tinh": [NAM, "-18Hz"],
  "Mị Nương": [NU, "+12Hz"],
  "Gióng": [NAM, "+10Hz"],
  "Mẹ": [NU, "-6Hz"],
  "Sứ giả": [NAM, ""],
  "Ngô Quyền": [NAM, "-6Hz"],
  "Chim": [NAM, "+25Hz"],
};

const EN_VOICE = "af_heart";
const KOKORO = path.join(process.env.HOME, "ai-models", "kokoro", "bin", "python");

const useSay = process.argv[3] === "say";
if (!["vi", "en"].includes(LANG)) throw new Error(`unknown LANG ${LANG}: "vi" or "en"`);
if (useSay && LANG === "en") throw new Error("say reads with the Vietnamese voice Linh: an English story uses Kokoro");
const sha1 = (s) => crypto.createHash("sha1").update(s).digest("hex");
const recorded = (label, j) => [".wav", ".m4a", ".mp3"].map((ext) => path.join(root, "thu", `${label}-${j}${ext}`)).find((p) => fs.existsSync(p));
// kept by voice and wording, not by position: a rerun fetches only what is missing, and inserting a shot cannot shift audio onto the wrong line
function savedFile(who, text) {
  if (LANG === "en") return path.join(keep, sha1(`kokoro|${EN_VOICE}|${text}`) + ".mp3");
  const [voice, pitch] = VOICES[who || ""] || VOICES[""];
  return path.join(keep, sha1(`${voice}|${pitch}|${text}`) + ".mp3");
}
const ff = (args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args]);

function speakSay(text, file) {
  const aiff = file.replace(/\.mp3$/, ".aiff");
  execFileSync("say", ["-v", "Linh (Enhanced)", "-r", "165", "-o", aiff, text]);
  ff(["-i", aiff, file]);
  fs.rmSync(aiff);
}

// Kokoro loads its model once, so every missing English line is read in one run before the timings are measured
function readEnglish() {
  const jobs = new Map();
  SHOTS.forEach((shot) => shot.lines.forEach(([who, text], j) => {
    const saved = savedFile(who, text);
    if (text && !recorded(shot.label, j) && !fs.existsSync(saved)) jobs.set(saved, [EN_VOICE, text, saved.replace(/\.mp3$/, ".wav")]);
  }));
  if (!jobs.size) return;
  if (!fs.existsSync(KOKORO)) throw new Error(`Kokoro venv missing at ${KOKORO}: see Setup in CLAUDE.md`);
  const list = path.join(keep, "kokoro-jobs.json");
  fs.writeFileSync(list, JSON.stringify([...jobs.values()]));
  execFileSync(KOKORO, [path.join(__dirname, "giay", "doc_en.py"), list], { stdio: "inherit", env: { ...process.env, HF_HOME: path.join(process.env.HOME, "ai-models", "hf") } });
  // through a .part file: an interrupted run must not leave a truncated mp3 that later runs take as cached
  for (const [saved, [, , wav]] of jobs) { const part = saved.replace(/\.mp3$/, ".part.mp3"); ff(["-i", wav, part]); fs.renameSync(part, saved); fs.rmSync(wav); }
  fs.rmSync(list);
}

function speak(who, text, file, label, j) {
  const own = recorded(label, j);
  // your own reading keeps its own pace: TEMPO only speeds up synthetic voices
  if (own) return ff(["-i", own, file]);
  if (useSay) return speakSay(text, file);
  const saved = savedFile(who, text);
  const [voice, pitch] = VOICES[who || ""] || VOICES[""];
  for (let attempt = 1; LANG !== "en" && !fs.existsSync(saved); attempt++) {
    if (attempt > 8) throw new Error(`no audio after 8 attempts: ${text}`);
    const part = saved + ".part";
    try {
      execFileSync(tts, ["--voice", voice, ...(pitch ? [`--pitch=${pitch}`] : []), "--text", text, "--write-media", part], { stdio: "pipe", timeout: 60000 });
      // the free endpoint rejects bursts: space every request, and back off longer after a refusal
      if (fs.statSync(part).size > 0) { fs.renameSync(part, saved); console.log(`ok ${path.basename(file)}`); execFileSync("sleep", ["6"]); break; }
    } catch (_) { /* retried below */ }
    fs.rmSync(part, { force: true });
    console.log(`refused ${path.basename(file)} (attempt ${attempt})`);
    execFileSync("sleep", ["45"]);
  }
  // sped up here, not at the voice service: the saved recording stays reusable and a change of pace needs no network
  if (TEMPO === 1) fs.copyFileSync(saved, file); else ff(["-i", saved, "-af", `atempo=${TEMPO}`, file]);
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(keep, { recursive: true });
if (LANG === "en" && !useSay) readEnglish();
const durs = SHOTS.map((shot, i) => shot.lines.map(([who, text, pause], j) => {
  const file = path.join(out, `${i}-${j}.mp3`);
  if (!text) { ff(["-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", String(pause / 1000), file]); return pause; }
  speak(who, text, file, shot.label, j);
  const seconds = parseFloat(execFileSync("afinfo", [file], { encoding: "utf8" }).match(/estimated duration: ([\d.]+)/)[1]);
  return Math.round((seconds + PAD) * 1000);
}));
fs.writeFileSync(path.join(root, "xuat", "durs.json"), JSON.stringify(durs));
console.log(`lines: ${durs.flat().length}, total: ${((durs.flat().reduce((a, b) => a + b, 0) + SHOTS.length * 500) / 1000).toFixed(1)}s`);
