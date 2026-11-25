// The paper-cut scenes of the wildfire short, cut from 300-trieu-nam-giay-en and laid out again for the tall frame.
// The engine is giay/may.js; the layers are listed in anh.js.
const PLATES = ["pl-rung", "pl-troi", "pl-bao", "pl-lua"];
const CUTS = ["pc-vay", "pc-moc-tac", "pc-duong-xi", "pc-bui", "pc-dat", "pc-may", "pc-lua"];
const FIRE = ["#f2c14e", "#e8662a", "#c8402f", "#fff3b0"];
const GROUND = 1560;

// the generated skies have a pale paper border: draw them enlarged so it falls outside the frame
const back = (name, t, total) => { out.save(); out.translate(540, 960); out.scale(1.16, 1.16); out.translate(-540, -960); plate(name, t, total, 0.5); out.restore(); };
const fade = (name, t, total, k) => { if (k <= 0) return; out.save(); out.globalAlpha = Math.min(1, k); back(name, t, total); out.restore(); };
const soil = () => { ground("#3a2a1c", GROUND); P("pc-dat", 540, GROUND + 230, 1500); };
const tree = (name, x, w, t, n = 0, alpha = 1) => P(name, x, GROUND + 40, w, { rot: 0.008 * Math.sin(t * 1.1 + n), alpha });
function trees(t, alpha = 1) {
  tree("pc-vay", 170, 300, t, 1, 0.85 * alpha); tree("pc-moc-tac", 450, 150, t, 2, 0.85 * alpha); tree("pc-vay", 760, 280, t, 3, 0.85 * alpha); tree("pc-duong-xi", 980, 420, t, 4, 0.9 * alpha);
  P("pc-bui", 540, GROUND + 30, 1500, { alpha });
  soil();
}
const front = (t) => { tree("pc-vay", 20, 460, t, 5); tree("pc-vay", 1070, 480, t, 6); };
const flame = (x, y, w, t, n = 0) => P("pc-lua", x, y, w * (1 + 0.08 * Math.sin(t * 11 + n)), { rot: 0.05 * Math.sin(t * 7 + n), shadow: 0 });
const flash = (k) => { if (k <= 0) return; out.save(); out.globalAlpha = Math.min(1, k); out.fillStyle = "#fffbe8"; out.fillRect(0, 0, OW, OH); out.restore(); };
// a row of flames that catch one after another; k runs from 0 (none) to 1 (all burning)
const blaze = (t, k) => [[160, 300], [430, 360], [700, 320], [950, 340], [560, 260]].forEach(([x, w], n) => flame(x, GROUND + 40, w * sm(n * 0.15, n * 0.15 + 0.35, k), t, n));
function ash(t, n = 70) {
  out.save(); out.fillStyle = "#b9b2a6";
  for (let i = 0; i < n; i++) { out.globalAlpha = 0.5 + 0.4 * rnd(i, 63); out.beginPath(); out.arc((rnd(i, 61) * OW + 50 * Math.sin(t + i)) % OW, (rnd(i, 62) * OH + t * (90 + 80 * rnd(i, 64))) % OH, 5 + 6 * rnd(i, 65), 0, 7); out.fill(); }
  out.restore();
}
// a labelled bar that grows to `share` of 100 %, standing on y = 1450
function bar(x, label, share, color, k) {
  if (k <= 0) return;
  const h = 26 * share * Math.min(1, k);
  out.save();
  out.shadowColor = "rgba(40,20,10,.5)"; out.shadowBlur = 16; out.shadowOffsetY = 8;
  out.fillStyle = color; out.fillRect(x - 130, 1450 - h, 260, h);
  out.shadowColor = "transparent"; out.lineWidth = 6; out.strokeStyle = "#2a1608"; out.strokeRect(x - 130, 1450 - h, 260, h);
  out.restore();
  tag(`${Math.round(share * Math.min(1, k))}%`, x - 90, 1390 - h, -0.02, 1, 64);
  tag(label, x - 120, 1520, 0, 1, 40);
}

const SCENES = [
  { shots: ["hook"], draw(ts) {
    const lit = sm(1, 3.5, ts);
    out.save(); jolt(3 * lit);
    back("pl-bao", ts, 6); fade("pl-lua", ts, 6, lit);
    trees(ts);
    blaze(ts, lit);
    front(ts);
    out.restore();
    if (lit) night("#ffb890");
    tag("WHEN AIR COULD BURN", 120, 330, -0.03, pop(0.5, ts), 60);
  } },
  { shots: ["1", "2"], draw(ts, i, u) {
    back("pl-troi", ts, 12);
    P("pc-bui", 540, 1960, 1700);
    tag("OXYGEN IN THE AIR", 170, 300, -0.02, pop(0.3, ts), 60);
    bar(330, "THEN", 30, "#7fbf5a", i === 0 ? sm(1.5, 4, u) : 1);
    bar(760, "TODAY", 21, "#7fb4cc", i === 1 ? sm(0.3, 2, u) : 0);
  } },
  { shots: ["3"], draw(ts) {
    out.save(); jolt(3);
    back("pl-lua", ts, 6);
    trees(ts);
    blaze(ts, sm(0.3, 3, ts));
    front(ts);
    out.restore();
    night("#ffb890");
    shards(540, 1100, (ts % 1.2) * 0.6, 14, FIRE);
    tag("FIRE SPREADS FAST", 170, 330, -0.03, pop(0.6, ts), 64);
  } },
  { shots: ["4"], draw(ts) {
    const lit = sm(1.6, 4, ts);
    out.save(); jolt(4 * lit);
    back("pl-bao", ts, 6); fade("pl-lua", ts, 6, lit);
    P("pc-may", 620, 820, 900, { shadow: 0, alpha: 1 - 0.6 * lit });
    trees(ts);
    blaze(ts, lit);
    front(ts);
    out.restore();
    flash(1 - Math.abs(ts - 1.4) / 0.4);
    if (lit) night("#ffb890");
    tag("ONE LIGHTNING STRIKE", 110, 300, -0.03, pop(0.4, ts), 58);
  } },
  { shots: ["5"], draw(ts) {
    back("pl-troi", ts, 6);
    trees(ts, 0.55);
    night("#9a8f86");
    ash(ts);
    tag("FOSSIL CHARCOAL", 190, 330, -0.03, pop(0.6, ts), 62);
    tag("= FREQUENT WILDFIRES", 140, 490, 0.02, pop(2.4, ts), 54);
  } },
  { shots: ["kết"], draw(ts) {
    back("pl-rung", ts, 6);
    trees(ts);
    rays(540, 800, ts);
    front(ts);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, card: ["Into Deep Time", "WHEN AIR", "COULD BURN"] });
