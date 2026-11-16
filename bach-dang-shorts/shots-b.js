const V = (label, tr, art, cam, mood, text, hot, who = null) => SHOTS.push({ label, tr, art, cam, mood, hot, lines: [[who, text]] });

V("hook", "fade", ART.wreck({ t: 3, d: 0.3 }), [[700, 500, 1.15], [720, 540, 1.35]], "battle", "Một dòng sông đã đánh tan cả đoàn thuyền chiến.", ["đánh tan"]);
V("hook 2", "whip", ART.wreck({ at: "end" }), [[1230, 560, 1.3], [1160, 620, 1.5]], "battle", "Chuyện xảy ra năm 938, trên sông Bạch Đằng.", ["938", "Bạch Đằng"]);
V("1", "black", ART.murder({ t: 2.5, kx: 1010 }), [[885, 540, 1.1], [885, 555, 1.25]], "tense", "Năm 937, Kiều Công Tiễn giết chủ tướng Dương Đình Nghệ.", ["giết"]);
V("2", "whip", ART.march({ at: "end" }) + ring(1160, 505, 100, 0.3) + arrow(1010, 300, 1090, 420, 0.5), [[1130, 540, 1.15], [1160, 554, 1.3]], "battle", "Ngô Quyền, con rể ông, kéo quân ra trị tội.", ["Ngô Quyền"]);
V("3", "black", ART.court(), [[800, 560, 1.2], [800, 545, 1.45]], "tense", "Kiều Công Tiễn cho người cầu cứu Nam Hán.", ["Nam Hán"]);
V("3b", "whip", ART.court() + ring(1130, 520, 100, 0.3), [[1010, 545, 1.2], [1110, 560, 1.45]], "tense", "Vua Nam Hán sai con là Hoằng Tháo sang đánh.", ["Hoằng Tháo"]);
V("5", "black", ART.plan(), [[650, 550, 1.2], [610, 560, 1.4]], "calm", "Nhưng Ngô Quyền đã có sẵn một kế.", ["kế"]);
V("5b", "zoom", ART.plan(), [[600, 556, 1.6], [600, 552, 1.8]], "calm", "Ta sẽ đóng cọc bịt sắt dưới lòng sông.", ["cọc", "sắt"], "Ngô Quyền");
V("6", "whip", ART.logging(), [[540, 556, 1.3], [565, 556, 1.45]], "bright", "Quân lính lên rừng đốn gỗ, vót nhọn làm cọc.", ["vót nhọn"]);
V("7", "whip", ART.planting({ t: 3 }), [[720, 480, 1.05], [730, 500, 1.2]], "calm", "Họ đóng cọc xuống ngay cửa sông.", ["đóng cọc"]);
V("8", "zoom", ART.highTide({ t: 2.6, d: 0.3 }), [[800, 560, 1.3], [800, 540, 1.1]], "wonder", "Nước triều lên, cả bãi cọc biến mất.", ["biến mất"]);
V("8b", "fade", ART.highTide({ at: "end" }) + ring(700, 556, 60, 0.3) + ring(930, 570, 60, 0.6) + ring(860, 640, 60, 0.9), [[800, 560, 1.35], [810, 570, 1.5]], "wonder", "Dưới mặt nước phẳng lặng là một cái bẫy.", ["cái bẫy"]);
V("9", "black", ART.lure(), [[1180, 470, 1], [1130, 470, 1.03]], "tense", "Thuyền Nam Hán vào cửa sông đúng lúc nước lên.", ["nước lên"]);
V("9b", "whip", ART.lure(), [[450, 600, 1.1], [500, 600, 1.2]], "tense", "Thuyền nhỏ ra khiêu chiến, rồi giả vờ thua chạy.", ["giả vờ thua"]);
V("10", "whip", ART.chase({ t: 3 }), [[1300, 520, 1], [1250, 520, 1.05]], "battle", "Hoằng Tháo lập tức đuổi theo.", ["đuổi theo"]);
V("11", "zoom", ART.ebb({ t: 2.2, d: 0.2 }), [[640, 520, 1.2], [700, 520, 1.3]], "battle", "Rồi nước triều rút, hàng cọc nhọn hiện ra.", ["cọc nhọn"]);
V("11c", "whip", ART.ebb({ at: "end" }), [[330, 620, 1.4], [300, 630, 1.6]], "battle", "Ngô Quyền ra lệnh toàn quân quay lại đánh.", ["quay lại đánh"]);
V("12", "whip", ART.wreck({ t: 3 }), [[700, 520, 1.15], [720, 560, 1.3]], "battle", "Thuyền giặc to nặng, đâm vào cọc sắt, vỡ tan.", ["vỡ tan"]);
V("13", "whip", ART.fall({ t: 3 }), [[800, 520, 1.15], [790, 560, 1.3]], "sad", "Quân Nam Hán chết đuối quá nửa, Hoằng Tháo bỏ mạng.", ["quá nửa", "bỏ mạng"]);
V("14", "black", ART.retreat(), [[640, 560, 1.25], [620, 560, 1.45]], "sad", "Vua Nam Hán khóc con, rút quân về nước.", ["rút quân"]);
V("15", "black", ART.crown(), [[800, 560, 1.3], [800, 540, 1.15]], "bright", "Năm 939, Ngô Quyền xưng vương ở Cổ Loa.", ["xưng vương"]);
V("15b", "whip", ART.crown(), [[1250, 560, 1.3], [1280, 560, 1.4]], "bright", "Hơn nghìn năm Bắc thuộc chấm dứt từ đây.", ["chấm dứt"]);
V("kết", "fade", sky("#f6c060", "#fdf0c0") + `<circle cx="800" cy="380" r="420" fill="url(#glow)"/>` + dongson(800, 380, 220, "#f2c14e", 0.45) + bigText(800, 350, "BẠCH ĐẰNG", 58) + bigText(800, 450, "938", 96) + bigText(800, 230, "Chuyện lịch sử Việt Nam", 26, "#fffaf0"),
  [[800, 450, 1.08], [800, 450, 1]], "bright", "Theo dõi kênh để nghe thêm chuyện xưa nhé!", ["Theo dõi"]);

const SFX = {
  hook: [[0, "fire"], [1.2, "whack"]],
  7: [[0.8, "whack"], [1.8, "whack"]],
  8: [[0.5, "whoosh"]],
  12: [[0, "fire"], [1, "whack"], [2.2, "whack"]],
  13: [[0, "fire"]],
};
SHOTS.forEach((shot) => { shot.sfx = SFX[shot.label]; });
