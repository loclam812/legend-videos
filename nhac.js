// Synthesizes the music bed and sound effects of one story into <story>/xuat/nen.wav. Every sound is computed: no samples, no licences.
// Usage: node nhac.js <story-folder>
// A shot opts in with `mood` (calm, bright, sad, tense, battle, wonder) and optional `sfx: [[seconds, name, duration]]`.
const fs = require("fs");
const path = require("path");

const root = path.resolve(process.argv[2]);
const src = ["helpers.js", "people.js", "shots-a.js", "shots-b.js"].map((f) => fs.readFileSync(path.join(root, f), "utf8")).join("\n");
const SHOTS = new Function(src + "\nreturn SHOTS;")();
const target = path.join(root, "xuat", "nen.wav");
if (!SHOTS.some((s) => s.mood)) { fs.rmSync(target, { force: true }); console.log("no shot has a mood: no music"); process.exit(0); }

const SR = 44100;
const durs = JSON.parse(fs.readFileSync(path.join(root, "xuat", "durs.json"), "utf8"));
const starts = [];
let total = 0;
durs.forEach((lines) => { starts.push(total); total += (lines.reduce((a, b) => a + b, 0) + 500) / 1000; });
const out = new Float32Array(Math.ceil((total + 2) * SR));

let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const hz = (semi) => 220 * 2 ** (semi / 12);
const buf = (dur) => new Float32Array(Math.max(1, Math.round(dur * SR)));
const put = (into, sound, at, gain = 1) => { const o = Math.round(at * SR); for (let i = 0; i < sound.length && o + i < into.length; i++) if (o + i >= 0) into[o + i] += sound[i] * gain; };

function pluck(f, dur, amp) {
  const n = Math.round(SR / f);
  const ring = Float32Array.from({ length: n }, () => rnd() * 2 - 1);
  const b = buf(dur);
  for (let i = 0; i < b.length; i++) { const j = i % n; b[i] = ring[j] * amp; ring[j] = (ring[j] + ring[(j + 1) % n]) * 0.498; }
  return b;
}
function flute(f, dur, amp) {
  const b = buf(dur);
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const ph = 2 * Math.PI * f * t + 0.5 * Math.sin(2 * Math.PI * 5 * t);
    b[i] = Math.min(1, t / 0.12) * Math.min(1, (dur - t) / 0.3) * amp * (Math.sin(ph) + 0.3 * Math.sin(2 * ph) + 0.04 * (rnd() * 2 - 1));
  }
  return b;
}
function drum(amp, f0 = 120) {
  const b = buf(0.4);
  let ph = 0;
  for (let i = 0; i < b.length; i++) { const t = i / SR; ph += (2 * Math.PI * (45 + (f0 - 45) * Math.exp(-t * 18))) / SR; b[i] = amp * (Math.sin(ph) * Math.exp(-t * 9) + 0.3 * (rnd() * 2 - 1) * Math.exp(-t * 60)); }
  return b;
}
function noise(dur, amp, lowpass, env) {
  const b = buf(dur);
  let y = 0;
  for (let i = 0; i < b.length; i++) { y += lowpass * (rnd() * 2 - 1 - y); b[i] = y * amp * env(i / b.length); }
  return b;
}
function bell(f, dur, amp) {
  const b = buf(dur);
  for (let i = 0; i < b.length; i++) { const t = i / SR; b[i] = amp * (Math.sin(2 * Math.PI * f * t) * Math.exp(-3 * t) + 0.4 * Math.sin(2 * Math.PI * 2.76 * f * t) * Math.exp(-5 * t)); }
  return b;
}
function sweep(f0, f1, dur, amp) {
  const b = buf(dur);
  let ph = 0;
  for (let i = 0; i < b.length; i++) { const x = i / b.length; ph += (2 * Math.PI * (f0 + (f1 - f0) * x)) / SR; b[i] = amp * Math.sin(ph) * Math.sin(Math.PI * x); }
  return b;
}

const SFX = {
  chime: (at) => [24, 28, 31, 36].forEach((s, k) => put(out, bell(hz(s), 1.6, 0.25), at + k * 0.11)),
  pop: (at) => put(out, sweep(500, 1300, 0.09, 0.5), at),
  drum: (at) => { put(out, drum(1.2, 90), at); put(out, drum(0.9, 150), at + 0.02); },
  gong: (at) => { put(out, bell(110, 4, 0.7), at); put(out, bell(165, 4, 0.35), at); },
  whoosh: (at) => put(out, noise(1.3, 1.6, 0.18, (x) => Math.sin(Math.PI * x) ** 2), at),
  whack: (at) => { put(out, noise(0.12, 2, 0.5, (x) => Math.exp(-x * 6)), at); put(out, drum(0.7, 200), at); },
  horn: (at) => { const b = buf(1.8); for (let i = 0; i < b.length; i++) { const t = i / SR; let v = 0; for (let k = 1; k <= 6; k++) v += Math.sin(2 * Math.PI * 147 * k * t) / k; b[i] = 0.3 * v * Math.min(1, t / 0.15) * Math.min(1, (1.8 - t) / 0.4); } put(out, b, at); },
  hooves: (at, dur) => { for (let t = 0; t < dur; t += 0.36) [0, 0.09, 0.18].forEach((d) => put(out, noise(0.08, 2.4, 0.1, (x) => Math.exp(-x * 5)), at + t + d)); },
  march: (at, dur) => { for (let t = 0; t < dur; t += 0.5) put(out, drum(0.45, 100), at + t); },
  waves: (at, dur) => { const b = noise(dur, 0.9, 0.12, (x) => Math.min(1, x * 10, (1 - x) * 10)); for (let i = 0; i < b.length; i++) b[i] *= 0.25 + 0.75 * Math.sin((Math.PI * i) / SR / 4.5) ** 2; put(out, b, at); },
  birds: (at, dur) => { for (let t = 0; t < dur; t += 0.12 + rnd() * 0.35) { const f = 2400 + rnd() * 1800; put(out, sweep(f, f + 600, 0.08, 0.16), at + t); } },
  splash: (at) => put(out, noise(0.9, 2.2, 0.35, (x) => Math.min(1, x * 30) * Math.exp(-x * 5)), at),
  rain: (at, dur) => put(out, noise(dur, 0.45, 0.55, (x) => Math.min(1, x * 10, (1 - x) * 10)), at),
  thunder: (at) => put(out, noise(2.4, 9, 0.012, (x) => Math.min(1, x * 40) * Math.exp(-x * 4)), at),
  fire: (at, dur) => {
    put(out, noise(dur, 0.5, 0.01, (x) => Math.min(1, x * 8, (1 - x) * 8)), at);
    for (let t = 0; t < dur; t += 0.02 + rnd() * 0.12) put(out, noise(0.004, 0.25 + rnd() * 0.3, 0.9, () => 1), at + t);
  },
};

const MAJOR = [3, 5, 8, 10, 12, 15];
const MINOR = [0, 3, 5, 7, 10, 12];
const MOODS = {
  calm: { bpm: 76, scale: MAJOR, play: 0.7, flute: 1, birds: 1 },
  bright: { bpm: 100, scale: MAJOR, play: 0.9, flute: 1, kick: 2 },
  sad: { bpm: 58, scale: MINOR, play: 0.35, flute: 1 },
  tense: { bpm: 88, scale: MINOR.map((s) => s - 12), play: 0.5, drone: 1, kick: 2 },
  battle: { bpm: 138, scale: MINOR, play: 1, kick: 1, fast: 1 },
  wonder: { bpm: 66, scale: MAJOR.map((s) => s + 12), play: 0.8, flute: 1 },
};

function music(mood, at, dur) {
  const m = MOODS[mood];
  const seg = buf(dur);
  const beat = 60 / m.bpm;
  let idx = 2;
  for (let k = 0; k * beat < dur; k++) {
    const t = k * beat;
    const step = () => { idx = Math.max(0, Math.min(m.scale.length - 1, idx + [-2, -1, -1, 0, 1, 1, 2][Math.floor(rnd() * 7)])); return hz(m.scale[idx]); };
    if (rnd() < m.play) put(seg, pluck(step(), beat * 2.5, 0.3), t);
    if (m.fast) put(seg, pluck(step(), beat, 0.2), t + beat / 2);
    if (k % 4 === 0) put(seg, pluck(hz(m.scale[0] - 12), beat * 3.5, 0.34), t);
    if (m.flute && k % 8 === 4) put(seg, flute(hz(m.scale[Math.floor(rnd() * m.scale.length)] + 12), beat * 3.6, 0.1), t);
    if (m.kick && k % m.kick === 0) put(seg, drum(k % 4 === 0 ? 0.55 : 0.32), t);
    if (m.fast) put(seg, noise(0.05, 0.5, 0.6, (x) => Math.exp(-x * 5)), t + beat / 2);
    if (m.birds && rnd() < 0.3) { const f = 2600 + rnd() * 1400; put(seg, sweep(f, f + 500, 0.07, 0.05), t + rnd() * beat); put(seg, sweep(f + 200, f + 700, 0.07, 0.05), t + rnd() * beat + 0.11); }
  }
  if (m.drone) for (let i = 0; i < seg.length; i++) { const t = i / SR; seg[i] += 0.12 * Math.sin(2 * Math.PI * hz(m.scale[0] - 12) * t) * (0.7 + 0.3 * Math.sin(2 * Math.PI * 0.5 * t)); }
  const fade = Math.min(0.6, dur / 4) * SR;
  for (let i = 0; i < fade; i++) { seg[i] *= i / fade; seg[seg.length - 1 - i] *= i / fade; }
  put(out, seg, at);
}

let from = 0;
SHOTS.forEach((shot, i) => {
  const length = (i + 1 < starts.length ? starts[i + 1] : total) - starts[i];
  // a bed with no duration runs to the end of its shot
  (shot.sfx || []).forEach(([t, name, dur]) => SFX[name](starts[i] + t, dur || length - t));
  const next = SHOTS[i + 1];
  if (next && next.mood === shot.mood) return;
  const end = next ? starts[i + 1] : total;
  if (shot.mood) music(shot.mood, starts[from], end - starts[from]);
  from = i + 1;
});

// one fixed level for every story, so the mix in ghep.js needs no per-story tuning
const rms = Math.sqrt(out.reduce((a, v) => a + v * v, 0) / out.length);
const gain = 10 ** (-23 / 20) / rms;
const pcm = Buffer.alloc(44 + out.length * 2);
pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + out.length * 2, 4); pcm.write("WAVEfmt ", 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22);
pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(out.length * 2, 40);
for (let i = 0; i < out.length; i++) pcm.writeInt16LE(Math.round(Math.tanh(out[i] * gain) * 32767), 44 + i * 2);
fs.writeFileSync(target, pcm);
console.log(`music: ${(out.length / SR).toFixed(1)}s -> ${target}`);
