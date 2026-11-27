// The layers of "What If Earth Had Two Moons?": the night city by the sea, the cream sheet its split frame is glued
// on, the two moons, the Sun and the person looking up. Everything else (the phases of the moons, the sleeve of water
// round the Earth, the cards of the split frame, the shadow cones of an eclipse, the orbits, the arrows and the paper
// labels, space and the Earth itself) is drawn by code in canh.js: a 4-step model does not keep a shadow pointing where
// it should or a tide where it belongs.
const NOSHADOW = "no shadow under the feet";
module.exports = ({ plate, prop, puppet }) => ({
  // the outline's first picture: the camera in a city, tilted up to the night sky, the light of the moons on the sea
  "pl-thanh-pho": plate("A city seafront at night: a deep indigo craft paper sky full of small pale paper stars filling the top half of the picture, below the sky a row of dark navy and charcoal craft paper buildings of many heights with small warm yellow paper windows, their rooftops a jagged line, standing along the far side of a narrow band of dark blue paper sea, and a wide flat empty strip of dark grey stone paper promenade along the bottom two fifths of the picture, its edge straight and level. Only stars in the sky"),
  "pl-giay-vang": plate("A full-frame sheet of warm cream craft paper with visible paper fibre grain, evenly lit, nothing else"),
  "pc-moon-a": prop("One full moon seen from space: a perfectly round disc of light warm grey craft paper with five big craters as flat circles of darker grey paper, a bold dark outline around the disc"),
  "pc-moon-b": prop("One small moon seen from space: a perfectly round disc of cool grey blue craft paper with a hint of teal, five big craters as flat circles of pale cream paper, a bold dark outline around the disc"),
  "pc-mat-troi": prop("One sun: a round disc of golden yellow craft paper with a bold dark outline, a ring of short wavy orange paper rays around the disc"),
  "pg-nguoi": puppet(`a person standing on a beach at night seen from behind, the head tilted back to look up at the sky, short dark hair, a mustard yellow jacket, dark teal trousers, brown boots, arms hanging relaxed, ${NOSHADOW}`),
});
module.exports.style = "Layered paper cut-out illustration, handmade craft paper collage with visible paper grain, bold dark outlines, flat rich colours, soft drop shadows between the paper layers";
