// The paper-cut scenes of "Surviving the Ice Age in a mammoth-bone house", restyled on 2026-11-23 after the paper-cut
// short the user sent as the reference. The engine is giay/may.js with look "storybook": yellow captions in short
// chunks, torn cream sheets, black bands and an iris between the scenes, paper labels, and every cut-out glued on
// white paper. The staging still follows the user's six-part outline: the frozen world and the struggle (hook-2),
// the bone house and the animal it came from (3-4), building it (5-6), the family by the fire inside (7), the small
// entrance and the smoke hole (8), the wide dusk shot (9-kết).
// The cartoon cut before this one held every shot still (asked for on 2026-11-22; it is in git history, 50ef86d).
// The reference keeps its paper alive, so this cut does too: a slow push-in, falling snow, wind, cut-outs that walk,
// smoke, and labels that pop in with the words. It is still only paper that slides, turns and pops.
// Layout: the painted landscapes (pl-canh-*) carry the sky and the whole snowfield down to the bottom edge, as the
// reference fills its frame. The plain begins at about 1170 px, so standing figures keep their feet on G and the
// captions (1250-1415 px) fall on the snow in front of them; everything a label points at sits between 640 and 1250 px.
const PLATES = ["pl-canh-bao", "pl-canh-nang", "pl-canh-chieu", "pl-trong"];
const CUTS = ["pc-nha", "pc-khung", "pc-xuong", "pg-nhom", "pg-run", "pg-nang", "pg-keo", "pg-mamut"];
// which way the generated pieces face, found by looking at them: 1 means the piece faces left as generated
const LEFT = { nhom: 0, run: 1, nang: 0, keo: 1, mamut: 1 };
// flip a piece so it faces the way the scene needs
const F = (key, wantLeft) => (LEFT[key] ? !wantLeft : !!wantLeft);
const G = 1215; // the ground line: where the feet of a standing figure go, a little below the foot of the far hills
// the entrance of the hut cut-out, measured on the keyed piece: from its bottom centre a tenth of its width to the
// left and a fifth of its width up
const DOOR = [-0.105, 0.2];
const wrap = (v, m) => ((v % m) + m) % m;

// paper snowflakes falling, k = how hard it snows (0..1). The wind blows from the right, into the face of anyone
// walking right, which is the way the family walks
function snow(t, k = 1) {
  for (let i = 0; i < 90; i++) {
    if (rnd(i, 41) > k) continue;
    const sp = 200 + 300 * rnd(i, 42), drift = 120 + 220 * rnd(i, 43);
    const y = wrap(rnd(i, 44) * (OH + 80) + t * sp, OH + 80) - 40;
    const x = wrap(rnd(i, 45) * (OW + 600) - t * drift, OW + 600) - 300;
    const r = 8 + 14 * rnd(i, 47);
    out.save();
    out.globalAlpha = 0.8 + 0.2 * rnd(i, 46);
    out.shadowColor = "rgba(30,20,50,.35)"; out.shadowBlur = 5; out.shadowOffsetX = 3; out.shadowOffsetY = 4;
    out.fillStyle = "#fbfaf6";
    out.beginPath();
    for (let j = 0; j < 12; j++) { const a = j * Math.PI / 6 + i, q = j % 2 ? r * 0.55 : r; out.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); }
    out.closePath(); out.fill();
    out.restore();
  }
}

// slanting streaks of wind-blown snow sweeping from right to left across the sky
function gust(t, k = 1) {
  out.save();
  out.lineCap = "round"; out.strokeStyle = "#f2f0e8";
  for (let i = 0; i < 16; i++) {
    const ph = wrap(t * (0.25 + 0.3 * rnd(i, 51)) + rnd(i, 52), 1), len = 120 + 260 * rnd(i, 53);
    const x = OW + 320 - ph * (OW + 900), y = 60 + rnd(i, 54) * 1120 + 30 * Math.sin(t * 0.8 + i);
    out.globalAlpha = k * 0.7 * Math.sin(Math.PI * ph);
    out.lineWidth = 4 + 5 * rnd(i, 55);
    out.beginPath(); out.moveTo(x, y); out.lineTo(x + len, y - len * 0.45); out.stroke();
  }
  out.restore();
}

// paper puffs of smoke leaving a hole: flat grey-cream discs that rise, lean with the wind and fade
function smoke(x, y, t, k = 1) {
  for (let i = 0; i < 8; i++) {
    const p = wrap(t * 0.2 + i / 8, 1), r = 12 + 42 * p;
    out.save();
    out.globalAlpha = k * 0.92 * Math.min(1, 8 * p) * (1 - sm(0.72, 1, p));
    out.shadowColor = "rgba(20,12,30,.3)"; out.shadowBlur = 8; out.shadowOffsetX = 5; out.shadowOffsetY = 7;
    out.fillStyle = i % 2 ? "#eceae4" : "#dcd9d2";
    out.beginPath(); out.arc(x - 70 * p + 12 * Math.sin(t * 1.1 + i * 2.4) * p, y - 380 * p, r, 0, 7); out.fill();
    out.restore();
  }
}

// a warm pool of firelight, breathing a little
const glow = (x, y, r, a = 0.5, t = 0) => {
  const k = a * (1 + 0.12 * Math.sin(t * 6.3) + 0.06 * Math.sin(t * 11));
  const g = out.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(255,200,110,${k})`); g.addColorStop(0.5, `rgba(255,170,80,${k * 0.45})`); g.addColorStop(1, "rgba(255,160,70,0)");
  out.fillStyle = g; out.fillRect(x - r, y - r, 2 * r, 2 * r);
};

// a tuft of dry grass: five blades of ochre and olive paper
function tuft(x, y, k, n) {
  if (k <= 0) return;
  out.save(); out.translate(x, y); out.scale(k, k);
  out.shadowColor = "rgba(40,20,10,.4)"; out.shadowBlur = 8; out.shadowOffsetY = 4;
  for (let j = 0; j < 5; j++) {
    const a = -Math.PI / 2 + (j - 2) * 0.38 + 0.1 * (rnd(n * 7 + j, 77) - 0.5), len = 34 + 26 * rnd(n * 7 + j, 78);
    out.fillStyle = j % 2 ? "#c9a44a" : "#8d9a4a";
    out.beginPath(); out.moveTo(-9, 0);
    out.quadraticCurveTo(Math.cos(a) * len * 0.5 - 14, Math.sin(a) * len * 0.6, Math.cos(a) * len, Math.sin(a) * len);
    out.quadraticCurveTo(Math.cos(a) * len * 0.5 + 14, Math.sin(a) * len * 0.6, 9, 0); out.fill();
  }
  out.restore();
}

// a cut-out that walks: v px/s toward dir (1 right, -1 left), a light bob and sway, turned to face the way it goes
const walk = (name, x0, y, w, t, v, dir = 1) =>
  P(name, x0 + dir * v * t, y + hop(t, 6.5, 7), w, { rot: 0.012 * Math.sin(t * 13), flip: F(name.slice(3), dir < 0) });

// the hide cover going up over the bone frame: the covered hut shows from the ground upwards behind a torn edge,
// with the rolled hem of the hide riding on that edge until the top is reached
function cover(k, x, y, w) {
  if (k <= 0) return;
  const top = y - k * tall("pc-nha", w), x0 = x - w / 2 - 20, dx = (w + 40) / 20, hem = [];
  for (let i = 0; i <= 20; i++) hem.push(top + 16 * (rnd(i, 86) - 0.5));
  out.save();
  out.beginPath(); out.moveTo(x0, y + 60); out.lineTo(x0, hem[0]);
  hem.forEach((h, i) => out.lineTo(x0 + i * dx, h)); out.lineTo(x0 + 20 * dx, y + 60); out.closePath(); out.clip();
  P("pc-nha", x, y, w);
  out.restore();
  out.save();
  out.globalAlpha = 1 - sm(0.86, 1, k);
  out.beginPath(); out.moveTo(x0, hem[0]); hem.forEach((h, i) => out.lineTo(x0 + i * dx, h));
  out.lineWidth = 18; out.lineCap = "round"; out.lineJoin = "round";
  out.shadowColor = "rgba(40,20,10,.5)"; out.shadowBlur = 12; out.shadowOffsetY = 8;
  out.strokeStyle = "#6b4a2b"; out.stroke();
  out.restore();
}

// the inside of the hut: the painted room (the one plate with the family in it) drawn large enough to crop the pale
// border the model paints on the sheet, with the fur bedding ending just above the captions; the tan floor in front
// is the room's own floor strip, mirrored again and again down to the bottom edge and growing darker toward the
// camera. The room pushes in slowly, the family staying put
function trong(t) {
  const img = L["pl-trong"], s = (OW / img.width) * (1.1 + 0.04 * sm(0, 6, t)), left = (OW - img.width * s) / 2, base = 1245, h = 120 * s;
  out.fillStyle = "#2a1a10"; out.fillRect(0, 0, OW, OH);
  const top = base - 1330 * s;
  out.drawImage(img, 0, 0, img.width, 1490, left, top, img.width * s, 1490 * s);
  for (let y = top + 1490 * s, flip = 1; y < OH; y += h, flip = !flip) {
    out.save(); out.translate(0, flip ? y + h : y); if (flip) out.scale(1, -1);
    out.drawImage(img, 24, 1350, 840, 120, left + 24 * s, 0, 840 * s, h);
    out.restore();
  }
  const g = out.createLinearGradient(0, base + 60, 0, OH);
  g.addColorStop(0, "rgba(24,13,8,0)"); g.addColorStop(1, "rgba(24,13,8,.88)");
  out.fillStyle = g; out.fillRect(0, base + 60, OW, OH - base - 60);
}

// a scene serves one or more shots in a row: ts = seconds since the scene began, i = which of its shots, u = seconds into that shot
const SCENES = [
  // the frozen world: the storm, the bone house ahead with smoke, the family small in the snow, the title over them
  { shots: ["hook"], draw(ts) {
    plate("pl-canh-bao", ts, 4.3);
    smoke(790, G + 8 - tall("pc-nha", 470), ts, 0.8);
    P("pc-nha", 790, G + 8, 470);
    walk("pg-nhom", 140, G, 360, ts, 26);
    chip(["KỶ BĂNG HÀ", "20.000 NĂM TRƯỚC"], 540, 400, pop(0.4, ts));
    gust(ts, 1); snow(ts, 1);
  } },

  // the family mid-stride through the storm, into the wind, crossing the frame
  { shots: ["1"], cut: "sheet", draw(ts) {
    plate("pl-canh-bao", ts, 4.8);
    walk("pg-nhom", 150, G, 640, ts, 85);
    gust(ts, 1); snow(ts, 1);
  } },

  // stopped and freezing, the whole cut-out trembling, and nothing modern: three labels pop in over her
  { shots: ["2"], cut: "band", draw(ts) {
    plate("pl-canh-bao", ts, 4.8);
    const j = Math.sin(ts * 23);
    P("pg-run", 540 + 3 * j, G + 1.5 * Math.sin(ts * 31), 250, { rot: 0.012 * j, flip: F("run", false) });
    chip("KHÔNG CÓ NHÀ BÊ TÔNG", 540, 250, pop(0.25, ts), { size: 40 });
    chip("KHÔNG CÓ MÁY SỞI", 540, 345, pop(1.4, ts), { size: 40 });
    chip("KHÔNG CÓ QUẦN ÁO HIỆN ĐẠI", 540, 440, pop(2.6, ts), { size: 40 });
    gust(ts, 1); snow(ts, 1);
  } },

  // the reveal: the storm breaks, the bone house stands ahead of them
  { shots: ["3"], cut: "sheet", draw(ts) {
    plate("pl-canh-nang", ts, 3.8);
    smoke(640, G + 8 - tall("pc-nha", 620), ts, 0.7);
    P("pc-nha", 640, G + 8, 620);
    walk("pg-nhom", 200, G, 330, ts, 20);
    chip(["MỘT CÁCH", "SINH TỒN"], 540, 690, pop(1.5, ts), { size: 46 });
    snow(ts, 0.35);
  } },

  // the animal the bones came from: a mammoth walks past behind the house, from the left
  { shots: ["4"], cut: "band", draw(ts) {
    plate("pl-canh-nang", ts, 4.4);
    const mx = -300 + 250 * ts;
    P("pg-mamut", mx, G + 8, 660, { flip: F("mamut", false) });
    P("pc-nha", 830, G + 8, 500);
    chip("VOI MA MÚT", Math.min(mx + 200, 420), 700, pop(0.9, ts), { size: 46 });
    snow(ts, 0.3);
  } },

  // building it: the bare bone frame with its labels and a carrier bringing a bone behind it (shot 5), then the hide
  // cover rises over the frame while the hide carriers hold up their hides and grass goes round the foot (shot 6).
  // The frame is drawn mirrored, so that its skull is on the right and the carrier has the ribs to walk behind. It
  // stands a little behind the ground line and the covered hut a little in front of it: the hut has to be wider and
  // taller than the frame it hides, and its foot must still stay above the captions
  { shots: ["5", "6"], cut: "sheet", draw(ts, i, u) {
    plate("pl-canh-nang", ts, 10.5);
    const t6 = i ? ts - u : 99, lab = 1 - sm(t6 - 0.1, t6 + 0.3, ts); // t6 = when shot 6 began
    walk("pg-nang", -280, G, 280, ts, 200);
    P("pc-khung", 560, G - 14, 460, { flip: true });
    P("pc-xuong", 960, G + 14, 150);
    cover(sm(t6 + 0.5, t6 + 2.6, ts), 560, G + 30, 570);
    P("pg-keo", 185, G + 20, 300 * pop(t6 + 2.2, ts), { flip: F("keo", false) });
    P("pg-keo", 935, G + 20, 300 * pop(t6 + 2.35, ts), { flip: F("keo", true) });
    for (let k = 0; k < 6; k++) tuft(340 + k * 88, G + 34, pop(t6 + 3.0 + k * 0.12, ts), k);
    chip("HỘP SỌ", 942, 1090, pop(0.4, ts) * lab, { size: 42 });
    chip("XƯƠNG SỜN", 240, 780, pop(1.1, ts) * lab, { size: 44 });
    chip("NGÀ VOI", 920, 880, pop(1.8, ts) * lab, { size: 44 });
    snow(ts, 0.3);
  } },

  // inside: the family around the fire, fur clothes, fur bedding, warm light. The iris closes on the covered hut
  // and opens on the fire
  { shots: ["7"], cut: "iris", iris: [537, 1000], draw(ts) {
    trong(ts);
    glow(537, 1000, 620, 0.28, ts);
  } },

  // the details: a close-up of the hut, the firelight in its small entrance and the smoke leaving the roof
  { shots: ["8"], cut: "band", draw(ts) {
    plate("pl-canh-bao", ts, 5.6);
    const w = 1250 + 40 * sm(0, 5.6, ts), h = tall("pc-nha", w);
    P("pc-nha", 540, 1900, w);
    const ex = 540 + DOOR[0] * w, ey = 1900 - DOOR[1] * w;
    glow(ex, ey, 190, 0.6, ts);
    smoke(560, 1900 - h + 10, ts, 1);
    chip("LỐI VÀO NHỎ", ex + 290, ey - 40, pop(0.5, ts), { size: 40 });
    chip("LỖ THOÁT KHÓI", 560, 1900 - h - 80, pop(2.9, ts), { legs: 90, size: 40 }); // long enough for the right pole, the higher one of the askew strip, to reach the roof
    gust(ts, 1); snow(ts, 0.8);
  } },

  // the ending at dusk: in on the house, out to the settlement, then slowly in again as the family comes home
  { shots: ["9", "10", "kết"], cut: "sheet", draw(ts, i, u) {
    plate("pl-canh-chieu", ts, 14);
    const k = i === 0 ? 1 + 0.06 * sm(0, 3.3, u) : i === 1 ? 1.06 - 0.16 * sm(0, 4.6, u) : 0.9 + 0.12 * sm(0, 5, u);
    out.save(); out.translate(540, G); out.scale(k, k); out.translate(-540, -G);
    P("pc-nha", 150, G - 50, 190);
    P("pc-nha", 930, G - 30, 240);
    smoke(540, G + 50 - tall("pc-nha", 470), ts, 0.7);
    P("pc-nha", 540, G + 50, 470);
    glow(540 + DOOR[0] * 470, G + 50 - DOOR[1] * 470, 120, 0.55, ts);
    walk("pg-nhom", -200, G + 10, 250, ts, 34);
    out.restore();
    snow(ts, 0.45);
    sparkles(540, 420, 380, ts, 7);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, look: "storybook", stickers: CUTS.filter((n) => n.startsWith("pc-")) });
