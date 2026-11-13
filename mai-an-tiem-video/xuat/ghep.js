// Pads each narration line to its slot, joins them into one track and muxes it with the recording into mp4.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const durs = JSON.parse(fs.readFileSync(path.join(__dirname, "durs.json"), "utf8"));
const { video, offset } = JSON.parse(fs.readFileSync(path.join(__dirname, "quay.json"), "utf8"));
const tmp = path.join(__dirname, "tieng");
const ff = (args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });

const list = [];
durs.forEach((shot, i) => shot.forEach((ms, j) => {
  const slot = (ms + (j === shot.length - 1 ? 500 : 0)) / 1000;
  const wav = path.join(tmp, `${i}-${j}.wav`);
  ff(["-i", path.join(tmp, `${i}-${j}.mp3`), "-af", "apad", "-t", String(slot), "-ar", "44100", "-ac", "1", wav]);
  list.push(`file '${wav}'`);
}));
fs.writeFileSync(path.join(tmp, "list.txt"), list.join("\n"));
const track = path.join(__dirname, "loi-ke.wav");
ff(["-f", "concat", "-safe", "0", "-i", path.join(tmp, "list.txt"), "-c", "copy", track]);

const out = path.join(__dirname, "..", "su-tich-dua-hau.mp4");
ff(["-ss", String(offset), "-i", video, "-i", track, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30",
  "-c:a", "aac", "-b:a", "160k", "-af", "apad=pad_dur=2", "-movflags", "+faststart", out]);
console.log(out);
