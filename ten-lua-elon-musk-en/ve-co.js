// The engine cut-out of this story, drawn by code in the paper-cut look of the story on flat magenta, as the layers the
// model makes are (anh.js). The model could not be made to keep the structure of the source video's engine: started from
// a sketch of it, it copied the sketch flat, with no paper in it, and left free it drew the pipe as a string of pearls and
// the bell with one ring (2026-11-24). So the picture is drawn here, part for part and in the proportions of the source
// (frame 6 of snaptik.vn_7710883445316128021.mp4, 576x1024, measured row by row): a short cylinder on a wide rounded box
// (the head), a short ribbed pump on each side of the upper part of the head joined to it by a stub, a white pipe of three
// beads from the bottom of the right pump into the side of the short gold chamber below the head, a dark collar, and one
// wide bell of thin vertical tubes with three rings and a dark opening at its rim. The numbers below are pixels of that
// frame; the bell is 428 wide there and the engine 786 tall, from the top of the cylinder to the lower edge of the opening.
// Usage: node ve-co.js [out png]      default anh/pc-co.png beside this file; needs PLAYWRIGHT_PATH, as .env holds
const { chromium } = require(process.env.PLAYWRIGHT_PATH);
const fs = require("fs"), path = require("path");
const out = process.argv[2] || path.join(__dirname, "anh", "pc-co.png");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  const data = await page.evaluate(() => {
    const W = 1536, H = 2304, S = 2.55, AX = 290, TIPX = 214.5, TOP = 306, TIP = 790, UP = 44, DOWN = 32;
    const OX = (W - 428 * S) / 2 - 77 * S, OY = (H - 786 * S) / 2 - 26 * S;
    const X = (x) => OX + x * S, Y = (y) => OY + y * S, u = (v) => v * S;
    const INK = "#241b16", PALE = "#a3a8be";
    let seed = 20261124;
    const rnd = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const a = Object.assign(document.createElement("canvas"), { width: W, height: H }), g = a.getContext("2d");
    const rr = (x, y, w, h, r) => { const p = new Path2D(); p.roundRect(X(x), Y(y), u(w), u(h), Array.isArray(r) ? r.map(u) : u(r)); return p; };
    const rect = (x, y, w, h) => { const p = new Path2D(); p.rect(X(x), Y(y), u(w), u(h)); return p; };
    const disc = (x, y, r) => { const p = new Path2D(); p.arc(X(x), Y(y), u(r), 0, 7); return p; };
    // a piece of paper: its fill, with the shadow it throws on the paper under it when it is glued over one, then its
    // dark outline (line in pixels of the frame)
    const paper = (p, fill, { line = 3, shadow = 0, ink = INK } = {}) => {
      g.fillStyle = fill;
      if (shadow) { g.save(); g.shadowColor = "rgba(28,16,12,.6)"; g.shadowBlur = u(3); g.shadowOffsetX = u(0.6); g.shadowOffsetY = u(1.8); g.fill(p); g.restore(); }
      g.fill(p);
      if (line > 0) { g.lineJoin = "round"; g.lineWidth = u(line); g.strokeStyle = ink; g.stroke(p); }
    };
    // a lighter or darker sheet lying over part of a piece, without an outline
    const over = (piece, p, fill) => { g.save(); g.clip(piece); g.fillStyle = fill; g.fill(p); g.restore(); };
    const rule = (piece, y0, x0, x1, colour, w) => { g.save(); g.clip(piece); g.strokeStyle = colour; g.lineWidth = u(w); g.beginPath(); g.moveTo(X(x0), Y(y0)); g.lineTo(X(x1), Y(y0)); g.stroke(); g.restore(); };

    // half the width of the bell at rows of the frame, from the collar to the tips of its rim; resampled every pixel and
    // smoothed, so the outline has no kinks at the measured rows
    const ROWS = [[311, 52], [318, 58.5], [324, 66], [342, 79], [360, 90.5], [384, 105], [408, 117.5], [426, 126], [444, 133.5], [480, 148], [540, 169], [594, 182.5], [660, 197], [702, 204.5], [738, 209], [762, 212], [790, 214.5]];
    const r = new Float64Array(791);
    for (let y = 300; y <= 790; y++) { let k = 0; while (y > ROWS[k + 1][0]) k++; r[y] = y <= ROWS[k][0] ? ROWS[k][1] : ROWS[k][1] + (ROWS[k + 1][1] - ROWS[k][1]) * ((y - ROWS[k][0]) / (ROWS[k + 1][0] - ROWS[k][0])); }
    for (let pass = 0; pass < 3; pass++) { const c = r.slice(); for (let y = 316; y < 786; y++) r[y] = (c[y - 1] + 2 * c[y] + c[y + 1]) / 4; }
    const half = (y) => r[Math.max(300, Math.min(790, Math.round(y)))];
    // the bell: down the left side to the tip of the rim, over the far edge of the opening, back up the right side
    const bell = new Path2D();
    bell.moveTo(X(AX - half(TOP)), Y(TOP));
    for (let y = TOP; y <= TIP; y++) bell.lineTo(X(AX - half(y)), Y(y));
    bell.quadraticCurveTo(X(AX), Y(TIP - UP), X(AX + TIPX), Y(TIP));
    for (let y = TIP; y >= TOP; y--) bell.lineTo(X(AX + half(y)), Y(y));
    bell.closePath();
    // a sheet lying on the bell between the shares f0 and f1 of its half width
    const zone = (f0, f1) => { const p = new Path2D(); p.moveTo(X(AX + f0 * half(TOP)), Y(TOP)); for (let y = TOP; y <= TIP; y += 2) p.lineTo(X(AX + f0 * half(y)), Y(y)); for (let y = TIP; y >= TOP; y -= 2) p.lineTo(X(AX + f1 * half(y)), Y(y)); p.closePath(); return p; };
    // a ring round the bell from row ya to row yb: its near side hangs bow px lower than its ends
    const ring = (ya, yb, bow = 6) => { const p = new Path2D(), ra = half(ya) + 1.5, rb = half(yb) + 1.5; p.moveTo(X(AX - ra), Y(ya)); p.quadraticCurveTo(X(AX), Y(ya + 2 * bow), X(AX + ra), Y(ya)); p.lineTo(X(AX + rb), Y(yb)); p.quadraticCurveTo(X(AX), Y(yb + 2 * bow), X(AX - rb), Y(yb)); p.closePath(); return p; };
    // the opening of the nozzle seen from a little below: a lens between the far edge and the near edge of the rim
    const mouth = new Path2D();
    mouth.moveTo(X(AX - TIPX), Y(TIP)); mouth.quadraticCurveTo(X(AX), Y(TIP - UP), X(AX + TIPX), Y(TIP)); mouth.quadraticCurveTo(X(AX), Y(TIP + DOWN), X(AX - TIPX), Y(TIP)); mouth.closePath();

    const knob = rr(254, 26, 67, 24, 5), head = rr(203, 47, 168, 149, 24), collar = rr(238, 302, 104, 10, 4);
    const chamber = new Path2D(); chamber.roundRect(X(234), Y(184), u(108), u(116), [0, 0, u(18), u(18)]);
    const pumps = [[rr(115, 64, 77, 148, [38.5, 38.5, 20, 20]), 115, 192, [105, 147, 183]], [rr(386, 76, 71, 138, [33, 33, 19, 19]), 386, 457, [115, 150, 177]]];

    // ---------- the drawing, back to front ----------
    paper(knob, "#c2c3d4", { line: 2.6 }); over(knob, rect(254, 26, 36, 24), "#e1e2ec");
    paper(bell, "#b6bfd1");
    over(bell, zone(-0.7, 0.18), "#d6dbe6"); over(bell, zone(0.66, 1.02), "#9ea7bb");
    // the tubes: thin lines that follow the flare of the bell, crowding toward its edges as tubes seen from the side do
    g.save(); g.clip(bell); g.strokeStyle = "rgba(104,116,140,.6)"; g.lineWidth = u(0.9);
    for (let k = -21; k <= 21; k++) { const f = k / 22; g.beginPath(); g.moveTo(X(AX + f * half(340)), Y(340)); for (let y = 340; y <= TIP; y += 4) g.lineTo(X(AX + f * half(y)), Y(y)); g.stroke(); }
    g.restore();
    for (const [ya, yb] of [[324, 335], [424, 436], [597, 611]]) {
      paper(ring(ya, yb), "#7c87a2", { line: 2.6, shadow: 1 });
      g.save(); g.strokeStyle = "#c9cedb"; g.lineWidth = u(1.5); g.beginPath(); const ym = (ya + yb) / 2, rm = half(ym) + 1.5; g.moveTo(X(AX - rm), Y(ym)); g.quadraticCurveTo(X(AX), Y(ym + 12), X(AX + rm), Y(ym)); g.stroke(); g.restore();
    }
    paper(mouth, "#3b251f", { line: 2.6, shadow: 1 });
    g.save(); g.strokeStyle = "#eceef3"; g.lineWidth = u(2); g.lineCap = "round"; g.beginPath(); g.moveTo(X(AX + TIPX - 6), Y(TIP)); g.quadraticCurveTo(X(AX), Y(TIP + DOWN - 5), X(AX - TIPX + 6), Y(TIP)); g.stroke(); g.restore();
    paper(collar, "#4a4d62", { line: 2.2, shadow: 1 });
    paper(chamber, "#dfa244", { line: 3, shadow: 1 }); over(chamber, rect(234, 184, 52, 116), "#eec06a"); rule(chamber, 254, 234, 342, "#b4772b", 1.6);
    paper(head, "#b6b7cb", { line: 3, shadow: 1 }); over(head, rect(203, 47, 116, 149), "#d9dbe7"); over(head, rect(212, 47, 64, 149), "#e9ebf2");
    for (const y of [92, 152]) rule(head, y, 203, 371, "#a9abbd", 1.3);
    for (const [p, x0, x1, ribs] of pumps) {
      paper(p, "#b5bccf", { line: 2.8, shadow: 1 }); over(p, rect(x0, 60, (x1 - x0) * 0.68, 160), "#dde1ea");
      for (const y of ribs) { rule(p, y, x0, x1, INK, 2.4); rule(p, y + 3.4, x0, x1, "#eceef4", 1.8); }
    }
    for (const s of [rr(187, 111, 21, 14, 2.5), rr(367, 107, 23, 14, 2.5)]) paper(s, "#a9acbf", { line: 2.2, shadow: 1 });
    // the pipe: a short tube under the right pump, three beads turning left, a tube into the chamber
    paper(rr(407, 196, 29, 32, 5), "#f3f5f9", { line: 1.9, ink: PALE, shadow: 1 });
    paper(disc(417, 230, 15.5), "#f7f8fb", { line: 1.9, ink: PALE, shadow: 1 }); paper(disc(402, 246, 15.5), "#f7f8fb", { line: 1.9, ink: PALE, shadow: 1 });
    paper(rr(334, 242, 44, 24, 5), "#f3f5f9", { line: 1.9, ink: PALE, shadow: 1 }); paper(disc(373, 253, 15.5), "#f7f8fb", { line: 1.9, ink: PALE, shadow: 1 });

    // ---------- paper, not vector: the wobble of edges cut by hand, then the grain of the paper ----------
    // smooth noise: random values on a grid of `period` pixels, eased between the corners of the grid
    const field = (period) => { const gw = Math.ceil(W / period) + 3, gh = Math.ceil(H / period) + 3, v = new Float32Array(gw * gh); for (let i = 0; i < v.length; i++) v[i] = rnd() * 2 - 1; return (x, y) => { const fx = Math.max(0, Math.min(gw - 2, x / period)), fy = Math.max(0, Math.min(gh - 2, y / period)), ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy, sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty), i = iy * gw + ix, p = v[i] + (v[i + 1] - v[i]) * sx, q = v[i + gw] + (v[i + gw + 1] - v[i + gw]) * sx; return p + (q - p) * sy; }; };
    const wx = field(46), wy = field(46), rough = field(13), rough2 = field(13), mottle = field(7), blotch = field(23);
    const src = g.getImageData(0, 0, W, H), s = src.data, d = new Uint8ClampedArray(s.length);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const sx = Math.max(0, Math.min(W - 1.001, x + 1.0 * wx(x, y) + 0.35 * rough(x, y))), sy = Math.max(0, Math.min(H - 1.001, y + 1.0 * wy(x, y) + 0.35 * rough2(x, y)));
      const x0 = Math.floor(sx), y0 = Math.floor(sy), tx = sx - x0, ty = sy - y0, i00 = (y0 * W + x0) * 4, i10 = i00 + 4, i01 = i00 + W * 4, i11 = i01 + 4, o = (y * W + x) * 4;
      // sampled with alpha premultiplied, so the edge of a piece does not darken
      for (let c = 0; c < 3; c++) {
        const m = (i) => s[i + c] * s[i + 3], v = (m(i00) * (1 - tx) + m(i10) * tx) * (1 - ty) + (m(i01) * (1 - tx) + m(i11) * tx) * ty;
        d[o + c] = v / 255;
      }
      d[o + 3] = (s[i00 + 3] * (1 - tx) + s[i10 + 3] * tx) * (1 - ty) + (s[i01 + 3] * (1 - tx) + s[i11 + 3] * tx) * ty;
      // the grain: mottling, fine noise, and fibres drawn after; paler paper shows less of it
      const h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453, lum = (d[o] * 4 + d[o + 1] * 9 + d[o + 2] * 2) / 15 / 255;
      const k = 1 + (1 - 0.45 * lum) * (0.085 * mottle(x, y) + 0.05 * blotch(x, y) + 0.06 * (h - Math.floor(h) - 0.5));
      d[o] *= k; d[o + 1] *= k; d[o + 2] *= k;
    }
    g.putImageData(new ImageData(d, W, H), 0, 0);
    g.save(); g.globalCompositeOperation = "source-atop"; g.lineCap = "round";
    for (let i = 0; i < 14000; i++) {
      const x = rnd() * W, y = rnd() * H, len = 4 + rnd() * rnd() * 20, an = rnd() * Math.PI, dark = rnd() < 0.6;
      g.strokeStyle = dark ? `rgba(60,48,38,${0.03 + rnd() * 0.06})` : `rgba(255,255,255,${0.04 + rnd() * 0.08})`; g.lineWidth = 0.7 + rnd() * 0.9;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(an) * len, y + Math.sin(an) * len); g.stroke();
    }
    g.restore();
    const b = Object.assign(document.createElement("canvas"), { width: W, height: H }), bg = b.getContext("2d");
    bg.fillStyle = "#ff00ff"; bg.fillRect(0, 0, W, H); bg.drawImage(a, 0, 0);
    return b.toDataURL("image/png");
  });
  if (errors.length) throw new Error(errors.join(" | "));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(data.split(",")[1], "base64"));
  await browser.close();
  console.log(out);
})().catch((e) => { console.error(e); process.exit(1); });
