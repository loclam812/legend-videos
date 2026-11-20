// The paper layers of Thánh Gióng. See giay/sinh.js for plate, prop and puppet.
const VUA = "an old ancient Vietnamese king with a white beard, a tall golden headdress with bird feathers, a long red robe with golden bronze-drum patterns";
const GIONG = "a huge heroic young ancient Vietnamese warrior with a brave face, black hair in a topknot with a red headband, dark grey iron armour over a red tunic";

module.exports = ({ plate, prop, puppet }) => ({
  "pl-troi": plate("A bright morning sky made of layered pale blue and cream torn paper bands with curled white paper clouds and a small yellow paper sun in the upper left. No ground, no water."),
  "pl-chieu": plate("A golden dusk sky made of layered torn paper bands from deep orange at the top to pale yellow at the bottom, one big round paper sun low in the middle, a few curled paper clouds. No ground, no water."),

  "pc-dat": prop("A long low strip of village ground made of layered green grass paper and brown earth paper, reaching from the left edge to the right edge"),
  "pc-leu": prop("One small poor hut seen from the front, a thatched straw paper roof, bamboo walls and a tiny door"),
  "pc-nui": prop("A row of tall rounded limestone karst mountains cut from layered blue-grey and teal paper, side by side across the whole width"),
  "pc-lua": prop("A big flame shape made of layered red, orange and yellow paper tongues of fire, no wood", [768, 1024]),
  "pc-vet-chan": prop("One giant human footprint pressed into brown earth, seen from above, a dark brown paper shape of a bare foot sole with five toes", [512, 768]),
  "pc-tre": prop("One tall clump of green bamboo with several straight jointed stalks and narrow leaves at the top", [512, 1024]),
  "pc-com": prop("One huge heap of white cooked rice in a big round bamboo tray, with small baskets of rice around it"),
  "pc-ngua": prop("One big dark grey iron horse with rivets and metal plates, seen exactly from the side, rearing up and breathing a jet of red and orange fire from its mouth"),

  "pg-ong": puppet("an old ancient Vietnamese farmer with a white beard and a kind face, a brown tunic and trousers, barefoot, standing and leaning on a wooden stick"),
  "pg-ba": puppet("an old ancient Vietnamese farmer woman with grey hair in a bun and a kind face, a brown blouse and a long dark skirt, barefoot, standing with her hands together"),
  "pg-be": puppet("a chubby three-year-old ancient Vietnamese boy with a round face, a tiny topknot and a red bib apron, sitting on the ground silent with a blank face", [768, 768]),
  "pg-su": puppet("a messenger with a short black beard in a plain dark green robe, kneeling on one knee and holding up a rolled letter with both hands, seen from the side"),
  "pg-vua": puppet(`${VUA}, standing with a gentle smile and both arms open`),
  "pg-giac": puppet("an ancient enemy soldier with a fierce face, a pointed bronze helmet, dark purple and black armour, holding a spear and a shield, seen from the side, marching"),
  "pg-giac-chay": puppet("an ancient enemy soldier with a terrified face, a pointed bronze helmet, dark purple and black armour, running away with both arms thrown up, having dropped his spear, seen from the side"),
  "pg-giong": puppet(`${GIONG}, standing tall and stretching both arms wide, holding a long iron rod in one hand`),
  "pg-giong-ngua": puppet(`${GIONG}, riding a big dark grey iron horse that gallops and breathes fire, seen exactly from the side, swinging a long iron rod above his head`, [1024, 768]),
});
