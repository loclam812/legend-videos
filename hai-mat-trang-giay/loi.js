// "What If Earth Had Two Moons?" — the voice-over column of the outline the user pasted on 2026-11-26 (nine scenes,
// 0:00 to 1:30), verbatim: nineteen sentences, one sentence a shot, in the order of its table. The outline gives one
// figure, "millions of years"; its claims (brighter nights, more complicated tides, additional eclipses, moons that pull
// on each other's orbits, a system that might become unstable, Earth's rotation affected over millions of years) are
// the user's and nobody has checked them against a source. Its on-screen question "WOULD YOU LIVE HERE?" is a card in
// canh.js over the last shot, not a line.
// Read by en-US-AndrewNeural through VOICE, at the TEMPO the user chose for an English cut. The captions are burned
// in: the yellow captions are part of the storybook look.
const TEMPO = 1.3; // from content.json: the user's choice for an English cut (2026-11-26)
const VOICE = "en-US-AndrewNeural";
// hot: the words the caption picks out (pale cream). A hot phrase is also glued into one caption, which is how these
// lines keep "not one, but TWO moons!" and "through gravity," from being cut in two (chunks in giay/may.js moves a
// word of three letters or fewer to the next caption, and leaves "and not" alone in one)
const SHOTS = [
  { label: "hook", mood: "wonder", hot: ["not one, but TWO moons!"], lines: [[null, "Imagine looking up tonight and seeing not one, but TWO moons!"]] },
  { label: "1", mood: "wonder", hot: [], lines: [[null, "Beautiful, right?"]] },
  { label: "2", mood: "calm", hot: ["more than"], lines: [[null, "But this could change much more than our night sky."]] },
  { label: "3", mood: "wonder", hot: ["some nights"], lines: [[null, "If both moons reflected enough sunlight, some nights could be brighter."]] },
  { label: "4", mood: "wonder", hot: ["its own"], lines: [[null, "And each moon could have its own changing phases."]] },
  { label: "5", mood: "calm", hot: ["ocean tides", "gravity"], lines: [[null, "Our Moon already helps create ocean tides through gravity."]] },
  { label: "6", mood: "tense", hot: ["more complicated"], lines: [[null, "A second moon would introduce another tidal influence, making the patterns more complicated."]] },
  { label: "7", mood: "tense", hot: ["reinforce each other,", "tidal ranges."], lines: [[null, "Sometimes, their tidal effects could reinforce each other, increasing tidal ranges."]] },
  { label: "8", mood: "calm", hot: ["partly offset"], lines: [[null, "At other times, they could partly offset each other, depending on their positions."]] },
  { label: "9", mood: "wonder", hot: ["eclipses?"], lines: [[null, "What about eclipses?"]] },
  { label: "10", mood: "tense", hot: ["solar and lunar eclipses,", "just right"], lines: [[null, "With another moon, there could be additional opportunities for solar and lunar eclipses, whenever the geometry is just right."]] },
  { label: "11", mood: "tense", hot: ["bigger challenge."], lines: [[null, "But there's a bigger challenge."]] },
  { label: "12", mood: "tense", hot: ["pull on each other", "through gravity,"], lines: [[null, "The two moons would also pull on each other through gravity, gradually changing their orbital paths."]] },
  { label: "13", mood: "tense", hot: ["poorly arranged,", "unstable."], lines: [[null, "If their orbits were poorly arranged, the system might become unstable."]] },
  { label: "14", mood: "calm", hot: ["automatically"], lines: [[null, "But two moons don't automatically mean a collision or disaster."]] },
  { label: "15", mood: "calm", hot: ["millions of years,"], lines: [[null, "Over millions of years, tidal interactions could also affect Earth's rotation."]] },
  { label: "16", mood: "calm", hot: ["masses", "distances."], lines: [[null, "How much would depend on the moons' masses and distances."]] },
  { label: "17", mood: "bright", hot: ["spectacular", "very different Earth."], lines: [[null, "So, two moons might create a spectacular sky and a very different Earth."]] },
  { label: "kết", mood: "bright", hot: [], lines: [[null, "Would you want to live on that planet?"]] },
];
