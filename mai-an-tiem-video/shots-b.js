const seeds = (x, y) => [[0, 0], [14, 6], [-12, 8], [4, 14]].map(([a, b]) => `<ellipse cx="${x + a}" cy="${y + b}" rx="4" ry="6" fill="${DARK}"/>`).join("");
const shell = (x, y) => `<path d="M${x - 30} ${y}a30 30 0 0 0 60 0z" fill="#6b4a2a" ${I(4)}/><path d="M${x - 22} ${y}h44" stroke="#9fd0d6" stroke-width="6"/>`;
const field = () => vine(80, 700, 620) + vine(760, 690, 700) + vine(200, 780, 700) + vine(900, 800, 620) + vine(60, 850, 640);
const melons = (list) => list.map(([x, y, r]) => melon(x, y, r)).join("");
const slideIn = (svg, dx, t) => `<g class="walk" style="--dx:${dx}px;--dy:0px;--t:${t}s">${svg}</g>`;
const cloth = `<rect x="40" y="-200" width="70" height="26" rx="13" fill="#b5382a" ${I(4)}/>`;

SHOTS.push({
  label: "8",
  mood: "wonder", sfx: [[0, "waves"], [0.5, "birds", 5]],
  art: beach({ top: "#3b3f7a", bot: "#fbd27a", sun: [380, 400, "#fff0b0"], seaC: "#3f7f8a", sandC: "#e6c58a", cloud: "#b8456b" })
    + `<g class="fly">${[[200, 180, 1], [300, 130, 0.8], [330, 230, 0.9], [440, 170, 1.1], [520, 250, 0.8], [600, 150, 0.9]].map(([x, y, s]) => bird(x, y, s)).join("")}</g>`
    + slice(730, 750, 0.6, 20) + slice(810, 770, 0.5, -30) + seeds(770, 790) + seeds(850, 800)
    + birdSit(690, 750, 0.9) + birdSit(880, 770, 0.8)
    + AT({ x: 1100, y: 850, s: 1.3, flip: 1, walk: [260, 3.4], aR: [84, -150], hR: seeds(84, -166), wR: [-10, 1.1, 3.4], nod: [9, 1.3, 3.4], lean: [5, 1.3, 3.4] }) + palmFg(),
  cam: [[650, 400, 1.2], [1000, 610, 2.1]],
  lines: [
    [null, "Một hôm, có đàn chim lạ từ phương tây bay tới, đậu trên bãi cát, mổ một thứ quả gì đó rồi bay đi, để lại những hạt đen nhánh."],
    [null, "An Tiêm nhặt lên, nghĩ bụng."],
    ["An Tiêm", "Chim ăn được thì người cũng ăn được."],
  ],
});

SHOTS.push({
  label: "9a",
  mood: "calm", sfx: [[0, "waves"]],
  art: beach() + palm(1400, 620, 0.9)
    + `<ellipse cx="820" cy="810" rx="80" ry="20" fill="#d9b780" ${I(4)}/>` + seeds(810, 800) + shell(940, 800)
    + AT({ x: 690, y: 810, s: 1.1, aR: [70, -80], wR: [-22, 0.6], lean: [20, 0.6], nod: [10, 0.6] }),
  cam: [[780, 650, 1.8], [790, 710, 2.3]],
  lines: [[null, "Chàng vùi hạt xuống cát, ngày ngày tưới nước."]],
});

SHOTS.push({
  label: "9b",
  mood: "calm", sfx: [[0, "waves"]],
  art: beach() + palm(1400, 620, 0.9)
    + pop(vine(520, 790, 520, 1), 520, 790, 0.3) + pop(vine(600, 850, 480, 1), 600, 850, 1.2)
    + AT({ x: 430, y: 810, s: 1.05, aR: [74, -110], hR: shell(84, -112), wR: [20, 0.7], lean: [8, 0.7], nod: [8, 1] })
    + SON({ x: 1150, y: 830, flip: 1, walk: [240, 2.6], aR: [70, -120], hR: shell(80, -122), wR: [22, 0.6, 2.6], lean: [8, 0.6, 2.6] }),
  cam: [[800, 660, 1.6], [800, 690, 1.9]],
  lines: [[null, "Ít lâu sau, dây leo bò xanh kín bãi,"]],
});

SHOTS.push({
  label: "9c",
  mood: "calm", sfx: [[0, "waves"], [1.5, "chime"]],
  art: beach() + hut(1300, 640, 0.8) + palm(1480, 640, 0.9) + field()
    + [[240, 700, 46], [520, 690, 40], [900, 680, 44], [1250, 700, 42], [380, 780, 54], [760, 790, 58], [1120, 800, 52], [250, 850, 50], [600, 860, 48]]
      .map(([x, y, r], i) => pop(melon(x, y, r), x, y + r, 0.4 + i * 0.45)).join("")
    + AT({ x: 1010, y: 880, s: 1.1, flip: 1, walk: [420, 3.4, 1], mood: "open", aL: [-60, -236], aR: [60, -236], wL: [14, 0.4, 4.4], wR: [-14, 0.4, 4.4] }),
  cam: [[520, 720, 2], [800, 500, 1.1]],
  lines: [[null, "rồi kết thành những quả tròn, vỏ xanh thẫm, to bằng đầu người."]],
});

SHOTS.push({
  label: "10",
  mood: "bright", sfx: [[0, "waves"], [1.6, "whack"]],
  art: beach({ top: "#7fcfe6", bot: "#fbf0c4", sun: [1300, 200, "#f6c453"] }) + vine(60, 690, 640) + vine(900, 700, 640)
    + melons([[200, 690, 44], [1300, 700, 46], [1480, 760, 40]])
    + AT({ x: 520, y: 820, s: 1.15, aR: [66, -205], hR: slice(70, -222, 0.7), wR: [-16, 0.5], nod: [7, 0.5] })
    + SON({ x: 720, y: 830, s: 0.68, mood: "open", body: "jump", aL: [-60, -230], aR: [60, -230], hR: slice(62, -246, 0.6), wL: [16, 0.3] })
    + NB({ x: 1080, y: 820, s: 1.1, aL: [-64, -200], hL: slice(-68, -216, 0.7), wL: [16, 0.55], nod: [-7, 0.55] })
    + melonCut(900, 810, 66),
  cam: [[790, 700, 2.3], [800, 590, 1.5]],
  lines: [
    [null, "An Tiêm bổ thử một quả. Ruột đỏ tươi, hạt đen, mọng nước."],
    [null, "Nếm một miếng: ngọt, mát, thơm. Cả nhà reo lên vui sướng."],
    ["Con trai", "Ngọt quá cha ơi!"],
  ],
});

SHOTS.push({
  label: "11",
  mood: "calm", sfx: [[0, "waves"], [5.5, "splash"]],
  art: sky("#f08a6b", "#fdeec4") + sunDisc(1200, 400, "#fff0b0") + clouds("#ffffff", 0.5) + islands() + sea(400) + glints(1200)
    + `<g class="drift">${melon(760, 505, 30, 1)}${melon(960, 470, 24, 1)}${melon(1150, 446, 18, 1)}${melon(1330, 428, 13, 1)}</g>`
    + sand()
    + melons([[200, 800, 50], [300, 840, 44]])
    + AT({ x: 480, y: 810, s: 1.2, aR: [70, -130], hR: melon(98, -134, 44, 1), wR: [14, 1.5], lean: [12, 1.5], nod: [8, 1.5] })
    + SON({ x: 330, y: 790, s: 0.6, walk: [-260, 3], aR: [56, -150], hR: melon(70, -150, 30, 1) }),
  cam: [[540, 650, 2.2], [1000, 480, 1.4]],
  lines: [
    [null, "Mùa nối mùa, dưa mọc đầy đảo."],
    [null, "An Tiêm khắc dấu của mình lên vỏ dưa rồi thả xuống biển, mong sóng đưa về đất liền."],
  ],
});

SHOTS.push({
  label: "12",
  mood: "bright", sfx: [[0, "waves"]],
  art: beach() + palm(80, 640, 1) + house(330, 700, 1, "#c98b4a", "#7a5a34")
    + slideIn(boat(1500, 480, 0.9, "#e9b66a"), 260, 7) + slideIn(boat(1260, 520, 1.3), 340, 5)
    + NB({ x: 470, y: 800, s: 0.9, aR: [58, -226], wR: [-22, 0.45], nod: [5, 1] }) + SON({ x: 550, y: 810, s: 0.55, body: "jump", aL: [-56, -230], aR: [56, -230] })
    + melons([[640, 800, 44], [700, 830, 48], [600, 850, 42]])
    + AT({ x: 840, y: 810, s: 1.15, aR: [76, -150], hR: melon(102, -152, 40), wR: [-10, 0.9], nod: [6, 1.1] })
    + EXTRA({ x: 1010, y: 815, s: 1.05, c: "#4a6a7a", flip: 1, walk: [300, 4, 1.5], aR: [70, -150], hR: sack(88, -120, 0.8), wR: [-9, 0.9, 5.5], nod: [7, 1, 5.5] })
    + EXTRA({ x: 1140, y: 822, c: "#7a4a6a", flip: 1, walk: [300, 4.6, 2], aR: [60, -170], hR: cloth, wR: [-12, 0.8, 6.6] })
    + sack(1230, 840) + sack(1300, 850, 0.9),
  cam: [[1140, 580, 1.5], [540, 580, 1.5]],
  lines: [
    [null, "Thuyền buôn vớt được dưa, ăn thấy ngon, liền tìm ra đảo."],
    [null, "Họ đổi gạo, vải, dụng cụ lấy dưa. Túp lều nhỏ thành nếp nhà khang trang."],
  ],
});

SHOTS.push({
  label: "13a",
  mood: "calm",
  art: `<rect width="1600" height="900" fill="#7a3b22"/><circle cx="800" cy="420" r="520" fill="url(#glow)"/><path d="M250 0V830M1350 0V830" fill="none" stroke="#4d2a18" stroke-width="50"/>` + throne()
    + `<rect x="-10" y="830" width="1620" height="80" fill="#4d2a18" ${I()}/>` + lamp(330, 330) + lamp(1270, 330)
    + EXTRA({ x: 480, y: 860, s: 1.1, c: "#4a6a7a", walk: [-360, 3], aR: [70, -150], wR: [-8, 1, 3], lean: [12, 1.2, 3] })
    + KING({ x: 800, y: 850, s: 1.6, mood: "sad", aL: [-34, -128], aR: [34, -128], extra: melon(0, -124, 40, 1), nod: [9, 1.8], lean: [3, 1.8] }),
  cam: [[800, 450, 1], [800, 610, 2.5]],
  lines: [
    [null, "Một ngày, quả dưa lạ được dâng lên vua Hùng."],
    [null, "Nhìn dấu khắc trên vỏ, vua biết con mình còn sống, lại tự tay làm nên cơ nghiệp."],
  ],
});

SHOTS.push({
  label: "13b",
  mood: "bright", sfx: [[0.5, "horn"]],
  art: sky("#7fcfe6", "#fbf0c4") + sunDisc(1300, 160) + clouds() + hills() + house(250, 560, 0.8) + sea(520, "#4a90a0")
    + slideIn(boat(1300, 690, 1.6, "#f3e6c4", melon(-90, -40, 34) + melon(-20, -46, 36) + melon(60, -40, 34) + melon(-55, -86, 30) + melon(20, -90, 30)), 300, 3)
    + `<rect x="-10" y="720" width="1620" height="190" fill="#a8703f" ${I()}/><path d="M-10 780H1610M-10 840H1610" fill="none" ${I(3)}/><rect x="-10" y="720" width="1620" height="190" fill="url(#fadeDown)"/>`
    + EXTRA({ x: 180, y: 850, c: "#6f7f4a", mood: "open", body: "jump", aL: [-60, -250], aR: [60, -250] })
    + EXTRA({ x: 320, y: 860, s: 0.95, c: "#7a4a6a", mood: "open", body: "jump", aL: [-60, -250], aR: [60, -250], wL: [14, 0.3] })
    + EXTRA({ x: 460, y: 852, c: "#4a6a7a", mood: "open", aR: [60, -250], wR: [-24, 0.35], nod: [6, 0.6] })
    + KING({ x: 700, y: 860, s: 1.3, aR: [84, -176], wR: [-12, 0.9], nod: [6, 1.2], lean: [5, 1.4] })
    + AT({ x: 850, y: 860, s: 1.2, flip: 1, walk: [330, 3.2, 2.6], aR: [84, -176], wR: [-12, 0.9, 5.8], lean: [8, 1.2, 5.8] })
    + SON({ x: 950, y: 868, mood: "open", walk: [330, 3, 3.2], aL: [-56, -230], aR: [56, -230], wR: [-18, 0.35] })
    + NB({ x: 1040, y: 860, s: 1.1, walk: [330, 3.4, 3.4], nod: [-6, 1.2] }),
  cam: [[790, 620, 1.9], [800, 480, 1.1]],
  lines: [[null, "Vua hiểu An Tiêm đã nói đúng, bèn sai thuyền ra đón cả nhà trở về."]],
});

SHOTS.push({
  label: "14a",
  mood: "bright",
  art: sky("#7fcfe6", "#f6f0c8") + sunDisc(1300, 180) + clouds() + hills() + ground(600, "#b98d4a")
    + vine(60, 650, 700) + vine(860, 660, 700) + vine(100, 730, 420) + vine(1150, 740, 420)
    + [[150, 650, 34], [420, 660, 32], [980, 650, 34], [1330, 660, 36], [1500, 740, 44], [120, 760, 44]].map(([x, y, r], i) => pop(melon(x, y, r), x, y + r, 2 + i * 0.7)).join("")
    + ATf({ x: 650, y: 850, s: 1.2, aR: [84, -150], hR: seeds(84, -166), wR: [10, 0.8], nod: [6, 1.1] })
    + EXTRA({ x: 860, y: 850, s: 1.05, c: "#6f7f4a", flip: 1, walk: [280, 3], aR: [70, -150], wR: [-12, 0.8, 3], lean: [8, 1, 3] })
    + EXTRA({ x: 1000, y: 856, c: "#7a4a6a", hair: "long", long: 1, mood: "open", walk: [280, 3.4, 0.5], nod: [7, 0.8] })
    + person({ x: 1110, y: 862, s: 0.6, tunic: "#4a6a7a", mood: "open", walk: [280, 2.6, 1], body: "jump", aL: [-60, -230], aR: [60, -230] }),
  cam: [[750, 660, 2], [800, 450, 1]],
  lines: [
    [null, "An Tiêm mang hạt giống về chia cho dân khắp nơi cùng trồng."],
    [null, "Từ đó nước ta có dưa hấu."],
  ],
});

SHOTS.push({
  label: "14b",
  mood: "bright",
  art: altar(),
  cam: [[800, 610, 5], [800, 450, 1]],
  lines: [
    [null, "Và mỗi khi bổ một quả dưa đỏ ngày Tết, người ta lại nhớ lời chàng:"],
    [null, "thứ gì tự tay mình làm ra mới thật là quý."],
  ],
});

["fade", "zoom", "slide", "slide", "black", "black", "fade", "slide", "fade", "slide", "fade", "fade", "zoom", "slide", "slide", "black", "slide", "fade", "zoom"].forEach((tr, i) => { SHOTS[i].tr = tr; });
SHOTS.unshift(titleShot("SỰ TÍCH DƯA HẤU", "#8fd0e0", "#f6e7b8"));
SHOTS.push(endShot("#8fd0e0", "#f6e7b8"));
