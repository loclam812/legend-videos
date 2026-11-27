// The scenes of "What If Earth Had Two Moons?" in the storybook paper-cut look of tien-su-hoat-hinh, on the outline
// the user pasted on 2026-11-26 (nine scenes). The night city by the sea, the cream sheet, the two moons, the Sun and
// the person looking up are layers the model made (the person glued on white paper, as the look mounts every puppet,
// and the moons and the Sun as its stickers). Every diagram is drawn here by code in the same look, because a 4-step
// model does not keep an orbit round, a shadow pointing from a moon to the Earth, or the water of a tide where it
// belongs: the phases of the moons, the sleeve of water round the Earth, the two cards of the split frame, the shadow
// cones of the eclipses, the orbits, the arrows and the paper labels, the star field (space) and the Earth itself
// (globe, with today's continents sketched by hand: an illustration, not a map).
// The staging follows the picture column of the outline (content.json, sourceNotes): a city looking up as a second
// moon appears (hook to 2), the phases of the two moons (3, 4), the tides round the Earth seen from space (5, 6), a
// split frame (7, 8), two eclipses (9, 10), two orbits that bend under each other's pull (11, 12), two simulations
// compared (13, 14), Earth turning over millions of years (15, 16), and back to the night sky with the question of the
// outline on a card (17, kết).
// Layout: the captions sit at 1250 to 1420 px. In the city the promenade begins just below them and the person stands
// at the foot of the page, under them, with the moons high in the sky over the rooftops; every diagram lies between 240
// and 1230 px. Every label hangs on the word of its line that names it (said() and HEARD below).
const PLATES = ["pl-thanh-pho", "pl-giay-vang"];
const CUTS = ["pc-moon-a", "pc-moon-b", "pc-mat-troi", "pg-nguoi"];
const LEFT = { nguoi: 0 };
const INK = "#1f1408", CREAM = "#f6efd6", RED = "#e2542a", TEAL = "#2a9d8f", GOLD = "#f7a21b", WATER = "#9ed7f0", COPPER = "#c8643a";
// the city plate, measured on the picture of 2026-11-26 (864 x 1536): its rooftops from row 555, the buildings standing
// on the sea from row 942, a grey kerb from 1086 and the promenade from row 1180 to the bottom. The promenade's first row
// stands at EDGE px of the page, so the sea runs from SEA px and the kerb under the captions; the person stands at the
// foot of the page, on the promenade, below the captions
const EDGE = 1420, LINE = 1180 / 1536, SEA = 1114, FEET = 1890;
const MARGIN = 14;
const mix = (a, b, k) => { const p = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), q = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16)); return `rgb(${p.map((v, i) => Math.round(v + (q[i] - v) * k)).join(",")})`; };

// ---------- time ----------
// the shot table the page built from loi.js and xuat/durs.json, by label
const CUT = Object.fromEntries((window.CUT || []).map((c) => [c.label, c]));
// When each phrase of a line is spoken, in seconds of the recording of the line (edge-tts WordBoundary, read
// 2026-11-27). A line reworded since falls back to its letters, which misses an English word by up to a second
const HEARD = {
  hook: { line: "Imagine looking up tonight and seeing not one, but TWO moons!", speaks: 4.025, at: {"not one":1.95,"TWO":2.93} },
  1: { line: "Beautiful, right?", speaks: 1.966, at: {} },
  2: { line: "But this could change much more than our night sky.", speaks: 2.902, at: {"more than":1.3} },
  3: { line: "If both moons reflected enough sunlight, some nights could be brighter.", speaks: 4.087, at: {"brighter":3.21} },
  4: { line: "And each moon could have its own changing phases.", speaks: 2.995, at: {"its own":1.14} },
  5: { line: "Our Moon already helps create ocean tides through gravity.", speaks: 3.182, at: {"ocean tides":1.49,"gravity":2.25} },
  6: { line: "A second moon would introduce another tidal influence, making the patterns more complicated.", speaks: 5.242, at: {"A second":0.1,"more complicated":3.86,"another tidal":1.46} },
  7: { line: "Sometimes, their tidal effects could reinforce each other, increasing tidal ranges.", speaks: 5.398, at: {"reinforce":2.17,"tidal ranges":4.14} },
  8: { line: "At other times, they could partly offset each other, depending on their positions.", speaks: 4.618, at: {"partly offset":1.44,"their positions":3.4} },
  9: { line: "What about eclipses?", speaks: 1.934, at: {} },
  10: { line: "With another moon, there could be additional opportunities for solar and lunar eclipses, whenever the geometry is just right.", speaks: 7.051, at: {"solar":2.88,"lunar":3.64,"just right":6.05} },
  11: { line: "But there's a bigger challenge.", speaks: 1.966, at: {} },
  12: { line: "The two moons would also pull on each other through gravity, gradually changing their orbital paths.", speaks: 5.616, at: {"pull on each other":1.27,"their orbital paths":4.05} },
  13: { line: "If their orbits were poorly arranged, the system might become unstable.", speaks: 4.274, at: {"poorly arranged":0.91,"unstable":3.28} },
  14: { line: "But two moons don't automatically mean a collision or disaster.", speaks: 3.713, at: {"automatically":1.02,"collision":1.98} },
  15: { line: "Over millions of years, tidal interactions could also affect Earth's rotation.", speaks: 4.774, at: {"tidal interactions":1.56,"rotation":3.78} },
  16: { line: "How much would depend on the moons' masses and distances.", speaks: 3.214, at: {"masses":1.49,"distances":2.09} },
  17: { line: "So, two moons might create a spectacular sky and a very different Earth.", speaks: 4.711, at: {} },
  "kết": { line: "Would you want to live on that planet?", speaks: 1.934, at: {} },
};
const said = (label, phrase) => {
  const line = CUT[label] && CUT[label].lines[0], at = line ? line.text.indexOf(phrase) : -1;
  if (at < 0) throw new Error(`said(): "${phrase}" is not in shot ${label}`);
  const heard = HEARD[label];
  return heard && line.text === heard.line && heard.at[phrase] !== undefined ? (heard.at[phrase] * (line.dur - 0.3)) / heard.speaks : (line.dur * at) / line.text.length;
};
const shotLen = (label) => CUT[label].lines.reduce((s, l) => s + l.dur, 0);
const sceneLen = (...labels) => labels.reduce((s, l) => s + shotLen(l) + GAP, 0);

// ---------- paper ----------
function piece(build, fill, { line = 5, shadow = 1, alpha = 1 } = {}) {
  if (alpha <= 0) return;
  out.save(); out.globalAlpha = alpha;
  if (shadow) { out.shadowColor = "rgba(40,20,10,.45)"; out.shadowBlur = 10; out.shadowOffsetY = 6; }
  out.beginPath(); build(); out.fillStyle = fill; out.fill();
  out.shadowColor = "transparent";
  if (line > 0) { out.lineWidth = line; out.lineJoin = "round"; out.strokeStyle = INK; out.stroke(); }
  out.restore();
}
function stick(x0, y0, x1, y1, w, colour, line = 5) {
  const path = () => { out.beginPath(); out.moveTo(x0, y0); out.lineTo(x1, y1); };
  out.save(); out.lineCap = "round";
  if (line > 0) { out.shadowColor = "rgba(40,20,10,.45)"; out.shadowBlur = 10; out.shadowOffsetY = 6; path(); out.strokeStyle = INK; out.lineWidth = w + 2 * line; out.stroke(); out.shadowColor = "transparent"; }
  path(); out.strokeStyle = colour; out.lineWidth = w; out.stroke();
  out.restore();
}
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
function glow(x, y, r, a, rgb = "255,244,214") {
  if (a <= 0) return;
  out.save(); out.globalCompositeOperation = "screen";
  const g = out.createRadialGradient(x, y, r * 0.12, x, y, r);
  g.addColorStop(0, `rgba(${rgb},${0.85 * a})`); g.addColorStop(1, `rgba(${rgb},0)`);
  out.fillStyle = g; out.fillRect(x - r, y - r, 2 * r, 2 * r);
  out.restore();
}
// a round cut-out (a moon, the Sun) with its centre at (x, y), d px across the paper disc
function disc(name, x, y, d, { light = 0, alpha = 1 } = {}) {
  if (d <= 0) return;
  if (light > 0) glow(x, y, d * 0.95, light);
  // d is across the paper disc; the page draws the mounted box, MARGIN wider on every side
  const w = (d * L[name].w) / (L[name].w - 2 * MARGIN);
  P(name, x, y + tall(name, w) / 2, w, { alpha });
}
function halo(x, y, r, k, alpha = 1, colour = "#f6c453") {
  if (k <= 0 || alpha <= 0) return;
  if (colour === "#f6c453") { out.save(); out.globalAlpha = alpha; ring(x, y, r, k); out.restore(); return; }
  out.save(); out.globalAlpha = alpha;
  out.strokeStyle = colour; out.lineWidth = 9; out.setLineDash([22, 16]); out.lineCap = "round";
  out.shadowColor = "rgba(40,20,10,.6)"; out.shadowBlur = 8; out.shadowOffsetY = 4;
  out.beginPath(); out.arc(x, y, r, 0, Math.PI * 2 * Math.min(1, k)); out.stroke();
  out.restore();
}
// the engine's twinkling stars (sparkles) in a ring round a moon d wide, outside its white rim: a star that lands on a
// moon reads as a sticker stuck on it, and one shrunk to its outline alone as a dark speck, so the outline of a star
// only comes up as the star grows past 9 px. a is the alpha of the whole ring: every star of it is at its own size at
// any moment, so a ring switched on or off in one frame pops, and it is faded in and out instead
function stars(x, y, d, ts, n, a = 1) {
  if (a <= 0) return;
  for (let i = 0; i < n; i++) {
    const k = (ts * (0.5 + 0.5 * rnd(i, 21)) + rnd(i, 22)) % 1, r = (10 + 22 * rnd(i, 23)) * Math.sin(Math.PI * k);
    // each star keeps its place on the ring and drifts slowly along it
    const an = rnd(i, 24) * 7 + ts * (0.2 + 0.3 * rnd(i, 26)), dist = d * 0.56 + 36 + d * 0.36 * rnd(i, 25);
    if (r < 3) continue;
    // a star whose place on the ring hangs over an edge of the page is held whole inside it
    const sx = Math.max(r + 4, Math.min(OW - r - 4, x + Math.cos(an) * dist)), sy = Math.max(r + 4, Math.min(OH - r - 4, y + Math.sin(an) * dist));
    out.save(); out.globalAlpha = a; out.translate(sx, sy); out.rotate(ts + i);
    out.fillStyle = "#fff3b0"; out.strokeStyle = `rgba(42,22,8,${sm(9, 16, r)})`; out.lineWidth = 3;
    out.beginPath();
    for (let a = 0; a < 8; a++) { const rr = a % 2 ? r * 0.35 : r, at = (a * Math.PI) / 4; out.lineTo(Math.cos(at) * rr, Math.sin(at) * rr); }
    out.closePath(); out.fill(); out.stroke();
    out.restore();
  }
}
// an arrow that grows from its tail: a paper shaft under a triangular head
function arrow(x0, y0, x1, y1, k = 1, colour = RED, w = 16) {
  if (k <= 0) return;
  const len = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / len, uy = (y1 - y0) / len, head = Math.min(w * 1.8, len * 0.5 * k), tip = len * k;
  if (tip > head + 2) stick(x0, y0, x0 + ux * (tip - head), y0 + uy * (tip - head), w, colour);
  piece(() => { out.moveTo(x0 + ux * tip, y0 + uy * tip); out.lineTo(x0 + ux * (tip - head) - uy * head * 0.62, y0 + uy * (tip - head) + ux * head * 0.62); out.lineTo(x0 + ux * (tip - head) + uy * head * 0.62, y0 + uy * (tip - head) - ux * head * 0.62); out.closePath(); }, colour, { line: 4 });
}
// the pull between two round things, each ra and rb wide from its centre: a cream line from one to the other with a
// head at each end that points at its moon. Nothing where they touch. k is the alpha of the whole, the heads too: piece()
// sets the alpha it is given, and a head drawn without it came up whole in the frame the line began to fade in
function tether(ax, ay, ra, bx, by, rb, k) {
  const len = Math.hypot(bx - ax, by - ay), room = len - ra - rb;
  if (k <= 0 || len <= 0 || room < 24) return;
  const ux = (bx - ax) / len, uy = (by - ay) / len, head = Math.min(30, room * 0.42), from = ra + 8, to = len - rb - 8, a = k * sm(24, 60, room);
  out.save(); out.globalAlpha = a;
  if (to - from > 2 * head + 6) stick(ax + ux * (from + head), ay + uy * (from + head), ax + ux * (to - head), ay + uy * (to - head), 9, CREAM, 4);
  for (const [tip, dir] of [[from, 1], [to, -1]]) piece(() => {
    out.moveTo(ax + ux * tip, ay + uy * tip);
    out.lineTo(ax + ux * (tip + dir * head) - uy * head * 0.6, ay + uy * (tip + dir * head) + ux * head * 0.6);
    out.lineTo(ax + ux * (tip + dir * head) + uy * head * 0.6, ay + uy * (tip + dir * head) - ux * head * 0.6);
    out.closePath();
  }, CREAM, { line: 4, alpha: a });
  out.restore();
}

// ---------- orbits and shadows ----------
// a point of an orbit of semi-major axis a and eccentricity e whose near end points at phi, at the angle th, seen sq
// times as flat and turned round by tilt; and a dashed paper line along the whole of it
function place(cx, cy, a, e, phi, th, sq = 1, tilt = 0) {
  const r = (a * (1 - e * e)) / (1 + e * Math.cos(th - phi)), px = r * Math.cos(th), py = sq * r * Math.sin(th), c = Math.cos(tilt), s = Math.sin(tilt);
  return [cx + px * c - py * s, cy + px * s + py * c];
}
function orbit(cx, cy, a, e, phi, { sq = 1, tilt = 0, alpha = 1, colour = "#f6c453", width = 9, shadow = 1 } = {}) {
  if (alpha <= 0) return;
  out.save(); out.globalAlpha = alpha;
  if (shadow) { out.shadowColor = "rgba(40,20,10,.6)"; out.shadowBlur = 8; out.shadowOffsetY = 4; }
  out.beginPath();
  for (let j = 0; j <= 120; j++) { const [px, py] = place(cx, cy, a, e, phi, (j / 120) * Math.PI * 2, sq, tilt); j ? out.lineTo(px, py) : out.moveTo(px, py); }
  out.closePath();
  out.lineWidth = width; out.strokeStyle = colour; out.lineCap = "round"; out.lineJoin = "round"; out.setLineDash([22, 16]); out.stroke();
  out.restore();
}
// the shadow a moon d wide throws on the Earth (centre ex, ey, radius r) when it stands between it and the Sun: a dark
// cone from the moon to the rim of the Earth, drawn before the Earth, and the spot where it lands, drawn after it. It
// is the colour of the empty sky, so it only reads where a light lies behind it: the scene lays a blue one round the
// Earth
function shadowCone(mx, my, d, ex, ey, r, k) {
  if (k <= 0 || d <= 0) return;
  const len = Math.hypot(ex - mx, ey - my), ux = (ex - mx) / len, uy = (ey - my) / len, a = d * 0.47, b = d * 0.16, sx = ex - ux * r, sy = ey - uy * r;
  out.save(); out.globalAlpha = k;
  out.beginPath();
  out.moveTo(mx - uy * a, my + ux * a); out.lineTo(sx - uy * b, sy + ux * b); out.lineTo(sx + uy * b, sy - ux * b); out.lineTo(mx + uy * a, my - ux * a); out.closePath();
  out.fillStyle = "rgba(6,9,26,.92)"; out.fill();
  out.lineWidth = 3; out.strokeStyle = "#f6c453"; out.stroke();
  out.restore();
}
function shadowSpot(mx, my, ex, ey, r, k) {
  if (k <= 0) return;
  const len = Math.hypot(ex - mx, ey - my), sx = ex - ((ex - mx) / len) * r, sy = ey - ((ey - my) / len) * r;
  out.save();
  out.beginPath(); out.arc(ex, ey, r - 2, 0, 7); out.clip();
  out.fillStyle = `rgba(10,15,44,${0.85 * k})`; out.beginPath(); out.ellipse(sx, sy, r * 0.24, r * 0.16, Math.atan2(ey - my, ex - mx), 0, 7); out.fill();
  // rimmed in the gold of the cone, which ends in it: on the Earth alone the spot is only a darker blue
  out.lineWidth = 4; out.strokeStyle = `rgba(246,196,83,${0.9 * k})`; out.stroke();
  out.restore();
}
// the shadow the Earth (radius r) itself throws, away from the Sun: a cone that narrows a little from the Earth's rim
// to beyond the orbit, dark like the sky and edged in the copper of an eclipsed Moon, so it reads over the blue light
// round the Earth. Drawn before the Earth
function umbra(ex, ey, r, at, len, k) {
  if (k <= 0) return;
  const ux = Math.cos(at), uy = Math.sin(at);
  out.save(); out.globalAlpha = k;
  out.beginPath();
  out.moveTo(ex - uy * r * 0.95, ey + ux * r * 0.95); out.lineTo(ex + ux * len - uy * r * 0.55, ey + uy * len + ux * r * 0.55);
  out.lineTo(ex + ux * len + uy * r * 0.55, ey + uy * len - ux * r * 0.55); out.lineTo(ex + uy * r * 0.95, ey - ux * r * 0.95); out.closePath();
  out.fillStyle = "rgba(6,9,26,.9)"; out.fill();
  out.lineWidth = 3; out.strokeStyle = "rgba(200,100,58,.85)"; out.stroke();
  out.restore();
}

// ---------- water, phases, the city ----------
// the sleeve of water round the Earth (centre cx, cy, radius R): for every moon a pair of bulges that points at it,
// each [how high the water rises in px, the direction of its moon in radians]. The water stands base px above the rim
// where no moon pulls. Two moons on one line add their bulges, two at right angles pull the water four ways
function sleeve(cx, cy, R, terms, base = 14, alpha = 0.93) {
  piece(() => {
    for (let j = 0; j <= 96; j++) {
      const th = (j / 96) * Math.PI * 2;
      let r = R + base;
      for (const [rise, at] of terms) r += rise * 0.5 * (1 + Math.cos(2 * (th - at)));
      j ? out.lineTo(cx + r * Math.cos(th), cy + r * Math.sin(th)) : out.moveTo(cx + r * Math.cos(th), cy + r * Math.sin(th));
    }
    out.closePath();
  }, WATER, { alpha });
}
// a tide gauge 220 px tall with its top at y: the water stands between a high and a low mark, `range` of the bar apart
function gauge(x, y, range) {
  const h = 220, high = y + (h * (1 - range)) / 2, low = y + (h * (1 + range)) / 2;
  piece(() => out.roundRect(x - 22, y, 44, h, 10), "#ffffff", { line: 4 });
  out.save(); out.beginPath(); out.roundRect(x - 18, y + 4, 36, h - 8, 7); out.clip();
  out.fillStyle = WATER; out.fillRect(x - 18, high, 36, low - high); out.restore();
  for (const level of [high, low]) stick(x - 34, level, x + 34, level, 5, RED, 3);
}
// the light of a moon on the sea: pale glints in a column under it, between top and bottom, each twinkling on its own
function glints(x, top, bottom, w, k, ts, seed) {
  if (k <= 0 || bottom <= top) return;
  for (let n = 0; n < 14; n++) {
    const y = top + (bottom - top) * rnd(n + seed, 31), spread = w * (0.3 + 0.7 * ((y - top) / (bottom - top)));
    const a = k * (0.5 + 0.5 * Math.sin(ts * (2 + 2 * rnd(n + seed, 32)) + n * 1.7)) - 0.05;
    if (a <= 0.03) continue;
    const len = 16 + 30 * rnd(n + seed, 33), px = x + (rnd(n + seed, 34) - 0.5) * spread;
    out.save(); out.globalAlpha = a; out.fillStyle = "#fbf3df"; out.beginPath(); out.roundRect(px - len / 2, y - 3, len, 6, 3); out.fill(); out.restore();
  }
}
// the phase of a moon: p runs from 0 (new) round to 1; 0.5 is full. The first half waxes, lit from the right, the second
// wanes. How much of the disc is lit
const lit = (p) => (1 - Math.cos(2 * Math.PI * p)) / 2;
// the dark part of a moon d wide centred at (x, y), in the colour of the sky round it
function phase(x, y, d, p, colour = "rgba(10,15,44,.9)") {
  const f = lit(p);
  if (f > 0.99) return;
  const r = d / 2 + 1;
  out.save(); out.fillStyle = colour;
  if (f < 0.01) { out.beginPath(); out.arc(x, y, r, 0, 7); out.fill(); out.restore(); return; }
  const q = p < 0.5 ? p : 1 - p, w = Math.cos(2 * Math.PI * q) * r;
  out.translate(x, y); if (p >= 0.5) out.scale(-1, 1); out.translate(-x, -y); // a waning moon is a waxing one mirrored
  out.beginPath();
  out.arc(x, y, r, Math.PI / 2, Math.PI * 1.5, false); // the dark half: round the left, from the bottom to the top
  // the terminator back: bulging toward the light on a crescent (w above 0), away from it on a gibbous moon
  if (w >= 0) out.ellipse(x, y, w, r, 0, -Math.PI / 2, Math.PI / 2, false);
  else out.ellipse(x, y, -w, r, 0, Math.PI * 1.5, Math.PI / 2, true);
  out.closePath(); out.fill(); out.restore();
}
// a small paper moon in a phase for the rows of scene B: at full colour when its turn has come (on 1), a pale outline
// of itself before
function miniMoon(x, y, q, on, k) {
  out.save(); out.translate(x, y); out.scale(k, k);
  piece(() => out.arc(0, 0, 27, 0, 7), mix("#4a5288", "#f1ead6", on), { line: 3, shadow: 0 });
  phase(0, 0, 54, q, `rgba(10,15,44,${(0.62 + 0.28 * on).toFixed(3)})`);
  out.restore();
}
// a row of six small moons under a big one, from a crescent to full: each comes to full colour as the lit part of the
// big moon grows past its own, and goes out again as it wanes
function row(x, y, p, k) {
  if (k <= 0) return;
  const f = lit(p);
  for (let n = 0; n < 6; n++) {
    const q = 0.085 * (n + 1), own = lit(q);
    miniMoon(x + (n - 2.5) * 64, y, q, n ? sm(own - 0.06, own + 0.06, f) : 1, k);
  }
}
// the city plate with the edge of its promenade at EDGE px: pushed in from zoom z0 to z1 about that edge, and lifted
// `lift` px when the camera comes down from the sky. Where the lift leaves the page below the plate, the plate's last
// rows carry the promenade on, mirrored about a line BLEND px above its bottom edge and blended into it band by band (a
// strip set edge to edge with the plate shows its join: the sheet the model painted is paler along its bottom edge)
function city(ts, total, z0, z1, lift = 0) {
  const img = L["pl-thanh-pho"], s = Math.max(OW / img.width, OH / img.height) * (z0 + (z1 - z0) * sm(0, total, ts)), w = img.width * s, h = img.height * s, x = (OW - w) / 2, y = EDGE - h * LINE - lift;
  out.drawImage(img, x, y, w, h);
  const rest = Math.min(OH - (y + h), h);
  if (rest <= 0) return;
  // span in px of the page; the mirror shows the rows above the plate row that lies on the mirror line (end, in px of
  // the plate), so it never reaches the paler rows of the plate's bottom
  const BLEND = 40, blend = Math.min(BLEND, rest), mirror = y + h - blend, span = rest + blend, end = img.height - blend / s;
  // band 0 is the page below the plate, the mirror alone; bands 1 to 8 are the plate's last BLEND px from the bottom up, the
  // mirror fading out of them as they rise
  for (let j = 0; j <= 8; j++) {
    const top = j ? mirror + (blend * (8 - j)) / 8 : y + h, bottom = j ? mirror + (blend * (9 - j)) / 8 : OH;
    out.save(); out.beginPath(); out.rect(0, top, OW, bottom - top); out.clip();
    out.globalAlpha = j ? 1 - (j - 0.5) / 8 : 1;
    out.translate(0, 2 * mirror); out.scale(1, -1);
    out.drawImage(img, 0, end - span / s, img.width, span / s, x, mirror - span, w, span);
    out.restore();
  }
}
// a card of lighter paper on the cream sheet
function card(x, y, w, h) { piece(() => out.roundRect(x, y, w, h, 26), "#fbf7ea", { line: 5 }); }
// the Earth (radius r) with its two moons, d[n] wide, on the orbits o[n] at the angles ang[n], each orbit as place() takes
// it. A moon
// is behind the Earth only on the far half of its orbit, and near enough to cross its rim
function system(cx, cy, r, orbits, ang, ts, d = [52, 36]) {
  glow(cx, cy, r * 3, 0.4, "104,146,240");
  orbits.forEach((o) => orbit(cx, cy, o[0], o[1], o[2], { sq: o[3], tilt: o[4], width: 7 }));
  const at = orbits.map((o, n) => place(cx, cy, o[0], o[1], o[2], ang[n], o[3], o[4]));
  const behind = at.map(([x, y], n) => y < cy && Math.hypot(x - cx, y - cy) < r + d[n] / 2);
  if (behind[0]) disc("pc-moon-a", at[0][0], at[0][1], d[0]);
  if (behind[1]) disc("pc-moon-b", at[1][0], at[1][1], d[1]);
  globe(cx, cy, r, EARTH, -30 + ts * 3, 15);
  if (!behind[0]) disc("pc-moon-a", at[0][0], at[0][1], d[0]);
  if (!behind[1]) disc("pc-moon-b", at[1][0], at[1][1], d[1]);
  return { at, behind };
}
// the spin of the Earth marked over its face: an arrow along the near side of a ring round it, from the left limb to
// the right, grown to k of its length
function spinArrow(cx, cy, R, k) {
  if (k <= 0) return;
  const rx = R * 1.32, ry = R * 0.36, oy = cy - R * 0.06, from = (165 * Math.PI) / 180, to = (15 * Math.PI) / 180, at = from + (to - from) * k;
  const on = (th) => [cx + rx * Math.cos(th), oy + ry * Math.sin(th)];
  out.save(); out.lineCap = "round"; out.lineJoin = "round";
  out.beginPath(); for (let j = 0; j <= 40; j++) { const [px, py] = on(from + ((at - from) * j) / 40); j ? out.lineTo(px, py) : out.moveTo(px, py); }
  out.shadowColor = "rgba(40,20,10,.6)"; out.shadowBlur = 10; out.shadowOffsetY = 5; out.strokeStyle = INK; out.lineWidth = 22; out.stroke();
  out.shadowColor = "transparent"; out.strokeStyle = CREAM; out.lineWidth = 13; out.stroke();
  out.restore();
  // the head comes up with the last of the shaft and points the way the arrow runs: to the right, rising at the limb
  const h = sm(0.8, 1, k);
  if (h > 0) {
    const [ex, ey] = on(at), dx = rx * Math.sin(at), dy = -ry * Math.cos(at), len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
    piece(() => { out.moveTo(ex + ux * 34 * h, ey + uy * 34 * h); out.lineTo(ex - uy * 24 * h, ey + ux * 24 * h); out.lineTo(ex + uy * 24 * h, ey - ux * 24 * h); out.closePath(); }, CREAM, { line: 4 });
  }
}

// ---------- the Earth ----------
// today's continents, sketched by hand with few points for a globe of this size: [longitude, latitude]. Eurasia is cut
// on the far side of every view used here (the views are centred on the Atlantic), from Taymyr down to Bengal: the
// engine interpolates longitude the short way round, so an outline must not span more than half the world
const EARTH = {
  lands: [
    // North America
    [[-157,71.3],[-141,69.7],[-133,69.5],[-124,70],[-118,68.7],[-110,68],[-102,68.5],[-96,68.6],[-93,69.3],[-88,69.6],[-83.5,70],[-82.5,69],[-84,67.5],[-86.2,66.4],[-88.5,64.5],[-91,63.5],[-93.5,62.5],[-94,61.5],[-94.5,60],[-94.2,58.8],[-92.5,57],[-88,56.5],[-85.3,55.3],[-82.3,55.2],[-79.5,55.8],[-77.3,56],[-78.2,55.3],[-78.8,54.5],[-79,52.8],[-79.5,51.7],[-80.3,51.3],[-80.5,51.5],[-79.5,53],[-79,54.8],[-76.5,55.4],[-77.3,56.3],[-78.2,58.5],[-77.5,59.5],[-77.8,61.5],[-77.5,62.6],[-72,61.8],[-69.6,61.1],[-69.8,60.2],[-68.5,59.2],[-67.5,58.3],[-65.9,58.7],[-64.5,60.4],[-61.8,57.3],[-60.5,55.6],[-58.5,54.5],[-57.5,53.5],[-56.5,52.3],[-55.8,51.5],[-58.5,51.4],[-61,50.2],[-64.5,50.2],[-66.5,49.9],[-64.2,48.8],[-65.3,48.1],[-66.6,47.8],[-64.9,47.7],[-64.4,46.3],[-61.5,45.8],[-60.4,46.3],[-60.6,47],[-61.8,46.5],[-62.5,45.7],[-63.6,44.6],[-65.3,44],[-66.1,43.8],[-66,44.4],[-65.2,45.1],[-64.4,45.8],[-65.8,45.3],[-66.9,44.9],[-67,44.8],[-70,43.8],[-70.6,42.5],[-71.4,41.5],[-72,41],[-74,40.6],[-75.1,38.8],[-75.7,38],[-76,37.2],[-75.5,35.2],[-78,33.9],[-79,33.3],[-80.9,32],[-81,30.5],[-80.1,28.5],[-80.5,27],[-80.2,25.7],[-81.1,25.2],[-81.8,26.1],[-82.7,27.8],[-83.7,29.9],[-84.4,30],[-85.4,29.8],[-86.5,30.4],[-88.5,30.3],[-89.4,29.1],[-91,29.2],[-93.5,29.8],[-94.8,29.3],[-95.3,28.9],[-97,28.4],[-97.4,27.8],[-97.2,26.5],[-97.4,25.9],[-97.7,24],[-97.9,22.3],[-97.4,21],[-96,19.2],[-94.4,18.2],[-91.8,18.7],[-90.5,19.8],[-90.5,20.5],[-89.6,21.2],[-87.1,21.6],[-86.8,21.2],[-87.7,19.5],[-88.5,18.5],[-88.3,18.3],[-88.3,17.2],[-88.3,16],[-87.7,15.8],[-86.5,15.9],[-85,15.9],[-83.2,15],[-83.5,13.2],[-83.8,12],[-83,10],[-81.5,9.4],[-79.5,9.5],[-78.2,9.3],[-77.3,8.7],[-77.9,7.7],[-78.6,8.4],[-79.6,8.9],[-80.5,7.5],[-81.5,8.2],[-82.9,8.3],[-83.4,8.6],[-84.2,9.5],[-85.2,10],[-85.6,10.7],[-86,11.6],[-87.2,12.9],[-88.8,13.3],[-90.5,13.9],[-92,14.6],[-93.5,15.6],[-95.5,16.2],[-97.5,15.9],[-99.9,16.8],[-101.5,17.5],[-102.5,18],[-104.3,19.1],[-105.3,20.6],[-105.5,21.8],[-106.4,23.2],[-108,25],[-109.5,25.8],[-111.3,28.5],[-112.8,31.3],[-114.5,31.5],[-114.8,30.4],[-113.8,28.8],[-112.2,27],[-110.6,24.2],[-109.9,22.9],[-112.3,25],[-114.3,27.3],[-115.8,29.7],[-116.7,31],[-117.2,32.7],[-118.4,34],[-120.6,34.5],[-122.4,37.8],[-124.4,40.4],[-124,43.5],[-124.2,46.5],[-123.5,47],[-124.5,48.5],[-126.5,50.8],[-128.5,53],[-130.5,54.5],[-131.5,56],[-134,57.5],[-136.5,58.5],[-139.5,59.5],[-143,60],[-146,60.8],[-149,61],[-152,60.5],[-153.5,58.8],[-156,58.3],[-159.5,56.5],[-163,54.8],[-160,55.8],[-157.5,56.8],[-158,58.5],[-162,61],[-165,62.5],[-161,64.5],[-166,65.5],[-166.8,68.3],[-162,70.5]],
    // Greenland
    [[-44,60],[-48,61],[-50.5,64],[-52.5,67],[-54,70],[-56.5,73],[-60,75.5],[-68,76.5],[-72,78],[-66,79.5],[-61,81.3],[-55,82.2],[-45,83],[-33,83.4],[-22,82.2],[-18.5,79],[-21,76],[-22,70.5],[-27,68.5],[-33,67.5],[-40,65.5],[-41,63]],
    // Baffin Island
    [[-61.5,66.6],[-66,66.3],[-71.5,66.8],[-76,68],[-78.5,70.5],[-77.5,73],[-73,73.5],[-70,71.5],[-68,70],[-64.5,68]],
    // South America
    [[-77.3,8.7],[-75.6,10.6],[-71.7,12.3],[-71.2,11.8],[-68.3,10.6],[-64.2,10.6],[-62.2,10.7],[-61,10],[-60.8,9.3],[-58.5,7.4],[-55,5.8],[-52,4.5],[-50.8,2],[-50,0],[-48.5,-1],[-44.3,-2.6],[-41,-2.9],[-38.5,-3.7],[-35.2,-5.4],[-34.8,-7],[-35.5,-9],[-37.2,-11],[-39,-13.5],[-39.2,-17.5],[-40.5,-20.5],[-42,-23],[-44.5,-23.3],[-46.5,-24.2],[-48.6,-26.5],[-48.7,-28.6],[-50.5,-30.8],[-52.2,-32.2],[-53.6,-34],[-56,-34.8],[-58.5,-34.6],[-57.8,-36.3],[-57.5,-38.1],[-62.2,-38.8],[-63.6,-41],[-65.2,-42.5],[-65.3,-45],[-67.5,-46],[-65.8,-47.2],[-68,-49.5],[-68.5,-52],[-69.5,-53.5],[-73.5,-53],[-75.5,-50.5],[-74.5,-46.5],[-73.4,-43],[-74.3,-40],[-73.5,-37],[-71.5,-33],[-70.6,-27],[-70.4,-23],[-71.4,-18],[-75.2,-15],[-77.1,-12],[-79.5,-8],[-81.2,-6],[-80.9,-3.5],[-80.2,-2.2],[-80.8,-1],[-80.1,0.6],[-78.8,1.5],[-77.6,4],[-77.4,6.5]],
    // Africa
    [[-5.9,35.8],[-2.2,35.1],[3,36.8],[8,37],[11,37.3],[11.1,35.2],[10.2,33.6],[15.2,32.4],[19.5,32.5],[22.5,32.8],[25.2,31.6],[29,31.2],[32.3,31.3],[32.6,29.9],[32.6,28.6],[33.6,26.8],[35.2,24.2],[36.9,22],[37.2,20.5],[38.6,18.2],[39.8,15.5],[41.3,13.9],[42.7,12.6],[43.4,11.5],[44.2,10.4],[46.5,10.7],[49,11.3],[51.3,11.8],[50.9,10.3],[49.8,7.9],[47.9,5.3],[45.4,2.4],[43.4,0.9],[41.5,-1.7],[40.1,-3.2],[39.5,-6.6],[40.6,-10.5],[40.4,-14.8],[38.9,-17.6],[36.5,-19.6],[35.4,-22],[35.6,-23.8],[32.7,-25.9],[31,-29.2],[31.2,-31.4],[28,-32.6],[25.6,-34],[20,-34.8],[18.4,-34.3],[17.9,-32.5],[16.6,-28.6],[14.8,-26.2],[14.5,-22.9],[13,-19],[12.1,-15.1],[12.4,-12.6],[13.4,-11.2],[13.2,-8.8],[12.2,-6],[12.3,-4],[11.4,-3],[9.7,-2],[9.3,-0.8],[9.8,2],[9.5,3.9],[8.3,4.5],[6.4,4.3],[5.3,5.3],[4.4,6.3],[3.4,6.4],[1.6,6.3],[0,5.8],[-1.6,5],[-3.5,5.1],[-7.5,4.4],[-9.8,4.4],[-11.5,6.4],[-13.3,8.5],[-13.7,9.6],[-15.5,11.2],[-16.6,12.5],[-16.5,13.6],[-17.5,14.7],[-16.5,16.1],[-16.2,19.5],[-17,20.9],[-15.6,23.5],[-14.8,25.4],[-13,27.7],[-9.6,30.4],[-9.8,32],[-7.6,33.6]],
    // Madagascar
    [[43.2,-25.6],[44.5,-25.3],[47.1,-25.1],[49.9,-17.1],[50.5,-15.7],[49.3,-12.3],[48,-13],[46.3,-16],[44.5,-19.8],[43.3,-22.3]],
    // Eurasia: round Europe and along the north of Asia to Taymyr, down the far side to Bengal, round India and Arabia
    [[-5.4,36.1],[-6.3,36.8],[-7.2,37.2],[-8.6,37.1],[-8.9,38.7],[-8.7,41.2],[-9.3,43],[-7.9,43.8],[-5.7,43.6],[-3.8,43.5],[-1.8,43.4],[-1.4,44.6],[-1.3,45.8],[-2.2,47.2],[-4.8,48.4],[-4.5,48.8],[-1.6,48.7],[-1.3,49.7],[0.2,49.4],[1.6,50.7],[3.2,51.3],[4.3,52],[4.7,52.9],[6.5,53.4],[8.5,53.9],[8.1,55.6],[8.2,56.7],[10.6,57.7],[10.5,56.5],[10.3,55.7],[10.6,54.8],[10.5,54.3],[12,54.2],[12.5,54.4],[13.7,54.1],[14.3,53.9],[16.5,54.6],[18.6,54.9],[19.5,54.3],[21,56],[21.1,57.2],[22.6,57.7],[24.1,57],[24.4,58.2],[23.5,58.5],[24.7,59.4],[30.3,59.9],[28,60.5],[26,60.4],[23,60.2],[21.5,61.5],[21.4,63],[24.5,65],[25.3,65.8],[22,65.6],[19.3,63.5],[17.3,61.5],[18.6,59.3],[16.5,57.5],[14.2,55.4],[13,55.4],[12.6,56.2],[11.9,57.7],[11.2,58.4],[10.7,59.9],[8,58.1],[5.7,58.9],[5.3,60.4],[5,62],[7,63],[10.4,63.4],[12,65.5],[14.5,67.3],[15.5,68.5],[18.9,69.6],[23.5,70.5],[25.8,71.2],[28.5,70.8],[30.5,69.8],[33,69],[37,68.9],[40.5,67.7],[41.2,66.7],[38,66.3],[36.5,66],[36.5,65],[38,64.3],[40.5,64.6],[44,66],[44.8,67.3],[43.3,68.7],[46,67.4],[48.5,68.2],[53,68.4],[54.5,68.6],[58.5,68.9],[60.5,69.6],[63,69.3],[66.5,71.3],[69.5,72.7],[71.5,72.9],[74,72.6],[78,72.4],[80.5,73.5],[86,74.5],[95,76],[104.3,77.7],[98,62],[94,50],[90,38],[88,28],[87,21.7],[86.4,20.2],[85,19.5],[83.3,17.6],[81.3,16.3],[80.3,13.5],[79.9,10.3],[77.5,8.1],[76.2,9.9],[74.8,12.9],[73.5,17],[72.8,19.2],[72.6,21.6],[70.2,22.5],[69,22.4],[68.8,23.8],[66.9,24.8],[63,25.3],[59,25.4],[57.5,25.6],[56.3,27.1],[54,26.7],[50.6,29.4],[48.5,30],[48,29.4],[50,26.6],[51.6,24.5],[54,24.2],[56.3,25],[56.4,26.3],[58,23.6],[59.8,22.5],[59.3,20.5],[57.8,18.9],[55.3,17],[52.2,15.6],[48.8,14],[45,12.8],[43.4,12.7],[42.7,15],[41.5,17.5],[39.2,21.3],[37.2,24.3],[35,27.8],[34.9,29.4],[34.4,28.2],[34.25,27.75],[33.6,28.4],[32.7,29.6],[32.55,30],[32.3,31.3],[34.2,31.3],[35,33],[35.9,35.9],[36,36.6],[32.8,36],[30.5,36.3],[29,36.3],[27.3,36.7],[27,37.9],[26.3,38.5],[26.8,39.5],[26.2,40.1],[27.5,40.9],[29,41.1],[31.5,41.3],[35,42],[37.5,41],[39.5,41.1],[41.6,41.7],[41.5,43],[40,44.5],[38,44.5],[36.6,45.1],[35.4,45],[34.2,44.5],[33.5,44.6],[33.4,45.2],[32.5,45.3],[33,46.1],[31,46.5],[29.7,45.2],[28.7,43.4],[28,41.9],[29.1,41.2],[27.5,40.9],[26.2,40.1],[24.5,40.9],[23,40.6],[23.9,39.2],[23.7,37.9],[22.5,36.4],[21.5,37],[21.3,38.3],[20.7,39],[19.5,41.5],[19.4,42.4],[16,43.5],[13.8,45.6],[12.5,45.5],[14,42.5],[16,41.5],[18.5,40.1],[16.6,39.9],[15.65,38],[15.7,40],[14.2,40.8],[13,41.3],[12.2,41.8],[10.5,42.9],[10.2,43.8],[8.9,44.4],[7.5,43.8],[5.4,43.3],[3,42.5],[2.2,41.4],[0.9,41],[-0.3,39.5],[-0.5,38.3],[-2,36.8],[-4.4,36.7]],
    // Britain, Ireland, Iceland
    [[-5.7,50.1],[-3.5,50.6],[-1.3,50.8],[1.4,51.2],[1.7,52.7],[0.3,53.4],[-0.1,54.1],[-1.5,55],[-2,56.5],[-3,57.7],[-1.8,57.5],[-3.2,58.6],[-5,58.6],[-5.9,57],[-5.5,55.5],[-4.8,54.5],[-3.2,53.4],[-4.7,52.5],[-5.2,51.8],[-3,51.3],[-4.5,51.1]],
    [[-6.2,52.1],[-8.5,51.6],[-10,54.2],[-8.3,55.2],[-6,55.2],[-6.2,54.1],[-6,53.2]],
    [[-22.7,63.9],[-22,63.5],[-18,63.4],[-14.5,64.3],[-14.5,65.5],[-16,66.2],[-20,66.1],[-22,65],[-24,65]],
  ],
  // the ice: a cap round the South Pole, and Greenland's
  ice: [Array.from({ length: 12 }, (_, i) => [i * 30, -66]), [[-45,60.5],[-48,62],[-50.5,65],[-52.5,68],[-54,71],[-57,73.5],[-61,76],[-70,77],[-60,79.5],[-55,81.5],[-45,82.5],[-33,83],[-22,81.5],[-19,78.5],[-21,75],[-22,71],[-27,68.5],[-33,67],[-39,65],[-40,62.5]]],
};
// the width at which the person stands h px tall from head to feet, the white the page mounts the puppet on not counted
const personW = (h) => (h * L["pg-nguoi"].w) / (L["pg-nguoi"].h - 2 * MARGIN);

const SCENES = [
  // the city: the moon we have, then a second one that comes up slowly before "TWO"; their light on the sea; and on
  // "more than our night sky" the camera settles a little, from the sky down to the city and the sea
  {
    shots: ["hook", "1", "2"],
    draw(ts, i, u) {
      const t1 = i ? ts - u : 1e9, t2 = i > 1 ? ts - u : 1e9; // when shots 1 and 2 began (1e9: not yet)
      const tNot = said("hook", "not one"), tTwo = said("hook", "TWO"), tMore = t2 + said("2", "more than");
      const lift = 40 * sm(tMore, tMore + 1.4, ts); // the plate, the moons and their glints rise 40 px; the person does not move (see below)
      city(ts, sceneLen("hook", "1", "2"), 1.03, 1.08, lift);
      // the second moon comes up over a second and a quarter, done just before "TWO"; the light of both grows on "Beautiful"
      const k = sm(tTwo - 1.25, tTwo - 0.15, ts), light = 0.35 + 0.4 * sm(t1, t1 + 0.7, ts);
      const AX = 790, AY = 420 - lift, AD = 300, BX = 430, BY = 250 - lift, BD = 190;
      glints(AX, SEA - lift, 1245 - lift, 260, 0.8, ts, 0);
      glints(BX, SEA - lift, 1245 - lift, 170, 0.75 * k, ts, 40);
      P("pg-nguoi", 330, FEET, personW(420)); // not lifted: its head stands 45 px under the caption, and a lifted one ran into it
      disc("pc-moon-a", AX, AY, AD, { light });
      halo(AX, AY, 208, sm(tNot, tNot + 0.45, ts), 1 - sm(tTwo + 0.3, tTwo + 0.8, ts));
      disc("pc-moon-b", BX, BY, BD * (0.75 + 0.25 * k), { light: light * k, alpha: k });
      // the stars twinkle in rings round the moons: round the new one on "TWO", round both on "Beautiful"
      stars(BX, BY, BD, ts, 12, sm(tTwo - 0.1, tTwo + 0.2, ts) * (1 - sm(tTwo + 1.4, tTwo + 1.8, ts)));
      const kB = sm(t1, t1 + 0.3, ts) * (1 - sm(t1 + 1.3, t1 + 1.7, ts));
      stars(AX, AY, AD, ts * 0.8, 12, kB); stars(BX, BY, BD, ts * 0.8 + 2, 8, kB);
    },
  },
  // the phases: the two moons large against the stars, each with a row of its phases under it. Ours waxes to full in
  // shot 3 and the sky brightens; from shot 4 both run on in time-lapse, a half cycle in 2.6 s, the second one a half
  // cycle behind, so they are never full together
  {
    shots: ["3", "4"],
    cut: "iris",
    // the engine's iris opens to 1366 px, so its point must lie within that of every corner of the frame (and within about
    // 1300 px, or the ring's inner edge darkens a corner at once), and within about 800 px of the caption zone, which the
    // first caption enters from 0.18 s: this one is the empty sky just under the phase rows, between the two moons
    iris: [540, 840],
    draw(ts) {
      const t4 = shotLen("3") + GAP, tBright = said("3", "brighter"), tOwn = t4 + said("4", "its own");
      const AX = 720, AY = 530, AD = 330, BX = 320, BY = 480, BD = 230;
      const run = (ts - t4) / 2.6;
      const pA = ts < t4 ? 0.25 + 0.25 * sm(0.2, tBright + 0.2, ts) : 0.5 + run, pB = 0.07 + (ts < t4 ? 0 : run);
      const bright = (lit(pA) + 0.45 * lit(pB)) / 1.45;
      space(ts);
      // the lighter sky of a brighter night: a pale veil over the stars, and a cold light under each moon
      out.fillStyle = `rgba(150,170,235,${(0.16 * bright).toFixed(3)})`; out.fillRect(0, 0, OW, OH);
      glow(AX, AY, 640, 0.2 + 0.45 * bright, "190,210,255"); glow(BX, BY, 460, 0.2 + 0.4 * bright, "190,210,255");
      disc("pc-moon-a", AX, AY, AD); disc("pc-moon-b", BX, BY, BD);
      phase(AX, AY, AD, pA); phase(BX, BY, BD, pB);
      row(AX, 800, pA, pop(0.35, ts)); row(BX, 770, pB, pop(0.5, ts));
      chip("OUR MOON", AX, 300, pop(0.3, ts), { size: 44 });
      chip("SECOND MOON", BX, 300, pop(0.45, ts), { size: 40 });
      const kB = pop(tBright - 0.1, ts), kO = pop(tOwn, ts), gone = sm(tOwn - 0.4, tOwn - 0.05, ts); // the brighter nights stay named until their corner is wanted, on "its own"
      if (kB > 0 && gone < 1) { out.save(); out.globalAlpha = 1 - gone; chip("BRIGHTER NIGHTS", 540, 960, kB, { size: 48 }); out.restore(); }
      if (kO > 0) chip("OWN CHANGING PHASES", 540, 960, kO, { size: 44 });
    },
  },
  // the tides seen from space: the water round the Earth swells toward our Moon; then the second moon comes up and
  // its own pull makes the pattern a lumpy one
  {
    shots: ["5", "6"],
    cut: "sheet",
    draw(ts) {
      const EX = 470, EY = 780, R = 170, DA = 150, DB = 100, ANGB = -2.05; // the Earth, the two moons, and where the second one comes up
      const tTide = said("5", "ocean tides"), tGrav = said("5", "gravity"), t6 = shotLen("5") + GAP, tSecond = t6 + said("6", "A second"), tMore = t6 + said("6", "more complicated");
      const kB = pop(tSecond, ts, 0.5), kI = sm(tSecond + 0.35, tSecond + 1.1, ts); // the second moon pops in, its pull grows after it
      const ax = EX + 440, ay = EY, bx = EX + 400 * Math.cos(ANGB), by = EY + 400 * Math.sin(ANGB), cb = Math.cos(ANGB), sb = Math.sin(ANGB);
      const kg = pop(tGrav, ts, 0.4), kgB = pop(tSecond + 0.5, ts, 0.4), kT = pop(tTide, ts);
      space(ts);
      glow(EX, EY, 600, 0.4, "104,146,240");
      disc("pc-moon-a", ax, ay, DA, { light: 0.45 });
      if (kB > 0) disc("pc-moon-b", bx, by, DB * kB, { light: 0.45 * kB });
      sleeve(EX, EY, R, [[34, 0], [34 * kI, ANGB]]);
      globe(EX, EY, R, EARTH, -30 + ts * 2, 15);
      // from "gravity" an arrow from the water toward the moon: the moon pulls the water
      arrow(EX + 238, EY, ax - 92, EY, kg);
      if (kgB > 0) arrow(EX + cb * 222, EY + sb * 222, bx - cb * 66, by - sb * 66, kgB);
      if (kT > 0) stick(300, 970, 288, 812, 9, CREAM, 4); // the tide named where it shows: a stick from the label to the water
      chip("OCEAN TIDES", 300, 1010, kT, { size: 44 });
      chip("OUR MOON", 900, 925, pop(0.3, ts), { size: 40 }); // under the moon, where the arrow that names its pull leaves room above it
      badge("GRAVITY", 900, 640, kg, RED, 44);
      chip("SECOND MOON", bx, 322, pop(tSecond + 0.1, ts), { size: 40 });
      badge("ANOTHER PULL", 600, 430, pop(t6 + said("6", "another tidal"), ts), RED, 40);
      chip("MORE COMPLICATED", 540, 1130, pop(tMore, ts), { size: 44 });
    },
  },
  // the split frame, on the cream sheet: two cards. On the left the two moons pull along one line and their tides add;
  // on the right they pull at right angles and partly cancel. The card spoken for is the bright one and the other is
  // under a veil of the sheet's own paper; on "their positions" the moons of both swing round together
  {
    shots: ["7", "8"],
    cut: "iris",
    iris: [540, 760], // the gap between the two cards, at the height of their Earths; see the iris of shot 3 for the limits
    draw(ts) {
      const t8 = shotLen("7") + GAP, tRein = said("7", "reinforce"), tRange = said("7", "tidal ranges"), tOff = t8 + said("8", "partly offset"), tPos = t8 + said("8", "their positions");
      const swap = sm(t8, t8 + 0.45, ts), swing = 0.55 * sm(tPos, tPos + 0.9, ts);
      plate("pl-giay-vang", ts, sceneLen("7", "8"), 0.5, 1.08, 1.11);
      const cards = [
        { x: 40, angles: [0, Math.PI], live: 1 - 0.55 * swap, range: 0.5 + 0.28 * sm(tRange, tRange + 0.6, ts) },
        { x: 560, angles: [0, -Math.PI / 2], live: 0.45 + 0.55 * swap, range: 0.3 },
      ];
      for (const c of cards) {
        const cx = c.x + 240, top = 290, sx = cx + 50, sy = top + 400, left = c === cards[0];
        card(c.x, top, 480, 860);
        gauge(cx - 195, top + 290, c.range);
        sleeve(sx, sy, 70, c.angles.map((an, m) => [[26, 18][m], an + swing]));
        globe(sx, sy, 70, EARTH, -30 + ts * 2, 15);
        c.angles.forEach((an, m) => disc(m ? "pc-moon-b" : "pc-moon-a", sx + 145 * Math.cos(an + swing), sy + 145 * Math.sin(an + swing), m ? 40 : 54));
        if (left) { badge("REINFORCE", cx, top + 64, pop(tRein - 0.1, ts), RED, 40); chip(["BIGGER", "TIDAL RANGE"], cx, top + 745, pop(tRange, ts), { size: 38 }); }
        else { badge("PARTLY OFFSET", cx, top + 64, pop(tOff, ts), TEAL, 36); chip(["SMALLER", "TIDAL RANGE"], cx, top + 745, pop(tOff + 0.25, ts), { size: 38 }); }
        if (c.live < 1) { out.save(); out.fillStyle = `rgba(243,236,210,${(1 - c.live).toFixed(3)})`; out.beginPath(); out.roundRect(c.x, top, 480, 860, 26); out.fill(); out.restore(); }
      }
    },
  },
  // the eclipses: the small moon crosses the line from the Earth to the Sun as "solar" is said and throws its shadow
  // on the Earth; the big one slips into the Earth's own shadow as "lunar" is said and goes copper. Each rides its own
  // ring, and each shadow shows only while its moon is near its line
  {
    shots: ["9", "10"],
    cut: "band",
    draw(ts) {
      const EX = 640, EY = 790, R = 170, SX = 250, SY = 330, RA = 340, RB = 230; // the Earth, the Sun and the two rings
      const t10 = shotLen("9") + GAP, tSolar = t10 + said("10", "solar"), tLunar = t10 + said("10", "lunar");
      const toSun = Math.atan2(SY - EY, SX - EX), away = toSun + Math.PI;
      const angB = toSun + 0.75 * (ts - tSolar), angA = away + 0.5 * (ts - tLunar);
      const ax = EX + RA * Math.cos(angA), ay = EY + RA * Math.sin(angA), bx = EX + RB * Math.cos(angB), by = EY + RB * Math.sin(angB);
      // how far each moon is from the line its eclipse needs
      const off = (ang, line) => Math.abs(Math.atan2(Math.sin(ang - line), Math.cos(ang - line)));
      const kB = 1 - sm(0.14, 0.46, off(angB, toSun));
      // the Earth's shadow comes up only from a quarter of a second before "lunar" (0.6 s after "solar", its shadow
      // fading by then) and stays nearly a second past it (the big moon rides 0.5 rad a second), so each eclipse is seen
      // on its own word
      const kA = sm(-0.125, -0.015, angA - away) * (1 - sm(0.275, 0.475, angA - away));
      space(ts);
      glow(SX, SY, 340, 0.9, "255,214,120");
      disc("pc-mat-troi", SX, SY, 436);
      glow(EX, EY, 540, 0.6, "104,146,240");
      ring(EX, EY, RB, sm(0.2, 0.8, ts));
      ring(EX, EY, RA, sm(0.3, 0.9, ts));
      umbra(EX, EY, R, away, RA + 40, kA);
      shadowCone(bx, by, 68, EX, EY, R, kB);
      globe(EX, EY, R, EARTH, -20 + ts * 4, 20);
      shadowSpot(bx, by, EX, EY, R, kB);
      const ka = pop(0.25, ts), kb = pop(0.15, ts);
      disc("pc-moon-a", ax, ay, 96 * ka); disc("pc-moon-b", bx, by, 68 * kb);
      if (kA > 0) { out.save(); out.beginPath(); out.arc(ax, ay, 47 * ka, 0, 7); out.clip(); out.fillStyle = `rgba(190,88,46,${(0.85 * kA).toFixed(3)})`; out.fillRect(ax - 50, ay - 50, 100, 100); out.restore(); }
      chip("ECLIPSES?", 770, 255, pop(0.3, ts), { size: 52 });
      badge("SOLAR ECLIPSE", 250, 625, pop(tSolar, ts), GOLD, 36);
      badge("LUNAR ECLIPSE", 830, 1175, pop(tLunar, ts), COPPER, 36);
      chip("JUST RIGHT", 770, 345, pop(t10 + said("10", "just right"), ts), { size: 44 });
    },
  },
  // the pull, seen from outside the two orbits. From "pull" each moon pulls on the other wherever they are, and the
  // orbits bend a little, each drawn as it was at four moments before. The two rings never cross: they only change shape
  {
    shots: ["11", "12"],
    cut: "sheet",
    draw(ts) {
      const EX = 540, EY = 790, R = 160, DA = 100, DB = 60; // the Earth and the two moons
      const t12 = shotLen("11") + GAP, tPull = t12 + said("12", "pull on each other"), tPaths = t12 + said("12", "their orbital paths");
      // how far the orbits have bent by a moment (0 to 1); an orbit at a moment: its semi-major axis, eccentricity, the
      // direction of its near end, and how flat it is seen
      const bend = (at) => sm(tPull, tPaths + 1.6, at);
      const orbitA = (at) => [400 + 20 * bend(at), 0.04 + 0.05 * bend(at), 0.3 + 0.7 * bend(at), 0.8], orbitB = (at) => [250 + 10 * bend(at), 0.04 + 0.05 * bend(at), -1.2 - 0.7 * bend(at), 0.84];
      const angA = 0.55 * (ts - tPull) + 2.3, angB = 0.85 * (ts - tPull) + 0.7;
      const [ax, ay] = place(EX, EY, ...orbitA(ts).slice(0, 3), angA, orbitA(ts)[3]), [bx, by] = place(EX, EY, ...orbitB(ts).slice(0, 3), angB, orbitB(ts)[3]);
      const pull = sm(tPull, tPull + 0.3, ts);
      space(ts);
      glow(EX, EY, 520, 0.3, "170,200,255");
      // the shapes at four moments before, 0.4 s apart: all four are in a third of a second before the change
      for (let j = 0; j < 4; j++) { const at = tPaths + j * 0.4, was = 0.45 * sm(at, at + 0.16, ts); if (was > 0) for (const o of [orbitA, orbitB]) orbit(EX, EY, ...o(at).slice(0, 3), { sq: o(at)[3], alpha: was, colour: "#fbf3df", width: 7, shadow: 0 }); }
      for (const o of [orbitA, orbitB]) orbit(EX, EY, ...o(ts).slice(0, 3), { sq: o(ts)[3] });
      // a moon is behind the Earth only on the far half of its orbit, and near enough to cross the rim
      const behind = [Math.sin(angA) < 0 && Math.hypot(ax - EX, ay - EY) < R + DA / 2, Math.sin(angB) < 0 && Math.hypot(bx - EX, by - EY) < R + DB / 2];
      if (behind[0]) disc("pc-moon-a", ax, ay, DA);
      if (behind[1]) disc("pc-moon-b", bx, by, DB);
      globe(EX, EY, R, EARTH, -30 + ts * 3, 15);
      if (!behind[0]) disc("pc-moon-a", ax, ay, DA, { light: 0.4 });
      if (!behind[1]) disc("pc-moon-b", bx, by, DB, { light: 0.4 });
      if (!(behind[0] || behind[1])) tether(ax, ay, DA / 2, bx, by, DB / 2, pull);
      const gone11 = sm(t12 - 0.4, t12 - 0.05, ts), gonePull = sm(tPaths - 0.3, tPaths - 0.05, ts);
      if (gone11 < 1) { out.save(); out.globalAlpha = 1 - gone11; chip("A BIGGER CHALLENGE", 540, 270, pop(0.3, ts), { size: 48 }); out.restore(); }
      if (gonePull < 1) { out.save(); out.globalAlpha = 1 - gonePull; badge("PULL", 540, 270, pop(tPull, ts), RED, 48); out.restore(); }
      chip("ORBITAL PATHS CHANGE", 540, 270, pop(tPaths + 0.1, ts), { size: 44 });
    },
  },
  // two simulations, one above the other in framed panels of the sky: a system whose orbits hold, and one whose
  // orbit distances change a great deal. In each panel the two rings are flattened alike and share their tilt, so one
  // lies wholly outside the other and the moons pass close without ever touching. In the second both moons stand on one side of the Earth as "collision" is
  // said, the outer one far out, and nothing comes together. The lower panel is named three times on its own words: by its
  // arrangement, by what it leads to, and by what does not follow from it
  {
    shots: ["13", "14"],
    cut: "iris",
    iris: [540, 750], // the line between the two panels; see the iris of shot 3 for the limits
    draw(ts) {
      const t14 = shotLen("13") + GAP, tPoor = said("13", "poorly arranged"), tUnstable = said("13", "unstable"), tAuto = t14 + said("14", "automatically"), tHit = t14 + said("14", "collision");
      const PX = 40, PW = 980, PH = 470, PY = [240, 750], CX = 540, CY = [520, 1035];
      space(ts);
      for (const y of PY) piece(() => out.roundRect(PX, y, PW, PH, 24), "#141c48", { line: 4 });
      system(CX, CY[0], 40, [[270, 0.03, 0, 0.5, 0.08], [150, 0.03, 0, 0.5, 0.08]], [0.5 * ts + 0.4, 0.9 * ts + 2.6], ts, [42, 26]);
      // the passing: both moons are on the same side of the Earth as "collision" is said, the outer one far out
      const pass = ts - tHit, sway = [
        [243, 0.03 + 0.08 * (0.5 + 0.5 * Math.sin(1.1 * ts)), 0.4 + 0.5 * Math.sin(0.7 * ts), 0.5, 0.04 * Math.sin(0.5 * ts)],
        [142, 0.02 + 0.05 * (0.5 + 0.5 * Math.sin(1.5 * ts + 1.9)), -0.8 + 0.45 * Math.sin(0.9 * ts + 2), 0.5, 0.04 * Math.sin(0.5 * ts)],
      ];
      const low = system(CX, CY[1], 40, sway, [5 + 0.45 * pass, 5 + 0.9 * pass], ts, [42, 26]);
      // the pull shows between them as they pass, and lets go again
      if (!(low.behind[0] || low.behind[1])) tether(...low.at[0], 21, ...low.at[1], 13, sm(tHit - 0.6, tHit - 0.25, ts) * (1 - sm(tHit + 0.3, tHit + 0.65, ts)));
      const gonePoor = sm(tUnstable - 0.4, tUnstable - 0.1, ts), gone = sm(tAuto - 0.05, tAuto + 0.2, ts);
      out.save(); out.globalAlpha = 1 - gonePoor; chip("POORLY ARRANGED", 540, PY[1] + 52, pop(tPoor, ts), { size: 44 }); out.restore();
      out.save(); out.globalAlpha = 1 - gone; badge("UNSTABLE?", 540, PY[1] + 52, pop(tUnstable, ts), RED, 44); out.restore();
      badge("STABLE", 540, PY[0] + 52, pop(0.3, ts), TEAL, 44);
      chip("NO AUTOMATIC COLLISION OR DISASTER", 540, PY[1] + 52, pop(tAuto + 0.15, ts), { size: 32 });
    },
  },
  // Earth turning, over millions of years: the two moons appear, the water follows them, and from "tidal interactions"
  // arrows show the pull their tides keep on the Earth; on "rotation" the spin itself is marked, and it stays named through
  // shot 16, which says what the change of it depends on: the mass of each moon, and how far it is. The moons ride half a ring
  // apart at nearly one rate, so they never come near each other, whatever the lengths of the two shots
  {
    shots: ["15", "16"],
    cut: "band",
    draw(ts) {
      const EX = 540, EY = 745, R = 160, DA = 120, DB = 80; // the Earth and the two moons
      const t16 = shotLen("15") + GAP, tTide = said("15", "tidal interactions"), tRot = said("15", "rotation"), tMass = t16 + said("16", "masses"), tDist = t16 + said("16", "distances");
      // the note of shot 15 fades out before shot 16 begins, where its corner is wanted for a badge: the boundary of two
      // shots of one scene has no cover
      const out15 = 1 - sm(t16 - 0.35, t16 - 0.05, ts);
      // the two moons on rings that lie round the whole Earth, tilted as a ring is seen from a little above its plane
      const angA = 0.7 * ts + 0.25, angB = 0.74 * ts + 0.25 + Math.PI, ax = EX + 365 * Math.cos(angA), ay = EY + 290 * Math.sin(angA), bx = EX + 300 * Math.cos(angB), by = EY + 262 * Math.sin(angB);
      const kA = pop(0.35, ts), kB = pop(0.55, ts), far = sm(tDist, tDist + 0.4, ts), kr = sm(tMass, tMass + 0.3, ts), dirA = Math.atan2(ay - EY, ax - EX), dirB = Math.atan2(by - EY, bx - EX);
      space(ts);
      glow(EX, EY, 640, 0.3, "170,200,255");
      for (const [a, b] of [[365, 290], [300, 262]]) { out.save(); out.globalAlpha = 0.45 + 0.45 * far; out.strokeStyle = mix("#fbf3df", "#f6c453", far); out.lineWidth = 7; out.setLineDash([18, 18]); out.beginPath(); out.ellipse(EX, EY, a, b, 0, 0, 7); out.stroke(); out.restore(); }
      sleeve(EX, EY, R, [[12 * kA, dirA], [9 * kB, dirB]], 12);
      // the map is sketched for views centred on the Atlantic (see EARTH): it turns by a few degrees a second, and a
      // faster turn leaves that range and the engine paints whole continents across the disc
      globe(EX, EY, R, EARTH, -30 + ts * 5, 15);
      const kt = pop(tTide, ts, 0.4);
      if (kt > 0) for (const [x, y, d, dir, k] of [[ax, ay, DA, dirA, kA], [bx, by, DB, dirB, kB]]) if (k > 0) arrow(EX + Math.cos(dir) * (R + 26), EY + Math.sin(dir) * (R + 26), x - Math.cos(dir) * (d / 2 - 6), y - Math.sin(dir) * (d / 2 - 6), kt); // the head runs under the moon's white rim
      spinArrow(EX, EY, R, sm(tRot, tRot + 0.5, ts));
      if (kA > 0) disc("pc-moon-a", ax, ay, DA * kA, { light: 0.45 });
      if (kB > 0) disc("pc-moon-b", bx, by, DB * kB, { light: 0.45 });
      halo(ax, ay, 108, kr, 1, "#6fd6c6"); halo(bx, by, 80, kr, 1, "#6fd6c6");
      const kRot = pop(tRot, ts);
      out.save(); out.globalAlpha = out15;
      chip(["MILLIONS OF", "YEARS PASS"], 260, 270, pop(0.3, ts), { size: 40 });
      out.restore();
      if (kRot > 0) chip(["EARTH'S", "ROTATION"], 870, 270, kRot, { size: 40 });
      badge("MASSES", 250, 1165, pop(tMass, ts), TEAL, 44);
      badge("DISTANCES", 830, 1165, pop(tDist, ts), GOLD, 44);
    },
  },
  // back to the city: the two moons over the sea, brighter than ever, the stars twinkling round them; under them, as
  // the last question is asked, the question of the outline on a card
  {
    shots: ["17", "kết"],
    cut: "iris",
    iris: [540, 790],
    draw(ts) {
      const tK = shotLen("17") + GAP, AX = 790, AY = 420, AD = 300, BX = 430, BY = 250, BD = 190;
      city(ts, sceneLen("17", "kết"), 1.03, 1.08);
      glints(AX, SEA, 1245, 260, 0.9, ts, 0); glints(BX, SEA, 1245, 170, 0.8, ts, 40);
      P("pg-nguoi", 330, FEET, personW(420));
      disc("pc-moon-a", AX, AY, AD, { light: 0.8 }); disc("pc-moon-b", BX, BY, BD, { light: 0.8 });
      const kS = sm(0.3, 0.7, ts) * (1 - sm(tK + 1.2, tK + 1.7, ts));
      stars(AX, AY, AD, ts, 12, kS); stars(BX, BY, BD, ts + 2, 9, kS);
      chip(["WOULD YOU", "LIVE HERE?"], 470, 950, pop(tK + 0.45, ts, 0.6), { size: 88 });
    },
  },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, look: "storybook", stickers: CUTS.filter((n) => n.startsWith("pc-")) });
