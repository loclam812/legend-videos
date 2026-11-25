// Short cut from 300-trieu-nam-giay-en: how the Carboniferous swamp forests became coal, one short sentence per shot.
// Figures: scale trees (Lepidodendron) 30 to 40 m tall; many coal seams of Europe and North America formed in this period,
// whose name means coal-bearing. Checked against web-search summaries on 2026-11-23, not the papers.
const LANG = "en";
const TEMPO = 1.1;
const SUBS = false;
const S = (label, mood, ...texts) => ({ label, mood, hot: [], lines: texts.map((t) => [null, t]) });
const SHOTS = [
  S("hook", "wonder", "The coal that powered the Industrial Revolution grew in forests like this."),
  S("1", "wonder", "Three hundred million years ago, swamps were filled with scale trees thirty to forty meters tall."),
  S("2", "calm", "They were giant relatives of today's tiny clubmosses, with bark like snake scales."),
  S("3", "tense", "When they fell, they sank into swamp mud that had little oxygen."),
  S("4", "calm", "So they did not fully rot.", "They piled up, layer upon layer."),
  S("5", "tense", "Buried and pressed for millions of years, they slowly turned into coal."),
  S("6", "bright", "That is why this age is called the Carboniferous: the coal-bearing age."),
  S("kết", "bright", "Follow Into Deep Time for more stories from Earth's past!"),
];
