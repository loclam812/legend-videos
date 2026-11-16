const S = (label, art, cam, mood, lines) => SHOTS.push({ label, art, cam, mood, lines });

S("1", ART.murder(), [[800, 450, 1], [900, 520, 1.3]], "tense", [
  [null, "Năm 937, đất Giao Châu rối ren."],
  [null, "Dương Đình Nghệ, người đang cai quản đất nước, bị chính bộ tướng của mình là Kiều Công Tiễn giết hại để đoạt quyền."],
]);
S("2", ART.march(), [[700, 480, 1.1], [980, 520, 1.3]], "battle", [
  [null, "Ngô Quyền là một vị tướng giỏi, và cũng là con rể của Dương Đình Nghệ."],
  [null, "Nghe tin dữ, ông kéo quân từ Ái Châu ra hỏi tội kẻ phản bội."],
]);
S("3", ART.court(), [[800, 450, 1], [920, 520, 1.35]], "tense", [
  [null, "Kiều Công Tiễn sợ hãi, vội cho người sang cầu cứu nước Nam Hán."],
  [null, "Vua Nam Hán là Lưu Cung nhân cơ hội ấy, muốn chiếm lấy nước ta."],
  [null, "Ông ta sai con trai là Lưu Hoằng Tháo đem một đoàn thuyền chiến lớn sang xâm lược."],
]);
S("4", ART.fleet(), [[900, 480, 1.25], [760, 470, 1]], "tense", [
  [null, "Mùa đông năm 938, đoàn thuyền Nam Hán rầm rộ vượt biển, tiến về cửa sông Bạch Đằng."],
  [null, "Còn Lưu Cung tự mình đóng quân ở biên giới để tiếp ứng cho con."],
]);
S("5", ART.plan(), [[800, 450, 1], [700, 540, 1.4]], "calm", [
  [null, "Lúc ấy, Ngô Quyền đã diệt xong Kiều Công Tiễn. Ông họp các tướng lại và nói."],
  ["Ngô Quyền", "Hoằng Tháo chỉ là một đứa trẻ khờ dại, đem quân từ xa đến, lính tráng đều đã mỏi mệt."],
  ["Ngô Quyền", "Nghe tin Công Tiễn đã chết, không còn ai làm nội ứng, chúng đã mất vía trước rồi."],
  ["Ngô Quyền", "Ta sẽ đóng cọc lớn, đầu bịt sắt ở cửa biển. Thuyền giặc theo nước triều lên vào trong hàng cọc, sẽ không chiếc nào chạy thoát."],
]);
S("6", ART.logging(), [[700, 500, 1.2], [1000, 540, 1.3]], "bright", [
  [null, "Quân lính lên rừng đốn rất nhiều cây gỗ lớn."],
  [null, "Đầu cọc được vót nhọn, rồi bịt sắt."],
]);
S("7", ART.planting({ t: 7, d: 1 }), [[800, 450, 1], [820, 500, 1.15]], "calm", [
  [null, "Họ đóng cọc xuống lòng sông, ngay nơi cửa biển."],
]);
S("8", ART.highTide({ t: 7, d: 1.5 }), [[800, 520, 1.25], [800, 450, 1]], "wonder", [
  [null, "Khi nước triều dâng lên, cả bãi cọc chìm dưới mặt nước, không để lại một dấu vết nào."],
]);
S("9", ART.lure(), [[1000, 480, 1.2], [560, 560, 1.3]], "tense", [
  [null, "Hoằng Tháo đưa thuyền vào cửa sông đúng lúc nước triều lên."],
  [null, "Ngô Quyền cho thuyền nhẹ ra khiêu chiến, rồi giả vờ thua chạy."],
]);
S("10", ART.chase({ t: 11 }), [[800, 450, 1], [800, 540, 1.2]], "battle", [
  [null, "Hoằng Tháo thúc cả đoàn thuyền đuổi theo."],
  [null, "Những chiếc thuyền lớn lướt qua bãi cọc ngầm mà không hề hay biết."],
]);
S("11", ART.ebb({ t: 7, d: 1 }), [[900, 520, 1.25], [640, 520, 1.1]], "battle", [
  [null, "Rồi nước triều bắt đầu rút."],
  [null, "Những hàng cọc nhọn dần nhô lên khỏi mặt nước."],
  [null, "Ngô Quyền liền hạ lệnh cho toàn quân quay lại đánh."],
]);
S("12", ART.wreck({ t: 9, d: 2 }), [[800, 450, 1], [860, 540, 1.3]], "battle", [
  [null, "Nước rút rất nhanh."],
  [null, "Thuyền giặc to nặng, va vào cọc sắt, vỡ và chìm."],
  [null, "Quân Nam Hán rối loạn, quá nửa bị chết đuối."],
]);
S("13", ART.fall({ t: 6, d: 0.5 }), [[820, 480, 1.4], [820, 520, 1.1]], "sad", [
  [null, "Lưu Hoằng Tháo cũng bỏ mạng trong trận này."],
]);
S("14", ART.retreat(), [[900, 450, 1], [680, 560, 1.4]], "sad", [
  [null, "Nghe tin con trai tử trận, Lưu Cung thương khóc, thu nhặt quân còn sót lại rồi rút về nước."],
]);
S("15", ART.crown(), [[800, 560, 1.5], [800, 450, 1]], "bright", [
  [null, "Mùa xuân năm 939, Ngô Quyền xưng vương, đóng đô ở Cổ Loa."],
  [null, "Chiến thắng Bạch Đằng đã chấm dứt hơn một nghìn năm Bắc thuộc, mở ra thời kỳ độc lập lâu dài cho dân tộc."],
  [null, "Từ đó, dòng sông Bạch Đằng trở thành niềm tự hào của người Việt."],
]);

["fade", "black", "black", "black", "black", "fade", "fade", "fade", "black", "slide", "slide", "slide", "zoom", "black", "black"].forEach((tr, i) => { SHOTS[i].tr = tr; });
const SFX = {
  2: [[0.3, "march", 7]],
  6: [[0, "fire"], [1, "whack"], [2.5, "whack"], [4, "whack"]],
  7: [[1.2, "whack"], [2.4, "whack"], [3.4, "whack"]],
  8: [[1.5, "whoosh"]],
  9: [[6.5, "whoosh"]],
  12: [[0, "fire"], [3, "whack"], [4.6, "whack"], [6.4, "whack"]],
  13: [[0, "fire"]],
  15: [[0.8, "drum"]],
};
SHOTS.forEach((shot) => { shot.sfx = SFX[shot.label]; });
SHOTS.unshift(titleShot("BẠCH ĐẰNG 938", "#7f9fb8", "#f3e2b0"));
SHOTS.push(endShot("#f6c060", "#fdf0c0"));
