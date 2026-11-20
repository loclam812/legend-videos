// The paper-cut scenes of Mai An Tiêm. The engine is giay/may.js; the layers are listed in anh.js.
const PLATES = ["pl-troi", "pl-chieu", "pl-bien", "pl-cung"];
const CUTS = ["pc-song", "pc-dat", "pc-cat", "pc-dao", "pc-nha", "pc-leu", "pc-dua", "pc-dua-bo", "pc-day", "pc-chim", "pc-thuyen",
  "pg-tiem", "pg-tiem-tuoi", "pg-vo-khoc", "pg-con", "pg-vua", "pg-vua-gian"];
// which way the generated pieces face, found by looking at them: 1 means the piece faces left as generated
const LEFT = { chim: 0, thuyen: 0, tuoi: 1 };
const RED = ["#d8343a", "#f06a6a", "#2a1608", "#7fbf5a"];

const ocean = (t, top) => { sea("pc-song", 540 - 30 * Math.sin(t * 0.8 + 1), top + 8 * Math.sin(t * 1.7), 1560); sea("pc-song", 540 + 34 * Math.sin(t * 0.9), top + 330 + 8 * Math.sin(t * 1.5 + 2), 1700, { flip: 1 }); };
const beach = (sky, t, total) => { plate(sky, t, total, 0); ocean(t, 940); ground("#e3c98a", 1500); P("pc-cat", 540, 1640, 1400); };
function village(sky, t, total) {
  plate(sky, t, total, 0);
  ground("#bfa765", 1150); P("pc-dat", 540, 1210, 1400);
  P("pc-nha", 540, 1170, 640);
  ground("#a98a4e", 1560); P("pc-dat", 540, 1690, 1400);
}
// the generated hall has a pale border: draw it enlarged so the border falls outside the frame
const hall = (t, total) => { out.save(); out.translate(540, 960); out.scale(1.14, 1.14); out.translate(-540, -960); plate("pl-cung", t, total, 0.5); out.restore(); ground("#5a3320", 1620); };
const melon = (x, y, w, t, n = 0) => P("pc-dua", x, y, w, { rot: 0.05 * Math.sin(t * 2 + n) });
const boat = (x, y, w, t, left = 0) => P("pc-thuyen", x, y + 10 * Math.sin(t * 1.6), w, { flip: left !== LEFT.thuyen, rot: 0.03 * Math.sin(t * 1.6) });
function seeds(x, y, t, n = 7) {
  for (let i = 0; i < n; i++) {
    const fall = sm(i * 0.25, i * 0.25 + 0.9, t);
    if (!fall) continue;
    out.save(); out.translate(x + (rnd(i, 31) - 0.5) * 360, y - 620 * (1 - fall) * (1 - fall)); out.rotate(i + 4 * (1 - fall));
    out.fillStyle = "#1a1210"; out.beginPath(); out.ellipse(0, 0, 13, 20, 0, 0, 7); out.fill();
    out.restore();
  }
}

const SCENES = [
  { shots: ["hook"], draw(ts) {
    beach("pl-chieu", ts, 5);
    rays(540, 1250, ts);
    P("pc-dua-bo", 540, 1720, 560 * pop(0.4, ts), { rot: 0.04 * Math.sin(ts * 2) });
    sparkles(540, 1380, 320, ts, 12);
    P("pc-dao", 880, 1010, 300, { shadow: 0 });
  } },
  { shots: ["1", "2", "3"], draw(ts, i, u) {
    village("pl-troi", ts, 13);
    const gone = i === 2 ? sm(0, 1, u) : 0;
    P("pg-vua", 280 - 600 * gone, 1790 + 900 * (1 - pop(0.3, ts, 0.5)), 330);
    P("pg-tiem", 780 - 240 * gone, 1790 + 900 * (1 - pop(0.8, ts, 0.5)) + (i === 2 ? hop(u, 6, 20) : 0), 320 + 60 * gone);
    if (i === 0) { tag("VUA HÙNG", 110, 1000, -0.03, pop(1.0, u)); tag("MAI AN TIÊM", 600, 1060, 0.03, pop(1.6, u)); }
    if (i === 1) { ring(540, 900, 340, sm(0.8, 1.6, u)); tag("NHÀ CAO, KHO ĐẦY", 250, 500, -0.03, pop(1.4, u), 44); }
    if (i === 2) { tag("CỦA BIẾU = CỦA LO", 60, 420, -0.03, pop(0.3, u), 44); tag("CỦA CHO = CỦA NỢ", 200, 560, 0.02, pop(1.6, u), 44); }
  } },
  { shots: ["4"], draw(ts) {
    out.save(); jolt(6 * sm(0.8, 1.2, ts) * (1 - sm(2.2, 3, ts)));
    hall(ts, 5);
    P("pg-vua-gian", 540, 1800 + hop(ts, 8, 16), 560);
    out.restore();
    if (ts > 1) shards(540, 1000, (ts - 1) % 1.2, 10, ["#c8402f", "#f2c14e", "#2a1608"]);
    tag("VUA NỔI GIẬN", 300, 420, -0.03, pop(1.0, ts), 52);
  } },
  { shots: ["5"], draw(ts) {
    plate("pl-bien", ts, 5, 0);
    sea("pc-song", 540 + 26 * Math.sin(ts * 0.7), 1080, 1500, { flip: 1 });
    P("pc-dao", 820, 1200, 380);
    const go = sm(0, 5, ts);
    boat(180 + 320 * go, 1420, 520, ts);
    ocean(ts, 1330);
    tag("ĐÀY RA HOANG ĐẢO", 190, 520, -0.03, pop(1.2, ts), 48);
  } },
  { shots: ["6", "7"], draw(ts, i, u) {
    beach("pl-bien", ts, 9);
    P("pc-leu", 800, 1560, 420 * (i === 1 ? pop(1.2, u, 0.6) : 0));
    P("pg-vo-khoc", 300, 1790, 200, { rot: 0.03 * Math.sin(ts * 5) });
    if (i === 0) tears(300, 1400, ts);
    P("pg-tiem", 740 - (i === 1 ? 160 * sm(0, 1, u) : 0), 1790 + (i === 1 ? hop(u, 6, 22) : 0), 320);
    if (i === 1) tag("CÒN HAI BÀN TAY", 250, 520, -0.03, pop(0.5, u), 50);
    if (i === 0) night("#b9c3e6");
  } },
  { shots: ["8", "9"], draw(ts, i, u) {
    beach("pl-troi", ts, 10);
    P("pc-leu", 860, 1540, 320);
    for (let n = 0; n < 5; n++) {
      const x = 1300 - 320 * ts + n * 190;
      P("pc-chim", x, 700 + 90 * Math.sin(n * 2.1) + 22 * Math.sin(ts * 6 + n), 190, { flip: !LEFT.chim, rot: 0.08 * Math.sin(ts * 6 + n), shadow: 0 });
    }
    seeds(480, 1640, ts - 1.4);
    if (ts > 2) ring(480, 1630, 230, sm(2.6, 3.4, ts));
    if (i === 1) {
      P("pg-tiem", -200 + 420 * sm(0, 1.2, u), 1800, 320);
      const k = pop(1.3, u);
      bubble(650, 640, 230, k);
      P("pc-chim", 590, 690, 190 * k, { shadow: 0 }); P("pc-dua", 740, 760, 150 * pop(2.2, u), { shadow: 0 });
    }
  } },
  { shots: ["10", "11"], draw(ts, i, u) {
    beach("pl-troi", ts, 10);
    P("pc-leu", 860, 1540, 320);
    const grow = i === 1 ? sm(0, 2.6, u) : 0;
    P("pc-day", 330, 1700, 620 * pop(0.2, u) * (i === 1 ? 1 : 0), { rot: 0.01 * Math.sin(ts * 2) });
    P("pc-day", 760, 1830, 640 * grow, { flip: 1 });
    P("pc-day", 520, 1560, 420 * grow);
    if (i === 0) {
      P("pg-tiem-tuoi", 660, 1800 + 6 * Math.sin(ts * 3), 380, { flip: !LEFT.tuoi, rot: 0.04 * Math.sin(ts * 3) });
      tears(420, 1560, ts);
      for (let n = 0; n < 3; n++) { const k = pop(1 + n * 0.8, u); out.fillStyle = "#4f9a3c"; out.beginPath(); out.ellipse(330 + n * 70, 1760 - 26 * k, 14 * k, 30 * k, 0.3 * (n - 1), 0, 7); out.fill(); }
    }
  } },
  { shots: ["12"], draw(ts) {
    beach("pl-troi", ts, 5);
    rays(540, 1100, ts);
    const open = ts > 1.1;
    P(open ? "pc-dua-bo" : "pc-dua", 540, 1640 + (open ? 0 : hop(ts, 9, 14)), 560 * (open ? pop(1.1, ts) : 1));
    if (open) shards(540, 1300, ts - 1.1, 18, RED);
    P("pg-con", 190, 1800 + hop(ts, 7, 40), 250);
    P("pg-tiem", 900, 1800, 300);
    tag("NGỌT QUÁ!", 360, 520, -0.03, pop(1.8, ts), 60);
  } },
  { shots: ["13"], draw(ts) {
    plate("pl-bien", ts, 5, 0);
    sea("pc-song", 540 + 26 * Math.sin(ts * 0.7), 1080, 1500, { flip: 1 });
    P("pc-dao", 200, 1200, 420);
    P("pg-tiem", 200, 1160, 130);
    for (let n = 0; n < 3; n++) melon(340 + 150 * ts * (1 - n * 0.18) + n * 60, 1390 + n * 40 + 14 * Math.sin(ts * 2.4 + n * 2), 150, ts, n);
    ocean(ts, 1340);
    ring(340 + 150 * ts, 1320, 130, sm(1.6, 2.4, ts));
    tag("DẤU CỦA AN TIÊM", 240, 520, -0.03, pop(1.8, ts), 48);
  } },
  { shots: ["14"], draw(ts) {
    beach("pl-troi", ts, 6);
    boat(1300 - 620 * sm(0, 2.6, ts), 1130, 560, ts, 1);
    ground("#e3c98a", 1500); P("pc-cat", 540, 1640, 1400);
    P("pc-leu", 200, 1560, 340);
    [[640, 1700, 190], [800, 1730, 210], [720, 1600, 170]].forEach(([x, y, w], n) => melon(x, y, w * pop(0.3 + n * 0.3, ts), ts, n));
    P("pg-tiem", 380, 1810 + hop(ts, 5, 16), 310);
    tag("ĐỔI GẠO LẤY DƯA", 240, 520, -0.03, pop(2.4, ts), 48);
  } },
  { shots: ["15"], draw(ts) {
    hall(ts, 5);
    P("pg-vua", 540, 1700, 520, { rot: 0.02 * Math.sin(ts * 2) });
    P("pc-dua", 540, 1840, 300 * pop(0.4, ts));
    ring(540, 1700, 190, sm(1.2, 2, ts));
    sparkles(540, 1650, 200, ts, 8);
    tag("CON TA CÒN SỐNG!", 220, 420, -0.03, pop(2, ts), 50);
  } },
  { shots: ["16", "17"], draw(ts, i, u) {
    village("pl-chieu", ts, 9);
    rays(540, 560, ts);
    const come = sm(0, 2.2, ts);
    P("pg-vua", 250, 1790, 320, { rot: 0.02 * Math.sin(ts * 2) });
    P("pg-tiem", 1300 - 560 * come, 1790 + hop(ts, 6, 18), 310);
    P("pg-con", 1500 - 560 * come, 1800 + hop(ts + 0.3, 7, 36), 220);
    if (i === 1) { [140, 340, 540, 740, 940].forEach((x, n) => melon(x, 1900, 170 * pop(0.2 + n * 0.25, u), ts, n)); tag("DƯA HẤU", 360, 620, -0.03, pop(0.8, u), 76); }
    confetti(ts, ["#d8343a", "#7fbf5a", "#fbf3df", "#f2c14e"]);
  } },
  { shots: ["kết"], draw(ts) {
    beach("pl-chieu", ts, 6);
    rays(540, 1250, ts);
    P("pc-dua", 330, 1760, 380, { rot: 0.04 * Math.sin(ts * 2) });
    P("pc-dua-bo", 720, 1760, 400, { rot: 0.04 * Math.sin(ts * 2 + 1) });
    sparkles(540, 1400, 380, ts, 10);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, card: ["Sự tích dưa hấu", "MAI", "AN TIÊM"] });
