// The shot list of "Why the nozzle of a rocket engine does not burn": one short sentence per shot, vertical short
// in the paper-cut storybook look of tien-su-hoat-hinh (the caption chunks are burned in). The lines retell, in
// other words, the narration of the user's source video: the TikTok account "hatdautrithuc", file
// ten-lua-elon-musk/snaptik.vn_7710883445316128021.mp4, read from its burned-in captions on 2026-11-24 (four
// passages of those captions could not be read with certainty and are retold by meaning: what the cold flow is
// in shot 1, how the nozzle is cast in shot 7, what the steel block does in shot 8 and the engine number in shot 20).
// Every figure is carried over as that video states it and nobody has checked it against any source: gas at
// 3.300 °C, steel melting near 1.400 °C, a cooled wall less than 1 cm from the flame, liquid hydrogen at −253 °C,
// about 390 cooling channels, more than 30 3D-printed parts and a combustion chamber at half the price, and a
// 200-second test at 111 % of the rated thrust on 18 November 2026 at the Stennis center (the video was uploaded
// on 2026-11-22, so its "năm nay" is 2026). The order of the cooling path (the chamber channels, then the nozzle
// tubes) is the video's too.
const TEMPO = 1.5; // from content.json: the user's choice of 2026-11-24, after a first build at 1.2 (a little slower than the fastest read, because these lines are full of figures)
const SHOTS = [
  { label: "hook", mood: "wonder", hot: ["không cháy", "nóng tới 3.300 độ C"], lines: [[null, "Vì sao vòi phun tên lửa không cháy, dù lửa nóng tới 3.300 độ C?"]] },
  { label: "1", mood: "wonder", hot: ["một xentimét", "dòng lạnh hơn"], lines: [[null, "Vì cách lửa chưa tới một xentimét, đã có một dòng lạnh hơn đang chảy."]] },
  { label: "2", mood: "calm", hot: ["RS-25", "trang bị bốn chiếc"], lines: [[null, "Đây là RS-25: mỗi tên lửa SLS lên Mặt Trăng trang bị bốn chiếc."]] },
  { label: "3", mood: "tense", hot: ["1.400 độ C", "gần hai nghìn độ"], lines: [[null, "Thép thường chảy ở khoảng 1.400 độ C, lửa này còn nóng hơn gần hai nghìn độ."]] },
  { label: "4", mood: "tense", hot: ["nhũn ra như sáp"], lines: [[null, "Chỉ cần đứng yên trong lửa, vòi phun sẽ nhũn ra như sáp trong chớp mắt."]] },
  { label: "5", mood: "calm", hot: ["tự cháy mòn"], lines: [[null, "Cách thứ nhất: phủ một lớp tự cháy mòn, mang nhiệt bay theo từng mảng."]] },
  { label: "6", mood: "tense", hot: ["mòn hết là bỏ", "tàu con thoi", "bay lại nhiều chuyến"], lines: [[null, "Nhưng mòn hết là bỏ, trong khi tàu con thoi phải bay lại nhiều chuyến."]] },
  { label: "7", mood: "calm", hot: ["đúc thật dày", "hút nhiệt"], lines: [[null, "Cách thứ hai: đúc thật dày, để khối kim loại tự hút nhiệt."]] },
  { label: "8", mood: "tense", hot: ["chỉ trữ nhiệt", "không trụ được lâu"], lines: [[null, "Nhưng khối đó chỉ trữ nhiệt thôi, nóng lên là không trụ được lâu."]] },
  { label: "9", mood: "wonder", hot: ["hydro lỏng", "âm 253 độ C"], lines: [[null, "Lời giải nằm sẵn trong bồn hydro lỏng, lạnh tới âm 253 độ C."]] },
  { label: "10", mood: "calm", hot: ["390 rãnh", "thành buồng đốt"], lines: [[null, "Trước khi đốt, nó được bơm vòng qua khoảng 390 rãnh trong thành buồng đốt."]] },
  { label: "11", mood: "calm", hot: ["ống thép nhỏ", "thành vòi phun"], lines: [[null, "Rồi chảy tiếp qua hàng loạt ống thép nhỏ, hàn sát nhau thành vòi phun."]] },
  { label: "12", mood: "wonder", hot: ["dòng lạnh cuốn đi", "không kịp nóng"], lines: [[null, "Nhiệt vừa chạm thành đã bị dòng lạnh cuốn đi, kim loại không kịp nóng."]] },
  { label: "13", mood: "tense", hot: ["một tích tắc", "thủng ngay"], lines: [[null, "Dòng chảy ấy chỉ ngừng một tích tắc, thành ống sẽ thủng ngay."]] },
  { label: "14", mood: "wonder", hot: ["có phí không"], lines: [[null, "Vậy chỗ nhiệt bị cuốn đi có phí không?"]] },
  { label: "15", mood: "bright", hot: ["hâm nóng hydro", "cháy mạnh hơn"], lines: [[null, "Không: nó hâm nóng hydro, giúp hydro vào buồng đốt sẵn sàng cháy mạnh hơn."]] },
  { label: "16", mood: "bright", hot: ["làm mát tái sinh"], lines: [[null, "Nhiên liệu vừa làm mát, vừa được hâm nóng: đó là làm mát tái sinh."]] },
  { label: "17", mood: "tense", hot: ["tốn kém"], lines: [[null, "Nhưng khoét từng ấy rãnh, hàn từng ấy ống bằng tay thì rất tốn kém."]] },
  { label: "18", mood: "bright", hot: ["in 3D", "làm nhanh hơn", "chỉ còn một nửa"], lines: [[null, "Bản mới có hơn 30 bộ phận in 3D: buồng đốt làm nhanh hơn, giá chỉ còn một nửa."]] },
  { label: "19", mood: "calm", hot: ["18 tháng 11 năm 2026", "Stennis"], lines: [[null, "Ngày 18 tháng 11 năm 2026, tại Trung tâm Stennis."]] },
  { label: "20", mood: "tense", hot: ["một không không không một"], lines: [[null, "Động cơ số một không không không một bùng cháy."]] },
  { label: "21", mood: "tense", hot: ["200 giây", "111%", "lực đẩy định mức"], lines: [[null, "Nó chạy liền 200 giây, đẩy tới 111% lực đẩy định mức."]] },
  { label: "22", mood: "bright", hot: ["nguyên vẹn", "không một vệt cháy"], lines: [[null, "Lửa tắt, vòi phun vẫn nguyên vẹn, không một vệt cháy."]] },
  { label: "kết", mood: "bright", hot: ["nhiên liệu nó sắp đốt"], lines: [[null, "Thứ giữ vòi phun sống sót giữa biển lửa lại chính là nhiên liệu nó sắp đốt."]] },
];
