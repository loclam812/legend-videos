// The paper-cut scenes of Thánh Gióng. The engine is giay/may.js; the layers are listed in anh.js.
const PLATES = ["pl-troi", "pl-chieu"];
const CUTS = ["pc-dat", "pc-leu", "pc-nui", "pc-lua", "pc-vet-chan", "pc-tre", "pc-com", "pc-ngua",
  "pg-ong", "pg-ba", "pg-be", "pg-su", "pg-vua", "pg-giac", "pg-giac-chay", "pg-giong", "pg-giong-ngua"];
// which way the generated pieces face, found by looking at them: 1 means the piece faces left as generated
const LEFT = { ngua: 0, su: 1, giac: 1, chay: 0, cuoi: 0 };
const FIRE = ["#f2c14e", "#e8662a", "#c8402f", "#fff3b0"];

const land = (sky, t, total) => { plate(sky, t, total, 0); P("pc-nui", 540, 1240, 1300, { shadow: 0 }); ground("#a98a4e", 1560); P("pc-dat", 540, 1690, 1400); };
const home = (sky, t, total) => { land(sky, t, total); P("pc-leu", 540, 1640, 620); };
const flame = (x, y, w, t, n = 0) => P("pc-lua", x, y, w * (1 + 0.08 * Math.sin(t * 11 + n)), { rot: 0.05 * Math.sin(t * 7 + n), shadow: 0 });
// the hero on the iron horse, galloping; `left` turns him to ride leftwards
const rider = (x, y, w, t, left = 0) => P("pg-giong-ngua", x, y + hop(t, 8, 30), w, { flip: left !== LEFT.cuoi, rot: 0.05 * Math.sin(t * 8) });
const foe = (x, y, w, t, left = 1, rot = 0) => P("pg-giac", x, y + hop(t + x, 6, 14), w, { flip: left !== LEFT.giac, rot });
const runaway = (x, y, w, t, left = 0) => P("pg-giac-chay", x, y + hop(t * 1.4 + x, 9, 26), w, { flip: left !== LEFT.chay, rot: 0.08 * Math.sin(t * 9 + x) });
const battle = (t, total) => { land("pl-chieu", t, total); flame(140, 1560, 260, t); flame(930, 1570, 300, t, 2); };

const SCENES = [
  { shots: ["hook"], draw(ts) {
    land("pl-chieu", ts, 5);
    rays(540, 560, ts);
    const x = -400 + 940 * sm(0, 2.2, ts);
    rider(x, 1780, 760, ts);
    if (ts > 1.6) shards(x + 300, 1400, (ts - 1.6) % 1.1, 12, FIRE);
    night("#ffd9b8");
  } },
  { shots: ["1"], draw(ts) {
    home("pl-troi", ts, 6);
    P("pg-ong", 240, 1800 + 900 * (1 - pop(0.3, ts, 0.5)), 215, { rot: 0.02 * Math.sin(ts * 2) });
    P("pg-ba", 840, 1800 + 900 * (1 - pop(0.8, ts, 0.5)), 205, { rot: 0.02 * Math.sin(ts * 2 + 1) });
    tag("LÀNG GIÓNG", 330, 620, -0.03, pop(1.2, ts), 56);
  } },
  { shots: ["2"], draw(ts) {
    land("pl-troi", ts, 6);
    // squashed so the footprint lies on the ground instead of standing up
    out.save(); out.translate(620, 1850); out.scale(1, 0.42); P("pc-vet-chan", 0, 0, 420 * pop(0.3, ts), { shadow: 0 }); out.restore();
    sparkles(620, 1700, 240, ts, 10);
    ring(620, 1690, 300, sm(1.4, 2.2, ts));
    P("pg-ba", -200 + 420 * sm(0.6, 2.4, ts), 1790 + hop(ts, 5, 14), 205);
    tag("VẾT CHÂN KHỔNG LỒ", 200, 620, -0.03, pop(2.2, ts), 48);
  } },
  { shots: ["3", "4"], draw(ts, i, u) {
    home("pl-troi", ts, 10);
    P("pg-ong", 200, 1800, 215, { rot: i ? 0.03 * Math.sin(ts * 1.5) : 0, }); P("pg-ba", 880, 1800 + (i ? 0 : hop(ts, 6, 18)), 205);
    P("pg-be", 540, 1840, 300 * pop(0.6, ts));
    if (i === 0) { rays(540, 1500, ts, 0.1); sparkles(540, 1560, 240, ts, 10); }
    if (i === 1) { tag("KHÔNG NÓI", 80, 520, -0.03, pop(0.8, u), 50); tag("KHÔNG CƯỜI", 520, 660, 0.03, pop(1.8, u), 50); night("#c9cfe6"); }
  } },
  { shots: ["5"], draw(ts) {
    out.save(); jolt(4 * sm(0.5, 1.5, ts));
    battle(ts, 6);
    P("pc-leu", 540, 1560, 380, { rot: 0.03 }); flame(540, 1380, 320, ts, 4);
    for (let n = 0; n < 4; n++) foe(1500 - 520 * sm(0, 3.2, ts) - n * 190, 1800 + (n % 2) * 40, 300, ts);
    out.restore();
    night("#f3b9a0");
    tag("GIẶC ÂN", 380, 560, -0.03, pop(1.2, ts), 70);
  } },
  { shots: ["6"], draw(ts) {
    land("pl-troi", ts, 5);
    P("pg-vua", 250, 1790, 330, { rot: 0.02 * Math.sin(ts * 2) });
    P("pg-su", 520 + 420 * sm(1, 4, ts), 1800 + hop(ts, 6, 16), 300, { flip: LEFT.su });
    tag("TÌM NGƯỜI TÀI", 290, 620, -0.03, pop(1.4, ts), 54);
  } },
  { shots: ["7", "8"], draw(ts, i, u) {
    home("pl-troi", ts, 9);
    P("pg-ba", 200, 1800, 205);
    P("pg-be", 500, 1840 + hop(u, 7, 20), 300);
    P("pg-su", 1300 - 440 * (i === 0 ? sm(1.5, 3, ts) : 1), 1810, 300, { flip: !LEFT.su });
    if (i === 0) tag("MẸ ƠI!", 380, 620, -0.03, pop(0.3, u), 70);
    if (i === 1) { tag("NGỰA SẮT", 80, 380, -0.03, pop(0.6, u), 50); tag("ROI SẮT", 520, 520, 0.03, pop(1.5, u), 50); tag("ÁO GIÁP SẮT", 200, 660, -0.02, pop(2.4, u), 50); }
  } },
  { shots: ["9", "10"], draw(ts, i, u) {
    home("pl-troi", ts, 9);
    const big = sm(0.3, 4, ts);
    P("pg-be", 540, 1840, 280 + 300 * big);
    if (i === 0) { [[220, 0.6], [860, 1.6]].forEach(([x, at]) => P("pc-com", x, 1860, 300 * pop(at, u))); tag("LỚN NHANH NHƯ THỔI", 170, 520, -0.03, pop(1.2, u), 48); }
    if (i === 1) {
      const come = sm(0, 1.4, u);
      P("pg-ong", -200 + 380 * come, 1800 + hop(u, 6, 16), 215); P("pg-ba", 1280 - 380 * come, 1800 + hop(u + 0.3, 6, 16), 205);
      P("pc-com", 250, 1880, 300); P("pc-com", 840, 1880, 300); P("pc-com", 540, 1900, 260 * pop(1.2, u));
      tag("CẢ LÀNG GÓP GẠO", 220, 520, -0.03, pop(1, u), 50);
    }
  } },
  { shots: ["11"], draw(ts) {
    land("pl-chieu", ts, 6);
    rays(480, 1100, ts, 0.2);
    P("pc-ngua", 1400 - 560 * sm(0, 1.2, ts), 1800, 420, { flip: !LEFT.ngua });
    const at = 1.8;
    if (ts < at) P("pg-be", 400, 1840 + hop(ts, 9, 14), 420);
    else { P("pg-giong", 400, 1830, 620 * pop(at, ts, 0.6)); shards(400, 1300, ts - at, 22, FIRE); sparkles(400, 1200, 320, ts, 10); }
    tag("VƯƠN VAI!", 340, 420, -0.03, pop(at + 0.3, ts), 64);
  } },
  { shots: ["12", "13", "14"], draw(ts, i, u) {
    out.save(); jolt(i ? 5 : 2);
    battle(ts, 14);
    const x = i === 0 ? -400 + 760 * sm(0, 1.4, u) : i === 1 ? 360 + 160 * Math.sin(u * 1.4) : 420;
    if (i === 0) for (let n = 0; n < 3; n++) foe(900 + n * 120, 1790 + (n % 2) * 40, 260, ts);
    if (i === 1) for (let n = 0; n < 4; n++) { const hit = sm(0.8 + n * 0.9, 1.6 + n * 0.9, u); foe(820 + n * 70 + 500 * hit, 1790 + (n % 2) * 40 - 700 * hit * (1 - hit) * 2, 260, ts, 1, 3 * hit); }
    if (i === 2) {
      for (let n = 0; n < 3; n++) runaway(820 + n * 110 + 60 * u, 1800 + (n % 2) * 30, 250, ts);
      P("pc-tre", x + 250, 1500, 200, { rot: 0.5 + 0.9 * Math.sin(u * 5), shadow: 0 });
    }
    rider(x, 1800, 700, ts);
    if (i === 0 && u > 1.4) shards(x + 330, 1420, (u - 1.4) % 0.9, 14, FIRE);
    out.restore();
    night("#ffd0b0");
    if (i === 0) tag("PHUN LỬA", 380, 520, -0.03, pop(1.6, u), 60);
    if (i === 2) tag("NHỔ TRE ĐÁNH GIẶC", 180, 520, -0.03, pop(1.2, u), 50);
  } },
  { shots: ["15"], draw(ts) {
    land("pl-chieu", ts, 4);
    flame(140, 1560, 200 * (1 - sm(0, 3, ts)), ts);
    for (let n = 0; n < 5; n++) runaway(200 + n * 170 + 330 * ts, 1790 + (n % 2) * 40, 270, ts);
    shards(300, 1800, ts % 0.8, 8, ["#a98a4e", "#d9c08a", "#7a5a34"]);
    tag("GIẶC TAN", 370, 560, -0.03, pop(0.6, ts), 70);
  } },
  { shots: ["16"], draw(ts) {
    plate("pl-troi", ts, 6, 0);
    rays(760, 420, ts, 0.2);
    P("pc-nui", 540, 1700, 1700);
    ground("#6f8f6a", 1690);
    const up = sm(0.6, 5.5, ts);
    rider(330 + 420 * up, 1250 - 780 * up, 560 - 300 * up, ts);
    sparkles(330 + 420 * up, 1100 - 780 * up, 200, ts, 12);
    tag("BAY VỀ TRỜI", 120, 1150, -0.03, pop(2.6, ts), 56);
  } },
  { shots: ["17"], draw(ts) {
    land("pl-chieu", ts, 5);
    rays(540, 560, ts);
    P("pc-tre", 130, 1640, 240, { rot: 0.02 * Math.sin(ts * 1.5) }); P("pc-tre", 960, 1640, 240, { flip: 1, rot: 0.02 * Math.sin(ts * 1.7) });
    P("pg-vua", 540, 1800, 340, { rot: 0.02 * Math.sin(ts * 2) });
    tag("PHÙ ĐỔNG THIÊN VƯƠNG", 120, 620, -0.03, pop(0.8, ts), 54);
  } },
  { shots: ["kết"], draw(ts) {
    land("pl-chieu", ts, 6);
    rays(540, 900, ts);
    P("pc-tre", 150, 1700, 260); P("pc-tre", 940, 1700, 260, { flip: 1 });
    P("pg-giong", 540, 1840, 520, { rot: 0.015 * Math.sin(ts * 2) });
    sparkles(540, 1300, 380, ts, 10);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, card: ["Truyền thuyết", "THÁNH", "GIÓNG"] });
