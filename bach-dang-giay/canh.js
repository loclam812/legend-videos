// The paper-cut cut of Bạch Đằng 938: layers, helpers for the river set, and the scenes. The engine is giay/may.js.
const PLATES = ["pc-sky", "pl-dem", "pl-ngay", "pl-xam", "pl-phu", "pl-han", "pl-rung", "pl-coloa"];
const CUTS = ["pc-nui", "pc-song", "pc-coc", "pc-coc1", "pc-thuyen2", "pc-ghe", "pc-lua", "pc-bo", "pg-ngo", "pg-ngo-kiem", "pg-ngo-vua", "pg-duong", "pg-kieu",
  "pg-cung", "pg-cung-khoc", "pg-thao", "pg-thao-so", "pg-su", "pg-linh", "pg-riu", "pg-dan", "pg-han"];
// which way the generated pieces face, found by looking at them: 1 mirrors the piece
const FLIP = { junk: 1, kieu: 0, linh: 0, ngo: 0, su: 1, riu: 1, ghe: 1, kiem: 0 };


const HIGH = 1000, LOW = 1420;
// sky, sun rays, mountains and the far band of sea; the scene adds what floats and then calls front()
function river(sky, t, total, sunY = 440) {
  if (sky === "pc-sky") { const sw = 1100, sh = (sw * L[sky].height) / L[sky].width, y = sunY - 30 * sm(0, total, t); out.drawImage(L[sky], (OW - sw) / 2, y - sh * 0.56, sw, sh); rays(540, y, t); }
  else plate(sky, t, total, 0);
  P("pc-nui", 540 - 18 * Math.sin(t * 0.25), 940, 1180);
  sea("pc-song", 540 + 26 * Math.sin(t * 0.7), 880, 1500, { flip: 1 });
}
// two bands, so the foreground is waves all the way down instead of a flat fill
const front = (t, top, alpha = 1) => { sea("pc-song", 540 - 30 * Math.sin(t * 0.8 + 1), top + 8 * Math.sin(t * 1.7), 1560, { alpha }); sea("pc-song", 540 + 34 * Math.sin(t * 0.9), top + 330 + 8 * Math.sin(t * 1.5 + 2), 1700, { flip: 1, alpha }); };
const stakes = () => P("pc-coc", 540, 1900, 820);
const junk = (x, y, w, t, { tilt = 0, sink = 0 } = {}) => P("pc-thuyen2", x, y + sink, w, { flip: FLIP.junk, rot: (tilt ? 0 : 0.025 * Math.sin(t * 2.2 + x)) + tilt });
const flame = (x, y, w, t) => P("pc-lua", x, y, w * (1 + 0.08 * Math.sin(t * 17)), { rot: 0.06 * Math.sin(t * 11), shadow: 0 });

// a scene serves one or more shots in a row: ts = seconds since the scene began, i = which of its shots, u = seconds into that shot
const SCENES = [
  { shots: ["hook", "hook 2"], draw(ts, i, u) {
    out.save(); jolt(16 * (1 - sm(0, 0.8, ts)));
    river("pc-sky", ts, 9);
    junk(900, 1230, 430, ts, { tilt: -0.16, sink: 30 * sm(0, 9, ts) });
    flame(880, 1090, 120, ts);
    junk(600 + 5 * Math.sin(ts * 30) * (1 - sm(0, 1.4, ts)), 1310, 640, ts, { tilt: 0.2 * sm(0, 0.5, ts), sink: 70 * sm(0.3, 9, ts) });
    flame(560, 1150, 190, ts);
    stakes();
    P("pg-han", 250, 1640 + hop(ts, 3, 18), 360, { rot: 0.06 * Math.sin(ts * 3) });
    front(ts, LOW);
    shards(580, 1180, ts);
    out.restore();
    if (i === 1) { tag("NĂM 938", 60, 250, -0.03, pop(0.3, u)); tag("SÔNG BẠCH ĐẰNG", 60, 340, 0.02, pop(1.9, u)); }
  } },
  { shots: ["1"], draw(ts) {
    plate("pl-phu", ts, 6);
    const strike = sm(3.3, 3.7, ts), fall = sm(3.6, 4.6, ts);
    P("pg-duong", 400, 1620 + 180 * fall, 420, { rot: 0.03 * Math.sin(ts * 1.6) - 1.25 * fall, alpha: 1 - 0.75 * fall });
    P("pg-kieu", 1300 - 500 * sm(0.4, 2.8, ts) - 110 * strike, 1640 + hop(ts, 5, 10) * (1 - strike), 420, { flip: FLIP.kieu, rot: -0.16 * strike });
    tag("NĂM 937", 60, 250, -0.03, pop(0.3, ts));
  } },
  { shots: ["2"], draw(ts) {
    plate("pl-ngay", ts, 5, 0);
    P("pc-nui", 540, 1260, 1250);
    ground("#c9a868", 1500);
    P("pc-bo", 540, 1620, 1400);
    const walk = 420 * sm(0, 4.8, ts);
    P("pg-linh", -260 + walk, 1650 + hop(ts, 6, 12), 470, { flip: FLIP.linh });
    P("pg-linh", -40 + walk, 1700 + hop(ts + 0.3, 6, 12), 500, { flip: FLIP.linh });
    P("pg-ngo", 420 + walk, 1730 + hop(ts, 6, 14), 470, { flip: FLIP.ngo });
    tag("TỪ ÁI CHÂU", 60, 250, -0.03, pop(0.4, ts));
  } },
  { shots: ["3", "3b"], draw(ts, i, u) {
    plate("pl-han", ts, 8);
    P("pg-cung", 560, 1560, 600, { rot: 0.02 * Math.sin(ts * 1.4) + (i ? 0.04 * Math.sin(u * 8) * (1 - sm(1, 1.6, u)) : 0) });
    const leave = i ? sm(0, 0.9, u) : 0;
    P("pg-su", -260 + 500 * sm(0.3, 1.8, ts) - 600 * leave, 1700, 340, { flip: FLIP.su, rot: 0.05 * Math.sin(ts * 5) });
    if (i) { P("pg-thao", 800, 1740 + 700 * (1 - pop(0.5, u, 0.6)) + hop(u, 4, 10), 430); tag("LƯU HOẰNG THÁO", 60, 250, -0.03, pop(1.3, u)); }
  } },
  { shots: ["5", "5b"], draw(ts, i, u) {
    river("pc-sky", ts, 8);
    front(ts, 1180);
    ground("#b99a5e", 1560);
    P("pc-bo", 540, 1660, 1400);
    P("pg-linh", 860, 1700, 400, { flip: !FLIP.linh, rot: 0.02 * Math.sin(ts * 2) });
    P("pg-ngo", 360, 1720 + (i ? hop(u, 5, 18) : 0), 480, { flip: FLIP.ngo, rot: 0.02 * Math.sin(ts * 1.8) });
    const k = i ? 1 : pop(1.1, u), grow = i ? 40 * sm(0, 0.6, u) : 0;
    bubble(760, 560, 190 + grow, k);
    if (k > 0) P("pc-coc1", 760, 700 + grow, 60 * k, { shadow: 0 });
    if (i) { ring(760, 420, 86, sm(1.2, 1.8, u)); tag("CỌC GỖ BỊT SẮT", 560, 840, 0.03, pop(1.6, u)); }
  } },
  { shots: ["6"], draw(ts) {
    plate("pl-rung", ts, 5);
    for (let n = 0; n < 5; n++) { const k = pop(0.6 + n * 0.7, ts); if (k > 0) P("pc-coc1", 250 + n * 20, 1760 - n * 46, 70 * k, { rot: Math.PI / 2 - 0.04 * n }); }
    P("pg-riu", 300, 1600, 440, { flip: FLIP.riu, rot: 0.14 * Math.sin(ts * 6) });
    P("pg-riu", 820, 1640, 400, { flip: !FLIP.riu, rot: 0.14 * Math.sin(ts * 6 + 2) });
    shards(560, 1500, (ts % 1.05) * 0.5, 8);
  } },
  { shots: ["7"], draw(ts) {
    const STAKE_H = tall("pc-coc1", 64);
    river("pl-ngay", ts, 5);
    P("pc-ghe", 300, 1330 + 10 * Math.sin(ts * 2.4), 520, { flip: FLIP.ghe, rot: 0.03 * Math.sin(ts * 2.4) });
    for (let n = 0; n < 5; n++) { const d = sm(0.4 + n * 0.6, 0.75 + n * 0.6, ts); if (d > 0) P("pc-coc1", 470 + n * 120, 1170 + STAKE_H * (0.1 + 0.9 * d) - 26 * Math.sin(Math.PI * sm(0.75 + n * 0.6, 1.05 + n * 0.6, ts)), 64); }
    front(ts, 1330);
    tag("CỬA SÔNG BẠCH ĐẰNG", 60, 250, -0.03, pop(0.4, ts));
  } },
  { shots: ["8", "8b"], draw(ts, i, u) {
    river("pl-dem", ts, 8);
    stakes();
    front(ts, i ? HIGH : LOW - (LOW - HIGH) * sm(0.3, 3, u), i ? 1 - 0.5 * sm(0.2, 1, u) : 1);
    night();
    // drawn again after the night tint, or the grey points vanish into the dark water
    if (i) P("pc-coc", 540, 1900, 820, { alpha: 0.75 * sm(0.2, 1, u), shadow: 0 });
    tag("NƯỚC LỚN", 60, 250, -0.03, i ? 1 : pop(2.6, u));
    if (i) [[218, 1100], [540, 1100], [862, 1100]].forEach(([x, y], n) => ring(x, y, 80, sm(0.6 + n * 0.4, 1.2 + n * 0.4, u)));
  } },
  { shots: ["9", "9b", "10"], draw(ts, i, u) {
    river("pl-xam", ts, 12);
    const drift = 70 * sm(4, 12, ts) + (i === 2 ? 160 * sm(0.4, 3, u) : 0), come = sm(0.2, 3.4, ts);
    junk(1500 - 520 * come - drift, 1060, 360, ts);
    junk(1700 - 480 * come - drift, 1120, 520, ts);
    junk(1420 - 800 * come - drift, 1180, 640, ts);
    if (i) P("pc-ghe", 760 - 560 * sm(0, 7, ts - 4.2), 1150 + 8 * Math.sin(ts * 3), 380, { flip: FLIP.ghe, rot: 0.04 * Math.sin(ts * 3) });
    front(ts, HIGH + 60);
    if (i === 2) P("pg-thao", 830, 1760 + 700 * (1 - pop(0.3, u, 0.5)) + hop(u, 7, 22), 440);
    tag("NƯỚC LỚN", 60, 250, -0.03);
  } },
  { shots: ["11", "11c", "12", "13"], draw(ts, i, u) {
    const done = i > 2 ? 1 : 0, since = i === 2 ? u - 1.5 : -1;
    out.save(); if (since > 0 && since < 0.8) jolt(16 * (1 - since / 0.8));
    river("pc-sky", ts, 16);
    const ebb = i ? 1 : sm(0.3, 3.3, u), sink2 = i === 3 ? sm(0.3, 3, u) : 0;
    junk(960 - (i === 3 ? 120 * sm(0, 0.5, u) : 0), 1220, 440, ts, { tilt: -0.2 * sink2, sink: 80 * sink2 });
    if (i === 3) { const fly = sm(0.5, 1.9, u); P("pg-thao-so", 940 - 260 * fly, 1150 - 420 * Math.sin(Math.PI * fly) + 500 * fly * fly, 300, { rot: -2.2 * fly }); }
    const go = i === 2 ? sm(0, 1.5, u) : done, wreck = i === 2 ? sm(1.5, 3.6, u) : done;
    junk(900 - 300 * go + (i === 2 && since > 0 ? 5 * Math.sin(ts * 30) * (1 - sm(1.6, 3, u)) : 0), 1310, 640, ts, { tilt: 0.22 * wreck, sink: 110 * wreck });
    if (i === 3) flame(560, 1190, 200, ts);
    stakes();
    if (i === 3) P("pg-han", 240, 1650 + hop(ts, 3, 18), 340, { rot: 0.06 * Math.sin(ts * 3) });
    if (i === 1) P("pc-ghe", -300 + 520 * sm(0, 2, u), 1500 + 8 * Math.sin(ts * 3), 460, { flip: !FLIP.ghe, rot: 0.03 * Math.sin(ts * 3) });
    front(ts, HIGH + (LOW - HIGH) * ebb);
    if (i === 1) P("pg-ngo-kiem", 300, 1760 + 800 * (1 - pop(0.2, u, 0.5)) + hop(u, 6, 24), 430, { flip: FLIP.kiem });
    if (since > 0) shards(580, 1180, since);
    out.restore();
    tag("NĂM 938", 60, 250, -0.03);
    tag(ebb < 0.15 ? "NƯỚC LỚN" : ebb < 0.95 ? "NƯỚC ĐANG RÚT ▼" : "NƯỚC RÒNG", 60, 340, 0.02);
  } },
  { shots: ["14"], draw(ts) {
    river("pl-xam", ts, 5);
    const away = sm(0, 5, ts);
    P("pc-thuyen2", 620 + 520 * away, 1040, 300 - 60 * away, { flip: !FLIP.junk, rot: 0.03 * Math.sin(ts * 2) });
    P("pc-thuyen2", 380 + 420 * away, 1080, 240 - 40 * away, { flip: !FLIP.junk, rot: 0.03 * Math.sin(ts * 2 + 1) });
    front(ts, 1200);
    ground("#a99e86", 1580);
    P("pc-bo", 540, 1680, 1400);
    P("pg-cung-khoc", 420, 1740, 480, { rot: 0.035 * Math.sin(ts * 1.5) });
    tears(420, 1010, ts);
  } },
  { shots: ["15", "15b"], draw(ts, i, u) {
    plate("pl-coloa", ts, 9);
    rays(540, 520, ts * 2, 0.16);
    if (i) { P("pg-dan", 210, 1760 + hop(u, 6, 30), 470); P("pg-dan", 880, 1780 + hop(u + 0.25, 6, 30), 470, { flip: 1 }); }
    P("pg-ngo-vua", 540, 1700 + 900 * (1 - pop(0.3, ts, 0.7)) + (i ? hop(u, 5, 16) : 0), 520);
    if (i) confetti(u);
    tag("NĂM 939 · CỔ LOA", 60, 250, -0.03, pop(1.2, ts));
  } },
  { shots: ["kết"], draw(ts) {
    river("pc-sky", ts, 6, 620);
    front(ts, 1300);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, card: ["Chuyện lịch sử Việt Nam", "BẠCH ĐẰNG", "938"] });
