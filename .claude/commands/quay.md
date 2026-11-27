---
description: Bước 4/4 — giọng đọc, nhạc, bảng kiểm rồi quay video; /quay tiep để ghi tiếp sau khi đã duyệt bảng kiểm
argument-hint: [tiep]
---

Step 4 of the staged video workflow: read `content.json` at the repo root and build
the video — voice, music, contact sheet for review, then the full recording.
Everything you say to the user is Vietnamese. The only argument is `tiep`.

1. **Guards.** `content.json` must exist with `status.preparedAt` AND
   `status.checkedAt` set; otherwise refuse with the remedy ("chạy /chuanbi" or
   "/soatanh trước"). Then check freshness: `node giay/soat.js <folder> --json` and
   compare against `status.images` — every layer must still exist with the SAME
   `mtime` and the layer set must be identical (exit 2 means `anh.js` is broken:
   fix that first). Any drift (an image regenerated, deleted, or `anh.js` edited
   after the check): refuse — "ảnh đã đổi sau lần kiểm, chạy /soatanh lại".

2. **Resume.** `tiep` (or the user answering "tiếp" at the sheet pause) is valid only
   when `status.pausedAt === "sheet"` and the artifact chain is fresh — each file
   newer than what it is made from: `xuat/durs.json` newer than `loi.js`,
   `xuat/am.m4a` newer than `durs.json`, `xuat/kiem.jpg` newer than `am.m4a`,
   `canh.js` and every file in `anh/` (compare mtimes; soat.js lists those of the
   layers). Then skip straight to step 6. Otherwise fall through to the full flow;
   `tiep` with nothing to resume is not an error, just say so and continue.

3. **Voice** — needed when `xuat/durs.json` is missing, or older than `loi.js` or
   `doc.js`, or when `status.readBy` is not the `voice` of `content.json` (the voice
   that read it last time); a fresh narration is kept (one heavy job at a time):
   - `voice=nu` → `node doc.js <folder>`
   - `voice=nam` → `node doc.js <folder> nam`
   - `voice=linh` → `node doc.js <folder> say`
   It needs the network and a few seconds per line (`say` needs no network), and it
   rewrites `xuat/tieng/` and `xuat/durs.json`. edge-tts refuses at random; `doc.js`
   retries and caches every line it got in `xuat/giong-luu/`, so if it still throws,
   just rerun it — do not continue without a complete `xuat/durs.json`. Afterwards
   save `status.readBy = <voice>` in `content.json`.

4. **Music** — every full run (seconds, no network): `music=on` →
   `node giay/nhac.js <folder>`; `music=off` → `node giay/nhac.js <folder> off`
   (the narration alone, levelled the same way). Both stop where the last shot ends,
   half a second after its last word; the recorder adds the 1.5 s more that the last
   frame is held for.

5. **Sheet + pause.** `set -a; . ./.env; set +a; node giay/quay.js <folder> sheet`
   (needs `PLAYWRIGHT_PATH`; if Playwright reports a missing executable, relay the
   CLAUDE.md remedy: reinstall its Chromium build in `~/Library/Caches/ms-playwright`
   or put `CHROME=<path>` in `.env`). `Read` `xuat/kiem.jpg` and describe it in
   Vietnamese — 12 columns per row (6 for a wide story), 3 cells per shot in order
   (shot n owns cells 3n−2, 3n−1, 3n), each cell 216x384 px (384x216 wide). That
   shows the composition of every shot and no more: fine flaws and whether a caption
   is legible cannot be judged there, and the full-size frames are deleted once the
   sheet is tiled, so do not crop cells — look at what is too small in a full-size
   still instead, before the pause. `set -a; . ./.env; set +a; node giay/khung.js
   <folder> <moment>...` writes stills of the page to `<folder>/xuat/khung/`
   (ignored by git): `all:0.5` every shot mid-narration, `label:0.1` and
   `label:0.9` near a shot's ends, `label:+0.5` the first frame of the next shot,
   `label:cut` every recorded frame across the scene change after it, a bare
   number seconds from the start. Take them where things meet —
   a label on its part, a ring, a pointer, a caption under a figure, a piece that
   enters just after the change (a label that would fly across other pieces there
   is faded instead) — and read a detail from a crop with room around it. A flaw
   found here costs a minute; after the recording it costs the recording. Fix
   `canh.js`, then make the sheet again.
   **The scene changes.** A change is motion, centred on the first frame of the
   new scene: it covers the old shot before that frame and uncovers the new one
   after it. One still of it looks right even when it pops or doubles, so take
   `label:cut` for one change of each kind the story uses (`sheet`, `band`,
   `iris`; the label is the shot before the change and the kind is the `cut`
   that the scene of the shot after it declares in `canh.js`), tile the
   frames eight at most to a picture (the command is at the top of
   `giay/khung.js`) and look for one cover and one uncovering, each
   without a frame that jumps, and for the first caption coming in only after
   the cover has passed it. The mean brightness of the frames in order (the
   `signalstats` command at the top of `giay/khung.js`) says the same without
   eyes: one peak for a sheet, one trough for a band or an iris. The engine
   draws the change (`giay/may.js`), not
   `canh.js`: one that doubles is fixed there, once, for every storybook story.
   Optional, if the user wants to see the motion before the recording: from the
   repo root run `python3 -m http.server 8770 --bind 127.0.0.1` in the background
   and open `http://127.0.0.1:8770/giay/trang.html?truyen=<folder>&play` in a
   browser — the page the recorder films, looping the whole story, silent. Stop
   that server before step 6: the recorder starts its own on the same port.
   BEFORE pausing, save `content.json` with `status.step = "quay"` and
   `status.pausedAt = "sheet"` — so `/quay tiep` works even if the session dies.
   Then show the sheet and WAIT for the user's go. On a reject: fix `canh.js` (a
   layer sent back to `/soatanh`), re-sheet, show it again. Nothing is recorded yet.

6. **Record.** On the go (or a valid `tiep`): if `<folder>/<folder>.mp4` exists and
   is worth keeping, copy it into `<folder>/xuat/anh-cu/` first, then `anh-cu-2/`,
   `anh-cu-3/`… (mp4 and srt only) — the recorder overwrites it, and mp4 files are
   outside git, so the repo keeps no copy (`tien-su-hoat-hinh/xuat/toon/` holds the
   cartoon cut that way; git ignores no other file under `xuat/` unless
   `.gitignore` names it, so put nothing else there). Then
   `node giay/quay.js <folder>` — alone, nothing else heavy meanwhile (24 GB machine,
   it swaps). It films the page frame by frame, 25 frames a second (about two
   minutes for a one-minute short), and writes `<folder>/<folder>.mp4` and `.srt`
   (the subtitle timeline, on every run, also for a story without burned-in
   captions). A run that stops at once with an error (a message from the story's
   code, or `missing /<folder>/anh/…`) is a fault in `canh.js` or a layer file: fix
   it and make the sheet again first.

7. **Verify + report.** `ffprobe -v error -show_entries stream=codec_type,duration
   -of csv=p=0 <folder>/<folder>.mp4`: the video is the story length rounded to
   whole frames and the audio is padded to the same length, so the two must agree
   within one frame (0.04 s; the last cut of `tien-su-hoat-hinh/` has 58.52 s and
   58.50 s). A larger mismatch: report it and suggest rerunning just
   `node giay/quay.js <folder>` (voice and music are reused). Then
   `node giay/nhay.js <folder>` (needs no `.env`): it compares every recorded
   frame with the one before and lists each frame that jumps from both its
   neighbours — there must be none where the story has a transition (the first
   four cuts of `ten-lua-elon-musk/` listed 22, two at every sheet and iris
   change) — and prints the steps across the end of every shot, where a change
   reads as steps that rise and fall. Then pull full-size
   frames from the mp4 and look at them — what the sheet could not show:
   `node giay/khung.js <folder> mp4 all:0.5 <moments of step 5>` (needs no `.env`)
   writes the middle of every shot and those moments to `<folder>/xuat/khung/mp4/`,
   under the same names as the stills: compare each with its still, and with the
   source frame of its sentence when the story has one. The mean brightness of
   the difference between a still and its frame (the `blend` command at the top
   of `giay/khung.js`) is 0 to 4 from the encoding alone; far more means the
   frame is not the still's moment — unless the still's time falls between two
   frames (`all:0.5` gives such times) while that picture moves: 5 to 7 then, as
   for shot 2 of `ten-lua-elon-musk-en/` at 12.38 s; render the page at the frame
   times either side (`khung.js <folder> <out dir> 12.36 12.40`) and compare
   again before suspecting the recording. A number in small print is read from the
   full-size frame, never from a tile. Anything wrong there:
   report it with the frames; fixing it costs another recording, so let the user
   decide. Then save `content.json`:
   `status.pausedAt = null`, `status.recordedAt = <ISO>`,
   `status.durationSec = <number>`, `status.step = "xong"`, `updatedAt`. Report in
   Vietnamese: thời lượng thật so với `len` nếu có, đường dẫn mp4 và srt (cả hai ở
   ngoài git), những lỗi hình ảnh còn lại nếu có, từ một video nguồn thì những hình
   do mã vẽ và những câu lấy khung hình của nguồn thay vì vẽ thứ câu đó gọi tên,
   cùng các con số là của video nguồn mà chưa ai kiểm, và nhắc rằng giọng đọc, phát
   âm và nhạc là phần bạn phải tự nghe — Claude không nghe được. Commit only if the
   user asks.
   Sent back after a recording (the user names a picture that does not match its
   source, or a scene change that pops or doubles): a picture goes back to
   `/soatanh` (compared with the source frame, drawn
   by code when the model cannot hold its structure), every scene that places it is
   fitted again in stills; a change that pops or doubles is the engine's
   (`giay/may.js`): fix it there and look at `node giay/khung.js <folder>
   <label>:cut` before the recording. Then this command runs again from step 5 — the voice and
   the music are kept, and the cut being replaced goes to `xuat/anh-cu-N/` first.
   **A new speed for a recorded story** (the user asks what the speed is, then gives
   another one): `tempo` in `content.json` and `TEMPO` in `loi.js` take the new value
   (the range is `/kichban`'s). Before anything is re-timed, pull the old frames —
   `node giay/khung.js <folder> mp4 all:0.5 all:0.98` — into a scratch folder. Step
   3 then needs no network (the lines are cached; `doc.js` only applies `atempo`
   again), and steps 4–7 run again. Before the recording, compare a still at the
   middle and at the end of every shot (`khung.js <folder> all:0.5 all:0.98`) with
   the old frame at the same share, tiled side by side: a label anchored with
   `said()` follows its words, but a length in seconds does not shrink when the read
   gets faster, nor stretch when it gets slower (the price bar of shot 18 in
   `ten-lua-elon-musk/` took 0.9 s to shrink and was done 0.15 s before the sheet
   at 1.5, 0.36 s at 1.2: now 0.7 s; at 1.5 → 1.3 in `ten-lua-elon-musk-en/` the
   bell of shot 11, hung 1.6 s into its line on "steel tubes", was missing for
   1.2 s under its own flame and now comes in with the scene, and a camera creep
   over a fixed span ended too soon), and the captions stay tempo-over-tempo
   less. So look too at the first second of every shot whose first label waits
   for a word, and at the last second of every shot with a move of its own: the
   middle and the end of a shot do not show either. Look at that first second as
   frames 0.04 s apart from the scene's first frame (`khung.js <folder> <out
   dir> <seconds…>`, tiled), in the page and in the recording: a still half a
   second in showed the bell of shot 11 already faded in, and the frames showed
   it missing for the first quarter of a second, under its flame. The voice can
   be checked the same way: `silencedetect` on the mp4 finds one silence per
   line, each from the end of a line's pad to the next line's first word.
   Report the words a minute and
   the shortest captions, and that whether the read is still pleasant is for the
   user's ears.
   **An English cut of a recorded story** (the user asks for "1 bản EN" of a
   folder): its own folder, `<folder>-en/`, and the Vietnamese one stays as approved.
   Copy `anh/`, `anh.js` and the drawing scripts, keep the scenes, translate the lines
   (each keeps the order of its information, so a label still pops on the word it
   names) and the labels in `canh.js`, and set `const VOICE = "en-US-AndrewNeural"` in
   the new `loi.js`. Ask which speed the English cut should read at before recording
   it: the Vietnamese cut's `TEMPO` is not carried over unasked. `ten-lua-elon-musk-en/`
   was first recorded at the 1.5 of `ten-lua-elon-musk/` (about 253 words a minute);
   the user asked for 1.3 (about 220) only after that, on 2026-11-24, and it was
   then recorded again as "a new speed". It has no `content.json` of
   its own: run step 3 on the new folder, then steps 4–7 as they are, but between the
   voice and the sheet do what an English voice needs. Time the labels from its word
   marks — a `HEARD` table and `said()` as `ten-lua-elon-musk-en/canh.js` has them,
   read with edge-tts's Python API (`boundary="WordBoundary"`; the CLI writes sentence
   cues only) — because placed by letters an English label misses its word by up to a
   second. List every caption as the engine chunks it (a copy of `chunks` from
   `giay/may.js` run on `durs.json`): one under about half a second is a flash, and a
   hot phrase split across the two lines of its caption reads badly; both are cured by
   rewording the line, never the engine. A reworded line is fetched again alone, and
   its word marks are read again. Fit every label in stills: English words are longer
   and run off the frame at a Vietnamese position. Take the stills at frame times (a
   multiple of 0.04 s), so that each can be compared with its recorded frame after the
   recording. Report the folder, the voice and the speed, the words a minute, the
   shortest captions, and that how the voice says names and numbers
   is for the user's ears.
