// The scenes of "Why the nozzle of a rocket engine does not burn" in the storybook paper-cut look of
// tien-su-hoat-hinh: torn landscapes and sheets of craft paper, the shuttle, the printer and the engineer as cut-outs
// the model made, and the engine and the rocket drawn by ve-co.js and ve-sls.js in the same look, part for part as the
// source video draws them, all glued on cream paper, yellow captions and cream paper labels. The source video explains
// with vector infographics; here each of them is a paper diagram drawn by code: the test stand, the flame, the
// thermometers, the cooled wall, the two ways that fail, the chamber's channels, the nozzle of tubes, the loop of
// regenerative cooling and the numbers of the test. The figures are the source video's, unchecked (loi.js).
// Layout: the apron of the test site is drawn at 1170 px (the launch mount of the last scene at 1370) and the floor
// of the factory at 1165, so the captions (1250 to 1415) fall on empty ground; everything a label names lies between
// 60 and 1230 px.
const PLATES = ["pl-ban-do", "pl-ban-phong", "pl-xuong", "pl-giay-xanh", "pl-giay-vang"];
const CUTS = ["pc-co", "pc-sls", "pc-tau", "pg-ky-su", "pc-may-in"];
// which way a generated piece faces as it is: 1 means it looks to the left (found by looking at each picture)
const LEFT = { "ky-su": 1, tau: 1 };
const F = (key, wantLeft) => (LEFT[key] ? !wantLeft : !!wantLeft);
const INK = "#1f1408", CYAN = "#3fc4e8", ORANGE = "#f08a3c", RED = "#e2542a", GOLD = "#f7a21b", YELLOW = "#f6c453";
const STEEL = "#aeb6c4", STEEL_DARK = "#8f98a8", CREAM = "#f6efd6";
const wrap = (v, m) => ((v % m) + m) % m;
// between two hex colours
const mix = (a, b, k) => { const p = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), q = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16)); return `rgb(${p.map((v, i) => Math.round(v + (q[i] - v) * k)).join(",")})`; };

// when the voice reaches a phrase of a shot: seconds into the shot, counted by letters as the engine times the captions
const CUT = Object.fromEntries((window.CUT || []).map((c) => [c.label, c]));
const said = (label, phrase) => {
  const line = CUT[label] && CUT[label].lines[0], at = line ? line.text.indexOf(phrase) : -1;
  if (at < 0) throw new Error(`said(): "${phrase}" is not in shot ${label}`);
  return (line.dur * at) / line.text.length;
};

// ---------- paper ----------
// a shape of paper: build() makes the path, which is filled and outlined like the layers of the look
function piece(build, fill, { line = 5, shadow = 1 } = {}) {
  out.save();
  if (shadow) { out.shadowColor = "rgba(40,20,10,.45)"; out.shadowBlur = 10; out.shadowOffsetY = 6; }
  out.beginPath(); build(); out.fillStyle = fill; out.fill();
  out.shadowColor = "transparent";
  if (line > 0) { out.lineWidth = line; out.lineJoin = "round"; out.strokeStyle = INK; out.stroke(); }
  out.restore();
}
// a rectangle of paper torn by hand, its edges wandering a little (k picks the pattern): a path for piece()
function torn(x0, y0, x1, y1, k, amp = 6, step = 34) {
  const jag = (v, e) => amp * (rnd(k, 211 + e * 100 + Math.round(v)) - 0.5);
  out.moveTo(x0, y0);
  for (let x = x0 + step; x < x1; x += step) out.lineTo(x, y0 + jag(x, 1));
  out.lineTo(x1, y0);
  for (let y = y0 + step; y < y1; y += step) out.lineTo(x1 + jag(y, 2), y);
  out.lineTo(x1, y1);
  for (let x = x1 - step; x > x0; x -= step) out.lineTo(x, y1 + jag(x, 3));
  out.lineTo(x0, y1);
  for (let y = y1 - step; y > y0; y -= step) out.lineTo(x0 + jag(y, 4), y);
  out.closePath();
}
// a ragged round hole; a path for piece()
const blob = (x, y, r, k, rough = 0.4, n = 14) => {
  for (let q = 0; q < n; q++) { const a = (q / n) * Math.PI * 2, rr = r * (1 + rough * (rnd(k * 13 + q, 501) - 0.5)); q ? out.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : out.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  out.closePath();
};
// a strip of paper between two points: its dark outline under a strip of colour, both with round ends
function stick(x0, y0, x1, y1, w, colour, line = 5) {
  const path = () => { out.beginPath(); out.moveTo(x0, y0); out.lineTo(x1, y1); };
  out.save(); out.lineCap = "round";
  if (line > 0) { out.shadowColor = "rgba(40,20,10,.45)"; out.shadowBlur = 10; out.shadowOffsetY = 6; path(); out.strokeStyle = INK; out.lineWidth = w + 2 * line; out.stroke(); out.shadowColor = "transparent"; }
  path(); out.strokeStyle = colour; out.lineWidth = w; out.stroke();
  out.restore();
}
// dashes of paper running along a straight pipe from (x0, y0) to (x1, y1): v is how far the flow has come, in pixels
function flow(x0, y0, x1, y1, colour, v, w = 12, alpha = 1) {
  if (alpha <= 0) return;
  const len = Math.hypot(x1 - x0, y1 - y0), a = Math.atan2(y1 - y0, x1 - x0), dx = Math.cos(a), dy = Math.sin(a);
  out.save(); out.globalAlpha = alpha; out.lineCap = "round";
  for (let d = wrap(v, 90) - 45; d < len; d += 90) {
    const sx = x0 + dx * d, sy = y0 + dy * d, ex = sx + dx * 46, ey = sy + dy * 46;
    out.beginPath(); out.moveTo(sx, sy); out.lineTo(ex, ey);
    out.strokeStyle = INK; out.lineWidth = w + 5; out.stroke();
    out.strokeStyle = colour; out.lineWidth = w; out.stroke();
  }
  out.restore();
}
// a pipe of paper bent through points [[x, y], ...]: a dark outline `w` wide under a strip of colour, and dashes like
// flow()'s running along the whole length of it (v in pixels; dash = how wide and long they are, as a share of the pipe's
// width)
function pipe(points, colour, v, w, dash = 0.45) {
  const seg = []; let total = 0;
  for (let j = 1; j < points.length; j++) { seg.push(Math.hypot(points[j][0] - points[j - 1][0], points[j][1] - points[j - 1][1])); total += seg[j - 1]; }
  // the point `d` pixels along the pipe
  const at = (d) => { let j = 0; while (j < seg.length - 1 && d > seg[j]) d -= seg[j++]; const k = Math.min(1, Math.max(0, d / seg[j])); return [points[j][0] + (points[j + 1][0] - points[j][0]) * k, points[j][1] + (points[j + 1][1] - points[j][1]) * k]; };
  out.save(); out.lineCap = "round"; out.lineJoin = "round";
  out.beginPath(); points.forEach(([x, y], j) => (j ? out.lineTo(x, y) : out.moveTo(x, y)));
  out.strokeStyle = INK; out.lineWidth = w + 5; out.stroke(); out.strokeStyle = colour; out.lineWidth = w; out.stroke();
  // each dash is a short polyline, so it bends with the pipe
  const len = 46 * (0.5 + dash / 0.9);
  for (let d = wrap(v, 90) - 45; d < total; d += 90) {
    out.beginPath(); out.moveTo(...at(d));
    for (let e = d + 6; e < d + len; e += 6) out.lineTo(...at(e));
    out.lineTo(...at(d + len));
    out.strokeStyle = INK; out.lineWidth = w * dash + 5; out.stroke(); out.strokeStyle = "#fbf6ea"; out.lineWidth = w * dash; out.stroke();
  }
  out.restore();
}
// a paper arrow from (x0, y0) to (x1, y1): a stick with a triangular head; k scales the head
function arrow(x0, y0, x1, y1, colour, w = 14, k = 1) {
  if (k <= 0) return;
  const a = Math.atan2(y1 - y0, x1 - x0), head = w * 2.4;
  stick(x0, y0, x1 - Math.cos(a) * head * 0.7, y1 - Math.sin(a) * head * 0.7, w, colour);
  out.save(); out.translate(x1, y1); out.rotate(a); out.scale(k, k);
  piece(() => { out.moveTo(0, 0); out.lineTo(-head, -head * 0.62); out.lineTo(-head, head * 0.62); out.closePath(); }, colour);
  out.restore();
}
const text = (str, x, y, size, colour = INK, align = "left", weight = 800) => {
  out.save(); out.font = `${weight} ${size}px ${TYPE()}`; out.letterSpacing = `${size * 0.04}px`; out.fillStyle = colour; out.textAlign = align; out.textBaseline = "middle"; out.fillText(str, x, y); out.restore();
};
// a label with a colour of its own: red for a warning, green for an answer, yellow (with dark text) for a number; k = pop()
function badge(text_, x, y, k = 1, colour = RED, size = 42, ink = "#fbf6ea") {
  if (k <= 0) return;
  out.save(); out.translate(x, y); out.scale(k, k);
  out.font = `800 ${size}px ${TYPE()}`; out.letterSpacing = `${size * 0.06}px`;
  const w = out.measureText(text_).width + size * 1.2, h = size * 1.7;
  out.shadowColor = "rgba(40,20,10,.5)"; out.shadowBlur = 14; out.shadowOffsetY = 8;
  out.fillStyle = "#14141a"; out.beginPath(); out.roundRect(-w / 2 + 4, -h / 2 + 6, w, h, 18); out.fill();
  out.fillStyle = colour; out.beginPath(); out.roundRect(-w / 2, -h / 2, w, h, 18); out.fill();
  out.shadowColor = "transparent"; out.lineWidth = 4; out.strokeStyle = "#14141a"; out.stroke();
  out.fillStyle = ink; out.textAlign = "center"; out.textBaseline = "middle"; out.fillText(text_, 0, 3);
  out.restore();
}
// a bar of paper: a pale track `full` px long filled to the share k
function bar(x, y, full, k, colour) {
  piece(() => out.roundRect(x, y, full, 28, 8), "#e2d8bf", { line: 4, shadow: 0 });
  if (k > 0) piece(() => out.roundRect(x, y, Math.max(28, full * k), 28, 8), colour, { line: 4, shadow: 0 });
}
// a paper thermometer standing on (x, y): a cream tube h tall on a bulb, filled to the share k (from the top when
// down is set, for cold) in `colour`, with a tick every tenth
function gauge(x, y, h, k, colour = RED, down = 0) {
  const w = 54, r = 42, top = y - h;
  piece(() => out.roundRect(x - w / 2, top, w, h, w / 2), "#fbf6ea");
  piece(() => out.arc(x, y + 6, r, 0, 7), colour);
  out.save(); out.strokeStyle = "#bdb49f"; out.lineWidth = 3;
  for (let j = 1; j < 10; j++) { out.beginPath(); out.moveTo(x + w / 2 - 5, top + (h * j) / 10); out.lineTo(x + w / 2 - 18, top + (h * j) / 10); out.stroke(); }
  out.restore();
  if (k > 0) piece(() => out.roundRect(x - w * 0.29, down ? top + 5 : y - h * k, w * 0.58, h * k, w * 0.29), colour, { line: 0, shadow: 0 });
}
// a pile of banknotes growing at (x, y), one more every 0.14 s from `at`
function money(x, y, ts, at, n) {
  for (let i = 0; i < n; i++) {
    const kp = pop(at + i * 0.14, ts, 0.3);
    if (kp <= 0) continue;
    out.save(); out.translate(x + 26 * (rnd(i, 251) - 0.5), y - i * 22 - 16); out.rotate((rnd(i, 252) - 0.5) * 0.2); out.scale(kp, kp);
    piece(() => out.roundRect(-88, -16, 176, 32, 8), i % 2 ? "#7cb37a" : "#95c48e", { line: 4 });
    out.fillStyle = "#4f8f5b"; out.beginPath(); out.ellipse(0, 0, 14, 10, 0, 0, 7); out.fill();
    out.restore();
  }
}
// a paper moon: a cream disc with pale craters
function moon(x, y, r) {
  piece(() => out.arc(x, y, r, 0, 7), "#fbf3df");
  out.fillStyle = "#e6dcc0";
  [[-0.3, -0.2, 0.2], [0.25, 0.3, 0.14], [0.1, -0.42, 0.1]].forEach(([dx, dy, dr]) => { out.beginPath(); out.arc(x + dx * r, y + dy * r, dr * r, 0, 7); out.fill(); });
}

// ---------- fire, steam, cold ----------
// a flame of three papers (red, orange, cream) hanging from (x, y), fw wide and about fh long, flickering and
// swaying; k scales it (how far it has come out of a nozzle). Draw it before what it comes out of
function flame(x, y, fw, fh, t, k = 1, alpha = 1) {
  if (k <= 0 || alpha <= 0) return;
  const sway = fw * 0.07 * Math.sin(t * 9), sway2 = fw * 0.05 * Math.sin(t * 13 + 1);
  out.save(); out.translate(x, y); out.scale(k, k); out.globalAlpha = alpha;
  [[1, RED], [0.74, ORANGE], [0.44, "#fff0a8"]].forEach(([s, colour], j) => {
    const w = fw * s, h = fh * (j ? 0.6 + 0.3 * (1 - s) : 1) * (1 + 0.1 * Math.sin(t * (19 + j * 6) + j * 2)), sw = (j ? sway2 : sway) * s;
    out.save();
    if (!j) { out.shadowColor = "rgba(40,20,10,.45)"; out.shadowBlur = 10; out.shadowOffsetY = 6; }
    out.beginPath(); out.moveTo(-w / 2, 0);
    out.bezierCurveTo(-w * 0.62, h * 0.45, sw - w * 0.14, h * 0.8, sw, h);
    out.bezierCurveTo(sw + w * 0.14, h * 0.8, w * 0.62, h * 0.45, w / 2, 0);
    out.quadraticCurveTo(0, w * 0.27, -w / 2, 0);
    out.fillStyle = colour; out.fill();
    if (!j) { out.shadowColor = "transparent"; out.lineWidth = 5; out.lineJoin = "round"; out.strokeStyle = INK; out.stroke(); }
    out.restore();
  });
  out.restore();
}
// one tongue of paper flame: narrow at the root, bulging low, leaning the way it blows, with a yellow tongue inside
function tongue(x, base, b, len, lean, colour, line) {
  piece(() => {
    out.moveTo(x - b, base);
    out.bezierCurveTo(x - b * 1.6, base - len * 0.3, x + lean * 0.2 - b * 0.5, base - len * 0.62, x + lean, base - len);
    out.bezierCurveTo(x + lean * 0.2 + b * 0.5, base - len * 0.62, x + b * 1.6, base - len * 0.3, x + b, base);
    out.closePath();
  }, colour, { line });
}
// a row of them standing on the line y = base and pointing up
function tongues(x0, n, dx, base, h, t) {
  for (let i = 0; i < n; i++) {
    const x = x0 + i * dx, len = h * (0.6 + 0.5 * rnd(i, 221)), lean = (10 + 6 * rnd(i, 222)) * Math.sin(t * 5 + i * 1.7) + 14 * (rnd(i, 223) - 0.5);
    tongue(x, base, dx * 0.3, len, lean, i % 2 ? ORANGE : RED, 4);
    tongue(x, base, dx * 0.16, len * 0.55, lean * 0.6, YELLOW, 0);
  }
}
// the warm light of a flame on what is around it
function glow(x, y, r, a, t) {
  if (a <= 0) return;
  out.save(); out.globalCompositeOperation = "screen";
  const g = out.createRadialGradient(x, y, 0, x, y, r * (1 + 0.05 * Math.sin(t * 17)));
  g.addColorStop(0, `rgba(255,170,60,${0.75 * a})`); g.addColorStop(1, "rgba(255,120,30,0)");
  out.fillStyle = g; out.fillRect(x - r * 1.1, y - r * 1.1, r * 2.2, r * 2.2);
  out.restore();
}
// steam rising from (x, y): outlined blobs of pale paper that grow, drift up `rise` px and fade away before they have
// come all the way up; k = share, seed tells two columns apart
function puffs(x, y, t, k = 1, n = 7, rise = 430, seed = 0) {
  if (k <= 0) return;
  for (let i = 0; i < n; i++) {
    const p = wrap(t * 0.42 + rnd(i + seed, 301), 1), r = (28 + 34 * rnd(i + seed, 302)) * (0.6 + p);
    out.save(); out.globalAlpha = 0.92 * (1 - p) * (1 - sm(0.5, 0.85, p)) * sm(0, 0.12, p) * k;
    out.translate(x + (rnd(i + seed, 303) - 0.5) * 170 + 40 * Math.sin(t * 1.3 + i + seed), y - 40 - rise * p); out.scale(1, 0.82);
    piece(() => out.arc(0, 0, r, 0, 7), "#f1ece2", { line: 4, shadow: 0 });
    out.restore();
  }
}
// cold air over the points [[x, y], ...] (page px): discs of pale blue paper of about r that breathe, each swelling and
// brightening on its own beat and drifting up a little, like the haze the source draws over its cold pipe; k = share
function frost(pts, r, t, k = 1) {
  if (k <= 0) return;
  pts.forEach(([x, y], i) => {
    const p = 0.5 + 0.5 * Math.sin(t * (0.9 + 0.6 * rnd(i, 281)) + rnd(i, 280) * 7), rr = r * (0.7 + 0.5 * rnd(i, 282)) * (0.9 + 0.2 * p);
    out.save(); out.globalAlpha = (0.15 + 0.22 * p) * k;
    out.translate(x + (rnd(i, 283) - 0.5) * r, y - 8 - 16 * p + (rnd(i, 284) - 0.5) * r * 0.7);
    out.beginPath(); out.arc(0, 0, rr, 0, 7); out.fillStyle = "#eaf6fb"; out.fill();
    out.lineWidth = 2.5; out.strokeStyle = "#bfe3ee"; out.stroke();
    out.restore();
  });
}

// ---------- the engine, the plates, the stand ----------
// where the parts of the engine are in its picture, as shares of its box from its top left. The picture is drawn by
// ve-co.js from the source video, and these are its numbers read back through the page: a short knob (0 to 0.036) on
// a wide rounded head (0.036 to 0.224, between x 0.30 and 0.68) with a short ribbed pump on each side of its upper
// part (down to 0.25), the gold chamber under the head (to 0.355), a dark collar, and the bell from the throat (0.369),
// where it is r0 of the width wide, to the tips of its rim (corner), r1 wide, the dark opening lowest at bottom. head
// is where the rod of the stand ends inside the head; chamber the middle of the chamber; coat where the brown coating
// of shot 5 begins. The bell opens fast under the collar and then more slowly: BELL is how far it has opened (0 to 1)
// at shares of the way from the throat to the corner
const ENG = { cx: 0.5, throat: 0.369, corner: 0.971, bottom: 0.992, r0: 0.121, r1: 0.488, head: 0.13, chamber: 0.29, coat: 0.4 };
const BELL = [[0, 0], [0.015, 0.04], [0.027, 0.086], [0.065, 0.166], [0.102, 0.237], [0.152, 0.326], [0.203, 0.403], [0.24, 0.455], [0.278, 0.502], [0.353, 0.591], [0.478, 0.72], [0.591, 0.803], [0.729, 0.892], [0.816, 0.938], [0.891, 0.966], [0.942, 0.985], [1, 1]];
// a point of the engine drawn `w` wide with its bottom centre at (x, y); fx and fy are shares of its box
const on = (x, y, w, fx, fy) => [x + (fx - 0.5) * w, y - (1 - fy) * tall("pc-co", w)];
// a point of the engine given in pixels of the source frame ve-co.js measured it in (the axis of the bell at x 290,
// the top of the knob at y 26): for the engine drawn `w` wide with the bottom of its box at (x, y)
const srcPt = (x, y, w, sx, sy) => on(x, y, w, ENG.cx + (sx - 290) * 0.00226, 0.003 + (sy - 26) * 0.001261);
// half the bell's width, as a share of the engine's width, at the share fy of its height (constant below the throat
// and beyond the tips of the rim)
const bellR = (w, fy) => {
  const v = Math.max(0, Math.min(1, (fy - ENG.throat) / (ENG.corner - ENG.throat)));
  let k = 1;
  while (BELL[k][0] < v) k++;
  const g = BELL[k - 1][1] + (BELL[k][1] - BELL[k - 1][1]) * ((v - BELL[k - 1][0]) / (BELL[k][0] - BELL[k - 1][0]));
  return (ENG.r0 + (ENG.r1 - ENG.r0) * g) * w;
};
// the y of the middle of the bell of an engine whose box ends at y
const bellMid = (y, w) => y - (1 - 0.68) * tall("pc-co", w);
// the engine hung with the bottom of its box at (x, y), `w` wide, with a flame under it as long as len shares of w,
// counted from the rim of the bell (0.15 hides inside the bell), about three quarters as wide as the box. The flame
// hangs from inside the dark opening of the nozzle, and the bell hides its top, so it is drawn first. Returns the x
// of the bell's axis
function engine(x, y, w, len = 0, ts = 0) {
  const cx = x + (ENG.cx - 0.5) * w;
  if (len > 0.15) flame(cx, y - 0.06 * w, 0.74 * w, (len - 0.15) * w, ts);
  P("pc-co", x, y, w);
  return cx;
}
// the rocket (ve-sls.js) is drawn in core widths: S the canvas pixels of one core width in its picture, and line and
// pad the outline under its four bells and the white margin the page mounts round the cut-out, in canvas pixels. The
// page mounts a cut-out by its box, which ends half an outline and one margin below the bells
const SLS = { S: 245, line: 3.6, pad: 14 };
// the rocket with its axis at x and the bottom of its four bells at yb, its core stage cw wide
function rocket(x, yb, cw) {
  const k = cw / SLS.S;
  P("pc-sls", x, yb + (SLS.pad + SLS.line / 2) * k, L["pc-sls"].w * k);
}
const WASH = {};
// a cut-out washed over with a colour that changes along its height (soot on a burnt engine, a coating on a bell):
// stops are [share of the height from the top, colour]. The result is a canvas the size of the cut-out
function washCanvas(name, stops) {
  const l = L[name], key = name + stops.map((s) => s.join("")).join("|");
  if (!WASH[key]) {
    const c = Object.assign(document.createElement("canvas"), { width: l.w, height: l.h }), g = c.getContext("2d");
    g.drawImage(l.c, l.x0, l.y0, l.w, l.h, 0, 0, l.w, l.h);
    g.globalCompositeOperation = "source-atop";
    const grad = g.createLinearGradient(0, 0, 0, l.h);
    stops.forEach(([p, colour]) => grad.addColorStop(p, colour));
    g.fillStyle = grad; g.fillRect(0, 0, l.w, l.h);
    WASH[key] = c;
  }
  return WASH[key];
}
// the washed cut-out drawn like P() draws the layer, with a share of alpha and clipped to a path when clip is given
function washed(name, stops, x, y, w, { alpha = 1, clip } = {}) {
  if (alpha <= 0) return;
  const l = L[name], s = w / l.w;
  out.save(); out.globalAlpha = alpha;
  if (clip) { out.beginPath(); clip(); out.clip(); }
  out.drawImage(washCanvas(name, stops), x - (l.w * s) / 2, y - l.h * s, l.w * s, l.h * s);
  out.restore();
}
// a plate drawn so that the row `row` of the picture (a share of its height: the apron's edge, the middle of a page)
// sits at y: centred as plate() does, the aprons would lie under the captions. The picture is at least 1.12 times
// the width of the frame (a page comes back from the model with a pale border) and creeps in by `push` over `total`
function back(name, t, total, row, y, push = 0.04) {
  const img = L[name], s = Math.max((OW / img.width) * 1.12, (OH - y) / (img.height * (1 - row))) * (1 + push * sm(0, total, t));
  out.drawImage(img, (OW - img.width * s) / 2, y - img.height * row * s, img.width * s, img.height * s);
}
const page = (name, t, total) => back(name, t, total, 0.5, 960);
// the lattice of the test stand: paper strips two bays wide from `top` down to `base`. front 0 draws the braces that
// stand behind the engine, front 1 the three rails in front of it with a grey deck on top
function lattice(x, top, base, w, front, colour = "#e2622b", light = ORANGE) {
  const rows = Math.max(3, Math.round((base - top) / 170)), rh = (base - top) / rows, xs = [x - w / 2, x, x + w / 2];
  if (!front) {
    for (let r = 0; r <= rows; r++) {
      stick(xs[0], base - r * rh, xs[2], base - r * rh, 10, colour);
      if (r < rows) for (let c = 0; c < 2; c++) { stick(xs[c], base - r * rh, xs[c + 1], base - (r + 1) * rh, 8, light); stick(xs[c + 1], base - r * rh, xs[c], base - (r + 1) * rh, 8, light); }
    }
  } else {
    xs.forEach((lx) => stick(lx, base, lx, top, 20, colour));
    stick(xs[0] - 46, top, xs[2] + 46, top, 26, "#8d94a3");
  }
}
// the test stand at dusk on its apron. len is the flame's length as a share of the engine's width, ignite the second
// it was lit (the stand trembles for half a second), zoom = [x, y, k] a camera pushed in on the nozzle, steam the
// share of the steam at the foot of the stand. Returns where the engine hangs: the x of its axis and the exit's y
function stand(ts, total, { len = 0.95, ignite = -9, top = 250, w = 300, hook = 1, zoom = [540, 960, 1], steam = 0 } = {}) {
  back("pl-ban-do", ts, total, 0.705, 1170);
  const base = 1206, exit = base - 236, j = ts >= ignite ? Math.max(0, 1 - (ts - ignite) / 0.6) : 0, cx = 540 + (ENG.cx - 0.5) * w;
  out.save();
  out.translate(zoom[0], zoom[1]); out.scale(zoom[2], zoom[2]); out.translate(-zoom[0] + j * 6 * Math.sin(ts * 61), -zoom[1] + j * 5 * Math.cos(ts * 53));
  lattice(540, top, base, 440, 0);
  if (hook) stick(cx, top + 8, cx, exit - (1 - ENG.head) * tall("pc-co", w), 7, "#3b3f4a");
  lattice(540, top, base, 440, 1);
  if (len > 0) glow(cx, exit + 150, 420, 0.6, ts);
  engine(540, exit, w, len, ts);
  // the steam rises in two columns beside the flame, inside the legs of the stand, so it hides neither the flame nor
  // the nozzle the story is about
  if (steam > 0) { puffs(cx - 165, base, ts, steam, 5, 240, 11); puffs(cx + 165, base, ts, steam, 5, 240, 23); }
  out.restore();
  return { x: cx, exit, base, top };
}
// fuel going round a loop: dashes of paper running clockwise along an ellipse, cyan down the right side and yellow
// up the left (all cyan when `one` is set), with an arrowhead every quarter; alpha = share
function loop(cx, cy, rx, ry, t, alpha = 1, one = 0) {
  if (alpha <= 0) return;
  const pt = (q) => [cx + rx * Math.cos(q), cy + ry * Math.sin(q)];
  out.save(); out.globalAlpha = alpha; out.lineCap = "round";
  for (let j = 0; j < 44; j++) {
    const a = -Math.PI / 2 + wrap(t * 0.3 + j / 44, 1) * Math.PI * 2, b = a + 0.085;
    out.beginPath(); out.moveTo(...pt(a)); for (let s = 1; s <= 4; s++) out.lineTo(...pt(a + ((b - a) * s) / 4));
    out.strokeStyle = INK; out.lineWidth = 19; out.stroke();
    out.strokeStyle = one || Math.cos(a) > 0 ? CYAN : YELLOW; out.lineWidth = 13; out.stroke();
  }
  for (let q = 0; q < 4; q++) {
    const a = q * (Math.PI / 2), [x, y] = pt(a);
    out.translate(x, y); out.rotate(a + Math.PI / 2); out.translate(-x, -y);
    piece(() => { out.moveTo(x + 26, y); out.lineTo(x - 14, y - 22); out.lineTo(x - 14, y + 22); out.closePath(); }, one || Math.cos(a) > 0 ? CYAN : YELLOW, { line: 4 });
    out.setTransform(1, 0, 0, 1, 0, 0); out.globalAlpha = alpha;
  }
  out.restore();
}

const SCENES = [
  // the hook: the stand firing at dusk, a thermometer racing to 3.300 °C, and the nozzle ringed: it does not burn
  { shots: ["hook"], draw(ts) {
    const tV = said("hook", "vòi phun"), tK = said("hook", "không cháy"), tN = said("hook", "3.300");
    const s = stand(ts, 4.7, { len: 0.95 * sm(0, 0.5, ts), steam: sm(0.2, 1.0, ts) });
    gauge(140, 900, 460, sm(tN - 1.3, tN + 0.7, ts), RED);
    chip("3.300°C", 160, 360, pop(tN - 0.05, ts), { size: 40 });
    ring(s.x, bellMid(s.exit, 300), 158, sm(tK, tK + 0.45, ts));
    chip("VÒI PHUN", 900, 740, pop(tV, ts), { size: 44 });
  } },
  // less than a centimetre from the fire: the wall of a nozzle from the side, a cold flow running in it
  { shots: ["1"], cut: "iris", iris: [552, 970], draw(ts) {
    page("pl-giay-xanh", ts, 4.9);
    const tC = said("1", "một xentimét"), tD = said("1", "dòng lạnh hơn");
    piece(() => torn(40, 250, 1040, 470, 1), "#b7bfcc");
    stick(40, 312, 1040, 312, 5, STEEL_DARK, 0); stick(40, 378, 1040, 378, 5, STEEL_DARK, 0);
    piece(() => torn(40, 470, 1040, 606, 2, 4), CYAN);
    flow(40, 538, 1040, 538, "#fbf6ea", -ts * 260, 13);
    piece(() => torn(40, 606, 1040, 648, 3, 4), ORANGE);
    piece(() => torn(40, 700, 1040, 1215, 4, 8), GOLD);
    tongues(86, 11, 92, 712, 54, ts);
    // the ruler: from the cooling channel down to the tip of the fire
    const kr = pop(tC - 0.15, ts);
    if (kr > 0) {
      out.save(); out.translate(540, 566); out.scale(kr, kr);
      piece(() => out.rect(-14, -96, 28, 192), YELLOW, { line: 4 });
      out.strokeStyle = INK; out.lineWidth = 3;
      for (let j = -4; j <= 4; j++) { out.beginPath(); out.moveTo(-14, j * 21); out.lineTo(j % 2 ? -4 : 4, j * 21); out.stroke(); }
      out.restore();
    }
    chip("THÉP", 180, 360, pop(0.25, ts), { size: 40 });
    chip("DÒNG LẠNH", 300, 538, pop(tD, ts), { size: 40 });
    chip("< 1 cm", 800, 566, pop(tC + 0.1, ts), { size: 40 });
  } },
  // the RS-25 and the four of them under the foot of an SLS, as the source shows this sentence: the rocket comes down
  // from above and stops with its four engines large in the upper half, its top out of the frame, and a line points from
  // the engines of the rocket down to the name the engine was given above
  { shots: ["2"], cut: "sheet", draw(ts) {
    page("pl-giay-xanh", ts, 5.2);
    const tS = said("2", "SLS"), t4 = said("2", "bốn chiếc"), k = sm(tS + 0.1, tS + 1.0, ts);
    moon(945, 212, 64); sparkles(540, 330, 520, ts, 9);
    const yb = -80 + 780 * sm(tS - 0.25, tS + 0.75, ts);
    if (yb > -40) rocket(540, yb, 320);
    // the engine comes down into the left of the row, and each of the four is ringed round its bell as it is counted
    engine(540 - 294 * k, 1000 + 180 * k, 420 - 244 * k);
    for (let j = 1; j < 4; j++) {
      const x = 246 + 196 * j, at = t4 - 1.3 + j * 0.3, kp = Math.max(0.001, pop(at, ts, 0.35));
      engine(x, 1180, 176 * kp);
      ring(x, bellMid(1180, 176), 86, sm(at + 0.25, at + 0.6, ts));
    }
    ring(540 - 294 * k, bellMid(1000 + 180 * k, 420 - 244 * k), 0.39 * (420 - 244 * k) + 38 - 18 * k, sm(tS + 1.0, tS + 1.4, ts));
    // the line of the label, as the source draws it from the four engines down to their name; the label itself was
    // above the one engine and comes back under the rocket, where it names the four of the row too
    const kl = sm(0.55, 0.85, k), la = k < 0.5 ? 1 - sm(0.15, 0.45, k) : kl;
    if (kl > 0) { out.save(); out.globalAlpha = kl; stick(540, 706, 540, 770, 5, CREAM, 3); piece(() => out.arc(540, 704, 10, 0, 7), YELLOW, { line: 3 }); out.restore(); }
    if (la > 0) { out.save(); out.globalAlpha = la; chip("RS-25", 540, k < 0.5 ? 190 : 812, pop(0.3, ts), { size: 50 }); out.restore(); }
    chip("SLS", 540, 300, pop(tS + 0.8, ts), { size: 46 });
  } },
  // steel melts near 1.400 °C; this fire is far past that
  { shots: ["3"], cut: "band", draw(ts) {
    page("pl-giay-xanh", ts, 5.1);
    const tS = said("3", "1.400"), tF = said("3", "lửa này"), tH = said("3", "gần hai nghìn");
    glow(540, 880, 470, 0.5, ts);
    engine(540, 776, 340, 0.6, ts);
    gauge(150, 900, 440, (1400 / 3300) * sm(tS - 0.5, tS + 0.7, ts), STEEL_DARK);
    gauge(930, 900, 440, sm(tF - 0.1, tF + 1.1, ts), RED);
    chip("THÉP", 150, 425, pop(0.2, ts), { size: 40 }); chip("1.400°C", 150, 350, pop(tS + 0.6, ts), { size: 40 });
    chip("LỬA", 930, 425, pop(0.2, ts), { size: 40 }); chip("3.300°C", 930, 350, pop(tF + 1.0, ts), { size: 40 });
    badge("QUÁ NÓNG", 540, 1090, pop(tH + 0.4, ts), RED, 46);
  } },
  // left in the fire, the nozzle would sag like wax: the bell fills the frame, glows from its rim and drips
  { shots: ["4"], cut: "iris", iris: [537, 640], draw(ts) {
    page("pl-giay-xanh", ts, 4.5);
    const t = said("4", "nhũn ra"), heat = sm(t - 1.3, t + 0.6, ts), sag = 60 * sm(t - 0.2, t + 1.5, ts);
    const l = L["pc-co"], w = 880, s = w / l.w, cx = 540 + (ENG.cx - 0.5) * w, y = 1160, top = y - l.h * s, N = 40, dh = l.h / N;
    const hot = washCanvas("pc-co", [[ENG.throat, "rgba(226,60,30,0)"], [ENG.corner - 0.02, "rgba(240,110,40,.55)"], [1, "rgba(255,120,40,.9)"]]);
    // how far down the bell a strip lies: 0 at the throat and 1 at the bottom of the box
    const share = (q) => Math.max(0, q / N - (ENG.throat - 0.02)) / (1 - ENG.throat + 0.02);
    glow(cx, y + 40, 560, 0.7 * heat, ts);
    // the bell in N strips that hang lower and bulge wider toward the rim, the body of the engine staying put;
    // strip q is drawn between the whole-pixel lines edge(q) and edge(q + 1), so the strips neither gap nor overlap
    const edge = (q) => Math.round(top + q * dh * s + sag * share(q) ** 2);
    for (let pass = 0; pass < 2; pass++) {
      if (pass && heat <= 0) break;
      out.save(); if (pass) out.globalAlpha = heat;
      for (let q = 0; q < N; q++) {
        const g = 1 + 0.05 * share(q + 1) * (sag / 60), ya = edge(q), yb = edge(q + 1), wd = Math.round(l.w * s * g);
        out.drawImage(pass ? hot : l.c, pass ? 0 : l.x0, (pass ? 0 : l.y0) + q * dh, l.w, dh, Math.round(cx - wd / 2), ya, wd, yb - ya);
      }
      out.restore();
    }
    glow(cx, y, 420, 0.35 * heat, ts);
    // drops of melting steel hanging from the arc of the rim, growing for a moment, then letting go; none reaches the captions
    for (let i = 0; i < 7; i++) {
      const d = (rnd(i, 261) - 0.5) * 1.7, fy = ENG.corner + (ENG.bottom - ENG.corner) * (1 - d * d), g = 1 + 0.05 * share(fy * N) * (sag / 60);
      const dx = cx + d * ENG.r1 * w * g, age = ts - (t + 0.2 + 1.5 * rnd(i, 262));
      if (age <= 0) continue;
      const r = (22 + 12 * rnd(i, 263)) * Math.min(1, age / 1.1), fall = Math.max(0, age - 1.1), rim = top + fy * l.h * s + sag * share(fy * N) ** 2 - 8;
      out.save(); out.globalAlpha = 1 - sm(0, 0.35, fall); out.translate(dx, rim + 1.1 * r + 120 * fall * fall);
      piece(() => { out.moveTo(0, -r * 1.1); out.bezierCurveTo(r * 0.3, -r * 0.8, r, -r * 0.5, r, 0); out.arc(0, 0, r, 0, Math.PI); out.bezierCurveTo(-r, -r * 0.5, -r * 0.3, -r * 0.8, 0, -r * 1.1); out.closePath(); }, ORANGE, { line: 4 });
      out.restore();
    }
    // the label sits over the lower half of the chamber, clear of the collar and of the bell that sags
    chip(["NHŨN RA", "NHƯ SÁP"], 540, 44, pop(t - 0.1, ts), { size: 50 });
  } },
  // the first way: a coating that burns away and carries the heat off in patches
  { shots: ["5"], cut: "band", draw(ts) {
    page("pl-giay-xanh", ts, 4.5);
    const t = said("5", "tự cháy mòn"), peel = Math.max(0, Math.min(1, (ts - t + 0.1) / 2.8));
    const w = 560, x = 540, y = 1190, h = tall("pc-co", w), coatTop = y - (1 - ENG.coat) * h;
    P("pc-co", x, y, w);
    // brown paper glued over the lower bell, torn away from the rim upward: what is left of it is clipped
    if (peel < 0.999) washed("pc-co", [[ENG.coat, "rgba(122,74,34,0)"], [ENG.coat + 0.004, "rgba(122,74,34,.88)"], [1, "rgba(102,58,24,.94)"]], x, y, w, { clip: () => torn(x - 720, coatTop, x + 720, y - peel * (y - coatTop) + 6, 9, 12, 44) });
    // flakes of it flying off both edges of the bell as the tear passes them, each with a lick of red heat behind it
    for (let i = 0; i < 18; i++) {
      const fy = ENG.coat + 0.02 + (ENG.corner - ENG.coat - 0.04) * rnd(i, 231), side = i % 2 ? 1 : -1;
      const age = ts - (t - 0.1 + 2.8 * (1 - (fy - ENG.coat) / (ENG.corner - ENG.coat)));
      if (age <= 0 || age > 1.8) continue;
      const [sx, sy] = on(x, y, w, ENG.cx + (side * bellR(w, fy)) / w, fy), r = 14 + 16 * rnd(i, 232);
      out.save(); out.globalAlpha = 1 - age / 1.8;
      out.translate(sx + side * (230 + 170 * rnd(i, 233)) * age, sy - (140 + 220 * rnd(i, 234)) * age + 330 * age * age);
      out.save(); out.globalAlpha = (1 - age / 1.8) * (1 - age / 0.9); stick(0, 0, -side * 80 * (1 - age), 50 * (1 - age), 11, ORANGE, 3); out.restore();
      out.rotate(side * age * (3 + 4 * rnd(i, 235)));
      piece(() => { out.moveTo(-r, r * 0.5); out.lineTo(r, r * 0.2); out.lineTo(r * 0.1, -r); out.closePath(); }, i % 2 ? "#7a4a22" : "#8f5a2c", { line: 3 });
      out.restore();
    }
    // the labels sit above the engine, which is tall with its head and pumps now
    chip("CÁCH THỨ NHẤT", 540, 62, pop(0.12, ts), { size: 46 });
    chip("LỚP TỰ CHÁY MÒN", 540, 138, pop(t - 0.15, ts), { size: 46 });
  } },
  // but worn out means thrown away, while a shuttle has to fly again and again
  { shots: ["6"], cut: "sheet", draw(ts) {
    page("pl-giay-xanh", ts, 4.4);
    const tB = said("6", "mòn hết là bỏ"), tT = said("6", "tàu con thoi"), sw = 420, sh = L["pc-tau"];
    P("pc-co", 300, 1130, 470);
    washed("pc-co", [[ENG.throat, "rgba(40,30,28,0)"], [ENG.throat + 0.08, "rgba(40,30,28,.75)"], [1, "rgba(28,22,22,.92)"]], 300, 1130, 470);
    // the shuttle crosses the sky from right to left, again and again, a flame at its tail
    if (ts > tT - 0.6) {
      const x = 1400 - wrap((ts - tT + 0.5) / 2.6, 1) * 1900, [tx, ty] = [x + 0.45 * sw, 250 - 0.2 * tall("pc-tau", sw)];
      out.save(); out.translate(tx, ty); out.rotate(-Math.PI / 2); flame(0, 0, 64, 150, ts); out.restore();
      P("pc-tau", x, 250, sw);
    }
    const kx = pop(tB, ts, 0.35);
    if (kx > 0) { out.save(); out.translate(300, 830); out.scale(kx, kx); stick(-150, -150, 150, 150, 30, RED); stick(150, -150, -150, 150, 30, RED); out.restore(); }
    badge("DÙNG MỘT LẦN", 800, 620, pop(tB + 0.3, ts), RED, 42);
  } },
  // the second way (shots 7 and 8): a thick casting that soaks up the heat, until it cannot hold any more
  { shots: ["7", "8"], cut: "band", draw(ts, i, u) {
    page("pl-giay-xanh", ts, 8.1);
    const t8 = i ? ts - u : 99, tD = said("7", "đúc thật dày"), tH = said("7", "hút nhiệt"), tS = t8 + said("8", "chỉ trữ nhiệt"), tK = t8 + said("8", "không trụ");
    const lab = 1 - sm(t8 - 0.05, t8 + 0.3, ts), shake = sm(tK - 0.5, tK + 0.1, ts) * (1 - sm(tK + 1.2, tK + 1.8, ts));
    piece(() => torn(60, 880, 1020, 1215, 5, 8), GOLD);
    tongues(112, 10, 96, 892, 100, ts);
    out.save(); out.translate(shake * 5 * Math.sin(ts * 57), shake * 4 * Math.cos(ts * 49));
    piece(() => torn(110, 330, 970, 770, 6), STEEL);
    stick(110, 550, 970, 550, 5, STEEL_DARK, 0);
    // the heat it soaks up, rising through the steel from the fire
    const heat = i ? 0.34 + 0.66 * sm(tS, tK + 0.5, ts) : 0.34 * sm(tH - 0.4, t8, ts);
    if (heat > 0) {
      out.save(); out.beginPath(); torn(110, 330, 970, 770, 6); out.clip();
      const g = out.createLinearGradient(0, 770, 0, 770 - 440 * heat);
      g.addColorStop(0, "rgba(226,60,30,.92)"); g.addColorStop(0.7, "rgba(226,60,30,.5)"); g.addColorStop(1, "rgba(226,60,30,0)");
      out.fillStyle = g; out.fillRect(100, 320, 880, 460);
      out.restore();
    }
    // shot 7: the metal draws the heat in
    const ka = sm(tH - 0.2, tH + 0.3, ts) * lab;
    [330, 540, 750].forEach((x, j) => arrow(x, 985, x, 800, RED, 14, ka * (0.85 + 0.15 * Math.sin(ts * 5 + j))));
    if (i) badge("QUÁ NÓNG", 540, 550, pop(tK + 0.1, ts), YELLOW, 50, INK);
    out.restore();
    chip("CÁCH THỨ HAI", 540, 225, pop(0.12, ts) * lab, { size: 46 });
    chip("ĐÚC THẬT DÀY", 540, 640, pop(tD, ts) * lab, { size: 50 });
    chip("CHỈ TRỮ NHIỆT", 540, 225, pop(t8 + 0.1, ts), { size: 46 });
  } },
  // the answer is in the liquid hydrogen (shot 9). The source draws no tank at this sentence: it moves in close on the
  // head of the engine, the pipe from the right pump into the chamber turns cyan, a line labels it "liquid hydrogen =
  // fuel", and a thermometer stands beside it. So does this
  { shots: ["9"], cut: "sheet", draw(ts) {
    page("pl-giay-vang", ts, 5.0);
    const tH = said("9", "hydro lỏng"), tC = said("9", "âm 253"), z = sm(0, 4.6, ts);
    // the camera creeps in on the head, cut by the left edge as in the source: the top of the knob comes down from
    // 250 to 165 px and the picture grows by 7 %
    const w = 1230 + 90 * z, x = 230, y = 250 - 85 * z + tall("pc-co", w), pt = (sx, sy) => srcPt(x, y, w, sx, sy), cool = sm(0.3, 1.0, ts);
    P("pc-co", x, y, w);
    // the hydrogen over the white pipe of the picture: a cyan band as wide as its beads, with thin cream dashes, from
    // under the right pump round its three beads to the wall of the chamber, clipped at both so that it covers neither.
    // The beads show faintly through it, as they do in the source
    if (cool > 0) {
      out.save(); out.globalAlpha = cool;
      out.beginPath(); out.rect(...pt(345, 216), 1200, 1200); out.clip();
      pipe([[421.5, 203], [417, 230], [402, 246], [373, 253], [340, 254]].map(([sx, sy]) => pt(sx, sy)), CYAN, ts * 220, 0.069 * w, 0.26);
      out.globalAlpha = cool * 0.55; out.strokeStyle = "#fbf6ea"; out.lineWidth = 3;
      for (const [sx, sy] of [[417, 230], [402, 246], [373, 253]]) { const [bx, by] = pt(sx, sy); out.beginPath(); out.arc(bx, by, 0.035 * w, 0, 7); out.stroke(); }
      out.restore();
    }
    // the cold haze lies over the pipe, as in the source
    frost([[425, 238], [404, 250], [376, 257], [396, 264], [346, 256]].map(([sx, sy]) => pt(sx, sy)), 0.075 * w, ts, cool);
    gauge(930, 1000, 420, sm(tC - 0.4, tC + 0.5, ts), CYAN, 1);
    chip("−253°C", 930, 520, pop(tC + 0.3, ts), { size: 46 });
    // the label under the pipe, over the bell, with a line straight down from the lowest bead to it, as in the source
    const kl = pop(tH - 0.1, ts), [lx, ly] = pt(373, 272);
    if (kl > 0) stick(lx, ly, lx, 1038, 4, INK, 0);
    chip(["HYDRO LỎNG", "= NHIÊN LIỆU"], lx, 1085, kl, { size: 46 });
  } },
  // before it burns it is pumped round about 390 channels in the wall of the chamber: the chamber seen from above
  { shots: ["10"], cut: "band", draw(ts) {
    page("pl-giay-vang", ts, 4.7);
    const tR = said("10", "390 rãnh"), tW = said("10", "thành buồng đốt"), cx = 540, cy = 760, n = 36;
    stick(-20, 200, 250, 200, 30, CYAN); stick(250, 200, 250, 490, 30, CYAN);
    flow(-20, 200, 250, 200, "#fbf6ea", ts * 220, 11); flow(250, 200, 250, 490, "#fbf6ea", ts * 220 - 270, 11);
    piece(() => out.arc(cx, cy, 390, 0, 7), STEEL);
    piece(() => out.arc(cx, cy, 262, 0, 7), GOLD);
    out.save(); out.beginPath(); out.arc(cx, cy, 258, 0, 7); out.clip(); rays(cx, cy, ts, 0.3); out.restore();
    for (let j = 0; j < n; j++) {
      const a = -Math.PI / 2 + (j / n) * Math.PI * 2, x = cx + Math.cos(a) * 326, y = cy + Math.sin(a) * 326, at = tR - 1.5 + (2.8 * j) / n, lit = sm(at, at + 0.3, ts);
      piece(() => out.arc(x, y, 24, 0, 7), lit > 0.5 ? CYAN : "#7f8899", { line: 4, shadow: 0 });
      if (lit > 0 && lit <= 0.5) { out.save(); out.globalAlpha = 1 - lit * 2; out.fillStyle = "#fff3b0"; out.beginPath(); out.arc(x, y, 44 - lit * 68, 0, 7); out.fill(); out.restore(); }
    }
    chip(`${Math.round((390 * sm(tR - 1.5, tR + 1.3, ts)) / 10) * 10} RÃNH`, cx, cy, 1, { size: 64 });
    chip("THÀNH BUỒNG ĐỐT", 640, 262, pop(tW + 0.1, ts), { size: 46 });
  } },
  // the nozzle of tubes (shots 11 to 13): built of steel tubes, the cold flow sweeping the heat from its wall, and
  // what one pause of that flow does
  { shots: ["11", "12", "13"], cut: "iris", iris: [540, 760], draw(ts, i, u) {
    page("pl-giay-vang", ts, 13.9);
    const tT = said("11", "ống thép"), tV = said("11", "thành vòi phun"), s12 = i ? ts - u : 99, s13 = i === 2 ? ts - u : 99;
    const tC = s12 + said("12", "cuốn đi"), tS = s13 + said("13", "ngừng"), tH = s13 + said("13", "thành ống"), tX = s13 + said("13", "thủng ngay");
    const burst = ts - tX, shake = burst > 0 ? Math.max(0, 1 - burst / 0.5) : 0, run = Math.min(ts, tS) - (s12 - 0.1);
    // the chamber above the throat, and the fire leaving the bell
    piece(() => out.roundRect(350, 60, 380, 200, 80), STEEL);
    piece(() => out.arc(540, 190, 78, 0, 7), GOLD);
    flame(540, 1056, 600, 150, ts);
    out.save(); out.translate(shake * 9 * Math.sin(ts * 70), shake * 6 * Math.cos(ts * 61));
    // the bell: N tubes seen through it, from the throat (half 100 wide at y 250) to the rim (half 430 wide at y
    // 1050). Seen from the side they crowd toward both edges, so tube j lies at the angle -pi/2 + pi j / N round
    // from the left edge to the right, and it is lightest at the middle of the picture
    const y0 = 250, y1 = 1050, N = 24, R = (v) => 100 + 330 * (1 - (1 - v) ** 1.6), th = (j) => -Math.PI / 2 + (Math.PI * j) / N;
    const at = (v, a) => [540 + R(v) * Math.sin(a), y0 + v * (y1 - y0)];
    const bell = () => { for (let s = 0; s <= 12; s++) { const [x, y] = at(s / 12, -Math.PI / 2); s ? out.lineTo(x, y) : out.moveTo(x, y); } for (let s = 12; s >= 0; s--) out.lineTo(...at(s / 12, Math.PI / 2)); out.closePath(); };
    out.save(); out.globalAlpha = sm(tT - 0.4, tT - 0.1, ts); piece(bell, "#4a3a3c"); out.restore();
    for (let j = 0; j < N; j++) {
      const a0 = th(j), a1 = th(j + 1), mid = (a0 + a1) / 2, [mx, my] = at(0.5, mid), kp = pop(tT - 0.4 + 2.6 * Math.abs(mid) / (Math.PI / 2), ts, 0.3);
      if (kp <= 0) continue;
      out.save(); out.translate(mx, my); out.scale(kp, kp); out.translate(-mx, -my);
      piece(() => { for (let s = 0; s <= 12; s++) { const [x, y] = at(s / 12, a0); s ? out.lineTo(x, y) : out.moveTo(x, y); } for (let s = 12; s >= 0; s--) out.lineTo(...at(s / 12, a1)); out.closePath(); }, mix("#8f98a8", "#e2e6ec", Math.cos(mid) ** 1.5), { line: 3 });
      out.restore();
    }
    // shot 12: heat touches the wall and sparks of it are swallowed as the cold flow sweeps down the tubes
    if (i === 1) for (let q = 0; q < 8; q++) {
      const p = wrap(ts * 0.8 + rnd(q, 411), 1), v = 0.5 + 0.48 * rnd(q, 412), [x, y] = at(v, (q % 2 ? 1 : -1) * 1.35);
      out.save(); out.globalAlpha = 0.9 * (1 - p); out.translate(x, y); out.rotate(0.3 * q);
      piece(() => { out.moveTo(0, -18); out.lineTo(12, 0); out.lineTo(0, 18); out.lineTo(-12, 0); out.closePath(); }, RED, { line: 3, shadow: 0 });
      out.restore();
    }
    // shot 13: with the flow stopped the wall heats through from the throat, until it bursts at the rim
    const heat = sm(tH, tX + 0.1, ts);
    if (heat > 0) {
      out.save(); out.beginPath(); bell(); out.clip();
      const g = out.createLinearGradient(0, y0, 0, y0 + 800 * heat);
      g.addColorStop(0, "rgba(226,60,30,.8)"); g.addColorStop(1, "rgba(226,60,30,0)");
      out.fillStyle = g; out.fillRect(90, y0 - 4, 900, 810);
      out.restore();
    }
    // the cold flow: dashes running down the tubes
    if (run > 0) {
      out.save(); out.lineCap = "round";
      for (const j of [3, 7, 10, 13, 16, 20]) for (let d = 0; d < 3; d++) {
        const v = wrap(run * 0.7 + rnd(j * 7 + d, 401), 1), [ax, ay] = at(v, th(j)), [bx, by] = at(v + 0.09, th(j));
        out.beginPath(); out.moveTo(ax, ay); out.lineTo(bx, by);
        out.strokeStyle = INK; out.lineWidth = 15; out.stroke();
        out.strokeStyle = CYAN; out.lineWidth = 10; out.stroke();
      }
      out.restore();
    }
    if (burst > 0) {
      glow(830, 700, 230, 0.9 * (1 - sm(0.2, 1.4, burst)), ts);
      piece(() => blob(830, 700, 100, 31, 0.3), ORANGE, { line: 4 });
      piece(() => blob(830, 700, 66, 32, 0.3), "#1a1012", { line: 3 });
      out.save(); out.translate(880, 700); out.rotate(-Math.PI / 2); flame(0, 0, 84, 190 * Math.min(1, burst * 3), ts); out.restore();
      shards(830, 690, burst, 24, [RED, GOLD, STEEL, "#1a1012"]);
    }
    out.restore();
    const lab = 1 - sm(s13 - 0.25, s13, ts);
    chip("ỐNG THÉP NHỎ", 540, 620, pop(tT, ts) * lab * (1 - sm(tC - 0.25, tC, ts)), { size: 46 });
    chip("VÒI PHUN", 540, 900, pop(tV, ts) * lab, { size: 50 });
    chip("CUỘN ĐI", 870, 760, pop(tC, ts) * lab, { size: 44 });
    badge("NGỪNG!", 300, 560, pop(tS - 0.05, ts) * (1 - sm(tX - 0.05, tX + 0.12, ts)), YELLOW, 48, INK);
    badge("THỦNG NGAY", 300, 560, pop(tX + 0.1, ts), RED, 48);
  } },
  // is the heat that is swept away wasted? No (shots 14 and 15): it warms the hydrogen for the chamber
  { shots: ["14", "15"], cut: "band", draw(ts, i, u) {
    page("pl-giay-vang", ts, 7.9);
    const s15 = i ? ts - u : 99, tH = s15 + said("15", "hâm nóng"), tM = s15 + said("15", "cháy mạnh hơn");
    const warm = sm(tH - 0.1, tH + 1.3, ts), big = 1 + 0.42 * sm(tM - 0.1, tM + 0.8, ts), q = pop(0.4, ts, 0.5) * (1 - sm(s15 - 0.02, s15 + 0.18, ts));
    // the hydrogen: cold and blue up the pipe on the left, warm and yellow from the corner into the side of the
    // chamber, as the pipe of the picture enters it (the engine is drawn over the end of it)
    const w = 400, h = tall("pc-co", w), top = 1000 - h, yc = top + ENG.chamber * h, xp = 130;
    stick(xp, 1030, xp, yc, 30, "#c9e9f2"); stick(xp, yc, 520, yc, 30, "#f3dc9a");
    flow(xp, 1030, xp, yc, CYAN, ts * 240, 13); flow(xp, yc, 520, yc, mix("#3fc4e8", "#f6c453", warm), ts * 240 - 520, 13);
    glow(540, 1100, 520, 0.35 + 0.35 * (big - 1) / 0.42, ts);
    engine(540, 1000, w, 0.3 * big, ts);
    // the heat of the wall flowing out of the bell into the pipe
    const ka = sm(tH - 0.2, tH + 0.3, ts);
    [0.63, 0.72, 0.81].forEach((fy, j) => arrow(540 + (ENG.cx - 0.5) * w - bellR(w, fy) - 14, top + fy * h, 165, top + fy * h, RED, 12, ka * (0.85 + 0.15 * Math.sin(ts * 5 + j))));
    if (q > 0) { bubble(880, 290, 90, q); out.save(); out.globalAlpha = q; text("?", 880, 296, 150, INK, "center", 900); out.restore(); }
    badge("KHÔNG", 215, 420, pop(s15 + 0.05, ts, 0.4), "#3f9d6a", 50);
    chip("HÂM NÓNG HYDRO", 500, 205, pop(tH - 0.1, ts), { size: 44 });
    chip("CHÁY MẠNH HƠN", 845, 1120, pop(tM, ts), { size: 38 });
  } },
  // the fuel cools and is warmed: regenerative cooling, a loop round the engine
  { shots: ["16"], cut: "sheet", draw(ts) {
    page("pl-giay-vang", ts, 4.5);
    const tL = said("16", "làm mát tái sinh");
    engine(540, 940, 290);
    loop(540, 700, 335, 335, ts, sm(0.1, 0.7, ts));
    // the pump and the chamber are named with a line to the part itself; the channels and the tubes lie inside the loop
    // beside their names
    const kp = pop(0.5, ts), kb = pop(1.1, ts);
    if (kp > 0) stick(790, 446, 680, 502, 5, INK, 0);
    chip("BƠM", 836, 436, kp, { size: 36 }); chip("RÃNH", 962, 700, pop(0.7, ts), { size: 36 });
    chip("ỐNG", 540, 985, pop(0.9, ts), { size: 36 });
    if (kb > 0) stick(212, 562, 506, 574, 5, INK, 0);
    chip(["BUỒNG", "ĐỐT"], 150, 560, kb, { size: 34 });
    chip("LÀM MÁT TÁI SINH", 540, 1170, pop(tL, ts), { size: 50 });
  } },
  // but cutting all those channels and welding all those tubes by hand is costly
  { shots: ["17"], cut: "band", draw(ts) {
    back("pl-xuong", ts, 4.5, 0.625, 1165);
    const tK = said("17", "khoét"), tH = said("17", "hàn"), tT = said("17", "tốn kém");
    engine(300, 1206, 400);
    // channels cut into the bell one by one, then tubes laid on it one by one
    for (let j = 0; j < 16; j++) {
      const cut = j < 8, fy = 0.46 + (ENG.corner - 0.48) * ((j % 8) / 7), [x, y] = on(300, 1206, 400, ENG.cx + (cut ? -1 : 1) * (bellR(1, fy) - 0.03), fy);
      const kp = pop((cut ? tK : tH) + 0.15 * (j % 8), ts, 0.3);
      if (kp <= 0) continue;
      out.save(); out.translate(x, y); out.scale(kp, kp);
      piece(() => out.arc(0, 0, 11, 0, 7), cut ? "#1a1012" : CYAN, { line: 3, shadow: 0 });
      out.restore();
    }
    money(596, 1215, ts, tT - 0.1, 14);
    P("pg-ky-su", 800, 1206, 300, { flip: F("ky-su", true) });
    chip("RẤT TỐN KẾM", 540, 300, pop(tT, ts), { size: 46 });
  } },
  // the new version: more than 30 parts printed in 3D, a chamber made faster and at half the price
  { shots: ["18"], cut: "sheet", draw(ts) {
    back("pl-xuong", ts, 5.6, 0.625, 1165);
    const t3 = said("18", "in 3D"), tF = said("18", "làm nhanh hơn"), tG = said("18", "chỉ còn một nửa");
    chip(["HƠN 30 BỘ PHẬN", "IN 3D"], 540, 130, pop(t3 - 0.2, ts), { size: 46 });
    // a card with the old against the new: the time it takes and the price
    piece(() => torn(70, 225, 1010, 520, 7), CREAM);
    text("THỜI GIAN", 110, 290, 36); text("GIÁ", 110, 452, 36);
    // each bar shrinks in 0.7 s, so the price bar is at half about 0.3 s before the sheet covers it (at 1.5 the words
    // "chỉ còn một nửa" are the last but a few of the line; 0.9 s left it 0.15 s)
    const fast = 1 - 0.55 * sm(tF, tF + 0.7, ts), cheap = 1 - 0.5 * sm(tG, tG + 0.7, ts);
    bar(400, 262, 480, 1, STEEL_DARK); bar(400, 300, 480, fast, ORANGE);
    bar(400, 424, 480, 1, STEEL_DARK); bar(400, 462, 480, cheap, ORANGE);
    text("CŨ", 896, 276, 30); text("MỚI", 896, 314, 30); text("CŨ", 896, 438, 30); text("MỚI", 896, 476, 30);
    P("pc-may-in", 300, 1210, 500);
    ring(290, 1210 - 0.48 * tall("pc-may-in", 500), 74, sm(t3 + 0.1, t3 + 0.5, ts));
    P("pg-ky-su", 840, 1210, 250, { flip: F("ky-su", true) });
  } },
  // the Stennis center on 18 November 2026 (shots 19 and 20): engine 10001 lights
  { shots: ["19", "20"], cut: "sheet", draw(ts, i, u) {
    const s20 = i ? ts - u : 99, tL = s20 + said("20", "bùng cháy");
    const s = stand(ts, 8.1, { len: 0.74 * sm(tL - 0.12, tL + 0.25, ts), ignite: tL, steam: sm(tL, tL + 0.8, ts) });
    chip(["STENNIS", "18 . 11 . 2026"], 160, 470, pop(0.4, ts) * (1 - sm(s20 - 0.25, s20 + 0.05, ts)), { sign: 1, legs: 110, size: 44 });
    // the number of the engine beside its head, with a line from the badge to the top right of the head, over the pump
    const k1 = pop(s20 + 0.15, ts);
    if (k1 > 0) stick(...on(s.x, s.exit, 300, 0.625, 0.045), 692, 456, 5, INK, 0);
    badge("10001", 800, 466, k1, YELLOW, 50, INK);
  } },
  // 200 seconds at 111 % of the rated thrust
  { shots: ["21"], cut: "band", draw(ts) {
    const t2 = said("21", "200 giây"), tP = said("21", "111%"), run = sm(0.15, t2 + 0.1, ts), thrust = sm(tP - 0.7, tP + 0.25, ts);
    // the deck of the stand just above the knob, so the whole engine hangs under the card with the numbers of the test
    stand(ts, 4.7, { top: 540, w: 230, hook: 0 });
    // a sheet of paper over the sky with the two numbers of the test
    piece(() => torn(60, 62, 1020, 505, 8), CREAM);
    text("THỜI GIAN", 110, 134, 36);
    bar(110, 156, 600, 1, "#e2d8bf"); bar(110, 156, 600, run, ORANGE);
    text(`${Math.round(200 * run)} giây`, 970, 170, 46, INK, "right");
    text("LỰC ĐẨY", 110, 302, 36);
    bar(110, 324, 600, 1, "#e2d8bf"); bar(110, 324, 600, thrust, RED);
    // the rated mark, at 100 of 111
    const mark = 110 + 600 * (100 / 111);
    stick(mark, 304, mark, 372, 5, INK, 0);
    text("100%", mark, 400, 30, INK, "center");
    text(`${Math.round(111 * thrust)}%`, 960, 338, 46, INK, "right");
  } },
  // the fire out, the nozzle whole: not a mark of burning on it
  { shots: ["22"], cut: "sheet", draw(ts) {
    const tN = said("22", "nguyên vẹn"), k = 1 + 0.4 * sm(0.3, 4.0, ts);
    // the camera pushes in on the middle of the bell, and the ring is drawn about the same point, so it stays round the bell
    const mid = bellMid(970, 300);
    stand(ts, 4.0, { len: 0, steam: 0.9 * (1 - sm(0.5, 2.8, ts)), zoom: [539, mid, k] });
    ring(539, mid, 158 * k, sm(tN, tN + 0.5, ts));
    sparkles(539, mid - 90, 230, ts, 10);
    chip("NGUYÊN VẸN", 540, 150, pop(tN, ts), { size: 48 });
    chip("KHÔNG MỘT VẾT CHÁY", 540, 250, pop(tN + 1.0, ts), { size: 48 });
  } },
  // the end: the rocket on its pad at night, as tall as its tower, waiting for the fuel that keeps its nozzles alive
  { shots: ["kết"], cut: "sheet", draw(ts) {
    back("pl-ban-phong", ts, 5.8, 0.705, 1370, 0.02);
    glow(540, 1150, 420, 0.5, ts);
    lattice(880, 400, 1375, 230, 0, "#8d94a3", "#a9b0bd");
    rocket(540, 1186, 66 * Math.max(0.001, pop(0.15, ts, 0.6)));
    lattice(880, 400, 1375, 230, 1, "#8d94a3", "#a9b0bd");
    piece(() => torn(400, 1190, 680, 1252, 11), "#8d94a3");
    // the fuel going round its engines before the flight: the loop of the story, small and quiet, close round the thin rocket
    loop(540, 800, 136, 372, ts, sm(1.0, 1.8, ts), 1);
    sparkles(540, 420, 460, ts, 8);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, look: "storybook", stickers: CUTS.filter((n) => n.startsWith("pc-")) });
