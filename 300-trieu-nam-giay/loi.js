// The shot list of "If you woke up 300 million years ago" (late Carboniferous), a wide long-form video.
// Several sentences per shot. Figures follow common published estimates: oxygen near 30 %, a day under 23 hours,
// Lepidodendron 30 to 40 m, Meganeura about 70 cm across, Arthropleura over 2 m, Orthacanthus up to about 3 m.
const WIDE = true;
const TEMPO = 1.1;
const SUBS = false;
const S = (label, mood, hot, ...texts) => ({ label, mood, hot, lines: texts.map((t) => [null, t]) });
const SHOTS = [
  S("h1", "wonder", ["khu rừng"], "Bạn mở mắt.", "Xung quanh là một khu rừng bạn chưa từng thấy.", "Không có tiếng chim. Không có tiếng xe. Không một bóng người."),
  S("h2", "tense", ["chuồn chuồn"], "Chỉ có tiếng vo ve của những đôi cánh lớn.", "Một con côn trùng giống chuồn chuồn bay ngang mặt bạn.", "Sải cánh của nó dài bằng cánh tay người lớn."),
  S("h3", "wonder", ["300 triệu năm trước"], "Chào mừng bạn đến Trái Đất, 300 triệu năm trước.", "Liệu bạn có sống sót nổi ở đây không?"),

  S("b1", "calm", ["kỷ Than Đá"], "Thời kỳ này có tên là kỷ Than Đá.", "Nó kéo dài từ khoảng 359 đến 299 triệu năm trước.", "Bạn đang ở những năm cuối cùng của kỷ này."),
  S("b2", "calm", ["Khủng long"], "Khủng long chưa xuất hiện.", "Phải khoảng bảy mươi triệu năm nữa, con khủng long đầu tiên mới ra đời.", "Thế giới này cổ xưa hơn cả thời của chúng."),
  S("b3", "calm", ["bông hoa"], "Chưa có chim, chưa có thú, và chưa có một bông hoa nào.", "Cỏ cũng chưa tồn tại.", "Mặt đất chỉ có rêu, dương xỉ và bùn."),
  S("b4", "wonder", ["Pangaea"], "Nhìn từ không gian, Trái Đất trông rất lạ.", "Các lục địa đang trôi lại gần nhau.", "Chúng sắp ghép thành một siêu lục địa khổng lồ tên là Pangaea."),
  S("b5", "calm", ["xích đạo"], "Bạn đang đứng ở vùng xích đạo, nơi trời nóng và ẩm quanh năm.", "Trong khi đó, những vùng đất gần cực nam bị băng phủ.", "Trái Đất lúc này đang ở giữa một kỷ băng hà kéo dài."),
  S("b6", "wonder", ["23 giờ"], "Một ngày ở đây cũng ngắn hơn bây giờ: chưa tới 23 giờ.", "Vì Trái Đất khi ấy quay nhanh hơn.", "Một năm vì thế có khoảng 390 ngày."),
  S("b7", "wonder", ["30 phần trăm"], "Và không khí thì khác hẳn.", "Ngày nay, ô xy chiếm 21 phần trăm không khí.", "Còn lúc này, các nhà khoa học ước tính con số đó lên tới khoảng 30 phần trăm."),
  S("b8", "tense", ["khổng lồ"], "Lượng ô xy dồi dào ấy đến từ những cánh rừng mênh mông.", "Và nó góp phần tạo nên những sinh vật khổng lồ mà bạn sắp gặp."),

  S("k1", "wonder", ["bốn mươi mét"], "Bạn đứng dậy và nhìn lên.", "Những thân cây cao ba, bốn mươi mét, thẳng như cột đình.", "Ngọn cây xòe ra tít trên cao, che gần hết bầu trời."),
  S("k2", "calm", ["cây vảy"], "Nhưng đây không phải cây gỗ như ta biết.", "Chúng là họ hàng khổng lồ của loài thạch tùng bé xíu ngày nay.", "Vỏ cây có hoa văn như vảy rắn, nên người ta gọi là cây vảy."),
  S("k3", "calm", ["mộc tặc"], "Bên cạnh là những cây mộc tặc cao hơn mười mét.", "Thân chúng có đốt, trông như những ống tre khổng lồ.", "Xen giữa là dương xỉ thân gỗ, tán xòe như chiếc ô."),
  S("k4", "tense", ["đầm lầy"], "Dưới chân bạn là đầm lầy.", "Nước đen, ấm, ngập đầy lá mục.", "Mỗi bước đi, bùn lún tới mắt cá chân."),
  S("k5", "calm", ["than đá"], "Khi những cây khổng lồ đổ xuống, chúng chìm vào lớp bùn thiếu ô xy.", "Chúng không phân hủy hết, mà chồng chất lớp này lên lớp khác.", "Bị nén suốt hàng triệu năm, chúng biến thành than đá."),
  S("k6", "wonder", ["kỷ Than Đá"], "Rất nhiều mỏ than ở châu Âu và Bắc Mỹ sinh ra từ chính những khu rừng này.", "Đó là lý do thời kỳ này mang tên kỷ Than Đá."),
  S("k7", "tense", ["hai mét"], "Một tiếng sột soạt vang lên sau lưng.", "Bạn quay lại, và thấy một con vật giống cuốn chiếu, dài hơn hai mét.", "Tên nó là Arthropleura, loài chân khớp trên cạn lớn nhất từng được biết."),
  S("k8", "calm", ["thực vật"], "May cho bạn, nhiều khả năng nó chỉ ăn thực vật.", "Nó lặng lẽ bò qua, như một đoàn tàu nhỏ nhiều chân."),
  S("k9", "tense", ["Meganeura"], "Trên cao, những con Meganeura lượn vòng.", "Chúng giống chuồn chuồn, nhưng sải cánh tới bảy mươi xăng ti mét.", "Và chúng là thợ săn, bắt côn trùng khác ngay trên không."),
  S("k10", "calm", ["ô xy"], "Vì sao côn trùng thời này to đến vậy?", "Côn trùng không có phổi. Chúng thở qua những ống nhỏ xíu khắp cơ thể.", "Nhiều nhà khoa học cho rằng không khí giàu ô xy giúp chúng lớn hơn.", "Thêm nữa, bầu trời chưa có chim hay dơi nào để săn chúng."),
  S("k11", "bright", ["chưa có muỗi"], "Gián cổ đại bò khắp nơi. Trông chúng đã khá giống gián ngày nay.", "Nhưng có một tin vui: thời này chưa có muỗi."),

  S("k12", "wonder", ["cá mập"], "Ngoài khơi, biển cũng đông đúc không kém.", "Đây là thời hoàng kim của cá mập, với đủ hình thù kỳ lạ.", "Nhiều vùng đáy biển phủ đầy huệ biển, loài động vật trông như những bông hoa có cuống."),
  S("k13", "calm", ["yên tĩnh"], "Trở lại khu rừng, điều lạ nhất có lẽ là sự yên tĩnh.", "Không tiếng chim hót, không tiếng ếch kêu, không tiếng thú gọi bầy.", "Chỉ có gió, nước, và tiếng cánh côn trùng."),

  S("n1", "tense", ["dưới nước"], "Nhưng đừng vội yên tâm.", "Mối nguy lớn nhất ở đây nằm dưới nước."),
  S("n2", "tense", ["lưỡng cư"], "Trong đầm lầy có những loài lưỡng cư to như cá sấu.", "Chúng nằm im trong bùn, chỉ hở đôi mắt.", "Và chờ bất cứ thứ gì đi ngang qua."),
  S("n3", "battle", ["cá mập nước ngọt"], "Dưới sông là cá mập nước ngọt dài tới gần ba mét.", "Sau đầu chúng mọc một chiếc gai dài và nhọn.", "Lội qua sông lúc này là một ý tồi."),
  S("n4", "tense", ["bò sát"], "Trên bờ, những loài bò sát đầu tiên đang xuất hiện.", "Phần lớn chỉ nhỏ như thằn lằn.", "Chúng săn côn trùng và những con vật bé hơn."),
  S("n5", "wonder", ["quả trứng có vỏ"], "Chúng có một phát minh thay đổi lịch sử: quả trứng có vỏ.", "Nhờ nó, động vật lần đầu có thể sinh sản xa hẳn mặt nước."),
  S("n6", "wonder", ["tổ tiên"], "Một nhánh khác cũng đẻ trứng có vỏ là tổ tiên rất xa của loài thú.", "Nghĩa là, ở đâu đó trong khu rừng này, có họ hàng của chính bạn."),
  S("n7", "battle", ["lửa"], "Rồi còn lửa.", "Với ba mươi phần trăm ô xy, cây cối bắt lửa dễ hơn nhiều, kể cả khi còn ẩm.", "Chỉ một tia sét là đủ thổi bùng một đám cháy rừng khổng lồ."),
  S("n8", "tense", ["cháy rừng"], "Các lớp than hóa thạch cho thấy cháy rừng thời này xảy ra rất thường xuyên."),
  S("n9", "sad", ["kiệt sức"], "Và trời nóng ẩm tới mức mồ hôi không kịp khô.", "Cơ thể bạn rất dễ kiệt sức vì nóng.", "Đêm xuống, rừng tối đen, chỉ còn tiếng côn trùng rào rào."),

  S("s1", "calm", ["sống sót"], "Vậy bạn sẽ sống sót thế nào?"),
  S("s2", "calm", ["nước"], "Trước hết là nước.", "Nước đầm lầy tù đọng và đầy xác thực vật thối.", "Bạn nên hứng nước mưa, hoặc tìm một dòng suối đang chảy.", "Và đun sôi nếu có thể."),
  S("s3", "tense", ["Nhóm lửa"], "Nhóm lửa ở đây rất dễ.", "Nhưng giữ cho lửa không lan thì rất khó.", "Hãy đốt lửa trên nền đất trống, thật xa cây khô."),
  S("s4", "sad", ["thức ăn"], "Tiếp theo là thức ăn.", "Sẽ không có trái cây, không có lúa gạo, không có loại rau nào quen thuộc.", "Phần lớn cây ở đây con người chưa từng ăn, và không ai biết chúng có độc không."),
  S("s5", "bright", ["côn trùng"], "Nguồn đạm chắc chắn hơn là cá và côn trùng.", "Một con côn trùng khổng lồ nướng trên lửa có thể là bữa tối của bạn.", "Nghe hơi sợ, nhưng nhiều nơi trên thế giới ngày nay vẫn ăn côn trùng."),
  S("s6", "calm", ["đất cao"], "Còn chỗ ở, hãy rời xa đầm lầy.", "Tìm vùng đất cao, khô ráo, nơi ít kẻ săn mồi rình rập.", "Lá dương xỉ khổng lồ có thể lợp thành mái che."),
  S("s7", "tense", ["giông"], "Bạn sẽ cần mái che ấy.", "Ở vùng rừng nhiệt đới này, mưa giông kéo đến rất thường xuyên.", "Và mỗi cơn giông lại mang theo sét."),

  S("e1", "wonder", ["sống nổi"], "Vậy con người hiện đại có sống nổi ở kỷ Than Đá không?"),
  S("e2", "bright", ["Hít thở"], "Hít thở thì được.", "Không khí giàu ô xy có khi còn giúp bạn đỡ mệt hơn.", "Vài ngày, vài tuần, một người khéo léo có thể xoay xở."),
  S("e3", "sad", ["rất khó"], "Nhưng lâu dài thì rất khó.", "Không có cây lương thực, không có thuốc men, không có ai bên cạnh.", "Và mỗi tia sét đều có thể biến khu rừng thành biển lửa."),
  S("e4", "calm", ["không dành cho chúng ta"], "Thế giới ấy không dành cho chúng ta.", "Nó thuộc về côn trùng khổng lồ, lưỡng cư và những cánh rừng đầm lầy."),
  S("e4b", "sad", ["khô hạn"], "Mà chính thế giới ấy cũng sắp thay đổi.", "Khí hậu đang khô dần, và những cánh rừng đầm lầy bắt đầu thu hẹp.", "Loài lưỡng cư mất dần chỗ ở. Còn bò sát, với quả trứng có vỏ, sẽ lên ngôi."),
  S("e5", "wonder", ["mang nợ"], "Nhưng chúng ta vẫn mang nợ nó.", "Than đá từ những cánh rừng ấy đã thắp sáng cuộc cách mạng công nghiệp.", "Và những con vật đẻ trứng có vỏ nhỏ bé thời đó là khởi đầu của dòng dõi dẫn đến loài người."),
  S("kết", "bright", ["Theo dõi"], "Nếu được chọn, bạn muốn tỉnh dậy ở thời kỳ nào tiếp theo?", "Hãy để lại bình luận, và theo dõi kênh để cùng du hành tiếp nhé!"),
];
