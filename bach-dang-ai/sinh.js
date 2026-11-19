// Generates the stills with FLUX.2 klein 4B (Apache 2.0) through mflux, one image per vertical shot.
// Usage: node sinh.js all            every image that does not exist yet
//        node sinh.js 5b 12:31       named images again; name:seed picks another seed
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const BIN = path.join(process.env.HOME, "ai-models/venv/bin");
const OUT = path.join(__dirname, "anh");
const ENV = { ...process.env, HF_HOME: path.join(process.env.HOME, "ai-models/hf") };

const STYLE = "3D animated family film still, stylized characters with slightly large heads and big expressive eyes, smooth skin, warm cinematic lighting, soft depth of field, rich detail, vertical composition with the subject in the upper two thirds of the frame";
// a shot without people must not mention characters at all, or the model paints a face into the landscape
const SCENERY = "3D animated family film background, a landscape with no characters, warm cinematic lighting, soft depth of field, rich detail, vertical composition";
const NGO = "a Vietnamese general of the tenth century in his early forties, tanned skin, short black beard and moustache, black hair tied in a topknot, a red cloth headband, bronze lamellar scale armour over a dark red tunic";
const THAO = "a Southern Han prince, a grown man of about twenty-five with a lean adult face and a thin black moustache, proud look, a golden iron helmet with a white plume, golden lamellar armour over a blue tunic";
const KING = "an old Southern Han king about sixty years old with a long white beard, a black flat-topped imperial crown with strings of beads hanging at the front and back, a dark blue robe with golden trim";
const VIET = "adult Vietnamese soldiers of the tenth century, grown men with strong builds and short beards or stubble, tanned skin, black hair in topknots under green cloth turbans, simple brown tunics with green sashes";
const HAN = "adult Southern Han soldiers, grown men, in round iron helmets with red plumes and blue tunics";
const JUNK = "large Chinese war junks with tall flat red sails stiffened by horizontal bamboo battens, high sterns and round shields along the sides";
const STAKES = "huge sharpened wooden stakes capped with dark iron points";
const RIVER = "a wide river mouth with misty limestone karst mountains far behind";
const DUSK = "golden dusk sky";
const SAME = (who) => `The same ${who} as in the reference image`;

const IMAGES = {
  ngo: { prompt: `Waist-up portrait of ${NGO}, calm determined face, looking at the camera, standing on a riverbank, ${RIVER}, ${DUSK}.` },
  thao: { prompt: `Waist-up portrait of ${THAO}, looking at the camera, standing on the deck of a wooden warship, ${RIVER}, bright daylight.` },
  king: { prompt: `Waist-up portrait of ${KING}, stern face, looking at the camera, inside a dark blue and gold throne hall lit by hanging lamps.` },

  "c-hook": { prompt: `A naval battle on ${RIVER}, ${DUSK}: ${JUNK} are stuck on ${STAKES} that stick out of the water, one hull splinters and tilts, flames on its deck, frightened ${HAN} fall into the water with big splashes. No blood.` },
  "c-hook2": { prompt: `Wide view from above of ${RIVER} at dusk after a naval battle: several ${JUNK} lie tilted and burning among long rows of ${STAKES} in shallow water, smoke rising into an orange sky. No people in the foreground.` },
  "c-1": { prompt: `Inside a dark wooden palace hall with red pillars and a bronze drum pattern on the wall: an old Vietnamese lord with a white beard and a brown robe reads a scroll in the foreground, unaware, while behind him in the shadow a scowling officer in a dark green robe with a black headband grips the hilt of a sheathed sword. Tense mood, no blood.` },
  "c-2": { refs: ["ngo"], prompt: `${SAME("man")}, ${NGO}, marching at the head of his army and pointing a straight sword forward, behind him ${VIET} carry tall spears along a dirt road, no flags and no banners anywhere, between green hills, golden morning light.` },
  "c-3": { refs: ["king"], prompt: `${SAME("king")}, ${KING}, sitting on a golden throne in a dark blue and gold throne hall lit by hanging lamps, in front of him a messenger, a grown man with a short black beard in a plain dark green robe, kneels and holds up a rolled letter with both hands.` },
  "c-3b": { refs: ["thao", "king"], prompt: `The prince from the first reference image, ${THAO}, stands in the foreground with one fist on his chest, eager and proud, and behind him the old king from the second reference image, ${KING}, points forward from his throne, in a dark blue and gold throne hall lit by hanging lamps.` },
  "c-5": { refs: ["ngo"], prompt: `${SAME("man")}, ${NGO}, standing on a riverbank with one hand on his chin, thinking, looking out over the water with a slight confident smile, a small campfire and a red banner behind him, ${RIVER}, ${DUSK}.` },
  "c-5b": { refs: ["ngo"], prompt: `${SAME("man")}, ${NGO}, close-up from the chest up, speaking firmly with his mouth open, his right arm stretched out with the index finger pointing toward the river, both hands visible, standing on a riverbank, ${RIVER}, ${DUSK}.` },
  "c-6": { prompt: `In a green forest clearing, ${VIET} sharpen huge tree trunks into pointed stakes with axes, wood chips flying, a pile of finished ${STAKES} beside them, sunbeams through the trees.` },
  "c-7": { prompt: `On ${RIVER} at low tide, bright morning: ${VIET} stand in small wooden rowing boats and drive ${STAKES} into the riverbed with big wooden mallets, rows of stakes already standing in the shallow water.` },
  "c-8": { empty: 1, prompt: `No people, no boats, no stakes. Night, high tide: ${RIVER} under a big full moon, the water surface wide, smooth and perfectly calm, moonlight reflected on gentle ripples, peaceful and mysterious.` },
  "c-8b": { empty: 1, prompt: `No people, no faces, no characters, no animals. Underwater view inside a dark green river at night: rows of ${STAKES} stand on the muddy riverbed and reach up toward the rippling surface just above them, pale moonbeams shine down through the water onto their iron points, small bubbles and drifting particles.` },
  "c-9": { prompt: `A fleet of ${JUNK} sails into ${RIVER} at high tide, seen from the front, the biggest ship in the middle, ${HAN} standing on the decks, grey morning sky, calm full water.` },
  "c-9b": { prompt: `In the foreground, ${VIET} in two small wooden rowing boats row away fast while one of them shoots an arrow backward with a bow; far behind them ${JUNK} give chase, ${RIVER}, grey morning sky.` },
  "c-10": { refs: ["thao"], prompt: `${SAME("prince")}, ${THAO}, standing at the bow of a big wooden warship with a red battened sail behind him, shouting and pointing straight ahead with one arm, both hands visible, ${HAN} behind him, ${RIVER}, grey morning sky.` },
  "c-11": { empty: 1, prompt: `No people. Low tide on ${RIVER}, ${DUSK}: long rows of ${STAKES} rise out of the receding water, each wooden stake clearly tipped with a dark iron cone, wet wood, small ripples around each stake, dramatic and quiet.` },
  "c-11c": { refs: ["ngo"], prompt: `${SAME("man")}, ${NGO}, full body, standing on a small wooden rowing boat and raising a straight sword above his head with his right hand while his left arm stretches forward with an open hand pointing ahead, both arms and both hands clearly visible, shouting a command, ${RIVER}, ${DUSK}, ${STAKES} in the water behind him.` },
  "c-12": { prompt: `Close view of a naval disaster on ${RIVER}, ${DUSK}: one of the ${JUNK} crashes onto ${STAKES}, a stake bursts through the wooden hull, planks fly, the ship tilts hard, its red battened sail tears, frightened ${HAN} hold on to the rail. No blood.` },
  "c-13": { refs: ["thao"], prompt: `${SAME("prince")}, ${THAO}, terrified with wide eyes and open mouth, clinging to the broken mast of a sinking burning warship with a torn red battened sail, water rising around him, ${HAN} swimming in the river below, ${RIVER}, ${DUSK}. No blood.` },
  "c-14": { refs: ["king"], prompt: `${SAME("king")}, ${KING}, standing on a grey sandy shore and weeping, one sleeve raised to his eyes, tears on his cheeks, two sad ${HAN} with lowered heads behind him, a few ships sailing away on a grey sea under a cloudy sky.` },
  "c-15": { refs: ["ngo"], prompt: `${SAME("man")}, the same face and beard, now a king: he keeps his black topknot and wears a simple golden band around his forehead, not a western crown, and a long orange royal robe with golden trim, smiling proudly with both arms raised, standing in front of a wooden palace hall on an earthen citadel rampart with a wooden palisade, a bronze drum beside him, bright spring sunrise.` },
  "c-15b": { prompt: `A joyful crowd of Vietnamese villagers and ${VIET} cheer with raised arms and wave plain red and plain yellow triangular banners without any emblem or star in front of an earthen citadel rampart with a wooden palisade, bright spring sunrise, petals in the air.` },
  "c-ket": { empty: 1, prompt: `No people, no boats. Peaceful sunrise over ${RIVER}, calm golden water, soft mist, a wide empty sky filling the upper half of the frame.` },
};



const asked = process.argv.slice(2);
if (!asked.length) { console.error("usage: node sinh.js all | <name[:seed]> ..."); process.exit(1); }
const jobs = asked[0] === "all"
  ? Object.keys(IMAGES).filter((name) => !fs.existsSync(file(name))).map((name) => [name, 7])
  : asked.map((a) => { const [name, seed = 7] = a.split(":"); return [name, Number(seed)]; });

fs.mkdirSync(OUT, { recursive: true });
for (const [name, seed] of jobs) {
  const image = IMAGES[name];
  if (!image) { console.error(`unknown image: ${name}`); process.exit(1); }
  const refs = (image.refs || []).map(file);
  const missing = refs.find((r) => !fs.existsSync(r));
  if (missing) { console.error(`${name}: reference ${missing} does not exist yet`); process.exit(1); }
  const args = ["--model", "flux2-klein-4b", "--quantize", "4", "--steps", "4", "--seed", String(seed), "--width", "864", "--height", "1536",
    "--prompt", `${image.empty ? SCENERY : STYLE}. ${image.prompt}`, "--output", png, ...(refs.length ? ["--image-paths", ...refs] : [])];
  // mflux never overwrites: it would write name_1.png beside the old image
  const png = path.join(OUT, `${name}.png`);
  for (const old of [png, file(name)]) fs.rmSync(old, { force: true });
  const started = Date.now();
  const run = spawnSync(path.join(BIN, refs.length ? "mflux-generate-flux2-edit" : "mflux-generate-flux2"), args, { env: ENV, stdio: ["ignore", "ignore", "pipe"] });
  if (run.status !== 0) { console.error(`${name}: failed\n${String(run.stderr).slice(-600)}`); process.exit(1); }
  if (file(name) !== png) { spawnSync("ffmpeg", ["-v", "error", "-y", "-i", png, "-q:v", "2", file(name)]); fs.rmSync(png); }
  console.log(`${name} seed ${seed} ${((Date.now() - started) / 1000).toFixed(0)}s`);
}
