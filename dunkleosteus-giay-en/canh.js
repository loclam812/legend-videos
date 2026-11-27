// The paper-cut scenes of the Dunkleosteus short. The engine is giay/may.js; the layers are listed in anh.js.
// Hook format of the Megalodon Shorts: the fish and the claim are on screen at frame 0, no opening scene.
// The model drew white teeth on every jaw close-up it was asked for, so the close-ups are pg-dunk drawn large with its head in frame.
const PLATES = ["pl-bien"];
const CUTS = ["pg-dunk", "pg-ca-nho"];
// which way the generated pieces face, found by looking at them: 1 means the piece faces left as generated
const LEFT = { dunk: 1, nho: 1 };

// the generated skies have a pale paper border: draw them enlarged so it falls outside the frame
const back = (t, total) => { out.save(); out.translate(540, 960); out.scale(1.16, 1.16); out.translate(-540, -960); plate("pl-bien", t, total, 0.5); out.restore(); };
const swim = (name, key, x, y, w, t, { left = 1, alpha = 1, rot = 0 } = {}) => P(name, x, y + 20 * Math.sin(t * 1.8), w, { flip: left !== LEFT[key], rot: rot + 0.04 * Math.sin(t * 1.8 + 1), alpha, shadow: 0 });
function bubbles(t) {
  for (let n = 0; n < 8; n++) { const k = (t * 0.3 + n * 0.13) % 1; out.save(); out.globalAlpha = 0.7 * (1 - k); out.strokeStyle = "#dff3f5"; out.lineWidth = 4; out.beginPath(); out.arc(100 + n * 125, 1850 - 1600 * k, 8 + 10 * rnd(n, 3), 0, 7); out.stroke(); out.restore(); }
}
// the head fills the frame: pg-dunk is 2.4 times wider than tall and its head is the left fifth of the picture
const closeUp = (t, snap = 0) => swim("pg-dunk", "dunk", 1220 + 12 * Math.sin(t * 9) * snap, 1560, 2300, t * 0.5, { rot: -0.06 * snap * Math.abs(Math.sin(t * 4)) });
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
    bubbles(ts);
    swim("pg-dunk", "dunk", 580 - 40 * ts, 1350, 1060, ts);
    tag("NO TEETH", 230, 330, -0.03, 1, 120);
    tag("BLADES OF BONE", 90, 540, 0.02, 1, 96);
  } },
  { shots: ["1"], draw(ts) {
    back(ts, 5);
    bubbles(ts);
    swim("pg-ca-nho", "nho", 620 - 160 * ts, 1050, 400, ts * 2);
    swim("pg-dunk", "dunk", 1350 - 200 * ts, 1500, 900, ts * 1.3);
    tag("DUNKLEOSTEUS", 120, 330, -0.03, pop(0.4, ts), 88);
    tag("~360 MILLION YEARS AGO", 90, 480, 0.02, pop(1.8, ts), 54);
  } },
  { shots: ["2"], draw(ts) {
    back(ts, 4);
    bubbles(ts);
    closeUp(ts);
    tag("BONY ARMOUR", 120, 380, -0.03, pop(0.4, ts), 92);
  } },
  { shots: ["3"], draw(ts) {
    back(ts, 4);
    bubbles(ts);
    closeUp(ts, 1);
    sparkles(260, 1250, 160, ts, 10);
    tag("SELF-SHARPENING", 110, 380, -0.03, pop(0.4, ts), 92);
    tag("JAW BLADES", 260, 540, 0.02, pop(1.2, ts), 80);
  } },
  { shots: ["4"], draw(ts) {
    back(ts, 6);
    bubbles(ts);
    const w = 1500 - 600 * sm(1.6, 3.4, ts);
    swim("pg-dunk", "dunk", 540, 1450, w, ts * 0.6);
    measure(540 - w / 2, 540 + w / 2, 900, sm(0.2, 1.4, ts));
    tag("~4 M", 360, 420, -0.03, pop(3.4, ts), 150);
    tag("SHORTER, CHUNKIER", 110, 1700, 0.02, pop(3.8, ts), 76);
  } },
  { shots: ["kết"], draw(ts) {
    back(ts, 5);
    rays(540, 0, ts);
    swim("pg-dunk", "dunk", 600 - 50 * ts, 1300, 900, ts * 0.7);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, card: ["Into Deep Time", '<span style="font-size:50px">DUNKLEOSTEUS</span>', "BLADES OF BONE"] });
