// The paper-cut scenes of Sơn Tinh Thủy Tinh. The engine is giay/may.js; the layers are listed in anh.js.
const PLATES = ["pl-troi", "pl-chieu", "pl-cung", "pl-bao"];
const CUTS = ["pc-song", "pc-dat", "pc-nui", "pc-nui-cao", "pc-leu", "pc-voi", "pc-ga", "pc-ngua", "pc-may",
  "pg-vua", "pg-mi-nuong", "pg-son", "pg-son-danh", "pg-thuy", "pg-thuy-gian"];
// which way the generated pieces face, found by looking at them: 1 means the piece faces left as generated
const LEFT = { voi: 1, ga: 0, ngua: 1, danh: 0 };

const ocean = (t, top) => { sea("pc-song", 540 - 30 * Math.sin(t * 0.8 + 1), top + 8 * Math.sin(t * 1.7), 1560); sea("pc-song", 540 + 34 * Math.sin(t * 0.9), top + 330 + 8 * Math.sin(t * 1.5 + 2), 1700, { flip: 1 }); };
const land = (sky, t, total) => { plate(sky, t, total, 0); P("pc-nui", 540, 1240, 1300, { shadow: 0 }); ground("#a98a4e", 1560); P("pc-dat", 540, 1690, 1400); };
// the generated hall has a pale border: draw it enlarged so the border falls outside the frame
const hall = (t, total) => { out.save(); out.translate(540, 960); out.scale(1.14, 1.14); out.translate(-540, -960); plate("pl-cung", t, total, 0.5); out.restore(); ground("#5a3320", 1620); };
const beast = (name, key, x, y, w, t, left = 0) => P(name, x, y + hop(t + x, 5, 10), w, { flip: left !== LEFT[key] });
function rain(t, n = 70) {
  out.save(); out.strokeStyle = "#cfe3f5"; out.lineWidth = 4; out.globalAlpha = 0.55;
  for (let i = 0; i < n; i++) {
    const x = rnd(i, 41) * 1300 - 100, y = (rnd(i, 42) * OH + t * (1500 + 500 * rnd(i, 43))) % OH;
    out.beginPath(); out.moveTo(x, y); out.lineTo(x - 22, y + 70); out.stroke();
  }
  out.restore();
}
const clouds = (t) => { P("pc-may", 300 + 40 * Math.sin(t * 0.6), 520, 620, { shadow: 0 }); P("pc-may", 840 - 40 * Math.sin(t * 0.5), 400, 560, { flip: 1, shadow: 0 }); };
function sheet(x, y, w, h, k) {
  if (k <= 0) return;
  out.save(); out.translate(x, y); out.scale(k, k);
  out.shadowColor = "rgba(40,20,10,.5)"; out.shadowBlur = 18; out.shadowOffsetY = 10;
  out.fillStyle = "#fbf3df"; out.fillRect(-w / 2, -h / 2, w, h);
  out.shadowColor = "transparent"; out.lineWidth = 6; out.strokeStyle = "#2a1608"; out.strokeRect(-w / 2, -h / 2, w, h);
  out.restore();
}
// the mountain with Sơn Tinh on its top; `up` lifts both
function peak(x, up, w, t, who = "pg-son-danh") {
  const base = 1900 - up, top = base - tall("pc-nui-cao", w);
  P("pc-nui-cao", x, base, w);
  P(who, x, top + 70 + hop(t, 5, 10), 250, { flip: who === "pg-son-danh" && LEFT.danh });
}

const SCENES = [
  { shots: ["hook"], draw(ts) {
    plate("pl-bao", ts, 5, 0);
    clouds(ts);
    P("pc-nui", 540, 1200, 1300, { shadow: 0 });
    const rise = 260 * sm(0, 4.5, ts);
    P("pc-leu", 300, 1500, 340, { rot: 0.03 * Math.sin(ts * 2) }); P("pc-leu", 800, 1560, 300, { rot: -0.03 * Math.sin(ts * 2.3) });
    ocean(ts, 1520 - rise);
    rain(ts);
    tag("MÙA LŨ", 380, 640, -0.03, pop(1.2, ts), 70);
  } },
  { shots: ["1", "2"], draw(ts, i, u) {
    hall(ts, 8);
    const back = i === 1 ? sm(0, 1, u) : 0;
    P("pg-vua", 330 + 90 * back, 1790 - 260 * back + 900 * (1 - pop(0.3, ts, 0.5)), 330 - 80 * back);
    P("pg-mi-nuong", 760 - 100 * back, 1790 - 260 * back + 900 * (1 - pop(0.8, ts, 0.5)), 230 - 50 * back, { rot: 0.02 * Math.sin(ts * 2) });
    if (i === 0) { tag("VUA HÙNG", 150, 1000, -0.03, pop(1.0, u)); tag("MỊ NƯƠNG", 620, 1060, 0.03, pop(1.6, u)); }
    if (i === 1) {
      P("pg-son", -300 + 480 * sm(0.3, 1.4, u), 1810, 320);
      P("pg-thuy", 1380 - 480 * sm(0.9, 2, u), 1810, 320);
      tag("CẦU HÔN", 390, 520, -0.03, pop(1.8, u), 60);
    }
  } },
  { shots: ["3"], draw(ts) {
    plate("pl-troi", ts, 5, 0);
    P("pc-nui", 540, 1240, 1300, { shadow: 0 });
    [[700, 0.8, 520], [960, 1.7, 400], [480, 2.6, 340]].forEach(([x, at, w]) => P("pc-nui-cao", x, 2500 - 880 * sm(at, at + 1.2, ts), w));
    ground("#a98a4e", 1560); P("pc-dat", 540, 1690, 1400);
    P("pg-son", 230, 1800 + hop(ts, 4, 14), 340);
    tag("SƠN TINH", 60, 520, -0.03, pop(0.4, ts), 60); tag("CHÚA NON CAO", 120, 650, 0.02, pop(1.2, ts), 40);
  } },
  { shots: ["4"], draw(ts) {
    plate("pl-bao", ts, 5, 0);
    clouds(ts);
    ocean(ts, 1250 - 120 * sm(0.5, 4, ts));
    P("pg-thuy", 800, 1800 + 10 * Math.sin(ts * 3), 340);
    ocean(ts, 1700);
    rain(ts - 0.8, 50);
    tag("THỦY TINH", 520, 640, 0.03, pop(0.4, ts), 60); tag("CHÚA NƯỚC THẲM", 440, 770, -0.02, pop(1.2, ts), 40);
  } },
  { shots: ["5", "6", "7"], draw(ts, i, u) {
    hall(ts, 12);
    P("pg-vua", 540, 1620 + (i === 1 ? hop(u, 6, 18) : 0), 300);
    P("pg-son", 200, 1810, 300, { rot: 0.02 * Math.sin(ts * 2) });
    P("pg-thuy", 880, 1810, 300, { rot: 0.02 * Math.sin(ts * 2 + 1) });
    if (i === 0) { tag("?", 500, 1060, 0, pop(0.8, u), 90); }
    if (i === 1) tag("AI ĐẾN TRƯỚC?", 280, 520, -0.03, pop(1.6, u), 54);
    if (i === 2) {
      [[540, 470, 0.2, "pc-voi", "voi", 420, "9 NGÀ"], [300, 900, 1.3, "pc-ga", "ga", 240, "9 CỰA"], [780, 900, 2.3, "pc-ngua", "ngua", 330, "9 HỒNG MAO"]].forEach(([x, y, at, name, key, w, label]) => {
        const k = pop(at, u);
        sheet(x, y, 440, 400, k);
        P(name, x, y + 150, w * k, { flip: LEFT[key], shadow: 0 });
        tag(label, x - 150, y + 215, -0.02, pop(at + 0.3, u), 36);
      });
    }
  } },
  { shots: ["8", "9"], draw(ts, i, u) {
    land("pl-chieu", ts, 8);
    rays(540, 560, ts);
    if (i === 0) {
      const come = sm(0, 2.6, ts);
      P("pg-vua", 900, 1790, 300);
      beast("pc-voi", "voi", -520 + 780 * come, 1560, 420, ts);
      P("pg-son", -300 + 780 * come, 1810 + hop(ts, 5, 14), 320);
      beast("pc-ngua", "ngua", -760 + 780 * come, 1820, 300, ts);
      beast("pc-ga", "ga", -80 + 780 * come, 1840, 150, ts);
      tag("ĐẾN TRƯỚC!", 330, 520, -0.03, pop(2.6, ts), 60);
    } else {
      const go = sm(0, 3.5, u);
      P("pc-nui-cao", 900, 1580, 460);
      P("pg-son", 300 + 330 * go, 1810 + hop(ts, 5, 14), 320 - 90 * go);
      P("pg-mi-nuong", 520 + 300 * go, 1810 + hop(ts + 0.4, 5, 12), 220 - 60 * go);
      confetti(ts, ["#f6a0a0", "#f2c14e", "#fbf3df", "#c8402f"]);
    }
  } },
  { shots: ["10", "11"], draw(ts, i, u) {
    out.save(); if (i === 1) jolt(7 * sm(0, 0.5, u));
    plate("pl-bao", ts, 8, 0);
    clouds(ts);
    P("pc-nui", 540, 1240, 1300, { shadow: 0 });
    ocean(ts, 1300 - (i === 1 ? 220 * sm(0, 3, u) : 0));
    if (i === 0) P("pg-thuy", 1300 - 760 * sm(0, 1.4, ts), 1800, 360);
    else P("pg-thuy-gian", 540, 1810 + hop(u, 9, 20), 480);
    ocean(ts, 1720);
    out.restore();
    if (i === 0) tag("ĐẾN SAU", 380, 640, -0.03, pop(1.5, u), 60);
    if (i === 1) { rain(u); tag("DÂNG NƯỚC!", 330, 560, -0.03, pop(0.6, u), 64); }
  } },
  { shots: ["12"], draw(ts) {
    plate("pl-bao", ts, 5, 0);
    clouds(ts);
    P("pc-nui", 540, 1200, 1300, { shadow: 0 });
    ground("#8a7a48", 1500);
    P("pc-leu", 280, 1520, 360, { rot: 0.04 * Math.sin(ts * 2) }); P("pc-leu", 820, 1600, 320, { rot: -0.04 * Math.sin(ts * 2.3) });
    ocean(ts, 1640 - 420 * sm(0, 4.5, ts));
    rain(ts, 90);
  } },
  { shots: ["13", "14"], draw(ts, i, u) {
    const calm = i === 1 ? sm(1.5, 4.5, u) : 0;
    plate("pl-bao", ts, 10, 0);
    if (calm) { out.save(); out.globalAlpha = calm; plate("pl-troi", ts, 10, 0); out.restore(); }
    if (calm < 1) { out.save(); out.globalAlpha = 1 - calm; clouds(ts); out.restore(); }
    const up = 520 * sm(0.3, 3.5, ts), water = 420 * sm(0, 3, ts) * (1 - calm);
    peak(330, up, 620, ts);
    ocean(ts, 1500 - water);
    P("pg-thuy-gian", 830 + 500 * calm, 1660 - water + 300 * calm + hop(ts, 8, 16), 330 - 120 * calm, { rot: 0.5 * calm });
    ocean(ts, 1780 - water * 0.7);
    if (calm < 0.5) rain(ts);
    if (i === 0) tag("NÂNG NÚI!", 80, 420, -0.03, pop(1.2, u), 60);
    if (i === 1) tag("RÚT QUÂN", 560, 640, 0.03, pop(3.2, u), 56);
  } },
  { shots: ["15", "16"], draw(ts, i, u) {
    plate(i === 0 ? "pl-bao" : "pl-troi", ts, 7, 0);
    if (i === 0) clouds(ts);
    const water = i === 0 ? 380 * sm(0, 3, u) : 380 * (1 - sm(0, 1.6, u));
    peak(540, 260, 700, ts, i === 0 ? "pg-son-danh" : "pg-son");
    ocean(ts, 1560 - water);
    if (i === 0) { rain(ts); tag("NĂM NÀO CŨNG VẬY", 200, 330, -0.03, pop(1.2, u), 48); }
    if (i === 1) { rays(540, 500, ts); tag("THUA!", 400, 330, -0.04, pop(0.5, u), 80); }
  } },
  { shots: ["17"], draw(ts) {
    land("pl-chieu", ts, 6);
    rays(540, 560, ts);
    P("pc-leu", 260, 1640, 340); P("pc-leu", 780, 1660, 300);
    out.fillStyle = "#7a5a34"; out.beginPath(); out.moveTo(0, 1920); out.lineTo(0, 1790); out.quadraticCurveTo(540, 1720, 1080, 1790); out.lineTo(1080, 1920); out.fill();
    tag("ĐẮP ĐÊ GIỮ LÀNG", 200, 640, -0.03, pop(2, ts), 56);
  } },
  { shots: ["kết"], draw(ts) {
    land("pl-chieu", ts, 6);
    rays(540, 560, ts);
    P("pc-nui-cao", 540, 1600, 620);
    P("pg-son", 330, 1800, 310); P("pg-mi-nuong", 760, 1800, 220);
    sparkles(540, 1300, 380, ts, 10);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, card: ["Truyền thuyết", "SƠN TINH", "THỦY TINH"] });
