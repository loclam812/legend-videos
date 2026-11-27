// The scenes of the Vietnamese cut of vi-khuan-trong-co-the-giay, "Vi khuẩn sống trong cơ thể bạn nhiều thế nào?" (How
// Many Microbes Live Inside Your Body?), in the storybook paper-cut look of tien-su-hoat-hinh: made on 2026-11-26 from
// that folder's canh.js, with the same layers and the same staging, every label translated and every line its English
// line's translation (loi.js). The person and the microbes are cut-outs the model made, glued on white paper; the paper
// diagrams are drawn here by code in the same look (the numbers on torn sheets, the digestive tract as paper tubes, the
// cells of the gut's lining, a paper pill and a harmful microbe), with cream paper labels and yellow captions. The staging
// follows the picture column of the user's outline (loi.js): in on the face and through the skin into the tissue (hook to
// 2), the number against the human cells (3, 4), skin, mouth and the digestive tract (5, 6), viruses, fungi and other
// microbes (7, 8), fiber turned into healthy compounds (9), the immune system and the barrier of the gut (10), disease
// and antibiotics (11, 12), fiber-rich foods (13, 14), and the whole body as an ecosystem (15 to kết). The outline's
// "What surprised you most?" is missing from its complete voice-over, so the silent last shot shows the question, in
// Vietnamese, on a card and nothing reads it.
// Timing: every label hangs on the word of its line that names it (said() and HEARD below, as in
// ten-lua-elon-musk-en/canh.js), and every move is counted from the start of its shot (shotLen()), never from absolute
// seconds, so another read speed only stretches a scene. A Vietnamese line says its key words sooner or later than the
// English one, so where the English code counted from the start of the shot this counts from the word: scene C's ring,
// name and dive from "đại tràng" and its zoom from "phần lớn", scene E's last thread from "tạo ra", scene B's second label
// no earlier than the risen sheet. Shot 6 holds a pause line after its sentence (loi.js), so the large intestine is
// ringed and named before the next scene's iris.
// Layout: the captions sit at 1250 to 1420 px, so the person stands with the feet at 1240 px (1225 in the last scene)
// and the diagrams lie between 250 and 1200 px.
const PLATES = ["pl-giay-vang", "pl-mo", "pl-ruot", "pl-giay-xanh"];
const CUTS = ["pg-nguoi", "pc-vi-khuan", "pc-coc", "pc-xoan", "pc-te-bao", "pc-nam-men", "pc-don-bao", "pc-virut", "pc-rau", "pc-trai-cay", "pc-dau", "pc-ngu-coc"];
// which way the generated pieces face, found by looking at them: 1 means the piece faces left as generated. The bacterium
// and the slipper animalcule face right (their faces are in their right half), so a copy placed to the right of what it
// should look at is turned; the cocci and the spiral look the same both ways, and the person faces the viewer
const LEFT = { viKhuan: 0, donBao: 0 };
const INK = "#1f1408", CREAM = "#f6efd6", TEAL = "#2a9d8f", GOLD = "#f7a21b", RED = "#e2542a", GREEN = "#59a85a", WOOD = "#b5713c";
const WASH = "#fbe4d1"; // the pale paper laid over the gut when a diagram must be read on it
const MICRO = ["pc-vi-khuan", "pc-coc", "pc-xoan"];
const mix = (a, b, k) => { const p = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), q = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16)); return `rgb(${p.map((v, i) => Math.round(v + (q[i] - v) * k)).join(",")})`; };
const mid = (a, b, k) => a + (b - a) * k;

const CUT = Object.fromEntries((window.CUT || []).map((c) => [c.label, c]));
// when each phrase of a line is spoken, at the voice's own pace: one row per shot, read from the WordBoundary marks of
// edge-tts (the Python API). Until the marks have been read the table is empty and said() places a phrase by letters,
// which can miss a word by up to a second
const HEARD = {
  hook: { line: "Bạn có nghĩ cơ thể mình thuộc về riêng mình?", speaks: 3.048, at: {"cơ thể":0.73} },
  1: { line: "Hãy nghĩ lại!", speaks: 1.872, at: {"nghĩ lại":0.38} },
  2: { line: "Ngay lúc này, hàng nghìn tỷ sinh vật tí hon đang cư trú ngay trong cơ thể bạn!", speaks: 5.040, at: {"hàng nghìn tỷ":0.98,"sinh vật tí hon":1.55,"cư trú ngay trong":2.63} },
  3: { line: "Các nhà khoa học ước tính rằng một người trưởng thành trung bình có khoảng 38 nghìn tỷ tế bào vi khuẩn.", speaks: 5.904, at: {"38":3.1,"nghìn tỷ":3.65,"tế bào":4.06,"vi khuẩn":4.5,"trưởng thành":1.8} },
  4: { line: "Bậc độ lớn của con số đó gần bằng số tế bào người của chính bạn!", speaks: 4.488, at: {"số tế bào người":1.95,"Bậc độ lớn":0.1} },
  5: { line: "Vi sinh vật sống trên da của bạn, trong miệng và khắp đường tiêu hóa.", speaks: 4.680, at: {"trên da":1.04,"trong miệng":2.08,"đường tiêu hóa":2.94} },
  6: { line: "Vi khuẩn của bạn phần lớn tập trung ở đại tràng.", speaks: 3.528, at: {"phần lớn":1.05,"đại tràng":2.17} },
  7: { line: "Và vi khuẩn không hề cô đơn.", speaks: 2.688, at: {"vi khuẩn":0.4,"cô đơn":1.33} },
  8: { line: "Hệ vi sinh vật của bạn cũng gồm cả virus, nấm và nhiều dạng sống vi mô khác.", speaks: 5.304, at: {"virus":1.93,"nấm":2.59,"dạng":3.29,"vi sinh vật":0.36} },
  9: { line: "Một số vi khuẩn đường ruột phân giải chất xơ mà cơ thể bạn không tự tiêu hóa được, tạo ra các hợp chất giúp đường ruột khỏe mạnh.", speaks: 7.464, at: {"vi khuẩn đường ruột":0.7,"chất xơ":1.86,"không tự tiêu hóa":3.2,"tạo ra":4.45,"hợp chất":5.04,"giúp":5.44,"khỏe mạnh":6.09} },
  10: { line: "Vi sinh vật đường ruột của bạn còn tương tác với hệ miễn dịch và giúp duy trì lớp bảo vệ trong ruột.", speaks: 5.712, at: {"Vi sinh vật đường ruột":0.1,"tương tác":1.78,"hệ miễn dịch":2.34,"duy trì":3.36,"bảo vệ":4,"trong ruột":4.43} },
  11: { line: "Còn một số vi sinh vật lại có thể gây bệnh.", speaks: 3.264, at: {"số vi sinh vật":0.49,"gây bệnh":1.88} },
  12: { line: "Thuốc kháng sinh, dù đôi khi rất cần thiết, cũng có thể làm rối loạn cả vi khuẩn tốt trong ruột.", speaks: 5.808, at: {"Thuốc kháng sinh":0.1,"cần thiết":1.83,"rối loạn":3.2,"vi khuẩn tốt":3.81} },
  13: { line: "Ăn đa dạng các thực phẩm giàu chất xơ giúp nuôi dưỡng nhiều vi khuẩn tốt của ruột.", speaks: 4.752, at: {"nuôi dưỡng":2.15,"giàu chất xơ":1.3,"tốt":3.25,"đa dạng":0.34,"thực phẩm":0.91,"chất xơ":1.49} },
  14: { line: "Chế độ ăn uống thường ngày của bạn rất quan trọng!", speaks: 3.432, at: {"quan trọng":1.99} },
  15: { line: "Vậy là bạn không chỉ là một sinh vật.", speaks: 2.880, at: {"một sinh vật":1.4} },
  16: { line: "Cơ thể bạn là cả một hệ sinh thái vi mô!", speaks: 3.240, at: {"cả một":0.94,"hệ sinh thái":1.3} },
};
// seconds into its line at which the shot `label` says `phrase` (found as spelled, capitalisation included)
const said = (label, phrase) => {
  const line = CUT[label] && CUT[label].lines[0], at = line ? line.text.indexOf(phrase) : -1;
  if (at < 0) throw new Error(`said(): "${phrase}" is not in shot ${label}`);
  const heard = HEARD[label];
  return heard && line.text === heard.line && heard.at[phrase] !== undefined ? (heard.at[phrase] * (line.dur - 0.3)) / heard.speaks : (line.dur * at) / line.text.length;
};
// how long a shot's lines take, and a scene that serves these shots with the half-second gap after each (the span its
// plate creeps in over), worked out from the shot list the recorders write, so it follows the real voice
const shotLen = (label) => CUT[label].lines.reduce((s, l) => s + l.dur, 0);
const sceneLen = (...labels) => labels.reduce((s, l) => s + shotLen(l) + GAP, 0);

// ---------- paper ----------
// the strength of the paper shadows and ink lines while a scene draws under a zooming camera: inside one the blur
// grows with the scale and a shadow becomes a dark halo, so the scene sets this to 1 over its scale and resets it to 1
let PAPER = 1;
const ink = (line) => line * Math.max(0.45, PAPER), shadowOn = (alpha) => { out.shadowColor = `rgba(40,20,10,${alpha * PAPER})`; out.shadowBlur = 10 * PAPER; out.shadowOffsetY = 6; };
function piece(build, fill, { line = 5, shadow = 1 } = {}) {
  out.save();
  if (shadow) shadowOn(0.45);
  out.beginPath(); build(); out.fillStyle = fill; out.fill();
  out.shadowColor = "transparent";
  if (line > 0) { out.lineWidth = ink(line); out.lineJoin = "round"; out.strokeStyle = INK; out.stroke(); }
  out.restore();
}
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
function stick(x0, y0, x1, y1, w, colour, line = 5) {
  const path = () => { out.beginPath(); out.moveTo(x0, y0); out.lineTo(x1, y1); };
  out.save(); out.lineCap = "round";
  if (line > 0) { shadowOn(0.45); path(); out.strokeStyle = INK; out.lineWidth = w + 2 * ink(line); out.stroke(); out.shadowColor = "transparent"; }
  path(); out.strokeStyle = colour; out.lineWidth = w; out.stroke();
  out.restore();
}
const text = (str, x, y, size, colour = INK, align = "center", weight = 800, track = 0.04) => {
  out.save(); out.font = `${weight} ${size}px ${TYPE()}`; out.letterSpacing = `${size * track}px`; out.fillStyle = colour; out.textAlign = align; out.textBaseline = "middle"; out.fillText(str, x, y); out.restore();
};
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
// a soft light around a point (a screen blend, so it only lightens what is under it); a = its strength
function glow(x, y, r, a, rgb = "150,240,200") {
  if (a <= 0) return;
  out.save(); out.globalCompositeOperation = "screen";
  const g = out.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${rgb},${0.8 * a})`); g.addColorStop(1, `rgba(${rgb},0)`);
  out.fillStyle = g; out.fillRect(x - r, y - r, 2 * r, 2 * r);
  out.restore();
}
// the engine's sparkles under an alpha of their own: they have none, so switched on at once they would pop in
const stars = (x, y, spread, t, n, a) => { if (a > 0) { out.save(); out.globalAlpha = a; sparkles(x, y, spread, t, n); out.restore(); } };
// a dashed gold ellipse around a part; k draws it round from the top
function oval(x, y, rx, ry, k) {
  if (k <= 0) return;
  out.save(); out.strokeStyle = "#f6c453"; out.lineWidth = 7; out.setLineDash([18, 13]); out.lineCap = "round";
  out.shadowColor = "rgba(40,20,10,.6)"; out.shadowBlur = 8; out.shadowOffsetY = 4;
  out.beginPath(); out.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2 * Math.min(1, k)); out.stroke();
  out.restore();
}
// a torn sheet of cream paper w by h, centred at (x, y) and turned by rot; k = pop(), seed picks its tears
function card(x, y, w, h, rot, k, seed) {
  if (k <= 0) return;
  out.save(); out.translate(x, y); out.rotate(rot); out.scale(k, k);
  piece(() => torn(-w / 2, -h / 2, w / 2, h / 2, seed, 7, 56), "#f1e6cb", { line: 6 });
  out.restore();
}
// the number on a torn sheet of cream paper, centred at (x, y): the figure, the word NGHÌN TỶ (trillion) and what is counted;
// k = pop()
function board(x, y, k, number, colour, what) {
  if (k <= 0) return;
  out.save(); out.translate(x, y); out.scale(0.66 * k, 0.66 * k); out.rotate(-0.012);
  piece(() => torn(-455, -240, 455, 240, 5, 10, 68), CREAM, { line: 7 });
  text(number, 0, -110, 250, colour, "center", 900, 0.02);
  text("NGHÌN TỶ", 0, 78, 98, INK, "center", 800, 0.1);
  text(what, 0, 172, 54, INK, "center", 700, 0.08);
  out.restore();
}
// a short-chain fatty acid as a paper symbol: a cream pill of four beads, centred at (x, y); k = pop()
function molecule(x, y, k, rot = 0) {
  if (k <= 0) return;
  out.save(); out.translate(x, y); out.rotate(rot); out.scale(k, k);
  piece(() => out.roundRect(-56, -22, 112, 44, 22), CREAM, { line: 4 });
  [TEAL, TEAL, GOLD, "#fff3b0"].forEach((c, j) => { out.fillStyle = c; out.beginPath(); out.arc(-39 + 26 * j, 0, 13, 0, 7); out.fill(); out.lineWidth = 3; out.strokeStyle = INK; out.stroke(); });
  out.restore();
}
// one cell of the gut's lining, a rounded brick from (x0, y0) to (x1, y1): born = how far it has come up, lit = how far
// it has turned to life
function brick(x0, y0, x1, y1, lit, born = 1) {
  if (born <= 0) return;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, g = out.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, mix("#f9dcc4", "#e2f4c8", lit)); g.addColorStop(1, mix("#f3c9b0", "#cfeab8", lit));
  out.save(); out.globalAlpha = born; out.translate(0, (1 - born) * 26);
  glow(cx, cy, 150, 0.8 * lit, "200,245,160");
  piece(() => out.roundRect(x0, y0, x1 - x0, y1 - y0, 22), g);
  out.fillStyle = mix("#e8a48f", "#9fd08a", lit); out.beginPath(); out.ellipse(cx, cy, (x1 - x0) * 0.17, (y1 - y0) * 0.22, 0, 0, 7); out.fill();
  out.lineWidth = 3; out.strokeStyle = INK; out.stroke();
  out.restore();
}
// an immune cell under the lining, a pale blue paper disc of radius r with a nucleus; lit = how far its answer has come
function immune(x, y, r, lit) {
  const g = out.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.2, x, y, r);
  g.addColorStop(0, mix("#eef5fb", "#fffbe0", lit)); g.addColorStop(1, mix("#dcecf8", "#ffe9a8", lit));
  glow(x, y, r * 2.2, 0.35 + 0.6 * lit, "170,215,255");
  piece(() => out.arc(x, y, r, 0, 7), g);
  out.fillStyle = mix("#8fb4d8", "#f0b45a", lit); out.beginPath(); out.arc(x + r * 0.1, y, r * 0.42, 0, 7); out.fill();
  out.lineWidth = 3; out.strokeStyle = INK; out.stroke();
}
// a signal on its way: a small gold bead with a light of its own; k = its size (it grows out of what sends it)
const bead = (x, y, colour, k = 1) => { if (k <= 0) return; out.save(); out.translate(x, y); out.scale(k, k); glow(0, 0, 44, 0.9, "255,235,150"); out.fillStyle = colour; out.beginPath(); out.arc(0, 0, 11, 0, 7); out.fill(); out.lineWidth = 3; out.strokeStyle = INK; out.stroke(); out.restore(); };
// a ring spreading from (x, y) to the strength a
const ripple = (x, y, r, a) => { if (a <= 0) return; out.save(); out.globalAlpha = a; out.strokeStyle = "#fff3b0"; out.lineWidth = 6; out.beginPath(); out.arc(x, y, r, 0, 7); out.stroke(); out.restore(); };
// an antibiotic pill, centred at (x, y) and turned by rot: a red half and a cream half; k = pop()
function capsule(x, y, k, rot) {
  if (k <= 0) return;
  out.save(); out.translate(x, y); out.rotate(rot); out.scale(k, k);
  piece(() => out.roundRect(-114, -44, 228, 88, 44), CREAM, { line: 5 });
  piece(() => { out.moveTo(0, -44); out.lineTo(0, 44); out.arc(0, 0, 44, Math.PI / 2, (3 * Math.PI) / 2); out.closePath(); }, RED, { line: 0, shadow: 0 });
  stick(0, -44, 0, 44, 5, INK, 0);
  out.fillStyle = "rgba(255,255,255,.55)"; out.beginPath(); out.ellipse(-52, -17, 30, 8, -0.25, 0, 7); out.fill(); out.beginPath(); out.ellipse(52, -17, 30, 8, -0.25, 0, 7); out.fill();
  out.restore();
}
// a harmful microbe: a spiky red ball with an angry face, centred at (x, y); k = its size, t moves its spikes, alpha
function pathogen(x, y, k, t, alpha = 1) {
  if (k <= 0 || alpha <= 0) return;
  out.save(); out.globalAlpha = alpha; out.translate(x, y); out.scale(k, k);
  glow(0, 0, 190, 0.7, "140,255,120");
  out.shadowColor = "rgba(40,20,10,.45)"; out.shadowBlur = 10; out.shadowOffsetY = 6;
  out.beginPath();
  for (let q = 0; q < 28; q++) { const a = (q / 28) * 6.283 + 0.05 * Math.sin(t * 2 + q), rr = q % 2 ? 62 : 88 + 5 * Math.sin(t * 5 + q * 1.7); if (q) out.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); else out.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  out.closePath();
  out.fillStyle = "#d8402a"; out.fill(); out.shadowColor = "transparent"; out.lineWidth = 5; out.lineJoin = "round"; out.strokeStyle = INK; out.stroke();
  for (const sx of [-1, 1]) {
    piece(() => out.arc(23 * sx, -6, 17, 0, 7), "#fff", { line: 3, shadow: 0 });
    out.fillStyle = "#14141a"; out.beginPath(); out.arc(23 * sx + 4 * sx, -3, 8, 0, 7); out.fill();
    stick(38 * sx, -34, 8 * sx, -24, 7, INK, 0); // the brow, slanting down towards the nose
  }
  out.lineWidth = 6; out.lineCap = "round"; out.beginPath(); out.arc(0, 44, 20, Math.PI + 0.5, -0.5); out.stroke(); // the frown
  out.restore();
}

// ---------- rounded lines: the gut and the fiber are drawn along them ----------
// the polyline pts with its corners rounded to the radius r (as far as the neighbouring segments allow), as a dense list
// of points. The straight parts come every 10 px at most, the arcs every 6 px
function path(pts, r) {
  const all = [], at = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const seg = (a, b) => { const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 10)); for (let i = 0; i < n; i++) all.push(at(a, b, i / n)); };
  let from = pts[0];
  for (let c = 1; c < pts.length - 1; c++) {
    const [A, B, C] = [pts[c - 1], pts[c], pts[c + 1]];
    const d0 = Math.hypot(B[0] - A[0], B[1] - A[1]), d1 = Math.hypot(C[0] - B[0], C[1] - B[1]);
    const u = [(B[0] - A[0]) / d0, (B[1] - A[1]) / d0], v = [(C[0] - B[0]) / d1, (C[1] - B[1]) / d1];
    // how far the line turns at B, and which way: positive when v is round from u the positive way
    const turn = Math.atan2(u[0] * v[1] - u[1] * v[0], u[0] * v[0] + u[1] * v[1]);
    if (Math.abs(turn) < 1e-4) { seg(from, B); from = B; continue; }
    const td = Math.min(r * Math.tan(Math.abs(turn) / 2), d0 / 2, d1 / 2), re = td / Math.tan(Math.abs(turn) / 2), way = Math.sign(turn);
    const T0 = [B[0] - u[0] * td, B[1] - u[1] * td], O = [T0[0] - u[1] * re * way, T0[1] + u[0] * re * way];
    const th = Math.atan2(T0[1] - O[1], T0[0] - O[0]), n = Math.max(2, Math.ceil((re * Math.abs(turn)) / 6));
    seg(from, T0);
    for (let i = 1; i <= n; i++) { const a = th + turn * (i / n); all.push([O[0] + re * Math.cos(a), O[1] + re * Math.sin(a)]); }
    from = [B[0] + v[0] * td, B[1] + v[1] * td];
  }
  seg(from, pts[pts.length - 1]);
  all.push(pts[pts.length - 1]);
  return all;
}
// the point at share t of the rounded line's length, with the line's direction there
function along(pts, r, t) {
  const all = path(pts, r), lens = [0];
  for (let i = 1; i < all.length; i++) lens.push(lens[i - 1] + Math.hypot(all[i][0] - all[i - 1][0], all[i][1] - all[i - 1][1]));
  const want = Math.max(0, Math.min(1, t)) * lens[lens.length - 1];
  let i = 1;
  while (i < lens.length - 1 && lens[i] < want) i++;
  const k = (want - lens[i - 1]) / (lens[i] - lens[i - 1] || 1), a = all[i - 1], b = all[i], d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, (b[0] - a[0]) / d, (b[1] - a[1]) / d];
}
// calls fn(point, direction, distance) every step px along a dense line
function march(all, step, fn) {
  let d = 0, next = step;
  for (let i = 1; i < all.length; i++) {
    const a = all[i - 1], b = all[i], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (!len) continue;
    while (next <= d + len) { const k = (next - d) / len; fn([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k], [(b[0] - a[0]) / len, (b[1] - a[1]) / len], next); next += step; }
    d += len;
  }
}
// a paper tube along the dense line all (from path()), w wide: an ink outline, the fill, round ends, and cross ticks
// every tick px (the rings of the large intestine)
function hose(all, w, colour, line = 4, tick = 0) {
  const h = w / 2, e = all.length - 1;
  const side = all.map((p, i) => { const a = all[Math.max(0, i - 1)], b = all[Math.min(e, i + 1)], d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [-(b[1] - a[1]) / d, (b[0] - a[0]) / d]; });
  const aE = Math.atan2(all[e][1] - all[e - 1][1], all[e][0] - all[e - 1][0]), aS = Math.atan2(all[1][1] - all[0][1], all[1][0] - all[0][0]);
  const trace = () => {
    out.beginPath(); out.moveTo(all[0][0] + side[0][0] * h, all[0][1] + side[0][1] * h);
    for (let i = 1; i <= e; i++) out.lineTo(all[i][0] + side[i][0] * h, all[i][1] + side[i][1] * h);
    out.arc(all[e][0], all[e][1], h, aE + Math.PI / 2, aE - Math.PI / 2, true);
    for (let i = e; i >= 0; i--) out.lineTo(all[i][0] - side[i][0] * h, all[i][1] - side[i][1] * h);
    out.arc(all[0][0], all[0][1], h, aS - Math.PI / 2, aS - (3 * Math.PI) / 2, true);
    out.closePath();
  };
  out.save(); out.lineJoin = "round";
  if (line > 0) { shadowOn(0.45); out.strokeStyle = INK; out.lineWidth = w + 2 * ink(line); trace(); out.stroke(); out.shadowColor = "transparent"; }
  trace(); out.fillStyle = colour; out.fill();
  if (tick > 0) {
    out.strokeStyle = "rgba(31,20,8,.3)"; out.lineWidth = 3;
    march(all, tick, (p, t, d) => { if (d < tick * 0.7) return; out.beginPath(); out.moveTo(p[0] + t[1] * h * 0.78, p[1] - t[0] * h * 0.78); out.lineTo(p[0] - t[1] * h * 0.78, p[1] + t[0] * h * 0.78); out.stroke(); });
  }
  out.restore();
}
const tube = (pts, w, colour, line = 4, tick = 0, r = 16) => hose(path(pts, r), w, colour, line, tick);
// a thread of fiber along the rounded line pts, drawn from share `from` to share `to` of its length and wobbling as it
// goes, so that a thread seems to crawl
function strand(pts, w, colour, from, to, t, seed) {
  const all = path(pts, 30), n = all.length;
  const wobbly = all.map((p, k) => { const q = all[Math.min(n - 1, k + 1)], r = all[Math.max(0, k - 1)], d = Math.hypot(q[0] - r[0], q[1] - r[1]) || 1, off = 6 * Math.sin((k / (n - 1)) * 17 + t * 5 + seed * 2.1); return [p[0] - ((q[1] - r[1]) / d) * off, p[1] + ((q[0] - r[0]) / d) * off]; });
  const part = wobbly.slice(Math.floor(from * (n - 1)), Math.ceil(to * (n - 1)) + 1);
  if (part.length > 1) hose(part, w, colour, 3, 0);
}

// ---------- the person ----------
// where the face and the chest of the person cut-out are: from its bottom centre, across and up, in mounted heights.
// Measured on the picture (a paper figure with a big head, mounted 530 by 1376): the top of the hair is at 0.99, the eyes
// at 0.88, the smile at 0.83 across 0.43 to 0.58, the chin at 0.78, the collar at 0.75, the T-shirt to 0.44, the hands
// end at 0.40, the shorts to 0.26, the legs to 0.12, the shoes to 0.01; the head spans 0.28 to 0.73 across, the forearms
// 0.04 to 0.20 and 0.80 to 0.96, the legs 0.29 to 0.73)
const FACE = [0, 0.85], CHEST = [0, 0.6], SMILE = [0.507, 0.825];
// the width that draws the person `h` px tall
const personW = (h) => (h * L["pg-nguoi"].w) / L["pg-nguoi"].h;
// a point of the person given in shares of its box from its bottom centre (across, up)
const bodyPt = (x, y, w, u, v) => [x + (u - 0.5) * w, y - v * tall("pg-nguoi", w)];

// ---------- the digestive tract ----------
// in units of a figure 920 px tall (x from its middle line, y up from its feet), as a front view: the oesophagus from the
// collar, the stomach (drawn as a path below) with its dome to the left and its outlet to the right, the small intestine
// coiled inside the frame of the large intestine (up the left side, across, down the right side, in to the middle)
const OESO = [[0, 686], [-2, 660], [-7, 636]];
const GUT = [[-54, 500], [50, 500], [50, 474], [-50, 474], [-50, 448], [50, 448], [50, 422], [-38, 422]];
const COLON = [[-72, 416], [-72, 536], [0, 528], [72, 540], [72, 420], [34, 402], [4, 398]];
const GUT_MID = 465; // the middle of the large intestine's frame, in the same units
// the tract over the person standing at (x, y), `s` the figure's scale (its height over 920), shown from the collar
// downwards as far as k
function tract(x, y, s, k) {
  if (k <= 0) return;
  out.save();
  out.translate(x, y); out.scale(s, -s);
  out.beginPath(); out.rect(-140, 350 + 360 * (1 - k), 280, 360 * k + 20); out.clip();
  tube(OESO, 10, "#efa29b", 3.5, 0, 12);
  tube(COLON, 24, "#e0927a", 4.5, 16, 18);
  tube(GUT, 9, "#f0c060", 3, 0, 14);
  piece(() => { out.moveTo(-10, 628); out.bezierCurveTo(-30, 640, -58, 636, -66, 610); out.bezierCurveTo(-74, 586, -64, 564, -42, 557); out.bezierCurveTo(-18, 549, 12, 552, 36, 564); out.bezierCurveTo(48, 570, 56, 572, 62, 574); out.bezierCurveTo(67, 576, 67, 582, 62, 584); out.bezierCurveTo(54, 587, 46, 588, 38, 591); out.bezierCurveTo(18, 598, 0, 608, -5, 620); out.bezierCurveTo(-6, 625, -8, 627, -10, 628); out.closePath(); }, "#e2654f", { line: 4.5 });
  out.restore();
}

// ---------- the light inside the body ----------
// the microbes living in the body, spread over the person's box (shares across and up from its bottom left corner):
// only those inside the figure show, because they are drawn through a mask that is the figure itself
const BUGS = Array.from({ length: 190 }, (_, j) => ({ u: 0.1 + 0.8 * rnd(j, 301), v: 0.04 + 0.73 * rnd(j, 302), r: 6 + 9 * rnd(j, 303), c: Math.floor(rnd(j, 304) * 5), ph: rnd(j, 305) * 6.283, sp: 1.2 + 2 * rnd(j, 306), wave: rnd(j, 307) }));
// a whole ecosystem: smaller dots all over the figure, legs and arms included, for "an entire microscopic ecosystem"
const MANY = Array.from({ length: 640 }, (_, j) => ({ u: 0.04 + 0.92 * rnd(j, 401), v: 0.03 + 0.71 * rnd(j, 402), r: 3 + 4 * rnd(j, 403), c: Math.floor(rnd(j, 404) * 5), ph: rnd(j, 405) * 6.283, sp: 1.5 + 3 * rnd(j, 406), wave: rnd(j, 407) }));
const GOOD = ["#8fe3b0", "#f6c453", "#ffb36b", "#fff3b0", "#5fd0c8"];
let maskBody = null, maskSkin = null, workC = null;
// the mounted cut-out with its white backing made transparent ("body"), or with only its skin-coloured pixels left
// ("skin": the face, the forearms and the legs), made once each: a mask that keeps a drawing inside the figure
function bodyMask(kind) {
  const l = L["pg-nguoi"];
  if (kind === "skin" ? maskSkin : maskBody) return kind === "skin" ? maskSkin : maskBody;
  const c = Object.assign(document.createElement("canvas"), { width: l.c.width, height: l.c.height }), g = c.getContext("2d");
  g.drawImage(l.c, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height), p = d.data;
  for (let i = 0; i < p.length; i += 4) {
    const backing = Math.abs(p[i] - 248) + Math.abs(p[i + 1] - 243) + Math.abs(p[i + 2] - 228) < 30;
    const bare = p[i] > 190 && p[i + 1] > 150 && p[i + 1] < 225 && p[i + 2] > 100 && p[i + 2] < 190 && p[i] - p[i + 2] > 45 && p[i] - p[i + 1] > 15; // the paper of its skin, not the shirt, shorts, shoes or hair
    if (backing || (kind === "skin" && !bare)) p[i + 3] = 0;
  }
  g.putImageData(d, 0, 0);
  if (kind === "skin") return (maskSkin = c);
  return (maskBody = c);
}
// the body shaded (a translucent teal wash: the inside of the body) with microbes twinkling inside it, drawn over the
// person cut-out where it stands (x, y, w as P()). k = how far the light has come in, since = seconds since it began (it
// spreads from the chest outwards), dim = how far the shade itself has come up (k when left out: the shade never comes on
// in one frame, it fades in with the light), shade 0 leaves the figure as painted and only dots it, skin dots only the
// bare skin, eco grows the dots by a third, many lights the second crowd up from sinceMany, clear = the share of the
// figure's height above which nothing is drawn (the head stays as painted), 0 for the whole figure
function bodyLight(x, y, w, k, t, { since = 9, shade = 0.8, dim = k, eco = 0, clear = 0, skin = 0, many = 0, sinceMany = since } = {}) {
  if (k <= 0) return;
  const l = L["pg-nguoi"], cw = l.c.width, ch = l.c.height;
  const cx = (0.5 + CHEST[0]) * cw, cyv = (1 - CHEST[1]) * ch, far = Math.hypot(cw, ch) * 0.5, cut = clear > 0 ? (1 - clear) * ch - 20 : -1;
  if (!workC) workC = Object.assign(document.createElement("canvas"), { width: cw, height: ch });
  const g = workC.getContext("2d");
  const lit = (list, on, began, grow, blur) => {
    for (const b of list) {
      const px = b.u * cw, py = (1 - b.v) * ch, wait = b.wave * 0.5 + (Math.hypot(px - cx, py - cyv) / far) * 0.8;
      const up = sm(wait, wait + 0.3, began) * on;
      if (up <= 0 || py < cut) continue;
      const tw = 0.65 + 0.35 * Math.sin(t * b.sp + b.ph), colour = GOOD[b.c], r = b.r * (0.75 + 0.35 * tw) * (1 + 0.3 * grow);
      g.globalAlpha = up * (0.55 + 0.45 * tw);
      g.shadowColor = colour; g.shadowBlur = blur;
      g.fillStyle = colour;
      g.beginPath(); g.arc(px, py, r, 0, 7); g.fill();
    }
  };
  g.globalCompositeOperation = "source-over"; g.globalAlpha = 1; g.shadowColor = "transparent";
  g.clearRect(0, 0, cw, ch);
  g.drawImage(bodyMask(skin ? "skin" : "body"), 0, 0);
  if (clear > 0) {
    // the figure above the collar is taken out of the mask, with a soft edge across the neck
    const yc = (1 - clear) * ch, fade = g.createLinearGradient(0, yc - 10, 0, yc + 10);
    fade.addColorStop(0, "rgba(0,0,0,1)"); fade.addColorStop(1, "rgba(0,0,0,0)");
    g.globalCompositeOperation = "destination-out"; g.fillStyle = fade; g.fillRect(0, 0, cw, yc + 10);
  }
  // source-in with a fill of alpha 0 would erase everything, so the shade is only laid on when it has some strength
  if (shade * dim > 0) { g.globalCompositeOperation = "source-in"; g.fillStyle = `rgba(16,70,66,${shade * dim})`; g.fillRect(0, 0, cw, ch); }
  g.globalCompositeOperation = "source-atop";
  lit(BUGS, k, since, eco, 26);
  if (many > 0) lit(MANY, many, sinceMany, 0, 14);
  g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  const s = w / l.w;
  out.drawImage(workC, 0, 0, l.w, l.h, x - (l.w * s) / 2, y - l.h * s, l.w * s, l.h * s);
}

// ---------- what the scenes place ----------
// the swarm of the tissue in scene A: each microbe leaves the point the camera arrived at in its own direction
const SWARM = Array.from({ length: 18 }, (_, j) => ({ a: rnd(j, 311) * 6.283, at: 150 + 250 * rnd(j, 312), w: 130 + 120 * rnd(j, 314), rot: (rnd(j, 315) - 0.5) * 1.2, kind: j % 3, flip: j % 2, t: 0.05 * j + 0.4 * rnd(j, 316) }));
// the fourteen bacteria of scene B, in the order they bud: x, y of their bottom centre, the layer, the width, and the one
// they bud from (-1 for the first). They end around the sheet of the number (240 to 840 px across, 602 to 918 down) and
// under its label, above the captions, inside the frame even while pop() overshoots
const SLOTS = [[540, 586, "pc-vi-khuan", 250, -1], [270, 572, "pc-coc", 200, 0], [810, 572, "pc-xoan", 200, 0], [128, 700, "pc-vi-khuan", 200, 1], [150, 1080, "pc-coc", 190, 1], [952, 700, "pc-xoan", 200, 2], [900, 1090, "pc-vi-khuan", 190, 2], [120, 880, "pc-xoan", 190, 3], [100, 470, "pc-coc", 150, 3], [400, 1100, "pc-vi-khuan", 220, 4], [540, 1200, "pc-xoan", 210, 4], [960, 900, "pc-vi-khuan", 190, 5], [980, 470, "pc-xoan", 150, 5], [650, 1060, "pc-coc", 200, 6]];
// the bacteria of the body that gather in the large intestine in scene C: where each starts (shares of the box), how far
// along the large intestine it ends, and its size
const GATHER = Array.from({ length: 26 }, (_, j) => ({ u: 0.1 + 0.8 * rnd(j, 351), v: 0.06 + 0.66 * rnd(j, 352), t: (j + 0.5) / 26 + (rnd(j, 353) - 0.5) * 0.03, r: 7 + 5 * rnd(j, 354) }));
// the four cards of scene D: their centres, their turn, the seed of their tears
const CARDS = [[280, 570, -0.012, 3], [800, 570, 0.01, 4], [280, 980, 0.008, 5], [800, 980, -0.009, 6]];
// the community in the gut: three planes of it. r is its distance from the centre (540, 740) in share of 600 px across
// and 760 px down, sp how fast that distance grows as time passes
const FOLK = Array.from({ length: 19 }, (_, j) => ({ a: rnd(j, 321) * 6.283, r: 0.25 + 0.75 * rnd(j, 322), kind: j % 3, w: j < 8 ? 70 + 40 * rnd(j, 323) : j < 15 ? 140 + 50 * rnd(j, 323) : 250 + 80 * rnd(j, 323), rot: (rnd(j, 324) - 0.5) * 1.5, flip: j % 2, sp: j < 8 ? 0.035 : j < 15 ? 0.07 : 0.13 }));
// where one of the community stands at ts
const folkAt = (m, ts) => {
  const r = m.r * (1 + m.sp * ts), low = Math.max(0, Math.sin(m.a));
  // the ones below the centre travel on a flatter ellipse: their lowest corner stays above the captions
  const dv = low > 0 ? Math.min(1, 0.545 / (low * m.r * (1 + m.sp * 11))) : 1;
  return [540 + Math.cos(m.a) * r * 600, 740 + Math.sin(m.a) * r * 760 * dv];
};
// the community, each one drifting outwards; move(j, x, y) returns a push aside [dx, dy] and size(j, x, y) a scale, both
// optional
function community(ts, move, size) {
  FOLK.forEach((m, j) => {
    const k = sm(0.05 + j * 0.04, 0.65 + j * 0.04, ts), [x0, y0] = folkAt(m, ts), y = y0 + 8 * Math.sin(ts * 2 + j);
    const [dx, dy] = move ? move(j, x0, y) : [0, 0], sc = size ? size(j, x0 + dx, y + dy) : 1;
    if (k * sc <= 0) return;
    P(MICRO[m.kind], x0 + dx, y + dy, m.w * k * sc, { rot: m.rot + 0.12 * Math.sin(ts * 1.2 + j), flip: m.flip });
  });
}
// the threads of fiber in scene E: from the vegetables, down between the two labels (CHẤT XƠ on their left, VI KHUẨN
// ĐƯỜNG RUỘT on their right), to the bacterium's left end, where they disappear
const STRANDS = [0, 1, 2].map((j) => [[396, 474 + 12 * j], [420 + 14 * j, 580 + 14 * j], [466 + 8 * j, 690 - 10 * j]]);
const STRAND_COLOURS = ["#9ccc65", "#d5e49a", "#f3e2a0"];
// the microbes of the lining in scene F and where the immune cells under it sit (the same x, for the signals that pass
// straight down between them): x, the layer, the width
const TOP = [[130, "pc-vi-khuan", 170], [280, "pc-coc", 150], [440, "pc-xoan", 170], [620, "pc-vi-khuan", 190], [800, "pc-coc", 150], [950, "pc-xoan", 180]];
const PAIRS = [0, 1, 4, 5];
// the fiber-rich foods of scene H: their places in the grid, their layer and their label (a word or two lines), with the
// word each comes on
const FOOD = [[290, 600, "pc-rau", "RAU", 0.1], [790, 600, "pc-trai-cay", "TRÁI CÂY", "đa dạng"], [290, 1040, "pc-dau", "ĐẬU", "thực phẩm"], [790, 1040, "pc-ngu-coc", ["NGŨ CỐC", "NGUYÊN HẠT"], "chất xơ"]];
// the community the foods feed in scene H: x, y of the bottom centre, the layer, the width
const CROWDH = [[150, 700, "pc-vi-khuan", 200], [400, 700, "pc-coc", 140], [650, 700, "pc-xoan", 200], [890, 700, "pc-vi-khuan", 180], [260, 880, "pc-coc", 150], [520, 880, "pc-vi-khuan", 230], [780, 880, "pc-nam-men", 180], [130, 1060, "pc-xoan", 190], [370, 1060, "pc-vi-khuan", 190], [620, 1060, "pc-coc", 150], [870, 1060, "pc-xoan", 190]];
const GERM = [790, 700], PILL = [260, 430]; // where the harmful microbe and the antibiotic pill sit in scene G
// how long the antibiotic's wave takes to reach a point: it leaves the pill at 70 px and travels 820 px a second
const wave = (x, y) => Math.max(0, (Math.hypot(x - PILL[0], y - PILL[1]) - 70) / 820);

const SCENES = [
  // A: the whole person on the cream page. The camera goes in to the face for "Hãy nghĩ lại!", then in through it to the
  // chest, where the tissue takes over and the swarm balloons out of the point the next scene's iris closes on
  {
    shots: ["hook", "1", "2"],
    draw(ts, i, u) {
      const t1 = shotLen("hook") + GAP, t2 = t1 + shotLen("1") + GAP; // when shots 1 and 2 begin
      const X = 540, Y = 1240, W = personW(920), H = tall("pg-nguoi", W), fy = Y - FACE[1] * H, cy = Y - CHEST[1] * H;
      const tThink = t1 + said("1", "nghĩ lại"), tTri = t2 + said("2", "hàng nghìn tỷ");
      const in1 = sm(t1 + 0.02, t1 + 0.85, ts), dive = sm(t2 - 0.1, t2 + 1.5, ts), tissue = sm(t2 + 0.7, t2 + 1.5, ts);
      const z = 1 + in1 + (3 * sm(t2 - 0.3, t2 + 0.7, ts) + 4 * sm(t2 + 0.7, t2 + 1.5, ts)) * in1;
      const ty = fy + 102 * in1 + 198 * dive, fyy = fy + (cy - fy) * dive;
      const shake = ts > tThink ? 10 * Math.sin((ts - tThink) * 40) * Math.exp(-(ts - tThink) * 10) : 0;
      plate("pl-giay-vang", ts, sceneLen("hook", "1", "2"), 0.5, 1.08, 1.11);
      // the camera is on the face, then sinks to the chest (the figure grows out of the frame); a jolt on "Hãy nghĩ lại!"
      out.save();
      out.translate(540 + shake, ty); out.scale(z, z); out.translate(-540, -fyy);
      P("pg-nguoi", X, Y, W, { alpha: 1 - tissue });
      out.restore();
      // the stamp on the chest, at its size on screen (inside the camera it grew to a banner as wide as the frame)
      const think = pop(tThink, ts, 0.4) * (1 - sm(t2 - 0.5, t2 - 0.2, ts));
      if (think > 0) { out.save(); out.translate(540 + shake, ty + z * (cy - fyy)); out.rotate(-0.04); badge("HÃY NGHĨ LẠI!", 0, 0, think, RED, 56); out.restore(); }
      // the tissue the camera has passed into
      if (tissue > 0) {
        out.save(); out.globalAlpha = tissue; plate("pl-mo", ts, sceneLen("hook", "1", "2"), 0.5, 1, 1.07); out.restore();
        glow(540, 760, 560, 0.7 * tissue, "255,220,150");
      }
      chip("CƠ THỂ BẠN", 245, fy + 8, pop(said("hook", "cơ thể"), ts) * (1 - sm(t1 - 0.1, t1 + 0.2, ts)), { size: 46 }); // nearer the frame's edge: the label is wider than the English one
      // the swarm balloons out of the chest as "hàng nghìn tỷ" is said: the ones above stay under the label, the ones below
      // above the captions
      SWARM.forEach((s, j) => {
        const k = sm(tTri + s.t, tTri + s.t + 0.9, ts), w = s.w * (0.3 + 0.7 * k) * pop(tTri + s.t - 0.05, ts, 0.3);
        if (w <= 0) return;
        P(MICRO[s.kind], 540 + Math.cos(s.a) * s.at * 0.95 * k, 760 + Math.sin(s.a) * s.at * (Math.sin(s.a) < 0 ? 0.42 : 0.8) * k + 10 * Math.sin(ts * 2 + j), w, { rot: s.rot + 0.1 * Math.sin(ts * 1.3 + j), flip: s.flip });
      });
      chip("SINH VẬT TÍ HON", 540, 296, pop(t2 + said("2", "sinh vật tí hon"), ts), { size: 46 });
      const tw = ts - (t2 + said("2", "cư trú ngay trong"));
      stars(540, 760, 430, ts, 16, tw > 0 ? sm(tw, tw + 0.5, ts) : 0);
    },
  },
  // B: in the tissue. A bacterium buds again and again around the sheet of the number; the sheet then rises and the
  // human cells' sheet comes under it
  {
    shots: ["3", "4"],
    cut: "iris",
    iris: [540, 760],
    draw(ts, i, u) {
      const t4 = shotLen("3") + GAP, t38 = said("3", "38"), tNum = t4 + said("4", "số tế bào người");
      const GEN = [0, said("3", "nghìn tỷ"), said("3", "tế bào"), said("3", "vi khuẩn")], rise = sm(t4 + 0.15, t4 + 0.85, ts), fade = 1 - sm(t4 + 0.15, t4 + 0.5, ts);
      plate("pl-mo", ts, sceneLen("3", "4"), 0.5, 1, 1.07);
      // the generations: one, two, four, eight. Each new pair appears where its parent stands and slides to its place
      const now = [];
      SLOTS.forEach(([x, y, name, w, parent], j) => {
        const g = j < 1 ? 0 : j < 3 ? 1 : j < 7 ? 2 : 3, born = j ? GEN[g] : 0.1, k = pop(born, ts, 0.35);
        if (k <= 0) return;
        const slide = sm(j ? born : t38 + 0.1, (j ? born : t38 + 0.1) + 0.45, ts), from = j ? now[parent] : [540, 900];
        now[j] = [mid(from[0], x, slide), mid(from[1], y, slide)];
        P(name, now[j][0], now[j][1] - 40 * Math.sin(Math.PI * slide), mid(j ? w : 320, w, slide) * k, { rot: 0.08 * Math.sin(ts * 1.5 + j), flip: j % 2, alpha: fade });
      });
      board(540, 760 - 220 * rise, pop(t38, ts, 0.5), "38", TEAL, "TẾ BÀO VI KHUẨN");
      P("pc-vi-khuan", 955, 610, 170 * pop(t4 + 0.3, ts), { flip: 1 });
      P("pc-te-bao", 132, 1032, 165 * pop(tNum + 0.25, ts));
      board(540, 1000, pop(tNum, ts, 0.5), "30", "#c8563a", "TẾ BÀO NGƯỜI");
      // two lines, so the label reaches further down than one: raised to stay clear of the risen sheet of the 38
      chip(["NGƯỜI TRƯỞNG THÀNH", "TRUNG BÌNH"], 540, 250, pop(said("3", "trưởng thành"), ts), { size: 46 }); // in a typical adult
      // "Bậc độ lớn" opens the line, while the sheet above is still rising: the label waits for the sheet
      chip("CÙNG BẬC ĐỘ LỚN", 540, 770, pop(Math.max(t4 + 0.8, t4 + said("4", "Bậc độ lớn")), ts), { size: 44 });
    },
  },
  // C: the person again, with the three places microbes live. Then the camera goes in to the large intestine and the
  // bacteria of the whole body gather in it
  {
    shots: ["5", "6"],
    cut: "sheet",
    draw(ts, i, u) {
      const t6 = shotLen("5") + GAP;
      const X = 480, Y = 1240, W = personW(920), s = tall("pg-nguoi", W) / 920, cy = Y - GUT_MID * s;
      const [mx, my] = bodyPt(X, Y, W, SMILE[0], SMILE[1]);
      const tSkin = said("5", "trên da"), tMouth = said("5", "trong miệng"), tTract = said("5", "đường tiêu hóa"), tMost = t6 + said("6", "phần lớn"), tLarge = t6 + said("6", "đại tràng");
      // the camera closes in on the whole tract at "phần lớn" (most), holds while "đại tràng" (the large intestine) is
      // ringed and named, and only then goes in, finished before the next scene's iris (the line has a pause after it,
      // loi.js); the ring is gone before the gut's own backdrop is up. The first shot's three labels leave in the first
      // third of the second (no change covers that boundary) and the camera waits for them, so their pointers stay on
      // what they name
      const zoom = sm(tMost - 0.02, tMost + 0.7, ts), deep = sm(tLarge + 0.9, tLarge + 1.65, ts), gut = sm(tLarge + 1.1, tLarge + 1.75, ts);
      const z = (1 + 1.4 * zoom) * (1 + 0.67 * deep), labels = 1 - sm(t6, t6 + 0.3, ts);
      plate("pl-giay-vang", ts, sceneLen("5", "6"), 0.5, 1.07, 1.11);
      if (gut > 0) { out.save(); out.globalAlpha = gut; plate("pl-ruot", ts, sceneLen("5", "6"), 0.5, 1, 1.16); out.restore(); }
      // the camera, on the middle of the large intestine
      out.save();
      out.translate(540, cy - 20 * deep); out.scale(z, z); out.translate(-X, -cy);
      P("pg-nguoi", X, Y, W, { alpha: 1 - gut });
      PAPER = 1 / z; // the tract's shadow and lines stay as wide as they are on screen while the camera closes in
      tract(X, Y, s, i ? 1 : sm(tTract - 0.05, tTract + 0.45, ts));
      PAPER = 1;
      out.save();
      // in shot 6 the skin's dots and the smile's ring go out as the camera closes in
      out.globalAlpha = i ? 1 - sm(t6, t6 + 0.4, ts) : 1;
      bodyLight(X, Y, W, i ? 1 : sm(tSkin, tSkin + 0.6, ts), ts, { shade: 0, skin: 1, since: i ? 9 : ts - tSkin });
      oval(mx, my + 2, 56, 26, i ? 1 : sm(tMouth, tMouth + 0.45, ts));
      out.restore();
      if (i) {
        // the bacteria of the body gather along the large intestine, one after another from "most"
        GATHER.forEach((b, j) => {
          const k = sm(tMost + 0.03 * j, tMost + 0.5 + 0.03 * j, ts); // the last of them is in before the camera goes down
          if (k <= 0) return;
          const [gx, gv, ux, uy] = along(COLON, 18, b.t), side = (j % 2 ? 1 : -1) * 8, [sx, sy] = bodyPt(X, Y, W, b.u, b.v);
          const x = mid(sx, X + (gx - uy * side) * s, k), y = mid(sy, Y - (gv + ux * side) * s, k);
          glow(x, y, 36 * s, 0.8 * k);
          out.fillStyle = GOOD[j % 5]; out.beginPath(); out.arc(x, y, b.r * s * (0.8 + 0.2 * Math.sin(ts * 4 + j)), 0, 7); out.fill();
          out.lineWidth = 2.5 / Math.max(1, z); out.strokeStyle = INK; out.stroke();
        });
        oval(X, cy, 132 * s, 126 * s, sm(tLarge, tLarge + 0.4, ts) * (1 - sm(tLarge + 1.05, tLarge + 1.35, ts)));
      }
      out.restore();
      if (labels > 0) {
        // the three places, each named on its word with a pointer that stops short of the skin (the figure is drawn
        // under the camera, which puts its middle line on 540): the hand's edge is at 700, the cheek's at 617
        out.save();
        out.globalAlpha = pop(tSkin + 0.1, ts) * labels; stick(785, 800, 716, 800, 9, CREAM, 4);
        out.globalAlpha = pop(tMouth + 0.1, ts) * labels; stick(790, 424, 632, 457, 9, CREAM, 4); // "MIỆNG" is a narrow label: the pointer starts further in
        out.globalAlpha = pop(tTract + 0.1, ts) * labels; stick(762, 536, 636, 672, 9, CREAM, 4);
        out.restore();
        chip("LÀN DA", 860, 800, pop(tSkin + 0.1, ts) * labels, { size: 46 });
        chip("MIỆNG", 860, 420, pop(tMouth + 0.1, ts) * labels, { size: 46 });
        chip(["ĐƯỜNG", "TIÊU HÓA"], 860, 520, pop(tTract + 0.1, ts) * labels, { size: 46 });
      }
      if (i) {
        out.save(); out.globalAlpha = pop(tLarge - 0.12, ts) * (1 - deep); stick(540, 1106, 540, 1020, 9, CREAM, 4); out.restore();
        chip("ĐẠI TRÀNG", 540, 1150, pop(tLarge, ts) * (1 - deep), { size: 46 });
      }
    },
  },
  // D: in the gut. The community all around, then four cards: the bacteria are not alone
  {
    shots: ["7", "8"],
    cut: "iris",
    iris: [540, 740],
    draw(ts, i, u) {
      const t8 = shotLen("7") + GAP, tB = said("7", "vi khuẩn"), tAlone = said("7", "cô đơn");
      const tV = t8 + said("8", "virus"), tF = t8 + said("8", "nấm"), tO = t8 + said("8", "dạng");
      plate("pl-ruot", ts, sceneLen("7", "8"), 0.5, 1, 1.16);
      community(ts);
      // a wash of pale paper lies over the gut and its community once the first card is up: they stay as a light pattern
      // behind the cards
      out.save(); out.globalAlpha = 0.72 * sm(tB + 0.2, tB + 0.8, ts); out.fillStyle = WASH; out.fillRect(0, 0, OW, OH); out.restore();
      CARDS.forEach(([x, y, rot, seed], j) => card(x, y, 440, 380, rot, pop(j ? tAlone + 0.12 * (j - 1) : tB - 0.05, ts, 0.5), seed));
      // what each card holds, in its own turn: the virus is a phage, a machine, never a living cell
      const inCard = (j, draw) => { const [x, y, rot] = CARDS[j]; out.save(); out.translate(x, y); out.rotate(rot); draw(); out.restore(); };
      inCard(0, () => { P("pc-vi-khuan", 0, 70, 300 * pop(tB + 0.05, ts)); chip("VI KHUẨN", 0, 142, pop(tB + 0.15, ts), { size: 40 }); });
      inCard(1, () => { P("pc-virut", 0, 70, 130 * pop(tV, ts)); chip("VIRUS", 0, 142, pop(tV + 0.1, ts), { size: 40 }); });
      inCard(2, () => { P("pc-nam-men", 0, 70, 230 * pop(tF, ts)); chip("NẤM", 0, 142, pop(tF + 0.1, ts), { size: 40 }); });
      inCard(3, () => { P("pc-don-bao", 0, 70, 290 * pop(tO, ts), { flip: 1 }); chip("VI SINH VẬT KHÁC", 0, 142, pop(tO + 0.1, ts), { size: 32 }); }); // a longer label on a card 440 wide, even while pop() overshoots
      chip("HỆ VI SINH VẬT CỦA BẠN", 540, 290, pop(t8 + said("8", "vi sinh vật"), ts), { size: 48 });
    },
  },
  // E: fiber from the vegetables goes into a bacterium; what it makes drops into the cells of the lining and brings
  // them to life
  {
    shots: ["9"],
    cut: "band",
    draw(ts) {
      const tGB = said("9", "vi khuẩn đường ruột"), tFiber = said("9", "chất xơ"), tCant = said("9", "không tự tiêu hóa"), tProd = said("9", "tạo ra"), tComp = said("9", "hợp chất"), tKeep = said("9", "giúp"), tHealthy = said("9", "khỏe mạnh");
      const chew = sm(tFiber, tFiber + 0.3, ts) * (1 - sm(tFiber + 2.3, tFiber + 2.7, ts)); // the bacterium chews while the fiber comes
      plate("pl-ruot", ts, sceneLen("9"), 0.5, 1, 1.16);
      out.save(); out.globalAlpha = 0.72; out.fillStyle = WASH; out.fillRect(0, 0, OW, OH); out.restore();
      stars(540, 1060, 470, ts, 14, sm(tKeep, tKeep + 0.5, ts));
      for (let c = 0; c < 6; c++) brick(70 + c * 158, 1000, 220 + c * 158, 1120, sm(tKeep + 0.09 * c, tKeep + 0.45 + 0.09 * c, ts), sm(tComp + 0.05 + 0.07 * c, tComp + 0.4 + 0.07 * c, ts));
      // the threads of fiber crawl from the vegetables into the bacterium (drawn under it, so they vanish into it)
      for (let j = 0; j < 3; j++) for (let wv = 0; wv < 2; wv++) {
        const t0 = tFiber - 0.15 + 0.3 * j + 1.0 * wv, p = sm(t0, t0 + 0.8, ts);
        if (t0 > tProd - 1.25 || p <= 0) continue; // no thread sets out later than that, so the last is in before the compounds come out
        strand(STRANDS[j], 13, STRAND_COLOURS[j], Math.max(0, p - 0.55), p, ts, j);
      }
      // the three compounds come out of the bacterium on "producing", wait beside their label, and drop into the lining
      // on "help keep"
      [[560, 900], [660, 950], [760, 880]].forEach(([hx, hy], j) => {
        const leave = sm(tProd + 0.25 * j, tProd + 0.6 + 0.25 * j, ts), drop = sm(tKeep + 0.1 * j, tKeep + 0.5 + 0.1 * j, ts);
        if (leave <= 0) return;
        // out of the bacterium in a small arc, then straight down into its cell of the lining
        molecule(mid(mid(830, hx, leave), hx, drop), mid(mid(790, hy, leave) - 60 * Math.sin(Math.PI * leave), hy, drop), pop(tProd + 0.25 * j, ts, 0.35), 0.2 * Math.sin(ts * 2 + j));
      });
      P("pc-vi-khuan", 640, 800, 400 * pop(tGB - 0.1, ts) * (1 + 0.05 * Math.sin(ts * 14) * chew), { flip: 1 }); // turned: it faces the food
      P("pc-rau", 230, 520, 330 * pop(0.2, ts), { rot: 0.03 * Math.sin(ts * 1.7) });
      chip("CHẤT XƠ", 230, 600, pop(tFiber, ts), { size: 46 });
      out.save(); out.globalAlpha = pop(tCant + 0.05, ts); stick(452, 272, 402, 392, 9, CREAM, 4); out.restore(); // from under the badge's left end, a longer way: the badge sits higher
      badge("KHÔNG TỰ TIÊU HÓA ĐƯỢC", 740, 250, pop(tCant + 0.05, ts), RED, 34); // the sentence is longer in Vietnamese: higher up, where there is room
      chip(["VI KHUẨN", "ĐƯỜNG RUỘT"], 640, 540, pop(tGB + 0.1, ts), { size: 40 }); // on two lines, so it stays clear of the threads on its left
      chip("HỢP CHẤT", 330, 930, pop(tComp, ts), { size: 42 });
      chip("ĐƯỜNG RUỘT KHỎE MẠNH", 540, 1190, pop(tHealthy, ts), { size: 42 });
    },
  },
  // F: the lining of the gut as a wall of cells, the microbes above it and the immune cells under it; signals pass
  // through it both ways, and the wall comes to life
  {
    shots: ["10"],
    cut: "sheet",
    draw(ts) {
      const tGM = said("10", "Vi sinh vật đường ruột"), tInter = said("10", "tương tác"), tImm = said("10", "hệ miễn dịch"), tMaint = said("10", "duy trì"), tBar = said("10", "bảo vệ"), tLine = said("10", "trong ruột");
      plate("pl-giay-xanh", ts, sceneLen("10"), 0.5, 1.15, 1.19);
      stars(540, 845, 480, ts, 14, sm(tLine, tLine + 0.5, ts));
      const line = sm(tMaint + 0.05, tMaint + 0.7, ts);
      if (line > 0) stick(0, 750, 1080 * line, 750, 14, GOLD, 4);
      for (let c = 0; c < 7; c++) brick(c * 154.3 + 1.5, 760, c * 154.3 + 152.8, 930, sm(tBar + 0.08 * c, tBar + 0.45 + 0.08 * c, ts), sm(tMaint + 0.07 * c, tMaint + 0.4 + 0.07 * c, ts));
      // the signals: a bead down from each of four microbes on "interact", an answer back up, a ripple where it lands
      PAIRS.forEach((m, q) => {
        const bx = TOP[m][0], t0 = tInter + 0.14 * q;
        const down = sm(t0, t0 + 0.7, ts), up = sm(t0 + 0.9, t0 + 1.6, ts), lit = sm(t0 + 0.62, t0 + 0.85, ts);
        immune(bx, 1090, 60, lit);
        // each bead grows out of what sends it in three frames (a bead switched on at its full size pops in), the one
        // going down shrinks away as it reaches its cell, and the ripple comes up with the bead that lands
        if (ts >= t0 && ts < t0 + 0.7) bead(bx, mid(612, 1025, down), "#fff3b0", sm(t0, t0 + 0.12, ts) * (1 - sm(t0 + 0.6, t0 + 0.7, ts)));
        if (ts >= t0 + 0.9 && ts < t0 + 1.6) bead(bx, mid(1025, 612, up), "#ffb36b", sm(t0 + 0.9, t0 + 1.02, ts));
        const age = (ts - (t0 + 1.6)) / 0.5;
        if (age >= 0 && age < 1) ripple(bx, 612, 26 + 44 * age, (1 - age) * Math.min(1, age * 10));
      });
      // the microbes on the lining, turned to face its middle; they pop in under the sheet and after it
      TOP.forEach(([x, name, w], j) => P(name, x, 600 + 9 * Math.sin(ts * 2.1 + j * 1.3), w * pop(0.15 + 0.07 * j, ts, 0.4), { rot: 0.12 * Math.sin(ts * 1.3 + j), flip: x > 540 ? 1 : 0 }));
      chip("VI SINH VẬT ĐƯỜNG RUỘT", 540, 300, pop(tGM, ts), { size: 48 });
      chip("LỚP BẢO VỆ", 540, 668, pop(tBar, ts), { size: 40 });
      chip("HỆ MIỄN DỊCH", 540, 1090, pop(tImm, ts), { size: 36 });
    },
  },
  // G: the community again. A harmful microbe pushes in and the light goes out; then a pill, and its wave shrinks most
  // of the bacteria away with the harmful one
  {
    shots: ["11", "12"],
    cut: "band",
    draw(ts, i, u) {
      const t12 = shotLen("11") + GAP, tSome = said("11", "số vi sinh vật"), tSick = said("11", "gây bệnh");
      const tAB = t12 + said("12", "Thuốc kháng sinh"), tEss = t12 + said("12", "cần thiết"), tDis = t12 + said("12", "rối loạn"), tHelp = t12 + said("12", "vi khuẩn tốt");
      plate("pl-ruot", ts, sceneLen("11", "12"), 0.5, 1, 1.16);
      community(ts, (j, x, y) => {
        // the ones near the harmful microbe give way
        const d = Math.hypot(x - GERM[0], y - GERM[1]), away = d < 330 ? (1 - d / 330) * 110 * sm(tSome + 0.25, tSome + 0.9, ts) : 0;
        return d > 1 ? [((x - GERM[0]) / d) * away, ((y - GERM[1]) / d) * away] : [0, 0];
      }, (j, x, y) => 1 - (j % 5 < 3 ? sm(tDis + wave(x, y), tDis + wave(x, y) + 0.3, ts) : 0)); // three in five go
      // the light of the gut goes out as the harmful one is named
      out.save(); out.globalAlpha = 0.3 * sm(tSick, tSick + 0.5, ts); out.fillStyle = "#3a1024"; out.fillRect(0, 0, OW, OH); out.restore();
      const germGone = sm(tDis + wave(GERM[0], GERM[1]), tDis + wave(GERM[0], GERM[1]) + 0.4, ts);
      pathogen(mid(1180, GERM[0], sm(tSome - 0.1, tSome + 0.45, ts)), GERM[1], 1, ts, 1 - germGone);
      for (let n = 0; n < 3; n++) {
        const age = ts - tDis - 0.15 * n;
        if (age <= 0 || age >= 1.3) continue;
        // each wave comes up in a few frames: at its full strength at once, its first arcs would pop out from behind the pill
        out.save(); out.globalAlpha = (1 - age / 1.3) * 0.9 * Math.min(1, age / 0.1); out.strokeStyle = "#fff3b0"; out.lineWidth = 10; out.beginPath(); out.arc(PILL[0], PILL[1], 70 + 820 * age, 0, 7); out.stroke(); out.restore();
      }
      const since = ts - tDis;
      capsule(PILL[0], PILL[1], pop(tAB, ts, 0.5), -0.5 + (since > 0 ? 0.08 * Math.sin(since * 30) * Math.exp(-since * 4) : 0));
      const gone = 1 - sm(t12 - 0.1, t12 + 0.2, ts); // the first shot's marks leave before the antibiotic's line
      out.save(); out.globalAlpha = gone; ring(GERM[0], GERM[1], 104, sm(tSick, tSick + 0.45, ts)); out.restore();
      badge("GÂY BỆNH", 800, 548, pop(tSick + 0.05, ts) * gone, RED, 32);
      chip("THUỐC KHÁNG SINH", 285, 580, pop(tAB + 0.1, ts), { size: 38 }); // a longer label: smaller, and its edge kept off the frame's
      out.save(); out.globalAlpha = pop(tEss, ts); stick(446, 420, 372, 420, 9, CREAM, 4); out.restore();
      badge("ĐÔI KHI RẤT CẦN THIẾT", 706, 420, pop(tEss, ts), GREEN, 34);
      chip("ÍT VI KHUẨN TỐT HƠN", 540, 1186, pop(tHelp + 0.1, ts), { size: 42 }); // clear of the bacteria that drift past its ends
    },
  },
  // H: four kinds of fiber-rich food on the cream page; on "nuôi dưỡng" they line up on the gut and the community comes up
  // under them, and "Chế độ ăn uống … quan trọng" is stamped over it
  {
    shots: ["13", "14"],
    cut: "sheet",
    draw(ts, i, u) {
      const t14 = shotLen("13") + GAP, tNour = said("13", "nuôi dưỡng");
      // a tenth of a second later than the English scene: in Vietnamese "nuôi dưỡng" comes closer to "chất xơ", the word
      // the whole-grains label waits for, and the label had no time to reach its size before it left
      const move = sm(tNour + 0.1, tNour + 0.75, ts), tMat = t14 + said("14", "quan trọng");
      plate("pl-giay-vang", ts, sceneLen("13", "14"), 0.5, 1.07, 1.11);
      out.save();
      out.globalAlpha = move; plate("pl-ruot", ts, sceneLen("13", "14"), 0.5, 1, 1.16);
      out.globalAlpha = 0.72 * move; out.fillStyle = WASH; out.fillRect(0, 0, OW, OH);
      out.restore();
      FOOD.forEach(([gx, gy, name, label, on], j) => {
        const at = typeof on === "number" ? on : said("13", on);
        const x = mid(gx, 150 + 240 * j, move), y = mid(gy, 505, move), w = mid(350, 200, move) * pop(at, ts, 0.5);
        P(name, x, y - 6 * Math.sin(ts * 2.4 + j * 1.9) * move, w, { rot: 0.04 * Math.sin(ts * 1.6 + j) });
        chip(label, gx, gy + 66, pop(at + 0.25, ts) * (1 - move), { size: 40 });
      });
      chip("THỰC PHẨM GIÀU CHẤT XƠ", 540, 300, pop(said("13", "giàu chất xơ"), ts) * (1 - move), { size: 44 });
      // the community comes up under the row of foods, one by one, from when the food labels are more than half gone: coming
      // up with the move, as the English scene does, a bacterium of the first row popped over the labels "RAU" and "TRÁI CÂY"
      // for a quarter of a second while they were still almost whole
      CROWDH.forEach(([x, y, name, w], j) => {
        const k = pop(tNour + 0.4 + 0.06 * j, ts, 0.4);
        if (k <= 0) return;
        P(name, x, y + 6 * Math.sin(ts * 2 + j * 1.7), w * k, { rot: 0.1 * Math.sin(ts * 1.3 + j), flip: name === "pc-vi-khuan" && x > 540 ? 1 : 0 });
      });
      chip("NHIỀU VI KHUẨN TỐT", 540, 1140, pop(said("13", "tốt"), ts), { size: 42 }); // the beneficial gut microbes
      badge("CHẾ ĐỘ ĂN RẤT QUAN TRỌNG!", 540, 318, pop(t14 + 0.1, ts), GREEN, 40);
      stars(540, 800, 480, ts, 14, sm(tMat, tMat + 0.5, ts));
    },
  },
  // I: back in the gut, on the large intestine. The camera pulls out to the whole person; its microbes light up on
  // "một sinh vật" (one organism), the whole body on "cả một hệ sinh thái" (an entire ecosystem); the last shot holds
  // the question on a card
  {
    shots: ["15", "16", "kết"],
    cut: "iris",
    iris: [540, 772],
    draw(ts, i, u) {
      const t16 = shotLen("15") + GAP, tK = t16 + shotLen("16") + GAP;
      const tOne = said("15", "một sinh vật"), tEnt = t16 + said("16", "cả một"), tEco = t16 + said("16", "hệ sinh thái");
      const X = 540, Y = 1225, W = personW(850), s = tall("pg-nguoi", W) / 920;
      const z = 2.6 - 1.6 * sm(0.3, 1.4, ts), eco = sm(tEnt, tEnt + 0.7, ts);
      plate("pl-giay-xanh", ts, sceneLen("15", "16", "kết"), 0.5, 1.15, 1.19);
      glow(540, 800, 600, 0.45 * sm(0.4, 1.2, ts) + 0.55 * eco);
      // the camera pulls out from the large intestine to the whole figure, the feet at 1225 px just above the captions
      out.save();
      out.translate(540, 772); out.scale(z, z); out.translate(-540, -772);
      P("pg-nguoi", X, Y, W);
      out.save(); out.globalAlpha = 1 - sm(0.5, 1.1, ts); tract(X, Y, s, 1); out.restore();
      // the shade comes up as the iris opens (it never comes on in one frame), the light spreads from "một sinh vật", and
      // the second crowd from "cả một"; the head stays as painted
      bodyLight(X, Y, W, sm(0.3, 1.3, ts), ts, { since: ts - tOne, shade: 0.8, dim: sm(0.2, 0.8, ts), eco, clear: 0.755, many: eco, sinceMany: ts - tEnt });
      out.restore();
      chip("CẢ MỘT HỆ SINH THÁI", 540, 285, pop(tEnt + 0.1, ts), { size: 52 });
      stars(540, 830, 430, ts, 16, sm(tEco, tEco + 0.5, ts));
      // the question of the outline's last scene, on screen only and not read: "What surprised you most?"
      if (i === 2) {
        const k = pop(tK + 0.1, ts, 0.6);
        if (k > 0) {
          out.save(); out.translate(540, 1010); out.scale(k, k); out.translate(-540, -1010);
          piece(() => torn(100, 840, 980, 1180, 9, 9, 62), "#f1e6cb", { line: 7 });
          text("Điều gì khiến bạn", 540, 952, 80, INK, "center", 800, 0.01);
          text("ngạc nhiên nhất?", 540, 1066, 80, "#c8563a", "center", 900, 0.01);
          out.restore();
        }
      }
    },
  },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, look: "storybook", stickers: CUTS.filter((n) => n.startsWith("pc-")) });
