// The paper-cut scenes of the asteroid short. The engine is giay/may.js; the layers are listed in anh.js.
const PLATES = ["pl-ky", "pl-do", "pl-toi"];
const CUTS = ["pc-song", "pc-lua", "pc-thien-thach", "pc-rung", "pc-dat", "pc-cau-lua", "pc-ho", "pc-song-than",
  "pg-rex", "pg-rex-so", "pg-tri", "pg-ptero", "pg-thu"];
// which way the generated pieces face, found by looking at them: 1 means the piece faces left as generated
const LEFT = { rex: 1, so: 1, tri: 1, ptero: 0, thu: 0, song: 0 };
// the continents about 66 million years ago, sketched by hand: a narrow Atlantic, India an island, Australia still joined to Antarctica
const EARTH = { lands: [
  [[-115, 70], [-80, 75], [-55, 65], [-40, 50], [-55, 40], [-62, 30], [-78, 27], [-88, 18], [-98, 24], [-108, 35], [-118, 50]],
  [[-58, 8], [-40, 4], [-22, -6], [-22, -20], [-32, -26], [-46, -40], [-54, -55], [-60, -45], [-56, -20], [-62, -5]],
  [[-12, 22], [10, 27], [30, 22], [40, 2], [44, -8], [34, -22], [27, -36], [14, -36], [8, -12], [4, -3], [-8, -3], [-14, 8]],
  [[40, 45], [60, 70], [100, 75], [140, 70], [150, 55], [130, 40], [115, 25], [100, 20], [85, 30], [65, 35], [50, 35]],
  [[66, -22], [76, -12], [82, -24], [73, -38]],
  [[-30, 80], [-12, 78], [-12, 62], [-26, 60]],
  [[0, 44], [14, 50], [30, 48], [25, 40], [6, 39]],
  [[112, -44], [150, -44], [156, -62], [114, -64]],
  [[0,-66],[15,-66],[30,-66],[45,-66],[60,-66],[75,-66],[90,-66],[105,-66],[120,-66],[135,-66],[150,-66],[165,-66],[180,-66],[195,-66],[210,-66],[225,-66],[240,-66],[255,-66],[270,-66],[285,-66],[300,-66],[315,-66],[330,-66],[345,-66]],
], ice: [] };
const FIRE = ["#f2c14e", "#e8662a", "#c8402f", "#fff3b0"];

const ocean = (t, top) => { sea("pc-song", 540 - 30 * Math.sin(t * 0.8 + 1), top + 8 * Math.sin(t * 1.7), 1560); sea("pc-song", 540 + 34 * Math.sin(t * 0.9), top + 330 + 8 * Math.sin(t * 1.5 + 2), 1700, { flip: 1 }); };
const jungle = (sky, t, total) => { plate(sky, t, total, 0); P("pc-rung", 540, 1590, 1300); ground("#6b4a2c", 1560); P("pc-dat", 540, 1690, 1400); };
const flame = (x, y, w, t, n = 0) => P("pc-lua", x, y, w * (1 + 0.08 * Math.sin(t * 11 + n)), { rot: 0.05 * Math.sin(t * 7 + n), shadow: 0 });
const dino = (name, key, x, y, w, t, { left = 0, scared = 0 } = {}) => P(name, x, y + (scared ? hop(t + x, 9, 22) : 6 * Math.sin(t * 2 + x)), w, { flip: left !== LEFT[key], rot: scared ? 0.05 * Math.sin(t * 9 + x) : 0 });
const flash = (k) => { if (k <= 0) return; out.save(); out.globalAlpha = Math.min(1, k); out.fillStyle = "#fffbe8"; out.fillRect(0, 0, OW, OH); out.restore(); };
// glowing grains falling back from the sky
function fallout(t, n = 60) {
  out.save(); out.lineCap = "round";
  for (let i = 0; i < n; i++) {
    const x = rnd(i, 51) * 1300 - 100, y = (rnd(i, 52) * OH + t * (700 + 500 * rnd(i, 53))) % OH;
    out.strokeStyle = FIRE[i % 3]; out.lineWidth = 5 + 4 * rnd(i, 54); out.globalAlpha = 0.85;
    out.beginPath(); out.moveTo(x, y); out.lineTo(x + 26, y - 80); out.stroke();
  }
  out.restore();
}
function ash(t, n = 70) {
  out.save(); out.fillStyle = "#b9b2a6";
  for (let i = 0; i < n; i++) { out.globalAlpha = 0.5 + 0.4 * rnd(i, 63); out.beginPath(); out.arc((rnd(i, 61) * OW + 50 * Math.sin(t + i)) % OW, (rnd(i, 62) * OH + t * (90 + 80 * rnd(i, 64))) % OH, 5 + 6 * rnd(i, 65), 0, 7); out.fill(); }
  out.restore();
}
function cracks(k) {
  if (k <= 0) return;
  out.save(); out.strokeStyle = "#1a0d06"; out.lineWidth = 10; out.lineJoin = "round";
  for (let i = 0; i < 4; i++) {
    out.beginPath(); let x = 150 + i * 260, y = 1620; out.moveTo(x, y);
    for (let s = 1; s <= 6 * Math.min(1, k); s++) { x += (rnd(i, s) - 0.5) * 120; y += 50; out.lineTo(x, y); }
    out.stroke();
  }
  out.restore();
}

const SCENES = [
  { shots: ["hook"], draw(ts) {
    out.save(); jolt(4 * sm(1.5, 3, ts));
    jungle("pl-do", ts, 6);
    P("pc-cau-lua", 540, 1500, 500 + 500 * sm(0, 5, ts), { shadow: 0 });
    P("pc-rung", 540, 1590, 1300); ground("#6b4a2c", 1560); P("pc-dat", 540, 1690, 1400);
    dino("pg-rex-so", "so", 440, 1850, 820, ts, { scared: 1 });
    out.restore();
    night("#ffcfa8");
    tag("10 PHÚT", 360, 420, -0.03, pop(0.6, ts), 80);
  } },
  { shots: ["1", "2"], draw(ts, i, u) {
    space(ts);
    globe(300, 1600, 550, EARTH, -45 + ts * 1.5, 15);
    const near = sm(0, 10, ts);
    P("pc-thien-thach", 900 - 300 * near, 700 + 420 * near, 420 + 160 * near, { rot: 0.03 * Math.sin(ts * 3), shadow: 0 });
    sparkles(1000 - 300 * near, 380 + 420 * near, 120, ts, 6);
    if (i === 0) { tag("66 TRIỆU NĂM TRƯỚC", 80, 300, -0.03, pop(0.4, u), 50); tag("RỘNG ~10 KM", 420, 440, 0.03, pop(2, u), 50); }
    if (i === 1) tag("~20 KM / GIÂY", 250, 300, -0.03, pop(0.6, u), 64);
  } },
  { shots: ["3", "4", "5"], draw(ts, i, u) {
    const hit = 2.2, boom = Math.max(0, ts - hit);
    out.save(); jolt(boom ? 6 : 0);
    plate(i === 2 ? "pl-do" : "pl-ky", ts, 13, 0);
    if (!boom) P("pc-thien-thach", 1100 - 500 * (ts / hit), 300 + 700 * (ts / hit), 300, { shadow: 0 });
    else P("pc-cau-lua", 600, 1160, 200 + 900 * sm(0, 6, boom), { shadow: 0 });
    ocean(ts, 1080);
    P("pc-rung", 540, 1620, 1300); ground("#6b4a2c", 1590); P("pc-dat", 540, 1720, 1400);
    if (i === 2) { [150, 420, 700, 960].forEach((x, n) => flame(x, 1600, 260 * pop(0.2 + n * 0.4, u), ts, n)); }
    out.restore();
    if (boom) flash(1 - boom / 0.9);
    if (boom) night(i === 2 ? "#ffb890" : "#ffe2c0");
    if (i === 0) tag("MEXICO NGÀY NAY", 230, 420, -0.03, pop(0.4, u), 56);
    if (i === 1) tag("QUẢ CẦU LỬA", 180, 420, -0.03, pop(0.6, u), 52);
    if (i === 2) tag("RỪNG BỐC CHÁY", 250, 420, -0.03, pop(0.8, u), 56);
  } },
  { shots: ["6", "7"], draw(ts, i, u) {
    out.save(); jolt(3);
    plate("pl-do", ts, 9, 0);
    ground("#3a2418", 1250);
    P("pc-ho", 540, 1800, 700 + 380 * sm(0, 4, ts), { rot: 0.01 * Math.sin(ts * 3) });
    if (i === 1) for (let n = 0; n < 3; n++) shards(540, 1300, ((u + n * 0.5) % 1.5) * 0.9, 16, FIRE);
    out.restore();
    if (i === 0) { ring(540, 1560, 420, sm(1.2, 2.2, u)); tag("GẦN 200 KM", 300, 620, -0.03, pop(1.6, u), 64); }
    if (i === 1) tag("TẬN RÌA KHÔNG GIAN", 170, 420, -0.03, pop(0.8, u), 52);
  } },
  { shots: ["8"], draw(ts) {
    plate("pl-do", ts, 6, 0);
    ocean(ts, 1250);
    P("pc-song-than", 700 - 160 * sm(0, 5, ts), 2000, 1100, { flip: LEFT.song ? 0 : 1 });
    P("pc-song-than", 700 - 160 * sm(0, 5, ts), 3300 - 1300 * sm(0.2, 2.6, ts), 1100, { flip: LEFT.song ? 0 : 1 });
    ocean(ts, 1720);
    tag("CAO 4,5 KM, CHỐC LÁT", 80, 420, -0.03, pop(1.6, ts), 64);
  } },
  { shots: ["9", "10"], draw(ts, i, u) {
    if (i === 0) {
      out.save(); jolt(9);
      jungle("pl-do", ts, 6);
      cracks(sm(0.5, 3, u));
      dino("pg-rex-so", "so", 330, 1850, 660, ts, { scared: 1 });
      dino("pg-tri", "tri", 820, 1860, 500, ts, { left: 1, scared: 1 });
      out.restore();
      night("#ffcfa8");
    } else {
      space(ts);
      // centred on the impact site
      globe(540 + 5 * Math.sin(ts * 14), 1020, 380, EARTH, -74, 22);
      for (let n = 0; n < 4; n++) { const k = (u * 0.5 + n * 0.25) % 1; out.save(); out.globalAlpha = 1 - k; ring(540, 1020, 120 + 560 * k, 1); out.restore(); }
      shards(540, 1020, (u % 1.4) * 0.5, 8, FIRE);
    }
  } },
  { shots: ["11", "12"], draw(ts, i, u) {
    const shake = i === 0 ? sm(3, 5, u) : 1;
    out.save(); jolt(6 * shake);
    jungle("pl-ky", ts, 12);
    if (i === 1) ocean(ts, 1780 - 260 * Math.abs(Math.sin(u * 1.6)));
    dino("pg-tri", "tri", 280, 1840, 500, ts, { scared: shake > 0.5 });
    dino(shake > 0.5 ? "pg-rex-so" : "pg-rex", shake > 0.5 ? "so" : "rex", 780, 1840, 660, ts, { left: 1, scared: shake > 0.5 });
    out.restore();
    if (i === 0) tag("CÁCH 3.000 KM", 250, 420, -0.03, pop(0.4, u), 60);
  } },
  { shots: ["13", "14"], draw(ts, i, u) {
    plate(i === 0 ? "pl-ky" : "pl-do", ts, 9, 0);
    if (i === 0) { out.save(); out.globalAlpha = sm(0, 3, u); plate("pl-do", ts, 9, 0); out.restore(); }
    P("pg-ptero", 300 + 90 * ts, 620 + 30 * Math.sin(ts * 4) + (i === 1 ? 500 * sm(0, 2.5, u) : 0), 520, { flip: LEFT.ptero, rot: 0.06 * Math.sin(ts * 4) + (i === 1 ? 0.8 * sm(0, 2.5, u) : 0) });
    P("pc-rung", 540, 1620, 1300); ground("#6b4a2c", 1590); P("pc-dat", 540, 1720, 1400);
    fallout(ts, i === 0 ? 40 : 90);
    if (i === 1) { [200, 540, 880].forEach((x, n) => flame(x, 1640, 300 * pop(0.4 + n * 0.5, u), ts, n)); night("#ffb890"); tag("NÓNG NHƯ LÒ NƯỚNG", 170, 420, -0.03, pop(1.4, u), 52); }
  } },
  { shots: ["15", "16"], draw(ts, i, u) {
    jungle("pl-toi", ts, 8);
    const gone = i === 1 ? sm(0.3, 2.6, u) : 0;
    P("pg-rex", 380, 1840, 680, { flip: LEFT.rex, alpha: 1 - gone });
    P("pg-tri", 830, 1850, 460, { flip: !LEFT.tri, alpha: 1 - gone });
    night("#9a94a6");
    ash(ts);
    if (i === 1) tag("3/4 CÁC LOÀI BIẾN MẤT", 130, 520, -0.03, pop(1.2, u), 52);
  } },
  { shots: ["17"], draw(ts) {
    plate("pl-toi", ts, 7, 0);
    out.save(); out.globalAlpha = sm(1, 6, ts); plate("pl-ky", ts, 7, 0); out.restore();
    P("pc-rung", 540, 1590, 1300, { alpha: 0.5 }); ground("#6b4a2c", 1560); P("pc-dat", 540, 1690, 1400);
    out.fillStyle = "#1a0d06"; out.beginPath(); out.ellipse(540, 1800, 250, 90, 0, 0, 7); out.fill();
    P("pg-thu", 540, 2150 - 330 * pop(0.8, ts, 0.7) + hop(ts, 3, 8), 300, { flip: LEFT.thu });
    sparkles(540, 1500, 260, ts, 8);
    tag("TỔ TIÊN CỦA CHÚNG TA", 170, 620, -0.03, pop(3.4, ts), 52);
  } },
  { shots: ["kết"], draw(ts) {
    jungle("pl-ky", ts, 6);
    rays(540, 700, ts);
    P("pg-thu", 540, 1830 + hop(ts, 4, 14), 380, { flip: LEFT.thu });
    sparkles(540, 1300, 380, ts, 10);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, card: ["Chuyện Trái Đất", "10 PHÚT SAU", "THIÊN THẠCH"] });
