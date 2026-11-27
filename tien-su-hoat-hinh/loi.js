// The shot list of "Surviving the Ice Age in a mammoth-bone house": one short sentence per shot,
// vertical short in the paper-cut storybook look (the caption chunks are burned in, as in the reference
// the user chose on 2026-11-23). Every line is the user's script, word for word — the same script as
// nha-xuong-mamut-hoathinh; this folder is the user's re-make under the new name tien-su-hoat-hinh.
// The dwelling is real: Upper Palaeolithic houses built from mammoth bones are known across the
// East European Plain (Mezhirich, Mezin, Dobranichevka in Ukraine, roughly 15,000-20,000 years
// old), and the lines follow the usual published description of them: bone frames, hide covers
// insulated with grass and earth, small entrances, smoke holes, fur clothing and fur bedding.
// The figures were written from memory of published estimates; nobody has re-checked them.
const TEMPO = 1.3; // from content.json (the user chose the fastest allowed read)
const SHOTS = [
  { label: "hook", mood: "wonder", hot: ["Kỷ Băng Hà"], lines: [[null, "Bạn có thể sống sót qua mùa đông khắc nghiệt của Kỷ Băng Hà bằng cách nào?"]] },
  { label: "1", mood: "tense", hot: ["20.000 năm trước"], lines: [[null, "Khoảng 20.000 năm trước, con người phải đối mặt với những mùa đông lạnh giá khủng khiếp."]] },
  { label: "2", mood: "tense", hot: ["nhà bê tông", "máy sưởi"], lines: [[null, "Không có nhà bê tông, không có máy sưởi, cũng chẳng có quần áo hiện đại."]] },
  { label: "3", mood: "wonder", hot: ["sinh tồn"], lines: [[null, "Nhưng họ đã tìm ra một cách sinh tồn vô cùng độc đáo."]] },
  { label: "4", mood: "wonder", hot: ["voi ma mút"], lines: [[null, "Họ sử dụng xương của những con voi ma mút khổng lồ để xây dựng nhà ở."]] },
  { label: "5", mood: "calm", hot: ["Hộp sọ", "xương sườn", "ngà voi"], lines: [[null, "Hộp sọ, xương sườn và ngà voi được ghép lại thành một bộ khung vững chắc."]] },
  { label: "6", mood: "calm", hot: ["da động vật"], lines: [[null, "Sau đó, họ phủ da động vật lên bên ngoài, kết hợp với cỏ và các vật liệu tự nhiên để chắn gió lạnh."]] },
  { label: "7", mood: "bright", hot: ["đống lửa"], lines: [[null, "Bên trong, cả gia đình quây quần bên đống lửa, mặc quần áo làm từ lông thú và ngủ trên những lớp da động vật dày."]] },
  { label: "8", mood: "calm", hot: ["lối vào nhỏ", "khói"], lines: [[null, "Một lối vào nhỏ giúp hạn chế không khí lạnh tràn vào, trong khi khói thoát ra qua khoảng mở phía trên."]] },
  { label: "9", mood: "wonder", hot: ["nơi trú ẩn"], lines: [[null, "Những ngôi nhà này không chỉ là nơi trú ẩn."]] },
  { label: "10", mood: "bright", hot: ["trí thông minh"], lines: [[null, "Chúng là minh chứng cho trí thông minh và khả năng thích nghi đáng kinh ngạc của con người thời tiền sử."]] },
  { label: "kết", mood: "bright", hot: ["Kỷ Băng Hà"], lines: [[null, "Và chính những phát minh đơn giản ấy đã giúp họ sống sót qua Kỷ Băng Hà."]] },
];
