// Short cut from 300-trieu-nam-giay-en: Arthropleura, the largest known arthropod, one short sentence per shot.
// Figures from Davies et al. 2021 (Journal of the Geological Society): up to about 2.6 m long and about 50 kg, a genus that
// lasted about 45 million years and died out in the Permian. Its diet is inferred, not known.
const LANG = "en";
const TEMPO = 1.1;
const SUBS = false;
const S = (label, mood, ...texts) => ({ label, mood, hot: [], lines: texts.map((t) => [null, t]) });
const SHOTS = [
  S("hook", "tense", "Meet the largest arthropod ever found: a millipede longer than you are tall."),
  S("1", "wonder", "Its name is Arthropleura, and it crawled through forests about three hundred million years ago."),
  S("2", "tense", "The biggest fossil suggests it reached about two point six meters."),
  S("3", "tense", "It may have weighed around fifty kilograms."),
  S("4", "calm", "Its body was a long chain of armored plates, carried on many pairs of legs."),
  S("5", "bright", "Luckily for you, it most likely ate plants."),
  S("6", "sad", "It lived for about forty-five million years, then vanished in the Permian."),
  S("kết", "bright", "Follow Into Deep Time for more giants from Earth's past!"),
];
