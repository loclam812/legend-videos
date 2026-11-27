// The shot list of "Vi khuẩn sống trong cơ thể bạn nhiều thế nào?" (How Many Microbes Live Inside Your Body?) in
// Vietnamese: the Vietnamese cut of vi-khuan-trong-co-the-giay/, made on 2026-11-26 when the user asked for a version in
// Vietnamese on that folder's second script (the outline of 2026-11-25, eighteen shots in nine scenes) with the music of
// "Aetheric - Rainbow (freetouse.com)" at a low volume. The same shots, layers and scenes as that folder, and every line
// is its English line translated (the first Vietnamese cut, on the shorter script, is kept in xuat/anh-cu/).
// The figure is the English cut's, unchanged: about 38 trillion bacterial cells in a typical adult, roughly as many as
// its human cells (Sender, Fuchs and Milo, PLoS Biology 2016: 3.8 x 10^13 against 3.0 x 10^13, as remembered there;
// nobody has checked it against the paper).
const TEMPO = 1.3; // the speed the English cut's content.json names (the user's choice for this script): a brisk read
// the narrator: doc.js reads the story with this edge-tts voice, Nam Minh, the man of the "nam" voice family that the
// English cut's content.json names
const VOICE = "vi-VN-NamMinhNeural";
// Hot phrases are glued for the caption chunker, so a phrase stays in one caption, and each of their words is picked out
// in pale cream. The glue does not keep the browser from breaking a line: it splits a two-line caption at its width
// middle (text-wrap: balance), which in Vietnamese often falls inside a compound, so every line here is worded until
// each caption breaks between words, checked by rendering the chunks in the caption box. So a hot phrase only moves
// caption boundaries, and it paints all its words cream: the key terms are hot for the cream, and beside them only the
// phrases the chunker needs (shot 3 needs four, so most of its line is cream). A phrase spelled with another case than
// its line ("bậc độ lớn" against "Bậc độ lớn") only colours, it never glues.
// The lines that are not the plainest translation: shot 6 has no "But" and says "tập trung ở" for "are found in"; shot
// 8 adds "nhiều"; shot 10 "lớp bảo vệ trong ruột" for "protective barrier lining your intestines"; shot 13 "giúp" for
// "can help"; shots 12 and 14 add "rất"; shot 16 "Cơ thể bạn là cả một…" for "You're home to…".
// Shot 6 holds a silent beat after its sentence (a pause line, as the last shot has): in Vietnamese "đại tràng" is the
// last word but one, where the English line has a second and a half more to say, and the scene rings and names the
// large intestine and goes in on it there. The last caption stays up through the pause; the srt the recorder writes
// has an empty cue for it.
// Music: the user's own track, "Aetheric - Rainbow (freetouse.com).mp3" in the repo root, at a low volume under the
// narration. The engine's giay/nhac.js knows only its synthesized bed, so a scratch script (/tmp/vi-khuan-vi2/
// nhac-nguoi.js, outside the repo) made xuat/am.m4a before the recording: the narration levelled first, exactly as
// `giay/nhac.js off` levels it, then the track from its start (faded in over 0.5 s, out over the last 3 s) added at
// -31 dBFS RMS and ducked by the narration through the engine's own compressor settings — about 19 dB under the voice
// while it speaks and 17 dB below its level in the pauses, where the engine's own bed sits about 10 dB under the voice.
// The levelling is not done after the bed is added because loudnorm in one pass changes its gain with the material,
// and with a bed this quiet it lifted the end, where only the music plays, about 6 dB. xuat/nhac.wav is that bed.
// A run of node giay/nhac.js on this folder replaces both files with the engine's own music.
const SHOTS = [
  { label: "hook", mood: "wonder", hot: ["riêng mình?"], lines: [[null, "Bạn có nghĩ cơ thể mình thuộc về riêng mình?"]] },
  { label: "1", mood: "wonder", hot: ["nghĩ lại!"], lines: [[null, "Hãy nghĩ lại!"]] },
  { label: "2", mood: "wonder", hot: ["hàng nghìn tỷ", "sinh vật tí hon", "cư trú", "ngay trong cơ thể bạn!"], lines: [[null, "Ngay lúc này, hàng nghìn tỷ sinh vật tí hon đang cư trú ngay trong cơ thể bạn!"]] },
  { label: "3", mood: "calm", hot: ["nhà khoa học", "ước tính rằng", "trưởng thành", "trung bình", "38 nghìn tỷ", "tế bào vi khuẩn"], lines: [[null, "Các nhà khoa học ước tính rằng một người trưởng thành trung bình có khoảng 38 nghìn tỷ tế bào vi khuẩn."]] },
  { label: "4", mood: "calm", hot: ["Bậc độ lớn", "gần bằng", "tế bào người"], lines: [[null, "Bậc độ lớn của con số đó gần bằng số tế bào người của chính bạn!"]] },
  { label: "5", mood: "calm", hot: ["trên da", "trong miệng", "đường tiêu hóa"], lines: [[null, "Vi sinh vật sống trên da của bạn, trong miệng và khắp đường tiêu hóa."]] },
  // the pause line: a silent beat of 600 ms, so the large intestine is ringed and named before the next scene's iris
  { label: "6", mood: "wonder", hot: ["Vi khuẩn", "phần lớn", "đại tràng"], lines: [[null, "Vi khuẩn của bạn phần lớn tập trung ở đại tràng."], [null, "", 600]] },
  { label: "7", mood: "wonder", hot: ["không hề cô đơn."], lines: [[null, "Và vi khuẩn không hề cô đơn."]] },
  { label: "8", mood: "wonder", hot: ["virus,", "nấm", "dạng sống vi mô khác."], lines: [[null, "Hệ vi sinh vật của bạn cũng gồm cả virus, nấm và nhiều dạng sống vi mô khác."]] },
  { label: "9", mood: "bright", hot: ["chất xơ", "hợp chất", "khỏe mạnh", "cơ thể bạn không tự tiêu hóa được,"], lines: [[null, "Một số vi khuẩn đường ruột phân giải chất xơ mà cơ thể bạn không tự tiêu hóa được, tạo ra các hợp chất giúp đường ruột khỏe mạnh."]] },
  { label: "10", mood: "calm", hot: ["tương tác", "hệ miễn dịch", "lớp bảo vệ", "duy trì"], lines: [[null, "Vi sinh vật đường ruột của bạn còn tương tác với hệ miễn dịch và giúp duy trì lớp bảo vệ trong ruột."]] },
  { label: "11", mood: "tense", hot: ["gây bệnh"], lines: [[null, "Còn một số vi sinh vật lại có thể gây bệnh."]] },
  { label: "12", mood: "tense", hot: ["Thuốc kháng sinh,", "rối loạn"], lines: [[null, "Thuốc kháng sinh, dù đôi khi rất cần thiết, cũng có thể làm rối loạn cả vi khuẩn tốt trong ruột."]] },
  { label: "13", mood: "bright", hot: ["thực phẩm", "chất xơ", "tốt"], lines: [[null, "Ăn đa dạng các thực phẩm giàu chất xơ giúp nuôi dưỡng nhiều vi khuẩn tốt của ruột."]] },
  { label: "14", mood: "bright", hot: ["Chế độ ăn uống", "quan trọng"], lines: [[null, "Chế độ ăn uống thường ngày của bạn rất quan trọng!"]] },
  { label: "15", mood: "calm", hot: ["một sinh vật"], lines: [[null, "Vậy là bạn không chỉ là một sinh vật."]] },
  { label: "16", mood: "bright", hot: ["cả một", "hệ sinh thái vi mô!"], lines: [[null, "Cơ thể bạn là cả một hệ sinh thái vi mô!"]] },
  // the question of the outline's last scene, on screen only: a pause of three seconds
  { label: "kết", mood: "bright", hot: [], lines: [[null, "", 3000]] },
];
