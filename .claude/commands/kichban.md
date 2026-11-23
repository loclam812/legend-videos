---
description: Bước 1/4 — nhận kịch bản và cấu hình, ghi content.json
argument-hint: <tệp kịch bản|nội dung> <voice-over> [nu|nam|linh] [speed=1.1] [music=on|off] [style=giay|hoathinh] [format=doc|ngang] [len=75s] [folder=<slug>]
---

Step 1 of the staged video workflow (`/kichban` → `/chuanbi` → `/soatanh` → `/quay`).
Read the arguments and write `content.json` at the repo root — the single handoff
file the other three commands read. Everything you say to the user is Vietnamese.

Example calls:

```
/kichban kichban/tem-thuy.md nu speed=1.1 len=75s
/kichban nam Chuyện Tấm Cám: dòng nước mắt của người con gái mất mẹ
/kichban linh music=off <kịch bản dán trực tiếp>
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
   `tocdo`/`speed`, `paper`/`giay`, `toon`/`cartoon`/`hoathinh`, `kieu`/`style`).
   An unknown key or an out-of-range value: stop and ask the user, never guess.
   Every key is optional except the script.

   | Key | Values | Default | Action |
   |---|---|---|---|
   | voice | `nu` / `nam` / `linh` | `nu` | The voice-over: `nu` → Hoài My narrates, `nam` → Nam Minh, `linh` → the local macOS "Linh". Same as the bare token. |
   | speed | `0.9` – `1.3` | `1.0` | Stored as `tempo` (the `loi.js` `TEMPO` vocabulary). |
   | music | `on` / `off` | `on` | `on` → pentatonic bed under the narration; `off` → narration only. |
   | style | `giay` / `hoathinh` | `giay` | The look: paper-cut vs the flat 2D stick-figure cartoon; decides the folder suffix. |
   | format | `doc` / `ngang` | `doc` | `doc` → 1080x1920, one short sentence per shot. `ngang` → 1920x1080, several sentences per shot. |
   | len | `60s` / `2m30s` / `9m` | none | Duration target: advisory only, sizes nothing by itself. Never read a clock mark aloud or show it as a label. |
   | folder | `<slug>` | derived | Story folder name; slugify (ASCII, no diacritics) and append `-giay`/`-hoathinh` if missing. |

2. **Resolve the script.** The script argument from either shape above: if it is a
   single token naming an existing file (`test -f`), read that file; otherwise the
   argument is the script text itself. A token that looks like a path (contains `/`
   or ends in `.txt`/`.md`) but does not exist: stop and ask — never silently use it
   as a one-line story. The script is stored and later used VERBATIM: never rewrite,
   trim or reorder its sentences.

3. **Derive `folder`.** From `folder=` if given, else pick a 2–4 syllable ASCII slug
   from the story's title (no diacritics), appended with `-giay` or `-hoathinh` per
   `style`. If that folder already exists on disk, ask: a new slug, or reuse (reusing
   means rebuilding an existing story — warn what that means).

4. **Overwrite guard.** If `content.json` already exists, show the user its `folder`,
   `status.step` and `updatedAt` and ask before overwriting — a story may be in
   flight. Only an explicit yes proceeds.

5. **Sanity estimate.** Estimate the narration length: for every sentence
   `1100 + 62 * letters` ms, plus 500 ms per shot, plus a `kết` card shot. If `len`
   was given and the estimate is off by more than ~1.5x either way, say so in the
   report. Advisory only — never edit the script to fit.

6. **Write `content.json`** (repo root, 2-space JSON, ends with a newline):

   ```json
   {
     "version": 1,
     "folder": "<slug>", "style": "<giay|hoathinh>", "format": "<doc|ngang>",
     "tempo": <number>, "music": "<on|off>", "voice": "<nu|nam|linh>", "len": "<value|null>",
     "script": "<verbatim>", "scriptSource": "<inline|the file path>",
     "createdAt": "<ISO>", "updatedAt": "<ISO>",
     "status": { "step": "kichban", "pausedAt": null, "preparedAt": null,
                 "checkedAt": null, "recordedAt": null, "durationSec": null, "images": {} }
   }
   ```

7. **Report in Vietnamese:** the switches applied (and their defaults), the derived
   folder, the script's word count, the estimate vs `len` if given, then
   "bước tiếp theo: /chuanbi". Do not run any pipeline command — preparation is
   `/chuanbi`'s job, and the user reviews first.
