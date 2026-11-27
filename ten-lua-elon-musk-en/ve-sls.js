// The rocket cut-out of this story (the SLS), drawn by code as ve-co.js draws the engine: on flat magenta, in the
// paper-cut look of the story. The model drew three engines where the voice and the source say four, so the picture is
// drawn here part for part and in the proportions of the source video: a thin mast on a small white capsule that tapers
// upward, two short white cylinders with a line between them, a white taper widening down to the long orange core (a
// pale band on its left, a dark one on its right, two lines across it), a white section under the core, two long white
// boosters with pointed noses, two lines across each and a shaded side, a blue-grey nozzle under each booster, and four
// pale grey bells in a row under the core, each wider at the bottom than at the top and overlapping the one on its left.
// The numbers are core widths: x to the right of the rocket's axis, y up from the bottom of the four bells, measured on
// frame 115 (the whole rocket) and frame 12 (its foot) of snaptik.vn_7710883445316128021.mp4 (576x1024): the rocket is
// 11.48 tall and 1.84 wide. canh.js has the same numbers (SLS) to place the bottom of the bells, not of the white margin
// the page mounts round the cut-out. No colour here has more red and blue than green (a lilac nozzle would): the page
// keys out everything with a trace of magenta in it.
// Usage: node ve-sls.js [out png]      default anh/pc-sls.png beside this file; needs PLAYWRIGHT_PATH, as .env holds
const { chromium } = require(process.env.PLAYWRIGHT_PATH);
const fs = require("fs"), path = require("path");
const out = process.argv[2] || path.join(__dirname, "anh", "pc-sls.png");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  const data = await page.evaluate(() => {
    const W = 768, H = 3072, S = 245, TOP = 11.48, LINE = 4, FOOT = 3.6;
    const X = (x) => W / 2 + x * S, Y = (y) => (H + TOP * S) / 2 - y * S, u = (v) => v * S;
    const INK = "#241b16", WHITE = "#f3f4f8", SHADE = "#cdd3e2";
    let seed = 20261124;
    const rnd = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const a = Object.assign(document.createElement("canvas"), { width: W, height: H }), g = a.getContext("2d");
    const poly = (pts) => { const p = new Path2D(); pts.forEach(([x, y], i) => (i ? p.lineTo(X(x), Y(y)) : p.moveTo(X(x), Y(y)))); p.closePath(); return p; };
    const box = (x0, y0, x1, y1, r = 0) => { const p = new Path2D(); p.roundRect(X(x0), Y(y1), X(x1) - X(x0), Y(y0) - Y(y1), Array.isArray(r) ? r.map(u) : u(r)); return p; };
    // a trapezoid about the line x = cx: wb wide at its bottom yb, wt wide at its top yt
    const trap = (cx, yb, yt, wb, wt) => poly([[cx - wb / 2, yb], [cx + wb / 2, yb], [cx + wt / 2, yt], [cx - wt / 2, yt]]);
    // a piece of paper: the shadow it throws on the paper under it when glued over one (shadow), its fill, lighter or
    // darker sheets lying over parts of it (a path and its colour, clipped to the piece), then its dark outline in px
    const paper = (p, fill, { line = LINE, shadow = 0, sheets = [] } = {}) => {
      g.fillStyle = fill;
      if (shadow) { g.save(); g.shadowColor = "rgba(28,16,12,.6)"; g.shadowBlur = 7; g.shadowOffsetX = 1.5; g.shadowOffsetY = 4.4; g.fill(p); g.restore(); }
      g.fill(p);
      for (const [q, colour] of sheets) { g.save(); g.clip(p); g.fillStyle = colour; g.fill(q); g.restore(); }
      if (line > 0) { g.lineJoin = "round"; g.lineWidth = line; g.strokeStyle = INK; g.stroke(p); }
    };
    // a line across a piece between the shares f0 and f1 of its width, clipped to it
    const rule = (piece, y, x0, x1, colour, w) => { g.save(); g.clip(piece); g.strokeStyle = colour; g.lineWidth = w; g.beginPath(); g.moveTo(X(x0), Y(y)); g.lineTo(X(x1), Y(y)); g.stroke(); g.restore(); };

    // ---------- the drawing, back to front: what hangs under the rocket first, the mast last ----------
    for (const s of [-1, 1]) {
      const cx = s * 0.71;
      paper(trap(cx, 0.156, 0.49, 0.36, 0.39), "#969cbc", { line: FOOT, shadow: 1, sheets: [[box(cx + 0.05, 0.156, cx + 0.2, 0.49), "#868eae"]] });
    }
    // the dark underside of the rocket behind the whole row: it shows in the V-shaped gaps between the bells, as the
    // dark sky does in the source, and being one sheet it leaves the page no narrow slit to fill with its white margin
    g.fillStyle = "#2a2f3d"; g.fill(box(-0.5075, 0, 0.5075, 0.43));
    for (const cx of [-0.381, -0.127, 0.127, 0.381]) {
      const b = trap(cx, 0, 0.405, 0.253, 0.118);
      paper(b, "#d6daea", { line: FOOT, shadow: 1, sheets: [[poly([[cx - 0.1, 0.015], [cx - 0.02, 0.015], [cx + 0.002, 0.39], [cx - 0.043, 0.39]]), "#f0f2f8"], [poly([[cx + 0.055, 0.015], [cx + 0.107, 0.015], [cx + 0.05, 0.39], [cx + 0.022, 0.39]]), "#b8c0d6"]] });
    }
    const foot = box(-0.5, 0.36, 0.5, 0.76, [0, 0, 0.05, 0.05]);
    paper(foot, WHITE, { shadow: 1, sheets: [[box(0.31, 0.36, 0.5, 0.76), SHADE]] });
    for (const s of [-1, 1]) {
      const x0 = s < 0 ? -0.92 : 0.5, x1 = s < 0 ? -0.5 : 0.92, r = u(0.05), p = new Path2D();
      p.moveTo(X(x0), Y(0.48) - r); p.lineTo(X(x0), Y(6.39));
      p.quadraticCurveTo(X(x0 + 0.035), Y(6.74), X((x0 + x1) / 2), Y(6.84)); p.quadraticCurveTo(X(x1 - 0.035), Y(6.74), X(x1), Y(6.39));
      p.lineTo(X(x1), Y(0.48) - r); p.quadraticCurveTo(X(x1), Y(0.48), X(x1) - r, Y(0.48)); p.lineTo(X(x0) + r, Y(0.48)); p.quadraticCurveTo(X(x0), Y(0.48), X(x0), Y(0.48) - r); p.closePath();
      paper(p, WHITE, { shadow: 1, sheets: [[box(x1 - 0.15, 0.48, x1, 6.9), SHADE]] });
      for (const y of [5.1, 1.99]) rule(p, y, x0 + 0.012, x1 - 0.012, "#a9aebc", 3.5);
    }
    const core = box(-0.5, 0.73, 0.5, 7.9);
    paper(core, "#ee923a", { shadow: 1, sheets: [[box(-0.5, 0.73, -0.37, 7.9), "#f7b068"], [box(-0.5, 0.73, -0.44, 7.9), "#fbc88e"], [box(0.23, 0.73, 0.5, 7.9), "#d2702c"]] });
    for (const y of [5.85, 3.59]) rule(core, y, -0.488, 0.488, "#aa5c28", 4);
    paper(trap(0, 7.88, 8.42, 1, 0.56), WHITE, { shadow: 1, sheets: [[poly([[0.06, 7.88], [0.5, 7.88], [0.28, 8.42], [0.09, 8.42]]), SHADE]] });
    paper(box(-0.28, 8.4, 0.28, 9.37), WHITE, { shadow: 1, sheets: [[box(0.08, 8.4, 0.28, 9.37), SHADE]] });
    paper(box(-0.28, 9.36, 0.28, 9.9), WHITE, { shadow: 1, sheets: [[box(0.08, 9.36, 0.28, 9.9), SHADE]] });
    paper(trap(0, 9.9, 10.55, 0.43, 0.24), WHITE, { shadow: 1, sheets: [[poly([[0.07, 9.9], [0.215, 9.9], [0.12, 10.55], [0.08, 10.55]]), SHADE]] });
    paper(poly([[-0.017, 10.5], [0.017, 10.5], [0.005, 11.2], [0, TOP], [-0.005, 11.2]]), WHITE, { line: 3 });

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
    for (let i = 0; i < 12000; i++) {
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
