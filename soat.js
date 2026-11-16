// Checks a story's shot list before any narration or recording is spent on it.
// Usage: node soat.js <story-folder>
const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(process.argv[2]);
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const SHOTS = new Function(["helpers.js", "people.js", "shots-a.js", "shots-b.js"].map(read).join("\n") + "\nreturn SHOTS;")();
const voices = [...fs.readFileSync(path.join(__dirname, "doc.js"), "utf8").matchAll(/^\s*"([^"]+)": \[/gm)].map((m) => m[1]);
const w2 = parseFloat(read("index.html").match(/viewBox="0 0 ([\d.]+) /)[1]) / 2;
const TRANSITIONS = ["fade", ...new Set([...read("index.html").matchAll(/data-tr="(\w+)"/g)].map((m) => m[1]))];
const bare = (word) => word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

SHOTS.forEach((shot, i) => {
  const at = `shot ${i} (${shot.label})`;
  assert(typeof shot.art === "string" && shot.art.length > 0 && !shot.art.includes("undefined") && !shot.art.includes("NaN"), `${at}: bad art`);
  assert(Array.isArray(shot.cam) && shot.cam.length === 2, `${at}: cam needs two stops`);
  for (const [cx, cy, z] of shot.cam) {
    assert([cx, cy, z].every(Number.isFinite) && z >= 1, `${at}: bad cam stop ${[cx, cy, z]}`);
    if (cx < w2 / z || cx > 1600 - w2 / z || cy < 450 / z || cy > 900 - 450 / z) console.warn(`${at}: cam stop ${[cx, cy, z]} is clamped to the art`);
  }
  assert(Array.isArray(shot.lines) && shot.lines.length > 0, `${at}: no lines`);
  for (const [who, text, pause] of shot.lines) {
    assert(text || pause > 0, `${at}: a line needs text or a pause`);
    assert(who === null || voices.includes(who), `${at}: speaker "${who}" is not in VOICES of doc.js`);
  }
  assert(!shot.tr || TRANSITIONS.includes(shot.tr), `${at}: unknown transition ${shot.tr}`);
  const said = shot.lines.flatMap((l) => l[1].split(/\s+/)).map(bare);
  for (const word of (shot.hot || []).flatMap((h) => h.split(" "))) assert(said.includes(bare(word)), `${at}: hot word "${word}" is not in the lines`);
});
console.log(`ok ${SHOTS.length} shots`);
