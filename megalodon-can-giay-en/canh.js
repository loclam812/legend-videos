// The paper-cut scenes of Megalodon short 2. The engine is giay/may.js; the layers are listed in anh.js.
// Hook format (2026-11-26): the open jaws fill the frame and move at frame 0 with the big claim already on screen, no opening scene.
const PLATES = ["pl-bien"];
const CUTS = ["pg-meg", "pg-meg-ham", "pg-ca-map-trang", "pc-voi", "pc-xuong"];
// which way the generated pieces face, found by looking at them: 1 means the piece faces left as generated
const LEFT = { meg: 0, trang: 1, elephant: 1 };

// the generated skies have a pale paper border: draw them enlarged so it falls outside the frame
const back = (t, total) => { out.save(); out.translate(540, 960); out.scale(1.16, 1.16); out.translate(-540, -960); plate("pl-bien", t, total, 0.5); out.restore(); };
const swim = (name, key, x, y, w, t, left = 1) => P(name, x, y + 20 * Math.sin(t * 1.8), w, { flip: left !== LEFT[key], rot: 0.04 * Math.sin(t * 1.8 + 1), shadow: 0 });
function bubbles(t) {
  for (let n = 0; n < 8; n++) { const k = (t * 0.3 + n * 0.13) % 1; out.save(); out.globalAlpha = 0.7 * (1 - k); out.strokeStyle = "#dff3f5"; out.lineWidth = 4; out.beginPath(); out.arc(100 + n * 125, 1850 - 1600 * k, 8 + 10 * rnd(n, 3), 0, 7); out.stroke(); out.restore(); }
}
// a dimension line with end ticks, drawn above something to show its length
function measure(x0, x1, y, k) {
  if (k <= 0) return;
  out.save(); out.strokeStyle = "#f6c453"; out.lineWidth = 9; out.lineCap = "round"; out.globalAlpha = Math.min(1, k);
  const x = x0 + (x1 - x0) * Math.min(1, k);
  out.beginPath(); out.moveTo(x0, y); out.lineTo(x, y); out.moveTo(x0, y - 30); out.lineTo(x0, y + 30); if (k >= 1) { out.moveTo(x1, y - 30); out.lineTo(x1, y + 30); } out.stroke();
  out.restore();
}
const elephant = (x, w, k) => { if (k > 0) P("pc-voi", x, 1600, w * k, { flip: LEFT.elephant }); };

const SCENES = [
  { shots: ["hook"], draw(ts) {
    back(ts, 4);
    bubbles(ts);
    P("pg-meg-ham", 540, 1820 + 10 * Math.sin(ts * 2), 1000 * (1 + 0.07 * ts), { shadow: 0 });
    tag("STRONGEST BITE", 60, 300, -0.03, 1, 104);
    tag("IN HISTORY?", 200, 500, 0.02, 1, 104);
  } },
  { shots: ["1"], draw(ts) {
    back(ts, 4);
    bubbles(ts);
    swim("pg-ca-map-trang", "trang", 560 - 30 * ts, 980, 440, ts * 1.4);
    swim("pg-meg", "meg", 560 - 30 * ts, 1600, 1150, ts);
    tag("GREAT WHITE ~1.8 T", 120, 720, -0.02, pop(0.4, ts), 54);
    tag("MEGALODON UP TO 18 T", 80, 1060, 0.02, pop(1.2, ts), 54);
    tag("UP TO 10×", 230, 380, -0.03, pop(2, ts), 120);
  } },
  { shots: ["2"], draw(ts) {
    back(ts, 5);
    bubbles(ts);
    [200, 540, 880].forEach((x, n) => elephant(x, 330, pop(0.3 + 0.6 * n, ts)));
    tag("UP TO 18 TONNES", 90, 420, -0.03, pop(2.2, ts), 100);
    tag("= 3 ELEPHANTS", 200, 620, 0.02, pop(2.6, ts), 80);
  } },
  { shots: ["3"], draw(ts) {
    back(ts, 4);
    bubbles(ts);
    P("pc-xuong", 540, 1400 + 6 * Math.sin(ts), 1000, { rot: -0.03 });
    ring(540, 1250, 230, sm(0.8, 2.2, ts));
    tag("BITE MARKS", 230, 420, -0.03, pop(0.4, ts), 104);
  } },
  { shots: ["kết"], draw(ts) {
    back(ts, 5);
    rays(540, 0, ts);
    swim("pg-meg", "meg", 600 - 50 * ts, 1300, 900, ts * 0.7);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, card: ["Into Deep Time", "MEGALODON", "THE BITE"] });
