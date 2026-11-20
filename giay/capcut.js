// Writes a CapCut draft of a recorded story, so the voice, the music and the subtitles can be
// replaced in CapCut without recording the picture again. Tracks: picture (muted), voice, music, subtitles.
// usage: node giay/capcut.js <story-folder> [force]
// The draft format is not published: capcut-mau.json is an empty draft saved by CapCut 9.8.0 for macOS.
const fs = require("fs"), path = require("path"), os = require("os"), crypto = require("crypto");
const { execFileSync } = require("child_process");

const [story, force] = process.argv.slice(2);
const dir = path.resolve(story), name = path.basename(dir);
const ROOT = path.join(os.homedir(), "Movies/CapCut/User Data/Projects/com.lveditor.draft");
const out = path.join(ROOT, name);
if (!fs.existsSync(ROOT)) throw new Error(`no CapCut drafts folder at ${ROOT}: open CapCut once`);
try { execFileSync("pgrep", ["-x", "CapCut"]); console.error("Quit CapCut first: it saves over drafts while it runs."); process.exit(1); } catch {}
if (fs.existsSync(out) && force !== "force") { console.error(`${out} exists. Edits made in CapCut would be lost: pass "force" to replace it.`); process.exit(1); }

const id = () => crypto.randomUUID().toUpperCase();
const US = (seconds) => Math.round(seconds * 1e6);
const probe = (file) => JSON.parse(execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration", "-of", "json", file]));
const range = (start, duration) => ({ start, duration });

const { info, meta } = JSON.parse(fs.readFileSync(path.join(__dirname, "capcut-mau.json"), "utf8"));
const M = info.materials;
const track = (type, segments) => ({ attribute: 0, flag: 0, id: id(), is_default_name: true, name: "", segments, type });
const segment = (material, at, length, more) => {
  const speed = { curve_speed: null, id: id(), mode: 0, speed: 1, type: "speed" };
  M.speeds.push(speed);
  return {
    cartoon: false, clip: null, common_keyframes: [], enable_adjust: true, extra_material_refs: [speed.id], group_id: "", id: id(),
    intensifies_audio: false, is_placeholder: false, is_tone_modify: false, keyframe_refs: [], last_nonzero_volume: 1,
    material_id: material.id, render_index: 0, reverse: false, source_timerange: range(0, length), speed: 1,
    target_timerange: range(at, length), template_id: "", template_scene: "default", track_attribute: 0, track_render_index: 0,
    visible: true, volume: 1, ...more,
  };
};
const clip = (y = 0) => ({ alpha: 1, flip: { horizontal: false, vertical: false }, rotation: 0, scale: { x: 1, y: 1 }, transform: { x: 0, y } });

const film = path.join(dir, `${name}.mp4`), shot = probe(film), { width, height } = shot.streams[0], total = US(+shot.format.duration);
const picture = { category_name: "local", check_flag: 63487, duration: total, has_audio: true, height, id: id(), material_name: path.basename(film), path: film, type: "video", width };
M.videos.push(picture);
const tracks = [track("video", [segment(picture, 0, total, { clip: clip(), volume: 0, uniform_scale: { on: true, value: 1 } })])];

// the music plays at half level: the draft has no ducking under the voice as am.m4a has
for (const [file, volume] of [["loi-ke.wav", 1], ["nhac.wav", 0.5]]) {
  const full = path.join(dir, "xuat", file), length = Math.min(total, US(+probe(full).format.duration));
  const sound = { category_name: "local", check_flag: 1, duration: length, id: id(), name: file, path: full, type: "extract_music" };
  M.audios.push(sound);
  tracks.push(track("audio", [segment(sound, 0, length, { volume, last_nonzero_volume: volume })]));
}

const stamp = (s) => { const [h, m, rest] = s.split(":"); return US(h * 3600 + m * 60 + +rest.replace(",", ".")); };
const cues = fs.readFileSync(path.join(dir, `${name}.srt`), "utf8").trim().split(/\n\s*\n/).map((block) => {
  const [, times, ...words] = block.split("\n"), [from, to] = times.split(" --> ").map(stamp);
  return { from, to, text: words.join(" ") };
});
// CapCut breaks a long line in the middle of a Vietnamese word, so the lines are broken here,
// short enough that it never breaks them again. A long sentence becomes several cues of two lines.
const tall = height > width, SIZE = tall ? 8 : 6, WIDTH = tall ? 24 : 46;
const wrap = (text) => text.split(" ").reduce((lines, word) => {
  const last = lines[lines.length - 1];
  if (last && (last + " " + word).length <= WIDTH) lines[lines.length - 1] = last + " " + word; else lines.push(word);
  return lines;
}, []);
const shown = cues.flatMap(({ from, to, text }) => {
  const lines = wrap(text), parts = [];
  for (let n = 0; n < lines.length; n += 2) parts.push(lines.slice(n, n + 2).join("\n"));
  const all = parts.join("").length;
  let at = from;
  return parts.map((part) => { const length = Math.round((to - from) * part.length / all), cue = { from: at, to: at + length, text: part }; at += length; return cue; });
});
tracks.push(track("text", shown.map(({ from, to, text }) => {
  const style = { fill: { alpha: 1, content: { render_type: "solid", solid: { alpha: 1, color: [1, 1, 1] } } }, range: [0, text.length], size: SIZE };
  const words = { alignment: 1, check_flag: 7, content: JSON.stringify({ styles: [style], text }), font_size: SIZE, global_alpha: 1, id: id(), line_max_width: 0.95, text_color: "#FFFFFF", type: "subtitle" };
  M.texts.push(words);
  return segment(words, from, to - from, { clip: clip(-0.8), render_index: 14000, uniform_scale: { on: true, value: 1 } });
})));

const now = Date.now();
Object.assign(info, { id: id(), duration: total, fps: 25, tracks, canvas_config: { ...info.canvas_config, width, height } });
Object.assign(meta, { draft_fold_path: out, draft_id: id(), draft_name: name, draft_root_path: ROOT, tm_draft_create: now * 1000, tm_draft_modified: now * 1000, tm_duration: total });

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "draft_info.json"), JSON.stringify(info));
fs.writeFileSync(path.join(out, "draft_meta_info.json"), JSON.stringify(meta));
console.log(`draft "${name}": ${(total / 1e6).toFixed(2)}s, ${shown.length} subtitles -> ${out}`);
