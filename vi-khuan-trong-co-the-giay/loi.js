// The shot list of "How Many Microbes Live Inside Your Body?" (Có bao nhiêu vi sinh vật đang sống trong cơ thể bạn?):
// one short sentence per shot, vertical short in the paper-cut storybook look, captions burned in. Every line is the
// user's script, word for word: the English voice-over of the longer outline pasted on 2026-11-25, which replaces the
// shorter one of 2026-11-24 (xuat/content.json keeps its picture column as sourceNotes). Its nine scenes: the face and
// the way into the body (hook to 2), the number and its comparison with the human cells (3, 4), skin, mouth and the
// digestive tract (5, 6), viruses, fungi and other microbes (7, 8), fiber turned into healthy compounds (9), the immune
// system and the barrier of the gut (10), disease and antibiotics (11, 12), fiber-rich foods (13, 14), and the whole
// body as an ecosystem (15 to kết). The outline's table also puts "What surprised you most?" at the end of its scene 09,
// while its list of the complete voice-over ends at "ecosystem!": the question is written on screen in the silent last
// shot (a pause line, as a title card is) and is not read.
// The figures are the outline's and nobody has checked them against the sources: about 38 trillion bacterial cells in a
// typical adult, the same order of magnitude as its 30 trillion human cells. That agrees with the revised estimate of
// Sender, Fuchs and Milo (PLoS Biology, 2016: 3.8 x 10^13 bacteria against 3.0 x 10^13 human cells), as remembered here.
const TEMPO = 1.3; // from content.json: the user's choice for an English cut
// the narrator: doc.js reads the story with this edge-tts voice, whatever the voice family of content.json says
const VOICE = "en-US-AndrewNeural";
// hot phrases are chosen for how the caption chunker of giay/may.js (tuned for Vietnamese) breaks an English line: a hot
// phrase stays in one caption and its words are picked out in pale cream. Where gluing the phrase that matters would
// leave a caption of half a second, the single key word is hot instead ("immune", not "immune system")
const SHOTS = [
  { label: "hook", mood: "wonder", hot: ["belongs only to you?"], lines: [[null, "You think your body belongs only to you?"]] },
  { label: "1", mood: "wonder", hot: ["again!"], lines: [[null, "Think again!"]] },
  { label: "2", mood: "wonder", hot: ["trillions", "tiny organisms", "living inside you!"], lines: [[null, "Right now, trillions of tiny organisms are living inside you!"]] },
  { label: "3", mood: "calm", hot: ["38 trillion", "typical adult"], lines: [[null, "Scientists estimate around 38 trillion bacterial cells in a typical adult."]] },
  { label: "4", mood: "calm", hot: ["order of magnitude", "human cells!"], lines: [[null, "That's roughly the same order of magnitude as the number of human cells!"]] },
  { label: "5", mood: "calm", hot: ["skin,", "mouth,", "digestive tract."], lines: [[null, "Microbes live on your skin, in your mouth, and throughout your digestive tract."]] },
  { label: "6", mood: "wonder", hot: ["most of your bacteria", "large intestine."], lines: [[null, "But most of your bacteria are found in your large intestine."]] },
  { label: "7", mood: "wonder", hot: ["aren't alone."], lines: [[null, "And bacteria aren't alone."]] },
  { label: "8", mood: "wonder", hot: ["viruses,", "fungi,", "microscopic life forms."], lines: [[null, "Your microbiome also includes viruses, fungi, and other microscopic life forms."]] },
  { label: "9", mood: "bright", hot: ["fiber", "on its own,", "compounds", "gut healthy."], lines: [[null, "Some gut bacteria break down fiber that your body cannot digest on its own, producing compounds that help keep your gut healthy."]] },
  { label: "10", mood: "calm", hot: ["immune", "protective barrier"], lines: [[null, "Your gut microbes also interact with your immune system and help maintain the protective barrier lining your intestines."]] },
  { label: "11", mood: "tense", hot: ["cause disease."], lines: [[null, "However, some microbes can cause disease."]] },
  { label: "12", mood: "tense", hot: ["antibiotics,", "disrupt"], lines: [[null, "And antibiotics, while sometimes essential, can disrupt helpful gut bacteria too."]] },
  { label: "13", mood: "bright", hot: ["fiber-rich foods", "beneficial"], lines: [[null, "Eating a variety of fiber-rich foods can help nourish many beneficial gut microbes."]] },
  { label: "14", mood: "bright", hot: ["diet matters!"], lines: [[null, "Your daily diet matters!"]] },
  { label: "15", mood: "calm", hot: ["one organism."], lines: [[null, "So, you're not just one organism."]] },
  { label: "16", mood: "bright", hot: ["entire microscopic ecosystem!"], lines: [[null, "You're home to an entire microscopic ecosystem!"]] },
  // the question of the outline's last scene, on screen only: a pause of three seconds
  { label: "kết", mood: "bright", hot: [], lines: [[null, "", 3000]] },
];
