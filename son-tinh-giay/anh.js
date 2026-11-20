// The paper layers of Sơn Tinh Thủy Tinh. See giay/sinh.js for plate, prop and puppet.
const VUA = "an old ancient Vietnamese king with a white beard, a tall golden headdress with bird feathers, a long red robe with golden bronze-drum patterns";
const SON = "a tall strong young mountain god with a friendly brave face, long black hair with a green leaf crown, a green and brown robe with mountain patterns and a tiger skin over one shoulder";
const THUY = "a tall proud young water god with a sharp face, long dark blue hair with a silver fish-fin crown, a dark blue and teal robe with wave patterns";

module.exports = ({ plate, prop, puppet }) => ({
  "pl-troi": plate("A bright morning sky made of layered pale blue and cream torn paper bands with curled white paper clouds and a small yellow paper sun in the upper left. No ground, no water."),
  "pl-chieu": plate("A golden dusk sky made of layered torn paper bands from deep orange at the top to pale yellow at the bottom, one big round paper sun low in the middle, a few curled paper clouds. No ground, no water."),
  "pl-cung": plate("The inside of an ancient Vietnamese wooden royal hall, tall dark red paper pillars on both sides, a big round bronze drum pattern with a star in the middle hanging on the back wall, warm lantern light, an empty wooden floor."),
  "pl-bao": plate("A dark storm sky made of layered torn paper bands in dark grey, indigo and purple, heavy curled paper storm clouds, slanting paper rain streaks and two yellow paper lightning bolts, the paper sky fills the whole picture up to every edge with no border. No ground, no water."),

  "pc-song": prop("A wide band of ocean water made of layered teal and dark blue paper strips that fills the lower two thirds of the picture from edge to edge, its top edge is a wavy line of white curled paper wave crests; above the waves: nothing"),
  "pc-dat": prop("A long low strip of village ground made of layered green grass paper and brown earth paper, reaching from the left edge to the right edge"),
  "pc-nui": prop("A row of tall rounded limestone karst mountains cut from layered blue-grey and teal paper, side by side across the whole width"),
  "pc-nui-cao": prop("One single tall green mountain with a pointed top, made of layered green and dark green paper with small paper trees on its slopes", [768, 1024]),
  "pc-leu": prop("One small poor hut seen from the front, a thatched straw paper roof, bamboo walls and a tiny door"),
  "pc-voi": prop("One big grey elephant with many long white tusks, seen exactly from the side, decorated with a red cloth on its back"),
  "pc-ga": prop("One proud rooster with a red comb, golden and red feathers and long spurs on its legs, seen exactly from the side", [512, 512]),
  "pc-ngua": prop("One white horse with a long flowing bright pink-red mane and tail, seen exactly from the side, standing"),
  "pc-may": prop("One big dark grey storm cloud made of curled paper with a yellow lightning bolt coming out of its underside"),

  "pg-vua": puppet(`${VUA}, standing with a gentle smile and both arms open`),
  "pg-mi-nuong": puppet("a beautiful young ancient Vietnamese princess with a gentle face, long black hair with a golden hairpin and flowers, a long pink and cream dress with a golden sash, standing with her hands folded"),
  "pg-son": puppet(`${SON}, standing proudly and raising one hand high in the air`),
  "pg-son-danh": puppet(`${SON}, in a strong fighting stance pushing both palms forward with a determined face`),
  "pg-thuy": puppet(`${THUY}, standing proudly with his arms crossed`),
  "pg-thuy-gian": puppet(`${THUY}, furious with an open shouting mouth and both arms raised high above his head`),
});
