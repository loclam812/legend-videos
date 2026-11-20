// The paper-cut engine. A story's canh.js lists its paper layers and scenes and calls start().
// Every moving thing is its own layer, and everything drawn is a function of time, so quay.js can step frame by frame.
// xuat/cut.js (written by quay.js) is the story's shot list with the measured length of every line.
// a story whose loi.js sets `const WIDE = true` is drawn 1920x1080 instead of 1080x1920
const WIDE = !!window.WIDE, OW = WIDE ? 1920 : 1080, OH = WIDE ? 1080 : 1920, GAP = 0.5;
const STORY = new URLSearchParams(location.search).get("truyen");
const out = Object.assign(document.getElementById("out"), { width: OW, height: OH }).getContext("2d");
if (WIDE) document.body.classList.add("wide");
const L = {};

const sm = (a, b, t) => { const x = Math.min(1, Math.max(0, (t - a) / (b - a))); return x * x * (3 - 2 * x); };
const rnd = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
// 0 before `at`, overshoots a little, settles at 1: a paper piece popping in
const pop = (at, t, d = 0.45) => { const x = Math.min(1, Math.max(0, (t - at) / d)); return x === 0 ? 0 : 1 + 2.7 * (x - 1) ** 3 + 1.7 * (x - 1) ** 2; };
const hop = (t, speed = 7, h = 26) => -Math.abs(Math.sin(t * speed)) * h;

// the generator paints each moving thing on flat magenta: make that transparent and find what is left
function cutOut(img) {
  const c = Object.assign(document.createElement("canvas"), { width: img.width, height: img.height });
  const g = c.getContext("2d");
  g.drawImage(img, 0, 0);
  const data = g.getImageData(0, 0, c.width, c.height), p = data.data;
  // stray specks of unkeyed background must not stretch the box, so a row or column counts only when 2 % of it is solid
  const rows = new Uint32Array(c.height), cols = new Uint32Array(c.width);
  for (let i = 0; i < p.length; i += 4) {
    const pink = Math.min(p[i], p[i + 2]) - p[i + 1];
    const a = 1 - Math.min(1, Math.max(0, (pink - 40) / 60));
    p[i + 3] = a * 255;
    if (a < 1 && a > 0) { p[i] = Math.min(p[i], p[i + 1] + 40); p[i + 2] = Math.min(p[i + 2], p[i + 1] + 40); }
    if (a > 0.5) { rows[Math.floor(i / 4 / c.width)]++; cols[(i / 4) % c.width]++; }
  }
  const span = (counts, min) => { let from = 0, to = counts.length - 1; while (from < to && counts[from] < min) from++; while (to > from && counts[to] < min) to--; return [from, to]; };
  const [y0, y1] = span(rows, c.width * 0.02), [x0, x1] = span(cols, c.height * 0.02);
  g.putImageData(data, 0, 0);
  return { c, x0, y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
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
// a full-frame backdrop that creeps closer over `total` seconds; anchorY 0 keeps its top edge, 1 its bottom edge
function plate(name, t, total, anchorY = 0.5) {
  const img = L[name], z = 1.03 + 0.04 * sm(0, total, t), s = Math.max(OW / img.width, OH / img.height) * z;
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
  out.font = `800 ${size}px "Avenir Next", "Helvetica Neue", Arial, sans-serif`;
  const w = out.measureText(text).width + size * 1.3, h = size * 1.9;
  out.shadowColor = "rgba(40,20,10,.5)"; out.shadowBlur = 14; out.shadowOffsetY = 8;
  out.fillStyle = "#fbf3df"; out.fillRect(0, -h / 2, w, h);
  out.shadowColor = "transparent";
  out.lineWidth = 5; out.strokeStyle = "#2a1608"; out.strokeRect(0, -h / 2, w, h);
  out.fillStyle = "#2a1608"; out.textBaseline = "middle"; out.fillText(text, size * 0.65, 2);
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
  if (parts.length > 1 && !/\s/.test(parts[parts.length - 1])) { const last = parts.pop(); parts[parts.length - 1] += " " + last; }
  return parts;
}
function capHtml(part, hot) {
  const marked = new Set(hot.flatMap((h) => h.split(" ")).map(bare));
  return part.split(/\s+/).map((word) => `<span${marked.has(bare(word)) ? ' class="hot"' : ""}>${word.replace(/[.,;:]+$/, "")}</span>`).join(" ");
}

// plates: full-frame backdrops (jpg). cuts: keyed layers (png). scenes: [{ shots: [labels], draw(ts, i, u, line, v) }], where
// ts = seconds since the scene began, i = which of its shots is playing, u = seconds into that shot,
// line = which sentence of the shot is being read, v = seconds into that sentence.
// card: [small line, big line, number] shown over the shot labelled "kết".
function start({ plates, cuts, scenes, card }) {
  const capBox = document.getElementById("cap"), cardBox = document.getElementById("card");
  if (card) cardBox.innerHTML = `<small>${card[0]}</small><b>${card[1]}</b><i>${card[2] || ""}</i>`;
  let at = 0;
  const SHOTS = window.CUT.map((cut) => {
    const scene = scenes.find((s) => s.shots.includes(cut.label));
    if (!scene) throw new Error(`no scene draws shot "${cut.label}"`);
    const caps = [], lineAt = [];
    let from = 0;
    for (const line of cut.lines) {
      lineAt.push(from);
      const parts = chunks(line.text, cut.hot, WIDE ? 38 : 16), letters = parts.reduce((sum, p) => sum + p.length, 0);
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

  window.renderAt = (t) => {
    let n = SHOTS.findIndex((s) => t < s.t0 + s.len);
    if (n < 0) n = SHOTS.length - 1;
    const shot = SHOTS[n], u = Math.min(t - shot.t0, shot.len);
    out.fillStyle = "#1a0d06"; out.fillRect(0, 0, OW, OH);
    const line = shot.lineAt.findLastIndex((from) => u >= from);
    shot.scene.draw(shot.t0 + u - shot.scene.t0, shot.i, u, line, u - shot.lineAt[line]);

    // a sheet of paper slides across whenever the scene changes
    const edge = SHOTS.find((s) => s.i === 0 && s.t0 > 0 && Math.abs(t - s.t0) < 0.22);
    if (edge) {
      const k = (t - edge.t0) / 0.22, x = k < 0 ? OW * -k : -OW * k;
      out.save(); out.shadowColor = "rgba(40,20,10,.6)"; out.shadowBlur = 40; out.fillStyle = "#f3e7c9"; out.fillRect(x - 40, 0, OW + 80, OH); out.restore();
    }
    out.globalCompositeOperation = "multiply";
    out.drawImage(grain, 0, 0, OW, OH);
    out.globalCompositeOperation = "source-over";
    const v = out.createRadialGradient(OW / 2, OH / 2, OH * 0.35, OW / 2, OH / 2, OH * 0.75);
    v.addColorStop(0, "#1a0d0600"); v.addColorStop(1, "#1a0d0677");
    out.fillStyle = v; out.fillRect(0, 0, OW, OH);

    let cap = "";
    for (const [from, html] of shot.caps) if (u >= from && u < shot.dur) cap = html;
    // a story whose loi.js sets `const SUBS = false` burns in no subtitles: it is also published in other languages
    capBox.innerHTML = window.SUBS === false ? "" : cap;
    cardBox.style.display = shot.label === "kết" ? "block" : "none";
  };

  const load = (name, ext) => new Promise((done, fail) => { const el = new Image(), src = `/${STORY}/anh/${name}.${ext}`; el.onload = () => done([name, el]); el.onerror = () => fail(new Error(`missing ${src}`)); el.src = src; });
  Promise.all([...plates.map((n) => load(n, "jpg")), ...cuts.map((n) => load(n, "png"))]).then((all) => {
    for (const [name, el] of all) L[name] = plates.includes(name) ? el : cutOut(el);
    window.renderAt(0);
    window.ready = true;
    if (location.search.includes("play")) { const began = performance.now(); const loop = () => { window.renderAt(((performance.now() - began) / 1000) % window.TOTAL); requestAnimationFrame(loop); }; loop(); }
  }, (e) => { window.failed = e.message; });
}
window.addEventListener("error", (e) => { window.failed = window.failed || e.message; });
