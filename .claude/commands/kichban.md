---
description: Bước 1/4 — nhận kịch bản và cấu hình, ghi content.json
argument-hint: <tệp kịch bản|video|nội dung> <voice-over> [nu|nam|linh] [speed=1.1] [music=on|off] [style=giay|sachtranh|<thư mục chuyện>] [format=doc|ngang] [len=75s] [folder=<slug>]
---

Step 1 of the staged video workflow (`/kichban` → `/chuanbi` → `/soatanh` → `/quay`).
Read the arguments and write `content.json` at the repo root — the single handoff
file the other three commands read. Everything you say to the user is Vietnamese.

Example calls:

```
/kichban kich-ban.md nu speed=1.1 len=75s
/kichban nam Chuyện Tấm Cám: dòng nước mắt của người con gái mất mẹ
/kichban linh music=off style=sachtranh <kịch bản dán trực tiếp>
/kichban <video.mp4> nam style=tien-su-hoat-hinh     (a source video, step 2)
```

1. **Parse the arguments.** The voice-over — the narrator's voice, `nu`, `nam` or
   `linh` (the old words `net` and `local` are accepted as `nu` and `linh`) — is a
   leading argument, not a setting buried in the table. It may be a bare token among
   the switches or the `voice=` switch. Two shapes occur:
   - `/kichban <tệp kịch bản> <voice-over> [switches]` — the FIRST token names an
     existing file: that file is the script; parse the remaining tokens as the
     voice-over and the switches.
   - `/kichban <voice-over> <nội dung...> [switches]` — inline text: walk the leading
     tokens (`key=value` switches and at most one bare voice token); the first token
     that is neither ends them, and everything from there on, joined by spaces, is
     the script argument (the whole rest of the line — it is prose, never switches).
   The voice defaults to `nu`; say the applied value in the report. A bare voice
   token matches lowercase-exact and only while switches are still expected.
   Match each switch against the table — exactly one action per key; obvious
   synonyms are fine (`wide`/`ngang`, `1`/`on`, `0`/`không`/`off`, `nhac`/`music`,
   `tocdo`/`speed`, `paper`/`giay`, `sach-tranh`/`storybook`/`sachtranh`,
   `kieu`/`style`). An unknown key or an out-of-range value: stop and ask the user,
   never guess. `style=hoathinh` (also `toon`, `cartoon`) is an out-of-range value:
   the engine has no cartoon look any more (`giay/may.js` knows its default look and
   `storybook` only), so say that in Vietnamese and ask for `giay` or `sachtranh`.
   Every key is optional except the script.

   | Key | Values | Default | Action |
   |---|---|---|---|
   | voice | `nu` / `nam` / `linh` | `nu` | The voice-over: `nu` → Hoài My narrates, `nam` → Nam Minh, `linh` → the local macOS "Linh". Same as the bare token. |
   | speed | `0.5` – `2.0` | `1.0` | Stored as `tempo` (the `loi.js` `TEMPO` vocabulary); the range is what every build of ffmpeg's `atempo` takes. Up to `1.3` reads as brisk. Above it the read is very fast and the captions stay little on screen (the crossfade between two captions alone takes 0.28 s of each: at `1.5`, 13 of the 73 captions of `ten-lua-elon-musk/` are gone in under 0.8 s, 4 at `1.2`): keep the value the user gives, and say this in the report. |
   | music | `on` / `off` | `on` | `on` → pentatonic bed under the narration; `off` → narration only. |
   | style | `giay` / `sachtranh` | `giay` | The look. Both are paper-cut and both name the folder `-giay`. `giay` is the woodblock paper-cut of the folk tales (`an-khe-giay/`): warm flat colours, white captions with a dark stroke, a title card over the last shot. `sachtranh` is the storybook paper-cut of `tien-su-hoat-hinh/`: layered craft paper, people and animals as cut-outs glued on white paper, yellow Montserrat captions, torn sheets / black bands / an iris between the scenes. An existing story folder is a value too (`style=tien-su-hoat-hinh`, or "theo phong cách của …" in a plain request): take the look that folder was built with and record the folder in `pattern`. |
   | format | `doc` / `ngang` | `doc` | `doc` → 1080x1920, one short sentence per shot. `ngang` → 1920x1080, several sentences per shot. `ngang` with `sachtranh` has not been made yet: say so in the report. |
   | len | `60s` / `2m30s` / `9m` | none | Duration target: advisory only, sizes nothing by itself. Never read a clock mark aloud or show it as a label. |
   | folder | `<slug>` | derived | Story folder name; slugify (ASCII, no diacritics) and append `-giay` if missing. A folder that already exists keeps the name it has, whatever its suffix. |

2. **Resolve the script.** The script argument from either shape above: if it is a
   single token naming an existing file (`test -f`), read that file; otherwise the
   argument is the script text itself. A token that looks like a path (contains `/`
   or ends in `.txt`/`.md`) but does not exist: stop and ask — never silently use it
   as a one-line story. The script is stored and later used VERBATIM: never rewrite,
   trim or reorder its sentences.

   **A video as the source.** When the first token names an existing `.mp4`, `.mov`
   or `.webm` (or the user asks to "xem <video> và dựng video"), the script comes
   from that video. Work in a scratch directory outside the repo
   (`/tmp/<story>-nguon/`): nothing of the source is committed.
   - Read it frame by frame: `ffmpeg -v error -i <video> -vf "fps=1:round=up,scale=360:-2"
     -q:v 3 <dir>/f%04d.jpg` gives one frame a second (`f0012` is the frame at
     second 11, the same one `-ss 11` pulls); the same with `,tile=4x4` added to
     the filter gives sheets of 16 frames to `Read` (sheet `to-02` begins at
     second 16); `ffmpeg -v error -y -ss <seconds> -i <video> -frames:v 1 -q:v 2
     <jpg>` gives one frame at full size where a sheet cannot be read.
   - The script is the video's own text, sentence by sentence: its burned-in
     captions, or text the user supplies when it has none (speech cannot be
     transcribed here: ask). Default: RETELL each sentence in other words, keeping
     its facts, figures, names and order — another channel's sentences are not ours
     to publish; a verbatim transcript only when the user asks for one. Say in the
     report which was done. A passage that cannot be read with certainty is retold
     by meaning and listed in the report.
   - A figure that looks wrong (a number contradicting the sentence): look at the
     frames around it before calling it a slip; it may be one frame of an animation
     (a thermometer counting down through "−1°C").
   - `sourceNotes`: one line per sentence of the script, in its order —
     `<mm:ss> — what is on the screen`, in English (labels, parts, zoom). It is
     the picture each scene is built on (`/chuanbi`, `/soatanh`), so write what is
     on the screen, not what the sentence is about.
   - Every figure is the video's and nobody has checked it: `scriptSource` names
     the video, its author and the retelling, and the report says so.

3. **Derive `folder`.** From `folder=` if given, else pick a 2–4 syllable ASCII slug
   from the story's title (no diacritics), appended with `-giay` for either style. If
   that folder already exists on disk, ask: a new slug, or reuse (reusing means
   rebuilding an existing story — warn what that means). A source video that lies
   in a folder of its own (not the repo root): that folder is the story folder, as
   it is named — the video stays beside the story's files, and git ignores `*.mp4`.

4. **Overwrite guard.** If `content.json` already exists, show the user its `folder`,
   `status.step` and `updatedAt` and ask before overwriting — a story may be in
   flight. Only an explicit yes proceeds.

5. **Sanity estimate.** Estimate the narration length: for every sentence
   `(1100 + 62 * letters) ms` with the letters counted without spaces, divided by
   `tempo`; plus 500 ms per shot; plus 1.5 s for the held last frame. The script's
   last sentence becomes the `kết` shot and needs no extra time (a title card shows
   over it). The formula ran about 8 % short of the real read on
   `tien-su-hoat-hinh/` (53.8 s against 58.5 s), so treat it as a rough figure. If
   `len` was given and the estimate is off by more than ~1.5x either way, say so in
   the report. Advisory only — never edit the script to fit.

6. **Write `content.json`** (repo root, 2-space JSON, ends with a newline):

   ```json
   {
     "version": 1,
     "folder": "<slug>", "style": "<giay|sachtranh>", "format": "<doc|ngang>",
     "tempo": <number>, "music": "<on|off>", "voice": "<nu|nam|linh>", "len": "<value|null>",
     "script": "<verbatim>", "scriptSource": "<inline|the file path|the source video, its author and the retelling>",
     "sourceVideo": "<path|null>", "sourceNotes": ["<mm:ss> — what the screen shows, one line per script sentence>"],
     "pattern": "<story folder whose look is taken|null>",
     "createdAt": "<ISO>", "updatedAt": "<ISO>",
     "status": { "step": "kichban", "pausedAt": null, "preparedAt": null,
                 "checkedAt": null, "readBy": null, "recordedAt": null,
                 "durationSec": null, "images": {} }
   }
   ```

   `status.readBy` stays `null` here: `/quay` fills in the voice that read the story.

7. **Report in Vietnamese:** the switches applied (and their defaults) — for `style`
   say which look was taken and name the other one in a few words — the derived
   folder, the script's word count, the estimate vs `len` if given. For a video
   source: the video and its author, that the script retells it in other words
   (the default) or is a verbatim transcript, the passages retold by meaning, and
   that every figure is the video's and unchecked; for `style=<folder>`: which
   folder's look was taken. Then "bước tiếp theo: /chuanbi". Do not run any
   pipeline command — preparation is `/chuanbi`'s job, and the user reviews first.
