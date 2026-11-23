// Reads every narration line into <project>/xuat/tieng/ and writes line timings.
// Usage: node doc.js <project-folder> [nam] [say]   Default is the free Microsoft neural voices through edge-tts, which need the network
// and sometimes refuse a request; "nam" makes Nam Minh the narrator and the voice of anyone unlisted instead of Hoài My;
// "say" uses the built-in macOS voice instead, which never fails but is one voice for everyone (so "nam" means nothing with it).
// A line written as [who, "", milliseconds] is a silent pause of that length (title cards).
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const root = path.resolve(process.argv[2]);
const out = path.join(root, "xuat", "tieng");
const keep = path.join(root, "xuat", "giong-luu");
const tts = path.join(__dirname, ".venv", "bin", "edge-tts");
// loi.js declares SHOTS and may declare TEMPO, how much faster than the voice's own pace the story is read (1.1 = 10 % faster)
const { SHOTS, TEMPO } = new Function(fs.readFileSync(path.join(root, "loi.js"), "utf8") + "\nreturn { SHOTS, TEMPO: typeof TEMPO === \"undefined\" ? 1 : TEMPO };")();
const PAD = 0.3;
const NU = "vi-VN-HoaiMyNeural";
const NAM = "vi-VN-NamMinhNeural";
// [voice, pitch]: the narrator and anyone not listed use the first entry
const VOICES = {
  "": [NU, ""],
  "Kể": [NAM, "-6Hz"],
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

const args = process.argv.slice(3);
const useSay = args.includes("say");
// "nam" swaps the default voice; the giong-luu cache keys on voice and wording, so the two narrators never reuse each other's audio
if (args.includes("nam") && !useSay) VOICES[""] = [NAM, ""];
const ff = (args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args]);

function speakSay(text, file) {
  const aiff = file.replace(/\.mp3$/, ".aiff");
  execFileSync("say", ["-v", "Linh (Enhanced)", "-r", "165", "-o", aiff, text]);
  ff(["-i", aiff, file]);
  fs.rmSync(aiff);
}

function speak(who, text, file) {
  if (useSay) return speakSay(text, file);
  const [voice, pitch] = VOICES[who || ""] || VOICES[""];
  // kept by voice and wording, not by position: a rerun fetches only what is missing, and inserting a shot cannot shift audio onto the wrong line
  const saved = path.join(keep, crypto.createHash("sha1").update(`${voice}|${pitch}|${text}`).digest("hex") + ".mp3");
  for (let attempt = 1; !fs.existsSync(saved); attempt++) {
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
const durs = SHOTS.map((shot, i) => shot.lines.map(([who, text, pause], j) => {
  const file = path.join(out, `${i}-${j}.mp3`);
  if (!text) { ff(["-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", String(pause / 1000), file]); return pause; }
  speak(who, text, file);
  const seconds = parseFloat(execFileSync("afinfo", [file], { encoding: "utf8" }).match(/estimated duration: ([\d.]+)/)[1]);
  return Math.round((seconds + PAD) * 1000);
}));
fs.writeFileSync(path.join(root, "xuat", "durs.json"), JSON.stringify(durs));
console.log(`lines: ${durs.flat().length}, total: ${((durs.flat().reduce((a, b) => a + b, 0) + SHOTS.length * 500) / 1000).toFixed(1)}s`);
