const mountain = (x, y, w, h, c = "#5f8f5a") => `<g transform="translate(${x} ${y})"><path d="M${-w / 2} 0Q${-w / 4} ${-h * 0.5} ${-w * 0.08} ${-h * 0.92}Q0 ${-h * 1.05} ${w * 0.08} ${-h * 0.92}Q${w / 4} ${-h * 0.5} ${w / 2} 0Z" fill="${c}" ${I()}/>
  <path d="M${w * 0.08} ${-h * 0.92}Q${w / 4} ${-h * 0.5} ${w / 2} 0H${w * 0.14}Q${w * 0.2} ${-h * 0.5} ${w * 0.08} ${-h * 0.92}Z" fill="#2a1608" opacity=".2"/>
  ${[[-0.28, 0.28], [-0.12, 0.5], [0.2, 0.34], [0.05, 0.16], [-0.34, 0.1]].map(([px, py]) => `<circle cx="${px * w}" cy="${-py * h}" r="${w / 34}" fill="#3f7a44" opacity=".7"/>`).join("")}</g>`;
const pond = (x, y, rx) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.3}" fill="#6fb8d0" ${I(4)}/><path class="glint" d="M${x - rx * 0.5} ${y - 4}h${rx * 0.5}M${x} ${y + 8}h${rx * 0.4}" fill="none" stroke="#e8f6ff" stroke-width="4" stroke-linecap="round"/>`;
const battlefield = () => sky("#6a2f3a", "#f6b060") + sunDisc(1250, 380, "#ffd08a") + clouds("#3a2030", 0.45, 120) + hills("#6a5a48") + ground(640, "#a88a5a");
const fleeing = (list, t = 16) => `<g class="away" style="animation-duration:${t}s">` + list.map(([x, y, s, drop]) => ENEMY({ x, y, s, mood: "sad", body: "tremble", lean: [12, 0.4], ...(drop ? { hR: "", aR: [60, -240], aL: [-60, -240] } : {}) })).join("") + `</g>`;
const dropped = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})">${line2("M-110 0H110", "#5b3a20", 6)}<path d="M150 0l-44 -14v28z" fill="#c8c8d0" ${I(3)}/></g>`;

SHOTS.push({
  label: "7",
  mood: "bright", sfx: [[12.6, "pop"]],
  art: yard("#f0b070", "#fdeec4", sunDisc(1300, 300, "#fff0b0") + clouds("#ffffff", 0.5)) + clump(1540, 700, 0.8)
    + ME({ x: 330, y: 850, s: 1.05, mood: "open", aL: [-40, -200], aR: [40, -200], nod: [6, 1.2] })
    + pot(760, 850, 1.1)
    + grow(GIONG({ x: 560, y: 856, s: 1.35, mood: "open", aR: [22, -200], hR: bowl, wR: [16, 0.35], nod: [8, 0.35] }), 560, 856, 9, 1, 0.42)
    + pop(sack(900, 856, 1) + sack(960, 856, 1) + sack(930, 800, 1), 930, 856, 12.6)
    + EXTRA({ x: 1090, y: 850, c: "#6f7f4a", flip: 1, walk: [520, 4.4, 11], aR: [60, -160], hR: sack(70, -150, 0.7), nod: [5, 1] })
    + EXTRA({ x: 1240, y: 860, c: "#4a6a7a", hair: "long", long: 1, flip: 1, walk: [520, 5, 11.8], aR: [60, -160], hR: basket(70, -150, 0.7) })
    + EXTRA({ x: 1390, y: 850, c: "#7a4a6a", flip: 1, walk: [520, 5.4, 12.6], aR: [60, -160], hR: sack(70, -150, 0.7), nod: [5, 0.9] }),
  cam: [[620, 580, 1.5], [800, 470, 1.08]],
  lines: [
    [null, "Từ hôm gặp sứ giả, cậu bé lớn nhanh như thổi. Cơm ăn mấy cũng không no, áo vừa mặc xong đã căng đứt chỉ."],
    [null, "Hai ông bà làm ra bao nhiêu cũng không đủ nuôi con."],
    [null, "Bà con hàng xóm vui lòng góp gạo nuôi cậu bé, vì ai cũng mong cậu đánh giặc cứu nước."],
  ],
});

SHOTS.push({
  label: "8",
  mood: "tense", sfx: [[2, "hooves", 4.5], [11, "drum"], [11, "chime"]],
  art: yard("#f08a6b", "#fdeec4", sunDisc(340, 400, "#fff0b0") + clouds("#ffffff", 0.5))
    + BO({ x: 150, y: 850, s: 1, mood: "open", aL: [-50, -230], aR: [50, -230], nod: [-8, 1.2] })
    + ME({ x: 300, y: 856, s: 1, mood: "open", aL: [-36, -204], aR: [36, -204], nod: [-8, 1.4] })
    + move(ironHorse(1180, 856, 1.3) + SU({ x: 1440, y: 850, s: 1.1, flip: 1, mood: "open", aR: [70, -190], nod: [-7, 1.2], walk: [0, 4.5, 2] }), 620, 0, 4.5, 2)
    + `<g class="gone" style="--d:11s">` + GIONG({ x: 720, y: 866, s: 1.3, aL: [-40, -150], aR: [40, -150], nod: [-6, 1.2] }) + `</g>`
    + pop(HERO({ x: 720, y: 866, s: 1.7, mood: "open", aL: [-76, -250], aR: [76, -250], wL: [18, 0.8, 12], wR: [-18, 0.8, 12], nod: [-5, 1.2] }), 720, 866, 11),
  cam: [[1050, 560, 1.4], [760, 450, 1]],
  lines: [
    [null, "Giặc đã tràn đến chân núi Trâu. Vừa lúc đó, sứ giả mang ngựa sắt, roi sắt, áo giáp sắt đến."],
    [null, "Cậu bé vùng dậy, vươn vai một cái, bỗng biến thành một tráng sĩ cao lớn, oai phong lẫm liệt."],
  ],
});

SHOTS.push({
  label: "9",
  mood: "battle", sfx: [[0, "hooves", 4.5], [4.6, "whoosh"], [7.5, "whoosh"], [10, "whoosh"]],
  art: battlefield()
    + fleeing([[1150, 800, 1], [1290, 850, 1.1], [1430, 800, 1], [1560, 856, 1.1]], 18)
    + move(rider(520, 850, 1.35, { aR: [70, -214], hR: whip, wR: [-34, 0.35], nod: [4, 0.5], mood: "angry" }, 1), -980, 0, 4.5),
  cam: [[560, 500, 1.35], [900, 480, 1.12]],
  lines: [
    [null, "Tráng sĩ mặc áo giáp, cầm roi, nhảy lên mình ngựa. Ngựa hí vang, phun lửa, lao thẳng đến nơi có giặc."],
    [null, "Tráng sĩ đón đầu giặc, đánh hết lớp này đến lớp khác."],
  ],
});

SHOTS.push({
  label: "10",
  mood: "battle", sfx: [[0, "hooves", 3.4], [0.8, "whack"], [5, "whack"], [6, "whack"], [7, "whack"], [8, "whack"]],
  art: battlefield() + clump(150, 700, 1) + clump(1010, 660, 0.7)
    + dropped(880, 870, -8) + dropped(1180, 880, 12)
    + `<g transform="translate(380 874) rotate(16)">${line2("M-60 0H0", "#5b3a20", 8)}${line2("M0 0q30 -14 50 6", "#5f646e", 5)}</g>`
    + fleeing([[1220, 800, 1, 1], [1350, 850, 1.1, 0], [1480, 800, 1, 1], [1600, 856, 1.1, 1]], 12)
    + move(rider(620, 850, 1.35, { aR: [64, -214], hR: bamboo(36, -196, 330, "#7fae4a", 58), wR: [-46, 0.4], nod: [4, 0.5], mood: "angry" }, 1), -560, 0, 3.4),
  cam: [[520, 500, 1.35], [860, 470, 1.1]],
  lines: [
    [null, "Bỗng roi sắt gãy. Tráng sĩ liền nhổ những cụm tre bên đường, quật vào quân giặc."],
    [null, "Giặc tan vỡ, giẫm đạp lên nhau mà chạy trốn."],
  ],
});

SHOTS.push({
  label: "11",
  mood: "wonder", sfx: [[4.6, "chime"], [4.6, "whoosh"]],
  art: sky("#4a3f7a", "#f0a868") + sunDisc(300, 420, "#ffd08a") + clouds("#b8456b", 0.4, 150)
    + mountain(760, 960, 1300, 620, "#5f8a66")
    + pop(`<g transform="translate(640 566) scale(.62)">${shadow(0, -100, 60)}<g transform="translate(0 0)">${armor}</g><g transform="translate(70 150)">${helmet}</g></g>`, 640, 400, 5.6)
    + `<circle cx="1160" cy="210" r="260" fill="url(#glow)"/>`
    + move(rider(1160, 300, 0.56, { aR: [60, -230], wR: [-16, 0.8], nod: [-5, 1.2], mood: "smile" }, 0, 1, GIONG), -380, 70, 6, 4.6),
  cam: [[760, 520, 1.3], [900, 400, 1.35]],
  lines: [
    [null, "Đuổi giặc đến chân núi Sóc, tráng sĩ một mình một ngựa lên đỉnh núi."],
    [null, "Người cởi áo giáp sắt để lại, rồi cả người lẫn ngựa từ từ bay lên trời."],
  ],
});

SHOTS.push({
  label: "12",
  mood: "bright", sfx: [[0, "gong"]],
  art: sky("#7fcfe6", "#f6f0c8") + sunDisc(300, 180) + clouds()
    + `<g opacity=".6"><circle cx="1290" cy="170" r="200" fill="url(#glow)"/>${rider(1290, 250, 0.42, { aR: [60, -230], wR: [-16, 0.8] }, 0, 1)}</g>`
    + hills() + house(800, 650, 1.25, "#b5382a", "#7a2a1c") + dongson(800, 400, 60, "#f2c14e", 0.9)
    + ground(650, "#8fb060")
    + clump(170, 720, 1, "#e2c04a") + clump(1430, 720, 1, "#e2c04a")
    + pond(420, 800, 110) + pond(700, 846, 90) + pond(1010, 800, 100) + pond(1250, 850, 80)
    + KING({ x: 800, y: 760, s: 0.85, aR: [60, -230], wR: [-14, 0.9], nod: [5, 1.3] })
    + EXTRA({ x: 520, y: 880, c: "#6f7f4a", mood: "open", body: "jump", aL: [-60, -250], aR: [60, -250] })
    + ME({ x: 900, y: 884, s: 1, mood: "open", aR: [56, -246], wR: [-20, 0.5], nod: [-6, 1] })
    + person({ x: 1110, y: 884, s: 0.62, tunic: "#4a6a7a", mood: "open", body: "jump", aL: [-60, -230], aR: [60, -230] })
    + EXTRA({ x: 1230, y: 880, c: "#4a6a7a", flip: 1, mood: "open", aR: [60, -250], wR: [-22, 0.45], nod: [5, 0.8] }),
  cam: [[800, 600, 1.6], [800, 450, 1]],
  lines: [
    [null, "Vua nhớ công ơn, phong là Phù Đổng Thiên Vương và lập đền thờ ngay tại quê nhà."],
    [null, "Ngày nay, làng Gióng vẫn còn những bụi tre ngà vàng óng vì ngựa phun lửa, và những ao hồ nối nhau do vết chân ngựa để lại."],
    [null, "Câu chuyện ca ngợi lòng yêu nước và sức mạnh của nhân dân ta mỗi khi đất nước gặp nguy."],
  ],
});

["fade", "slide", "black", "black", "fade", "slide", "black", "zoom", "slide", "slide", "black", "fade"].forEach((tr, i) => { SHOTS[i].tr = tr; });
SHOTS.unshift(titleShot("THÁNH GIÓNG", "#8fd0e0", "#f8e6b0"));
SHOTS.push(endShot("#8fd0e0", "#f8e6b0"));
