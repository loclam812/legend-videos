// The paper layers of the short "The 2.6 m millipede", copied from 300-trieu-nam-giay-en. See giay/sinh.js for plate, prop and puppet.
// The plates are 1536x864 like the long video's: canh.js draws them enlarged to fill the tall frame.
const W = [1536, 864];
const BAN = "a young modern hiker with short black hair, an orange jacket, grey trousers, boots and a small green backpack";
module.exports = ({ plate, prop, puppet }) => ({
  "pl-rung": plate("Deep inside a misty prehistoric swamp forest, far rows of very tall straight tree trunks with scaly bark fading into pale green fog, layered dark green and teal paper, soft light beams from above.", W),
  "pc-vay": prop("One very tall prehistoric scale tree, a straight green-brown trunk covered with a diamond pattern like snake scales, a small crown of drooping grass-like branches only at the very top", [512, 1024]),
  "pc-moc-tac": prop("One tall giant horsetail plant, a straight jointed green stem like bamboo with rings of thin needle-like branches at every joint", [512, 1024]),
  "pc-duong-xi": prop("One tree fern, a rough brown trunk with a wide umbrella crown of big green fern fronds", [768, 1024]),
  "pc-bui": prop("A long low row of ferns, moss and small horsetails in layered green paper, reaching from the left edge to the right edge", [1536, 512]),
  "pc-dat": prop("A long low strip of muddy prehistoric ground made of layered dark brown mud paper and green moss paper, reaching from the left edge to the right edge", [1536, 512]),
  "pg-ban": puppet(`${BAN}, standing and looking up with an amazed open mouth`),
  "pg-ban-so": puppet(`${BAN}, leaning back in fright with both hands raised and wide eyes`),
  "pg-arthro": puppet("a giant prehistoric millipede with a long flat body of many dark brown and orange armour segments and many small legs, crawling, seen exactly from the side", [1024, 512]),
});
module.exports.style = "Layered paper cut-out illustration, handmade craft paper collage with visible paper grain, bold dark outlines, flat rich colours, soft drop shadows between the paper layers";
