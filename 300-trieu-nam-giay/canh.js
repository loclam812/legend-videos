// The paper-cut scenes of "If you woke up 300 million years ago". Wide frame: 1920x1080.
// The engine is giay/may.js; the layers are listed in anh.js.
const PLATES = ["pl-rung", "pl-troi", "pl-dem", "pl-bao", "pl-lua", "pl-nuoc"];
const CUTS = ["pc-vay", "pc-moc-tac", "pc-duong-xi", "pc-bui", "pc-dam", "pc-dat", "pc-than", "pc-lua", "pc-may", "pc-trung", "pc-leu", "pc-bep", "pc-hue-bien", "pc-suoi",
  "pg-ban", "pg-ban-so", "pg-ban-ngoi", "pg-mega", "pg-arthro", "pg-gian", "pg-luong-cu", "pg-ca-map", "pg-ca-map-bien", "pg-bo-sat", "pg-san-moi", "pg-rex"];
// which way the generated pieces face, found by looking at them: 1 means the piece faces left as generated
const LEFT = { mega: 0, arthro: 1, luongCu: 1, caMap: 0, caMapBien: 1, boSat: 0, sanMoi: 1, rex: 1 };
// the continents about 300 million years ago, sketched by hand: Gondwana in the south with its ice sheet, Laurussia pressed against
// it from the north-west, Siberia and the Chinese blocks still apart
const EARTH = { lands: [
  [[-62, -8], [-20, 2], [10, -4], [30, -14], [58, -28], [80, -45], [70, -62], [-105, -62], [-120, -62], [-135, -62], [-150, -62], [-165, -62], [180, -62], [165, -62], [150, -62], [135, -62], [120, -62], [105, -62], [90, -62], [75, -62], [-104, -45], [-84, -26]],
  [[-72, -8], [-82, 10], [-62, 30], [-30, 40], [0, 35], [10, 15], [2, 0], [-20, 2], [-62, -8]],
  [[22, 40], [50, 56], [72, 46], [56, 30], [30, 28]],
  [[82, 10], [96, 15], [92, 0]],
  [[100, 25], [112, 30], [108, 18]],
], ice: [[[0,-58],[15,-58],[30,-58],[45,-58],[60,-58],[75,-58],[90,-58],[105,-58],[120,-58],[135,-58],[150,-58],[165,-58],[180,-58],[195,-58],[210,-58],[225,-58],[240,-58],[255,-58],[270,-58],[285,-58],[300,-58],[315,-58],[330,-58],[345,-58]]] };
const FIRE = ["#f2c14e", "#e8662a", "#c8402f", "#fff3b0"];
const GROUND = 850, FEET = 915;

// 1 once sentence `n` of the shot has begun, popping in as it begins
// the generated skies have a pale paper border: draw them enlarged so it falls outside the frame
const back = (name, t, total) => { out.save(); out.translate(960, 540); out.scale(1.16, 1.16); out.translate(-960, -540); plate(name, t, total, 0.5); out.restore(); };
const on = (n, line, v, d = 0.3) => (line > n ? 1 : line === n ? pop(d, v) : 0);
const soil = () => { ground("#3a2a1c", GROUND); P("pc-dat", 960, 1010, 2300); };
const tree = (name, x, w, t, n = 0, alpha = 1) => P(name, x, GROUND + 40, w, { rot: 0.008 * Math.sin(t * 1.1 + n), alpha });
function forest(t, total, sky = "pl-rung") {
  back(sky, t, total);
  tree("pc-vay", 250, 200, t, 1, 0.85); tree("pc-moc-tac", 620, 150, t, 2, 0.85); tree("pc-vay", 1250, 180, t, 3, 0.85); tree("pc-duong-xi", 1640, 300, t, 4, 0.9);
  P("pc-bui", 960, GROUND + 30, 2100);
  soil();
}
const front = (t) => { tree("pc-vay", 90, 330, t, 5); tree("pc-vay", 1820, 360, t, 6); };
const swamp = (t, top = 830) => sea("pc-dam", 960 + 30 * Math.sin(t * 0.6), top + 5 * Math.sin(t * 1.3), 2200, { deep: "#10231c" });
const you = (name, x, t, { w = 150, flip = 0, y = FEET } = {}) => P(name, x, y + 4 * Math.sin(t * 2.2), w, { flip, rot: 0.015 * Math.sin(t * 1.6) });
const mega = (x, y, w, t, left = 0, n = 0) => P("pg-mega", x, y + 14 * Math.sin(t * 9 + n), w, { flip: left !== LEFT.mega, rot: 0.05 * Math.sin(t * 9 + n), shadow: 0 });
const crawl = (name, key, x, y, w, t, left = 0) => P(name, x, y + 4 * Math.sin(t * 8), w, { flip: left !== LEFT[key], rot: 0.012 * Math.sin(t * 8) });
const swim = (name, key, x, y, w, t, left = 0) => P(name, x, y + 22 * Math.sin(t * 2), w, { flip: left !== LEFT[key], rot: 0.06 * Math.sin(t * 2 + 1), shadow: 0 });
const flame = (x, y, w, t, n = 0) => P("pc-lua", x, y, w * (1 + 0.08 * Math.sin(t * 11 + n)), { rot: 0.05 * Math.sin(t * 7 + n), shadow: 0 });
const flash = (k) => { if (k <= 0) return; out.save(); out.globalAlpha = Math.min(1, k); out.fillStyle = "#fffbe8"; out.fillRect(0, 0, OW, OH); out.restore(); };
const fade = (name, t, total, k) => { if (k <= 0) return; out.save(); out.globalAlpha = Math.min(1, k); back(name, t, total); out.restore(); };
function rain(t, n = 90) {
  out.save(); out.strokeStyle = "#cfe3f5"; out.lineWidth = 4; out.globalAlpha = 0.5;
  for (let i = 0; i < n; i++) { const x = rnd(i, 41) * 2100 - 100, y = (rnd(i, 42) * OH + t * (1300 + 500 * rnd(i, 43))) % OH; out.beginPath(); out.moveTo(x, y); out.lineTo(x - 20, y + 64); out.stroke(); }
  out.restore();
}
function card(x, y, w, h, k) {
  if (k <= 0) return;
  out.save(); out.translate(x, y); out.scale(k, k);
  out.shadowColor = "rgba(40,20,10,.5)"; out.shadowBlur = 18; out.shadowOffsetY = 10;
  out.fillStyle = "#fbf3df"; out.fillRect(-w / 2, -h / 2, w, h);
  out.shadowColor = "transparent"; out.lineWidth = 6; out.strokeStyle = "#2a1608"; out.strokeRect(-w / 2, -h / 2, w, h);
  out.restore();
}
function cross(x, y, r, k) {
  if (k <= 0) return;
  out.save(); out.strokeStyle = "#c8402f"; out.lineWidth = 22; out.lineCap = "round"; out.translate(x, y); out.scale(k, k);
  out.beginPath(); out.moveTo(-r, -r); out.lineTo(r, r); out.moveTo(r, -r); out.lineTo(-r, r); out.stroke();
  out.restore();
}
// a labelled bar that grows to `share` of 100 %
function bar(x, label, share, color, k) {
  if (k <= 0) return;
  const h = 560 * (share / 100) * 2.4 * Math.min(1, k);
  out.save();
  out.shadowColor = "rgba(40,20,10,.5)"; out.shadowBlur = 16; out.shadowOffsetY = 8;
  out.fillStyle = color; out.fillRect(x - 110, 820 - h, 220, h);
  out.shadowColor = "transparent"; out.lineWidth = 6; out.strokeStyle = "#2a1608"; out.strokeRect(x - 110, 820 - h, 220, h);
  out.restore();
  tag(`${Math.round(share * Math.min(1, k))}%`, x - 80, 770 - h, -0.02, 1, 60);
  tag(label, x - 150, 880, 0, 1, 36);
}

const SCENES = [
  { shots: ["h1", "h2", "h3"], draw(ts, i, u, line, v) {
    forest(ts, 26);
    const up = sm(0.4, 2.2, ts);
    P(i === 1 && line > 0 ? "pg-ban-so" : "pg-ban", 760, FEET, 170, { rot: 1.45 * (1 - up) });
    front(ts);
    if (i === 0 && line === 2) sparkles(960, 420, 500, ts, 8);
    if (i === 1) mega(line === 0 ? 2400 : 2300 - 900 * Math.min(2.6, v + (line - 1) * 4), 430, 640, ts, 1);
    if (i === 2) { mega(1350, 300, 300, ts, 1, 2); tag("300 TRIỆU NĂM TRƯỚC", 560, 250, -0.02, pop(0.4, u), 76); }
  } },
  { shots: ["b1", "b2", "b3"], draw(ts, i, u, line, v) {
    forest(ts, 32);
    you("pg-ban", 420, ts);
    front(ts);
    if (i === 0) { tag("KỶ THAN ĐÁ", 760, 250, -0.02, pop(0.3, u), 84); tag("359 – 299 TRIỆU NĂM TRƯỚC", 700, 400, 0.01, on(1, line, v), 46); }
    if (i === 1) {
      const k = pop(0.3, u);
      card(1180, 440, 620, 520, k); P("pg-rex", 1180, 640, 480 * k, { flip: LEFT.rex, shadow: 0 });
      cross(1180, 440, 170, on(0, line, v, 1.2));
      tag("CÒN 70 TRIỆU NĂM NỮA", 900, 760, -0.02, on(1, line, v), 44);
    }
    if (i === 2) [["CHƯA CÓ CHIM", 700, 220, 0, 0.3], ["CHƯA CÓ THÚ", 1150, 320, 0, 1.4], ["CHƯA CÓ HOA", 760, 440, 0, 2.6], ["CHƯA CÓ CỎ", 1200, 540, 1, 0.3]].forEach(([text, x, y, n, d], j) => tag(text, x, y, j % 2 ? 0.02 : -0.02, on(n, line, v, d), 50));
  } },
  { shots: ["b4", "b5", "b6"], draw(ts, i, u, line, v) {
    space(ts);
    globe(960, 540, 360, EARTH, -15 + (i === 2 ? 30 * u : 8 * Math.sin(ts * 0.3)), -12);
    sparkles(960, 300, 900, ts, 10);
    if (i === 0) tag("PANGAEA", 1380, 420, -0.02, on(2, line, v), 80);
    if (i === 1) { ring(900, 470, 110, on(0, line, v, 0.6)); tag("XÍCH ĐẠO: NÓNG ẨM", 1300, 400, -0.02, on(0, line, v, 0.8), 46); tag("PHÍA NAM: BĂNG PHỦ", 1300, 780, 0.02, on(1, line, v), 46); }
    if (i === 2) { tag("1 NGÀY < 23 GIỜ", 130, 380, -0.02, on(0, line, v), 56); tag("1 NĂM ≈ 390 NGÀY", 130, 560, 0.02, on(2, line, v), 56); }
  } },
  { shots: ["b7", "b8"], draw(ts, i, u, line, v) {
    back("pl-troi", ts, 22);
    P("pc-bui", 960, GROUND + 30, 2100); soil();
    if (i === 0) { tag("Ô XY TRONG KHÔNG KHÍ", 620, 150, -0.01, pop(0.3, u), 56); bar(700, "NGÀY NAY", 21, "#7fb4cc", on(1, line, v * 0.6)); bar(1220, "KỶ THAN ĐÁ", 30, "#7fbf5a", on(2, line, v * 0.5)); }
    if (i === 1) {
      bar(700, "NGÀY NAY", 21, "#7fb4cc", 1); bar(1220, "KỶ THAN ĐÁ", 30, "#7fbf5a", 1);
      mega(1560, 380, 420 * on(1, line, v), ts, 1); crawl("pg-arthro", "arthro", 330, 820, 480 * on(1, line, v, 0.8), ts);
    }
  } },
  { shots: ["k1", "k2", "k3"], draw(ts, i, u, line, v) {
    back("pl-rung", ts, 34);
    const lift = i === 0 ? 260 * sm(0.5, 6, u) : 260;
    [[200, 420, 1], [560, 300, 2], [1380, 340, 3], [1760, 460, 4]].forEach(([x, w, n]) => P("pc-vay", x, GROUND + 60 + lift * 1.2, w, { rot: 0.008 * Math.sin(ts + n) }));
    if (i === 2) { P("pc-moc-tac", 800, GROUND + 60, 260 * on(0, line, v, 0.6)); P("pc-duong-xi", 1130, GROUND + 60, 470 * on(2, line, v, 0.6)); }
    P("pc-bui", 960, GROUND + 30 + lift, 2100); ground("#3a2a1c", GROUND + lift);
    you("pg-ban", 960, ts, { w: 110, y: FEET + lift * 0.4 });
    if (i === 0) tag("CAO 30 – 40 M", 760, 260, -0.02, on(1, line, v), 64);
    if (i === 1) { ring(200, 520, 190, on(2, line, v, 0.8)); tag("CÂY VẢY", 430, 300, -0.02, on(2, line, v), 70); tag("HỌ HÀNG CỦA THẠCH TÙNG", 430, 440, 0.02, on(1, line, v), 42); }
    if (i === 2) { tag("MỘC TẶC > 10 M", 560, 200, -0.02, on(0, line, v, 0.8), 46); tag("DƯƠNG XỈ THÂN GỖ", 1000, 300, 0.02, on(2, line, v, 0.8), 46); }
  } },
  { shots: ["k4"], draw(ts, i, u, line, v) {
    forest(ts, 10);
    swamp(ts, 800);
    P("pg-ban", 900, 960 + 18 * sm(0, 3, v) * (line === 2 ? 1 : 0), 180, { rot: 0.03 * Math.sin(ts * 2) });
    swamp(ts, 900);
    for (let n = 0; n < 6; n++) { const k = (ts * 0.4 + n * 0.17) % 1; out.save(); out.globalAlpha = 1 - k; out.strokeStyle = "#9fc7a8"; out.lineWidth = 5; out.beginPath(); out.arc(300 + n * 270, 980 - 120 * k, 10 + 14 * k, 0, 7); out.stroke(); out.restore(); }
    front(ts);
    tag("ĐẦM LẦY", 1180, 300, -0.02, pop(0.4, u), 76);
  } },
  { shots: ["k5", "k6"], draw(ts, i, u, line, v) {
    back("pl-troi", ts, 24);
    P("pc-bui", 960, GROUND + 30, 2100);
    const fall = i === 0 ? sm(0.3, 3, u) : 1;
    P("pc-vay", 420 + 200 * fall, GROUND + 60 + 150 * fall, 300, { rot: 1.5 * fall, alpha: 1 - 0.5 * sm(3, 6, u) * (i === 0 ? 1 : 0) - (i ? 0.5 : 0) });
    swamp(ts, 820);
    const k = i === 0 ? on(2, line, v, 0.7) : 1;
    P("pc-than", 1300, 860, (620 + (i ? 80 : 0)) * k, { rot: 0.01 * Math.sin(ts * 2) });
    if (i === 0) { tag("CÂY ĐỔ", 300, 250, -0.02, on(0, line, v), 50); tag("CHỒNG LỚP", 700, 250, 0.02, on(1, line, v), 50); tag("THAN ĐÁ", 1150, 250, -0.02, on(2, line, v), 64); }
    if (i === 1) { sparkles(1300, 760, 260, ts, 10); tag("KỶ THAN ĐÁ", 300, 300, -0.02, on(1, line, v), 84); }
  } },
  { shots: ["k7", "k8"], draw(ts, i, u, line, v) {
    forest(ts, 22);
    const seen = i === 0 && line >= 1;
    const x = i === 0 ? 2500 - 1100 * sm(0, 5, u) : 1400 - 1900 * sm(0.5, 8, u);
    you(seen ? "pg-ban-so" : "pg-ban", 520, ts, { flip: i === 0 && !seen ? 1 : 0 });
    crawl("pg-arthro", "arthro", x, 905, 900, ts, 1);
    front(ts);
    if (i === 0) { tag("ARTHROPLEURA", 900, 240, -0.02, on(2, line, v), 70); tag("DÀI HƠN 2 M", 980, 390, 0.02, on(1, line, v), 50); }
    if (i === 1) tag("CHỈ ĂN THỰC VẬT MỤC", 760, 260, -0.02, on(0, line, v), 52);
  } },
  { shots: ["k9", "k10", "k11"], draw(ts, i, u, line, v) {
    back("pl-troi", ts, 36);
    [[160, 380], [520, 300], [1420, 320], [1780, 400]].forEach(([x, w], n) => P("pc-vay", x, 1900, w, { rot: 0.01 * Math.sin(ts + n) }));
    if (i < 2) for (let n = 0; n < 3; n++) { const a = ts * (0.7 + n * 0.15) + n * 2.1; mega(960 + (520 - n * 90) * Math.cos(a), 470 + (200 - n * 30) * Math.sin(a), 420 - n * 90, ts, Math.sin(a) > 0, n); }
    if (i === 0) { tag("MEGANEURA", 720, 160, -0.02, on(0, line, v), 70); tag("SẢI CÁNH 70 CM", 760, 760, 0.02, on(1, line, v), 50); }
    if (i === 1) [["KHÔNG CÓ PHỔI", 150, 240, 1], ["NHIỀU Ô XY → TO HƠN", 1080, 240, 2], ["CHƯA CÓ CHIM, DƠI", 620, 720, 3]].forEach(([text, x, y, n], j) => tag(text, x, y, j % 2 ? 0.02 : -0.02, on(n, line, v), 46));
    if (i === 2) {
      ground("#3a2a1c", 700); P("pc-bui", 960, 730, 2100); P("pc-dat", 960, 1010, 2300);
      for (let n = 0; n < 5; n++) P("pg-gian", (300 + n * 420 + 130 * ts * (n % 2 ? 1 : -1) + 4000) % 2200 - 100, 860 + (n % 3) * 50, 150, { rot: (n % 2 ? 1 : -1) * 1.57 + 0.1 * Math.sin(ts * 12 + n) });
      const k = on(1, line, v);
      tag("CHƯA CÓ MUỖI", 720, 330, -0.02, k, 76);
    }
  } },
  { shots: ["k12"], draw(ts, i, u, line, v) {
    back("pl-nuoc", ts, 12);
    [[260, 360], [620, 280], [1500, 400], [1750, 300]].forEach(([x, w], n) => P("pc-hue-bien", x, 1100, w, { rot: 0.05 * Math.sin(ts * 1.2 + n), shadow: 0 }));
    swim("pg-ca-map-bien", "caMapBien", -400 + 240 * ts, 480, 620, ts);
    swim("pg-ca-map", "caMap", 2300 - 200 * ts, 760, 420, ts, 1);
    tag("THỜI HOÀNG KIM CỦA CÁ MẬP", 560, 180, -0.02, on(1, line, v), 54);
    tag("HUỆ BIỂN", 1320, 620, 0.02, on(2, line, v), 46);
  } },
  { shots: ["k13"], draw(ts) {
    forest(ts, 12);
    P("pg-ban-ngoi", 900, FEET + 10, 190, { rot: 0.01 * Math.sin(ts * 1.5) });
    front(ts);
    mega(1700 - 60 * ts, 300, 150, ts, 1);
    sparkles(960, 450, 800, ts * 0.4, 14);
  } },
  { shots: ["n1", "n2"], draw(ts, i, u, line, v) {
    forest(ts, 16);
    swamp(ts, 780);
    const rise = i === 0 ? 0 : 150 * sm(0, 2.5, u) + (line === 2 ? 80 * sm(0, 0.5, v) : 0);
    crawl("pg-luong-cu", "luongCu", 1150 - (line === 2 && i ? 160 * sm(0, 0.6, v) : 0), 1050 - rise, 760, ts * 0.3, 1);
    swamp(ts, 900);
    for (let n = 0; n < 3; n++) { const k = (ts * 0.5 + n * 0.33) % 1; out.save(); out.globalAlpha = 1 - k; ring(1150, 930, 60 + 220 * k, 1); out.restore(); }
    you(i === 1 && line === 2 ? "pg-ban-so" : "pg-ban", 330, ts, { y: 880 });
    front(ts);
    if (i === 0) tag("DƯỚI NƯỚC", 760, 280, -0.02, on(1, line, v), 76);
    if (i === 1) tag("LƯỠNG CƯ TO NHƯ CÁ SẤU", 620, 240, -0.02, on(0, line, v, 0.8), 54);
  } },
  { shots: ["n3"], draw(ts, i, u, line, v) {
    back("pl-nuoc", ts, 12);
    swim("pg-ca-map", "caMap", 2500 - 300 * ts, 560, 1000, ts, 1);
    for (let n = 0; n < 8; n++) { const k = (ts * 0.3 + n * 0.13) % 1; out.save(); out.globalAlpha = 0.7 * (1 - k); out.strokeStyle = "#dff3f5"; out.lineWidth = 4; out.beginPath(); out.arc(200 + n * 230, 1000 - 900 * k, 8 + 10 * rnd(n, 3), 0, 7); out.stroke(); out.restore(); }
    tag("CÁ MẬP NƯỚC NGỌT", 150, 180, -0.02, on(0, line, v), 60);
    tag("DÀI 3 M", 200, 330, 0.02, on(0, line, v, 1.6), 60);
    tag("GAI SAU ĐẦU", 1300, 740, 0.02, on(1, line, v), 46);
  } },
  { shots: ["n4", "n5", "n6"], draw(ts, i, u, line, v) {
    forest(ts, 30);
    if (i === 0) {
      crawl("pg-bo-sat", "boSat", 300 + 60 * Math.sin(ts * 1.4), 900, 340, ts);
      const x = 2500 - 1200 * (line >= 2 ? sm(0, 3, v) : 0);
      crawl("pg-san-moi", "sanMoi", x, 905, 700, ts, 1);
      you(line >= 2 ? "pg-ban-so" : "pg-ban", 760, ts);
      tag("BÒ SÁT ĐẦU TIÊN", 160, 300, -0.02, on(0, line, v), 54);
      tag("DÀI BẰNG MỘT NGƯỜI", 1000, 300, 0.02, on(2, line, v, 2), 50);
    }
    if (i === 1) {
      crawl("pg-bo-sat", "boSat", 420, 900, 380, ts);
      const k = pop(0.4, u);
      card(1200, 470, 560, 540, k); P("pc-trung", 1200, 690, 440 * k, { shadow: 0 });
      sparkles(1200, 420, 240, ts, 8);
      tag("TRỨNG CÓ VỎ", 960, 130, -0.02, on(0, line, v, 1.5), 64);
      tag("SINH SẢN XA NƯỚC", 980, 820, 0.02, on(1, line, v), 46);
    }
    if (i === 2) {
      crawl("pg-bo-sat", "boSat", 760, 900, 400, ts);
      you("pg-ban", 1180, ts, { flip: 1 });
      out.save(); out.strokeStyle = "#f6c453"; out.lineWidth = 9; out.setLineDash([20, 16]); out.beginPath(); out.moveTo(820, 660); out.quadraticCurveTo(1000, 480, 1160, 640); out.stroke(); out.restore();
      tag("TỔ TIÊN XA CỦA THÚ", 620, 300, -0.02, on(0, line, v), 54);
      tag("HỌ HÀNG CỦA BẠN", 900, 440, 0.02, on(1, line, v), 54);
    }
    front(ts);
  } },
  { shots: ["n7", "n8"], draw(ts, i, u, line, v) {
    const lit = i === 0 ? (line < 2 ? 0 : sm(0.4, 3, v)) : 1;
    out.save(); jolt(4 * lit);
    back("pl-bao", ts, 20);
    fade("pl-lua", ts, 20, lit);
    P("pc-may", 1250, 420, 760, { shadow: 0, alpha: 1 - 0.6 * lit });
    tree("pc-vay", 250, 220, ts, 1); tree("pc-moc-tac", 640, 160, ts, 2); tree("pc-vay", 1250, 200, ts, 3); tree("pc-duong-xi", 1640, 320, ts, 4);
    P("pc-bui", 960, GROUND + 30, 2100); soil();
    if (lit) [[1250, 380], [900, 300], [1600, 340], [500, 280], [200, 320]].forEach(([x, w], n) => flame(x, GROUND + 30, w * sm(n * 0.15, n * 0.15 + 0.5, lit + (i ? 1 : 0)), ts, n));
    out.restore();
    if (lit) { night("#ffb890"); if (i === 1) shards(960, 700, (ts % 1.2) * 0.6, 14, FIRE); }
    if (i === 0 && line === 2) flash(1 - v / 0.5);
    if (i === 0) { tag("30% Ô XY", 200, 220, -0.02, on(1, line, v), 70); tag("= RẤT DỄ CHÁY", 240, 370, 0.02, on(1, line, v, 1.5), 54); }
    if (i === 1) tag("CHÁY RỪNG THƯỜNG XUYÊN", 520, 220, -0.02, pop(0.6, u), 56);
  } },
  { shots: ["n9"], draw(ts, i, u, line, v) {
    const dark = line === 2 ? sm(0, 2, v) : 0;
    forest(ts, 12);
    fade("pl-dem", ts, 12, dark);
    if (dark) { tree("pc-vay", 250, 200, ts, 1); tree("pc-vay", 1250, 180, ts, 3); tree("pc-duong-xi", 1640, 300, ts, 4); P("pc-bui", 960, GROUND + 30, 2100); soil(); }
    P("pg-ban-ngoi", 900, FEET + 10, 200, { rot: 0.012 * Math.sin(ts * 1.5) });
    if (line < 2) tears(900, 700, ts);
    front(ts);
    if (dark) { night(`rgb(${255 - 150 * dark},${255 - 130 * dark},${255 - 70 * dark})`); mega(600 + 80 * ts, 320, 160, ts, 0, 1); mega(1500 - 70 * ts, 420, 130, ts, 1, 2); }
    tag("NÓNG ẨM", 1150, 280, -0.02, on(0, line, v) * (1 - dark), 70);
  } },
  { shots: ["s1", "s2"], draw(ts, i, u, line, v) {
    forest(ts, 20);
    if (i === 1) { P("pc-suoi", 1400, 960, 620 * on(2, line, v, 0.6)); if (line >= 2) rain(ts, 50); }
    you("pg-ban", i === 0 ? 960 : 960 - 300 * sm(0, 2, u), ts, { w: 170 });
    front(ts);
    if (i === 0) tag("SINH TỒN THẾ NÀO?", 560, 260, -0.02, pop(0.3, u), 76);
    if (i === 1) { tag("1. NƯỚC", 150, 180, -0.02, on(0, line, v), 64); tag("NƯỚC ĐẦM: KHÔNG UỐNG", 150, 320, 0.02, on(1, line, v), 42); tag("NƯỚC MƯA, NƯỚC SUỐI", 1080, 240, -0.02, on(2, line, v), 46); tag("ĐUN SÔI", 1200, 380, 0.02, on(3, line, v), 54); }
  } },
  { shots: ["s3"], draw(ts, i, u, line, v) {
    back("pl-troi", ts, 12);
    tree("pc-vay", 180, 200, ts, 1, 0.85); tree("pc-duong-xi", 1750, 300, ts, 4, 0.9);
    soil();
    P("pc-bep", 1000, 950, 300 * pop(0.4, u));
    P("pg-ban-ngoi", 660, FEET + 20, 200);
    ring(1000, 860, 330, on(2, line, v, 0.8));
    tag("2. LỬA", 150, 180, -0.02, on(0, line, v), 64);
    tag("DỄ NHÓM, KHÓ GIỮ", 1180, 260, 0.02, on(1, line, v), 46);
    tag("ĐẤT TRỐNG, XA CÂY KHÔ", 1100, 420, -0.02, on(2, line, v, 1.2), 46);
  } },
  { shots: ["s4", "s5"], draw(ts, i, u, line, v) {
    forest(ts, 22);
    if (i === 0) {
      you("pg-ban", 380, ts, { w: 170 });
      [[760, "pc-duong-xi", 250], [1100, "pc-moc-tac", 120], [1440, "pc-bui", 290]].forEach(([x, name, w], n) => { const k = on(2, line, v, 0.3 + n * 0.5); card(x, 480, 320, 440, k); P(name, x, 660, w * k, { shadow: 0 }); tag("?", x + 60, 300, 0.05, k, 70); });
      tag("3. THỨC ĂN", 150, 180, -0.02, on(0, line, v), 64);
      tag("KHÔNG TRÁI CÂY, KHÔNG LÚA GẠO", 620, 180, 0.01, on(1, line, v) * (line === 1 ? 1 : 0), 44);
    } else {
      P("pc-bep", 960, 950, 320);
      P("pg-ban-ngoi", 620, FEET + 20, 200);
      mega(1000, 560, 260 * on(1, line, v), ts * 0.1, 0);
      swim("pg-ca-map", "caMap", 1450, 620, 300 * on(0, line, v, 0.8), ts * 0.2);
      tag("ĐẠM: CÁ + CÔN TRÙNG", 1050, 240, -0.02, on(0, line, v), 50);
    }
    front(ts);
  } },
  { shots: ["s6", "s7"], draw(ts, i, u, line, v) {
    const storm = i === 1 ? sm(0, 3, u) : 0;
    back("pl-troi", ts, 22);
    fade("pl-bao", ts, 22, storm);
    if (storm) P("pc-may", 1350, 380, 700, { shadow: 0, alpha: storm });
    out.fillStyle = "#4a3a22"; out.beginPath(); out.moveTo(0, 1080); out.lineTo(0, 900); out.quadraticCurveTo(960, 560, 1920, 900); out.lineTo(1920, 1080); out.fill();
    tree("pc-duong-xi", 300, 260, ts, 1); tree("pc-vay", 1700, 200, ts, 2);
    P("pc-leu", 1000, 800, 560 * (i === 0 ? on(2, line, v, 0.6) : 1));
    P(i === 1 ? "pg-ban-ngoi" : "pg-ban", i === 1 ? 1000 : 600, i === 1 ? 800 : 830, i === 1 ? 170 : 160, { rot: 0.012 * Math.sin(ts * 2) });
    if (storm) { rain(ts); if (line === 2) flash(0.8 - v); night(`rgb(${255 - 70 * storm},${255 - 60 * storm},${255 - 30 * storm})`); }
    if (i === 0) { tag("4. CHỖ Ở", 150, 180, -0.02, on(0, line, v), 64); tag("ĐẤT CAO, KHÔ RÁO", 1150, 200, 0.02, on(1, line, v), 46); tag("MÁI LÁ DƯƠNG XỈ", 1200, 340, -0.02, on(2, line, v, 1), 46); }
    if (i === 1) tag("MƯA GIÔNG + SÉT", 150, 220, -0.02, on(1, line, v), 56);
  } },
  { shots: ["e1", "e2", "e3"], draw(ts, i, u, line, v) {
    forest(ts, 30);
    you(i === 2 ? "pg-ban-ngoi" : "pg-ban", 960, ts, { w: 190 });
    front(ts);
    if (i === 2) night("#c3c9e0");
    if (i === 0) tag("CON NGƯỜI CÓ SỐNG NỔI?", 470, 260, -0.02, pop(0.3, u), 70);
    if (i === 1) { tag("THỞ: ĐƯỢC ✓", 250, 240, -0.02, on(0, line, v), 60); tag("VÀI TUẦN: XOAY XỞ ĐƯỢC ✓", 1060, 340, 0.02, on(2, line, v), 46); }
    if (i === 2) { tag("LÂU DÀI: RẤT KHÓ", 620, 160, -0.02, on(0, line, v), 64); [["LƯƠNG THỰC ✗", 180, 0.3], ["THUỐC MEN ✗", 760, 1.6], ["ĐỒNG LOẠI ✗", 1300, 2.9]].forEach(([text, x, d]) => tag(text, x, 380, 0.02, on(1, line, v, d), 48)); }
  } },
  { shots: ["e4", "e4b"], draw(ts, i, u, line, v) {
    const dry = i === 1 ? sm(2, 9, u) : 0;
    forest(ts, 22, "pl-troi");
    if (dry) { out.save(); out.globalAlpha = 0.5 * dry; out.fillStyle = "#d9b36a"; out.fillRect(0, 0, OW, OH); out.restore(); }
    swamp(ts, 900 + 120 * dry);
    crawl("pg-luong-cu", "luongCu", 420, 905, 520, ts * 0.4, 0);
    crawl("pg-arthro", "arthro", 1300 - 30 * ts, 900, 620, ts, 1);
    mega(960 + 300 * Math.cos(ts * 0.8), 380 + 90 * Math.sin(ts * 0.8), 360, ts, Math.sin(ts * 0.8) > 0);
    if (i === 1) crawl("pg-bo-sat", "boSat", 960, 890, 380 * on(2, line, v, 2.5), ts);
    front(ts);
    if (i === 0) tag("THẾ GIỚI CỦA CÔN TRÙNG KHỔNG LỒ", 420, 180, -0.02, on(1, line, v), 52);
    if (i === 1) { tag("KHÍ HẬU KHÔ DẦN", 200, 200, -0.02, on(1, line, v), 54); tag("BÒ SÁT LÊN NGÔI", 1100, 240, 0.02, on(2, line, v, 2.5), 54); }
  } },
  { shots: ["e5"], draw(ts, i, u, line, v) {
    back("pl-troi", ts, 12);
    P("pc-bui", 960, GROUND + 30, 2100); soil();
    P("pc-than", 520, 870, 560 * pop(0.3, u), { rot: 0.01 * Math.sin(ts * 2) });
    if (line >= 1) { flame(520, 520, 180 * on(1, line, v), ts); sparkles(520, 500, 220, ts, 8); }
    const k = on(2, line, v);
    crawl("pg-bo-sat", "boSat", 1180, 890, 320 * k, ts);
    P("pg-ban", 1620, FEET, 170 * on(2, line, v, 2));
    if (k) { out.save(); out.globalAlpha = Math.min(1, k); out.strokeStyle = "#f6c453"; out.lineWidth = 10; out.setLineDash([22, 16]); out.beginPath(); out.moveTo(1320, 780); out.lineTo(1500, 780); out.stroke(); out.restore(); }
    tag("THAN ĐÁ → CÁCH MẠNG CÔNG NGHIỆP", 150, 180, -0.02, on(1, line, v), 44);
    tag("BÒ SÁT NHỎ → LOÀI NGƯỜI", 1060, 320, 0.02, on(2, line, v, 2), 44);
  } },
  { shots: ["kết"], draw(ts) {
    forest(ts, 12);
    rays(960, 500, ts);
    you("pg-ban", 960, ts, { w: 190 });
    front(ts);
    mega(500 + 60 * Math.sin(ts), 620, 260, ts, 0, 1); mega(1450 - 60 * Math.sin(ts), 640, 220, ts, 1, 2);
    sparkles(960, 500, 700, ts, 12);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, card: ["Nếu bạn thức dậy cách đây", "300 TRIỆU NĂM", ""] });
