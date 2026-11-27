// The shot list of "Why the nozzle of a rocket engine does not burn" in English: the English cut of
// ten-lua-elon-musk/, made on 2026-11-24 when the user asked for a version with EN. The same twenty-four shots, layers
// and scenes; the lines are that folder's Vietnamese script translated, and each keeps the order of its information,
// so that every label still pops on the word it names. That script retells, in other words, the narration of the
// user's source video: the TikTok account "hatdautrithuc", ten-lua-elon-musk/snaptik.vn_7710883445316128021.mp4,
// read from its burned-in captions on 2026-11-24 (four passages of them could not be read with certainty and are
// retold by meaning: what the cold flow is in shot 1, how the nozzle is cast in shot 7, what the steel block does in
// shot 8 and the engine number in shot 20, which is spelled out here as the Vietnamese voice spells it out).
// Every figure is carried over as that video states it and nobody has checked it against any source: gas at
// 3,300 °C, steel melting near 1,400 °C, a cooled wall less than 1 cm from the flame, liquid hydrogen at −253 °C,
// about 390 cooling channels, more than 30 3D-printed parts and a combustion chamber at half the price, and a
// 200-second test at 111 % of the rated thrust on 18 November 2026 at the Stennis center (the video was uploaded
// on 2026-11-22, so its "năm nay" is 2026). The order of the cooling path (the chamber channels, then the nozzle
// tubes) is the video's too.
// Numbers are written to be read well and to break into captions of one or two lines: the thousands as digits
// with a comma (the voice reads "3,300" as three thousand three hundred), the cold as "minus" in words. Two lines
// are two sentences where one would break badly (6) or say more than the Vietnamese (8, 12): the caption chunker
// was tuned for Vietnamese, and a line is reworded here rather than the engine changed. A caption that flashes for a
// third of a second is cured the same way: "…at the same time: that is regenerative cooling." left "that is" alone
// on screen for 0.33 s in a first recording, so shot 16 now ends on the name as its own sentence.
const TEMPO = 1.3; // the user's choice for this cut on 2026-11-24 ("speed 1.3 for EN"), after a first version at the 1.5 of the Vietnamese cut, which read at about 253 words a minute
// the narrator: doc.js reads the story with this edge-tts voice, a man like Nam Minh in the Vietnamese cut
const VOICE = "en-US-AndrewNeural";
const SHOTS = [
  { label: "hook", mood: "wonder", hot: ["burn", "3,300 degrees Celsius"], lines: [[null, "Why doesn't a rocket nozzle burn, when the flame reaches 3,300 degrees Celsius?"]] },
  { label: "1", mood: "wonder", hot: ["centimetre", "colder flow"], lines: [[null, "Because less than a centimetre from the flame, a colder flow is already running."]] },
  { label: "2", mood: "calm", hot: ["RS-25", "four of them"], lines: [[null, "This is the RS-25: every SLS rocket heading for the Moon carries four of them."]] },
  { label: "3", mood: "tense", hot: ["1,400 degrees Celsius", "2,000 degrees hotter"], lines: [[null, "Plain steel melts at about 1,400 degrees Celsius, and this flame is nearly 2,000 degrees hotter."]] },
  { label: "4", mood: "tense", hot: ["sag like wax"], lines: [[null, "Left standing in the fire, the nozzle would sag like wax in no time."]] },
  { label: "5", mood: "calm", hot: ["burns away"], lines: [[null, "The first way is a coating that burns away by itself, taking the heat with it patch by patch."]] },
  { label: "6", mood: "tense", hot: ["worn out", "thrown away", "shuttle", "again and again"], lines: [[null, "But worn out means it gets thrown away. A shuttle has to fly again and again."]] },
  { label: "7", mood: "calm", hot: ["cast very thick", "soaks up the heat"], lines: [[null, "The second way is metal cast very thick, so the block itself soaks up the heat."]] },
  { label: "8", mood: "tense", hot: ["only stores the heat", "cannot last long"], lines: [[null, "But that block only stores the heat, and once hot it cannot last long."]] },
  { label: "9", mood: "wonder", hot: ["liquid hydrogen", "minus 253"], lines: [[null, "The answer is waiting in the tank of liquid hydrogen, cold down to minus 253 degrees Celsius."]] },
  { label: "10", mood: "calm", hot: ["390 channels", "chamber wall"], lines: [[null, "Before it burns, it is pumped round through about 390 channels in the chamber wall."]] },
  { label: "11", mood: "calm", hot: ["small steel tubes", "into the nozzle"], lines: [[null, "Then it flows on through scores of small steel tubes, welded tight together into the nozzle."]] },
  { label: "12", mood: "wonder", hot: ["sweeps it away", "stays cool"], lines: [[null, "The moment heat touches the wall, the cold flow sweeps it away, and the metal stays cool."]] },
  { label: "13", mood: "tense", hot: ["just an instant", "burst at once"], lines: [[null, "Let that flow stop for just an instant, and the tube wall will burst at once."]] },
  { label: "14", mood: "wonder", hot: ["go to waste"], lines: [[null, "Does the heat that gets swept away go to waste?"]] },
  { label: "15", mood: "bright", hot: ["warms the hydrogen", "burn harder"], lines: [[null, "No: it warms the hydrogen, so it enters the chamber ready to burn harder."]] },
  { label: "16", mood: "bright", hot: ["regenerative cooling"], lines: [[null, "The fuel cools and is warmed at the same time. Regenerative cooling."]] },
  { label: "17", mood: "tense", hot: ["very costly"], lines: [[null, "But cutting all those channels and welding all those tubes by hand is very costly."]] },
  { label: "18", mood: "bright", hot: ["printed in 3D", "made faster", "half the price"], lines: [[null, "The new version has more than 30 parts printed in 3D: the chamber is made faster, at half the price."]] },
  { label: "19", mood: "calm", hot: ["November 18, 2026", "Stennis"], lines: [[null, "On November 18, 2026, at the Stennis center."]] },
  { label: "20", mood: "tense", hot: ["one zero zero zero one"], lines: [[null, "Engine number one zero zero zero one ignites."]] },
  { label: "21", mood: "tense", hot: ["200 seconds", "111%", "rated thrust"], lines: [[null, "It runs without a pause for 200 seconds, pushing to 111% of its rated thrust."]] },
  { label: "22", mood: "bright", hot: ["still intact", "without a single burn mark"], lines: [[null, "The fire is out and the nozzle is still intact, without a single burn mark."]] },
  { label: "kết", mood: "bright", hot: ["the very fuel", "going to burn"], lines: [[null, "What keeps the nozzle alive in a sea of fire is the very fuel it is going to burn."]] },
];
