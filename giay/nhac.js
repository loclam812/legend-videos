// Sound for a paper-cut story: joins the narration lines doc.js fetched and lays one unbroken piece under them,
// in D minor pentatonic with a written melody. The moods of the shots only change how many layers play, so nothing
// restarts between shots. Writes <story-folder>/xuat/am.m4a.
// Usage: node giay/nhac.js <story-folder>
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const SR = 44100;
const BEAT = 60 / 72;
const dir = path.resolve(process.argv[2]);
const xuat = path.join(dir, "xuat");
const SHOTS = new Function(fs.readFileSync(path.join(dir, "loi.js"), "utf8") + "\nreturn SHOTS;")();
const durs = JSON.parse(fs.readFileSync(path.join(xuat, "durs.json"), "utf8"));
const ff = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args]);

// every line padded to its slot, the last line of a shot followed by the 0.5 s gap the page also waits
const list = [];
durs.forEach((shot, i) => shot.forEach((ms, j) => {
  const wav = path.join(xuat, "tieng", `${i}-${j}.wav`);
  ff(["-i", path.join(xuat, "tieng", `${i}-${j}.mp3`), "-af", "apad", "-t", String((ms + (j === shot.length - 1 ? 500 : 0)) / 1000), "-ar", "44100", "-ac", "1", wav]);
  list.push(`file '${wav}'`);
}));
fs.writeFileSync(path.join(xuat, "tieng", "list.txt"), list.join("\n"));
const voice = path.join(xuat, "loi-ke.wav");
ff(["-f", "concat", "-safe", "0", "-i", path.join(xuat, "tieng", "list.txt"), "-c", "copy", voice]);

// level 0..3: how much plays; root: the drone under the same five notes (F makes them sound major)
const MOOD = { battle: [3, "D"], tense: [2, "D"], calm: [1, "D"], wonder: [1, "D"], sad: [0.6, "D"], bright: [2, "F"] };
let at = 0;
const parts = SHOTS.map((shot, i) => { const part = { from: at, mood: MOOD[shot.mood] || MOOD.calm }; at += durs[i].reduce((a, b) => a + b, 0) / 1000 + 0.5; return part; });
const total = at + 1.5;
const partAt = (t) => parts.reduce((found, p) => (p.from <= t ? p : found), parts[0]);

const out = new Float32Array(Math.ceil(total * SR));
const put = (sound, when, gain) => { const o = Math.round(when * SR); for (let i = 0; i < sound.length && o + i < out.length; i++) out[o + i] += sound[i] * gain; };

// đàn bầu-like lead: slides up into the note, soft attack, vibrato that grows
function lead(f, dur) {
  const b = new Float32Array(Math.round(dur * SR));
  let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const bend = 1 - 0.018 * Math.exp(-t * 14);
    const vib = 1 + 0.006 * Math.min(1, t / 0.5) * Math.sin(2 * Math.PI * 5.5 * t);
    ph += (2 * Math.PI * f * bend * vib) / SR;
    const env = Math.min(1, t / 0.04) * Math.exp(-t * 1.6) * Math.min(1, (dur - t) / 0.08);
    b[i] = env * (Math.sin(ph) + 0.22 * Math.sin(2 * ph) + 0.07 * Math.sin(3 * ph));
  }
  return b;
}
function pluck(f, dur) {
  const b = new Float32Array(Math.round(dur * SR));
  for (let i = 0; i < b.length; i++) { const t = i / SR; b[i] = Math.min(1, t / 0.004) * Math.exp(-t * 5) * (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.exp(-t * 9) * Math.sin(4 * Math.PI * f * t)); }
  return b;
}
function drum(f0) {
  const b = new Float32Array(Math.round(0.5 * SR));
  let ph = 0;
  for (let i = 0; i < b.length; i++) { const t = i / SR; ph += (2 * Math.PI * (48 + (f0 - 48) * Math.exp(-t * 20))) / SR; b[i] = Math.sin(ph) * Math.exp(-t * 8) * Math.min(1, t / 0.003); }
  return b;
}

const NOTE = { C4: 261.63, D4: 293.66, F4: 349.23, G4: 392, A4: 440, C5: 523.25, D5: 587.33 };
const N = (name) => NOTE[name];
// two four-bar phrases, one note per beat, null is a rest
const MELODY = ["D4", "G4", "A4", "G4", "C5", "A4", "G4", "D4", "G4", "A4", "C5", "D5", "C5", "A4", "G4", null,
  "D5", "C5", "A4", "G4", "A4", "G4", "D4", "C4", "D4", "G4", "A4", "G4", "D4", null, null, null];
const ROOT = { D: [73.42, 110, 146.83], F: [87.31, 130.81, 174.61] };

for (let k = 0; k * BEAT < total - 1.5; k++) {
  const t = k * BEAT, [level, root] = partAt(t).mood, note = MELODY[k % MELODY.length];
  // a sad part keeps only the first note of each bar
  if (note && (level >= 1 || k % 4 === 0)) put(lead(N(note), BEAT * 2.2), t, 0.5);
  if (level >= 2) [0, 1, 2, 1].forEach((n, j) => { if (j === (k % 4)) { put(pluck(ROOT[root][n], BEAT), t, 0.28); put(pluck(ROOT[root][2] * (j % 2 ? 1.5 : 1), BEAT * 0.5), t + BEAT / 2, 0.14); } });
  if (level >= 2 && k % 4 === 0) put(drum(110), t, 0.5);
  if (level >= 3) { if (k % 2 === 1) put(drum(150), t, 0.26); put(drum(180), t + BEAT / 2, 0.14); }
}

// the drone crossfades between roots and swells with the level
let d = 73.42, f = 110, lvl = 0.5, ph1 = 0, ph2 = 0;
for (let i = 0; i < out.length; i++) {
  const t = i / SR, [level, root] = partAt(t).mood, [r1, r2] = ROOT[root];
  d += (r1 - d) * 0.00008; f += (r2 - f) * 0.00008; lvl += (0.35 + 0.2 * level - lvl) * 0.00005;
  ph1 += (2 * Math.PI * d) / SR; ph2 += (2 * Math.PI * f) / SR;
  out[i] += 0.16 * lvl * (Math.sin(ph1) + 0.6 * Math.sin(ph2)) * (0.85 + 0.15 * Math.sin(2 * Math.PI * 0.2 * t));
}

// soften the top, fade the ends, and sit at -33 dBFS RMS: the user found -27 drowned the voice (2026-11-25)
let y = 0;
for (let i = 0; i < out.length; i++) { y += 0.45 * (out[i] - y); out[i] = y; }
const fade = 1.5 * SR;
for (let i = 0; i < fade; i++) { out[i] *= Math.min(1, i / (0.3 * SR)); out[out.length - 1 - i] *= i / fade; }
const rms = Math.sqrt(out.reduce((a, v) => a + v * v, 0) / out.length);
const peak = out.reduce((a, v) => Math.max(a, Math.abs(v)), 0);
const gain = Math.min(10 ** (-33 / 20) / rms, 0.9 / peak);

const pcm = Buffer.alloc(44 + out.length * 2);
pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + out.length * 2, 4); pcm.write("WAVEfmt ", 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22);
pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(out.length * 2, 40);
for (let i = 0; i < out.length; i++) pcm.writeInt16LE(Math.round(out[i] * gain * 32767), 44 + i * 2);
const wav = path.join(xuat, "nhac.wav");
fs.writeFileSync(wav, pcm);

const mix = "[0:a]asplit[v1][v2];[1:a][v1]sidechaincompress=threshold=0.1:ratio=2.5:attack=15:release=500[b];[v2][b]amix=inputs=2:normalize=0:duration=longest,loudnorm=I=-15:TP=-1.5:LRA=11,aresample=44100[a]";
const am = path.join(xuat, "am.m4a");
ff(["-i", voice, "-i", wav, "-filter_complex", mix, "-map", "[a]", "-c:a", "aac", "-b:a", "160k", am]);
console.log(`music ${total.toFixed(1)}s, peak ${(peak * gain).toFixed(2)} -> ${am}`);
