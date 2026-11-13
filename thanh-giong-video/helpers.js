const INK = "#3a2418";
const SKIN = "#e0a878";
const DARK = "#231510";
const SAND = "M-20 600Q400 520 800 560T1620 540V920H-20Z";
let uid = 0;
const SHOTS = [];

const I = (w = 5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const shade = (d) => `<path d="${d}" fill="url(#fadeDown)"/>`;
const shadow = (x, y, rx, ry = rx / 7) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#3a2010" opacity=".3"/>`;

function sky(top, bottom) {
  const id = "sky" + uid++;
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs><rect width="1600" height="900" fill="url(#${id})"/>`;
}

const clouds = (c = "#ffffff", o = 0.5, y = 140) => `<g class="cloud" fill="${c}" opacity="${o}"><ellipse cx="300" cy="${y}" rx="190" ry="16"/><ellipse cx="420" cy="${y + 22}" rx="130" ry="11"/><ellipse cx="1080" cy="${y + 70}" rx="230" ry="15"/><ellipse cx="1330" cy="${y - 30}" rx="150" ry="11"/><ellipse cx="760" cy="${y + 150}" rx="170" ry="10"/></g>`;

const sunDisc = (x, y, c = "#f6c453") => `<circle cx="${x}" cy="${y}" r="380" fill="url(#glow)"/><circle cx="${x}" cy="${y}" r="74" fill="${c}"/>`;

const glints = (x) => `<g class="glint" fill="#fff0b0">${[[412, 120], [432, 170], [456, 110], [482, 190], [510, 100]].map(([y, w]) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="8" rx="4"/>`).join("")}</g>`;

const islands = (c = "#4a5a7a") => `<path d="M930 402q70 -46 150 -30q60 -34 120 4q50 6 90 26Z" fill="${c}" opacity=".5"/><path d="M1350 402q50 -30 110 -18q50 -8 90 18Z" fill="${c}" opacity=".38"/>`;

function sea(y, color = "#2f7f8f") {
  let waves = "";
  for (let i = 0; i < 4; i++) {
    const yy = y + 28 + i * 45;
    let d = `M-200 ${yy}`;
    for (let k = 0; k < 20; k++) d += " q25 -14 50 0 t50 0";
    waves += `<path class="wave" style="animation-delay:-${i * 0.9}s" d="${d}" fill="none" stroke="#e8f3ee" stroke-width="4" stroke-linecap="round" opacity=".45"/>`;
  }
  return `<rect y="${y}" width="1600" height="${900 - y}" fill="${color}"/><rect y="${y}" width="1600" height="26" fill="#ffffff" opacity=".16"/><rect y="${y}" width="1600" height="${900 - y}" fill="url(#fadeDown)"/>${waves}`;
}

const sand = (c = "#ecd29a") => `<path class="foam" d="M-40 602Q380 522 800 562T1640 542" fill="none" stroke="#fff8e8" stroke-width="16" stroke-linecap="round" opacity=".8"/>
  <path d="${SAND}" fill="${c}"/><path d="M-20 600Q400 520 800 560T1620 540V584Q1200 602 800 602T-20 646Z" fill="#8a6238" opacity=".3"/>${shade(SAND)}
  <g fill="#8a6238" opacity=".45">${[[520, 700, 5], [640, 850, 6], [930, 690, 4], [1010, 870, 5], [1420, 700, 6], [1500, 850, 4], [160, 760, 5], [1260, 880, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g>`;

function beach({ top = "#8fd0e0", bot = "#f6e7b8", sun = null, seaC = "#2f7f8f", sandC = "#ecd29a", cloud = "#ffffff" } = {}) {
  return sky(top, bot) + (sun ? sunDisc(sun[0], sun[1], sun[2]) : "") + clouds(cloud, 0.5) + islands() + sea(400, seaC) + (sun ? glints(sun[0]) : "") + sand(sandC);
}

function hills(color = "#7fa86a") {
  const near = "M-20 520Q300 380 620 500T1200 470T1620 500V920H-20Z";
  const trees = [[140, 470], [250, 440], [520, 470], [980, 470], [1100, 452], [1450, 478]].map(([x, y]) => `<path d="M${x} ${y}v-26" fill="none" ${I(5)}/><circle cx="${x}" cy="${y - 44}" r="26" fill="#4f8a4a" ${I(4)}/>`).join("");
  return `<path d="M-20 470Q200 330 460 430T900 380T1320 400T1620 380V920H-20Z" fill="${color}" opacity=".45"/>${trees}<path d="${near}" fill="${color}" ${I()}/>${shade(near)}`;
}

function dongson(x, y, r, color = "#f2c14e", o = 0.5) {
  const star = Array.from({ length: 24 }, (_, i) => {
    const a = (i * Math.PI) / 12;
    const rr = i % 2 ? r * 0.2 : r * 0.44;
    return `${(Math.sin(a) * rr).toFixed(1)} ${(-Math.cos(a) * rr).toFixed(1)}`;
  }).join(" ");
  const ticks = Array.from({ length: 24 }, (_, i) => `<path d="M0 ${-r * 0.62}V${-r * 0.76}" transform="rotate(${i * 15})"/>`).join("");
  return `<g transform="translate(${x} ${y})" fill="none" stroke="${color}" stroke-width="${Math.max(3, r / 30)}" opacity="${o}"><circle r="${r}"/><circle r="${r * 0.86}"/><circle r="${r * 0.54}"/>${ticks}<polygon points="${star}" fill="${color}"/></g>`;
}

function melon(x, y, r = 60, mark = 0) {
  const k = r / 100;
  return `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="14" cy="92" rx="112" ry="16" fill="#3a2010" opacity=".28"/><ellipse rx="110" ry="96" fill="#2e6b3a" ${I(5 / k)}/>
    <path d="M-58 -78q-28 78 0 156M58 -78q28 78 0 156${mark ? "" : "M0 -92q-32 92 0 184"}" fill="none" stroke="#1d4627" stroke-width="11" stroke-linecap="round"/>
    <path d="M-78 -40q14 -34 46 -44" fill="none" stroke="#bfe8a8" stroke-width="10" stroke-linecap="round" opacity=".7"/>
    ${mark ? `<path d="M-20 -14l20 -24l20 24M0 -38v62M-22 26h44" fill="none" stroke="#f3e6c4" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>` : ""}</g>`;
}

function melonCut(x, y, r = 150) {
  const k = r / 150;
  const seeds = [0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<ellipse cx="0" cy="-90" rx="6" ry="10" fill="${DARK}" transform="rotate(${a})"/>`).join("");
  return `<g transform="translate(${x} ${y}) scale(${k})"><circle r="150" fill="#2e6b3a" ${I(5 / k)}/><circle r="136" fill="#cfe6a8"/><circle r="124" fill="#d8322f"/><circle r="60" fill="#e2403a"/><path d="M-96 -40a104 104 0 0 1 60 -64" fill="none" stroke="#ff9a8a" stroke-width="12" stroke-linecap="round" opacity=".6"/>${seeds}</g>`;
}

function slice(x, y, s = 1, rot = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-50 0a50 50 0 0 0 100 0z" fill="#d8322f" ${I(4)}/><path d="M-50 0a50 50 0 0 0 100 0" fill="none" stroke="#2e6b3a" stroke-width="9"/><path d="M-38 6a38 38 0 0 0 26 30" fill="none" stroke="#ff9a8a" stroke-width="6" stroke-linecap="round" opacity=".7"/>
    <circle cx="-14" cy="14" r="4" fill="${DARK}"/><circle cx="4" cy="24" r="4" fill="${DARK}"/><circle cx="20" cy="14" r="4" fill="${DARK}"/></g>`;
}

function vine(x, y, w, flowers = 0) {
  const seg = w / 6;
  let d = `M${x} ${y}`;
  let leaves = "";
  for (let i = 0; i < 6; i++) d += ` q${seg / 2} ${i % 2 ? -26 : 26} ${seg} 0`;
  for (let i = 0; i <= 6; i++) {
    const t = `transform="translate(${x + i * seg} ${y}) rotate(${i % 2 ? 40 : -40})"`;
    leaves += `<path d="M0 0q-22 -30 0 -52q22 22 0 52z" fill="${i % 3 ? "#4f9a4a" : "#6bb05a"}" ${I(3)} ${t}/><path d="M0 -4v-40" fill="none" stroke="#2e6b3a" stroke-width="2" ${t}/>`;
    if (flowers && i % 2) leaves += `<circle cx="${x + i * seg + 14}" cy="${y + 16}" r="9" fill="#f2c14e" ${I(3)}/>`;
  }
  return `<path d="${d}" fill="none" stroke="#2e6b3a" stroke-width="9" stroke-linecap="round"/>${leaves}`;
}

function palm(x, y, s = 1) {
  const fronds = [-10, -50, 28, -88].map((a, i) => `<use href="#frond" transform="translate(0 -300) rotate(${a}) scale(${0.8 - i * 0.05})"/>`).join("")
    + [-20, -62].map((a) => `<use href="#frond" transform="translate(0 -300) scale(-1 1) rotate(${a}) scale(.7)"/>`).join("");
  const rings = [-60, -120, -180, -240].map((yy) => `<path d="M-14 ${yy}q10 6 22 0" fill="none" stroke="#5b3a20" stroke-width="4"/>`).join("");
  return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(40, 2, 90)}<path d="M0 0q-30 -150 0 -300" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M0 0q-30 -150 0 -300" fill="none" stroke="#8a5a34" stroke-width="20" stroke-linecap="round"/>${rings}<g class="sway" fill="#3f8a4a" ${I(4)}>${fronds}</g></g>`;
}

const palmFg = (x = 0, flip = 0) => `<g transform="translate(${x} 0) scale(${flip ? -1 : 1} 1)" fill="#2a1a2e"><path d="M30 920C60 700 130 430 215 250L245 262C180 440 130 700 120 920Z"/><g class="sway" style="transform-origin:215px 250px">${[-10, -50, 28, -88].map((a, i) => `<use href="#frond" transform="translate(215 250) rotate(${a}) scale(${1 - i * 0.07})"/>`).join("")}<use href="#frond" transform="translate(215 250) scale(-1 1) rotate(-20) scale(.8)"/><use href="#frond" transform="translate(215 250) scale(-1 1) rotate(-62) scale(.7)"/></g></g>`;

function house(x, y, s = 1, wall = "#c98b4a", roof = "#8a3b26") {
  const planks = [-120, -80, 80, 120].map((px) => `<path d="M${px} -228V-102" fill="none" stroke="#5b3a20" stroke-width="3" opacity=".5"/>`).join("");
  return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(20, 2, 200)}<path d="M-130 0V-110M-45 0V-110M45 0V-110M130 0V-110" fill="none" ${I(12)}/>
    <rect x="-160" y="-230" width="320" height="130" fill="${wall}" ${I()}/>${planks}<rect x="-160" y="-230" width="320" height="34" fill="#2a1608" opacity=".3"/>
    <rect x="-30" y="-190" width="60" height="90" fill="${INK}"/><path d="M-30 -100L-44 0M30 -100L44 0M-34 -66h68M-39 -33h78" fill="none" ${I(5)}/>
    <path d="M-230 -330Q-200 -250 -170 -230H170Q200 -250 230 -330Q0 -290 -230 -330Z" fill="${roof}" ${I()}/>
    <path d="M-190 -292Q0 -262 190 -292M-178 -262Q0 -240 178 -262" fill="none" stroke="#2a1608" stroke-width="4" opacity=".4"/>
    <path d="M-230 -330q-14 -22 6 -36M230 -330q14 -22 -6 -36" fill="none" ${I(7)}/></g>`;
}

function hut(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(30, 2, 150)}<path d="M-125 0L0 -160L125 0Z" fill="#b98d4a" ${I()}/><path d="M0 -160L125 0H30Z" fill="#2a1608" opacity=".18"/>
    <path d="M-60 -78L-90 0M0 -160V-60M60 -78L90 0M-30 -120L-50 -60M30 -120L50 -60" fill="none" ${I(3)}/><path d="M-28 0V-70h56V0Z" fill="${INK}"/></g>`;
}

function boat(x, y, s = 1, sail = "#f3e6c4", crew = "", cls = "rock") {
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="46" rx="150" ry="10" fill="#0e2a36" opacity=".35"/><g class="${cls}"><path d="M0 0V-230" fill="none" ${I(9)}/><path d="M8 -225Q140 -125 8 -35Z" fill="${sail}" ${I()}/><path d="M8 -180Q84 -150 92 -128M8 -130Q70 -112 82 -92M8 -80Q50 -70 56 -62" fill="none" stroke="#8a5a34" stroke-width="4" opacity=".6"/>${crew}
    <path d="M-170 -14Q0 44 170 -14L125 44H-125Z" fill="#8a5a34" ${I()}/><path d="M-150 6Q0 54 150 6" fill="none" stroke="#5b3a20" stroke-width="4"/><path d="M-170 -14q-16 -20 -6 -40M170 -14q16 -20 6 -40" fill="none" ${I(8)}/></g></g>`;
}

const bird = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s * 0.55})"><use href="#gull" class="flap" style="animation-delay:-${(x % 5) / 10}s" fill="#fffaf0" stroke="${INK}" stroke-width="5"/></g>`;

const birdSit = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(6, 8, 40)}<path d="M-6 -4v12M8 -4v12" fill="none" stroke="#b5682a" stroke-width="3"/><g class="peck" style="animation-delay:-${(x % 4) / 8}s"><ellipse cx="0" cy="-24" rx="34" ry="22" fill="#fffaf0" ${I(3)}/><path d="M-30 -30q-26 -4 -40 12q24 0 40 -4z" fill="#d9d4c8" ${I(3)}/><circle cx="30" cy="-44" r="14" fill="#fffaf0" ${I(3)}/><path d="M42 -42l20 8l-20 4z" fill="#f2a03c" ${I(2)}/><circle cx="34" cy="-47" r="3" fill="${DARK}"/></g></g>`;

const fire = (x, y, s = 1) => `<circle cx="${x}" cy="${y - 30 * s}" r="${150 * s}" fill="url(#glow)"/><g transform="translate(${x} ${y}) scale(${s})"><path d="M-50 6L50 -8M-50 -8L50 6" fill="none" ${I(10)}/><g class="flick"><path d="M-28 -4Q-40 -50 0 -100Q40 -50 28 -4Z" fill="#f2903c" ${I(4)}/><path d="M-12 -4Q-18 -30 0 -56Q18 -30 12 -4Z" fill="#f6d453"/></g></g>`;

const lamp = (x, y) => `<circle cx="${x}" cy="${y}" r="230" fill="url(#glow)"/><g transform="translate(${x} ${y})"><path d="M0 -${y}V10" fill="none" ${I(4)}/><path d="M-22 14h44l-8 16h-28z" fill="#c9a15a" ${I(4)}/><g class="flick"><path d="M-12 14Q-18 -10 0 -34Q18 -10 12 14Z" fill="#f6d453" ${I(3)}/></g></g>`;

const basket = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(6, 2, 46)}<path d="M-36 0L-44 -46H44L36 0Z" fill="#c9a15a" ${I(4)}/><path d="M-42 -30h84M-39 -14h78M-20 -46L-16 0M0 -46V0M20 -46L16 0" fill="none" ${I(2)}/></g>`;

const sack = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(6, 2, 44)}<path d="M-34 0Q-48 -50 -14 -70H14Q48 -50 34 0Z" fill="#e9d9a6" ${I(4)}/><path d="M6 -66Q40 -46 28 -2H10Z" fill="#2a1608" opacity=".14"/><path d="M-14 -70q14 12 28 0" fill="none" ${I(3)}/></g>`;

const throne = (c = "#c9a15a") => dongson(800, 330, 300, "#f2c14e", 0.35) + `<path d="M620 830V300Q800 200 980 300V830Z" fill="${c}" ${I()}/><path d="M670 830V340Q800 270 930 340V830Z" fill="#8a3b26" ${I(4)}/><path d="M800 300V830" fill="none" stroke="#2a1608" stroke-width="3" opacity=".3"/><circle cx="800" cy="262" r="22" fill="#f2c14e" ${I(4)}/><path d="M620 300q-30 -30 -10 -60M980 300q30 -30 10 -60" fill="none" ${I(8)}/>`;

function altar() {
  const blossom = (x, y) => `<g transform="translate(${x} ${y})">${[[0, -13], [12, -4], [8, 11], [-8, 11], [-12, -4]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="10" fill="#f29bb0" ${I(3)}/>`).join("")}<circle r="6" fill="#f2c14e" ${I(2)}/></g>`;
  const cake = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-62" y="-50" width="124" height="100" rx="8" fill="#5f8f4a" ${I()}/><rect x="20" y="-50" width="42" height="100" rx="8" fill="#2a1608" opacity=".16"/><path d="M-62 -17H62M-62 17H62M-21 -50V50M21 -50V50" fill="none" stroke="#e9d9a6" stroke-width="4"/></g>`;
  const dots = (x) => [150, 250, 350, 450].map((y) => `<circle cx="${x}" cy="${y}" r="22" fill="#f2c14e"/><circle cx="${x}" cy="${y}" r="11" fill="none" stroke="#b5382a" stroke-width="3"/>`).join("");
  return sky("#f6e4b4", "#dba95c") + dongson(800, 300, 250, "#b5382a", 0.22) + `<circle cx="800" cy="390" r="330" fill="url(#glow)"/>`
    + `<rect x="120" y="60" width="110" height="470" fill="#b5382a" ${I()}/><rect x="1370" y="60" width="110" height="470" fill="#b5382a" ${I()}/>${dots(175)}${dots(1425)}
    <rect x="-10" y="640" width="1620" height="270" fill="#9c3a26" ${I()}/><rect x="-10" y="640" width="1620" height="38" fill="#b9492f" ${I()}/><rect x="-10" y="678" width="1620" height="232" fill="url(#fadeDown)"/>
    ${shadow(800, 646, 60)}<path d="M770 640q-10 -70 30 -70t30 70z" fill="#c9a15a" ${I()}/>
    <path d="M790 572L776 400M800 570V380M810 572L826 400" fill="none" stroke="#8a2f22" stroke-width="5" stroke-linecap="round"/>
    <circle cx="776" cy="398" r="5" fill="#ff7a3c"/><circle cx="800" cy="378" r="5" fill="#ff7a3c"/><circle cx="826" cy="398" r="5" fill="#ff7a3c"/>
    <path class="smoke" d="M776 390q-18 -30 0 -60t0 -60"/><path class="smoke" style="animation-delay:1.6s" d="M800 370q18 -30 0 -60t0 -60"/><path class="smoke" style="animation-delay:3.1s" d="M826 390q-18 -30 0 -60t0 -60"/>
    ${shadow(350, 646, 80)}<path d="M300 640q-40 -90 0 -150h100q40 60 0 150z" fill="#2f5d7c" ${I()}/><path d="M312 540h76" stroke="#e9d9a6" stroke-width="6"/><path d="M380 500q30 60 6 132" fill="none" stroke="#9fd0e6" stroke-width="7" stroke-linecap="round" opacity=".5"/>
    <path d="M350 490C340 380 300 300 250 220M338 400C390 340 430 300 500 270M312 320C280 300 240 300 200 310M420 320C440 270 440 230 430 190" fill="none" ${I(9)}/>
    ${[[250, 220], [500, 270], [200, 310], [430, 190], [385, 352], [300, 300], [455, 300], [325, 430], [228, 262], [470, 232]].map(([a, b]) => blossom(a, b)).join("")}
    <ellipse class="petal" cx="260" cy="240" rx="9" ry="6"/><ellipse class="petal" style="animation-delay:2.2s" cx="440" cy="210" rx="9" ry="6"/><ellipse class="petal" style="animation-delay:4.1s" cx="500" cy="290" rx="9" ry="6"/>
    <ellipse cx="1210" cy="640" rx="210" ry="26" fill="#c9a15a" ${I()}/>${cake(1140, 582)}${cake(1280, 582)}${cake(1210, 488)}`
    + melon(1010, 560, 108) + shadow(810, 760, 170, 18) + melonCut(800, 610, 150);
}
