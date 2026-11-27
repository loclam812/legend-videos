// Real monsters 2: Quetzalcoatlus. Hook format of the Megalodon Shorts: the animal and the claim are on screen at frame 0.
// Figures, from web-search summaries, not the papers:
// - Witton & Naish 2008 (PLoS ONE): wingspan about 10 to 11 m, standing about as tall as a giraffe, ground-stalking forager.
//   A Cessna 172 spans 11 m; a giraffe stands about 5 m.
// - Habib 2008 (Zitteliana): quadrupedal launch, vaulting off the forelimbs; a hypothesis, hence "probably".
// - extinct at the end of the Cretaceous, about 66 Ma.
const LANG = "en";
const TEMPO = 1.1;
const MUSIC = "air";
const SUBS = false;
const S = (label, mood, ...texts) => ({ label, mood, hot: [], lines: texts.map((t) => [null, t]) });
const SHOTS = [
  S("hook", "tense", "This animal could fly, and it stood as tall as a giraffe."),
  S("1", "wonder", "Quetzalcoatlus was a pterosaur, not a dinosaur."),
  S("2", "wonder", "Its wings spanned about ten meters, as wide as a small plane."),
  S("3", "tense", "On the ground, it may have stalked small animals like a giant stork."),
  S("4", "battle", "To take off, it probably vaulted into the air on its arms."),
  S("kết", "calm", "Gone with the dinosaurs, sixty-six million years ago."),
];
