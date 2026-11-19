// The paper layers of the paper-cut cut of Bạch Đằng 938. See giay/sinh.js for plate, prop and puppet.
const NGO_P = "a Vietnamese general of the tenth century with black hair in a topknot, a red headband, a short black beard, bronze-yellow scale armour over a dark red tunic and brown boots";
const CUNG_P = "an old king with a long white beard, a black flat-topped crown with hanging strings of beads, a dark blue robe with golden trim";
const THAO_P = "a young prince with a thin black moustache, a golden helmet with a white plume, golden scale armour over a blue tunic";
const LINH_P = "green cloth turbans, brown tunics with green sashes";
const file = (name) => path.join(OUT, `${name}.${IMAGES[name].prompt.includes(KEY) ? "png" : "jpg"}`);

module.exports = ({ plate, prop, puppet }) => ({
  "pc-sky": { prompt: "A dusk sky made of layered torn paper bands from deep orange at the top to pale yellow at the bottom, one big round paper sun low in the middle, a few curled paper clouds. No mountains, no water, no people, no text." },
  "pc-nui": prop(`A row of tall rounded limestone karst mountains cut from layered blue-grey and teal paper, side by side across the whole width`),
  "pc-coc": prop(`One straight row of seven tall sharpened wooden stakes cut from brown paper, each with a dark grey iron-coloured paper point at the top, standing upright side by side with gaps between them`),
  "pc-song": prop(`A wide band of ocean water made of layered teal and dark blue paper strips that fills the lower two thirds of the picture from edge to edge, its top edge is a wavy line of white curled paper wave crests; above the waves: nothing`),

  "pl-dem": plate(`A night sky made of layered dark blue torn paper bands, one big pale yellow paper full moon in the middle, small paper stars, a few curled paper clouds. No mountains, no water.`),
  "pl-ngay": plate(`A bright morning sky made of layered pale blue and cream torn paper bands with curled white paper clouds and a small yellow paper sun in the upper left. No mountains, no water.`),
  "pl-xam": plate(`A cloudy sky made of layered grey and pale blue torn paper bands with curled grey paper clouds. No mountains, no water.`),
  "pl-phu": plate(`Inside an old Vietnamese wooden palace hall made of layered paper: dark red paper pillars on both sides, a brown paper wall with a round bronze drum sun pattern in the middle, a wooden paper floor in the lower third.`),
  "pl-han": plate(`Inside a royal throne hall made of layered paper: dark blue paper walls with golden patterns, hanging yellow paper lanterns, dark blue pillars on both sides, a red paper carpet floor in the lower third. No throne.`),
  "pl-rung": plate(`A green forest made of layered paper: tall brown paper tree trunks with round green paper crowns on both sides, pale rays of light, a grass paper ground in the lower third.`),
  "pl-coloa": plate(`An ancient Vietnamese citadel made of layered paper: an earthen rampart with a wooden palisade across the middle, a wooden hall with a curved roof behind it, a bright sunrise sky with curled clouds, sandy paper ground in the lower third.`),

  "pc-thuyen2": prop("One old Chinese war junk seen exactly from the side, three tall rectangular red paper sails, each sail crossed by many horizontal bamboo battens like a folding fan, a brown paper hull with a high stern and round shields along its side, the whole ship visible"),
  "pc-ghe": prop(`One small wooden rowing boat seen exactly from the side with two Vietnamese soldiers in ${LINH_P} sitting in it and rowing with oars, the whole boat visible`),
  "pc-lua": prop("A big flame shape made of layered red, orange and yellow paper tongues of fire, no wood", [768, 1024]),
  "pc-bo": prop("A long low strip of riverbank made of layered sand-coloured and green paper with a few grass tufts on top, reaching from the left edge to the right edge"),
  "pc-coc1": prop("One single tall sharpened wooden stake cut from brown paper with a dark grey iron point at the top, standing upright in the centre", [512, 1024]),

  "pg-ngo": puppet(`${NGO_P}, standing, determined face, one arm stretched out pointing to the side`),
  "pg-ngo-kiem": puppet(`${NGO_P}, standing with legs apart and raising a straight sword high above his head, shouting`),
  "pg-ngo-vua": puppet("a Vietnamese king of the tenth century with black hair in a topknot, a short black beard, a simple golden headband and a long orange royal robe with golden trim, smiling with both arms raised"),
  "pg-duong": puppet("an old Vietnamese lord with white hair in a topknot, a long white beard and a brown robe, standing calmly and reading a scroll"),
  "pg-kieu": puppet("a scowling Vietnamese officer in a dark green robe with a black headband, creeping forward with a sword raised in one hand"),
  "pg-cung": puppet(`${CUNG_P}, sitting on a golden throne with a stern face, one arm pointing forward`),
  "pg-cung-khoc": puppet(`${CUNG_P}, standing with his head bowed and crying, one wide sleeve raised to his eyes`),
  "pg-thao": puppet(`${THAO_P}, standing proudly with one fist on his chest`),
  "pg-thao-so": puppet(`${THAO_P}, terrified with his mouth open and both arms thrown up in the air`),
  "pg-su": puppet("a messenger with a short black beard in a plain dark green robe, kneeling on one knee and holding up a rolled letter with both hands, seen from the side"),
  "pg-linh": puppet(`three Vietnamese foot soldiers with ${LINH_P} marching in a row, seen from the side, each carrying a tall spear`),
  "pg-riu": puppet(`one Vietnamese soldier with ${LINH_P}, swinging an axe with both hands, seen from the side`),
  "pg-dan": puppet(`a happy crowd of Vietnamese villagers and soldiers with ${LINH_P}, standing in two rows and cheering with raised arms`),
  "pg-han": puppet("a group of four frightened Southern Han soldiers with round grey helmets with red plumes and blue tunics, waving their arms"),
});
