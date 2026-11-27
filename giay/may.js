// The paper-cut engine. A story's canh.js lists its paper layers and scenes and calls start().
// Every moving thing is its own layer, and everything drawn is a function of time, so quay.js can step frame by frame.
// xuat/cut.js (written by quay.js) is the story's shot list with the measured length of every line.
// a story whose loi.js sets `const WIDE = true` is drawn 1920x1080 instead of 1080x1920
const WIDE = !!window.WIDE, OW = WIDE ? 1920 : 1080, OH = WIDE ? 1080 : 1920, GAP = 0.5;
const STORY = new URLSearchParams(location.search).get("truyen");
const out = Object.assign(document.getElementById("out"), { width: OW, height: OH }).getContext("2d");
if (WIDE) document.body.classList.add("wide");
const L = {};
// the look of the story, set by start(): "storybook" is the illustrated paper-cut of the science shorts (yellow
// captions in short chunks, paper labels, torn sheets between the scenes, puppets mounted on white paper)
let BOOK = false;
const TYPE = () => (BOOK ? 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif' : '"Avenir Next", "Helvetica Neue", Arial, sans-serif');

const sm = (a, b, t) => { const x = Math.min(1, Math.max(0, (t - a) / (b - a))); return x * x * (3 - 2 * x); };
const rnd = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
// 0 before `at`, overshoots a little, settles at 1: a paper piece popping in
const pop = (at, t, d = 0.45) => { const x = Math.min(1, Math.max(0, (t - at) / d)); return x === 0 ? 0 : 1 + 2.7 * (x - 1) ** 3 + 1.7 * (x - 1) ** 2; };
const hop = (t, speed = 7, h = 26) => -Math.abs(Math.sin(t * speed)) * h;

// the generator paints each moving thing on flat magenta: make that transparent and find what is left.
// mount > 0 glues the piece on a white backing that shows as a thin torn edge around it
function cutOut(img, mount = 0) {
  const c = Object.assign(document.createElement("canvas"), { width: img.width, height: img.height });
  const g = c.getContext("2d");
  g.drawImage(img, 0, 0);
  const data = g.getImageData(0, 0, c.width, c.height), p = data.data;
  // stray specks of unkeyed background must not stretch the box, so a row or column counts only when 2 % of it is
  // solid; a mounted piece keeps its thin parts (a spear shaft, an antenna), so for it only 3 pixels are enough
  const rows = new Uint32Array(c.height), cols = new Uint32Array(c.width), w = c.width, solid = new Uint8Array(c.width * c.height);
  for (let i = 0; i < p.length; i += 4) {
    const pink = Math.min(p[i], p[i + 2]) - p[i + 1];
    // the shadow the model paints around a piece on the key colour is dark magenta, which the usual ramp keeps (it is
    // too dark to count as the key); on a mounted piece it would show as a purple rim between the piece and its white
    // backing, so there everything with a trace of magenta in it goes with the background. Brown paper has no blue to
    // speak of, so it stays: an earlier test on "dark and little green" ate holes into the dark hides
    const from = mount ? 8 : 40, over = mount ? 16 : 60;
    let a = 1 - Math.min(1, Math.max(0, (pink - from) / over));
    p[i + 3] = a * 255;
    if (a < 1 && a > 0) { p[i] = Math.min(p[i], p[i + 1] + 40); p[i + 2] = Math.min(p[i + 2], p[i + 1] + 40); }
    if (a > 0.5) solid[i / 4] = 1;
  }
  // a mounted piece also drops specks of paper the model leaves on the key colour: they would float beside it on
  // white halos (anything under 60 pixels that is not joined to the piece)
  if (mount) {
    const seen = new Uint8Array(w * c.height), stack = new Int32Array(w * c.height), blob = [];
    for (let s = 0; s < w * c.height; s++) {
      if (!solid[s] || seen[s]) continue;
      let n = 0; stack[n++] = s; seen[s] = 1; blob.length = 0;
      while (n) {
        const q = stack[--n], x = q % w; blob.push(q);
        for (const r of [x ? q - 1 : -1, x < w - 1 ? q + 1 : -1, q - w, q + w]) if (r >= 0 && solid[r] && !seen[r]) { seen[r] = 1; stack[n++] = r; }
      }
      if (blob.length < 60) for (const q of blob) { solid[q] = 0; p[q * 4 + 3] = 0; }
    }
  }
  for (let s = 0; s < solid.length; s++) if (solid[s]) { rows[(s / w) | 0]++; cols[s % w]++; }
  const least = mount ? 3 : 0;
  const span = (counts, min) => { let from = 0, to = counts.length - 1; while (from < to && counts[from] < min) from++; while (to > from && counts[to] < min) to--; return [from, to]; };
  const [y0, y1] = span(rows, least || c.width * 0.02), [x0, x1] = span(cols, least || c.height * 0.02);
  g.putImageData(data, 0, 0);
  if (!mount) return { c, x0, y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
  // the silhouette stamped in white around itself, a little further in some directions than in others
  const white = Object.assign(document.createElement("canvas"), { width: c.width, height: c.height });
  const wg = white.getContext("2d");
  wg.drawImage(c, 0, 0); wg.globalCompositeOperation = "source-in"; wg.fillStyle = "#f8f3e4"; wg.fillRect(0, 0, c.width, c.height);
  const pad = Math.ceil(mount * 1.5), b = Object.assign(document.createElement("canvas"), { width: x1 - x0 + 1 + 2 * pad, height: y1 - y0 + 1 + 2 * pad });
  const bg = b.getContext("2d");
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    bg.drawImage(white, pad - x0 + Math.cos(a) * mount * (0.5 + 0.9 * rnd(i, 91)), pad - y0 + Math.sin(a) * mount * (0.5 + 0.9 * rnd(i, 92)));
  }
  bg.drawImage(c, pad - x0, pad - y0);
  return { c: b, x0: 0, y0: 0, w: b.width, h: b.height };
}

// draws the visible part of a layer so that its bottom centre sits at (x, y) and it is `w` wide
function P(name, x, y, w, { rot = 0, flip = 0, alpha = 1, shadow = 1 } = {}) {
  const l = L[name], s = w / l.w;
  if (w <= 0 || alpha <= 0) return;
  out.save();
  out.globalAlpha = alpha;
  out.translate(x, y); out.rotate(rot); if (flip) out.scale(-1, 1);
  if (shadow) { out.shadowColor = "rgba(40,20,10,.5)"; out.shadowBlur = 22; out.shadowOffsetY = 12; }
  out.drawImage(l.c, l.x0, l.y0, l.w, l.h, (-l.w * s) / 2, -l.h * s, l.w * s, l.h * s);
  out.restore();
}
// how tall a layer is when drawn `w` wide
const tall = (name, w) => (w * L[name].h) / L[name].w;
// a full-frame backdrop that moves from zoom z0 to z1 over `total` seconds (a slow push-in unless z1 < z0);
// anchorY 0 keeps its top edge, 1 its bottom edge
function plate(name, t, total, anchorY = 0.5, z0 = 1.03, z1 = 1.07) {
  const img = L[name], z = z0 + (z1 - z0) * sm(0, total, t), s = Math.max(OW / img.width, OH / img.height) * z;
  out.drawImage(img, (OW - img.width * s) / 2, (OH - img.height * s) * anchorY, img.width * s, img.height * s);
}
function rays(x, y, t, alpha = 0.14) {
  out.save();
  out.translate(x, y); out.rotate(t * 0.1); out.globalAlpha = alpha; out.fillStyle = "#fff6d0";
  for (let i = 0; i < 12; i++) { out.rotate(Math.PI / 6); out.beginPath(); out.moveTo(0, 0); out.lineTo(-110, -1700); out.lineTo(110, -1700); out.fill(); }
  out.restore();
}
// a band of paper sea whose wave crests start at `top`; everything below it is filled with its deepest colour
function sea(name, x, top, w, { flip = 0, alpha = 1, deep = "#1c3a66" } = {}) {
  const h = tall(name, w);
  out.save(); out.globalAlpha = alpha; out.fillStyle = deep; out.fillRect(0, top + h - 4, OW, OH); out.restore();
  P(name, x, top + h, w, { flip, alpha });
}
function tag(text, x, y, rot = 0, k = 1, size = 34) {
  if (k <= 0) return;
  out.save();
  out.translate(x, y); out.rotate(rot); out.scale(k, k);
  out.font = `800 ${size}px ${TYPE()}`;
  const w = out.measureText(text).width + size * 1.3, h = size * 1.9;
  out.shadowColor = "rgba(40,20,10,.5)"; out.shadowBlur = 14; out.shadowOffsetY = 8;
  out.fillStyle = "#fbf3df"; out.fillRect(0, -h / 2, w, h);
  out.shadowColor = "transparent";
  out.lineWidth = 5; out.strokeStyle = "#2a1608"; out.strokeRect(0, -h / 2, w, h);
  out.fillStyle = "#2a1608"; out.textBaseline = "middle"; out.fillText(text, size * 0.65, 2);
  out.restore();
}
// a paper label of the storybook look, centred at (x, y): lines is a string or [first, second]. Each line sits on its
// own cream strip, slightly askew, with a hard black shadow. sign: one framed board on two poles of `legs` px instead.
// k = pop()
function chip(lines, x, y, k = 1, { legs = 0, size = 54, sign = 0 } = {}) {
  if (k <= 0) return;
  lines = [].concat(lines);
  const pad = size * 1.1, h = lines.length > 1 ? size * 2.5 : size * 1.7;
  out.save();
  out.translate(x, y); out.scale(k, k); out.textBaseline = "middle";
  out.letterSpacing = `${size * (sign ? 0.03 : 0.09)}px`;
  const width = (text, weight, px) => { out.font = `${weight} ${px}px ${TYPE()}`; return out.measureText(text).width; };
  if (sign) {
    const w = Math.max(...lines.map((l, i) => width(l, i ? 700 : 800, i ? size * 0.82 : size))) + pad;
    if (legs) { out.fillStyle = "#15151d"; out.fillRect(-w * 0.3, h / 2, 10, legs); out.fillRect(w * 0.3 - 10, h / 2, 10, legs); }
    out.fillStyle = "#15151d"; out.fillRect(-w / 2 + 14, -h / 2 + 22, w, h);
    out.fillStyle = "#f4efdc"; out.fillRect(-w / 2, -h / 2, w, h);
    out.lineWidth = 9; out.strokeStyle = "#15151d"; out.strokeRect(-w / 2, -h / 2, w, h);
    out.textAlign = "center"; out.fillStyle = "#1b1b26";
    lines.forEach((l, i) => { out.font = `${i ? 700 : 800} ${i ? size * 0.82 : size}px ${TYPE()}`; out.fillText(l, 0, lines.length > 1 ? (i ? h * 0.22 : -h * 0.22) : 2); });
  } else {
    let top = 0;
    out.textAlign = "left";
    lines.forEach((l, i) => {
      const px = i ? size : size * 0.93, w = width(l, i ? 800 : 700, px) + size * 0.5, strip = size * 1.42;
      out.save(); out.rotate(i ? 0.012 : -0.035);
      // the poles stand at both ends of the strip, whose left edge is at -w / 2 (they were measured from its middle)
      if (!i && legs) { out.fillStyle = "#14141a"; out.fillRect(-w / 2 + size * 0.5, strip / 2, 9, legs); out.fillRect(w / 2 - size * 0.5 - 9, strip / 2, 9, legs); }
      out.fillStyle = "#14141a"; out.fillRect(-w / 2 + size * 0.16, top - strip / 2 + size * 0.26, w, strip);
      out.fillStyle = "#f6efd6"; out.fillRect(-w / 2, top - strip / 2, w, strip);
      out.fillStyle = "#141414"; out.fillText(l, -w / 2 + size * 0.25, top + 2);
      out.restore();
      top += strip + size * 0.14;
    });
  }
  out.restore();
}
function ring(x, y, r, k) {
  if (k <= 0) return;
  out.save();
  out.strokeStyle = "#f6c453"; out.lineWidth = 9; out.setLineDash([22, 16]); out.lineCap = "round";
  out.shadowColor = "rgba(40,20,10,.6)"; out.shadowBlur = 8; out.shadowOffsetY = 4;
  out.beginPath(); out.arc(x, y, r, 0, Math.PI * 2 * Math.min(1, k)); out.stroke();
  out.restore();
}
// paper scraps flying out of (x, y); k = seconds since the burst
function shards(x, y, k, n = 26, colors = ["#7a4a2b", "#c8402f", "#fbf3df", "#a8703f"]) {
  if (k <= 0) return;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI * (0.15 + 0.7 * rnd(i, 1)), v = 420 + 520 * rnd(i, 2);
    out.save();
    out.translate(x + Math.cos(a) * v * k, y + Math.sin(a) * v * k + 620 * k * k); out.rotate(k * (4 + 8 * rnd(i, 3)) * (i % 2 ? 1 : -1));
    out.globalAlpha = Math.max(0, 1 - k / 2.2);
    out.shadowColor = "rgba(40,20,10,.45)"; out.shadowBlur = 8; out.shadowOffsetY = 5;
    out.fillStyle = colors[i % colors.length];
    const r = 14 + 26 * rnd(i, 4);
    out.beginPath(); out.moveTo(-r, r * 0.5); out.lineTo(r, r * 0.2); out.lineTo(r * 0.1, -r); out.closePath(); out.fill();
    out.restore();
  }
}
function confetti(t, colors = ["#f2c14e", "#c8402f", "#fbf3df", "#f6a0a0"]) {
  for (let i = 0; i < 60; i++) {
    const x = (rnd(i, 5) * OW + 60 * Math.sin(t * 1.3 + i) + OW) % OW, y = (rnd(i, 6) * OH + t * (150 + 160 * rnd(i, 7))) % OH;
    out.save(); out.translate(x, y); out.rotate(t * (2 + 3 * rnd(i, 8)) + i);
    out.fillStyle = colors[i % colors.length];
    out.shadowColor = "rgba(40,20,10,.35)"; out.shadowBlur = 6; out.shadowOffsetY = 4;
    out.fillRect(-11, -7, 22, 14);
    out.restore();
  }
}
function tears(x, y, t) {
  for (let i = 0; i < 4; i++) {
    const k = (t * 0.7 + i * 0.25) % 1;
    out.save(); out.translate(x + (i % 2 ? 26 : -26), y + k * 260); out.globalAlpha = 1 - k;
    out.fillStyle = "#9fd8f0"; out.strokeStyle = "#2a1608"; out.lineWidth = 4;
    out.beginPath(); out.moveTo(0, -22); out.quadraticCurveTo(18, 6, 0, 16); out.quadraticCurveTo(-18, 6, 0, -22); out.fill(); out.stroke();
    out.restore();
  }
}
// a round paper thought bubble; the caller draws what is inside it
function bubble(x, y, r, k) {
  if (k <= 0) return;
  out.save();
  out.translate(x, y); out.scale(k, k);
  out.shadowColor = "rgba(40,20,10,.5)"; out.shadowBlur = 18; out.shadowOffsetY = 10;
  out.fillStyle = "#fbf3df"; out.strokeStyle = "#2a1608"; out.lineWidth = 6;
  out.beginPath(); out.arc(0, 0, r, 0, 7); out.fill(); out.shadowColor = "transparent"; out.stroke();
  [[-r * 0.72, r * 0.95, 26], [-r * 1.0, r * 1.3, 15]].forEach(([bx, by, br]) => { out.beginPath(); out.arc(bx, by, br, 0, 7); out.fill(); out.stroke(); });
  out.restore();
}
// twinkling four-point stars, for gold and magic
function sparkles(x, y, spread, t, n = 12) {
  for (let i = 0; i < n; i++) {
    const k = (t * (0.5 + 0.5 * rnd(i, 21)) + rnd(i, 22)) % 1, r = (10 + 22 * rnd(i, 23)) * Math.sin(Math.PI * k);
    out.save();
    out.translate(x + (rnd(i, 24) - 0.5) * 2 * spread, y + (rnd(i, 25) - 0.5) * 2 * spread - 40 * k); out.rotate(t + i);
    out.fillStyle = "#fff3b0"; out.strokeStyle = "#2a1608"; out.lineWidth = 3;
    out.beginPath();
    for (let a = 0; a < 8; a++) { const rr = a % 2 ? r * 0.35 : r, an = (a * Math.PI) / 4; out.lineTo(Math.cos(an) * rr, Math.sin(an) * rr); }
    out.closePath(); out.fill(); out.stroke();
    out.restore();
  }
}
// outer space drawn by code: the generator paints a sheet of paper with a border instead of a starry sky
function space(t) {
  out.fillStyle = "#0a0f2c"; out.fillRect(0, 0, OW, OH);
  for (let i = 0; i < 140; i++) {
    const r = 2 + 5 * rnd(i, 72) * (0.6 + 0.4 * Math.sin(t * (1 + 2 * rnd(i, 73)) + i));
    out.fillStyle = i % 5 ? "#fbf3df" : "#f6c453";
    out.beginPath(); out.arc(rnd(i, 70) * OW, rnd(i, 71) * OH, r, 0, 7); out.fill();
  }
}
// a paper globe seen from above (lon0, lat0), radius r. lands and ice are lists of [[lon, lat], ...] outlines; the
// shapes a story passes are hand-sketched from memory of palaeomaps: an illustration, not a reconstruction
function globe(x, y, r, { lands, ice = [] }, lon0, lat0 = 0) {
  const rad = Math.PI / 180, s0 = Math.sin(lat0 * rad), c0 = Math.cos(lat0 * rad);
  const spot = ([lon, lat]) => {
    const d = (lon - lon0) * rad, sl = Math.sin(lat * rad), cl = Math.cos(lat * rad);
    let px = cl * Math.sin(d), py = c0 * sl - s0 * cl * Math.cos(d);
    // a point on the far side is pushed to the rim, which keeps a half-visible outline closed
    if (s0 * sl + c0 * cl * Math.cos(d) < 0) { const n = Math.hypot(px, py) || 1; px /= n; py /= n; }
    return [x + r * px, y - r * py];
  };
  // between two outline points, the short way round the globe
  const mix = (from, to, k) => [from[0] + ((((to[0] - from[0] + 540) % 360) - 180) * k), from[1] + (to[1] - from[1]) * k];
  // corner cutting, twice: the hand-sketched outlines are coarse polygons
  const round = (pts) => pts.flatMap((p, i) => { const q = pts[(i + 1) % pts.length]; return [mix(p, q, 0.25), mix(p, q, 0.75)]; });
  const shape = (outline, fill) => {
    out.beginPath();
    round(round(outline)).forEach((from, i, all) => { const to = all[(i + 1) % all.length]; for (let k = 0; k < 4; k++) out.lineTo(...spot(mix(from, to, k / 4))); });
    out.closePath(); out.fillStyle = fill; out.fill(); out.lineWidth = 4; out.strokeStyle = "#2a1608"; out.stroke();
  };
  out.save();
  out.shadowColor = "rgba(0,0,0,.5)"; out.shadowBlur = 30; out.shadowOffsetY = 14;
  out.beginPath(); out.arc(x, y, r, 0, 7); out.fillStyle = "#2f6fb0"; out.fill();
  out.shadowColor = "transparent"; out.clip();
  lands.forEach((land, i) => shape(land, i % 2 ? "#7fae5c" : "#9a8a52"));
  ice.forEach((cap) => shape(cap, "#f4f1e6"));
  const shade = out.createRadialGradient(x - r * 0.4, y - r * 0.4, r * 0.2, x, y, r);
  shade.addColorStop(0, "rgba(255,255,255,.12)"); shade.addColorStop(1, "rgba(10,15,44,.45)");
  out.fillStyle = shade; out.fillRect(x - r, y - r, r * 2, r * 2);
  out.restore();
  out.beginPath(); out.arc(x, y, r, 0, 7); out.lineWidth = 7; out.strokeStyle = "#2a1608"; out.stroke();
}
const ground = (color, top) => { out.fillStyle = color; out.fillRect(0, top, OW, OH - top); };
const night = (color = "#7f8fc4") => { out.save(); out.globalCompositeOperation = "multiply"; out.fillStyle = color; out.fillRect(0, 0, OW, OH); out.restore(); };
const jolt = (k) => out.translate(k * Math.sin(k * 9.1) * 1.2, k * Math.cos(k * 7.3) * 1.2);

const bare = (word) => word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
// one caption at a time: break after punctuation where possible, never mid-word; a hot phrase stays in one caption
function chunks(text, hot = [], max = 16) {
  const parts = [];
  let cur = "";
  for (const phrase of hot) text = text.replaceAll(phrase, phrase.replaceAll(" ", " "));
  for (const word of text.split(" ")) {
    const full = cur.length + word.length + 1 > max;
    const pause = /[.!?]$/.test(cur) || (/[,;:]$/.test(cur) && cur.length >= max / 2);
    if (cur && (full || pause)) { parts.push(cur); cur = word; } else cur = cur ? cur + " " + word : word;
  }
  if (cur) parts.push(cur);
  // a storybook caption does not end on a short stray word ("mùa", "của", "với"), which belongs with what follows
  if (BOOK) for (let i = 0; i < parts.length - 1; i++) {
    const words = parts[i].split(" "), tail = words[words.length - 1];
    if (words.length >= 3 && bare(tail).length <= 3 && parts[i + 1].length + tail.length + 1 <= max + 3) { parts[i] = words.slice(0, -1).join(" "); parts[i + 1] = tail + " " + parts[i + 1]; }
  }
  // a lone last word joins the chunk before it, unless that would make a storybook caption run to a third line
  const lastWord = parts[parts.length - 1];
  if (parts.length > 1 && !/\s/.test(lastWord) && (!BOOK || parts[parts.length - 2].length + 1 + lastWord.length <= max)) { parts.pop(); parts[parts.length - 1] += " " + lastWord; }
  // when it does not fit there, it borrows the last word of that chunk instead, so it is not a caption of one word
  else if (BOOK && parts.length > 1 && parts[parts.length - 2].split(" ").length >= 3 && !/\s/.test(lastWord)) {
    const words = parts[parts.length - 2].split(" ");
    parts[parts.length - 2] = words.slice(0, -1).join(" "); parts[parts.length - 1] = words[words.length - 1] + " " + lastWord;
  }
  return parts;
}
function capHtml(part, hot) {
  const marked = new Set(hot.flatMap((h) => h.split(" ")).map(bare));
  return part.split(/\s+/).map((word) => `<span${marked.has(bare(word)) ? ' class="hot"' : ""}>${BOOK ? word : word.replace(/[.,;:]+$/, "")}</span>`).join(" ");
}

// scenes: [{ shots: [labels], cut, iris, draw(ts, i, u, line, v) }], where ts = seconds since the scene began,
// i = which of its shots is playing, u = seconds into that shot, line = which sentence of the shot is being read and
// v = seconds into that sentence. In the storybook look a scene chooses how it enters: cut "sheet" (the default, a torn
// sheet of paper rising through the frame), "band" (a black band wiping in from the left), "iris" (closing on the point
// iris = [x, y], then opening on the new scene) or 0 for a plain cut.
// card: [small line, big line, number] shown over the shot labelled "kết".
// look: "storybook" draws the science shorts: yellow captions in short chunks that crossfade, no grain or vignette (the
// pages carry their own paper), and every puppet mounted on white paper; stickers names keyed props mounted the same way.
function start({ plates, cuts, scenes, card, look, stickers = [] }) {
  BOOK = look === "storybook";
  if (BOOK) document.body.classList.add("storybook");
  const capBox = document.getElementById("cap"), backBox = document.getElementById("capb"), cardBox = document.getElementById("card");
  if (card) cardBox.innerHTML = `<small>${card[0]}</small><b>${card[1]}</b><i>${card[2] || ""}</i>`;
  // a storybook caption is two copies of the same text: .k is the dark outline behind, .f the yellow fill in front
  let fill, ink, fillB, inkB;
  if (BOOK) for (const box of [capBox, backBox]) box.innerHTML = '<div class="k"></div><div class="f"></div>';
  [fill, fillB] = BOOK ? [capBox, backBox].map((b) => b.querySelector(".f")) : [];
  [ink, inkB] = BOOK ? [capBox, backBox].map((b) => b.querySelector(".k")) : [];
  let at = 0;
  const SHOTS = window.CUT.map((cut) => {
    const scene = scenes.find((s) => s.shots.includes(cut.label));
    if (!scene) throw new Error(`no scene draws shot "${cut.label}"`);
    const caps = [], lineAt = [];
    let from = 0;
    for (const line of cut.lines) {
      lineAt.push(from);
      // a storybook caption (about 17 letters to a line at its size) must not run past two lines
      const parts = chunks(line.text, cut.hot, WIDE ? 38 : BOOK ? 28 : 16), letters = parts.reduce((sum, p) => sum + p.length, 0);
      let part0 = from;
      for (const p of parts) { caps.push([part0, capHtml(p, cut.hot)]); part0 += (line.dur * p.length) / letters; }
      from += line.dur;
    }
    const shot = { label: cut.label, t0: at, dur: from, len: from + GAP, scene, i: scene.shots.indexOf(cut.label), caps, lineAt };
    if (shot.i === 0) scene.t0 = at;
    at += shot.len;
    return shot;
  });
  window.TOTAL = at + 1.5;
  window.STARTS = SHOTS.map((s) => [s.label, s.t0, s.len]);

  const grain = Object.assign(document.createElement("canvas"), { width: 270, height: 480 });
  { const g = grain.getContext("2d"), d = g.createImageData(270, 480); for (let i = 0; i < d.data.length; i += 4) { const v = 110 + rnd(i, 3) * 145; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 46; } g.putImageData(d, 0, 0); }

  // How long each side of a scene change takes in the storybook look: 0 when the scene cuts plainly. A change is centred
  // on the first shot of the new scene, t0: before t0 the old scene is still playing and the change covers it, after t0
  // the new scene is playing and the change uncovers it.
  const half = (cut) => (cut === "band" ? 0.2 : cut === "iris" ? 0.32 : cut ? 0.36 : 0);
  // when the first caption of a scene may begin to fade in, in seconds: the caption is drawn above the canvas, so it
  // waits until the cover has passed the place where the captions sit (from 1250 px down). A band has passed it 0.08 s
  // after the shot began, a sheet rising out through the top by 0.15 s, an iris opening from its point by 0.18 s
  const capIn = (cut) => (cut === "sheet" ? 0.15 : cut === "iris" ? 0.18 : 0.08);
  // a torn sheet of cream paper rises from below the bottom edge, covers all at k = 0 and goes on out through the top;
  // k runs from -1 to 1. A darker sheet leads it by a torn fringe, and the paper glows towards the middle of the frame
  const sheet = (k) => {
    const tear = 70, h = OH + 2 * tear, top = -tear - k * h;
    const path = (lead) => {
      out.beginPath(); out.moveTo(-90, top + lead + tear);
      for (let x = -90; x <= OW + 26; x += 26) out.lineTo(x, top + lead + tear * rnd(Math.round(x / 26), 81));
      out.lineTo(OW + 90, top + lead + h - tear);
      for (let x = OW + 90; x >= -90; x -= 26) out.lineTo(x, top + lead + h - tear * rnd(Math.round(x / 26), 82));
      out.closePath();
    };
    out.save();
    out.shadowColor = "rgba(20,12,8,.6)"; out.shadowBlur = 50; out.shadowOffsetY = k < 0 ? -26 : 26;
    path(k < 0 ? -34 : 34); out.fillStyle = "#e2d3ae"; out.fill();
    const g = out.createRadialGradient(OW / 2, OH / 2, OH * 0.1, OW / 2, OH / 2, OH * 0.75);
    g.addColorStop(0, "#fcf8ee"); g.addColorStop(1, "#eee5cc");
    path(0); out.fillStyle = g; out.fill();
    out.restore();
  };
  // a black band with soft edges wipes from the left; `other` is the scene on the far side of the band, drawn again there
  const band = (k, other) => {
    const w = OW * 0.56, xc = -w + ((k + 1) / 2) * (OW + 2 * w);
    out.save();
    out.beginPath();
    if (k < 0) { out.rect(-4, 0, Math.max(0, xc + 4), OH); out.clip(); other.scene.draw(0, 0, 0, 0, 0); }
    else {
      out.rect(xc, 0, Math.max(0, OW - xc + 4), OH); out.clip();
      const last = other.lineAt.length - 1;
      other.scene.draw(other.t0 + other.len - other.scene.t0, other.i, other.len, last, other.len - other.lineAt[last]);
    }
    out.restore();
    const g = out.createLinearGradient(xc - w / 2, 0, xc + w / 2, 0);
    g.addColorStop(0, "#0b091000"); g.addColorStop(0.32, "#0b0910"); g.addColorStop(0.68, "#0b0910"); g.addColorStop(1, "#0b091000");
    out.fillStyle = g; out.fillRect(xc - w / 2, 0, w, OH);
  };

  let capNow, backNow;
  window.renderAt = (t) => {
    let n = SHOTS.findIndex((s) => t < s.t0 + s.len);
    if (n < 0) n = SHOTS.length - 1;
    const shot = SHOTS[n], u = Math.min(t - shot.t0, shot.len);
    out.fillStyle = "#1a0d06"; out.fillRect(0, 0, OW, OH);
    const line = shot.lineAt.findLastIndex((from) => u >= from);
    shot.scene.draw(shot.t0 + u - shot.scene.t0, shot.i, u, line, u - shot.lineAt[line]);

    // a sheet of paper slides across whenever the scene changes
    const edge = SHOTS.find((s) => s.i === 0 && s.t0 > 0 && Math.abs(t - s.t0) < (BOOK ? half(s.scene.cut) : 0.22));
    if (edge) {
      const k = (t - edge.t0) / (BOOK ? half(edge.scene.cut) : 0.22);
      if (!BOOK) {
        const x = k < 0 ? OW * -k : -OW * k;
        out.save(); out.shadowColor = "rgba(40,20,10,.6)"; out.shadowBlur = 40; out.fillStyle = "#f3e7c9"; out.fillRect(x - 40, 0, OW + 80, OH); out.restore();
      } else if (edge.scene.cut === "band") band(k, SHOTS[n + (k < 0 ? 1 : -1)]);
      else {
        // the sheet and the iris leave from rest, move fastest in the middle of each half and settle at the far end
        const e = k < 0 ? sm(-1, 0, k) - 1 : sm(0, 1, k);
        if (edge.scene.cut === "iris") {
          const [cx, cy] = edge.scene.iris || [OW / 2, OH * 0.52], r = Math.hypot(OW, OH) * 0.62 * Math.abs(e);
          out.save();
          out.fillStyle = "#0b0910"; out.beginPath(); out.rect(-2, -2, OW + 4, OH + 4); out.arc(cx, cy, r, 0, 7); out.fill("evenodd");
          out.strokeStyle = "rgba(11,9,16,.5)"; out.lineWidth = 60; out.beginPath(); out.arc(cx, cy, Math.max(0, r - 30), 0, 7); out.stroke();
          out.restore();
        } else sheet(e);
      }
    }
    if (!BOOK) {
      out.globalCompositeOperation = "multiply";
      out.drawImage(grain, 0, 0, OW, OH);
      out.globalCompositeOperation = "source-over";
      const v = out.createRadialGradient(OW / 2, OH / 2, OH * 0.35, OW / 2, OH / 2, OH * 0.75);
      v.addColorStop(0, "#1a0d0600"); v.addColorStop(1, "#1a0d0677");
      out.fillStyle = v; out.fillRect(0, 0, OW, OH);
    }

    let cap = "";
    for (const [from, html] of shot.caps) if (u >= from && u < shot.dur) cap = html;
    // a storybook caption fades out with the last words of the shot, before the next sheet arrives; the next chunk
    // crossfades in (the old one leaves first), and the first chunk of a scene waits for its sheet, band or iris to
    // have passed the captions
    let back = "", mix = 1, backMix = 0;
    if (BOOK && shot.caps.length) {
      const k = shot.caps.findLastIndex(([from]) => u >= from), since = k > 0 ? u - shot.caps[k][0] : u;
      if (u >= shot.dur) { cap = shot.caps[k][1]; mix = 1 - sm(0, 0.18, u - shot.dur); }
      else if (k > 0) { back = shot.caps[k - 1][1]; backMix = 1 - sm(0, 0.12, since); mix = sm(0.1, 0.28, since); }
      else if (shot.scene.cut) mix = sm(capIn(shot.scene.cut), capIn(shot.scene.cut) + 0.18, u);
    }
    // a story whose loi.js sets `const SUBS = false` burns in no subtitles: it is also published in other languages
    if (window.SUBS === false) cap = back = "";
    if (cap !== capNow) { capNow = cap; if (BOOK) fill.innerHTML = ink.innerHTML = cap; else capBox.innerHTML = cap; }
    if (back !== backNow) { backNow = back; if (BOOK) fillB.innerHTML = inkB.innerHTML = back; }
    if (BOOK) {
      capBox.style.opacity = mix; backBox.style.opacity = backMix;
      capBox.style.transform = `translateY(${(1 - mix) * 16}px)`; backBox.style.transform = `translateY(${(1 - backMix) * -12}px)`;
    }
    cardBox.style.display = shot.label === "kết" ? "block" : "none";
  };

  const load = (name, ext) => new Promise((done, fail) => { const el = new Image(), src = `/${STORY}/anh/${name}.${ext}`; el.onload = () => done([name, el]); el.onerror = () => fail(new Error(`missing ${src}`)); el.src = src; });
  const fonts = BOOK ? ["900 40px Montserrat", "800 54px Montserrat", "700 50px Montserrat"].map((f) => document.fonts.load(f)) : [];
  Promise.all([...plates.map((n) => load(n, "jpg")), ...cuts.map((n) => load(n, "png")), ...fonts]).then((all) => {
    for (const [name, el] of all) if (el) L[name] = plates.includes(name) ? el : cutOut(el, BOOK && (name.startsWith("pg-") || stickers.includes(name)) ? 9 : 0);
    window.renderAt(0);
    window.ready = true;
    if (location.search.includes("play")) { const began = performance.now(); const loop = () => { window.renderAt(((performance.now() - began) / 1000) % window.TOTAL); requestAnimationFrame(loop); }; loop(); }
  }, (e) => { window.failed = e.message; });
}
window.addEventListener("error", (e) => { window.failed = window.failed || e.message; });
