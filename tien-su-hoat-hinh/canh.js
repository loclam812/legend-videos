// The cartoon scenes of "Surviving the Ice Age in a mammoth-bone house", the tien-su-hoat-hinh cut
// of the mammoth-bone house story. The engine is giay/may.js with look "toon", and the layers are
// the flat ones from anh.js (the very images of nha-xuong-mamut-hoathinh). The staging follows the
// user's six-scene outline: the frozen world and the struggle (hook-2), the reveal of the bone house
// and the animal it came from (3-4), building it (5-6), the family by the fire inside (7), the small
// entrance and the smoke hole (8), the pull-back and the final wide shot (9-kết).
// Every shot is ONE held still illustration (the user asked on 2026-11-22 for a static picture
// with no character animation, like the storytime frames they showed): the poses and a few drawn
// symbols tell the motion, and every time-driven helper is called at a fixed moment, so the snow,
// the smoke and the fire hang frozen in place too.
const PLATES = ["pl-troi-am", "pl-chieu"];
const CUTS = ["pc-nha", "pc-khung", "pc-xuong", "pc-dem", "pc-lua",
  "pg-nhom", "pg-run", "pg-nang", "pg-keo", "pg-gia-dinh", "pg-mamut"];
// which way the generated pieces face, found by looking at them: 1 means the piece faces left as
// generated. Re-checked against the images regenerated on 2026-11-23 (after the scene clause was
// cut from the style): pg-nhom walks LEFT again, pg-run faces left, pg-nang and pg-keo face right,
// pg-gia-dinh reads right, pg-mamut walks left on four legs.
const LEFT = { nhom: 1, run: 1, nang: 0, keo: 0, giadinh: 0, mamut: 1 };
// flip a piece so it faces the way the scene needs
const F = (key, wantLeft) => (LEFT[key] ? !wantLeft : !!wantLeft);

// keep a sky plate's edges outside the frame even if it comes back with a border
const back = (name, t, total) => { out.save(); out.translate(540, 960); out.scale(1.16, 1.16); out.translate(-540, -960); plate(name, t, total, 0.5); out.restore(); };

const flame = (x, y, w, t, n = 0) => P("pc-lua", x, y, w * (1 + 0.08 * Math.sin(t * 11 + n)), { rot: 0.05 * Math.sin(t * 7 + n), shadow: 0 });
const wrap = (v, m) => ((v % m) + m) % m;

// falling snow, k = how hard it snows (0..1). The wind blows from the right, against anyone walking right
function snow(t, k = 1) {
  for (let i = 0; i < 110; i++) {
    if (rnd(i, 41) > k) continue;
    const sp = 260 + 320 * rnd(i, 42), drift = 140 + 260 * rnd(i, 43);
    const y = wrap(rnd(i, 44) * (OH + 80) + t * sp, OH + 80) - 40;
    const x = wrap(rnd(i, 45) * (OW + 600) - t * drift, OW + 600) - 300;
    out.save();
    out.globalAlpha = 0.55 + 0.45 * rnd(i, 46);
    out.fillStyle = "#ffffff"; out.strokeStyle = "#2a1608"; out.lineWidth = 3;
    const r = 7 + 13 * rnd(i, 47);
    out.beginPath(); out.arc(x, y, r, 0, 7); out.fill(); out.stroke();
    out.restore();
  }
}

// white streaks of wind sweeping leftwards across the sky
function gust(t, k = 1) {
  out.save();
  out.strokeStyle = "#ffffff"; out.lineCap = "round"; out.lineWidth = 8;
  for (let i = 0; i < 3; i++) {
    const ph = (t * (0.3 + 0.15 * rnd(i, 51)) + rnd(i, 52)) % 1;
    const x = OW + 260 - ph * (OW + 1000), y = 260 + 400 * i + 40 * Math.sin(t + i * 2.1);
    out.globalAlpha = k * 0.7 * Math.sin(Math.PI * ph);
    out.beginPath(); out.moveTo(x, y); out.quadraticCurveTo(x - 260, y - 46, x - 520, y - 8); out.stroke();
  }
  out.restore();
}

// the shaking marks beside a freezing figure — a held symbol, the way the storytime frames the
// user showed tell motion with little marks instead of moving anything
function shiver(x, y, dx) {
  out.save();
  out.strokeStyle = "#2a1608"; out.lineWidth = 5; out.lineCap = "round";
  for (const s of [-1, 1])
    for (let j = 0; j < 3; j++) {
      out.globalAlpha = 0.75;
      out.beginPath();
      out.arc(x + s * dx, y + 60 * j, 14, Math.PI * 0.15, Math.PI * 0.95, s < 0);
      out.stroke();
    }
  out.restore();
}

// snow drifts: flat wavy bands over the ground and the walkers' feet, drawn by code — every
// generated snow strip came back with a painted figure standing on it, so no layer is used here
function drifts(top) {
  out.save();
  out.strokeStyle = "#2a1608"; out.lineWidth = 5;
  const band = (y, a, p, col) => {
    out.fillStyle = col; out.beginPath();
    out.moveTo(-40, OH + 20); out.lineTo(-40, y);
    for (let x = -40; x < OW + 40; x += 120)
      out.quadraticCurveTo(x + 60, y + a * Math.sin((x + 60) / 160 + p), x + 120, y + a * Math.sin((x + 120) / 320 + p));
    out.lineTo(OW + 40, OH + 20); out.closePath(); out.fill(); out.stroke();
  };
  band(top, 26, 1.7, "#d3e0ec");      // the far drift, pale blue
  band(top + 55, 34, 4.6, "#f1f5f9");  // the near drift, white
  out.restore();
}

// grey puffs rising from the smoke hole, bending with the wind
function smoke(x, y, t, k = 1) {
  out.save();
  for (let i = 0; i < 6; i++) {
    const p = (t * 0.35 + i / 6) % 1;
    out.globalAlpha = k * 0.55 * (1 - p);
    out.fillStyle = "#cfd3d6"; out.strokeStyle = "#2a1608"; out.lineWidth = 4;
    out.beginPath(); out.arc(x - 40 * p + 20 * Math.sin(t * 0.9 + i * 2.4) * p, y - 330 * p, 16 + 44 * p, 0, 7); out.fill(); out.stroke();
  }
  out.restore();
}

// the inside of the bone hut, drawn by code: both generated interior plates came back with
// people painted into the room (the stick-figure style adds them to any interior) or with a
// duplicated skull and patch seams, so no layer is used here
function trongNha() {
  out.save();
  out.strokeStyle = "#2a1608"; out.lineWidth = 5;
  // the hide wall: one warm brown field with rows of stitches
  out.fillStyle = "#9a6a3d"; out.fillRect(-10, -10, OW + 20, 1580);
  out.fillStyle = "#6f4a26";
  for (let r = 0; r < 4; r++)
    for (let i = 0; i < 12; i++)
      out.fillRect(40 + i * 88 + 18 * rnd(i, 61 + r), 300 + 310 * r, 26, 6);
  // the earthen floor
  out.fillStyle = "#7d5530"; out.fillRect(-10, 1560, OW + 20, OH - 1550);
  out.beginPath(); out.moveTo(-10, 1560); out.lineTo(OW + 10, 1560); out.stroke();
  // big white ribs arching across the ceiling: dark outline first, flat white on top
  for (let i = 0; i < 4; i++) {
    const y0 = 1440 - 250 * i;
    out.beginPath(); out.moveTo(-30, y0); out.quadraticCurveTo(540, y0 - 430, OW + 30, y0);
    out.lineWidth = 32; out.strokeStyle = "#2a1608"; out.stroke();
    out.lineWidth = 22; out.strokeStyle = "#f7f3ec"; out.stroke();
  }
  // one mammoth skull set in the wall, with its two tusks
  out.lineWidth = 5; out.strokeStyle = "#2a1608"; out.fillStyle = "#f7f3ec";
  out.beginPath(); out.ellipse(270, 420, 170, 130, 0, 0, 7); out.fill(); out.stroke();
  out.fillStyle = "#2a1608";
  out.beginPath(); out.arc(210, 420, 30, 0, 7); out.fill();
  out.beginPath(); out.arc(330, 420, 30, 0, 7); out.fill();
  out.beginPath(); out.ellipse(270, 490, 20, 28, 0, 0, 7); out.fill();
  for (const s of [-1, 1]) {
    out.beginPath(); out.moveTo(270 + s * 90, 520); out.quadraticCurveTo(270 + s * 120, 610, 270 + s * 60, 660);
    out.lineWidth = 24; out.strokeStyle = "#2a1608"; out.stroke();
    out.lineWidth = 14; out.strokeStyle = "#f7f3ec"; out.stroke();
  }
  // the ring of hearth stones around the fire
  out.lineWidth = 5; out.strokeStyle = "#2a1608"; out.fillStyle = "#8d949c";
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    out.beginPath();
    out.ellipse(540 + 150 * Math.cos(a), 1705 + 60 * Math.sin(a), 26 + 8 * rnd(i, 71), 19 + 6 * rnd(i, 72), rnd(i, 73), 0, 7);
    out.fill(); out.stroke();
  }
  out.restore();
}

// a warm pool of firelight
const glow = (x, y, r, a = 0.5) => {
  const g = out.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(255,190,90,${a})`); g.addColorStop(1, "rgba(255,190,90,0)");
  out.fillStyle = g; out.fillRect(x - r, y - r, 2 * r, 2 * r);
};

// a scene serves one or more shots in a row: ts = seconds since the scene began, i = which of its shots, u = seconds into that shot
const SCENES = [
  // the frozen world: one held frame of the storm, the family small in it, the distant dome
  { shots: ["hook"], draw() {
    plate("pl-troi-am", 4, 9, 0.5);
    ground("#e8edf3", 1380);
    P("pc-nha", 900, 1550, 300);
    P("pg-nhom", 430, 1700, 330, { flip: F("nhom", false) });
    gust(1.5, 1); snow(1.5, 1);
  } },

  // closer: mid-stride through it, then stopped and freezing with the shiver marks, nothing modern
  { shots: ["1", "2"], draw(ts, i) {
    plate("pl-troi-am", 4, 12, 0.5);
    ground("#e8edf3", 1400);
    P("pc-nha", 920, 1580, 390);
    if (i === 0) {
      P("pg-nhom", 480, 1690, 520, { flip: F("nhom", false) });
    } else {
      P("pg-run", 540, 1700, 180);
      shiver(540, 1390, 120);
    }
    gust(2, 1); snow(2, 1);
  } },

  // the reveal: the bone house standing ahead of them, then the animal the bones came from beside it
  { shots: ["3", "4"], draw(ts, i) {
    plate("pl-troi-am", 4, 13, 0.5);
    ground("#e8edf3", 1420);
    if (i === 0) {
      rays(690, 1080, 2, 0.1);
      P("pc-nha", 690, 1720, 660);
      P("pg-nhom", 300, 1690, 400, { flip: F("nhom", false) });
    } else {
      // kept apart: at one centre the brown mammoth melted into the brown hide of the house
      P("pc-nha", 360, 1700, 520);
      P("pg-mamut", 840, 1700, 560, { flip: F("mamut", true) });
    }
    snow(3, 0.55);
  } },

  // building it: the bare bone frame with the bone carrier, then the hide stretcher over the covered frame
  { shots: ["5", "6"], draw(ts, i) {
    plate("pl-troi-am", 4, 12, 0.5);
    ground("#e8edf3", 1430);
    if (i === 0) {
      P("pc-khung", 640, 1690, 680);
      P("pc-xuong", 950, 1790, 340);
      P("pg-nang", 330, 1720, 450, { flip: F("nang", false) });
    } else {
      P("pc-khung", 640, 1690, 680);
      P("pc-nha", 640, 1705, 690);
      P("pg-keo", 250, 1730, 430, { flip: F("keo", false) });
    }
    snow(4, 0.3);
  } },

  // inside: the family around the fire, fur clothes, fur bedding, warm light
  { shots: ["7"], draw() {
    trongNha();
    glow(540, 1280, 760, 0.32);
    P("pg-gia-dinh", 540, 1600, 640, { flip: F("giadinh", false) });
    flame(540, 1655, 150, 1);
    rays(540, 1600, 2, 0.09);
    P("pc-dem", 150, 1800, 430);
    P("pc-dem", 940, 1800, 400, { flip: 1 });
  } },

  // the details: a close-up of the small entrance, the firelight in it, and the smoke leaving the roof
  { shots: ["8"], draw() {
    plate("pl-troi-am", 2, 9, 0.5);
    ground("#e8edf3", 1500);
    P("pc-nha", 540, 1990, 1024);
    smoke(540, 1250, 2, 1);
    glow(540, 1840, 300, 0.5);
    gust(1, 1); snow(1, 1);
  } },

  // the pull-back told as two held frames: the house alone, then far and tiny in the frozen plain
  { shots: ["9", "10"], draw(ts, i) {
    plate("pl-troi-am", 4, 14, 0.5);
    ground("#e8edf3", 1460);
    if (i === 0) {
      P("pc-nha", 540, 1620, 540);
      glow(540, 1560, 240, 0.45);
      smoke(540, 1200, 2, 0.9);
    } else {
      P("pc-nha", 540, 1520, 300);
      glow(540, 1480, 150, 0.4);
      smoke(540, 1300, 2, 0.7);
      P("pg-nhom", 160, 1560, 150, { flip: F("nhom", false) });
      sparkles(540, 1000, 300, 2, 6);
    }
    snow(3, i === 0 ? 0.8 : 0.5);
  } },

  // the last wide shot at dusk: the storm hangs, the firelight stays on
  { shots: ["kết"], draw() {
    back("pl-chieu", 2, 7);
    ground("#e2e8ef", 1500);
    P("pc-nha", 540, 1560, 460);
    glow(540, 1500, 220, 0.55);
    smoke(540, 1170, 2, 0.8);
    snow(2, 0.7);
  } },
];

start({ plates: PLATES, cuts: CUTS, scenes: SCENES, look: "toon" });
