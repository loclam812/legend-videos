// Real monsters 1: Titanoboa. Hook format of the Megalodon Shorts: the snake and the claim are on screen at frame 0.
// Figures, from web-search summaries, not the paper:
// - Head et al. 2009 (Nature): about 12.8 m long, about 1,135 kg (range 652 to 1,819 kg), Cerrejon, Colombia, 58 to 60 Ma.
//   A family car is about 4.3 m, so three end to end are about 13 m.
// - the same paper infers a tropical mean annual temperature of about 30 to 34 C from its size; later work disputes how much hotter.
const LANG = "en";
const TEMPO = 1.1;
const MUSIC = "earth";
const SUBS = false;
const S = (label, mood, ...texts) => ({ label, mood, hot: [], lines: texts.map((t) => [null, t]) });
const SHOTS = [
  S("hook", "tense", "This snake was as long as three cars end to end."),
  S("1", "wonder", "Titanoboa lived in Colombia, sixty million years ago."),
  S("2", "tense", "It may have weighed over a tonne, as much as a small car."),
  S("3", "battle", "It hunted giant fish in hot, swampy rivers."),
  S("4", "wonder", "Snakes this big need heat, so the tropics may have been hotter than today."),
  S("kết", "bright", "The biggest snake ever found. Follow Into Deep Time for more."),
];
