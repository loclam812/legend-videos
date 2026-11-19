// The paper-cut scenes of "Ăn khế trả vàng". The engine is giay/may.js; the layers are listed in anh.js.
const PLATES = ["pl-troi", "pl-chieu", "pl-bien"];
const CUTS = ["pc-nha", "pc-leu", "pc-khe", "pc-qua", "pc-dat", "pc-song", "pc-dao", "pc-vang", "pc-tui", "pc-tui-to",
  "pg-em", "pg-em-buon", "pg-vo", "pg-anh", "pg-anh-so", "pg-chim", "pg-chim-dau"];
// which way the generated birds face, found by looking at them: 1 means the piece faces left as generated
const LEFT = { chim: 1, chimDau: 0 };
const GOLD = ["#f2c14e", "#ffe08a", "#d99a1e", "#fff3b0"];

const land = (sky, t, total) => { plate(sky, t, total, 0); ground("#a98a4e", 1560); P("pc-dat", 540, 1690, 1400); };
const ocean = (t, top) => { sea("pc-song", 540 - 30 * Math.sin(t * 0.8 + 1), top + 8 * Math.sin(t * 1.7), 1560); sea("pc-song", 540 + 34 * Math.sin(t * 0.9), top + 330 + 8 * Math.sin(t * 1.5 + 2), 1700, { flip: 1 }); };
// the flying bird; `left` turns it to fly leftwards
const bird = (x, y, w, t, { left = 0, rot = 0 } = {}) => P("pg-chim", x, y + 16 * Math.sin(t * 5), w, { flip: left !== LEFT.chim, rot: 0.06 * Math.sin(t * 5) + rot });
const perched = (x, y, w, t, { left = 0, talk = 0 } = {}) => P("pg-chim-dau", x, y + (talk ? hop(t, 6, 22) : 0), w, { flip: left !== LEFT.chimDau, rot: 0.04 * Math.sin(t * (talk ? 9 : 2)) });
// big house on the left, hut and starfruit tree on the right, all on a far strip of ground so the puppets in
// front do not cover them and the captions do not sit on them
function village(t, total, sky = "pl-troi") {
  plate(sky, t, total, 0);
  ground("#bfa765", 1150);
  P("pc-dat", 540, 1210, 1400);
  P("pc-nha", 290, 1160, 520);
  P("pc-khe", 940, 1160, 360, { rot: 0.012 * Math.sin(t * 1.3) });
  P("pc-leu", 720, 1170, 300);
  ground("#a98a4e", 1560); P("pc-dat", 540, 1690, 1400);
}
// seen from close: a heap of gold on the rocks, sea behind and in front
function island(t, total) {
  plate("pl-bien", t, total, 0);
  ocean(t, 1000);
  P("pc-dao", 540, 1560, 1000);
  sparkles(540, 1080, 300, t, 14);
}

const SCENES = [
  { shots: ["hook"], draw(ts) {
    land("pl-chieu", ts, 5);
    rays(540, 560, ts);
    P("pc-khe", 250, 1680, 540, { rot: 0.012 * Math.sin(ts * 1.3) });
    const x = 1350 - 980 * sm(0, 4.2, ts);
    sparkles(x + 120, 760, 110, ts, 10);
    bird(x, 800, 620, ts, { left: 1 });
    P("pc-vang", 780, 1720, 340 * pop(2.2, ts));
    if (ts > 2.2) sparkles(780, 1560, 150, ts, 8);
  } },
  { shots: ["1", "2", "3"], draw(ts, i, u) {
    village(ts, 13);
    const claim = i === 1 ? sm(0.3, 1.2, u) : i > 1 ? 1 : 0;
    P("pg-anh", 400 - 110 * claim, 1790 + 900 * (1 - pop(0.3, ts, 0.5)) + (i === 1 ? hop(u, 6, 20) : 0), 320);
    P(claim > 0.5 ? "pg-em-buon" : "pg-em", 700 + 150 * claim, 1790 + 900 * (1 - pop(0.8, ts, 0.5)), 280);
    if (i === 0) { tag("NGƯỜI ANH", 290, 1010, -0.03, pop(1.0, u)); tag("NGƯỜI EM", 600, 1080, 0.03, pop(1.5, u)); }
    if (i === 1) { ring(290, 960, 300, sm(1.2, 2, u)); tag("NHÀ CỬA, RUỘNG VƯỜN", 60, 600, -0.03, pop(1.6, u)); }
    if (i === 2) { ring(830, 950, 270, sm(0.4, 1.2, u)); tag("TÚP LỀU + CÂY KHẾ", 470, 600, 0.03, pop(0.9, u)); }
  } },
  { shots: ["4"], draw(ts) {
    land("pl-troi", ts, 5);
    P("pc-leu", 170, 1650, 300);
    P("pc-khe", 560, 1690, 800, { rot: 0.01 * Math.sin(ts * 1.3) });
    [[400, 1020], [620, 940], [760, 1090], [500, 1180], [680, 1220], [330, 1160]].forEach(([x, y], n) => P("pc-qua", x, y + 6 * Math.sin(ts * 2 + n), 96 * pop(0.5 + n * 0.45, ts), { rot: 0.2 * Math.sin(ts * 2 + n), shadow: 0 }));
    P("pg-em", 200, 1770 + hop(ts, 3, 12), 320);
    P("pg-vo", 880, 1770, 310, { rot: 0.07 * Math.sin(ts * 3) });
  } },
  { shots: ["5", "6", "7"], draw(ts, i, u) {
    land("pl-troi", ts, 14);
    P("pc-khe", 470, 1690, 720, { rot: 0.01 * Math.sin(ts * 1.3) });
    const land1 = sm(0.3, 2.3, ts);
    if (land1 < 1) bird(1400 - 560 * land1, 520 + 760 * land1, 560 - 120 * land1, ts, { left: 1 });
    else perched(850, 1730, 430, ts, { left: 1, talk: i === 2 });
    if (land1 >= 1 && i === 0) shards(620, 1100, (ts % 0.9) * 0.45, 6, ["#f2c14e", "#e8d44d", "#9bc253"]);
    if (i >= 1) P("pg-em-buon", -200 + 400 * (i === 1 ? sm(0, 1.2, u) : 1), 1770, 300, { rot: 0.03 * Math.sin(ts * 2) });
    if (i === 2) {
      tag("ĂN MỘT QUẢ", 60, 300, -0.03, pop(0.2, u), 40);
      tag("TRẢ CỤC VÀNG", 130, 420, 0.02, pop(1.5, u), 40);
      tag("MAY TÚI BA GANG", 60, 540, -0.02, pop(2.9, u), 40);
      P("pc-vang", 660, 1760, 200 * pop(1.5, u));
      P("pc-tui", 330, 1500, 150 * pop(2.9, u));
    }
  } },
  { shots: ["8"], draw(ts) {
    land("pl-troi", ts, 5);
    P("pc-leu", 540, 1650, 560);
    P("pg-em", 300, 1770 + hop(ts, 4, 12), 340);
    P("pg-vo", 800, 1770, 320, { rot: 0.04 * Math.sin(ts * 3) });
    const k = pop(0.6, ts);
    bubble(540, 600, 220, k);
    P("pc-tui", 540, 740, 260 * k, { shadow: 0 });
    ring(540, 600, 250, sm(1.6, 2.3, ts));
    tag("ĐÚNG BA GANG", 370, 900, 0.02, pop(1.9, ts));
  } },
  { shots: ["9", "10"], draw(ts, i, u) {
    if (i === 0) {
      plate("pl-bien", ts, 6, 0);
      const near = sm(1.2, 5, ts);
      sea("pc-song", 540 + 26 * Math.sin(ts * 0.7), 1180, 1500, { flip: 1 });
      P("pc-dao", 1450 - 560 * near, 1480, 520);
      sparkles(1450 - 560 * near, 1200, 150, ts, 8);
      ocean(ts, 1330);
      const bx = 300 + 160 * near, by = 860 + 16 * Math.sin(ts * 5);
      P("pg-em", bx - 20, by - tall("pg-chim", 600) * 0.3, 190, { rot: 0.05 * Math.sin(ts * 5) });
      bird(bx, 860, 600, ts);
    } else {
      island(ts, 12);
      P("pg-em", 300, 1330 + hop(u, 5, 20), 290);
      P("pc-tui", 500, 1340, 110 + 90 * sm(0.4, 3, u));
      perched(860, 1380, 340, ts, { left: 1 });
      ocean(ts, 1520);
      tag("VỪA ĐẦY TÚI", 60, 300, -0.03, pop(1.6, u));
    }
  } },
  { shots: ["11"], draw(ts) {
    village(ts, 5, "pl-chieu");
    rays(540, 560, ts);
    P("pc-vang", 540, 1760, 460 * pop(0.5, ts));
    sparkles(540, 1560, 220, ts, 14);
    P("pg-em", 210, 1780 + hop(ts, 6, 26), 320);
    P("pg-vo", 880, 1780 + hop(ts + 0.3, 6, 26), 310);
    confetti(ts, GOLD);
  } },
  { shots: ["12"], draw(ts) {
    village(ts, 6);
    const swap = sm(2.4, 4.4, ts);
    P("pg-anh", 330 + 470 * swap, 1790 + hop(ts, 6, 18), 320);
    P("pg-em", 760 - 470 * swap, 1790, 280);
    ring(940, 950, 230, sm(0.8, 1.6, ts));
    tag("ĐỔI CẢ GIA TÀI", 60, 600, -0.03, pop(1.6, ts));
    tag("LẤY CÂY KHẾ", 620, 690, 0.03, pop(2.4, ts));
  } },
  { shots: ["13"], draw(ts) {
    land("pl-troi", ts, 6);
    P("pc-khe", 600, 1690, 700, { rot: 0.01 * Math.sin(ts * 1.3) });
    perched(900, 1730, 380, ts, { left: 1 });
    P("pc-tui", 560, 1790, 130 * pop(0.5, ts));
    tag("3 GANG", 480, 1840, 0.02, pop(0.8, ts));
    P("pc-tui-to", 330, 1790, 520 * pop(1.9, ts, 0.6));
    tag("12 GANG", 60, 1150, -0.04, pop(2.4, ts), 46);
    P("pg-anh", 160, 1790 + hop(ts, 7, 22), 330);
  } },
  { shots: ["14"], draw(ts) {
    island(ts, 6);
    perched(880, 1380, 330, ts, { left: 1 });
    P("pc-tui-to", 560, 1400, 260 + 300 * sm(0.3, 4, ts), { rot: 0.03 * Math.sin(ts * 8) });
    P("pg-anh", 250, 1340 + hop(ts, 9, 26), 320);
    shards(420, 1150, (ts % 0.8) * 0.5, 10, GOLD);
    ocean(ts, 1520);
  } },
  { shots: ["15", "16"], draw(ts, i, u) {
    plate("pl-bien", ts, 9, 0);
    sea("pc-song", 540 + 26 * Math.sin(ts * 0.7), 1180, 1500, { flip: 1 });
    const wobble = 0.22 * Math.sin(ts * 4.5) * sm(0, 3.5, ts), sink = 260 * sm(0.5, 4.5, ts);
    const bx = 540, by = 640 + sink, top = tall("pg-chim", 620) * 0.3;
    if (i === 0) {
      P("pc-tui-to", bx + 60, by - top + 40, 330, { rot: wobble });
      P("pg-anh", bx - 110, by - top + 30, 200, { rot: wobble });
      bird(bx, by, 620, ts, { rot: wobble });
      tag("QUÁ NẶNG!", 60, 300, -0.03, pop(1.2, u), 42);
    } else {
      const fall = sm(0.2, 1.7, u), away = sm(0.4, 3, u);
      P("pc-tui-to", bx + 90 + 60 * fall, by - top + 40 + 900 * fall * fall, 330, { rot: 2.4 * fall });
      P("pg-anh-so", bx - 110 - 80 * fall, by - top + 60 + 860 * fall * fall, 250, { rot: -1.6 * fall });
      bird(bx + 700 * away, by - 520 * away, 620 - 220 * away, ts);
    }
    ocean(ts, 1330);
    if (i === 1 && u > 1.5) shards(520, 1380, u - 1.5, 22, ["#fbf3df", "#7fc4c9", "#2f8f97", "#dff3f5"]);
  } },
  { shots: ["17"], draw(ts) {
    village(ts, 4, "pl-chieu");
    rays(540, 560, ts);
    P("pg-em", 620, 1770, 300, { rot: 0.02 * Math.sin(ts * 2) });
    P("pg-vo", 860, 1770, 290, { rot: 0.02 * Math.sin(ts * 2 + 1) });
    tag("THAM THÌ THÂM", 150, 700, -0.03, pop(0.9, ts), 76);
  } },
  { shots: ["kết"], draw(ts) {
    land("pl-chieu", ts, 6);
    rays(540, 560, ts);
    P("pc-khe", 300, 1690, 600, { rot: 0.01 * Math.sin(ts * 1.3) });
    perched(800, 1730, 420, ts, { left: 1 });
    sparkles(540, 1300, 380, ts, 10);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, card: ["Chuyện cổ tích Việt Nam", "ĂN KHẾ", "TRẢ VÀNG"] });
