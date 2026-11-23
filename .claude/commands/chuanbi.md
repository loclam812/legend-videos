---
description: Bước 2/4 — phân tích kịch bản trong content.json, tạo thư mục chuyện và sinh ảnh
argument-hint: (không đối số)
---

Step 2 of the staged video workflow: read `content.json` at the repo root, analyse the
WHOLE script, create the story folder, then generate the layers (with the user's
consent first). Everything you say to the user is Vietnamese. No arguments.

1. **Guard.** No `content.json` → refuse: "chưa có kịch bản, chạy /kichban trước".
   Never infer state from the filesystem. If `status.preparedAt` is set and the folder
   exists, ask which the user wants:
   - **resume** — keep `loi.js`/`anh.js`/`canh.js` as they are and only generate the
     layers still missing (this is also the recovery when `sinh.js` died mid-run:
     `all` only ever generates files that do not exist yet);
   - **rebuild** — analyse `content.json.script` again and rewrite the three files
     (warn: any manual fixes inside them are lost).
   If `loi.js` on disk is newer than `status.preparedAt`, prefer asking — someone
   edited it by hand.

2. **Analyse the whole script → design the shots.** Read every sentence before
   writing anything. Follow an existing folder as the pattern: `an-khe-giay/` for
   `style=giay`, `100-nghin-nam-hoathinh/` for `style=hoathinh`.
   - `format=doc`: one short sentence per shot, `const SUBS = false;`.
   - `format=ngang`: `const WIDE = true;`, several sentences per shot.
   - The last shot is labelled `kết` and shows the title card.
   - `const TEMPO = <content.json tempo>;`
   - The user's script sentences are used VERBATIM as lines — never rewritten, trimmed
     or reordered. Split narration into shots; a `mood` per shot from the music
     engine's set (`wonder`, `tense`, `calm`, `battle`, `bright`, `sad`); `hot` words
     for the gold highlights.

3. **Write the three files** (`node --check` each; fix until clean, before anything runs):
   - `<folder>/loi.js` — `SHOTS`, TEMPO, SUBS/WIDE per above.
   - `<folder>/anh.js` — the layers with `plate`/`prop`/`puppet`; `module.exports.style`
     for any non-folk look (always for `hoathinh`). Name `pl-*` plates, `pc-*` props,
     `pg-*` puppets; reuse prompts of shared pieces (skies, sea, ground, hut) from the
     other folders so every folder still builds on its own. Mind the known prompt
     traps: an animal described as prehistoric needs "four legs" and "not a dinosaur".
   - `<folder>/canh.js` — `PLATES`, `CUTS`, a `LEFT` facing table (best guess from the
     prompts — `/soatanh` verifies it against the real images), `SCENES` whose
     `draw(ts, i, u, line, v)` covers every shot, and
     `start({ plates, cuts, scenes, card, look: "toon" })` (the `look` only for
     `hoathinh`). Captions sit at about 1320–1430 px in a short, the bottom 160 px in
     a wide story; draw puppets in front of and below the scenery they must not cover.

4. **Dialogue speakers → `doc.js` VOICES.** Every speaker other than `null` used in
   `loi.js` needs an entry in the `VOICES` table of the root `doc.js` (women/children
   → `NU` with a pitch offset, men → `NAM` with a pitch offset, offsets spread like
   the existing entries). Add ONLY the missing entries, never touch the `""` narrator
   entry, `node --check doc.js`, and say in the report who was added.

5. **Estimated durations.** Write `<folder>/xuat/durs.json` shaped like `SHOTS`:
   `durs[i][j] = 1100 + 62 * letters(text)` ms per line; a pause line `[who, "", ms]`
   uses the given ms. Staging needs this before the voice exists; `doc.js` overwrites
   it with real durations later.

6. **Layer manifest + ask.** List every layer from `anh.js` in a Vietnamese table
   (tên lớp | loại pl/pc/pg | kích thước | việc gì trong chuyện) and ask for explicit
   consent — generation takes 20–40 s per layer on an idle machine, minutes on a busy
   one, and the machine is slow meanwhile. On "no", stop after the report; `status`
   stays un-prepared. On "yes":
   `set -a; . ./.env; set +a; node giay/sinh.js <folder> all` — as the ONLY heavy
   job meanwhile (the machine has 24 GB and swaps).

7. **Finish.** `node giay/soat.js <folder>`; if layers are still missing (generation
   died), report which and offer to rerun — rerunning the same command is the
   recovery. When every layer exists: set `status.step = "chuanbi"`,
   `status.preparedAt = <ISO>`, `status.images = {}`, `status.checkedAt = null`,
   `updatedAt`, and save `content.json` (read it back, change only these fields,
   2-space JSON). Report in Vietnamese: số shot, số lớp ảnh, các nhân vật mới trong
   VOICES, và "bước tiếp theo: /soatanh".
