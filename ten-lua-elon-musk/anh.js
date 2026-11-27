// The layers of the story in the storybook paper-cut look. The plates are whole landscapes or sheets of craft
// paper with an empty lower third for the captions; the keyed pieces are the things of the story and the
// engineer is the only puppet. The tower, the flame, the gauges and the wall and nozzle diagrams are drawn
// by code in canh.js, and so are the engine (ve-co.js) and the rocket (ve-sls.js).
const NOSHADOW = "no shadow under the feet";

module.exports = ({ plate, prop, puppet, drawn }) => ({
  // landscapes and pages
  "pl-ban-do": plate("A wide rocket engine test site in a pine forest at dusk, made of layered torn craft paper: the upper two thirds are a deep teal and indigo dusk sky of torn paper bands with an orange glow low at the horizon and a few curled paper clouds; at the horizon a dark line of pine trees; the lower third is a wide empty tan concrete apron with soft paper shadows"),
  "pl-ban-phong": plate("A wide rocket launch site in a pine forest at night, made of layered torn craft paper: the upper two thirds are a night sky of deep indigo and navy torn paper bands with a big pale cream paper full moon in the upper left and small gold paper stars; at the horizon a dark line of pine trees; the lower third is a wide empty grey concrete apron with soft paper shadows"),
  "pl-xuong": plate("Inside a big rocket factory hall, made of layered torn craft paper: tall grey steel columns and roof trusses of paper strips, a row of high windows with pale yellow light, two hanging work lamps with warm yellow paper light, a gantry crane beam across the top; the lower third is a wide empty grey concrete floor"),
  "pl-giay-xanh": plate("A full-frame sheet of dark teal blue craft paper with visible paper fibre grain, evenly lit, nothing else"),
  "pl-giay-vang": plate("A full-frame sheet of warm cream craft paper with visible paper fibre grain, evenly lit, nothing else"),

  // things
  // the engine follows the engine of the source video part for part: a short knob on a wide rounded box (the head) with
  // two seams, a short ribbed pump on each side of the upper part of the head joined to it by a stub, a white pipe of
  // three beads from the bottom of the right pump into the side of the short gold chamber, a dark collar, and one wide
  // bell of thin vertical tubes with three rings and a dark opening at its rim. The model did not draw that structure in
  // three pictures (two round drums on a narrow pleated skirt; a trumpet bell with tall pumps; and started from a sketch
  // of the source it either copied it flat or turned the pipe into pearls), the user said so, so ve-co.js draws it
  "pc-co": drawn("ve-co.js", [1536, 2304]),
  // the rocket (the SLS) follows the rocket of the source video part for part: a thin mast on a small white capsule, two
  // short white cylinders, a white taper down to the long orange core, two long white boosters with pointed noses beside
  // it, a nozzle under each, and four pale grey bells in a row under the core. The model drew three bells for the four
  // the prompt and the voice name, so ve-sls.js draws it
  "pc-sls": drawn("ve-sls.js", [768, 3072]),
  "pc-tau": prop("One space shuttle orbiter seen exactly from the side, the whole shuttle visible: a white paper space plane with a black nose and a black belly, one big triangular wing, a tall tail fin, three round grey engine bells at the back"),
  "pg-ky-su": puppet(`a rocket engineer wearing a yellow hard hat, safety glasses, a purple work jacket and dark blue trousers, standing upright and holding a spanner in one hand, seen exactly from the side, ${NOSHADOW}`),
  "pc-may-in": prop("One 3D printer seen exactly from the side, the whole machine visible: an open box frame of red paper struts, a dark navy glass door in front, and inside it a gold-coloured metal rocket nozzle half printed on the flat build plate, a small print head above it", [1024, 1024]),
});

module.exports.style = "Layered paper cut-out illustration, handmade craft paper collage with visible paper grain, bold dark outlines, flat rich colours, soft drop shadows between the paper layers";
