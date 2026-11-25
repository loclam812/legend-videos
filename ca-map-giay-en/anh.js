// The paper layers of the short "Sharks in the rivers", copied from 300-trieu-nam-giay-en. See giay/sinh.js for plate, prop and puppet.
// The plates are 1536x864 like the long video's: canh.js draws them enlarged to fill the tall frame.
const W = [1536, 864];
const BAN = "a young modern hiker with short black hair, an orange jacket, grey trousers, boots and a small green backpack";
module.exports = ({ plate, prop, puppet }) => ({
  "pl-rung": plate("Deep inside a misty prehistoric swamp forest, far rows of very tall straight tree trunks with scaly bark fading into pale green fog, layered dark green and teal paper, soft light beams from above.", W),
  "pl-nuoc": plate("Underwater in a murky river, layered torn paper bands from light green at the top to dark teal at the bottom, pale light rays from the surface, a few bubbles and water plants at the bottom edge.", W),
  "pc-vay": prop("One very tall prehistoric scale tree, a straight green-brown trunk covered with a diamond pattern like snake scales, a small crown of drooping grass-like branches only at the very top", [512, 1024]),
  "pc-moc-tac": prop("One tall giant horsetail plant, a straight jointed green stem like bamboo with rings of thin needle-like branches at every joint", [512, 1024]),
  "pc-duong-xi": prop("One tree fern, a rough brown trunk with a wide umbrella crown of big green fern fronds", [768, 1024]),
  "pc-bui": prop("A long low row of ferns, moss and small horsetails in layered green paper, reaching from the left edge to the right edge", [1536, 512]),
  "pc-dam": prop("A wide band of black-green swamp water made of layered dark green and black paper strips that fills the lower two thirds of the picture from edge to edge, with floating leaves and a rippled top edge; above the water: nothing", [1536, 768]),
  "pc-dat": prop("A long low strip of muddy prehistoric ground made of layered dark brown mud paper and green moss paper, reaching from the left edge to the right edge", [1536, 512]),
  "pc-hue-bien": prop("A group of sea lilies on the sea floor, animals that look like flowers: long thin stalks with feathery pink and orange crowns on top", [768, 1024]),
  "pg-ban": puppet(`${BAN}, standing and looking up with an amazed open mouth`),
  "pg-ban-so": puppet(`${BAN}, leaning back in fright with both hands raised and wide eyes`),
  "pg-luong-cu": puppet("a giant prehistoric amphibian shaped like a huge fat newt, lying low and flat on its belly on all four short legs like a crocodile, a very wide flat rounded head with small eyes on top, a long thick tail, smooth slimy olive green skin with dark spots, seen exactly from the side, not standing upright", [1024, 512]),
  "pg-ca-map": puppet("a strange prehistoric fish with a very long thin body like an eel, grey-green paper skin, one low ribbon fin running along its whole back, a pointed tail, a blunt head with an open mouth of small teeth, and one long straight spike sticking out backwards from the top of its head, swimming, seen exactly from the side", [1024, 512]),
  "pg-ca-map-bien": puppet("a strange prehistoric shark with a flat anvil-shaped fin on its back like an ironing board, grey-blue paper skin, swimming, seen exactly from the side", [1024, 768]),
});
module.exports.style = "Layered paper cut-out illustration, handmade craft paper collage with visible paper grain, bold dark outlines, flat rich colours, soft drop shadows between the paper layers";
