// The layers of "How Many Microbes Live Inside Your Body?": the person, the microbes and the fiber-rich foods as
// cut-outs the model painted on magenta and the page glues on white paper, two sheets of craft paper, and the tissue
// and the gut the camera passes into as whole plates. Everything else is drawn by code in canh.js, in the same paper
// look: the numbers, the digestive tract, the fiber and the compounds, the wall of the gut with its immune cells, the
// antibiotic capsule and the light inside the body. No keyed piece uses a pink, lilac or purple: the page keys out
// anything with a trace of magenta.
const NOSHADOW = "no shadow under the feet";

module.exports = ({ plate, prop, puppet }) => ({
  // the sheets the pages are made of, copied from ten-lua-elon-musk/ with their prompts: the cream page the person
  // stands on and the balance hangs on, the dark teal sheet of the glowing body at the end
  "pl-giay-vang": plate("A full-frame sheet of warm cream craft paper with visible paper fibre grain, evenly lit, nothing else"),
  "pl-giay-xanh": plate("A full-frame sheet of dark teal blue craft paper with visible paper fibre grain, evenly lit, nothing else"),
  // what the camera sinks into through the skin: a close-up of tissue, cells like cobblestones, the lower third even
  // for the captions. Not a keying plate, so pink and coral are allowed here
  "pl-mo": plate("The inside of a human body seen very close up, made of layered torn craft paper: big rounded cells of coral red, salmon and warm rose paper packed side by side like cobblestones, each cell a soft rounded shape with a bold dark outline and a soft drop shadow, thin winding dark red paper capillaries running between the cells, a warm glow in the middle of the picture, evenly lit; the lower third is a smooth even area of soft coral paper"),
  // the gut: a tunnel of ruffled folds receding to a golden glow, for the community that lives there. The rings must
  // fill the frame: "a round tunnel" came back as a round paper tunnel lying on a grey page, with a peach sheet over
  // its lower third
  "pl-ruot": plate("The inside of the intestine seen from within, made of layered torn craft paper: concentric frilled rings of warm pink, peach and coral paper filling the whole picture from edge to edge, each ring a wavy ruffled band around the next, ring behind ring receding toward a soft golden glow in the middle of the picture, a strong sense of depth, the rings reaching the edges of the picture on every side, evenly lit"),
  // the hero, a friendly rod bacterium with flagella; its tails sprout from its left end as generated
  "pc-vi-khuan": prop("One friendly cartoon bacterium seen under a microscope, lying sideways: a fat rounded rod of teal green craft paper with a few darker green paper spots, two big round white paper eyes with black pupils and a small happy smile on its right half, three long wavy cream paper tails sprouting from its left end"),
  // a cluster of cocci like a bunch of grapes
  // seed 8: seed 7 left one eye without a pupil
  "pc-coc": prop("One friendly cartoon bacterium seen under a microscope: a round cluster of golden yellow craft paper balls pressed together like a bunch of grapes, about seven balls, each ball a flat circle with a bold dark outline, two round white paper eyes side by side on the front ball, each with a black paper pupil in its middle"),
  // a spiral bacterium, a ribbon twisted like a corkscrew
  "pc-xoan": prop("One spiral bacterium seen under a microscope: a long orange craft paper ribbon twisted like a corkscrew, lying diagonally, with a bold dark outline along both edges and two thin cream paper stripes winding along its length"),
  // one human cell, the other pan of the balance
  "pc-te-bao": prop("One human cell seen under a microscope: one big round cell of peach craft paper with a softly wavy outline, one round orange paper nucleus in its centre with a small cream crescent highlight, and six small gold paper dots scattered around the nucleus"),
  // the other members of the microbiome (the outline of 2026-11-25, scene 04): a yeast cell and a one-celled animal are
  // living cells, so they may have a face; the virus is a rigid particle with none, as the outline asks
  "pc-nam-men": prop("One friendly cartoon yeast cell seen under a microscope: a big oval cell of pale golden tan craft paper with a smaller round bud growing out of its upper right side, a bold dark outline around both, a few tiny darker dots inside, two round white paper eyes with black pupils and a small smile on the big cell"),
  "pc-don-bao": prop("One friendly cartoon paramecium seen under a microscope, a one-celled animal shaped like a fat slipper lying sideways: sky blue craft paper with a bold dark outline, a fringe of short cream paper hairs like eyelashes all around its edge, a curved dark groove along one side, a few small round dots inside, two round white paper eyes with black pupils and a small smile at the rounded front end"),
  "pc-virut": prop("One bacteriophage virus particle seen under a microscope, a rigid geometric object like a tiny lunar lander: a tall faceted head of deep blue craft paper shaped like a pointed gem with lighter blue triangular facets, a straight thin tail with fine lighter stripes hanging below the head, and six thin jointed paper legs fanning out from the end of the tail, the whole thing flat and symmetrical, a lifeless machine-like shape"),
  // the fiber-rich foods of scene 08, one cut-out a kind: vegetables, fruit, beans, whole grains
  "pc-rau": prop("A bunch of fresh vegetables lying together: one head of broccoli with bumpy green florets and a pale green stalk, one orange carrot lying across it with a few feathery green tops, and two leaves of dark green kale"),
  "pc-trai-cay": prop("A group of fresh fruit lying together: one red apple with a small green leaf, one yellow banana curving beside it, and a small cluster of three round blue blueberries"),
  "pc-dau": prop("A paper cut-out of beans: one open green bean pod showing a row of round pale green beans inside it, with three dark red kidney beans and a few small white beans scattered beside the pod"),
  "pc-ngu-coc": prop("A group of whole grain foods lying together: one slice of brown whole-grain bread with visible seeds and grains, one golden ear of wheat lying beside it, and a small wooden bowl filled with rolled oats"),
  // the person the story happens to, the whole figure front on and symmetrical, no cream or white in the clothes so
  // nothing of it is taken for the backing when canh.js cuts the figure out of its white paper
  "pg-nguoi": puppet(
    `a cheerful young man standing upright and facing the viewer, seen exactly from the front: short black hair, a round friendly face with a small smile, warm tan skin, a plain teal green T-shirt, mustard yellow knee-length shorts, brown paper shoes, bare arms and lower legs, arms hanging a little away from the body, the whole figure symmetrical, ${NOSHADOW}`,
    [1024, 1536],
  ),
});
module.exports.style = "Layered paper cut-out illustration, handmade craft paper collage with visible paper grain, bold dark outlines, flat rich colours, soft drop shadows between the paper layers";
