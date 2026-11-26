// Megalodon short 3: why it vanished. New hook format: a small great white faces the megalodon at second 0.
// Figures, checked against web-search summaries, not the papers:
// - warm body: Griffiths et al. 2023 (PNAS) estimate about 7 degrees C above the surrounding water.
// - extinction about 3.5 million years ago and competition with great whites as a hypothesis: Boessenecker et al. 2019 (PeerJ).
const LANG = "en";
const TEMPO = 1.1;
const MUSIC = "stone";
const SUBS = false;
const S = (label, mood, ...texts) => ({ label, mood, hot: [], lines: texts.map((t) => [null, t]) });
const SHOTS = [
  S("hook", "tense", "The great white may have helped kill the megalodon."),
  S("1", "wonder", "Megalodon ran warm, about seven degrees above the sea."),
  S("2", "tense", "Staying warm meant eating huge amounts of food."),
  S("3", "battle", "Then smaller, faster great whites chased the same prey."),
  S("4", "sad", "About three and a half million years ago, megalodon was gone."),
  S("kết", "calm", "It's still a hypothesis. Follow Into Deep Time for more."),
];
