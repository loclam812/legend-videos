const ground = (y, c) => `<rect x="-10" y="${y}" width="1620" height="${910 - y}" fill="${c}" ${I()}/><rect x="-10" y="${y}" width="1620" height="${910 - y}" fill="url(#fadeDown)"/>`;
const move = (svg, dx, dy, t, d = 0) => `<g class="walk" style="--dx:${dx}px;--dy:${dy}px;--t:${t}s;--d:${d}s">${svg}</g>`;
const line2 = (d, c, w) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 8}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

const leafHat = `<path d="M-34 -254q34 -15 68 0" fill="none" stroke="${INK}" stroke-width="14"/><path d="M-34 -254q34 -15 68 0" fill="none" stroke="#3f8a4a" stroke-width="8"/>`
  + [[-20, -24], [0, 0], [20, 24]].map(([x, a]) => `<path d="M0 0q-11 -17 0 -34q11 17 0 34z" fill="#6bb05a" ${I(3)} transform="translate(${x} -262) rotate(${a})"/>`).join("");
const finHat = `<path d="M-28 -258L-18 -300L-6 -266L4 -314L14 -266L26 -298L32 -256Z" fill="#3fa0c8" ${I(3.5)}/><path d="M-34 -254q34 -15 68 0" fill="none" stroke="${INK}" stroke-width="14"/><path d="M-34 -254q34 -15 68 0" fill="none" stroke="#9fe0f0" stroke-width="8"/>`;
const flowerHat = `<path d="M-34 -254q34 -15 68 0" fill="none" stroke="#f2c14e" stroke-width="7"/>` + [-27, 27].map((x) => `<circle cx="${x}" cy="-256" r="9" fill="#f29bb0" ${I(3)}/><circle cx="${x}" cy="-256" r="3.5" fill="#f2c14e"/>`).join("");

const ST = (o) => person({ name: "Sơn Tinh", tunic: "#4f7a3a", trim: "#e2b04a", hat: leafHat, ...o });
const TT = (o) => person({ name: "Thủy Tinh", tunic: "#1f5f8a", trim: "#9fe0f0", tone: ["#a8d8e8", "#7fb4cc"], hair: "long", hat: finHat, mood: "angry", ...o });
const MN = (o) => person({ name: "Mị Nương", tunic: "#c8456b", trim: "#f2c14e", long: 1, hair: "long", hat: flowerHat, ...o });

function mountain(x, y, w, h, c = "#5f8f5a") {
  const a = w / 2;
  const trees = [[-0.28, 0.28], [-0.12, 0.5], [0.2, 0.34], [0.05, 0.16], [-0.34, 0.1]].map(([px, py]) => `<circle cx="${px * w}" cy="${-py * h}" r="${w / 34}" fill="#3f7a44" opacity=".7"/>`).join("");
  return `<g transform="translate(${x} ${y})"><path d="M${-a} 0Q${-a / 2} ${-h * 0.5} ${-w * 0.08} ${-h * 0.92}Q0 ${-h * 1.05} ${w * 0.08} ${-h * 0.92}Q${a / 2} ${-h * 0.5} ${a} 0Z" fill="${c}" ${I()}/>
    <path d="M${w * 0.08} ${-h * 0.92}Q${a / 2} ${-h * 0.5} ${a} 0H${w * 0.14}Q${w * 0.2} ${-h * 0.5} ${w * 0.08} ${-h * 0.92}Z" fill="#2a1608" opacity=".2"/>
    <path d="M${-w * 0.08} ${-h * 0.92}Q0 ${-h * 1.05} ${w * 0.08} ${-h * 0.92}Q${w * 0.04} ${-h * 0.8} 0 ${-h * 0.86}Q${-w * 0.04} ${-h * 0.8} ${-w * 0.08} ${-h * 0.92}Z" fill="#f3f0e4" ${I(3)}/>${trees}</g>`;
}

function bigWave(y, c = "#2f6f8f", h = 60, speed = 2) {
  let crest = "";
  let foam = "";
  for (let k = 0; k < 22; k++) { crest += ` q50 -${h} 100 0`; foam += ` q50 -${h * 0.6} 100 0`; }
  return `<g class="wave" style="animation-duration:${speed}s"><path d="M-200 1300V${y}${crest}V1300Z" fill="${c}" ${I()}/><path d="M-200 ${y + 30}${foam}" fill="none" stroke="#e8f6ff" stroke-width="7" stroke-linecap="round" opacity=".6"/><path d="M-200 ${y + 90}${foam}" fill="none" stroke="#e8f6ff" stroke-width="5" stroke-linecap="round" opacity=".35"/><rect x="-200" y="${y}" width="2300" height="${1300 - y}" fill="url(#fadeDown)"/></g>`;
}

function rain(o = 0.5) {
  let drops = "";
  for (let i = 0; i < 90; i++) drops += `<path d="M${((i * 137) % 1900) - 100} ${((i * 263) % 1100) - 200}l-14 46"/>`;
  return `<g class="rain" fill="none" stroke="#dff3ff" stroke-width="3" stroke-linecap="round" opacity="${o}">${drops}</g>`;
}

const lightning = (x, d = 0) => `<g class="flash" style="animation-delay:${d}s"><rect width="1600" height="900" fill="#ffffff" opacity=".3"/><path d="M${x} 0l-46 170h52l-64 190l132 -236h-54l44 -124z" fill="#fff8c0" ${I(3)}/></g>`;

const stormClouds = (c = "#3a4050") => `<g class="cloud" fill="${c}">${[[120, 70, 150], [330, 110, 120], [560, 60, 160], [820, 100, 140], [1060, 60, 150], [1300, 110, 130], [1500, 60, 150], [700, 20, 200], [1180, 10, 180], [240, 10, 170]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.55}"/>`).join("")}</g>`;

function elephant(x, y, s = 1) {
  const tusks = [0, 1, 2, 3, 4].map((k) => `<path d="M132 -128q${30 + k * 9} ${34 - k * 13} ${70 + k * 5} ${6 - k * 20}" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M132 -128q${30 + k * 9} ${34 - k * 13} ${70 + k * 5} ${6 - k * 20}" fill="none" stroke="#fffaf0" stroke-width="7" stroke-linecap="round"/>`).join("");
  return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(20, 2, 170)}<g class="bob">
    <path d="M-104 -150q-34 30 -20 80" fill="none" ${I(8)}/>
    <g fill="#8f9096" ${I()}><rect x="-86" y="-90" width="44" height="90" rx="10"/><rect x="34" y="-90" width="44" height="90" rx="10"/></g>
    <ellipse cx="0" cy="-140" rx="112" ry="76" fill="#a2a3aa" ${I()}/>
    <g fill="#a2a3aa" ${I()}><rect x="-40" y="-90" width="44" height="90" rx="10"/><rect x="72" y="-96" width="44" height="96" rx="10"/></g>
    <path d="M-80 -196q80 -40 160 0v70h-160z" fill="#b5382a" ${I(4)}/><path d="M-80 -126h160" fill="none" stroke="#f2c14e" stroke-width="8"/>
    <circle cx="112" cy="-178" r="60" fill="#a2a3aa" ${I()}/>
    ${line2("M156 -160q46 40 22 118q-6 18 -24 8", "#a2a3aa", 24)}
    ${tusks}
    <ellipse cx="74" cy="-180" rx="32" ry="50" fill="#86878e" ${I()}/>
    <circle cx="134" cy="-192" r="6" fill="${DARK}"/><path d="M96 -236q20 -12 40 0" fill="none" stroke="#f2c14e" stroke-width="7"/>
  </g></g>`;
}

function horse(x, y, s = 1) {
  const mane = Array.from({ length: 9 }, (_, k) => `<path d="M${58 + k * 7} ${-150 - k * 9}q-26 -6 -34 12" fill="none" stroke="#d8322f" stroke-width="7" stroke-linecap="round"/>`).join("");
  return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(10, 2, 130)}<g class="bob">
    ${line2("M-92 -120q-40 20 -34 76", "#d8322f", 12)}
    ${line2("M-64 -90V-6M52 -90V-6", "#8a5a34", 15)}
    <ellipse cx="0" cy="-112" rx="94" ry="46" fill="#a8703f" ${I()}/>
    ${line2("M-36 -84V-6M78 -86V-6", "#a8703f", 15)}
    <path d="M50 -140L104 -226L140 -204L92 -96Z" fill="#a8703f" ${I()}/>
    <path d="M96 -236q36 -22 72 12q6 18 -12 22l-56 -4z" fill="#a8703f" ${I()}/>
    <path d="M100 -240l-4 -26l18 16z" fill="#a8703f" ${I(4)}/>
    ${mane}<circle cx="134" cy="-224" r="5" fill="${DARK}"/>
    <path d="M-50 -150q50 -20 100 0v46h-100z" fill="#f2c14e" ${I(4)}/>
  </g></g>`;
}

function rooster(x, y, s = 1) {
  const spurs = [0, 1, 2, 3].map((k) => `<path d="M-8 ${-6 - k * 8}l-10 -4M10 ${-6 - k * 8}l10 -4" fill="none" ${I(2.5)}/>`).join("");
  return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(4, 2, 44)}
    <path d="M-8 -34V0l-10 6M-8 0l8 8M10 -34V0l-8 8M10 0l10 6" fill="none" stroke="#f2a03c" stroke-width="5" stroke-linecap="round"/>${spurs}
    <g class="peck"><path d="M-30 -60q-50 -50 -64 -8M-30 -54q-56 -20 -58 20M-28 -48q-40 4 -44 36" fill="none" stroke="#1d4627" stroke-width="12" stroke-linecap="round"/>
    <ellipse cx="0" cy="-58" rx="38" ry="30" fill="#c8552a" ${I(4)}/><path d="M-20 -64q20 -22 40 0" fill="none" stroke="#f2c14e" stroke-width="7" stroke-linecap="round"/>
    <path d="M22 -70L34 -108" fill="none" stroke="${INK}" stroke-width="26" stroke-linecap="round"/><path d="M22 -70L34 -108" fill="none" stroke="#c8552a" stroke-width="18" stroke-linecap="round"/>
    <circle cx="36" cy="-112" r="16" fill="#c8552a" ${I(4)}/><path d="M24 -126q4 -16 12 -6q6 -14 12 0q8 -8 6 8z" fill="#d8322f" ${I(3)}/>
    <path d="M50 -112l18 5l-18 5z" fill="#f2a03c" ${I(2.5)}/><path d="M44 -100q4 14 -4 16z" fill="#d8322f"/><circle cx="40" cy="-115" r="3" fill="${DARK}"/></g></g>`;
}

const cakeTray = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(4, 4, 80)}<ellipse cx="0" cy="-4" rx="78" ry="14" fill="#c9a15a" ${I(4)}/>
  ${[[-44, -30], [8, -30], [-18, -64]].map(([a, b]) => `<rect x="${a}" y="${b - 26}" width="44" height="34" rx="5" fill="#5f8f4a" ${I(3)}/><path d="M${a} ${b - 9}h44M${a + 22} ${b - 26}v34" fill="none" stroke="#e9d9a6" stroke-width="3"/>`).join("")}
  <path d="M40 -8q-4 -40 22 -40q26 0 22 40z" fill="#fffaf0" ${I(3)}/></g>`;

const courtyard = (top, bot, extra = "") => sky(top, bot) + extra + hills() + house(1370, 640, 1.1) + ground(640, "#d9a85c");
const hall = (c = "#7a3b22") => `<rect width="1600" height="900" fill="${c}"/><circle cx="800" cy="420" r="520" fill="url(#glow)"/><path d="M250 0V830M1350 0V830" fill="none" stroke="#4d2a18" stroke-width="50"/>` + throne() + `<rect x="-10" y="830" width="1620" height="80" fill="#4d2a18" ${I()}/>` + lamp(330, 330) + lamp(1270, 330);

SHOTS.push({
  label: "1",
  mood: "tense", sfx: [[0, "rain", 12.5], [2.8, "thunder"], [6, "thunder"], [9.2, "thunder"]],
  art: sky("#2f3a52", "#7f8c96") + mountain(1250, 900, 760, 520, "#4f7260") + mountain(800, 900, 1100, 660, "#5f8a66") + stormClouds() + bigWave(760, "#3f6f8a", 70, 1.6) + rain(0.55) + lightning(420) + lightning(1180, 1.4),
  cam: [[800, 450, 1], [800, 400, 1.5]],
  lines: [
    [null, "Hằng năm, cứ đến mùa mưa, nước sông lại dâng cao, bão lũ ầm ầm kéo đến."],
    [null, "Người xưa kể rằng, đó là cơn giận của một vị thần, bắt đầu từ một lời cầu hôn."],
  ],
});

SHOTS.push({
  label: "2",
  mood: "calm",
  art: hall()
    + KING({ x: 720, y: 850, s: 1.5, aL: [-70, -160], wL: [-12, 1], nod: [-6, 1.4] })
    + MN({ x: 1000, y: 860, s: 1.3, walk: [380, 3.4], nod: [7, 1.3, 3.4], aL: [-30, -150], aR: [30, -150] }),
  cam: [[800, 450, 1], [860, 520, 1.9]],
  lines: [
    [null, "Vua Hùng thứ mười tám có một người con gái tên là Mị Nương, xinh đẹp, hiền dịu."],
    ["Vua Hùng", "Ta phải tìm cho con một người chồng thật xứng đáng."],
  ],
});

SHOTS.push({
  label: "3",
  mood: "bright",
  art: sky("#8fd0e0", "#f8e6b0") + sunDisc(1300, 180) + clouds()
    + move(mountain(260, 660, 420, 330, "#6f9a5a"), 0, 400, 3, 3) + move(mountain(620, 660, 520, 430, "#5f8f5a"), 0, 500, 3.4, 4.6) + move(mountain(980, 660, 400, 300, "#7fa86a"), 0, 380, 3, 6.4)
    + ground(640, "#d9a85c") + house(1420, 700, 1)
    + ST({ x: 480, y: 830, s: 1.3, walk: [-360, 2.8], aL: [-70, -236], aR: [70, -236], wL: [24, 0.7, 2.8], wR: [-24, 0.7, 2.8], nod: [-6, 1.2] })
    + KING({ x: 1130, y: 840, s: 1.05, mood: "open", nod: [-8, 1.5] }) + MN({ x: 1250, y: 846, s: 0.95, mood: "open", aR: [40, -196], aL: [-40, -196] }),
  cam: [[560, 520, 1.5], [800, 450, 1]],
  lines: [
    [null, "Một hôm, có hai chàng trai đến cầu hôn. Người thứ nhất là Sơn Tinh, chúa vùng non cao."],
    [null, "Chàng vẫy tay về phía đông, phía đông nổi cồn bãi. Vẫy tay về phía tây, phía tây mọc lên từng dãy núi đồi."],
  ],
});

SHOTS.push({
  label: "4",
  mood: "tense", sfx: [[0, "rain", 10], [2.8, "thunder"], [6, "thunder"], [9.2, "thunder"]],
  art: sky("#3b4a6a", "#9aa6ac") + hills("#6f8f6a") + house(230, 700, 1) + ground(640, "#b99a66")
    + move(stormClouds(), 900, 0, 5) + move(bigWave(700, "#2f6f8f", 60, 1.8), 0, 260, 5, 3)
    + KING({ x: 420, y: 800, s: 1.05, mood: "open", lean: [-7, 1.4], nod: [6, 1] }) + MN({ x: 540, y: 806, s: 0.95, mood: "sad", aR: [36, -200], aL: [-36, -200], body: "tremble" })
    + TT({ x: 1080, y: 800, s: 1.35, flip: 1, walk: [380, 2.8], aL: [-72, -240], aR: [72, -240], wL: [26, 0.5, 2.8], wR: [-26, 0.5, 2.8] })
    + rain(0.5) + lightning(760, 1) + lightning(1340, 2.3),
  cam: [[1000, 520, 1.5], [800, 450, 1]],
  lines: [
    [null, "Người thứ hai là Thủy Tinh, chúa vùng nước thẳm."],
    [null, "Chàng hô mưa, mưa đến. Gọi gió, gió về. Tài năng chẳng kém gì Sơn Tinh."],
  ],
});

SHOTS.push({
  label: "5",
  mood: "calm", sfx: [[9, "pop"], [10.6, "pop"], [12.2, "pop"]],
  art: hall("#6b3a22")
    + ST({ x: 440, y: 860, s: 1.25, aR: [60, -150], lean: [8, 1.4], nod: [6, 1.4] })
    + TT({ x: 1160, y: 860, s: 1.25, flip: 1, aR: [60, -150], lean: [8, 1.6], nod: [6, 1.1] })
    + KING({ x: 800, y: 850, s: 1.5, aR: [80, -236], wR: [-16, 0.7], nod: [5, 1] })
    + [[460, 250, elephant(0, 60, 0.42)], [800, 190, rooster(0, 50, 0.9)], [1140, 250, horse(0, 60, 0.5)]]
      .map(([x, y, pic], i) => pop(`<g transform="translate(${x} ${y})"><circle r="92" fill="#f6ead2" ${I()}/><circle r="92" fill="url(#fadeDown)"/>${pic}</g>`, x, y, 9 + i * 1.6)).join(""),
  cam: [[800, 450, 1], [800, 420, 1.25]],
  lines: [
    [null, "Hai chàng đều tài giỏi, vua Hùng băn khoăn không biết chọn ai."],
    ["Vua Hùng", "Ngày mai, ai mang sính lễ đến trước, ta sẽ gả con gái cho."],
    ["Vua Hùng", "Một trăm ván cơm nếp, một trăm nệp bánh chưng, voi chín ngà, gà chín cựa, ngựa chín hồng mao."],
  ],
});

SHOTS.push({
  label: "6",
  mood: "bright",
  art: courtyard("#f08a6b", "#fdeec4", sunDisc(300, 420, "#fff0b0") + clouds("#ffffff", 0.5))
    + KING({ x: 1180, y: 830, s: 1.1, aL: [-70, -220], wL: [20, 0.6], nod: [-5, 1.2] })
    + MN({ x: 1290, y: 836, s: 1, nod: [-7, 1.3], aL: [-30, -150], aR: [30, -150] })
    + move(elephant(330, 800, 1) + EXTRA({ x: 150, y: 820, c: "#6f7f4a", aR: [56, -150], hR: cakeTray(70, -150, 0.5), walk: [0, 6] }), -700, 0, 6)
    + move(horse(640, 840, 0.95), -760, 0, 5.4)
    + move(rooster(820, 850, 1.1), -700, 0, 4.8)
    + cakeTray(1010, 850, 1)
    + ST({ x: 950, y: 800, s: 1.25, walk: [-700, 4.4], aR: [72, -220], wR: [-18, 0.6, 4.4], nod: [5, 1.2] }),
  cam: [[520, 580, 1.4], [960, 580, 1.4]],
  lines: [
    [null, "Sáng hôm sau, trời vừa hửng, Sơn Tinh đã mang đầy đủ lễ vật đến trước."],
    [null, "Vua Hùng giữ lời, cho chàng rước Mị Nương về núi."],
  ],
});
