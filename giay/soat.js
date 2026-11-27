// Checks a story's generated layers against its own anh.js spec: does the file exist,
// is it the right kind (png for keyed cuts, jpg for plates) and the right pixel size.
// Only the cheap facts; whether a picture is right is for eyes, not for this script.
// The stub helpers below must stay in step with the real ones in giay/sinh.js (which
// cannot be require()d — it generates at the top level): same defaults, same ext rule.
// Usage: node giay/soat.js <story-folder> [--json]
//        --json prints one line for the slash commands to read
// Exit 0 every layer present and matching, 1 some layer missing or mismatched,
//      2 usage error or anh.js that cannot be read.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const json = process.argv.includes("--json");
const dir = path.resolve(process.argv[2] || "");
if (!process.argv[2] || !fs.existsSync(path.join(dir, "anh.js"))) {
  console.error("usage: node giay/soat.js <story-folder> [--json]");
  process.exit(2);
}

const helpers = {
  // sizes and keyed flags must mirror giay/sinh.js; the prompts and scripts are not needed here
  plate: (what, size) => ({ size }),
  prop: (what, size = [1024, 768]) => ({ size, keyed: 1 }),
  puppet: (who, size = [768, 1024]) => ({ size, keyed: 1 }),
  drawn: (script, size) => ({ size, keyed: 1 }),
};

let IMAGES;
try {
  IMAGES = require(path.join(dir, "anh.js"))(helpers);
} catch (e) {
  console.error(`cannot read ${dir}/anh.js: ${e.message}`);
  process.exit(2);
}

const sizeOf = (file) => {
  const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], { encoding: "utf8" });
  return [Number((out.match(/pixelWidth: (\d+)/) || [])[1]), Number((out.match(/pixelHeight: (\d+)/) || [])[1])];
};

const layers = {};
for (const name of Object.keys(IMAGES)) {
  const spec = IMAGES[name] || {};
  const expected = spec.size || [864, 1536];
  const ext = spec.keyed ? "png" : "jpg";
  const file = path.join(dir, "anh", `${name}.${ext}`);
  const entry = { file: `anh/${name}.${ext}`, exists: fs.existsSync(file), expectedExt: ext, expected, actual: null, mtime: null, ok: true, problems: [], warns: [] };
  if (!entry.exists) {
    entry.problems.push("missing");
  } else {
    entry.actual = sizeOf(file);
    entry.mtime = fs.statSync(file).mtimeMs;
    if (entry.actual[0] !== expected[0] || entry.actual[1] !== expected[1])
      entry.problems.push(`size ${entry.actual[0]}x${entry.actual[1]} != ${expected[0]}x${expected[1]}`);
    // sinh.js deletes the png after converting a plate to jpg: one left behind is a crash between the two
    if (!spec.keyed && fs.existsSync(path.join(dir, "anh", `${name}.png`)))
      entry.warns.push("stray .png beside the .jpg (a generation that died before conversion)");
  }
  entry.ok = entry.problems.length === 0;
  layers[name] = entry;
}

const bad = Object.values(layers).filter((l) => !l.ok).length;
if (json) {
  console.log(JSON.stringify({ folder: path.basename(dir), ok: bad === 0, layers }));
} else {
  const W = [6, 26, 12, 10].map((w, i) => Math.max(w, ...Object.entries(layers).map(([n, l]) => String([n, l.file, l.actual ? `${l.actual[0]}x${l.actual[1]}` : "-", ""][i]).length)));
  console.log(["LAYER", "FILE", "KÍCH THƯỚC", "KẾT QUẢ"].map((h, i) => h.padEnd(W[i])).join(" | "));
  for (const [name, l] of Object.entries(layers)) {
    const row = [name, l.file, l.actual ? `${l.actual[0]}x${l.actual[1]}` : "-", l.ok ? "đạt" : `lỗi: ${l.problems.join("; ")}`];
    console.log(row.map((c, i) => String(c).padEnd(W[i])).join(" | "));
    for (const w of l.warns) console.log(`  (${name}: ${w})`);
  }
  console.log(bad ? `${bad} / ${Object.keys(layers).length} lớp lỗi` : `${Object.keys(layers).length}/${Object.keys(layers).length} đạt`);
}
process.exit(bad ? 1 : 0);
