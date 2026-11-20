// The paper layers of Mai An Tiêm. See giay/sinh.js for plate, prop and puppet.
const TIEM = "a strong young ancient Vietnamese man with a kind confident face, black hair tied in a topknot with a red headband, a sleeveless brown tunic with a red sash and brown knee-length trousers, barefoot";
const VO = "a young ancient Vietnamese woman with long black hair tied back, a cream blouse and a long dark red skirt, barefoot";
const VUA = "an old ancient Vietnamese king with a white beard, a tall golden headdress with bird feathers, a long red robe with golden bronze-drum patterns";

module.exports = ({ plate, prop, puppet }) => ({
  "pl-troi": plate("A bright morning sky made of layered pale blue and cream torn paper bands with curled white paper clouds and a small yellow paper sun in the upper left. No ground, no water."),
  "pl-chieu": plate("A golden dusk sky made of layered torn paper bands from deep orange at the top to pale yellow at the bottom, one big round paper sun low in the middle, a few curled paper clouds. No ground, no water."),
  "pl-bien": plate("A wide sky above the ocean made of layered torn paper bands from pale turquoise at the top to peach at the bottom, with curled white paper clouds. No ground, no water."),
  "pl-cung": plate("The inside of an ancient Vietnamese wooden royal hall, tall dark red paper pillars on both sides, a big round bronze drum pattern with a star in the middle hanging on the back wall, warm lantern light, an empty wooden floor."),

  "pc-song": prop("A wide band of ocean water made of layered teal and dark blue paper strips that fills the lower two thirds of the picture from edge to edge, its top edge is a wavy line of white curled paper wave crests; above the waves: nothing"),
  "pc-dat": prop("A long low strip of village ground made of layered green grass paper and brown earth paper, reaching from the left edge to the right edge"),
  "pc-cat": prop("A long low strip of pale yellow sand beach made of layered paper with a few small shells and pebbles, reaching from the left edge to the right edge"),
  "pc-dao": prop("One small deserted tropical island seen from far away, a mound of pale sand with grey rocks and two coconut palm trees"),
  "pc-nha": prop("One large rich ancient Vietnamese stilt house seen from the front, a big curved boat-shaped thatched roof, dark wooden pillars and a ladder"),
  "pc-leu": prop("One small poor hut seen from the front, a thatched straw paper roof, bamboo walls and a tiny door"),
  "pc-dua": prop("One whole round watermelon with dark green and light green stripes", [512, 512]),
  "pc-dua-bo": prop("One half of a watermelon cut open, seen from the front, bright red flesh with black seeds and a green rind", [512, 512]),
  "pc-day": prop("A patch of green watermelon vines with big leaves lying flat on the ground, three round striped watermelons among the leaves"),
  "pc-chim": prop("One small white and grey sea bird flying, seen exactly from the side, wings spread", [512, 512]),
  "pc-thuyen": prop("One ancient wooden trading boat seen exactly from the side, a single brown square sail, a curved bow"),

  "pg-tiem": puppet(`${TIEM}, standing with both fists on his hips and a calm smile`),
  "pg-tiem-tuoi": puppet(`${TIEM}, bending forward and pouring water from a clay jar onto the ground, seen from the side`),
  "pg-vo-khoc": puppet(`${VO}, standing and crying with both hands covering her face`),
  "pg-con": puppet("a small ancient Vietnamese boy about five years old with a round face and a tiny topknot, a short brown tunic, barefoot, jumping happily with both arms up"),
  "pg-vua": puppet(`${VUA}, standing with a gentle smile and both arms open`),
  "pg-vua-gian": puppet(`${VUA}, standing with an angry frowning face and pointing forward with one arm`),
});
