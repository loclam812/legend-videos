// Generates a paper-cut story's layers with FLUX.2 klein 4B (Apache 2.0, so the output may be monetised) through
// mflux. The tool and the model live outside the repo in ~/ai-models/.
// <story-folder>/anh.js exports a function that gets the helpers below and returns { name: image }.
// Usage: node giay/sinh.js <story-folder> all             every image that does not exist yet
//        node giay/sinh.js <story-folder> pg-em pc-dao:31  named images again; name:seed picks another seed
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const BIN = path.join(process.env.HOME, "ai-models/venv/bin");
const ENV = { ...process.env, HF_HOME: path.join(process.env.HOME, "ai-models/hf") };
const dir = path.resolve(process.argv[2] || "");
const OUT = path.join(dir, "anh");

const PAPER = "Layered paper cut-out illustration, handmade craft paper collage with visible paper grain, bold dark outlines, flat warm colours, soft drop shadows between the paper layers, Vietnamese folk woodblock print feeling with curled cloud motifs";
// each moving thing is painted on flat magenta, which the page keys out so the layers can move apart
const KEY = "isolated on a flat solid pure magenta background, the whole background is one even magenta colour with no texture, no shadow and no gradient, nothing else in the picture, no text";
const helpers = {
  // a full-frame backdrop (864x1536, stored as jpg)
  plate: (what) => ({ prompt: `${what} No people, no animals, no text.` }),
  // a keyed thing (png); size is [width, height] in multiples of 16
  prop: (what, size = [1024, 768]) => ({ size, keyed: 1, prompt: `${what}, ${KEY}.` }),
  // a keyed whole figure
  puppet: (who, size = [768, 1024]) => ({ size, keyed: 1, prompt: `One full-body paper puppet, the whole figure visible from head to feet: ${who}. Simple flat shapes, ${KEY}.` }),
};
const IMAGES = require(path.join(dir, "anh.js"))(helpers);
const file = (name) => path.join(OUT, `${name}.${IMAGES[name].keyed ? "png" : "jpg"}`);

const asked = process.argv.slice(3);
if (!asked.length) { console.error("usage: node giay/sinh.js <story-folder> all | <name[:seed]> ..."); process.exit(1); }
const jobs = asked[0] === "all"
  ? Object.keys(IMAGES).filter((name) => !fs.existsSync(file(name))).map((name) => [name, 7])
  : asked.map((a) => { const [name, seed = 7] = a.split(":"); return [name, Number(seed)]; });

fs.mkdirSync(OUT, { recursive: true });
for (const [name, seed] of jobs) {
  const image = IMAGES[name];
  if (!image) { console.error(`unknown image: ${name}`); process.exit(1); }
  const [width, height] = image.size || [864, 1536];
  // mflux never overwrites: it would write name_1.png beside the old image
  const png = path.join(OUT, `${name}.png`);
  for (const old of [png, file(name)]) fs.rmSync(old, { force: true });
  const started = Date.now();
  const run = spawnSync(path.join(BIN, "mflux-generate-flux2"), ["--model", "flux2-klein-4b", "--quantize", "4", "--steps", "4", "--seed", String(seed),
    "--width", String(width), "--height", String(height), "--prompt", `${PAPER}. ${image.prompt}`, "--output", png], { env: ENV, stdio: ["ignore", "ignore", "pipe"] });
  if (run.status !== 0) { console.error(`${name}: failed\n${String(run.stderr).slice(-600)}`); process.exit(1); }
  if (file(name) !== png) { spawnSync("ffmpeg", ["-v", "error", "-y", "-i", png, "-q:v", "2", file(name)]); fs.rmSync(png); }
  console.log(`${name} seed ${seed} ${((Date.now() - started) / 1000).toFixed(0)}s`);
}
