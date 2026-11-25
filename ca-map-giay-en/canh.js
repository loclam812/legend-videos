// The paper-cut scenes of the river-shark short, cut from 300-trieu-nam-giay-en and laid out again for the tall frame.
// The engine is giay/may.js; the layers are listed in anh.js.
const PLATES = ["pl-rung", "pl-nuoc"];
const CUTS = ["pc-vay", "pc-moc-tac", "pc-duong-xi", "pc-bui", "pc-dat", "pc-dam", "pc-hue-bien", "pg-ca-map", "pg-ca-map-bien", "pg-luong-cu", "pg-ban", "pg-ban-so"];
// which way the generated pieces face, found by looking at them: 1 means the piece faces left as generated
const LEFT = { caMap: 0, caMapBien: 1, luongCu: 1 };
const BANK = 1300;

// the generated skies have a pale paper border: draw them enlarged so it falls outside the frame
const back = (name, t, total) => { out.save(); out.translate(540, 960); out.scale(1.16, 1.16); out.translate(-540, -960); plate(name, t, total, 0.5); out.restore(); };
const tree = (name, x, w, t, n = 0, alpha = 1) => P(name, x, BANK + 40, w, { rot: 0.008 * Math.sin(t * 1.1 + n), alpha });
function bank(t, total) {
  back("pl-rung", t, total);
  tree("pc-vay", 170, 300, t, 1, 0.85); tree("pc-moc-tac", 450, 150, t, 2, 0.85); tree("pc-vay", 760, 280, t, 3, 0.85); tree("pc-duong-xi", 980, 420, t, 4, 0.9);
  P("pc-bui", 540, BANK + 30, 1500);
}
const swamp = (t, top) => sea("pc-dam", 540 + 30 * Math.sin(t * 0.6), top + 5 * Math.sin(t * 1.3), 1700, { deep: "#10231c" });
const you = (name, x, t, w = 170) => P(name, x, BANK + 20 + 4 * Math.sin(t * 2.2), w, { rot: 0.015 * Math.sin(t * 1.6) });
const swim = (name, key, x, y, w, t, left = 0) => P(name, x, y + 22 * Math.sin(t * 2), w, { flip: left !== LEFT[key], rot: 0.06 * Math.sin(t * 2 + 1), shadow: 0 });
const lilies = (t) => [[150, 330], [440, 260], [700, 360], [960, 280]].forEach(([x, w], n) => P("pc-hue-bien", x, 1960, w, { rot: 0.05 * Math.sin(t * 1.2 + n), shadow: 0 }));
function bubbles(t) {
  for (let n = 0; n < 8; n++) { const k = (t * 0.3 + n * 0.13) % 1; out.save(); out.globalAlpha = 0.7 * (1 - k); out.strokeStyle = "#dff3f5"; out.lineWidth = 4; out.beginPath(); out.arc(100 + n * 125, 1850 - 1600 * k, 8 + 10 * rnd(n, 3), 0, 7); out.stroke(); out.restore(); }
}

const SCENES = [
  { shots: ["hook"], draw(ts) {
    bank(ts, 7);
    swamp(ts, BANK);
    swim("pg-ca-map", "caMap", 1500 - 700 * sm(0.5, 4, ts), BANK + 260, 820, ts, 1);
    swamp(ts, BANK + 180);
    you(ts > 2.6 ? "pg-ban-so" : "pg-ban", 230, ts);
    tag("DON'T WADE IN", 230, 380, -0.03, pop(2.4, ts), 70);
  } },
  { shots: ["1", "2"], draw(ts, i, u) {
    back("pl-nuoc", ts, 10);
    bubbles(ts);
    if (i === 0) swim("pg-ca-map", "caMap", 1600 - 260 * ts, 1150, 1000, ts, 1);
    else swim("pg-ca-map", "caMap", 640 - 30 * u, 1150, 1500, ts * 0.5, 1);
    if (i === 0) { tag("FRESHWATER SHARKS", 130, 330, -0.03, pop(0.6, u), 62); tag("UP TO ~3 M LONG", 230, 490, 0.02, pop(2.4, u), 56); }
    if (i === 1) tag("A SPINE BEHIND THE HEAD", 80, 380, -0.03, pop(0.8, u), 52);
  } },
  { shots: ["3"], draw(ts) {
    bank(ts, 7);
    swamp(ts, BANK - 20);
    const rise = 160 * sm(1, 3.5, ts);
    P("pg-luong-cu", 680, BANK + 300 - rise, 820, { flip: 1 !== LEFT.luongCu, rot: 0.01 * Math.sin(ts) });
    swamp(ts, BANK + 120);
    for (let n = 0; n < 3; n++) { const k = (ts * 0.5 + n * 0.33) % 1; out.save(); out.globalAlpha = 1 - k; ring(680, BANK + 150, 60 + 220 * k, 1); out.restore(); }
    you(ts > 3.5 ? "pg-ban-so" : "pg-ban", 200, ts, 150);
    tag("CROCODILE-SIZED", 200, 330, -0.03, pop(1.6, ts), 64);
    tag("AMPHIBIANS", 300, 490, 0.02, pop(2, ts), 64);
  } },
  { shots: ["4"], draw(ts) {
    back("pl-nuoc", ts, 6);
    bubbles(ts);
    lilies(ts);
    swim("pg-ca-map-bien", "caMapBien", -400 + 260 * ts, 900, 620, ts);
    swim("pg-ca-map", "caMap", 1500 - 200 * ts, 1300, 520, ts, 1);
    tag("A GOLDEN AGE OF SHARKS", 70, 330, -0.03, pop(1, ts), 54);
  } },
  { shots: ["kết"], draw(ts) {
    back("pl-nuoc", ts, 6);
    rays(540, 0, ts);
    lilies(ts);
    swim("pg-ca-map-bien", "caMapBien", 300 + 40 * Math.sin(ts), 1150, 480, ts);
    swim("pg-ca-map", "caMap", 780 - 40 * Math.sin(ts), 1450, 460, ts, 1);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, card: ["Into Deep Time", "SHARKS", "IN THE RIVERS"] });
