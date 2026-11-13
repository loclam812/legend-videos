const ground = (y, c) => `<rect x="-10" y="${y}" width="1620" height="${910 - y}" fill="${c}" ${I()}/><rect x="-10" y="${y}" width="1620" height="${910 - y}" fill="url(#fadeDown)"/>`;
const drum = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-70 -90Q-52 -45 -84 0H84Q52 -45 70 -90Z" fill="#a8823f" ${I()}/><ellipse cy="-90" rx="70" ry="18" fill="#c9a15a" ${I()}/><path d="M-66 -40h132" fill="none" ${I(3)}/></g>`;
const granary = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-70 0V-90Q0 -175 70 -90V0Z" fill="#e3c26b" ${I()}/><path d="M-70 -90h140" fill="none" ${I(3)}/></g>`;
const bowl = (x, y) => `<path d="M${x - 26} ${y}a26 20 0 0 0 52 0z" fill="#f3e6c4" ${I(4)}/>`;
const spear = `<path d="M64 -350V-40" fill="none" ${I(7)}/><path d="M52 -330L64 -372L76 -330Z" fill="#d9d4c8" ${I(3)}/>`;

SHOTS.push({
  label: "1",
  art: altar(),
  cam: [[800, 450, 1], [800, 610, 7]],
  ease: "cubic-bezier(.6,0,.9,.4)",
  lines: [
    [null, "Mỗi dịp Tết, nhà nào cũng có một quả dưa hấu đỏ trên bàn thờ."],
    [null, "Nhưng ít ai biết, quả dưa ấy đến với chúng ta từ một hoang đảo, và từ một người đàn ông không chịu khuất phục số phận."],
  ],
});

SHOTS.push({
  label: "2",
  art: sky("#bfe3e6", "#f8dca0") + sunDisc(1250, 200) + clouds("#ffffff", 0.6) + hills() + house(330, 660, 1.2) + house(1320, 650, 1) + ground(640, "#d9a85c") + drum(600, 730)
    + EXTRA({ x: 430, y: 800, s: 1.05, c: "#6f7f4a", walk: [-320, 3.2], aR: [70, -150], wR: [-10, 0.9, 3.2] })
    + person({ x: 760, y: 810, s: 0.75, tunic: "#a8703f", walk: [-320, 3], lean: [16, 0.9, 3.2], nod: [8, 0.9, 3.2] })
    + KING({ x: 1050, y: 820, s: 1.35, aL: [-78, -150], wL: [-16, 0.7], nod: [-6, 1.4] }),
  cam: [[520, 520, 1.5], [900, 560, 1.6]],
  lines: [
    [null, "Ngày xưa, vào đời vua Hùng, có một cậu bé được đưa từ phương xa đến."],
    [null, "Thấy cậu sáng dạ, nhanh nhẹn, vua nhận làm con nuôi và đặt tên là Mai An Tiêm."],
  ],
});

SHOTS.push({
  label: "3",
  art: sky("#f0a060", "#f8dc98") + sunDisc(300, 330, "#fff0b0") + clouds("#b8456b", 0.35) + hills("#8fae62") + ground(640, "#d9a85c") + house(800, 690, 1.7, "#d19a55")
    + granary(250, 740) + granary(390, 770) + granary(1290, 750) + granary(1430, 780)
    + basket(520, 840, 1.1)
    + EXTRA({ x: 1180, y: 850, c: "#6f7f4a", flip: 1, walk: [380, 4], aR: [56, -150], hR: basket(64, -130, 0.7) })
    + ATf({ x: 700, y: 850, s: 1.1, aL: [-64, -226], wL: [22, 0.5], nod: [5, 1.3] })
    + SON({ x: 778, y: 860, body: "jump", aL: [-56, -230], aR: [56, -230] })
    + NB({ x: 860, y: 850, s: 1.05, aR: [58, -150], wR: [-12, 0.8], nod: [-5, 1.5] }),
  cam: [[790, 690, 2.4], [800, 450, 1]],
  lines: [
    [null, "Lớn lên, An Tiêm giỏi giang, chăm chỉ. Vua gả con gái nuôi cho chàng, lại ban nhiều bổng lộc."],
    [null, "Chẳng bao lâu, gia đình chàng có nhà cao, kho đầy."],
  ],
});

SHOTS.push({
  label: "4",
  art: `<rect width="1600" height="900" fill="#6b3a22"/>` + dongson(800, 300, 260, "#f2c14e", 0.22) + `<path d="M200 0V700M1400 0V700" fill="none" stroke="#4d2a18" stroke-width="40"/><rect width="1600" height="900" fill="url(#fadeDown)"/>`
    + lamp(430, 200) + lamp(1150, 200)
    + EXTRA({ x: 260, y: 770, c: "#6f7f4a", aR: [60, -210], mood: "open", wR: [-18, 0.5], hR: bowl(62, -222), nod: [6, 0.7] })
    + EXTRA({ x: 480, y: 770, c: "#7a4a6a", aL: [-60, -210], wL: [18, 0.6], nod: [-6, 0.9], lean: [5, 1.4] })
    + ATf({ x: 800, y: 780, s: 1.15, aR: [66, -200], hR: bowl(70, -212), wR: [-12, 1.1], nod: [5, 1.5] })
    + EXTRA({ x: 1080, y: 770, c: "#4a6a7a", mood: "open", nod: [8, 0.6], aL: [-58, -190], wL: [14, 0.45] })
    + EXTRA({ x: 1340, y: 780, c: "#4a4a6a", mood: "angry", flip: 1, aR: [50, -200], lean: [-8, 1.6], nod: [-8, 1.6] })
    + EXTRA({ x: 1470, y: 785, c: "#3f4f3a", mood: "angry", lean: [-7, 1.6, 0.3], nod: [-7, 1.2] })
    + `<rect x="100" y="655" width="1130" height="135" fill="#9c3a26" ${I()}/><rect x="100" y="690" width="1130" height="100" fill="url(#fadeDown)"/>` + ground(790, "#4d2a18")
    + bowl(300, 651) + bowl(560, 651) + bowl(1000, 651) + slice(700, 645, 0.7) + basket(930, 655, 0.8),
  cam: [[420, 500, 1.6], [800, 500, 2.3]],
  lines: [
    [null, "Trong một bữa tiệc, ai nấy đều khen chàng có phúc, được vua ban cho mọi thứ. An Tiêm chỉ cười."],
    ["An Tiêm", "Của biếu là của lo, của cho là của nợ. Thứ gì tự tay mình làm ra mới thật là quý."],
  ],
});

SHOTS.push({
  label: "5",
  art: `<rect width="1600" height="900" fill="#5a1d18"/><circle cx="800" cy="420" r="520" fill="#8a2a20" opacity=".6"/><path d="M250 0V830M1350 0V830" fill="none" stroke="#3a1410" stroke-width="50"/>` + throne()
    + ground(830, "#3a1410")
    + EXTRA({ x: 500, y: 850, s: 1.1, c: "#4a4a6a", mood: "angry", aR: [70, -210], wR: [-14, 0.5], lean: [9, 1.1], nod: [8, 0.8] })
    + EXTRA({ x: 1110, y: 850, s: 1.1, c: "#3f4f3a", mood: "angry", flip: 1, aR: [70, -210], wR: [-14, 0.6], lean: [9, 1.3], nod: [8, 0.9] })
    + KING({ x: 800, y: 850, s: 1.6, mood: "angry", aR: [86, -236], wR: [42, 0.26], body: "tremble", nod: [-5, 0.5] }),
  cam: [[800, 450, 1], [800, 470, 2.4]],
  ease: "cubic-bezier(.3,0,.2,1)",
  lines: [
    [null, "Lời ấy đến tai vua. Vua nổi giận."],
    ["Vua Hùng", "Nó cho rằng không cần đến ta ư? Vậy hãy để nó tự sống bằng hai bàn tay, xem được mấy ngày!"],
  ],
});

SHOTS.push({
  label: "6",
  art: beach({ top: "#7f8c96", bot: "#d9d6c6", seaC: "#4a7480", sandC: "#d8c08e", cloud: "#5f6a74" })
    + boat(1050, 480, 1.1, "#d9d4c8",
      EXTRA({ x: -70, y: 10, s: 0.42, c: "#4a4a6a" }) + EXTRA({ x: 70, y: 10, s: 0.42, c: "#4a4a6a", aR: [60, -220], wR: [-20, 0.6] }), "away")
    + `<path d="M1300 600q40 -70 110 -40q60 -40 110 30q40 40 20 70H1290Z" fill="#7d7468" ${I()}/>`
    + basket(250, 790, 0.8) + basket(470, 800, 0.7)
    + AT({ x: 330, y: 780, s: 0.7, mood: "sad", aR: [62, -226], wR: [12, 0.9], nod: [6, 2] })
    + SON({ x: 368, y: 792, s: 0.42, mood: "sad", nod: [10, 1.1] })
    + NB({ x: 410, y: 784, s: 0.68, mood: "sad", body: "tremble", aL: [-20, -196], aR: [20, -196], nod: [10, 1.3] }),
  cam: [[380, 680, 2.2], [800, 450, 1]],
  lines: [
    [null, "Thế là cả gia đình An Tiêm bị đày ra một hoang đảo giữa biển khơi."],
    [null, "Lính chỉ để lại ít lương thực đủ ăn vài ngày, rồi giong buồm đi mất."],
  ],
});

SHOTS.push({
  label: "7a",
  art: beach({ top: "#3b3f7a", bot: "#f0a868", sun: [1250, 400, "#ffd08a"], seaC: "#35607a", sandC: "#d9b780", cloud: "#b8456b" })
    + AT({ x: 660, y: 810, s: 1.2, aR: [112, -150], wR: [-9, 0.9], nod: [6, 1.6], lean: [4, 1.8] })
    + SON({ x: 800, y: 822, s: 0.65, mood: "sad", nod: [-12, 1.4], aR: [40, -150], wR: [-10, 1.2] })
    + NB({ x: 870, y: 812, s: 1.15, mood: "sad", body: "tremble", aL: [-22, -200], aR: [22, -200], nod: [-9, 1.1] }) + palmFg(),
  cam: [[770, 580, 1.5], [770, 550, 1.9]],
  lines: [
    ["Nàng Ba", "Chúng ta sẽ chết ở đây mất thôi."],
    ["An Tiêm", "Trời sinh voi, trời sinh cỏ. Còn hai bàn tay, ta còn sống được."],
  ],
});

SHOTS.push({
  label: "7b",
  art: beach() + palm(200, 640, 1) + hut(480, 680, 1.2) + fire(720, 760)
    + SON({ x: 290, y: 810, s: 0.55, walk: [-240, 3], aR: [50, -150], wR: [-14, 0.6, 3] })
    + NB({ x: 370, y: 800, s: 0.9, aR: [56, -130], hR: basket(64, -110, 0.6), wR: [-8, 1], lean: [8, 1.2], nod: [8, 1.2] })
    + `<g class="swim"><path d="M1260 590q30 -16 60 0q-30 16 -60 0zM1320 590l18 -12v24z" fill="#f2a03c" ${I(3)}/></g>`
    + AT({ x: 1150, y: 770, aR: [64, -236], hR: spear, wR: [16, 0.45], lean: [7, 0.45], nod: [8, 0.9] }),
  cam: [[500, 580, 1.5], [1060, 580, 1.5]],
  lines: [
    [null, "Chàng dựng lều, tìm nước ngọt, bắt cá, hái rau rừng."],
    [null, "Ngày qua ngày, cả nhà sống lay lắt nhưng không ai bỏ cuộc."],
  ],
});
