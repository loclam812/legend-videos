// The shot list of "Ten minutes after the asteroid that killed the dinosaurs": one short sentence per shot.
// The numbers follow published estimates: a body about 10 km wide at about 20 km/s (Chicxulub, 66 million years ago),
// a crater close to 200 km, a 4.5 km wall of water 2.5 minutes after impact (Range et al. 2022), and seismic waves
// reaching a site 3000 km away within about ten minutes (Tanis, DePalma et al. 2019).
const TEMPO = 1.1;
const SUBS = false;
const SHOTS = [
  { label: "hook", mood: "tense", hot: ["Mười phút"], lines: [[null, "Mười phút sau khi thiên thạch giết chết khủng long, Trái Đất ra sao?"]] },
  { label: "1", mood: "wonder", hot: ["mười cây số"], lines: [[null, "66 triệu năm trước, một thiên thạch rộng khoảng mười cây số lao về Trái Đất."]] },
  { label: "2", mood: "tense", hot: ["hai mươi cây số mỗi giây"], lines: [[null, "Tốc độ ước tính: khoảng hai mươi cây số mỗi giây."]] },
  { label: "3", mood: "battle", hot: ["Mexico"], lines: [[null, "Nó đâm xuống vùng biển nông ở Mexico ngày nay."]] },
  { label: "4", mood: "battle", hot: ["quả cầu lửa"], lines: [[null, "Một quả cầu lửa khổng lồ bùng sáng."]] },
  { label: "5", mood: "battle", hot: ["bốc cháy"], lines: [[null, "Rừng cây cách đó hàng trăm cây số bốc cháy."]] },
  { label: "6", mood: "tense", hot: ["hai trăm cây số"], lines: [[null, "Chỉ vài phút, một cái hố rộng gần hai trăm cây số hình thành."]] },
  { label: "7", mood: "battle", hot: ["Đá nóng chảy"], lines: [[null, "Đá nóng chảy bị hất lên tận rìa không gian."]] },
  { label: "8", mood: "battle", hot: ["bốn cây số rưỡi"], lines: [[null, "Trong chốc lát, nước biển dựng thành bức tường cao bốn cây số rưỡi."]] },
  { label: "9", mood: "battle", hot: ["rung chuyển"], lines: [[null, "Mặt đất rung chuyển mạnh hơn mọi trận động đất con người từng đo được."]] },
  { label: "10", mood: "tense", hot: ["xuyên qua cả hành tinh"], lines: [[null, "Sóng địa chấn chạy xuyên qua cả hành tinh."]] },
  { label: "11", mood: "tense", hot: ["ba nghìn cây số"], lines: [[null, "Cách đó ba nghìn cây số, mặt đất dưới chân khủng long bắt đầu rung."]] },
  { label: "12", mood: "battle", hot: ["dậy sóng"], lines: [[null, "Sông hồ dậy sóng, nước tràn ngược lên bờ."]] },
  { label: "13", mood: "tense", hot: ["hạt đá nóng"], lines: [[null, "Trên cao, hàng tỉ hạt đá nóng đang rơi trở lại."]] },
  { label: "14", mood: "battle", hot: ["lò nướng"], lines: [[null, "Theo nhiều mô hình, vài giờ sau chúng nung bầu trời nóng như lò nướng."]] },
  { label: "15", mood: "sad", hot: ["che kín Mặt Trời"], lines: [[null, "Bụi và muội che kín Mặt Trời suốt nhiều tháng."]] },
  { label: "16", mood: "sad", hot: ["Ba phần tư"], lines: [[null, "Ba phần tư các loài trên Trái Đất biến mất."]] },
  { label: "17", mood: "wonder", hot: ["tổ tiên của chúng ta"], lines: [[null, "Nhưng vài loài thú nhỏ vẫn sống sót, và tổ tiên của chúng ta ở trong số đó."]] },
  { label: "kết", mood: "bright", hot: ["Theo dõi"], lines: [[null, "Theo dõi kênh để xem thêm chuyện Trái Đất nhé!"]] },
];
