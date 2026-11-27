// How smooth the motion of a recorded story is: the difference between every frame and the one before it, on a small
// grey copy of the picture, so that a jump is listed and not looked for. Needs no browser and no .env.
// Usage: node giay/nhay.js <story-folder>
//   First every isolated jump: a frame that differs from the one before it far more than its neighbours differ from
//   theirs. That is the mark of a cover that pops on, of a picture that flashes between two covers, of a layer that
//   changes place at once; a scene that changes at once (a plain cut) is one too. Where the story has a transition
//   there should be none.
//   Then the steps across the end of every shot, ten frames either side of the first frame of the next shot (that one
//   in brackets): a scene change reads as a run of steps that rise and fall, a shot of the same scene as none.
//   The step is the mean difference of the grey values of a 108x192 copy of the frame: a slow push-in gives 0 to 2, a
//   label coming in 3 to 6, a frame of a wipe 15 to 40, a cut between two pages 80 to 200.
//   Run it on every recording before reporting it: the first four cuts of ten-lua-elon-musk/ (2026-11-24) showed 22
//   isolated jumps, in pairs nine to ten frames apart at its eleven sheet and iris changes, because the storybook
//   sheet and iris covered the old page, uncovered it and covered it again.
const path = require("path");
const fs = require("fs");
const { spawnSync } = require("child_process");

const FPS = 25, GAP = 0.5, W = 108, H = 192, N = W * H;
const repo = path.join(__dirname, "..");
const story = path.basename(path.resolve(process.argv[2] || ""));
const dir = path.join(repo, story);
const video = path.join(dir, `${story}.mp4`), loiFile = path.join(dir, "loi.js"), dursFile = path.join(dir, "xuat", "durs.json");
if (!process.argv[2] || ![video, loiFile, dursFile].every(fs.existsSync)) {
  console.error("usage: node giay/nhay.js <story-folder>   (the recorded mp4, loi.js and xuat/durs.json)");
  process.exit(1);
}
const { SHOTS } = new Function(fs.readFileSync(loiFile, "utf8") + "\nreturn { SHOTS };")();
const durs = JSON.parse(fs.readFileSync(dursFile, "utf8"));
let slot = 0;
const shots = SHOTS.map((s, i) => {
  const t0 = slot;
  slot += s.lines.reduce((sum, _, j) => sum + durs[i][j] / 1000, 0) + GAP;
  return { label: s.label, frame: Math.round(t0 * FPS) };
});

const ff = spawnSync("ffmpeg", ["-v", "error", "-i", video, "-vf", `scale=${W}:${H}`, "-f", "rawvideo", "-pix_fmt", "gray", "-"], { maxBuffer: 1 << 30 });
if (ff.status) { console.error(ff.stderr.toString()); process.exit(1); }
const buf = ff.stdout, n = Math.floor(buf.length / N);
// step[f]: frame f against frame f - 1
const step = [0];
for (let f = 1; f < n; f++) {
  let sum = 0;
  for (let i = f * N, e = i + N, p = i - N; i < e; i++) sum += Math.abs(buf[i] - buf[p++]);
  step.push(sum / N);
}
const whole = Math.max(...step);
let total = 0;
for (let f = 1; f < n; f++) total += step[f];
console.log(`${video}: ${n} frames, mean step ${(total / (n - 1)).toFixed(2)}, largest ${whole.toFixed(1)} at frame ${step.indexOf(whole)} (${(step.indexOf(whole) / FPS).toFixed(2)} s)`);

// where a frame lies in the story
const place = (f) => {
  const s = [...shots].reverse().find((x) => x.frame <= f);
  return s && f !== s.frame ? `${((f - s.frame) / FPS).toFixed(2)} s after shot "${s.label}" begins` : s ? `the first frame of shot "${s.label}"` : "before the first shot";
};

const jumps = [];
for (let f = 1; f < n - 1; f++) if (step[f] > 12 && step[f] > 2.2 * Math.max(step[f - 1], step[f + 1])) jumps.push(f);
console.log(`isolated jumps (a step above 12 and above 2.2 times both neighbours): ${jumps.length}`);
for (let a = 0; a < jumps.length; a++) {
  const run = [jumps[a]];
  while (jumps[a + 1] === run[run.length - 1] + 1) run.push(jumps[++a]);
  const worst = run.reduce((m, f) => (step[f] > step[m] ? f : m), run[0]);
  console.log(`  frame ${run[0]}${run.length > 1 ? `-${run[run.length - 1]}` : ""} (${(worst / FPS).toFixed(2)} s): step ${step[worst].toFixed(1)}, its neighbours ${step[worst - 1].toFixed(1)} and ${step[worst + 1].toFixed(1)}; ${place(worst)}`);
}
console.log("steps across the end of every shot, frames c-10 to c+10, c the first frame of the next shot [in brackets]:");
for (let i = 1; i < shots.length; i++) {
  const c = shots[i].frame;
  const row = [];
  for (let f = c - 10; f <= c + 10; f++) row.push(f === c ? `[${step[f].toFixed(0)}]` : step[f].toFixed(0));
  console.log(`  "${shots[i - 1].label}" then "${shots[i].label}" (c = ${c}, ${(c / FPS).toFixed(2)} s): ${row.join(" ")}`);
}
