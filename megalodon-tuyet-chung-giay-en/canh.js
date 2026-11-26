// The paper-cut scenes of Megalodon short 3. The engine is giay/may.js; the layers are listed in anh.js.
// Hook format (2026-11-26): a small great white faces the megalodon, both moving, at frame 0 with the big claim already on screen, no opening scene.
const PLATES = ["pl-bien"];
const CUTS = ["pg-meg", "pg-ca-map-trang", "pg-ca-voi"];
// which way the generated pieces face, found by looking at them: 1 means the piece faces left as generated
const LEFT = { meg: 0, trang: 1, voi: 0 };

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
// a paper thermometer whose red column rises with k
function thermometer(x, y, k) {
  out.save();
  out.lineWidth = 8; out.strokeStyle = "#2a1608"; out.fillStyle = "#fbf3df";
  out.beginPath(); out.roundRect(x - 40, y - 620, 80, 600, 40); out.fill(); out.stroke();
  out.beginPath(); out.arc(x, y, 75, 0, 7); out.fill(); out.stroke();
  out.fillStyle = "#c8402f";
  out.beginPath(); out.arc(x, y, 55, 0, 7); out.fill();
  const h = 120 + 420 * Math.min(1, k);
  out.fillRect(x - 20, y - h, 40, h);
  out.restore();
}

const SCENES = [
  { shots: ["hook"], draw(ts) {
    back(ts, 4);
    bubbles(ts);
    swim("pg-ca-map-trang", "trang", 170 + 10 * ts, 1250, 330, ts * 1.4, 0);
    swim("pg-meg", "meg", 920 - 10 * ts, 1350, 1050, ts);
    tag("GREAT WHITE", 120, 330, -0.03, 1, 108);
    tag("VS MEGALODON", 100, 530, 0.02, 1, 100);
  } },
  { shots: ["1"], draw(ts) {
    back(ts, 5);
    bubbles(ts);
    swim("pg-meg", "meg", 480 - 30 * ts, 1450, 1000, ts);
    thermometer(900, 1050, sm(0.4, 2.4, ts));
    tag("+7 °C", 160, 520, -0.03, pop(1.6, ts), 150);
  } },
  { shots: ["2"], draw(ts) {
    back(ts, 5);
    bubbles(ts);
    [[250, 760], [700, 950], [380, 1150]].forEach(([x, y], n) => { const a = 1 - sm(1 + n, 2 + n, ts); if (a > 0) P("pg-ca-voi", x - 30 * ts, y + 15 * Math.sin(ts * 1.5 + n), 420, { flip: 1 !== LEFT.voi, alpha: a, shadow: 0 }); });
    swim("pg-meg", "meg", 700 - 30 * ts, 1650, 950, ts);
    tag("HUGE MEALS", 230, 380, -0.03, pop(0.4, ts), 104);
  } },
  { shots: ["3"], draw(ts) {
    back(ts, 4);
    bubbles(ts);
    swim("pg-ca-voi", "voi", 300 - 80 * ts, 800, 520, ts * 1.6);
    [[1000, 1050], [1200, 1250], [1100, 1450], [1350, 1600]].forEach(([x, y], n) => swim("pg-ca-map-trang", "trang", x - 330 * ts, y, 360, ts * 1.6 + n));
    swim("pg-meg", "meg", 1200 - 90 * ts, 1750, 900, ts * 0.7);
    tag("FASTER RIVALS", 170, 380, -0.03, pop(0.4, ts), 100);
  } },
  { shots: ["4"], draw(ts) {
    back(ts, 6);
    bubbles(ts);
    swim("pg-meg", "meg", 640 - 40 * ts, 1350, 1100, ts * 0.6, 1);
    out.save(); out.globalAlpha = sm(1, 4.5, ts); out.fillStyle = "#0b1a33"; out.fillRect(0, 0, 1080, 1920); out.restore();
    tag("~3.5 MILLION", 170, 420, -0.03, pop(0.6, ts), 104);
    tag("YEARS AGO", 260, 620, 0.02, pop(1.2, ts), 90);
  } },
  { shots: ["kết"], draw(ts) {
    back(ts, 5);
    rays(540, 0, ts);
    swim("pg-ca-map-trang", "trang", 600 - 60 * ts, 1300, 520, ts);
    tag("STILL A HYPOTHESIS", 110, 1700, -0.03, pop(0.4, ts), 74);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, card: ["Into Deep Time", "MEGALODON", "WHY IT VANISHED"] });
