const ground = (y, c) => `<rect x="-10" y="${y}" width="1620" height="${910 - y}" fill="${c}" ${I()}/><rect x="-10" y="${y}" width="1620" height="${910 - y}" fill="url(#fadeDown)"/>`;
const move = (svg, dx, dy, t, d = 0) => `<g class="walk" style="--dx:${dx}px;--dy:${dy}px;--t:${t}s;--d:${d}s">${svg}</g>`;
const line2 = (d, c, w) => `<path d="${d}" fill="none" ${I(w + 8)}/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const swing = (svg, x, y, a, t, d = 0) => `<g class="swing" style="transform-origin:${x}px ${y}px;--a:${a}deg;--t:${t}s;--d:${d}s">${svg}</g>`;

// one-shot events take { t, d, at }: seconds, delay, or at: "start" | "end" to hold the event at that point
const once = (o, cls, vars, endStyle) => {
  if (o.at === "end") return ` style="${vars}${endStyle}"`;
  if (o.at === "start") return ` style="${vars}"`;
  return ` class="${cls}" style="${vars}--t:${o.t || 5}s;--d:${o.d || 0}s"`;
};

const IRON = "#9aa0a8";
const WOOD = "#7a5230";
const VIET_C = "#8a5a34";
const HAN_C = "#2f5f9a";

const band = (c) => `<path d="M-34 -250Q0 -266 34 -250" fill="none" ${I(13)}/><path d="M-34 -250Q0 -266 34 -250" fill="none" stroke="${c}" stroke-width="7"/>`;
const chinBeard = `<path d="M-17 -207Q-15 -184 0 -179Q15 -184 17 -207Q0 -198 -17 -207Z" fill="${DARK}" ${I(3)}/>`;
const turban = `<path d="M-35 -250Q0 -294 35 -250Q0 -266 -35 -250Z" fill="#3f6a4a" ${I(3.5)}/>`;
const ironHelmet = (c = IRON, plume = "#d8322f") => `<path d="M-36 -246C-42 -302 42 -302 36 -246Q0 -262 -36 -246Z" fill="${c}" ${I(3.5)}/><path d="M0 -290V-316" fill="none" ${I(5)}/><path d="M0 -318q24 -10 30 14q-16 -8 -30 4z" fill="${plume}" ${I(3)}/><path d="M-36 -247Q0 -263 36 -247" fill="none" stroke="#f2c14e" stroke-width="5"/>`;
const mian = `<path d="M-30 -252Q0 -294 30 -252Z" fill="#1c1c28" ${I(3.5)}/><path d="M-52 -292L52 -302V-290L-52 -280Z" fill="#1c1c28" ${I(3.5)}/><path d="M-44 -280v24M-30 -282v24M30 -288v24M44 -289v24" fill="none" stroke="#f2c14e" stroke-width="4" stroke-dasharray="4 4"/>`;
const plate = (c = IRON) => `<path d="M-37 -188Q0 -202 37 -188L43 -110Q0 -100 -43 -110Z" fill="${c}" ${I(4)}/><path d="M9 -196Q24 -194 37 -188L43 -110Q26 -104 9 -103Z" fill="#2a1608" opacity=".2"/><path d="M-30 -160H32M-34 -132H36" fill="none" stroke="#2a1608" stroke-width="3" opacity=".35"/>`;

// held things are drawn at the hand position given to aL / aR
const held = (hx, hy, rot, svg) => `<g transform="translate(${hx} ${hy}) rotate(${rot})">${svg}</g>`;
const SWORD = line2("M0 6V-118", "#dfe3ea", 7) + `<path d="M-15 -4H15" fill="none" ${I(7)}/>`;
const SPEAR = line2("M0 150V-170", "#5b3a20", 6) + `<path d="M0 -212l-13 44h26z" fill="#c8ccd4" ${I(3)}/>`;
const AXE = line2("M0 30V-96", WOOD, 7) + `<path d="M-2 -100q34 -8 40 22q-22 8 -40 2z" fill="${IRON}" ${I(3)}/>`;
const MALLET = line2("M0 30V-90", WOOD, 7) + `<rect x="-30" y="-122" width="60" height="36" rx="6" fill="#5b3a20" ${I(4)}/>`;
const BOW = `<path d="M0 -70Q46 0 0 70" fill="none" ${I(7)}/><path d="M0 -70V70" fill="none" stroke="#f6ead2" stroke-width="2"/>`;

const NGO = (o) => person({ name: "Ngô Quyền", mood: "firm", tunic: "#b5452a", trim: "#f2c14e", hat: band("#d8322f") + chinBeard, extra: plate("#c9a15a"), ...o });
const KING_NGO = (o) => person({ name: "Ngô Quyền", tunic: "#c8552a", trim: "#f2c14e", long: 1, hat: band("#f2c14e") + chinBeard, ...o });
const VIET = (o) => person({ mood: "firm", tunic: VIET_C, trim: "#3f6a4a", hat: turban, ...o });
const HAN = (o) => person({ tunic: HAN_C, trim: "#c8ccd4", hair: "none", hat: ironHelmet(), mood: "firm", ...o });
const THAO = (o) => person({ tunic: "#3a4fa8", trim: "#f2c14e", hair: "none", hat: ironHelmet("#e0b040", "#f6ead2"), extra: plate("#e0b040"), mood: "firm", ...o });
const HAN_KING = (o) => person({ tunic: "#1f3f6f", trim: "#f2c14e", long: 1, hair: "none", hat: mian, beard: 1, ...o });
const DUONG = (o) => person({ tunic: "#a0522a", trim: "#e9d9a6", long: 1, beard: 1, ...o });
const KIEU = (o) => person({ tunic: "#55603a", trim: "#1c1c28", long: 1, mood: "angry", hat: band("#1c1c28"), ...o });
const DAN = (o) => person({ tunic: "#7a6a3a", trim: "#5b3a20", ...o });

function karst(c = "#5f7f86", y = 430, o = 0.6) {
  const tower = ([x, h, w]) => `<path d="M${x - w} ${y + 4}C${x - w * 0.7} ${y - h * 1.15} ${x - w * 0.1} ${y - h * 1.25} ${x + w * 0.2} ${y - h}C${x + w * 0.6} ${y - h * 0.9} ${x + w * 0.9} ${y - h * 0.3} ${x + w} ${y + 4}Z"/>`;
  const far = [[90, 150, 120], [330, 110, 110], [640, 170, 130], [930, 120, 120], [1210, 160, 130], [1500, 130, 120]].map(tower).join("");
  const near = [[210, 90, 140], [520, 70, 150], [1090, 80, 160], [1390, 100, 150]].map(tower).join("");
  return `<g fill="${c}" opacity="${o * 0.6}">${far}</g><g fill="${c}" opacity="${o}">${near}</g><rect y="${y - 6}" width="1600" height="12" fill="#3f5f4a" opacity="${o}"/>`;
}

function river({ top = "#8fc4d8", bot = "#f3e2b0", water = "#3f8a8f", y = 430, sun = null, rock = "#5f7f86" } = {}) {
  return sky(top, bot) + (sun ? sunDisc(sun[0], sun[1], sun[2]) : "") + clouds("#ffffff", 0.45, 110) + karst(rock, y) + sea(y, water) + (sun ? glints(sun[0]) : "");
}

function bank(y = 720, c = "#8a7a4a") {
  const d = `M-20 ${y}Q400 ${y - 44} 800 ${y - 12}T1620 ${y - 26}V920H-20Z`;
  return `<path d="${d}" fill="${c}" ${I()}/>${shade(d)}<path d="M-20 ${y + 6}Q400 ${y - 38} 800 ${y - 6}T1620 ${y - 20}" fill="none" stroke="#fff8e8" stroke-width="6" opacity=".35"/>`;
}

const pole = (x, y, h) => `<path d="M${x - 10} ${y + 30}L${x - 7} ${y - h + 36}H${x + 7}L${x + 10} ${y + 30}Z" fill="${WOOD}" ${I(4)}/><path d="M${x + 2} ${y + 30}V${y - h + 36}" fill="none" stroke="#2a1608" stroke-width="5" opacity=".25"/><path d="M${x - 8} ${y - h + 40}L${x} ${y - h - 8}L${x + 8} ${y - h + 40}Z" fill="#b8bec8" ${I(3.5)}/>`;

// a stake standing in water at (x, y); the waterline clips it, so "rising" reads as the tide falling
function stake(x, y, h, o = {}) {
  const ripple = `<ellipse class="glint" cx="${x}" cy="${y}" rx="${14 + h / 8}" ry="5" fill="none" stroke="#f4fbf8" stroke-width="3"/>`;
  const hidden = o.sink ? o.at === "end" : o.at === "start";
  if (hidden) return `<ellipse cx="${x}" cy="${y}" rx="14" ry="4" fill="#12303a" opacity=".3"/>`;
  if (o.at) return pole(x, y, h) + ripple;
  const id = "st" + uid++;
  return `<clipPath id="${id}"><rect x="${x - 40}" y="${y - h - 40}" width="80" height="${h + 40}"/></clipPath><g clip-path="url(#${id})"><g class="rise" style="--h:${h + 30}px;--t:${o.t || 5}s;--d:${o.d || 0}s${o.sink ? ";animation-direction:reverse" : ""}">${pole(x, y, h)}</g></g>${ripple}`;
}

const STAKES = [[330, 505], [560, 498], [800, 510], [1040, 500], [1280, 508], [220, 560], [470, 566], [700, 556], [930, 570], [1170, 560], [1400, 566], [340, 640], [600, 650], [860, 640], [1110, 654], [1340, 642], [250, 740], [520, 752], [790, 744], [1060, 756], [1320, 746]];
// from / to pick the rows by y, so ships can be drawn between far and near stakes
function stakes(o = {}, from = 0, to = 900) {
  return STAKES.filter(([, y]) => y >= from && y < to).map(([x, y], i) => stake(x, y, 50 + (y - 480) * 0.42, { ...o, d: (o.d || 0) + (i % 5) * 0.12 * (o.t || 5) * 0.2 })).join("");
}

const batten = (x, w, top, h) => Array.from({ length: 5 }, (_, k) => `<path d="M${x - w / 2 - 6} ${top + 20 + (k * (h - 30)) / 4}H${x + w / 2 + 6}" fill="none" stroke="#5b2018" stroke-width="5"/>`).join("");
// origin is the waterline under the middle of the hull; the bow points left
function junk(x, y, s = 1, { sail = "#b5382a", crew = "", cls = "rock", flip = 0, burn = 0 } = {}) {
  const sails = `<path d="M-150 -40V-310M0 -40V-420" fill="none" ${I(10)}/>
    <path d="M-230 -290H-76L-66 -92H-240Z" fill="${sail}" ${I()}/>${batten(-153, 150, -290, 198)}
    <path d="M-100 -398H104L118 -96H-114Z" fill="${sail}" ${I()}/>${batten(2, 210, -398, 302)}
    <path d="M0 -420q40 -16 64 6q-30 2 -64 18z" fill="#f2c14e" ${I(3)}/>`;
  const hull = `<path d="M-300 -86Q-270 -30 -250 60H230L300 -120H170L150 -40H-190L-214 -96Z" fill="#6a3324" ${I()}/>
    <path d="M-262 6H258" fill="none" stroke="#f2c14e" stroke-width="6" opacity=".8"/><path d="M-250 60H230L242 30H-256Z" fill="#2a1608" opacity=".3"/>
    <rect x="160" y="-176" width="120" height="58" fill="#8a4a30" ${I()}/><path d="M146 -176Q220 -214 294 -176Z" fill="#3a3040" ${I()}/>
    <circle cx="-236" cy="-34" r="13" fill="#fffaf0" ${I(4)}/><circle cx="-236" cy="-34" r="5" fill="${DARK}"/>
    ${[-150, -90, -30, 30, 90].map((sx) => `<circle cx="${sx}" cy="-14" r="19" fill="#c8ccd4" ${I(4)}/><circle cx="${sx}" cy="-14" r="6" fill="#b5382a"/>`).join("")}`;
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><ellipse cx="0" cy="64" rx="290" ry="14" fill="#0e2a36" opacity=".35"/><g class="${cls}">${sails}${crew}${hull}${burn ? blaze(-20, -60, 1.1) : ""}</g></g>`;
}

const oar = (x, a) => `<g class="row" style="transform-origin:${x}px -20px"><path d="M${x} -40L${x + a} 46" fill="none" ${I(7)}/><path d="M${x + a - 8} 34l16 4l4 26l-22 -6z" fill="${WOOD}" ${I(3)}/></g>`;
function skiff(x, y, s = 1, crew = "", flip = 0) {
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><ellipse cx="0" cy="34" rx="170" ry="9" fill="#0e2a36" opacity=".35"/><g class="rock">${crew}
    <path d="M-190 -30Q0 30 190 -30L140 32H-140Z" fill="${VIET_C}" ${I()}/><path d="M-160 -2Q0 40 160 -2" fill="none" stroke="#5b3a20" stroke-width="4"/>${oar(-70, -50)}${oar(60, -50)}</g></g>`;
}
const sailor = (who, x, o = {}) => who({ x, y: 14, s: 0.5, flat: 1, ...o });

// tilts and settles a ship into the water around (x, y)
const sinking = (svg, x, y, o = {}, a = 14, dy = 70) => `<g${once(o, "sink", `transform-origin:${x}px ${y}px;--a:${a}deg;--dy:${dy}px;`, `transform:translateY(${dy}px) rotate(${a}deg)`)}>${svg}</g>`;

const blaze = (x, y, s = 1) => `<circle cx="${x}" cy="${y - 40 * s}" r="${170 * s}" fill="url(#glow)"/><g transform="translate(${x} ${y}) scale(${s})"><g class="flick">${[[-46, 0.7], [0, 1], [44, 0.75]].map(([dx, k]) => `<path d="M${dx - 26 * k} 0Q${dx - 38 * k} ${-50 * k} ${dx} ${-104 * k}Q${dx + 38 * k} ${-50 * k} ${dx + 26 * k} 0Z" fill="#f2903c" ${I(4)}/><path d="M${dx - 11 * k} 0Q${dx - 17 * k} ${-30 * k} ${dx} ${-58 * k}Q${dx + 17 * k} ${-30 * k} ${dx + 11 * k} 0Z" fill="#f6d453"/>`).join("")}</g></g>`;

// a volley that keeps flying from (x, y) along (dx, dy)
function arrows(x, y, dx, dy, n = 6, t = 1.1) {
  const rot = (Math.atan2(dy, dx) * 180) / Math.PI;
  return Array.from({ length: n }, (_, i) => `<g class="volley" style="--dx:${dx}px;--dy:${dy}px;--t:${t}s;--d:${(-i * t) / n}s"><g transform="translate(${x + (i % 3) * 26} ${y + ((i * 37) % 60)}) rotate(${rot})"><path d="M-34 0H30" fill="none" ${I(4)}/><path d="M30 -7l16 7l-16 7z" fill="#c8ccd4" ${I(2)}/></g></g>`).join("");
}

const splash = (x, y, s = 1, d = 0) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="splash" style="animation-delay:-${d}s"><path d="M-46 0Q-40 -50 -22 -18Q-10 -76 0 -22Q14 -64 24 -16Q42 -44 46 0Z" fill="#f4fbf8" ${I(3)}/></g></g>`;
const swimmer = (x, y, flip = 0) => `<g transform="translate(${x} ${y}) scale(${flip ? -0.5 : 0.5} 0.5)"><g class="bob"><circle cx="0" cy="-30" r="33" fill="url(#skinG)" ${I(4.5)}/><g transform="translate(0 202)">${ironHelmet()}</g><path d="M-8 -22q8 12 16 0z" fill="#7a2018" ${I(3)}/><circle cx="-12" cy="-34" r="4" fill="${DARK}"/><circle cx="12" cy="-34" r="4" fill="${DARK}"/>${swing(line2("M34 -6Q70 -40 62 -84", "#f0b888", 13), 34, -6, 30, 0.35)}</g><ellipse cx="0" cy="2" rx="56" ry="10" fill="none" stroke="#f4fbf8" stroke-width="5"/></g>`;
const plank = (x, y, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r})"><g class="bob"><rect x="-44" y="-7" width="88" height="14" rx="3" fill="${WOOD}" ${I(4)}/></g></g>`;

const banner = (x, y, h = 260, c = "#b5382a") => `<path d="M${x} ${y}V${y - h}" fill="none" ${I(8)}/>${swing(`<path d="M${x} ${y - h}h110l-26 34l26 34h-110z" fill="${c}" ${I(4)}/>`, x, y - h, 5, 1.1)}`;

// dotted yellow call-outs for the vertical cut
const ring = (x, y, r, d = 0) => pop(`<circle class="spin" style="transform-origin:${x}px ${y}px" cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#ffd83a" stroke-width="7" stroke-dasharray="4 16" stroke-linecap="round"/>`, x, y, d);
function arrow(x1, y1, x2, y2, d = 0) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const tip = (da) => `${x2 - 26 * Math.cos(a + da)} ${y2 - 26 * Math.sin(a + da)}`;
  const mx = (x1 + x2) / 2 - (y2 - y1) * 0.25;
  const my = (y1 + y2) / 2 + (x2 - x1) * 0.25;
  return pop(`<path d="M${x1} ${y1}Q${mx} ${my} ${x2} ${y2}M${tip(0.9)}L${x2} ${y2}L${tip(-0.4)}" fill="none" stroke="#ffd83a" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`, x1, y1, d);
}

function hall(c = "#6a4a3a", floor = "#4a3020") {
  const pillars = [140, 460, 1140, 1460].map((x) => `<rect x="${x - 34}" y="0" width="68" height="700" fill="#8a3b26" ${I()}/><rect x="${x - 44}" y="640" width="88" height="60" fill="#5b2018" ${I()}/>`).join("");
  return `<rect width="1600" height="900" fill="${c}"/><circle cx="800" cy="380" r="560" fill="url(#glow)" opacity=".7"/>${pillars}` + ground(700, floor);
}

const log = (x, y, w = 260, tip = 0) => `<g transform="translate(${x} ${y})"><rect x="0" y="-34" width="${w}" height="34" rx="6" fill="${WOOD}" ${I()}/><ellipse cx="0" cy="-17" rx="9" ry="17" fill="#c9a15a" ${I(4)}/>${tip ? `<path d="M${w} -34l46 17l-46 17z" fill="#b8bec8" ${I(3.5)}/>` : ""}</g>`;
const tree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(10, 2, 90)}<path d="M-22 0L-14 -330H14L22 0Z" fill="#5b3a20" ${I()}/><g class="sway" style="transform-origin:0px 0px"><ellipse cx="0" cy="-360" rx="130" ry="110" fill="#3f6a3a" ${I()}/><ellipse cx="-50" cy="-400" rx="60" ry="44" fill="#5a8a4a" opacity=".6"/></g></g>`;

function rampart(y = 560) {
  const pales = Array.from({ length: 33 }, (_, k) => `<path d="M${k * 50 - 4} ${y - 60}l14 -26l14 26V${y}h-28z" fill="${WOOD}" ${I(4)}/>`).join("");
  return `<path d="M-20 ${y}Q800 ${y - 50} 1620 ${y}V${y + 120}H-20Z" fill="#a8824a" ${I()}/>${pales}
    <rect x="660" y="${y - 250}" width="280" height="250" fill="#8a4a30" ${I()}/><path d="M610 ${y - 250}Q800 ${y - 340} 990 ${y - 250}Z" fill="#8a3b26" ${I()}/><path d="M740 ${y}V${y - 130}Q800 ${y - 180} 860 ${y - 130}V${y}Z" fill="${INK}"/>`;
}
const drum = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(6, 2, 110)}<path d="M-90 0Q-104 -40 -70 -70Q-96 -110 -100 -130H100Q96 -110 70 -70Q104 -40 90 0Z" fill="#b8923a" ${I()}/><path d="M-84 -36H84M-74 -96H74" fill="none" stroke="#5b3a20" stroke-width="4"/><ellipse cx="0" cy="-130" rx="100" ry="20" fill="#d9b85a" ${I()}/></g>`;

// moves a group in from dx; honours the one-shot timing options
const go = (svg, dx, o, t = 12) => (o.at === "start" ? `<g transform="translate(${dx} 0)">${svg}</g>` : o.at === "end" ? svg : move(svg, dx, 0, o.t || t, o.d || 0));
const enter = (o, dx, t) => (o.at === "start" ? { x0: dx } : o.at === "end" ? { x0: 0 } : { x0: 0, walk: [dx, o.t || t, o.d || 0] });
const hanThrone = `<path d="M640 830V330H960V830Z" fill="#1f3f6f" ${I()}/><path d="M690 830V380H910V830Z" fill="#17305a" ${I(4)}/><path d="M604 334H996V296Q800 236 604 296Z" fill="#c9a15a" ${I()}/><circle cx="800" cy="450" r="52" fill="none" stroke="#f2c14e" stroke-width="7"/><circle cx="800" cy="450" r="18" fill="#f2c14e"/>`;
const archer = (x, o = {}) => sailor(VIET, x, { aR: [64, -160], hR: held(64, -160, 0, BOW), wR: [8, 0.5], ...o });
const BATTLE = { top: "#7f9fb8", bot: "#e8d8b0", water: "#2f7078" };

const ART = {
  murder: (o = {}) => {
    const e = enter(o, 440, 6);
    return hall("#4a3a3a", "#33221a") + lamp(330, 240) + throne()
      + DUONG({ x: 760, y: 810, s: 1.2, nod: [6, 1.6], aL: [-30, -150], aR: [30, -150], hR: `<rect x="-34" y="-176" width="68" height="44" rx="4" fill="#f6ead2" ${I(3)}/>` })
      + KIEU({ x: (o.kx || 1180) + e.x0, y: 820, s: 1.2, flip: 1, walk: e.walk, aR: [66, -170], hR: held(66, -170, -24, SWORD), lean: [5, 0.9], nod: [-5, 1.1] });
  },
  march: (o = {}) => sky("#f0b870", "#f8e8b8") + sunDisc(1320, 250) + clouds("#fff6e0", 0.5) + hills("#8fa860") + ground(680, "#b9a060")
    + [220, 400, 580, 760].map((x, i) => VIET({ x, y: 800 + (i % 2) * 34, s: 1.05, aR: [62, -150], hR: held(62, -150, 0, SPEAR), walk: o.at ? null : [-320, o.t || 7, (o.d || 0) + i * 0.25], nod: [3, 0.6, i * 0.2] })).join("")
    + banner(960, 800, 330) + NGO({ x: 1160, y: 820, s: 1.3, aR: [84, -210], hR: held(84, -210, 30, SWORD), wR: [-16, 0.7], nod: [4, 1.2] }),
  court: (o = {}) => hall("#4a3a5a", "#2e2238") + lamp(330, 240) + lamp(1270, 240) + hanThrone
    + HAN({ x: 250, y: 800, s: 1.1, aR: [62, -150], hR: held(62, -150, 0, SPEAR), nod: [3, 1.4] }) + HAN({ x: 1420, y: 800, s: 1.1, flip: 1, aR: [62, -150], hR: held(62, -150, 0, SPEAR), nod: [3, 1.7] })
    + HAN_KING({ x: 800, y: 800, s: 1.25, mood: "angry", aR: [92, -180], wR: [-18, 0.8], nod: [4, 1.3] })
    + THAO({ x: 1130, y: 820, s: 1.15, flip: 1, mood: "smile", lean: [9, 1.4], nod: [8, 1.4], aL: [-20, -150], aR: [20, -150] }),
  fleet: (o = {}) => sky("#6f8fb0", "#e8c890") + clouds("#f4e8d0", 0.5, 120) + islands("#3f4f6a") + sea(400, "#2f6a7f")
    + go(junk(1330, 470, 0.34) + junk(380, 500, 0.42), 150, o, 22)
    + go(junk(1180, 600, 0.6, { crew: sailor(HAN, -60) + sailor(HAN, 40) }), 260, o, 22)
    + go(junk(620, 700, 0.95, { crew: sailor(HAN, -110) + sailor(THAO, -10, { aR: [-80, -190], wR: [14, 0.8], nod: [4, 1] }) + sailor(HAN, 80) }), 360, o, 22),
  plan: (o = {}) => river({ top: "#e8a060", bot: "#f8e0a0", water: "#5f8a8f", sun: [1250, 330, "#f6c453"], rock: "#7a6a6a" }) + bank(660, "#8a7a4a")
    + banner(250, 780, 300) + fire(900, 850, 1.1)
    + NGO({ x: 600, y: 820, s: 1.35, mood: "speak", aR: [96, -196], wR: [-14, 0.9], nod: [4, 1.1], aL: [-40, -120] })
    + VIET({ x: 1090, y: 830, s: 1.2, flip: 1, nod: [7, 1.3], aL: [-20, -140], aR: [20, -140] }) + VIET({ x: 1300, y: 810, s: 1.15, flip: 1, trim: "#b5382a", nod: [6, 1.7, 0.4], lean: [3, 2] }),
  logging: (o = {}) => sky("#a8d8c0", "#f0f0c0") + clouds() + hills("#5f8f5a") + ground(690, "#9a8a50") + tree(160, 720, 0.95) + tree(1480, 730, 0.85) + tree(420, 760, 1.05)
    + DAN({ mood: "firm", x: 590, y: 800, s: 1.15, flip: 1, aR: [70, -176], hR: held(70, -176, 50, AXE), wR: [-46, 0.42], lean: [4, 0.42] })
    + log(760, 790, 300) + log(790, 756, 260) + log(730, 850, 330, 1)
    + blaze(1120, 830, 0.7) + `<rect x="1170" y="790" width="90" height="44" rx="6" fill="${IRON}" ${I()}/>`
    + DAN({ mood: "firm", x: 1350, y: 830, s: 1.15, flip: 1, tunic: "#6a5a4a", aR: [72, -180], hR: held(72, -180, 60, MALLET), wR: [-50, 0.36], nod: [5, 0.36] }),
  planting: (o = {}) => river({ top: "#9fd0d8", bot: "#f6e8b8", water: "#4f9aa0" }) + stakes({ at: "end" }, 0, 600)
    + skiff(700, 640, 0.95, sailor(VIET, -80, { aR: [70, -190], hR: held(70, -190, 70, MALLET), wR: [-60, 0.4] }) + sailor(VIET, 60, { aL: [-50, -130], nod: [5, 0.8] }))
    + stakes({ at: "end" }, 600, 700) + stake(1000, 660, 150, o.at ? { at: o.at } : { sink: 0, t: o.t || 6, d: o.d || 0 }) + stakes({ at: "end" }, 700) + bank(850, "#8a7a4a")
    + NGO({ x: 1330, y: 880, s: 0.85, flip: 1, aR: [70, -180], wR: [-12, 1], nod: [4, 1.2] }),
  highTide: (o = {}) => river({ top: "#2a3a5f", bot: "#9a8ab0", water: "#274a66", sun: [1220, 210, "#f4f0d8"], rock: "#2f3f5a" }) + stakes({ sink: 1, t: 6, ...o }) + bank(860, "#3f4a3a"),
  lure: (o = {}) => river(BATTLE) + stakes({ at: "start" })
    + junk(1460, 500, 0.42) + junk(1130, 590, 0.82, { crew: sailor(HAN, -120) + sailor(THAO, -20, { mood: "shout", aR: [-84, -190], wR: [16, 0.5] }) + sailor(HAN, 70) })
    + skiff(250, 640, 0.7, archer(-70) + sailor(VIET, 60)) + skiff(430, 770, 1, archer(-70) + archer(60, { trim: "#b5382a" }))
    + arrows(540, 640, 420, -90, 7),
  chase: (o = {}) => river(BATTLE) + stakes({ at: "start" })
    + go(junk(1420, 510, 0.45) + junk(980, 570, 0.7, { crew: sailor(HAN, -60) + sailor(HAN, 50) }), 420, o, 14)
    + go(junk(1260, 690, 0.95, { crew: sailor(HAN, -120) + sailor(THAO, -20, { mood: "shout", aR: [-84, -190], wR: [16, 0.5] }) + sailor(HAN, 70) }), 520, o, 14)
    + go(skiff(210, 640, 0.7, sailor(VIET, -70) + sailor(VIET, 60), 1) + skiff(380, 790, 0.95, sailor(VIET, -70) + sailor(VIET, 60, { trim: "#b5382a" }), 1), 460, o, 14),
  ebb: (o = {}) => river({ ...BATTLE, water: "#3f8088" }) + stakes(o, 0, 550)
    + junk(1010, 560, 0.7, { cls: "tremble", crew: sailor(HAN, -60, { mood: "fear" }) + sailor(HAN, 50, { mood: "fear" }) }) + stakes(o, 550, 700)
    + junk(1200, 700, 0.9, { cls: "tremble", crew: sailor(HAN, -120, { mood: "fear" }) + sailor(THAO, -20, { mood: "fear", aL: [-70, -220], aR: [70, -220], wR: [10, 0.3] }) }) + stakes(o, 700)
    + skiff(300, 800, 1.05, sailor(NGO, -40, { s: 0.62, mood: "shout", aR: [80, -230], hR: held(80, -230, 20, SWORD), wR: [-18, 0.5] }) + sailor(VIET, 80, { mood: "shout" })),
  wreck: (o = {}) => river({ top: "#8f8fa8", bot: "#f0c890", water: "#2f6a70" }) + stakes({ at: "end" }, 0, 550)
    + sinking(junk(1230, 550, 0.7, { burn: 1 }), 1230, 550, o, -12, 60) + stakes({ at: "end" }, 550, 700)
    + sinking(junk(700, 650, 0.92, { burn: 1, crew: sailor(HAN, -120, { mood: "fear", aL: [-70, -220], aR: [70, -220], wL: [10, 0.3] }) }), 700, 650, o, 13, 80)
    + splash(520, 690, 1.3) + splash(980, 700, 1.1, 0.5) + splash(1360, 610, 0.9, 0.9) + swimmer(1010, 790) + swimmer(1290, 730, 1) + swimmer(560, 800, 1) + plank(880, 820, 14) + plank(1180, 800, -10)
    + stakes({ at: "end" }, 700) + skiff(240, 800, 0.9, archer(-70) + archer(60, { trim: "#b5382a" })) + arrows(340, 690, 300, -70, 6),
  fall: (o = {}) => river({ top: "#6a6a88", bot: "#e8b080", water: "#2a5a66", rock: "#4a5a6a" }) + stakes({ at: "end" }, 0, 600)
    + sinking(junk(820, 660, 1.15, { burn: 1, crew: sailor(THAO, -30, { s: 0.62, mood: "fear", aL: [-70, -230], aR: [70, -230], wL: [12, 0.3], wR: [-12, 0.3] }) + sailor(HAN, 90, { mood: "fear" }) }), 820, 660, o, 15, 110)
    + splash(520, 720, 1.4) + splash(1150, 730, 1.3, 0.6) + swimmer(380, 800, 1) + plank(1280, 810, 10) + stakes({ at: "end" }, 600),
  retreat: (o = {}) => sky("#7a8a9a", "#d8c8a8") + clouds("#e8e8e8", 0.5) + islands("#4a5a6a") + sea(420, "#4a6a7a")
    + `<g class="away">${junk(1080, 520, 0.4, { flip: 1 })}${junk(1330, 480, 0.3, { flip: 1 })}</g>` + plank(900, 560, 8) + plank(1060, 600, -12) + bank(690, "#7a7560")
    + HAN_KING({ x: 620, y: 830, s: 1.35, mood: "cry", nod: [9, 1.8], aR: [26, -214], lean: [3, 2.2] })
    + HAN({ x: 330, y: 840, s: 1.1, mood: "sad", nod: [8, 2], aR: [62, -150], hR: held(62, -150, 0, SPEAR) }) + HAN({ x: 900, y: 850, s: 1.1, flip: 1, mood: "sad", nod: [8, 2.3, 0.5] }),
  crown: (o = {}) => sky("#f6c060", "#fdf0c0") + dongson(800, 230, 190, "#fffaf0", 0.55) + clouds("#fffaf0", 0.5, 150) + rampart(560) + ground(650, "#c9a868")
    + banner(300, 640, 300) + banner(1300, 640, 300, "#f2c14e") + drum(470, 850, 1)
    + VIET({ mood: "smile", x: 330, y: 850, s: 1.05, aR: [74, -170], hR: held(74, -170, 60, MALLET), wR: [-40, 0.4], nod: [4, 0.4] })
    + KING_NGO({ x: 800, y: 840, s: 1.4, aL: [-80, -230], aR: [80, -230], wL: [8, 0.8], wR: [-8, 0.8], nod: [3, 1.2] })
    + VIET({ x: 1120, y: 840, s: 1.05, flip: 1, body: "jump", mood: "open", aL: [-60, -230], aR: [60, -230] }) + DAN({ x: 1290, y: 860, s: 1.05, flip: 1, body: "jump", mood: "open", aR: [60, -230], wR: [10, 0.4] }) + VIET({ x: 1450, y: 840, s: 1, flip: 1, trim: "#b5382a", mood: "open", aL: [-60, -230], wL: [10, 0.4], nod: [4, 0.5] }),
};
