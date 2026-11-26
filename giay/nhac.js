// Sound for a paper-cut story: joins the narration lines doc.js fetched and lays one unbroken piece under them,
// in a minor pentatonic with a written melody. The moods of the shots only change how many layers play, so nothing
// restarts between shots. `const MUSIC = "<piece>"` in loi.js picks one of PIECES below (tempo, key, melody, lead
// sound), so stories posted side by side do not all sound the same; without it the story gets "song".
// Writes <story-folder>/xuat/am.m4a.
// Usage: node giay/nhac.js <story-folder>
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const SR = 44100;
const dir = path.resolve(process.argv[2]);
const xuat = path.join(dir, "xuat");
const [SHOTS, MUSIC] = new Function(fs.readFileSync(path.join(dir, "loi.js"), "utf8") + "\nreturn [SHOTS, typeof MUSIC === 'undefined' ? 'song' : MUSIC];")();
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

// breathy and held, for air
function flute(f, dur) {
  const b = new Float32Array(Math.round(dur * SR));
  let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * f * (1 + 0.004 * Math.min(1, t / 0.6) * Math.sin(2 * Math.PI * 5 * t))) / SR;
    const env = Math.min(1, t / 0.09) * Math.exp(-t * 0.7) * Math.min(1, (dur - t) / 0.15);
    b[i] = env * (Math.sin(ph) + 0.12 * Math.sin(2 * ph) + 0.04 * Math.sin(3 * ph));
  }
  return b;
}
// a marimba: wooden bar with its fourth partial, short
function marimba(f, dur) {
  const b = new Float32Array(Math.round(Math.min(dur, 0.9) * SR));
  for (let i = 0; i < b.length; i++) { const t = i / SR; b[i] = Math.min(1, t / 0.002) * (Math.exp(-t * 6) * Math.sin(2 * Math.PI * f * t) + 0.12 * Math.exp(-t * 25) * Math.sin(8 * Math.PI * f * t)); }
  return b;
}
// a harp string that rings on
function harp(f, dur) {
  const b = new Float32Array(Math.round(Math.max(dur, 1.5) * SR));
  for (let i = 0; i < b.length; i++) { const t = i / SR, w = 2 * Math.PI * f * t; b[i] = Math.min(1, t / 0.003) * Math.exp(-t * 1.6) * (Math.sin(w) + 0.4 * Math.exp(-t * 3) * Math.sin(2 * w) + 0.15 * Math.exp(-t * 5) * Math.sin(3 * w)); }
  return b;
}
// a round, slightly driven synth bass
function bass(f, dur) {
  const b = new Float32Array(Math.round(dur * SR));
  for (let i = 0; i < b.length; i++) { const t = i / SR; b[i] = Math.tanh(1.8 * Math.sin(2 * Math.PI * f * t)) * Math.min(1, t / 0.005) * Math.exp(-t * 3.5) * Math.min(1, (dur - t) / 0.02); }
  return b;
}
// two detuned voices that swell in and out, for a sustained chord
function pad(f, dur) {
  const b = new Float32Array(Math.round(dur * SR));
  for (let i = 0; i < b.length; i++) { const t = i / SR, w = 2 * Math.PI * f * t; b[i] = 0.5 * (Math.sin(w) + Math.sin(w * 1.002) + 0.4 * Math.sin(2 * w)) * Math.min(1, t / 0.8, (dur - t) / 0.8); }
  return b;
}
// noise from a fixed generator, so the same story always gets the same sound
let seed = 1;
const noise = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2147483648 - 1; };
function hat() {
  const b = new Float32Array(Math.round(0.08 * SR));
  let prev = 0;
  for (let i = 0; i < b.length; i++) { const n = noise(); b[i] = (n - prev) * Math.exp(-i / SR * 45); prev = n; }
  return b;
}
function snare() {
  const b = new Float32Array(Math.round(0.25 * SR));
  for (let i = 0; i < b.length; i++) { const t = i / SR; b[i] = 0.6 * noise() * Math.exp(-t * 16) + 0.5 * Math.sin(2 * Math.PI * 180 * t) * Math.exp(-t * 20); }
  return b;
}

const NOTE = { A3: 220, C4: 261.63, D4: 293.66, F4: 349.23, G4: 392, A4: 440, C5: 523.25, D5: 587.33, F5: 698.46 };
// two four-bar phrases each, one note per beat, null is a rest; all on the D minor pentatonic, moved by `shift`
const MELODIES = {
  song: ["D4", "G4", "A4", "G4", "C5", "A4", "G4", "D4", "G4", "A4", "C5", "D5", "C5", "A4", "G4", null,
    "D5", "C5", "A4", "G4", "A4", "G4", "D4", "C4", "D4", "G4", "A4", "G4", "D4", null, null, null],
  rise: ["A4", "C5", "D5", null, "C5", "A4", "G4", null, "A4", "C5", "D5", "F5", "D5", null, null, null,
    "D5", "C5", "A4", "C5", "A4", "G4", "F4", "G4", "A4", null, "G4", "D4", "D4", null, null, null],
  walk: ["D4", null, "F4", "D4", "C4", null, "A3", null, "D4", "F4", "G4", "F4", "D4", null, null, null,
    "G4", null, "F4", "D4", "F4", "G4", "A4", null, "G4", "F4", "D4", "C4", "D4", null, null, null],
  run: ["D4", "D4", "F4", "G4", "A4", "G4", "F4", "D4", "D4", "F4", "G4", "A4", "C5", "A4", "G4", "F4",
    "D5", "C5", "A4", "G4", "A4", "G4", "F4", "D4", "F4", "G4", "F4", "D4", "D4", null, "D4", null],
  deep: ["A4", null, null, "G4", "D4", null, null, null, "F4", null, "G4", null, "A4", null, null, null,
    "C5", null, "A4", null, "G4", null, "F4", null, "D4", null, null, null, null, null, null, null],
};
// Each piece has its own instruments, not only its own tune: the first version changed only tempo, key and melody
// over the same đàn bầu, drone and drums, and under the voice the user heard no difference (2026-11-25).
// beat(k, t, level, [root, fifth, octave], note) plays beat k; drone scales the held low note (0 drops it);
// root "F" holds the major drone whatever the moods say. db moves the bed from -33 dBFS RMS: struck sounds (marimba, bell,
// harp) peak far above their average, so at the same RMS they stuck out over the voice and the user asked for them quieter.
const PIECES = {
  song: { bpm: 72, shift: 0, melody: "song", lift: 0, drone: 1, beat(k, t, level, R, note) {
    // a sad part keeps only the first note of each bar
    if (note && (level >= 1 || k % 4 === 0)) put(lead(N(note), BEAT * 2.2), t, 0.5);
    if (level >= 2) [0, 1, 2, 1].forEach((n, j) => { if (j === (k % 4)) { put(pluck(R[n], BEAT), t, 0.28); put(pluck(R[2] * (j % 2 ? 1.5 : 1), BEAT * 0.5), t + BEAT / 2, 0.14); } });
    if (level >= 2 && k % 4 === 0) put(drum(110), t, 0.5);
    if (level >= 3) { if (k % 2 === 1) put(drum(150), t, 0.26); put(drum(180), t + BEAT / 2, 0.14); }
  } },
  // a flute over a held chord
  air: { bpm: 84, shift: 2, melody: "rise", lift: 0, drone: 0.5, beat(k, t, level, R, note) {
    if (note) put(flute(N(note), BEAT * 2), t, 0.45);
    if (k % 4 === 0) [R[1] * 2, R[2] * 2].forEach((f) => put(pad(f, BEAT * 4.4), t, 0.2));
    if (level >= 2 && k % 2 === 0) put(harp(R[2] * 3, BEAT), t + BEAT / 2, 0.15);
  } },
  // a soft marimba over a round bass on every other beat; no noise ticks (the first version's ticks and driven bass
  // grated on the user)
  earth: { bpm: 66, shift: -5, melody: "walk", lift: 0, drone: 0.5, db: -6, beat(k, t, level, R, note) {
    if (note) put(marimba(N(note), BEAT), t, 0.5);
    if (k % 2 === 0) put(pluck(R[k % 4 ? 1 : 0] * 2, BEAT * 1.5), t, 0.4);
    if (level >= 2 && k % 4 === 0) put(drum(90), t, 0.3);
  } },
  // drums on every beat and a bouncing bass, no melody instrument held long
  fire: { bpm: 104, shift: 1, melody: "run", lift: 1, drone: 0, beat(k, t, level, R, note) {
    put(drum(110), t, 0.55);
    if (k % 2 === 1) put(snare(), t, 0.35);
    put(hat(), t + BEAT / 2, 0.2);
    if (level >= 2) put(hat(), t, 0.12);
    put(bass([R[0], R[0], R[1], R[0]][k % 4] * 2, BEAT * 0.45), t, 0.45);
    put(bass(R[0] * 2, BEAT * 0.3), t + BEAT / 2, 0.3);
    if (note && k % 2 === 0) put(marimba(N(note), BEAT), t, 0.3);
  } },
  // long chords under a slow harp; no bell (its inharmonic partials sounded out of tune to the user)
  water: { bpm: 56, shift: -3, melody: "deep", lift: 0, drone: 1, db: -6, beat(k, t, level, R, note) {
    if (k % 4 === 0) { put(pad(R[0] * 2, BEAT * 4.5), t, 0.25); put(pad(R[1] * 2, BEAT * 4.5), t, 0.18); }
    if (note) put(harp(N(note), BEAT * 2), t, 0.4);
  } },
  // a harp spelling a major chord in eighths, brighter than the rest
  stone: { bpm: 76, shift: -2, melody: "rise", lift: 0, drone: 0.6, root: "F", db: -6, beat(k, t, level, R, note) {
    const arp = [R[0] * 2, R[1] * 2, R[2] * 2, R[2] * 2.52];
    put(harp(arp[(2 * k) % 4], BEAT), t, 0.18); put(harp(arp[(2 * k + 1) % 4], BEAT), t + BEAT / 2, 0.14);
    if (note) put(harp(N(note), BEAT * 2), t, 0.42);
    if (level >= 2 && k % 4 === 0) put(drum(100), t, 0.35);
  } },
};
const PIECE = PIECES[MUSIC];
if (!PIECE) { console.error(`MUSIC "${MUSIC}" is not one of ${Object.keys(PIECES).join(", ")}`); process.exit(1); }
const BEAT = 60 / PIECE.bpm;
const KEY = 2 ** (PIECE.shift / 12);
const N = (name) => NOTE[name] * KEY;
const MELODY = MELODIES[PIECE.melody];
const ROOT = { D: [73.42, 110, 146.83].map((f) => f * KEY), F: [87.31, 130.81, 174.61].map((f) => f * KEY) };
const levelAt = (t) => Math.min(3, partAt(t).mood[0] + PIECE.lift);
const rootAt = (t) => ROOT[PIECE.root || partAt(t).mood[1]];

for (let k = 0; k * BEAT < total - 1.5; k++) {
  const t = k * BEAT;
  PIECE.beat(k, t, levelAt(t), rootAt(t), MELODY[k % MELODY.length]);
}

// the drone crossfades between roots and swells with the level
let [d, f] = rootAt(0), lvl = 0.5, ph1 = 0, ph2 = 0;
for (let i = 0; PIECE.drone && i < out.length; i++) {
  const t = i / SR, level = levelAt(t), [r1, r2] = rootAt(t);
  d += (r1 - d) * 0.00008; f += (r2 - f) * 0.00008; lvl += (0.35 + 0.2 * level - lvl) * 0.00005;
  ph1 += (2 * Math.PI * d) / SR; ph2 += (2 * Math.PI * f) / SR;
  out[i] += PIECE.drone * 0.16 * lvl * (Math.sin(ph1) + 0.6 * Math.sin(ph2)) * (0.85 + 0.15 * Math.sin(2 * Math.PI * 0.2 * t));
}

// soften the top, fade the ends, and sit at -33 dBFS RMS: the user found -27 drowned the voice (2026-11-25)
let y = 0;
for (let i = 0; i < out.length; i++) { y += 0.45 * (out[i] - y); out[i] = y; }
const fade = 1.5 * SR;
for (let i = 0; i < fade; i++) { out[i] *= Math.min(1, i / (0.3 * SR)); out[out.length - 1 - i] *= i / fade; }
const rms = Math.sqrt(out.reduce((a, v) => a + v * v, 0) / out.length);
const peak = out.reduce((a, v) => Math.max(a, Math.abs(v)), 0);
const gain = Math.min(10 ** ((-33 + (PIECE.db || 0)) / 20) / rms, 0.9 / peak);

const pcm = Buffer.alloc(44 + out.length * 2);
pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + out.length * 2, 4); pcm.write("WAVEfmt ", 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22);
pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(out.length * 2, 40);
for (let i = 0; i < out.length; i++) pcm.writeInt16LE(Math.round(out[i] * gain * 32767), 44 + i * 2);
const wav = path.join(xuat, "nhac.wav");
fs.writeFileSync(wav, pcm);

const mix = "[0:a]asplit[v1][v2];[1:a][v1]sidechaincompress=threshold=0.1:ratio=2.5:attack=15:release=500[b];[v2][b]amix=inputs=2:normalize=0:duration=longest,loudnorm=I=-15:TP=-1.5:LRA=11,aresample=44100[a]";
const am = path.join(xuat, "am.m4a");
ff(["-i", voice, "-i", wav, "-filter_complex", mix, "-map", "[a]", "-c:a", "aac", "-b:a", "160k", am]);
console.log(`music "${MUSIC}" ${total.toFixed(1)}s, peak ${(peak * gain).toFixed(2)} -> ${am}`);
