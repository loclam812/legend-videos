---
description: Bước 2/4 — phân tích kịch bản trong content.json, tạo thư mục chuyện và sinh ảnh
argument-hint: (không đối số)
---

Step 2 of the staged video workflow: read `content.json` at the repo root, analyse the
WHOLE script, create the story folder, then generate the layers (with the user's
consent first). Everything you say to the user is Vietnamese. No arguments.

1. **Guard.** No `content.json` → refuse: "chưa có kịch bản, chạy /kichban trước".
   Never infer state from the filesystem. A `style` other than `giay` or `sachtranh`
   in it (a file written before the looks were renamed) → ask which of the two this
   story takes; do not guess. If `status.preparedAt` is set and the folder exists,
   ask which the user wants:
   - **resume** — keep `loi.js`/`anh.js`/`canh.js` as they are and only generate the
     layers still missing (this is also the recovery when `sinh.js` died mid-run:
     `all` only ever generates files that do not exist yet);
   - **rebuild** — analyse `content.json.script` again and rewrite the three files
     (warn: any manual fixes inside them are lost).
   If `loi.js` on disk is newer than `status.preparedAt`, prefer asking — someone
   edited it by hand.

2. **Analyse the whole script → design the shots.** Read every sentence before
   writing anything. Follow an existing folder as the pattern — read its `loi.js`,
   `anh.js` and `canh.js`:
   - `pattern` in `content.json` (a story folder the user named) comes first: copy
     that folder's style string and the `look` its `canh.js` passes to `start`,
     whatever its name says;
   - `style=giay` (the woodblock paper-cut): `an-khe-giay/` for a folk tale,
     `thien-thach-giay/` for a story that is not one;
   - `style=sachtranh` (the storybook paper-cut, `look: "storybook"`):
     `tien-su-hoat-hinh/` — the folder keeps an old name; copy its look;
   - `format=doc`: one short sentence per shot. `format=ngang`: `const WIDE = true;`,
     several sentences per shot, `300-trieu-nam-giay/` as the pattern. `ngang` with
     `sachtranh` has never been made: the engine allows it, but nobody has looked at
     the result — check the caption zone and the transitions on the sheet first.
   - Captions are burned in. Write `const SUBS = false;` only when the user asked for
     a cut without them — a story that will also be published in another language,
     as `thien-thach-giay/` and `300-trieu-nam-giay/` will be. For `sachtranh` remind
     them first that the yellow captions are part of the look.
   - The last shot is labelled `kết`. In `giay` the title card shows over it; in
     `sachtranh` it is just the last sentence, as `tien-su-hoat-hinh/` ends (no card
     unless the user asks for one).
   - `const TEMPO = <content.json tempo>;`
   - The user's script sentences are used VERBATIM as lines — never rewritten, trimmed
     or reordered. Split narration into shots; a `mood` per shot from the music
     engine's set (`wonder`, `tense`, `calm`, `battle`, `bright`, `sad`); `hot` words
     for the ones the caption picks out (gold in `giay`, pale cream in `sachtranh`).
   - The story comes from a source video (`sourceVideo` in `content.json`): for
     every sentence, `Read` the frame its `sourceNotes` line names — full size,
     `ffmpeg -v error -y -ss <seconds> -i <video> -frames:v 1 -q:v 2 <jpg>`, into a
     scratch directory outside the repo — BEFORE designing its scene, and build
     the scene on what the source shows there. Do not invent a picture of a thing
     the sentence names when the source spends that sentence on something else: a
     tank drawn for a "liquid hydrogen" sentence that the source spends on a
     close-up of the cold pipe was sent back ("cũng khác nhau"). A departure that
     seems better: say so in the report and offer it, never just do it. The top
     comment of `loi.js` names the video, its author, the passages retold by
     meaning, and that the figures are unchecked.

3. **Write the three files** (`node --check` each; fix until clean, before anything runs):
   - `<folder>/loi.js` — `SHOTS`, TEMPO, SUBS/WIDE per above.
   - `<folder>/anh.js` — the layers with `plate`/`prop`/`puppet` (`giay/sinh.js`).
     Name `pl-*` plates (stored as jpg), `pc-*` props and `pg-*` puppets (png on flat
     magenta); in `sachtranh` the `pg-` prefix is a rule of the engine: every `pg-*`
     piece is glued on the white backing. Sizes are multiples of 16: a plate is
     864x1536 (pass `[1536, 864]` in a wide story), a `prop` 1024x768, a `puppet`
     768x1024; a group of people or a four-legged animal was generated 1024x768.
     Reuse prompts of shared pieces (skies, sea, ground, hut) from the other folders
     so every folder still builds on its own.
     `module.exports.style`: `sachtranh` copies the craft-paper string from
     `tien-su-hoat-hinh/anh.js`; a `giay` story that is not a folk tale sets its own;
     a folk tale leaves it unset (the default look asks for Vietnamese woodblock
     motifs).
     Prompts stay short and concrete: this 4-step model follows the style string
     harder than the picture asked for, and a long list of negations gets painted.
     Say what a thing is like rather than what it is not ("like the frame of half an
     umbrella" gave open ribs where "frame, no cover" gave a flat ring). `plate`
     appends "No people, no animals, no text." itself, `prop` and `puppet` the magenta
     isolation. Known traps, so check for them: an animal described as prehistoric
     needs "four legs" and "not a dinosaur"; a sky plate often comes back as a sheet
     of paper with a pale border; a globe shows today's continents.
     **A real machine, vehicle or animal the story names part by part or shows
     under a label** (an engine, a rocket, a tool): decide here whether the model
     draws it or code does. A 4-step model does not keep or count parts — three
     engine bells for the four the prompt named; a pipe as a string of pearls, in
     three seeds and from a sketch of the source. When a source video draws it,
     the user will hold the picture against that drawing: draw it by code from
     the first version and spend no seeds — `drawn("ve-<name>.js", [w, h])` in
     `anh.js` and a script in the folder that paints it on the same magenta, part
     for part and in units of the thing, measured on full-size frames of the
     source (`ten-lua-elon-musk/ve-co.js`, `ve-sls.js`). Without a source: write
     the prompt with the parts top to bottom and their proportions, read the
     first picture against that list, and switch to `drawn` after ONE failed
     regeneration. Traps of a drawn keyed piece:
       - no colour with more red and blue than green (lilac, pink, purple): the
         page keys out anything with a trace of magenta;
       - the page fills a slit narrower than about 25 px of the canvas with its
         white sticker margin: gaps that must stay dark (between a row of bells)
         are one dark sheet behind the row, not separate dark pieces;
       - the page mounts a cut-out on a white backing 14 px of its canvas larger
         on every side, and `L[name].w/h` is that mounted box: place overlays
         (labels, rings, lines) from it and from a helper that knows where the
         parts are (`SLS` and `rocket(x, yb, cw)` in `ten-lua-elon-musk/canh.js`),
         never from the canvas;
       - a tall thin thing is drawn on a tall canvas (`[768, 3072]` for the
         rocket): a landscape `prop` canvas would leave it a few hundred pixels
         tall.
     For `sachtranh`:
       - a landscape is one whole plate, sky over ground down to the bottom edge,
         with an empty foreground where the captions fall (a sky-only plate left the
         lower third to code, which came out plain and empty); add "No buildings."
         when it must stay empty;
       - people that never move apart may be painted into a plate: write that one as
         a raw object `{ size: [864, 1536], prompt: "… No text." }`, because `plate`
         forbids people;
       - end every puppet prompt with "no shadow under the feet": the model paints a
         grey contact shadow that would be glued onto the white backing.
   - `<folder>/canh.js` — `PLATES`, `CUTS`, a `LEFT` facing table (`LEFT[key] = 1`
     when the generated piece faces left; short camelCase keys, a best guess from
     the prompts that `/soatanh` verifies against the real images), `SCENES` whose
     `draw(ts, i, u, line, v)` covers every shot, then:
     - `giay`: `start({ plates: PLATES, cuts: CUTS, scenes: SCENES, card: [small
       line, big line, third line] })`. A sheet of paper slides across at every
       scene change.
     - `sachtranh`: `start({ plates: PLATES, cuts: CUTS, scenes: SCENES,
       look: "storybook", stickers: CUTS.filter((n) => n.startsWith("pc-")) })`.
       Every scene after the first says how it enters: `cut: "sheet"` (a torn cream
       sheet rising through the frame), `cut: "band"` (a black band wiping in from
       the left) or `cut: "iris", iris: [x, y]` (closing on that point, then opening
       on the new scene); a scene without `cut` is a plain cut. A change is centred
       on the first frame of the scene: it covers the shot before it and uncovers
       the new one after it, in under 0.4 s a side, so what the scene draws in its
       first 0.2 s is still under the cover, and the engine draws it — `canh.js`
       draws no transition of its own.

     Layout — captions cover about 1320–1430 px in a `giay` short and the bottom
     160 px in a wide story; in a `sachtranh` short they are one or two lines of
     yellow text from 1250 to about 1420 px, so standing figures keep their feet on
     one ground line just above (see `G` in `tien-su-hoat-hinh/canh.js`) and what a
     caption or a label names sits between about 640 and 1250 px. Draw puppets in
     front of and below the scenery they must not cover.
     Motion — everything drawn is a function of the time handed to `draw` (no CSS
     animation, no `Date`, no state between frames). `sachtranh` keeps its paper
     alive as `tien-su-hoat-hinh/canh.js` does: a slow push-in on every plate
     (`plate(name, t, total)`), snow, wind, smoke, firelight, cut-outs that walk,
     labels that pop in with the words (`chip(text or [line, line], x, y,
     pop(at, ts), { size, legs, sign })`, the paper label of the look). `snow`,
     `gust`, `smoke`, `glow`, `tuft`, `walk`, `cover` and the flip helper `F` there
     are story-local, not in `giay/may.js`: copy the ones that fit and recolour them.
     The engine offers `P`, `plate`, `sea`, `rays`, `tag`, `chip`, `ring`, `bubble`,
     `shards`, `confetti`, `sparkles`, `tears`, `pop`, `hop`, `sm`, `rnd`, `tall`,
     `ground`, `night`, `jolt`, `space` and `globe`.

4. **Dialogue speakers → `doc.js` VOICES.** Every speaker other than `null` used in
   `loi.js` needs an entry in the `VOICES` table of the root `doc.js` (women/children
   → `NU` with a pitch offset, men → `NAM` with a pitch offset, offsets spread like
   the existing entries). Add ONLY the missing entries, never touch the `""` narrator
   entry, `node --check doc.js`, and say in the report who was added.

5. **Estimated durations.** Write `<folder>/xuat/durs.json` shaped like `SHOTS`:
   `durs[i][j] = Math.round((1100 + 62 * letters(text)) / tempo)` ms, letters counted
   without spaces; a pause line `[who, "", ms]` uses the given ms. Staging needs
   this before the voice exists; `doc.js` overwrites it with real durations later.

6. **Layer manifest + ask.** List every layer from `anh.js` in a Vietnamese table
   (tên lớp | loại pl/pc/pg | kích thước | việc gì trong chuyện) and ask for explicit
   consent — generation takes 20–40 s per layer on an idle machine, minutes on a busy
   one, and the machine is slow meanwhile. On "no", stop after the report; `status`
   stays un-prepared. On "yes":
   `set -a; . ./.env; set +a; node giay/sinh.js <folder> all` — as the ONLY heavy
   job meanwhile (the machine has 24 GB and swaps).

7. **Finish.** `node giay/soat.js <folder>`; if layers are still missing (generation
   died), report which and offer to rerun — rerunning the same command is the
   recovery. When every layer exists, fit the scenes to the real pictures at full
   size: `set -a; . ./.env; set +a; node giay/khung.js <folder> all:0.5` writes one
   still of every shot, mid-narration, to `<folder>/xuat/khung/` (ignored by git;
   it runs on the estimated durations); `Read` them and fix `canh.js` where a
   label, ring or pointer misses its part, a caption or a label covers a figure,
   or a piece is cut by the frame that should be whole. With a source video, put
   each still beside the frame of its sentence (`sourceNotes`, same index). Then
   set `status.step = "chuanbi"`,
   `status.preparedAt = <ISO>`, `status.images = {}`, `status.checkedAt = null`,
   `updatedAt`, and save `content.json` (read it back, change only these fields,
   2-space JSON). Report in Vietnamese: số shot, số lớp ảnh, các nhân vật mới trong
   VOICES, những lớp do mã vẽ (và vì sao), những câu lấy đúng khung hình của video
   nguồn thay vì vẽ thứ câu đó gọi tên, và "bước tiếp theo: /soatanh".
