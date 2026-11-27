// Real monsters 3: Dunkleosteus. Hook format of the Megalodon Shorts: the fish and the claim are on screen at frame 0.
// Figures, from web-search summaries, not the papers:
// - Late Devonian, about 360 to 380 Ma; bony head and trunk shields, no true teeth, self-sharpening gnathal plates
//   (Anderson & Westneat 2007, Biology Letters).
// - Engelman 2023 (Diversity): typical adults about 3.4 m, the largest about 4.1 m, shorter and stockier than the old 6 to 10 m.
//   No bite-force figure: the one that circulates was not traced to a paper we read.
const LANG = "en";
const TEMPO = 1.1;
const MUSIC = "water";
const SUBS = false;
const S = (label, mood, ...texts) => ({ label, mood, hot: [], lines: texts.map((t) => [null, t]) });
const SHOTS = [
  S("hook", "tense", "This fish had no teeth, just blades of bone."),
  S("1", "wonder", "Dunkleosteus hunted the seas three hundred sixty million years ago."),
  S("2", "tense", "Its head and chest were covered in bony armour."),
  S("3", "battle", "Its jaw blades sharpened themselves as they rubbed together."),
  S("4", "wonder", "New studies say it was about four meters long: shorter, but chunkier than we thought."),
  S("kết", "calm", "Follow Into Deep Time for more monsters of the deep past."),
];
