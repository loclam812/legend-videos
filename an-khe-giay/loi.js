// The shot list of "Ăn khế trả vàng": label, mood (which layers of music play), caption words to colour, and the words.
// One short sentence per shot; only the bird speaks, with the verse every telling keeps.
const SHOTS = [
  { label: "hook", mood: "wonder", hot: ["trả vàng"], lines: [[null, "Một con chim trả vàng cho người cho nó ăn khế."]] },
  { label: "1", mood: "calm", hot: ["hai anh em"], lines: [[null, "Chuyện bắt đầu từ hai anh em nhà nọ."]] },
  { label: "2", mood: "sad", hot: ["tham lam"], lines: [[null, "Cha mẹ mất, người anh tham lam giành hết nhà cửa, ruộng vườn."]] },
  { label: "3", mood: "calm", hot: ["cây khế"], lines: [[null, "Người em chỉ được một túp lều và một cây khế."]] },
  { label: "4", mood: "bright", hot: ["sai trĩu quả"], lines: [[null, "Vợ chồng người em chăm chỉ, cây khế sai trĩu quả ngọt."]] },
  { label: "5", mood: "tense", hot: ["chim lạ"], lines: [[null, "Một hôm, có con chim lạ bay đến ăn khế."]] },
  { label: "6", mood: "sad", hot: ["sống bằng gì"], lines: [[null, "Người em than: chim ăn hết khế, nhà tôi biết sống bằng gì."]] },
  { label: "7", mood: "wonder", hot: ["trả cục vàng", "ba gang"], lines: [["Chim", "Ăn một quả, trả cục vàng, may túi ba gang, mang đi mà đựng."]] },
  { label: "8", mood: "calm", hot: ["ba gang"], lines: [[null, "Người em may đúng một chiếc túi ba gang."]] },
  { label: "9", mood: "wonder", hot: ["đảo đầy vàng"], lines: [[null, "Chim chở người em bay qua biển, đến một hòn đảo đầy vàng."]] },
  { label: "10", mood: "bright", hot: ["vừa đầy túi"], lines: [[null, "Người em nhặt vừa đầy túi rồi theo chim trở về."]] },
  { label: "11", mood: "bright", hot: ["giàu có"], lines: [[null, "Từ đó, vợ chồng người em trở nên giàu có."]] },
  { label: "12", mood: "tense", hot: ["đổi cả gia tài"], lines: [[null, "Người anh nghe chuyện, liền đòi đổi cả gia tài lấy cây khế."]] },
  { label: "13", mood: "tense", hot: ["mười hai gang"], lines: [[null, "Chim lại đến, nhưng người anh may hẳn túi mười hai gang."]] },
  { label: "14", mood: "battle", hot: ["đầy túi"], lines: [[null, "Ra đến đảo, anh ta nhét vàng đầy túi, đầy cả người."]] },
  { label: "15", mood: "battle", hot: ["quá nặng"], lines: [[null, "Vàng quá nặng, chim bay giữa biển thì chao đảo."]] },
  { label: "16", mood: "sad", hot: ["rơi xuống biển"], lines: [[null, "Người anh cùng túi vàng rơi xuống biển sâu."]] },
  { label: "17", mood: "calm", hot: ["tham thì thâm"], lines: [[null, "Người xưa dạy: tham thì thâm."]] },
  { label: "kết", mood: "bright", hot: ["Theo dõi"], lines: [[null, "Theo dõi kênh để nghe thêm chuyện xưa nhé!"]] },
];
