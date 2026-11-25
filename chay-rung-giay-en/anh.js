// The paper layers of the short "When air could burn", copied from 300-trieu-nam-giay-en. See giay/sinh.js for plate, prop and puppet.
// The plates are 1536x864 like the long video's: canh.js draws them enlarged to fill the tall frame.
const W = [1536, 864];
const BAN = "a young modern hiker with short black hair, an orange jacket, grey trousers, boots and a small green backpack";
module.exports = ({ plate, prop, puppet }) => ({
  "pl-rung": plate("Deep inside a misty prehistoric swamp forest, far rows of very tall straight tree trunks with scaly bark fading into pale green fog, layered dark green and teal paper, soft light beams from above.", W),
  "pl-troi": plate("A warm hazy prehistoric sky made of layered torn paper bands from pale teal at the top to soft yellow at the bottom, a few cream paper clouds and a pale sun. No ground, no water, no trees.", W),
  "pl-bao": plate("A dark storm sky made of layered torn paper bands in dark grey, indigo and purple, heavy curled paper storm clouds and slanting paper rain streaks. No ground, no water.", W),
  "pl-lua": plate("A burning sky made of layered torn paper bands in deep red, orange and black, thick curled black paper smoke clouds and glowing sparks. No ground, no water.", W),
  "pc-vay": prop("One very tall prehistoric scale tree, a straight green-brown trunk covered with a diamond pattern like snake scales, a small crown of drooping grass-like branches only at the very top", [512, 1024]),
  "pc-moc-tac": prop("One tall giant horsetail plant, a straight jointed green stem like bamboo with rings of thin needle-like branches at every joint", [512, 1024]),
  "pc-duong-xi": prop("One tree fern, a rough brown trunk with a wide umbrella crown of big green fern fronds", [768, 1024]),
  "pc-bui": prop("A long low row of ferns, moss and small horsetails in layered green paper, reaching from the left edge to the right edge", [1536, 512]),
  "pc-dat": prop("A long low strip of muddy prehistoric ground made of layered dark brown mud paper and green moss paper, reaching from the left edge to the right edge", [1536, 512]),
  "pc-lua": prop("A big flame shape made of layered red, orange and yellow paper tongues of fire, no wood", [768, 1024]),
  "pc-may": prop("One big dark grey storm cloud made of curled paper with a yellow lightning bolt coming out of its underside"),
});
module.exports.style = "Layered paper cut-out illustration, handmade craft paper collage with visible paper grain, bold dark outlines, flat rich colours, soft drop shadows between the paper layers";
