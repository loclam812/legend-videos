const serpent = (x, y, s = 1, c = "#2f8f8a") => `<g transform="translate(${x} ${y}) scale(${s})"><g class="rock">${line2("M-220 10q40 -70 80 0t80 0t80 0q30 -40 60 -50", c, 30)}
  <path d="M60 -50q40 -44 96 -16q20 14 4 34q-50 22 -100 -18z" fill="${c}" ${I()}/><path d="M96 -84l10 -30l14 26M124 -80l14 -26l8 30" fill="#9fe0f0" ${I(3)}/>
  <circle cx="126" cy="-44" r="8" fill="#fff8c0" ${I(3)}/><circle cx="128" cy="-44" r="3" fill="${DARK}"/><path d="M134 -22l6 14l8 -12" fill="#fffaf0" ${I(2.5)}/></g></g>`;
const fish = (x, y, s = 1, c = "#f2a03c") => `<g transform="translate(${x} ${y}) scale(${s})"><g class="swim"><path d="M-40 0q40 -26 80 0q-40 26 -80 0zM40 0l26 -18v36z" fill="${c}" ${I(3)}/><circle cx="-22" cy="-3" r="3" fill="${DARK}"/></g></g>`;
const rock = (x, y, r) => `<path d="M${x - r} ${y}q${r * 0.2} ${-r * 1.2} ${r} ${-r * 1.1}q${r * 0.9} ${r * 0.1} ${r} ${r * 1.1}z" fill="#8a8478" ${I(4)}/>`;
const dike = (x, y) => [[0, 0], [70, 0], [140, 0], [210, 0], [35, -52], [105, -52], [175, -52], [70, -104], [140, -104]].map(([a, b]) => sack(x + a, y + b, 1)).join("");
const stormSky = () => sky("#232c44", "#6f7c8a") + stormClouds("#2e3444");

SHOTS.push({
  label: "7",
  mood: "tense",
  art: sky("#4a3f7a", "#f0a868") + sunDisc(260, 420, "#ffd08a") + clouds("#b8456b", 0.4)
    + mountain(330, 660, 620, 470, "#5f8a66")
    + ST({ x: 300, y: 330, s: 0.42, walk: [90, 9, 0, 110], aR: [50, -220], wR: [-16, 0.6] }) + MN({ x: 350, y: 336, s: 0.4, walk: [90, 9, 0, 110] })
    + sea(600, "#35607a") + ground(700, "#b99a66")
    + move(serpent(1380, 690, 0.9), 400, 0, 4) + fish(1150, 660, 0.9) + fish(1500, 640, 0.7, "#e8705a")
    + move(cakeTray(1230, 850, 0.9), 420, 0, 3.6)
    + TT({ x: 1000, y: 850, s: 1.4, flip: 1, walk: [460, 3.2], aR: [80, -236], wR: [38, 0.28, 3.2], body: "tremble", nod: [-6, 0.5] }),
  cam: [[1040, 580, 1.6], [820, 470, 1.15]],
  lines: [
    [null, "Thủy Tinh đến sau, không lấy được vợ, đùng đùng nổi giận."],
    ["Thủy Tinh", "Mị Nương phải là của ta! Ta sẽ dâng nước đánh Sơn Tinh!"],
  ],
});

SHOTS.push({
  label: "8",
  mood: "battle", sfx: [[0, "rain", 10.4], [2.8, "thunder"], [6, "thunder"], [9.2, "thunder"]],
  art: stormSky() + hills("#5f7f62") + house(360, 690, 1) + house(1150, 700, 0.9) + palm(760, 700, 0.8) + ground(660, "#a88a5a")
    + move(bigWave(560, "#2f6f8f", 80, 1.4) + serpent(520, 640, 1) + fish(980, 700, 1) + fish(1300, 760, 0.8, "#e8705a"), 0, 380, 9)
    + move(TT({ x: 1250, y: 520, s: 1.3, flip: 1, aL: [-72, -240], aR: [72, -240], wL: [26, 0.45], wR: [-26, 0.45], nod: [-5, 0.6] }), 0, 380, 9)
    + rain(0.6) + lightning(300) + lightning(900, 1.1) + lightning(1400, 2.2),
  cam: [[800, 450, 1], [800, 540, 1.3]],
  lines: [
    [null, "Thủy Tinh hô mưa gọi gió, làm thành giông bão rung chuyển cả đất trời."],
    [null, "Nước ngập ruộng đồng, ngập nhà cửa, dâng lên lưng đồi, sườn núi."],
  ],
});

SHOTS.push({
  label: "9",
  mood: "battle", sfx: [[0, "rain", 12.4], [2.8, "thunder"], [6, "thunder"], [9.2, "thunder"]],
  art: stormSky()
    + move(mountain(800, 960, 1250, 700, "#5f8f5a") + rock(560, 520, 50) + rock(1010, 560, 44)
      + MN({ x: 900, y: 330, s: 0.8, mood: "sad", aL: [-30, -196], aR: [30, -196] })
      + ST({ x: 760, y: 322, s: 1.05, mood: "angry", aL: [-70, -240], aR: [70, -240], wL: [22, 0.5], wR: [-22, 0.5], nod: [5, 0.8] }), 0, 300, 11)
    + move(bigWave(640, "#2f6f8f", 80, 1.4) + serpent(300, 720, 1) + serpent(1300, 740, 0.9, "#3f7fa8"), 0, 200, 9)
    + rain(0.55) + lightning(250, 0.6) + lightning(1350, 2),
  cam: [[800, 520, 1.15], [800, 370, 1.3]],
  lines: [
    ["Sơn Tinh", "Nước dâng cao bao nhiêu, ta sẽ nâng núi cao bấy nhiêu!"],
    [null, "Sơn Tinh không hề nao núng. Chàng bốc từng quả đồi, dời từng dãy núi, dựng thành lũy chặn dòng nước lũ."],
  ],
});

SHOTS.push({
  label: "10",
  mood: "wonder",
  art: sky("#5f7a9a", "#f8dca0") + sunDisc(380, 240, "#fff0b0") + clouds("#ffffff", 0.45)
    + mountain(700, 960, 1250, 680, "#5f8f5a")
    + ST({ x: 660, y: 350, s: 0.95, body: "jump", aL: [-66, -244], aR: [66, -244] }) + MN({ x: 790, y: 358, s: 0.8, aR: [44, -226], wR: [-20, 0.5], nod: [-6, 1] })
    + move(bigWave(660, "#3f7f9a", 50, 3) + fish(500, 780, 0.9), 0, -260, 10)
    + `<g class="away" style="animation-duration:12s">` + TT({ x: 1320, y: 700, s: 1.1, mood: "sad", lean: [14, 1.6], nod: [12, 1.6], aL: [-30, -110], aR: [30, -110] }) + serpent(1180, 720, 0.8) + `</g>`,
  cam: [[800, 420, 1.35], [900, 500, 1.1]],
  lines: [[null, "Hai bên đánh nhau ròng rã mấy tháng trời. Cuối cùng Thủy Tinh kiệt sức, đành rút quân về."]],
});

SHOTS.push({
  label: "11",
  mood: "tense", sfx: [[0, "rain", 13]],
  art: sky("#4a5a74", "#aab4b8") + stormClouds("#4a5060") + mountain(1250, 700, 760, 520, "#5f8a66") + hills("#6f8f6a") + house(1180, 720, 0.9) + ground(700, "#a88a5a")
    + bigWave(640, "#2f6f8f", 60, 1.8)
    + TT({ x: 180, y: 640, s: 0.8, aL: [-72, -240], aR: [72, -240], wL: [26, 0.5], wR: [-26, 0.5] })
    + `<rect x="-10" y="760" width="1620" height="150" fill="#a88a5a" ${I()}/><rect x="-10" y="760" width="1620" height="150" fill="url(#fadeDown)"/>`
    + dike(520, 800)
    + EXTRA({ x: 900, y: 850, c: "#6f7f4a", flip: 1, walk: [420, 4], aR: [60, -160], hR: sack(70, -150, 0.7), lean: [10, 0.9, 4] })
    + EXTRA({ x: 1040, y: 860, c: "#7a4a6a", flip: 1, walk: [420, 4.6, 0.8], aR: [60, -160], hR: sack(70, -150, 0.7) })
    + EXTRA({ x: 400, y: 850, c: "#4a6a7a", aR: [70, -170], wR: [16, 0.5], lean: [10, 0.5] })
    + rain(0.4),
  cam: [[520, 560, 1.4], [800, 520, 1.15]],
  lines: [
    [null, "Nhưng oán nặng thù sâu, hằng năm Thủy Tinh lại dâng nước đánh Sơn Tinh, gây ra mưa gió, lũ lụt khắp nơi."],
    [null, "Và năm nào cũng vậy, Thủy Tinh lại thua, phải rút về."],
  ],
});

SHOTS.push({
  label: "12",
  mood: "bright",
  art: sky("#7fcfe6", "#f6f0c8") + sunDisc(1300, 180) + clouds()
    + mountain(420, 700, 820, 560, "#5f8f5a")
    + ST({ x: 380, y: 196, s: 0.6, aR: [60, -230], wR: [-20, 0.6] }) + MN({ x: 450, y: 200, s: 0.55, aL: [-56, -226], wL: [20, 0.6] })
    + hills() + house(1250, 640, 1) + ground(640, "#8fb060")
    + vine(60, 720, 700) + vine(860, 730, 700) + vine(160, 820, 600)
    + EXTRA({ x: 700, y: 850, c: "#6f7f4a", mood: "open", body: "jump", aL: [-60, -250], aR: [60, -250] })
    + EXTRA({ x: 860, y: 856, c: "#7a4a6a", hair: "long", long: 1, mood: "open", aR: [60, -250], wR: [-22, 0.4] })
    + person({ x: 980, y: 862, s: 0.6, tunic: "#4a6a7a", mood: "open", body: "jump", aL: [-60, -230], aR: [60, -230] })
    + EXTRA({ x: 1100, y: 852, c: "#4a6a7a", flip: 1, aR: [60, -250], wR: [-22, 0.45], nod: [5, 0.8] }),
  cam: [[760, 600, 1.7], [800, 450, 1]],
  lines: [
    [null, "Câu chuyện là cách người xưa giải thích mùa lũ hằng năm."],
    [null, "Và cũng là niềm tin rằng con người đủ sức đắp đê, giữ làng, chiến thắng thiên tai."],
  ],
});

["fade", "black", "slide", "slide", "black", "fade", "slide", "black", "zoom", "fade", "black", "fade"].forEach((tr, i) => { SHOTS[i].tr = tr; });
SHOTS.unshift(titleShot("SƠN TINH THỦY TINH", "#2f3a52", "#7f8c96"));
SHOTS.push(endShot("#2f3a52", "#7f8c96"));
