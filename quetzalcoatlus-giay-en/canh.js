// The paper-cut scenes of the Quetzalcoatlus short. The engine is giay/may.js; the layers are listed in anh.js.
// Hook format of the Megalodon Shorts: the animal and the claim are on screen at frame 0, no opening scene.
// pg-quetz-dung came back standing on two legs, not four, after three tries; it is only used for the stork-like stalking and the crouch.
const PLATES = ["pl-dong"];
const CUTS = ["pg-quetz-bay", "pg-quetz-dung", "pg-huou", "pc-may-bay", "pg-thu"];
// which way the generated pieces face, found by looking at them: 1 means the piece faces left as generated
const LEFT = { bay: 0, dung: 0, huou: 0, thu: 0 };
const FEET = 1760;

// the generated skies have a pale paper border: draw them enlarged so it falls outside the frame
const back = (t, total) => { out.save(); out.translate(540, 960); out.scale(1.16, 1.16); out.translate(-540, -960); plate("pl-dong", t, total, 0.5); out.restore(); };
const fly = (x, y, w, t, { left = 0, alpha = 1 } = {}) => P("pg-quetz-bay", x, y + 18 * Math.sin(t * 1.3), w, { flip: left !== LEFT.bay, rot: 0.05 * Math.sin(t * 0.9), alpha, shadow: 0 });
const stand = (x, y, w, t, { left = 0, alpha = 1 } = {}) => P("pg-quetz-dung", x, y, w, { flip: left !== LEFT.dung, rot: 0.015 * Math.sin(t * 1.6), alpha });
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
    fly(-200 + 260 * ts, 820, 420, ts);
    P("pg-huou", 300, FEET, 470, { rot: 0.01 * Math.sin(ts) });
    stand(770, FEET, 470, ts, { left: 1 });
    tag("AS TALL AS", 120, 330, -0.03, 1, 108);
    tag("A GIRAFFE", 190, 520, 0.02, 1, 116);
  } },
  { shots: ["1"], draw(ts) {
    back(ts, 5);
    fly(-450 + 380 * ts, 1300, 950, ts);
    tag("QUETZALCOATLUS", 80, 330, -0.03, pop(0.4, ts), 80);
    tag("A PTEROSAUR", 200, 500, 0.02, pop(1.4, ts), 76);
    tag("NOT A DINOSAUR", 150, 650, -0.01, pop(2.4, ts), 66);
  } },
  { shots: ["2"], draw(ts) {
    back(ts, 5);
    fly(540 + 10 * Math.sin(ts), 1150, 1000, ts);
    P("pc-may-bay", 540, 1640, 1000, { rot: 0.01 * Math.sin(ts * 1.2), shadow: 0 });
    measure(40, 1040, 560, sm(0.3, 1.8, ts));
    tag("~10 M WINGS", 210, 420, -0.03, pop(1.2, ts), 100);
    tag("A SMALL PLANE", 230, 1800, 0.02, pop(2.4, ts), 66);
  } },
  { shots: ["3"], draw(ts) {
    back(ts, 5);
    P("pg-thu", 880, FEET, 230, { flip: 1 !== LEFT.thu, rot: 0.03 * Math.sin(ts * 6) });
    stand(120 + 90 * sm(0, 3.5, ts), FEET + hop(ts, 4, 14), 480, ts);
    tag("HUNTED ON FOOT", 120, 380, -0.03, pop(0.4, ts), 86);
    tag("LIKE A STORK", 260, 540, 0.02, pop(2.2, ts), 70);
  } },
  { shots: ["4"], draw(ts) {
    back(ts, 4);
    const crouch = sm(0, 1.4, ts), up = sm(1.4, 2.4, ts);
    if (up < 1) stand(540, FEET + 50 * crouch - 900 * up, 480, ts, { alpha: 1 - up });
    if (up > 0) fly(540 + 300 * sm(2, 4, ts), FEET - 300 - 600 * up, 500 + 500 * up, ts, { alpha: up });
    tag("TAKE-OFF", 260, 380, -0.03, pop(0.3, ts), 100);
    tag("PUSHED UP WITH ITS ARMS", 70, 540, 0.02, pop(1.6, ts), 56);
  } },
  { shots: ["kết"], draw(ts) {
    back(ts, 6);
    rays(540, 0, ts);
    fly(200 + 120 * ts, 1100, 760, ts * 0.7);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, card: ["Into Deep Time", '<span style="font-size:44px">QUETZALCOATLUS</span>', "TALL AS A GIRAFFE"] });
