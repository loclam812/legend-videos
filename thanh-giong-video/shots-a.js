const ground = (y, c) => `<rect x="-10" y="${y}" width="1620" height="${910 - y}" fill="${c}" ${I()}/><rect x="-10" y="${y}" width="1620" height="${910 - y}" fill="url(#fadeDown)"/>`;
const move = (svg, dx, dy, t, d = 0) => `<g class="walk" style="--dx:${dx}px;--dy:${dy}px;--t:${t}s;--d:${d}s">${svg}</g>`;
const line2 = (d, c, w) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 8}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
// grows from a small copy of itself, anchored at the feet
const grow = (svg, x, y, t, d = 0, from = 0.45) => `<g class="grow" style="transform-origin:${x}px ${y}px;--t:${t}s;--d:${d}s;--from:${from}">${svg}</g>`;

const IRON = "#8f9096";
const helmet = `<path d="M-36 -246C-42 -302 42 -302 36 -246Q0 -262 -36 -246Z" fill="${IRON}" ${I(3.5)}/><path d="M0 -290V-318" fill="none" ${I(5)}/><path d="M0 -320q24 -10 30 14q-16 -8 -30 4z" fill="#d8322f" ${I(3)}/><path d="M-36 -247Q0 -263 36 -247" fill="none" stroke="#f2c14e" stroke-width="5"/>`;
const armor = `<path d="M-37 -188Q0 -202 37 -188L43 -110Q0 -100 -43 -110Z" fill="${IRON}" ${I(4)}/><path d="M9 -196Q24 -194 37 -188L43 -110Q26 -104 9 -103Z" fill="#2a1608" opacity=".2"/>`
  + [-170, -150, -130].map((y) => `<path d="M-38 ${y}q10 12 19 0q10 12 19 0q10 12 19 0q10 12 19 0" fill="none" stroke="${INK}" stroke-width="2.5" opacity=".6"/>`).join("")
  + `<path d="M-43 -112Q0 -102 43 -112" fill="none" stroke="#f2c14e" stroke-width="7"/>`;
const enemyHelmet = `<path d="M-36 -246C-40 -288 -12 -296 0 -328C12 -296 40 -288 36 -246Q0 -262 -36 -246Z" fill="#3a3040" ${I(3.5)}/><path d="M-36 -247Q0 -263 36 -247" fill="none" stroke="#a02a2a" stroke-width="6"/>`;
const scarf = `<path d="M-35 -250Q0 -292 35 -250Q0 -268 -35 -250Z" fill="#5b3a20" ${I(3.5)}/>`;
const cap = `<path d="M-34 -254Q0 -300 34 -254Z" fill="#1f3f5f" ${I(3.5)}/><path d="M-36 -254q36 -14 72 0" fill="none" stroke="#f2c14e" stroke-width="6"/>`;

const spear = line2("M62 -10V-330", "#5b3a20", 6) + `<path d="M62 -372l-14 44h28z" fill="#c8c8d0" ${I(3)}/>`;
const whip = line2("M70 -190L84 -262", "#5b3a20", 8) + line2("M84 -262q50 -90 120 -40q30 26 6 60", "#5f646e", 5);
const hoe = line2("M96 -40L30 -236", "#8a5a34", 7) + `<path d="M30 -236l-40 22l10 20l36 -22z" fill="${IRON}" ${I(3)}/>`;
const horn = `<path d="M22 -214q20 -30 62 -40q30 -4 44 12q-18 22 -52 26q-30 6 -54 2z" fill="#e9d9a6" ${I(3.5)}/><path d="M104 -252q16 0 24 10" fill="none" stroke="#5b3a20" stroke-width="4"/>`;
const bowl = `<path d="M-2 -214h44q-2 26 -22 26t-22 -26z" fill="#fffaf0" ${I(3)}/><path d="M4 -214q16 -16 32 0z" fill="#fffaf0" ${I(2.5)}/>`;

const GIONG = (o) => person({ name: "Gióng", tunic: "#d8a03c", trim: "#b5382a", ...o });
const HERO = (o) => person({ name: "Gióng", tunic: "#c8552a", trim: "#f2c14e", hat: helmet, extra: armor, ...o });
const ME = (o) => person({ name: "Mẹ", tunic: "#7a4a6a", trim: "#d9c9a0", long: 1, hair: "long", hat: scarf, ...o });
const BO = (o) => person({ tunic: "#8a5a34", trim: "#5b3a20", beard: 1, ...o });
const SU = (o) => person({ name: "Sứ giả", tunic: "#2f5f8a", trim: "#f2c14e", long: 1, hat: cap, ...o });
const ENEMY = (o) => person({ tunic: "#4a3a5a", trim: "#a02a2a", mood: "angry", hat: enemyHelmet, aR: [62, -170], hR: spear, ...o });

function bamboo(x, y, h = 420, c = "#7fae4a", rot = 0) {
  const joints = Array.from({ length: Math.floor(h / 60) }, (_, k) => `<path d="M-9 ${-60 * (k + 1)}h18" fill="none" ${I(3)}/>`).join("");
  const leaves = [[-1, 0.96], [1, 0.86], [-1, 0.74], [1, 0.64], [-1, 0.52]].map(([d, p]) => `<path d="M0 ${-h * p}q${d * 50} -30 ${d * 96} -6q${-d * 50} 22 ${-d * 96} 6z" fill="${c === "#7fae4a" ? "#5f9a3a" : "#c9a030"}" ${I(3)}/>`).join("");
  return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-9" y="${-h}" width="18" height="${h}" rx="6" fill="${c}" ${I(4)}/>${joints}${leaves}</g>`;
}
const clump = (x, y, s = 1, c = "#7fae4a") => shadow(x, y, 90 * s) + `<g class="sway" style="transform-origin:${x}px ${y}px">` + [-54, -20, 16, 50].map((dx, i) => bamboo(x + dx * s, y, (400 + (i % 2) * 80) * s, c, (i - 1.5) * 6)).join("") + `</g>`;

function paddy(y, c = "#8fb060") {
  const tufts = Array.from({ length: 46 }, (_, i) => {
    const px = (i * 173) % 1600;
    const py = y + 36 + ((i * 97) % (860 - y));
    return `<path d="M${px} ${py}q-6 -18 -13 -22M${px} ${py}v-28M${px} ${py}q6 -18 13 -22" fill="none" stroke="#4f8a3a" stroke-width="4" stroke-linecap="round"/>`;
  }).join("");
  return ground(y, c) + tufts;
}

const footprint = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-180 4C-184 -34 -120 -46 -50 -34C20 -24 90 -74 150 -58C196 -44 200 36 156 54C96 76 30 34 -50 42C-120 50 -176 40 -180 4Z" fill="#6a4a2a" ${I()}/>
  <path d="M-160 6C-162 -20 -110 -28 -50 -18C20 -8 92 -52 142 -40C176 -30 178 26 146 40C96 56 30 20 -50 28C-110 34 -158 28 -160 6Z" fill="#4f3620"/>
  ${[[196, -70, 24], [226, -38, 19], [238, -6, 17], [234, 24, 15], [218, 50, 13]].map(([a, b, r]) => `<ellipse cx="${a}" cy="${b}" rx="${r * 1.25}" ry="${r}" fill="#4f3620" ${I(4)}/>`).join("")}</g>`;
const blaze = (x, y, s = 1) => `<circle cx="${x}" cy="${y - 40 * s}" r="${170 * s}" fill="url(#glow)"/><g transform="translate(${x} ${y}) scale(${s})"><g class="flick">${[[-46, 0.7], [0, 1], [44, 0.75]].map(([dx, k]) => `<path d="M${dx - 26 * k} 0Q${dx - 38 * k} ${-50 * k} ${dx} ${-104 * k}Q${dx + 38 * k} ${-50 * k} ${dx + 26 * k} 0Z" fill="#f2903c" ${I(4)}/><path d="M${dx - 11 * k} 0Q${dx - 17 * k} ${-30 * k} ${dx} ${-58 * k}Q${dx + 17 * k} ${-30 * k} ${dx + 11 * k} 0Z" fill="#f6d453"/>`).join("")}</g></g>`;

function ironHorse(x, y, s = 1, flame = 0, air = 0) {
  const mane = Array.from({ length: 9 }, (_, k) => `<path d="M${58 + k * 7} ${-150 - k * 9}q-26 -6 -34 12" fill="none" stroke="#f2903c" stroke-width="7" stroke-linecap="round"/>`).join("");
  const rivets = [[-60, -112], [-30, -84], [0, -76], [30, -84], [60, -112]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="4" fill="#4a4e58"/>`).join("");
  const breath = flame ? `<circle cx="250" cy="-200" r="170" fill="url(#glow)"/><g class="flick" style="transform-origin:168px -212px"><path d="M166 -214q70 -44 150 -14q-56 0 -74 14q58 4 84 34q-86 2 -160 -22z" fill="#f2903c" ${I(3)}/><path d="M170 -212q50 -22 96 -8q-40 4 -52 12q32 4 46 16q-50 -2 -90 -14z" fill="#f6d453"/></g>` : "";
  return `<g transform="translate(${x} ${y}) scale(${s})">${air ? "" : shadow(10, 2, 130)}<g class="bob">
    ${line2("M-92 -120q-40 20 -34 76", "#f2903c", 12)}
    ${line2("M-64 -90V-6M52 -90V-6", "#5f646e", 15)}
    <ellipse cx="0" cy="-112" rx="94" ry="46" fill="#7d828c" ${I()}/>
    ${line2("M-36 -84V-6M78 -86V-6", "#7d828c", 15)}
    <path d="M50 -140L104 -226L140 -204L92 -96Z" fill="#7d828c" ${I()}/>
    <path d="M96 -236q36 -22 72 12q6 18 -12 22l-56 -4z" fill="#7d828c" ${I()}/>
    <path d="M100 -240l-4 -26l18 16z" fill="#7d828c" ${I(4)}/>
    ${mane}${rivets}<circle cx="134" cy="-224" r="6" fill="#f6d453" ${I(2.5)}/>
    <path d="M-50 -150q50 -20 100 0v46h-100z" fill="#b5382a" ${I(4)}/><path d="M-50 -106h100" fill="none" stroke="#f2c14e" stroke-width="6"/>
    ${breath}
  </g></g>`;
}

// the rider is drawn first so the horse hides his legs
const rider = (x, y, s, o = {}, flame = 0, air = 0, who = HERO) => who({ x: x - 8 * s, y: y - 76 * s, s: s * 0.8, flat: 1, ...o }) + ironHorse(x, y, s, flame, air);

const bed = (x, y, w = 320) => `<path d="M${x + 16} ${y}v86M${x + w - 16} ${y}v86" fill="none" ${I(12)}/><rect x="${x}" y="${y}" width="${w}" height="24" rx="6" fill="#c9a15a" ${I()}/>`
  + Array.from({ length: Math.floor(w / 26) }, (_, k) => `<path d="M${x + 16 + k * 26} ${y + 3}v18" fill="none" stroke="#5b3a20" stroke-width="2.5" opacity=".6"/>`).join("");
// the child lies on his back, head to the left, feet at (x, y)
const lying = (x, y, s, o = {}) => `<g transform="translate(${x} ${y}) rotate(-90)">${GIONG({ x: 0, y: 0, s, flat: 1, mood: "sad", ...o })}</g>`
  + `<rect x="${x - 150 * s}" y="${y - 50 * s}" width="${160 * s}" height="${100 * s}" rx="12" fill="#b5382a" ${I(4)}/><path d="M${x - 150 * s} ${y - 14 * s}h${160 * s}" fill="none" stroke="#f2c14e" stroke-width="5"/>`;

function room(c = "#b9824a") {
  const planks = Array.from({ length: 15 }, (_, k) => `<path d="M${k * 110 + 40} 0V740" fill="none" stroke="#5b3a20" stroke-width="4" opacity=".35"/>`).join("");
  return `<rect width="1600" height="900" fill="${c}"/>${planks}<rect x="150" y="170" width="250" height="210" fill="#bfe6f0" ${I()}/><path d="M275 170V380M150 275H400" fill="none" ${I(6)}/><circle cx="800" cy="400" r="520" fill="url(#glow)"/>`
    + ground(740, "#7a4f2c") + lamp(1340, 250);
}

const yard = (top, bot, extra = "") => sky(top, bot) + extra + hills() + house(300, 670, 1.1) + ground(650, "#d9a85c");
const pot = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(6, 2, 90)}<path d="M-70 -80Q-90 0 -50 0H50Q90 0 70 -80Z" fill="#6a4a3a" ${I()}/><ellipse cx="0" cy="-80" rx="72" ry="16" fill="#3a2418" ${I(4)}/><path d="M-56 -84q56 -70 112 0z" fill="#fffaf0" ${I(3)}/><path class="smoke" d="M-20 -150q-14 -20 0 -40M16 -150q14 -20 0 -40"/></g>`;
const badge = (pic, x, y, d) => pop(`<g transform="translate(${x} ${y})"><circle r="92" fill="#f6ead2" ${I()}/><circle r="92" fill="url(#fadeDown)"/>${pic}</g>`, x, y, d);

SHOTS.push({
  label: "1",
  art: sky("#8fd0e0", "#f8e6b0") + sunDisc(1280, 190) + clouds() + hills() + house(290, 650, 1) + clump(1460, 690, 0.9) + paddy(640)
    + BO({ x: 660, y: 830, s: 1.1, aR: [60, -150], hR: hoe, wR: [16, 0.6], lean: [9, 0.6], nod: [4, 1.2] })
    + ME({ x: 930, y: 840, s: 1.05, aL: [-58, -150], hL: basket(-70, -138, 0.6), aR: [40, -196], wR: [-10, 1.1], nod: [6, 1.5] }),
  cam: [[800, 450, 1], [800, 580, 1.55]],
  lines: [
    [null, "Vào đời Hùng Vương thứ sáu, ở làng Gióng có hai vợ chồng ông lão chăm chỉ, hiền lành."],
    [null, "Hai ông bà đã nhiều tuổi mà vẫn chưa có lấy một mụn con."],
  ],
});

SHOTS.push({
  label: "2",
  art: sky("#9fd8e6", "#f6efc0") + clouds("#ffffff", 0.5, 120) + hills("#7fa86a") + clump(120, 640, 0.8) + paddy(600)
    + footprint(1000, 770, 1.25)
    + ME({ x: 600, y: 810, s: 1.2, walk: [-460, 3.6], mood: "open", aL: [-58, -226], aR: [58, -226], wL: [14, 0.7, 3.6], wR: [-14, 0.7, 3.6], nod: [9, 1.3, 3.6] }),
  cam: [[700, 520, 1.3], [880, 600, 1.5]],
  lines: [
    [null, "Một hôm, bà ra đồng, trông thấy một vết chân to lạ thường."],
    [null, "Bà liền đặt bàn chân mình lên ướm thử. Không ngờ về nhà bà thụ thai."],
    [null, "Mười hai tháng sau, bà sinh ra một cậu con trai khôi ngô."],
  ],
});

SHOTS.push({
  label: "3",
  art: room() + bed(520, 690, 400) + lying(890, 664, 0.6)
    + ME({ x: 1090, y: 860, s: 1.25, flip: 1, mood: "sad", aL: [-30, -150], aR: [60, -170], wR: [8, 1.4], nod: [9, 1.8], lean: [5, 2] })
    + BO({ x: 1290, y: 866, s: 1.2, flip: 1, mood: "sad", nod: [8, 2.2], aL: [-30, -140], aR: [30, -140] }),
  cam: [[800, 450, 1], [860, 600, 1.55]],
  lines: [
    [null, "Kỳ lạ thay, cậu bé lên ba tuổi mà vẫn không biết nói, không biết cười, cũng chẳng biết đi."],
    [null, "Cứ đặt đâu thì nằm đấy, khiến hai ông bà rất buồn lòng."],
  ],
});

SHOTS.push({
  label: "4",
  art: sky("#4a2436", "#f08a4a") + sunDisc(820, 440, "#ffb060") + clouds("#2a1a2e", 0.5, 110) + hills("#5a4a44")
    + house(290, 650, 1, "#7a5a3a", "#4a2a20") + blaze(210, 350, 1.3) + blaze(390, 356, 1) + house(720, 640, 0.75, "#7a5a3a", "#4a2a20") + blaze(720, 416, 0.9)
    + ground(640, "#8a6a4a")
    + [[900, 800, 1.05, 0], [1060, 850, 1.2, 0.5], [1220, 800, 1.05, 0.9], [1370, 856, 1.2, 1.3], [1520, 806, 1.05, 1.7]]
      .map(([x, y, s, d]) => ENEMY({ x, y, s, flip: 1, walk: [640, 4.6, d], wR: [-8, 0.5, 4.6 + d], nod: [5, 0.7] })).join(""),
  cam: [[1100, 540, 1.4], [800, 450, 1]],
  lines: [
    [null, "Bấy giờ, giặc Ân kéo sang xâm chiếm nước ta. Thế giặc rất mạnh, đi đến đâu đốt phá đến đấy."],
    [null, "Nhà vua lo lắng, bèn sai sứ giả đi khắp nơi tìm người tài giỏi cứu nước."],
  ],
});

SHOTS.push({
  label: "5",
  art: yard("#8fd0e0", "#f8e6b0", sunDisc(1320, 170) + clouds()) + clump(1530, 700, 0.8)
    + bed(500, 740, 380) + lying(850, 714, 0.6, { mood: "open" })
    + ME({ x: 1000, y: 860, s: 1.15, flip: 1, mood: "open", aL: [-40, -210], aR: [40, -210], nod: [8, 1], body: "tremble" })
    + SU({ x: 1340, y: 850, s: 1.15, flip: 1, walk: [460, 4], aR: [70, -236], hR: horn, wR: [-6, 0.8, 4], nod: [-5, 1] }),
  cam: [[1150, 540, 1.5], [800, 600, 1.6]],
  lines: [
    [null, "Sứ giả đi đến làng Gióng. Vừa nghe tiếng rao, cậu bé bỗng dưng cất tiếng nói."],
    ["Gióng", "Mẹ ơi, mẹ ra mời sứ giả vào đây cho con!"],
  ],
});

SHOTS.push({
  label: "6",
  art: room("#a8743f") + bed(360, 700, 380)
    + GIONG({ x: 560, y: 700, s: 0.62, aR: [64, -226], wR: [-20, 0.5], nod: [5, 0.8] })
    + SU({ x: 960, y: 860, s: 1.2, flip: 1, mood: "open", lean: [9, 1.5], nod: [7, 1.2], aL: [-30, -150], aR: [30, -150] })
    + ME({ x: 1220, y: 866, s: 1.15, flip: 1, mood: "open", aL: [-34, -200], aR: [34, -200], nod: [-6, 1.4] })
    + badge(ironHorse(-20, 62, 0.42), 640, 200, 3.2)
    + badge(`<g transform="translate(-96 150) scale(.75)">${whip}</g>`, 880, 170, 4.4)
    + badge(`<g transform="translate(0 196) scale(1.3)">${armor}</g>`, 1120, 200, 5.6),
  cam: [[800, 450, 1], [800, 430, 1.2]],
  lines: [
    ["Gióng", "Ông về tâu với vua, rèn cho ta một con ngựa sắt, một cái roi sắt và một tấm áo giáp sắt."],
    ["Gióng", "Ta sẽ phá tan lũ giặc này!"],
    [null, "Sứ giả vừa kinh ngạc vừa mừng rỡ, vội vàng về tâu vua."],
  ],
});
