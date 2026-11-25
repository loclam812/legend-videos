// Short cut from 300-trieu-nam-giay-en: sharks and giant amphibians of the late Carboniferous, one short sentence per shot.
// Figures: the freshwater shark Orthacanthus up to about 3 m with a spine behind its head; crocodile-sized
// temnospondyl amphibians. Checked against web-search summaries, not the papers.
const LANG = "en";
const TEMPO = 1.1;
const MUSIC = "water";
const SUBS = false;
const S = (label, mood, ...texts) => ({ label, mood, hot: [], lines: texts.map((t) => [null, t]) });
const SHOTS = [
  S("hook", "tense", "Three hundred million years ago, wading across a river could be a very bad idea."),
  S("1", "battle", "Freshwater sharks lived there, some nearly three meters long."),
  S("2", "tense", "A long, sharp spine grew from the back of their heads."),
  S("3", "tense", "In the swamps nearby, amphibians as big as crocodiles waited in the mud."),
  S("4", "wonder", "Out at sea, it was a golden age of sharks, in all kinds of strange shapes."),
  S("kết", "bright", "Follow Into Deep Time for more stories from Earth's past!"),
];
