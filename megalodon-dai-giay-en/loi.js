// Megalodon short 1: how big it was. New hook format: the shark is on screen at second 0 and the first line is a claim, not a date.
// Figures, checked against web-search summaries, not the papers:
// - length: Shimada et al. 2025 (Palaeontologia Electronica) give up to ~24.3 m as a tentative upper bound and others dispute it,
//   so the script says only "past fifteen meters"; a school bus is about 12 m.
// - teeth: up to about 15 cm (crown height of the largest known teeth), roughly a hand's length.
// - prey: whale bones with megalodon bite marks; extinction ~3.5 Ma (Boessenecker et al. 2019, PeerJ).
const LANG = "en";
const TEMPO = 1.1;
const MUSIC = "water";
const SUBS = false;
const S = (label, mood, ...texts) => ({ label, mood, hot: [], lines: texts.map((t) => [null, t]) });
const SHOTS = [
  S("hook", "tense", "This shark was longer than a school bus."),
  S("1", "wonder", "Megalodon may have grown past fifteen meters."),
  S("2", "tense", "Its teeth were as long as your hand."),
  S("3", "battle", "It hunted whales."),
  S("kết", "bright", "Gone for three and a half million years."),
];
