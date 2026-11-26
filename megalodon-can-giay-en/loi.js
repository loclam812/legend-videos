// Megalodon short 2: the bite. New hook format: the open jaws fill the frame at second 0.
// Figures, checked against web-search summaries, not the papers:
// - bite: Wroe et al. 2008 estimate 10.8 to 18.2 tonnes for megalodon against about 1.8 tonnes for a great white,
//   so "up to ten times" and "as much as eighteen tonnes"; an African elephant weighs about 6 tonnes.
// - bite marks on fossil whale bones are widely reported.
const LANG = "en";
const TEMPO = 1.1;
const MUSIC = "fire";
const SUBS = false;
const S = (label, mood, ...texts) => ({ label, mood, hot: [], lines: texts.map((t) => [null, t]) });
const SHOTS = [
  S("hook", "battle", "This may be the strongest bite in history."),
  S("1", "tense", "Up to ten times harder than a great white."),
  S("2", "tense", "As much as eighteen tonnes, like three elephants pressing down."),
  S("3", "wonder", "Fossil whale bones still carry its bite marks."),
  S("kết", "bright", "Follow Into Deep Time for more giants of the past."),
];
