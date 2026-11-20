// The paper layers of the asteroid short. See giay/sinh.js for plate, prop and puppet.
const REX = "a Tyrannosaurus rex with dark green and brown paper skin and small arms, seen exactly from the side";

module.exports = ({ plate, prop, puppet }) => ({
  "pl-ky": plate("A warm bright prehistoric sky made of layered torn paper bands from pale blue at the top to soft yellow at the bottom, a few puffy cream paper clouds and a small sun in the upper left. No ground, no water."),
  "pl-do": plate("A burning apocalyptic sky made of layered torn paper bands in deep red, orange and black, thick curled black paper smoke clouds and glowing streaks. No ground, no water."),
  "pl-toi": plate("A dark gloomy sky made of layered torn paper bands in dark grey and brown, thick ash clouds, one dim pale red sun barely visible behind the dust. No ground, no water."),

  "pc-song": prop("A wide band of ocean water made of layered teal and dark blue paper strips that fills the lower two thirds of the picture from edge to edge, its top edge is a wavy line of white curled paper wave crests; above the waves: nothing"),
  "pc-lua": prop("A big flame shape made of layered red, orange and yellow paper tongues of fire, no wood", [768, 1024]),
  "pc-thien-thach": prop("One huge rough grey rocky asteroid with craters, glowing red and orange at its front edge, with a long tail of fire and smoke behind it, flying diagonally from the upper right down to the lower left"),
  "pc-rung": prop("A long row of prehistoric jungle plants seen from the side: giant ferns, cycads and tall conifer trees in layered dark and light green paper, reaching from the left edge to the right edge"),
  "pc-dat": prop("A long low strip of prehistoric ground made of layered brown earth paper and green fern paper, reaching from the left edge to the right edge"),
  "pc-cau-lua": prop("A gigantic explosion fireball shaped like a dome, made of layered white, yellow, orange and red paper with curled paper smoke around its edge, wider than tall"),
  "pc-ho": prop("One enormous impact crater seen from above at an angle, a round bowl with a raised cracked rim, glowing orange molten rock inside, dark scorched ground around it"),
  "pc-song-than": prop("One gigantic tsunami wave like a towering wall of water curling over at the top, made of layered dark blue and teal paper with white curled paper foam, seen from the side", [768, 1024]),

  "pg-rex": puppet(`${REX}, standing calmly with its mouth closed`, [1024, 768]),
  "pg-rex-so": puppet(`${REX}, rearing back in fear with its mouth wide open, roaring`, [1024, 768]),
  "pg-tri": puppet("a Triceratops with orange and brown paper skin, three horns and a big neck frill, seen exactly from the side, walking", [1024, 768]),
  "pg-ptero": puppet("a giant pterosaur with a long beak and wide leathery tan paper wings spread out, flying, seen exactly from the side", [1024, 768]),
  "pg-thu": puppet("a tiny furry brown prehistoric mammal like a shrew with a long nose, big dark eyes and a thin tail, sitting up on its hind legs and looking up, seen from the side", [768, 768]),
});
module.exports.style = "Layered paper cut-out illustration, handmade craft paper collage with visible paper grain, bold dark outlines, flat rich colours, soft drop shadows between the paper layers";
