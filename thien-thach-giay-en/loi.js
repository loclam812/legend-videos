// English cut of thien-thach-giay: "Ten minutes after the asteroid that killed the dinosaurs", one short sentence per shot.
// Figures: a body about 10 km wide at an estimated 20 km/s (Chicxulub, 66 million years ago), a crater close to 200 km,
// a brief 4.5 km wall of water 2.5 minutes after impact (Range et al. 2022), seismic waves reaching a site 3000 km away
// within about ten minutes (Tanis, DePalma et al. 2019). The heated sky is one side of a debate (Robertson 2013 vs Morgan 2013).
// Checked against web-search summaries on 2026-11-23, not against the papers themselves.
const LANG = "en";
const TEMPO = 1.1;
const SUBS = false;
const S = (label, mood, hot, ...texts) => ({ label, mood, hot, lines: texts.map((t) => [null, t]) });
const SHOTS = [
  S("hook", "tense", ["ten minutes"], "What was Earth like ten minutes after the asteroid that killed the dinosaurs?"),
  S("1", "wonder", ["ten kilometers"], "Sixty-six million years ago, an asteroid about ten kilometers wide was heading for Earth."),
  S("2", "tense", ["twenty kilometers per second"], "Its estimated speed: about twenty kilometers per second."),
  S("3", "battle", ["Mexico"], "It struck a shallow sea in what is now Mexico."),
  S("4", "battle", ["fireball"], "A giant fireball flared up."),
  S("5", "battle", ["caught fire"], "Forests hundreds of kilometers away caught fire."),
  S("6", "tense", ["two hundred kilometers"], "Within minutes, a crater nearly two hundred kilometers wide had formed."),
  S("7", "battle", ["Molten rock"], "Molten rock was hurled up to the edge of space."),
  S("8", "battle", ["four and a half kilometers"], "For a brief moment, the sea rose into a wall of water four and a half kilometers high."),
  S("9", "battle", ["shook"], "The ground shook harder than any earthquake humans have ever measured."),
  S("10", "tense", ["the whole planet"], "Seismic waves raced through the whole planet."),
  S("11", "tense", ["Three thousand kilometers"], "Three thousand kilometers away, the ground beneath the dinosaurs began to shake."),
  S("12", "battle", ["surged"], "Rivers and lakes surged, and water rushed back up onto the shore."),
  S("13", "tense", ["hot rock"], "High above, billions of grains of hot rock were falling back down."),
  S("14", "battle", ["an oven"], "In many models, a few hours later they heated the sky like an oven."),
  S("15", "sad", ["blocked out the Sun"], "Dust and soot blocked out the Sun for months."),
  S("16", "sad", ["Three quarters"], "Three quarters of all species on Earth disappeared."),
  S("17", "wonder", ["our ancestors"], "But a few small mammals survived, and our ancestors were among them."),
  S("kết", "bright", ["Follow"], "Follow the channel for more stories about Earth!"),
];
