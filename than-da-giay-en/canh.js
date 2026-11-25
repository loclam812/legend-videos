// The paper-cut scenes of the coal-forest short, cut from 300-trieu-nam-giay-en and laid out again for the tall frame.
// The engine is giay/may.js; the layers are listed in anh.js.
const PLATES = ["pl-rung", "pl-troi"];
const CUTS = ["pc-vay", "pc-moc-tac", "pc-duong-xi", "pc-bui", "pc-dat", "pc-dam", "pc-than", "pc-lua", "pg-ban"];
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
const you = (x, t, w = 190) => P("pg-ban", x, FEET + 4 * Math.sin(t * 2.2), w, { rot: 0.015 * Math.sin(t * 1.6) });
const swamp = (t, top) => sea("pc-dam", 540 + 30 * Math.sin(t * 0.6), top + 5 * Math.sin(t * 1.3), 1700, { deep: "#10231c" });
const flame = (x, y, w, t, n = 0) => P("pc-lua", x, y, w * (1 + 0.08 * Math.sin(t * 11 + n)), { rot: 0.05 * Math.sin(t * 7 + n), shadow: 0 });
// tall trees seen while the view tilts up: `lift` pushes the ground down out of the frame
function giants(t, lift) {
  back("pl-rung", t, 14);
  [[120, 420, 1], [520, 360, 2], [930, 440, 3]].forEach(([x, w, n]) => P("pc-vay", x, GROUND + 60 + lift * 1.3, w, { rot: 0.008 * Math.sin(t + n) }));
  P("pc-bui", 540, GROUND + 30 + lift, 1500); ground("#3a2a1c", GROUND + lift);
  you(760, t + lift, 110);
}
// dead plants settling as dark layers in the mud, one band after another
function layers(n, k) {
  for (let i = 0; i < n; i++) {
    const a = Math.min(1, Math.max(0, k * n - i));
    if (a <= 0) continue;
    out.save(); out.globalAlpha = a; out.fillStyle = i % 2 ? "#3b2a1a" : "#1e1712";
    out.fillRect(0, 1900 - (i + 1) * 70, 1080, 70);
    out.strokeStyle = "#0e0a07"; out.lineWidth = 4; out.strokeRect(-10, 1900 - (i + 1) * 70, 1100, 70);
    out.restore();
  }
}

const SCENES = [
  { shots: ["hook"], draw(ts) {
    forest(ts, 7);
    you(540, ts, 150);
    front(ts);
    tag("WHERE COAL CAME FROM", 110, 330, -0.03, pop(1, ts), 60);
  } },
  { shots: ["1", "2"], draw(ts, i, u) {
    giants(ts, i === 0 ? 300 * sm(0.5, 6, u) : 300);
    if (i === 0) tag("30 – 40 M TALL", 230, 360, -0.03, pop(2.8, u), 70);
    if (i === 1) { ring(520, 1450, 130, pop(3, u, 1)); tag("SCALE TREES", 260, 330, -0.03, pop(3.2, u), 72); tag("CLUBMOSS RELATIVES", 170, 490, 0.02, pop(0.8, u), 50); }
  } },
  { shots: ["3"], draw(ts) {
    back("pl-troi", ts, 6);
    P("pc-bui", 540, 1290, 1500);
    const fall = sm(0.3, 2.6, ts);
    P("pc-vay", 360 + 260 * fall, 1360 + 300 * fall, 380, { rot: 1.45 * fall });
    swamp(ts, 1250);
    tag("INTO OXYGEN-POOR MUD", 90, 400, -0.03, pop(2.4, ts), 54);
  } },
  { shots: ["4"], draw(ts, i, u, line, v) {
    back("pl-troi", ts, 7);
    P("pc-bui", 540, 1290, 1500);
    swamp(ts, 1250);
    layers(6, line >= 1 ? sm(0, 2.2, v) : 0);
    tag("THEY DID NOT FULLY ROT", 90, 380, -0.03, pop(0.4, u), 54);
    tag("LAYER UPON LAYER", 200, 540, 0.02, line >= 1 ? pop(0.3, v) : 0, 56);
  } },
  { shots: ["5"], draw(ts) {
    back("pl-troi", ts, 6);
    ground("#3a2a1c", 1500);
    P("pc-than", 540, 1700, 760 + 200 * sm(0, 5, ts), { rot: 0.01 * Math.sin(ts * 2) });
    sparkles(540, 1250, 300, ts, 8);
    tag("MILLIONS OF YEARS", 180, 380, -0.03, pop(0.6, ts), 60);
    tag("COAL", 400, 560, 0.02, pop(3.6, ts), 96);
  } },
  { shots: ["6"], draw(ts) {
    back("pl-troi", ts, 6);
    ground("#3a2a1c", 1500);
    P("pc-than", 540, 1700, 960, { rot: 0.01 * Math.sin(ts * 2) });
    flame(540, 1120, 300 * pop(0.5, ts), ts);
    tag("CARBONIFEROUS", 170, 380, -0.03, pop(1.6, ts), 80);
    tag("= COAL-BEARING", 260, 540, 0.02, pop(3.6, ts), 60);
  } },
  { shots: ["kết"], draw(ts) {
    forest(ts, 6);
    rays(540, 800, ts);
    you(540, ts);
    front(ts);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, card: ["Into Deep Time", "THE COAL", "FORESTS"] });
