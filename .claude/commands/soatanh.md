---
description: Bước 3/4 — kiểm tra mọi lớp ảnh đã sinh (kích thước + xem tranh), ghi trạng thái đạt/lỗi
argument-hint: (không đối số)
---

Step 3 of the staged video workflow: read `content.json` at the repo root and check
EVERY generated layer of its story folder — first the cheap facts, then your own
eyes. The output is a per-image pass/fail status the user reviews before `/quay`.
Everything you say to the user is Vietnamese. No arguments.

1. **Guard.** `content.json` must exist and `status.preparedAt` be set; otherwise
   refuse: "chưa chuẩn bị ảnh, chạy /chuanbi trước". Never infer state from disk.

2. **Programmatic pre-pass.** From the repo root run
   `node giay/soat.js <folder> --json` (needs no `.env`): one line of JSON with
   `layers` keyed by layer name, each `{ file, exists, expected, actual, mtime, ok,
   problems, warns }` (`actual` is the pixel size, `null` when the file is missing;
   `mtime` in ms). Exit 0 every layer present and of the size `anh.js` asks for,
   1 some layer missing or of another size, 2 `anh.js` itself is broken or absent —
   fix that first (it is a code error, not an image problem). An entry in `warns`
   alone (a stray `.png` beside a plate's `.jpg`) is not a failure.

3. **Visual pass — look at every picture.** `Read` each
   `<folder>/anh/<name>.<ext>` and judge it against its prompt in `anh.js` plus
   the known failure modes (CLAUDE.md and here):
   - a sky plate come back as "a sheet of paper with a pale border";
   - a slim standing puppet far taller than wide ones at the same width;
   - a prehistoric animal on two legs when it should have four;
   - text or extra objects the prompt excluded;
   - a magenta background that is not flat (texture, gradient, shadow) — it will key
     badly;
   - a figure cropped at the frame edges (head or feet cut off);
   - a machine whose parts do not sit where they do on the real thing, or on the
     drawing the story comes from (the user checks this at once: "không giống với
     cấu trúc"). With a source video (`sourceVideo` in `content.json`) pass EVERY
     cut-out of a real thing — machine, vehicle, animal, plant, generated or
     `drawn` — against the source frame in ONE pass, before any scene is fitted:
     the source frame at full size (`ffmpeg -v error -y -ss <seconds> -i <video>
     -frames:v 1`) beside the picture, part for part, and COUNT the parts — a
     number of parts is part of the structure (a rocket with three engine bells
     for the four the voice names was found only after a third recording). Not
     only the pieces the story labels or the user has named. Write the comparison
     into the note ("đủ bốn vòi phun, hai tên lửa đẩy hai bên thân cam…").
     Without a source: against the parts its prompt lists.

   The storybook look (`look: "storybook"` in `canh.js`, `style=sachtranh`) adds:
   - a landscape plate that is sky only — no ground down to the bottom edge — or
     with no empty foreground for the captions to fall on;
   - a plate with people painted in showing the wrong people (three bearded adults
     for a family), or a person in a plate that should be empty;
   - a grey contact shadow under a puppet's feet: it would be glued onto the white
     backing with the figure;
   - not a failure: the dark magenta halo the model paints tight against a piece.
     It is dropped for the mounted pieces (`pg-*` and the `stickers` of `start`);
     on an unmounted piece it stays as a dark rim, so there it counts.

   **Scenes at full size.** The layers are half of what the user sees; every scene
   is judged against the source as well. `set -a; . ./.env; set +a; node
   giay/khung.js <folder> all:0.5` writes one still of every shot, mid-narration,
   to `<folder>/xuat/khung/` (ignored by git); `Read` them. Look for a label,
   ring or pointer that misses its part; a caption or a label over a figure; a
   piece cut by the frame that should be whole; text clipped or too small; a
   mounted piece with a slit in it filled white. With a source video, put each
   still beside the source frame of its sentence (`sourceNotes`, same index in a
   `doc` story). One pair is one command —
   `ffmpeg -v error -y -i <frame> -i <still> -filter_complex "[0]scale=540:960[a];[1]scale=540:960[b];[a][b]hstack" <png>`
   — and four pairs in one image (`hstack=inputs=4`) find the shots that differ;
   look at those alone. Check that the scene shows what the source shows there:
   the user does exactly this ("quá khác nhau", "cũng khác nhau"). Read a detail
   from a crop with room around it, never from one without. Fix `canh.js` and
   retake only the shots that changed (`node giay/khung.js <folder>
   <label>:<fraction>…`). A flaw found here costs a minute; after the recording
   it costs the recording.

4. **Facing vs the `LEFT` table.** Read `<folder>/canh.js`: `LEFT` keys are short
   camelCase names, not layer names — map each `pg-<x>` layer to its key. For every
   puppet/prop whose facing matters in a scene, check the picture against the table
   and fix `LEFT` in place where wrong (`node --check canh.js` after). A `LEFT` fix
   does not invalidate the image checks.

5. **Report + status.** A Vietnamese table `lớp | đạt/lỗi | vấn đề` covering both
   passes; name the pieces drawn by code, and — from a source video — the
   sentences whose scene follows the source's picture instead of a thing the
   sentence names, and the figures, which are the video's and unchecked. Then
   write `content.json`: for EVERY layer a `status.images` entry
   `{ ok, note: "<ngắn gọn tiếng Việt>", seed: <the seed it was generated with, 7
   unless it was regenerated; left out for a `drawn` layer>, mtime: <from soat.js>, checkedAt: <ISO> }`, plus
   `status.checkedAt = <ISO>`, `status.step = "soatanh"`, `updatedAt` (read it back,
   change only these fields).

6. **Offer regeneration.** For each failed layer, offer
   `set -a; . ./.env; set +a; node giay/sinh.js <folder> <name>:<seed + 1>` — one at
   a time, as the only heavy job. `<name>` with no seed repeats seed 7, the picture
   of the first run when the prompt is unchanged: a new seed, or a changed prompt,
   is what asks for another picture — when the picture shows the prompt said the
   wrong thing, fix the prompt in `anh.js` first. `sinh.js` deletes the old file
   before it generates, so a run that fails leaves the layer missing: say so. After
   each regeneration: rerun `node giay/soat.js <folder> --json`, visually re-Read
   just that file, update its `status.images` entry and `checkedAt`. A piece drawn
   or redrawn by code (`drawn`) is made with `set -a; . ./.env; set +a; node
   giay/sinh.js <folder> <name>`, which runs its script again: compare it with the
   source frame as in step 3, and write its entry without a seed. A regenerated
   or redrawn piece has new proportions: every scene that places it must be
   measured and fitted again in `canh.js`, and looked at in the stills of step 3,
   before `/quay`. Iterate until the user stops or all pass. End with "bước tiếp
   theo: /quay".
