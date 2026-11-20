// The paper layers of "If you woke up 300 million years ago". See giay/sinh.js for plate, prop and puppet.
// The story is wide, so every plate is 1536x864.
const W = [1536, 864];
const BAN = "a young modern hiker with short black hair, an orange jacket, grey trousers, boots and a small green backpack";

module.exports = ({ plate, prop, puppet }) => ({
  "pl-rung": plate("Deep inside a misty prehistoric swamp forest, far rows of very tall straight tree trunks with scaly bark fading into pale green fog, layered dark green and teal paper, soft light beams from above.", W),
  "pl-troi": plate("A warm hazy prehistoric sky made of layered torn paper bands from pale teal at the top to soft yellow at the bottom, a few cream paper clouds and a pale sun. No ground, no water, no trees.", W),
  "pl-dem": plate("A night sky above a forest made of layered dark blue and indigo torn paper, many small paper stars and a big pale moon, black tree-top silhouettes along the bottom edge.", W),
  "pl-bao": plate("A dark storm sky made of layered torn paper bands in dark grey, indigo and purple, heavy curled paper storm clouds and slanting paper rain streaks. No ground, no water.", W),
  "pl-lua": plate("A burning sky made of layered torn paper bands in deep red, orange and black, thick curled black paper smoke clouds and glowing sparks. No ground, no water.", W),
  "pl-nuoc": plate("Underwater in a murky river, layered torn paper bands from light green at the top to dark teal at the bottom, pale light rays from the surface, a few bubbles and water plants at the bottom edge.", W),

  "pc-vay": prop("One very tall prehistoric scale tree, a straight green-brown trunk covered with a diamond pattern like snake scales, a small crown of drooping grass-like branches only at the very top", [512, 1024]),
  "pc-moc-tac": prop("One tall giant horsetail plant, a straight jointed green stem like bamboo with rings of thin needle-like branches at every joint", [512, 1024]),
  "pc-duong-xi": prop("One tree fern, a rough brown trunk with a wide umbrella crown of big green fern fronds", [768, 1024]),
  "pc-bui": prop("A long low row of ferns, moss and small horsetails in layered green paper, reaching from the left edge to the right edge", [1536, 512]),
  "pc-dam": prop("A wide band of black-green swamp water made of layered dark green and black paper strips that fills the lower two thirds of the picture from edge to edge, with floating leaves and a rippled top edge; above the water: nothing", [1536, 768]),
  "pc-dat": prop("A long low strip of muddy prehistoric ground made of layered dark brown mud paper and green moss paper, reaching from the left edge to the right edge", [1536, 512]),
  "pc-than": prop("A cut-away block of earth seen from the side showing flat layers: green plants on top, brown mud below, then a thick shiny black coal layer with fossil leaf prints", [1024, 768]),
  "pc-lua": prop("A big flame shape made of layered red, orange and yellow paper tongues of fire, no wood", [768, 1024]),
  "pc-may": prop("One big dark grey storm cloud made of curled paper with a yellow lightning bolt coming out of its underside"),
  "pc-trung": prop("A small nest of leaves on the ground with three white oval eggs with hard shells, one egg cracked open with a tiny lizard head peeking out", [768, 768]),
  "pc-leu": prop("A simple lean-to shelter made of wooden poles with a roof of huge green fern leaves, open at the front", [1024, 768]),
  "pc-bep": prop("A small campfire with a ring of stones, burning sticks and a bright flame, a clay pot of water hanging above it", [768, 768]),
  "pc-hue-bien": prop("A group of sea lilies on the sea floor, animals that look like flowers: long thin stalks with feathery pink and orange crowns on top", [768, 1024]),
  "pc-suoi": prop("A small clear blue stream flowing between grey rocks and moss, seen from the side, a tiny waterfall", [1024, 768]),

  "pg-ban": puppet(`${BAN}, standing and looking up with an amazed open mouth`),
  "pg-ban-so": puppet(`${BAN}, leaning back in fright with both hands raised and wide eyes`),
  "pg-ban-ngoi": puppet(`${BAN}, sitting on the ground with knees up, tired, wiping sweat from the forehead`, [768, 768]),
  "pg-mega": puppet("a giant prehistoric dragonfly with a long striped brown and green body and four wide transparent pale blue wings with dark veins, flying, seen from the side and slightly above", [1024, 768]),
  "pg-arthro": puppet("a giant prehistoric millipede with a long flat body of many dark brown and orange armour segments and many small legs, crawling, seen exactly from the side", [1024, 512]),
  "pg-gian": puppet("a prehistoric cockroach with a flat oval brown body, long antennae and folded veined wings, seen from above", [512, 512]),
  "pg-luong-cu": puppet("a giant prehistoric amphibian shaped like a huge fat newt, lying low and flat on its belly on all four short legs like a crocodile, a very wide flat rounded head with small eyes on top, a long thick tail, smooth slimy olive green skin with dark spots, seen exactly from the side, not standing upright", [1024, 512]),
  "pg-ca-map": puppet("a strange prehistoric fish with a very long thin body like an eel, grey-green paper skin, one low ribbon fin running along its whole back, a pointed tail, a blunt head with an open mouth of small teeth, and one long straight spike sticking out backwards from the top of its head, swimming, seen exactly from the side", [1024, 512]),
  "pg-ca-map-bien": puppet("a strange prehistoric shark with a flat anvil-shaped fin on its back like an ironing board, grey-blue paper skin, swimming, seen exactly from the side", [1024, 768]),
  // "not a dinosaur" matters: left alone, the model paints both of these walking on two legs
  "pg-bo-sat": puppet("a small ordinary lizard with a slender brown body, four short legs spread out to the sides, belly close to the ground and a long thin tail, crawling on all fours, seen exactly from the side, not a dinosaur, not standing on two legs", [1024, 512]),
  "pg-san-moi": puppet("a big heavy four-legged prehistoric reptile shaped like a giant monitor lizard or Komodo dragon, crawling on all four sprawling legs with its belly low to the ground, a long narrow snout with small teeth, a long thick tail, dark red-brown paper skin, seen exactly from the side, not a dinosaur, not standing on two legs", [1024, 512]),
  "pg-rex": puppet("a Tyrannosaurus rex with dark green and brown paper skin and small arms, seen exactly from the side, standing calmly with its mouth closed", [1024, 768]),
});
module.exports.style = "Layered paper cut-out illustration, handmade craft paper collage with visible paper grain, bold dark outlines, flat rich colours, soft drop shadows between the paper layers";
