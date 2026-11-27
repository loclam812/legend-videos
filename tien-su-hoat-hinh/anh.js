// The paper layers of "Surviving the Ice Age in a mammoth-bone house" in the storybook look (look "storybook" in
// giay/may.js), restyled on 2026-11-23 after the paper-cut short the user sent as the reference: layered craft
// paper with bold outlines, people and animals as cut-outs glued on white paper, torn cream sheets between the
// scenes, paper labels. The flat stick-figure layers this folder had before are in git history (50ef86d).
// See giay/sinh.js for plate, prop and puppet. Every prompt stays short and concrete: this 4-step model follows
// the style string harder than the picture it is asked for, and a long list of negations gets painted.
// the model paints a grey contact shadow under a standing figure; it would be glued onto the white backing too
const NOSHADOW = "no shadow under the feet";
const FUR = "a simple tunic of brown fur paper with a jagged hem and fur boots";

module.exports = ({ plate, prop, puppet }) => ({
  // the three weathers as whole landscapes, sky over a plain of paper drifts down to the bottom edge: the cut-outs stand
  // on the plain and the captions fall on the snow in front of them. A sky-only plate left the lower third to be drawn
  // by code, which came out plain and empty next to the reference
  "pl-canh-bao": plate("A wide snowy plain in a winter storm, made of layered torn craft paper: the upper two thirds are a dark storm sky of grey, indigo and purple torn paper bands with heavy curled paper clouds and slanting white paper snow streaks; at the horizon a line of low pale snow hills, and the lower third a wide empty snowfield of white, cream and pale blue torn paper drifts with soft rounded drifts in the foreground. No buildings."),
  "pl-canh-nang": plate("A wide snowy plain under a clearing winter sky, made of layered torn craft paper: the upper two thirds are a pale cold sky of icy blue and cream torn paper bands with dark grey curled paper storm clouds in the top corners and wide slanting bands of warm golden paper light coming down from the upper left; at the horizon low pale snow hills, and the lower third a wide empty snowfield of white, cream and pale blue torn paper drifts with soft rounded drifts in the foreground. No buildings."),
  "pl-canh-chieu": plate("A wide snowy plain at dusk, made of layered torn craft paper: the upper two thirds are a dusk sky of deep indigo, purple and rose torn paper bands with a warm orange glow at the horizon, a thin cream paper crescent moon and a few small gold paper stars; at the horizon low snow hills in lavender shadow, and the lower third a wide empty snowfield of pale lavender, lilac grey and white torn paper drifts with soft rounded drifts in the foreground. No buildings."),
  // the one plate with people painted into it: a family round a fire is a whole room, and it does not move apart.
  // Two later seeds were worse: the family came back as three bearded adults, or the father wore a collar and tie
  "pl-trong": { size: [864, 1536], prompt: "Inside a prehistoric hut built from mammoth bones: big curved white paper ribs arching overhead, walls of stitched brown hide paper, one heavy white mammoth skull in the wall, a warm orange paper fire in a ring of stones on the earthen floor, and a family of prehistoric people in fur clothes sitting around the fire on thick fur bedding. No text." },

  "pc-nha": prop("One round dome-shaped prehistoric hut built from mammoth bones and covered with hides, standing alone and empty: a dome of big curved white paper ribs, one heavy white mammoth skull built into the wall, two long curved cream paper tusks arching over the top, panels of stitched brown and tan hide paper, one small dark entrance at the bottom, seen exactly from the side, the whole hut visible"),
  // "frame" and "no cover" came back as a flat ring of bone with the skull in the middle, and "wide gaps of empty
  // space" as a dome with a dark inside; comparing it to an umbrella frame gives open ribs, the skull and the tusk
  // apart, which is what the three labels of shot 5 point at
  "pc-khung": prop("One dome-shaped tent made only of big curved white mammoth bone ribs, like the frame of half an umbrella: seven white paper ribs standing side by side with nothing between them, one heavy white mammoth skull tied to the left side, two long curved cream paper tusks arching over the top, brown leather straps tying the ribs together, seen exactly from the side, the whole frame visible"),
  // a small prop beside the frame: the model lays the bones crosswise behind the skull whatever the prompt says
  "pc-xuong": prop("One mammoth skull lying on the ground beside three long white leg bones, seen exactly from the side: the skull with two long curved cream paper tusks and two dark eye holes, the bones lying in a low heap", [768, 512]),

  "pg-nhom": puppet(`three prehistoric people walking in a line and holding hands, seen exactly from the side: a big bearded man with a spear used as a walking stick in front, a woman with long hair in the middle, a small child at the back, all in ${FUR}, ${NOSHADOW}`, [1024, 768]),
  "pg-run": puppet(`a prehistoric woman with long black hair in ${FUR}, standing still and hugging her own shoulders, shivering with cold, shoulders up to her ears, seen exactly from the side, ${NOSHADOW}`),
  "pg-nang": puppet(`a prehistoric man with a dark beard in ${FUR}, bent forward under one huge white mammoth thigh bone carried on his shoulder and held with both hands, walking, seen exactly from the side, ${NOSHADOW}`),
  "pg-keo": puppet(`a prehistoric woman with long black hair in a simple tunic of cream fur paper with a jagged hem and fur boots, standing on tiptoe and reaching both arms straight up to hold the edge of one big flat brown animal hide spread above her head like a roof, seen exactly from the side, ${NOSHADOW}`),
  "pg-mamut": puppet(`a woolly mammoth with a big humped body of dark brown paper fur, a long trunk hanging down, two long curved cream paper tusks, a small flat tail, four thick legs, walking slowly on four legs, seen exactly from the side, not a dinosaur and not an elephant, ${NOSHADOW}`, [1024, 768]),
});
module.exports.style = "Layered paper cut-out illustration, handmade craft paper collage with visible paper grain, bold dark outlines, flat rich colours, soft drop shadows between the paper layers";
