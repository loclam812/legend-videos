// The paper-cut scenes of the Arthropleura short, cut from 300-trieu-nam-giay-en and laid out again for the tall frame.
// The engine is giay/may.js; the layers are listed in anh.js.
const PLATES = ["pl-rung"];
const CUTS = ["pc-vay", "pc-moc-tac", "pc-duong-xi", "pc-bui", "pc-dat", "pg-ban", "pg-ban-so", "pg-arthro"];
// which way the generated pieces face, found by looking at them: 1 means the piece faces left as generated
const LEFT = { arthro: 1 };
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
const crawl = (x, w, t, { left = 1, y = FEET - 10, alpha = 1 } = {}) => P("pg-arthro", x, y + 4 * Math.sin(t * 8), w, { flip: left !== LEFT.arthro, rot: 0.012 * Math.sin(t * 8), alpha });
// a dimension line with end ticks, drawn above something to show its length
function measure(x0, x1, y, k) {
  if (k <= 0) return;
  out.save(); out.strokeStyle = "#f6c453"; out.lineWidth = 9; out.lineCap = "round"; out.globalAlpha = Math.min(1, k);
  const x = x0 + (x1 - x0) * Math.min(1, k);
  out.beginPath(); out.moveTo(x0, y); out.lineTo(x, y); out.moveTo(x0, y - 30); out.lineTo(x0, y + 30); if (k >= 1) { out.moveTo(x1, y - 30); out.lineTo(x1, y + 30); } out.stroke();
  out.restore();
}

const SCENES = [
  { shots: ["hook"], draw(ts) {
    forest(ts, 7);
    you(ts > 2 ? "pg-ban-so" : "pg-ban", 230, ts);
    crawl(1500 - 800 * sm(0, 4, ts), 770, ts);
    front(ts);
    tag("THE LARGEST ARTHROPOD", 90, 330, -0.03, pop(0.6, ts), 56);
  } },
  { shots: ["1"], draw(ts) {
    forest(ts, 8);
    crawl(1500 - 1500 * sm(0, 7, ts), 900, ts);
    front(ts);
    tag("ARTHROPLEURA", 190, 330, -0.03, pop(0.8, ts), 76);
    tag("~300 MILLION YEARS AGO", 140, 480, 0.02, pop(2.4, ts), 48);
  } },
  { shots: ["2"], draw(ts) {
    forest(ts, 6);
    you("pg-ban", 200, ts);
    crawl(690, 770, ts * 0.2);
    front(ts);
    measure(305, 1075, 1380, sm(0.8, 2.6, ts));
    tag("UP TO ~2.6 M", 420, 1260, -0.02, pop(2.6, ts), 60);
  } },
  { shots: ["3"], draw(ts) {
    forest(ts, 5);
    crawl(540, 900, ts * 0.4);
    front(ts);
    tag("~50 KG", 330, 420, -0.03, pop(0.6, ts), 110);
    sparkles(540, 1450, 300, ts, 8);
  } },
  { shots: ["4"], draw(ts) {
    forest(ts, 7);
    crawl(1300 - 220 * ts, 2300, ts, { y: FEET + 120 });
    tag("ARMOURED PLATES", 120, 380, -0.03, pop(0.8, ts), 60);
    tag("MANY PAIRS OF LEGS", 300, 540, 0.02, pop(3, ts), 52);
  } },
  { shots: ["5"], draw(ts) {
    forest(ts, 5);
    you("pg-ban", 820, ts, { flip: 1 });
    crawl(900 - 900 * sm(0, 5, ts), 770, ts);
    front(ts);
    tag("PROBABLY ATE PLANTS", 100, 400, -0.03, pop(1.6, ts), 56);
  } },
  { shots: ["6"], draw(ts) {
    forest(ts, 7);
    crawl(540, 900, ts * 0.3, { alpha: 1 - sm(3, 5.5, ts) });
    front(ts);
    tag("~45 MILLION YEARS", 170, 380, -0.03, pop(0.8, ts), 62);
    tag("GONE IN THE PERMIAN", 160, 540, 0.02, pop(3.4, ts), 56);
  } },
  { shots: ["kết"], draw(ts) {
    forest(ts, 6);
    rays(540, 800, ts);
    you("pg-ban", 300, ts);
    crawl(800 - 40 * Math.sin(ts * 0.5), 560, ts);
    front(ts);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, card: ["Into Deep Time", "2.6 M", "MILLIPEDE"] });
