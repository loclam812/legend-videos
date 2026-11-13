// Reads every narration line with edge-tts (one voice setting per speaker) into <project>/xuat/tieng/ and writes line timings.
// Usage: node doc.js <project-folder> [say]   ("say" uses the built-in macOS voice instead, one voice for everyone)
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(process.argv[2]);
const out = path.join(root, "xuat", "tieng");
const tts = path.join(__dirname, ".venv", "bin", "edge-tts");
const src = ["helpers.js", "people.js", "shots-a.js", "shots-b.js"].map((f) => fs.readFileSync(path.join(root, f), "utf8")).join("\n");
const SHOTS = new Function(src + "\nreturn SHOTS;")();
const PAD = 0.3;
const NU = "vi-VN-HoaiMyNeural";
const NAM = "vi-VN-NamMinhNeural";
const VOICES = {
  "": [NU, "+0Hz", "-4%"],
  "An Tiêm": [NAM, "+0Hz", "+0%"],
  "Vua Hùng": [NAM, "-20Hz", "-10%"],
  "Nàng Ba": [NU, "+14Hz", "+0%"],
  "Con trai": [NU, "+45Hz", "+8%"],
  "Sơn Tinh": [NAM, "+6Hz", "+0%"],
  "Thủy Tinh": [NAM, "-32Hz", "-6%"],
  "Mị Nương": [NU, "+16Hz", "+0%"],
  "Gióng": [NAM, "+10Hz", "+0%"],
  "Mẹ": [NU, "-6Hz", "-4%"],
  "Sứ giả": [NAM, "+0Hz", "+0%"],
};

const useSay = process.argv[3] === "say";

function speakSay(text, file) {
  const aiff = file.replace(/\.mp3$/, ".aiff");
  execFileSync("say", ["-v", "Linh (Enhanced)", "-r", "165", "-o", aiff, text]);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", aiff, file]);
  fs.rmSync(aiff);
}

function speak(who, text, file) {
  if (useSay) return speakSay(text, file);
  // resumable: a line that already has audio is kept, so a rerun only fetches what is missing
  if (fs.existsSync(file) && fs.statSync(file).size > 0) return;
  const [voice, pitch, rate] = VOICES[who || ""];
  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      execFileSync(tts, ["--voice", voice, `--pitch=${pitch}`, `--rate=${rate}`, "--text", text, "--write-media", file], { stdio: "pipe" });
      // the free endpoint rejects bursts: space every request, and back off longer after a refusal
      if (fs.statSync(file).size > 0) { console.log(`ok ${path.basename(file)}`); execFileSync("sleep", ["6"]); return; }
    } catch (_) { /* retried below */ }
    console.log(`refused ${path.basename(file)} (attempt ${attempt})`);
    execFileSync("sleep", ["45"]);
  }
  throw new Error(`no audio after 8 attempts: ${text}`);
}

if (useSay) fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(out)) if (!f.endsWith(".mp3")) fs.rmSync(path.join(out, f));
const durs = SHOTS.map((shot, i) => shot.lines.map(([who, text], j) => {
  const file = path.join(out, `${i}-${j}.mp3`);
  speak(who, text, file);
  const seconds = parseFloat(execFileSync("afinfo", [file], { encoding: "utf8" }).match(/estimated duration: ([\d.]+)/)[1]);
  return Math.round((seconds + PAD) * 1000);
}));
fs.writeFileSync(path.join(root, "xuat", "durs.json"), JSON.stringify(durs));
console.log(`lines: ${durs.flat().length}, total: ${((durs.flat().reduce((a, b) => a + b, 0) + SHOTS.length * 500) / 1000).toFixed(1)}s`);
