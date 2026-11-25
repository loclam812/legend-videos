// Short cut from 300-trieu-nam-giay-en: wildfires in the oxygen-rich air of the late Carboniferous, one short sentence per shot.
// Figures: oxygen near 30 % against 21 % today (Berner 2006, GEOCARBSULF); abundant fossil charcoal records frequent fires
// (Scott & Glasspool 2006, PNAS). Burning damp plants at high oxygen follows the fire-window argument, not a measurement.
const LANG = "en";
const TEMPO = 1.1;
const MUSIC = "fire";
const SUBS = false;
const S = (label, mood, ...texts) => ({ label, mood, hot: [], lines: texts.map((t) => [null, t]) });
const SHOTS = [
  S("hook", "tense", "Imagine air so rich in oxygen that even damp plants could catch fire."),
  S("1", "wonder", "Three hundred million years ago, oxygen may have made up about thirty percent of the air."),
  S("2", "calm", "Today, it is only twenty-one percent."),
  S("3", "tense", "With that much oxygen, fire spreads far more easily."),
  S("4", "battle", "A single lightning strike could set a whole forest ablaze."),
  S("5", "sad", "Fossil charcoal shows that wildfires were common in this age."),
  S("kết", "bright", "Follow Into Deep Time for more stories from Earth's past!"),
];
