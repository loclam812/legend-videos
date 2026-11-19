// The paper layers of "Ăn khế trả vàng". See giay/sinh.js for plate, prop and puppet.
const EM = "a poor young Vietnamese farmer with a kind face, black hair in a small topknot, a patched brown short-sleeved tunic and brown trousers, barefoot";
const ANH = "a fat rich Vietnamese man with a thin moustache, a black turban and a shiny green silk robe with golden patterns";
const CHIM = "a huge magical bird like a phoenix with red, orange and golden paper feathers and a long tail";

module.exports = ({ plate, prop, puppet }) => ({
  "pl-troi": plate("A bright morning sky made of layered pale blue and cream torn paper bands with curled white paper clouds and a small yellow paper sun in the upper left. No ground, no water."),
  "pl-chieu": plate("A golden dusk sky made of layered torn paper bands from deep orange at the top to pale yellow at the bottom, one big round paper sun low in the middle, a few curled paper clouds. No ground, no water."),
  "pl-bien": plate("A wide sky above the ocean made of layered torn paper bands from pale turquoise at the top to peach at the bottom, with curled white paper clouds. No ground, no water."),

  "pc-nha": prop("One large rich old Vietnamese house seen from the front, a red tiled paper roof with curved corners, dark wooden pillars and a carved door"),
  "pc-leu": prop("One small poor hut seen from the front, a thatched straw paper roof, bamboo walls and a tiny door"),
  "pc-khe": prop("One starfruit tree with a brown paper trunk and a big round green paper crown full of yellow star-shaped starfruits", [768, 1024]),
  "pc-qua": prop("One single yellow starfruit with five ridges, seen from the side, big in the centre", [512, 512]),
  "pc-dat": prop("A long low strip of village ground made of layered green grass paper and brown earth paper, reaching from the left edge to the right edge"),
  "pc-song": prop("A wide band of ocean water made of layered teal and dark blue paper strips that fills the lower two thirds of the picture from edge to edge, its top edge is a wavy line of white curled paper wave crests; above the waves: nothing"),
  "pc-dao": prop("One small rocky island of grey paper rocks with a huge heap of shining yellow gold nuggets and gold bars on top of it"),
  "pc-vang": prop("One heap of shining yellow gold nuggets and gold coins", [768, 768]),
  "pc-tui": prop("One small brown cloth bag tied with a string at the top", [512, 512]),
  "pc-tui-to": prop("One huge bulging brown cloth sack tied with a rope at the top, stuffed so full that gold nuggets stick out", [768, 768]),

  "pg-em": puppet(`${EM}, standing with a gentle smile, one hand raised in greeting`),
  "pg-em-buon": puppet(`${EM}, standing sad with his head bowed and both hands open in front of him`),
  "pg-vo": puppet("a young Vietnamese farmer's wife with a kind face, her hair wrapped in a brown headscarf, a patched brown blouse and a long dark skirt, barefoot, standing and holding a watering can"),
  "pg-anh": puppet(`${ANH}, standing with a greedy grin and rubbing his hands`),
  "pg-anh-so": puppet(`${ANH}, terrified with his mouth open and both arms thrown up in the air`),
  "pg-chim": puppet(`${CHIM}, flying, seen exactly from the side, both wings spread wide`, [1024, 768]),
  "pg-chim-dau": puppet(`${CHIM}, standing upright with folded wings, seen exactly from the side, its beak open as if speaking`),
});
