// The paper-cut scenes of the Meganeura short, cut from 300-trieu-nam-giay-en and laid out again for the tall frame.
// The engine is giay/may.js; the layers are listed in anh.js.
const PLATES = ["pl-rung", "pl-troi"];
const CUTS = ["pc-vay", "pc-moc-tac", "pc-duong-xi", "pc-bui", "pc-dat", "pg-ban", "pg-ban-so", "pg-mega", "pg-gian"];
// which way the generated pieces face, found by looking at them: 1 means the piece faces left as generated
const LEFT = { mega: 0 };
const GROUND = 1560, FEET = 1640;

// the generated skies have a pale paper border: draw them enlarged so it falls outside the frame
const back = (name, t, total) => { out.save(); out.translate(540, 960); out.scale(1.16, 1.16); out.translate(-540, -960); plate(name, t, total, 0.5); out.restore(); };
const soil = () => { ground("#3a2a1c", GROUND); P("pc-dat", 540, GROUND + 230, 1500); };
const tree = (name, x, w, t, n = 0, alpha = 1) => P(name, x, GROUND + 40, w, { rot: 0.008 * Math.sin(t * 1.1 + n), alpha });
function forest(t, total) {
  back("pl-rung", t, total);
  tree("pc-vay", 170, 300, t, 1, 0.85); tree("pc-moc-tac", 450, 150, t, 2, 0.85); tree("pc-vay", 760, 280, t, 3, 0.85); tree("pc-duong-xi", 980, 420, t, 4, 0.9);
  P("pc-bui", 540, GROUND + 30, 1500);
  soil();
}
const front = (t) => { tree("pc-vay", 20, 460, t, 5); tree("pc-vay", 1070, 480, t, 6); };
const you = (name, x, t, { w = 190, flip = 0 } = {}) => P(name, x, FEET + 4 * Math.sin(t * 2.2), w, { flip, rot: 0.015 * Math.sin(t * 1.6) });
const mega = (x, y, w, t, left = 0, n = 0) => P("pg-mega", x, y + 14 * Math.sin(t * 9 + n), w, { flip: left !== LEFT.mega, rot: 0.05 * Math.sin(t * 9 + n), shadow: 0 });
const ferns = () => P("pc-bui", 540, 1960, 1700);
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
// the insect's breathing tubes, drawn as a dotted line that runs along the body
function tubes(x, y, w, k) {
  if (k <= 0) return;
  out.save(); out.strokeStyle = "#f6c453"; out.lineWidth = 8; out.setLineDash([14, 12]); out.lineCap = "round"; out.globalAlpha = Math.min(1, k);
  for (const dy of [-0.18, -0.1]) { out.beginPath(); out.moveTo(x - w * 0.42, y + w * dy); out.lineTo(x + w * 0.3 * Math.min(1, k), y + w * dy); out.stroke(); }
  out.restore();
}

const SCENES = [
  { shots: ["hook"], draw(ts) {
    forest(ts, 7);
    you(ts > 1.4 ? "pg-ban-so" : "pg-ban", 380, ts);
    front(ts);
    mega(1500 - 760 * sm(0, 3, ts), 760, 720, ts, 1);
    tag("300 MILLION YEARS AGO", 110, 300, -0.03, pop(0.4, ts), 56);
  } },
  { shots: ["1"], draw(ts) {
    back("pl-troi", ts, 6);
    ferns();
    mega(540, 1420, 920, ts, 1);
    tag("MEGANEURA", 220, 330, -0.03, pop(0.6, ts), 84);
    tag("~70 CM WINGSPAN", 250, 500, 0.02, pop(2.4, ts), 60);
  } },
  { shots: ["2"], draw(ts) {
    back("pl-troi", ts, 5);
    ferns();
    const a = ts * 1.1;
    const prey = sm(0.5, 3, ts);
    P("pg-gian", 760 - 220 * prey, 900 + 120 * Math.sin(ts * 5), 150, { rot: ts * 3, alpha: 1 - sm(3, 3.6, ts) });
    mega(340 + 300 * prey, 1450 - 260 * prey + 40 * Math.sin(a), 720, ts, 0);
    tag("A FLYING HUNTER", 160, 330, -0.03, pop(0.6, ts), 64);
  } },
  { shots: ["3"], draw(ts, i, u, line, v) {
    back("pl-troi", ts, 7);
    ferns();
    mega(540, 1420, 920, ts * 0.3, 1);
    tubes(540, 1420 - 420, 920, line >= 1 ? sm(0, 1.5, v) : 0);
    tag("NO LUNGS", 300, 330, -0.03, pop(0.4, u), 80);
    tag("BREATHES THROUGH TUBES", 90, 500, 0.02, line >= 1 ? pop(0.3, v) : 0, 50);
  } },
  { shots: ["4"], draw(ts, i, u, line, v) {
    back("pl-troi", ts, 8);
    ferns();
    tag("OXYGEN IN THE AIR", 170, 300, -0.02, pop(0.3, u), 60);
    bar(330, "THEN", 30, "#7fbf5a", sm(0.4, 2.2, u));
    bar(760, "TODAY", 21, "#7fb4cc", line >= 1 ? sm(0, 1.6, v) : 0);
  } },
  { shots: ["5"], draw(ts, i, u) {
    back("pl-troi", ts, 6);
    ferns();
    const grow = sm(0.5, 4, u);
    mega(540, 1400, 360 + 560 * grow, ts, 1);
    sparkles(540, 1100, 380, ts, 10);
    tag("MORE OXYGEN → BIGGER?", 80, 330, -0.03, pop(0.6, u), 58);
  } },
  { shots: ["6"], draw(ts, i, u) {
    back("pl-troi", ts, 6);
    ferns();
    for (let n = 0; n < 3; n++) { const a = ts * (0.7 + n * 0.15) + n * 2.1; mega(540 + (330 - n * 60) * Math.cos(a), 1050 + (300 - n * 40) * Math.sin(a), 440 - n * 90, ts, Math.sin(a) > 0, n); }
    tag("NO BIRDS ✗", 140, 300, -0.03, pop(1, u), 64);
    tag("NO BATS ✗", 560, 470, 0.03, pop(2, u), 64);
  } },
  { shots: ["kết"], draw(ts) {
    forest(ts, 6);
    rays(540, 800, ts);
    you("pg-ban", 540, ts);
    front(ts);
    mega(300 + 60 * Math.sin(ts), 1000, 380, ts, 0, 1); mega(800 - 60 * Math.sin(ts), 1150, 320, ts, 1, 2);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, card: ["Into Deep Time", "70 CM", "DRAGONFLY"] });
