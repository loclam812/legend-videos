// Short cut from 300-trieu-nam-giay-en: Meganeura, the giant dragonfly of the late Carboniferous, one short sentence per shot.
// Figures: a wingspan of about 70 cm (Meganeura), oxygen near 30 % against 21 % today (Berner 2006, GEOCARBSULF). Oxygen as
// the cause of insect gigantism is a leading hypothesis (Harrison, Kaiser & VandenBrooks 2010), not settled.
const LANG = "en";
const TEMPO = 1.1;
const SUBS = false;
const S = (label, mood, ...texts) => ({ label, mood, hot: [], lines: texts.map((t) => [null, t]) });
const SHOTS = [
  S("hook", "tense", "Three hundred million years ago, this dragonfly had wings as long as your arm."),
  S("1", "wonder", "Its name is Meganeura, and its wings spanned about seventy centimeters."),
  S("2", "battle", "It was a hunter, snatching other insects out of the air."),
  S("3", "calm", "Insects have no lungs.", "They breathe through tiny tubes all over their bodies."),
  S("4", "tense", "Back then, the air held about thirty percent oxygen.", "Today, it is twenty-one."),
  S("5", "wonder", "Many scientists think that extra oxygen let insects grow bigger."),
  S("6", "calm", "And there were no birds or bats in the sky to compete with them."),
  S("kết", "bright", "Follow Into Deep Time for more giants from Earth's past!"),
];
