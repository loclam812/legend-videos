// The paper-cut scenes of Megalodon short 1. The engine is giay/may.js; the layers are listed in anh.js.
// Hook format (2026-11-26): the shark is centred and moving at frame 0 with the big claim already on screen, no opening scene.
const PLATES = ["pl-bien"];
const CUTS = ["pg-meg", "pg-ca-voi", "pc-xe-buyt", "pc-rang", "pc-tay"];
// which way the generated pieces face, found by looking at them: 1 means the piece faces left as generated
const LEFT = { meg: 0, voi: 0 };

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

const SCENES = [
  { shots: ["hook"], draw(ts) {
    back(ts, 4);
    bubbles(ts);
    P("pc-xe-buyt", 540, 1640, 860, { rot: 0.01 * Math.sin(ts), shadow: 0 });
    swim("pg-meg", "meg", 600 - 60 * ts, 1180, 1180, ts);
    tag("LONGER THAN", 90, 330, -0.03, 1, 112);
    tag("A SCHOOL BUS", 150, 540, 0.02, 1, 104);
  } },
  { shots: ["1"], draw(ts) {
    back(ts, 5);
    bubbles(ts);
    swim("pg-meg", "meg", 540 - 10 * ts, 1300, 1000, ts);
    measure(40, 1040, 780, sm(0.3, 1.8, ts));
    tag("15+ M", 300, 460, -0.03, pop(1.2, ts), 150);
  } },
  { shots: ["2"], draw(ts) {
    back(ts, 4);
    bubbles(ts);
    P("pc-tay", 330, 1500 + 6 * Math.sin(ts * 1.5), 420, { rot: -0.04 });
    P("pc-rang", 750, 1500 + 6 * Math.sin(ts * 1.5 + 1), 420, { rot: 0.05 * Math.sin(ts) });
    tag("TEETH ~15 CM", 140, 420, -0.03, pop(0.3, ts), 100);
  } },
  { shots: ["3"], draw(ts) {
    back(ts, 3);
    bubbles(ts);
    swim("pg-ca-voi", "voi", 520 - 160 * ts, 900, 760, ts * 1.5);
    swim("pg-meg", "meg", 1100 - 250 * ts, 1350, 1000, ts * 1.3);
    tag("WHALE HUNTER", 160, 380, -0.03, pop(0.2, ts), 96);
  } },
  { shots: ["kết"], draw(ts) {
    back(ts, 5);
    rays(540, 0, ts);
    swim("pg-meg", "meg", 600 - 50 * ts, 1300, 900, ts * 0.7);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, card: ["Into Deep Time", "MEGALODON", "LONGER THAN A BUS"] });
