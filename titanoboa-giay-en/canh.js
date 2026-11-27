// The paper-cut scenes of the Titanoboa short. The engine is giay/may.js; the layers are listed in anh.js.
// Hook format of the Megalodon Shorts: the snake and the claim are on screen at frame 0, no opening scene.
const PLATES = ["pl-dam"];
const CUTS = ["pg-tran", "pc-xe", "pg-ca", "pc-co"];
// which way the generated pieces face, found by looking at them: 1 means the piece faces left as generated
const LEFT = { tran: 1, xe: 1, ca: 1 };

// the generated skies have a pale paper border: draw them enlarged so it falls outside the frame
const back = (t, total) => { out.save(); out.translate(540, 960); out.scale(1.16, 1.16); out.translate(-540, -960); plate("pl-dam", t, total, 0.5); out.restore(); };
const snake = (x, y, w, t, left = 1) => P("pg-tran", x, y + 10 * Math.sin(t * 2), w, { flip: left !== LEFT.tran, rot: 0.02 * Math.sin(t * 2.4), shadow: 0 });
const fish = (x, y, w, t, left = 1) => P("pg-ca", x, y + 14 * Math.sin(t * 3), w, { flip: left !== LEFT.ca, rot: 0.04 * Math.sin(t * 3), shadow: 0 });
const car = (x, y, w) => P("pc-xe", x, y, w);
const reeds = (t) => { P("pc-co", 90, 1960, 520, { rot: 0.01 * Math.sin(t) }); P("pc-co", 1000, 1960, 560, { rot: 0.01 * Math.sin(t + 2), flip: 1 }); };
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
    back(ts, 4);
    snake(560 - 25 * ts, 1330, 1080, ts);
    car(195, 1700, 340); car(540, 1700, 340); car(885, 1700, 340);
    tag("AS LONG AS", 110, 330, -0.03, 1, 112);
    tag("3 CARS", 290, 540, 0.02, 1, 140);
  } },
  { shots: ["1"], draw(ts) {
    back(ts, 5);
    snake(1500 - 330 * ts, 1400, 1080, ts);
    reeds(ts);
    tag("TITANOBOA", 150, 330, -0.03, pop(0.4, ts), 104);
    tag("COLOMBIA", 260, 500, 0.02, pop(1.4, ts), 76);
    tag("~60 MILLION YEARS AGO", 100, 640, -0.01, pop(2.2, ts), 52);
  } },
  { shots: ["2"], draw(ts) {
    back(ts, 5);
    snake(540 - 15 * ts, 1250, 1000, ts);
    car(540, 1720, 460);
    tag("OVER 1 TONNE", 120, 380, -0.03, pop(0.4, ts), 104);
    tag("A SMALL CAR", 230, 1830, 0.02, pop(2.4, ts), 70);
  } },
  { shots: ["3"], draw(ts) {
    back(ts, 4);
    fish(700 - 120 * ts, 1300, 520, ts * 1.4);
    snake(1300 - 170 * ts, 1600, 1080, ts * 1.4);
    reeds(ts);
    tag("FISH HUNTER", 170, 380, -0.03, pop(0.3, ts), 100);
  } },
  { shots: ["4"], draw(ts) {
    back(ts, 6);
    rays(900, 0, ts, 0.22);
    snake(560 - 10 * ts, 1450, 1000, ts * 0.6);
    reeds(ts);
    tag("BIG SNAKES NEED HEAT", 70, 380, -0.03, pop(0.4, ts), 66);
    tag("HOTTER TROPICS?", 150, 540, 0.02, pop(2.6, ts), 78);
  } },
  { shots: ["kết"], draw(ts) {
    back(ts, 6);
    rays(540, 0, ts);
    snake(600 - 40 * ts, 1500, 1000, ts * 0.7);
    reeds(ts);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, card: ["Into Deep Time", "TITANOBOA", "3 CARS LONG"] });
