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
// with a music bed (see nhac.js) the voice stays in front: the bed ducks under speech and the mix is levelled for web video
const bed = path.join(__dirname, "nen.wav");
const video_ = ["-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", out];
if (fs.existsSync(bed)) {
  const mix = "[1:a]asplit[v1][v2];[2:a][v1]sidechaincompress=threshold=0.1:ratio=2.5:attack=15:release=500[b];[v2][b]amix=inputs=2:normalize=0:duration=longest,loudnorm=I=-15:TP=-1.5:LRA=11,aresample=44100[a]";
  ff(["-ss", String(offset), "-i", video, "-i", track, "-i", bed, "-filter_complex", mix, "-map", "0:v", "-map", "[a]", ...video_]);
} else {
  ff(["-ss", String(offset), "-i", video, "-i", track, "-map", "0:v", "-map", "1:a", "-af", "apad=pad_dur=2", ...video_]);
}
console.log(out);
