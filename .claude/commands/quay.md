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
   `mtime` and the layer set must be identical. Any drift (an image regenerated,
   deleted, or `anh.js` edited after the check): refuse — "ảnh đã đổi sau lần kiểm,
   chạy /soatanh lại".

2. **Resume.** `tiep` (or the user answering "tiếp" at the sheet pause) is valid only
   when `status.pausedAt === "sheet"` and the artifact chain is fresh — `xuat/durs.json`
   newer than `loi.js`, `xuat/am.m4a` newer than `durs.json`, `xuat/kiem.jpg` newer
   than `am.m4a`. Then skip straight to step 6. Otherwise fall through to the full
   flow; `tiep` with nothing to resume is not an error, just say so and continue.

3. **Voice** (one heavy job at a time):
   - `voice=nu` → `node doc.js <folder>`
   - `voice=nam` → `node doc.js <folder> nam`
   - `voice=linh` → `node doc.js <folder> say`
   edge-tts refuses at random; `doc.js` retries and caches every line it got in
   `xuat/giong-luu/`, so if it still throws, just rerun it — do not continue without
   a complete `xuat/durs.json`.

4. **Music.** `music=on` → `node giay/nhac.js <folder>`; `music=off` →
   `node giay/nhac.js <folder> off`. Needs the fresh `durs.json` from step 3.

5. **Sheet + pause.** `set -a; . ./.env; set +a; node giay/quay.js <folder> sheet`
   (needs `PLAYWRIGHT_PATH`; if Playwright reports a missing executable, relay the
   CLAUDE.md remedy: reinstall its Chromium build in `~/Library/Caches/ms-playwright`
   or put `CHROME=<path>` in `.env`). `Read` `xuat/kiem.jpg` and describe it in
   Vietnamese — the sheet is 12 columns per row (6 for a wide story), 3 cells per shot
   in order: shot n owns cells 3n−2, 3n−1, 3n; crop a suspect cell with ffmpeg and
   inspect it before judging. BEFORE pausing, save `content.json` with
   `status.step = "quay"` and `status.pausedAt = "sheet"` — so `/quay tiep` works even
   if the session dies. Then show the sheet and WAIT for the user's go. On a reject:
   fix `canh.js`, re-sheet, show it again. Nothing is recorded yet.

6. **Record.** On the go (or a valid `tiep`): `node giay/quay.js <folder>` — alone,
   nothing else heavy meanwhile (24 GB machine, it swaps). It writes
   `<folder>/<folder>.mp4` and `.srt`.

7. **Verify + report.** `ffprobe -v error -show_entries format=duration -of
   default=nw=1 <folder>/<folder>.mp4` and the per-stream durations: video and audio
   must match. A mismatch: report it and suggest rerunning just
   `node giay/quay.js <folder>` (voice and music are reused). Then save
   `content.json`: `status.pausedAt = null`, `status.recordedAt = <ISO>`,
   `status.durationSec = <number>`, `status.step = "xong"`, `updatedAt`. Report in
   Vietnamese: thời lượng thật so với `len` nếu có, đường dẫn mp4 và srt (cả hai ở
   ngoài git), và nhắc rằng giọng đọc, phát âm và nhạc là phần bạn phải tự nghe —
   Claude không nghe được. Commit only if the user asks.
