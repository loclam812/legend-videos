# Legend videos

Animated Vietnamese folk tales for YouTube. Every frame is SVG drawn by code and every export
uses free tools only: no paid image, video or voice service. Each story is one folder that holds
its own copy of the engine.

| Folder | Story | Output |
|---|---|---|
| `mai-an-tiem-video/` | Mai An Tiêm (the watermelon legend), 19 shots | `su-tich-dua-hau.mp4` |
| `son-tinh-thuy-tinh-video/` | Sơn Tinh Thủy Tinh, 12 shots | `son-tinh-thuy-tinh.mp4` |
| `thanh-giong-video/` | Thánh Gióng, 12 shots | `thanh-giong.mp4` |

Talk to the user in Vietnamese. Narration and on-screen text are Vietnamese. Code, comments and
commit messages are English.

## Files in a story folder

- `index.html`: page shell, CSS keyframes, shared SVG `<defs>`, playback controls.
- `helpers.js`: palette constants (`INK`, `SKIN`, `DARK`), the `SHOTS` array, scenery builders
  (`sky`, `sea`, `beach`, `hills`, `house`, `palm`, `boat`, `fire`, `dongson`, ...).
- `people.js`: the jointed character rig `person(o)` and one constant per character.
- `shots-a.js`, `shots-b.js`: story-specific builders and the shots. `shots-b.js` ends with the
  transition table.
- `player.js`: builds the scenes, runs the schedule, moves the camera.
- `kiem-tra.html`: contact sheet of every shot, for visual checks.
- `xuat/quay.js`, `xuat/ghep.js`: record and mux. Everything else under `xuat/` is generated
  and ignored by git.

Shared scripts at the repo root: `doc.js` (narration), `nhac.js` (music and sound effects),
`kiem.js` (contact sheet), `bia.js` (thumbnail), `xuat.sh` (runs the whole export).

## Visual style

Keep these the same in every story so the videos read as one series.

- Canvas is `viewBox 0 0 1600 900`. The ground line sits near y 560 to 700.
- Flat cut-out shapes with a dark brown outline: always `${I(w)}`, never a hand-written stroke.
- Depth comes from the shared defs `#fadeDown`, `#glow`, `#vignette` and `#grain`, plus
  `shadow()` under anything that stands on the ground.
- Đông Sơn drum motifs (`dongson()`) mark royal and ritual places.
- One fixed tunic and trim colour per character, plus a hat or hair shape that reads at small
  size. Non-human characters get their own skin through `tone`.

## Shots

```js
SHOTS.push({
  label: "8",
  art: sky(...) + hills(...) + ST({ x: 600, y: 700, s: 1.2 }),
  cam: [[800, 450, 1], [800, 540, 1.3]],
  lines: [[null, "Narration."], ["Sơn Tinh", "Dialogue."]],
});
```

- `cam` is a list of `[centreX, centreY, zoom]` stops. The camera eases between them over the
  length of the shot.
- `lines` is `[speaker, text]`. `null` is the narrator. One sentence per line. The player shows
  it one caption line at a time (`chunks()` in `player.js`), breaking after punctuation, each
  part timed by its share of the line's letters.
- `mood` picks the music: `calm`, `bright`, `sad`, `tense`, `battle` or `wonder`. Neighbouring
  shots with the same mood share one unbroken piece. A shot without `mood` is silent under the voice.
- `sfx` is `[[seconds, name, duration]]`, timed from the start of the shot: `chime`, `pop`, `drum`,
  `gong`, `whoosh`, `whack`, `horn`, `hooves`, `march`, `fire`, `rain`, `thunder`. Add a cue only
  for something the picture shows at that moment, and set its time from `xuat/durs.json`.
- A line `[null, "", 3500]` is a silent hold of that many milliseconds.
- `titleShot(title, skyTop, skyBottom)` and `endShot(skyTop, skyBottom)` in `helpers.js` make the
  opening and closing cards. The last two lines of `shots-b.js` add them, after the transition
  table, so the table still lists story shots only.
- A speaker's mouth moves only when the name matches the character's `name` **and** the
  `[data-talk=...]` selectors near line 66 of `index.html` list that name. A new character
  needs a new selector there.
- Transitions are one entry per shot in the table at the end of `shots-b.js`: `fade`, `slide`,
  `zoom` or `black`. Use `black` for a jump in time or place, `slide` for continuous action,
  `zoom` for a reveal, `fade` otherwise. The table length must equal the number of shots.

## Characters

`person(o)` takes `x, y, s, flip, tunic, trim, long, hair, mood, beard, crown, hat, tone, extra,
name` for the look and `aL, aR, wL, wR, hL, hR, nod, lean, body, walk` for the pose and motion.

- `aL` / `aR` are hand positions relative to the character.
- Swings (`wL`, `wR`, `nod`, `lean`) are `[degrees, seconds, delay]`.
- `walk` is `[dx, seconds, delay, dy]`.
- Every character in a shot gets at least one motion. A still figure looks like a broken frame.
- The main picture never sits unchanged for more than about 2.5 seconds. A camera move or a new
  caption does not count: something in the scene has to act.
- Keep the whole figure inside the frame at every camera stop. A character at scale `s` is
  about `300 * s` tall above its `y`, so a figure on a mountain top is cut off first.

## Export to mp4

Needs `node`, `ffmpeg`, Playwright with Chromium and `edge-tts`. The fallback voice is the macOS
"Linh (Enhanced)" (System Settings, Accessibility, Spoken Content, System Voice, Manage Voices,
Vietnamese).

One command from the repo root does all of it:

```bash
./xuat.sh <story-folder>
```

It takes about twice the length of the video. Playwright is not installed in this repo: put
`PLAYWRIGHT_PATH=<path-to>/node_modules/playwright` in a `.env` file at the repo root (ignored
by git) and `xuat.sh` loads it.

The script runs these steps, each reading what the one before wrote:

1. `node doc.js <story-folder>` reads every line and writes `xuat/durs.json`. Line lengths drive
   the whole schedule. The narrator and women are `vi-VN-HoaiMyNeural`, men are
   `vi-VN-NamMinhNeural`, each character with its own pitch in the `VOICES` table of `doc.js`.
   These come from `.venv/bin/edge-tts` (`pip install edge-tts` in a venv at the repo root).
2. `node nhac.js <story-folder>` computes the music and effects into `xuat/nen.wav`. Nothing is
   sampled or downloaded, so there is no licence to track.
3. It serves the story folder on port 8765 and stops the server when it exits. It refuses to
   run if the port is already taken, because the other server would serve the wrong story.
4. `xuat/quay.js` records the page in real time.
5. `xuat/ghep.js` writes the mp4 next to the story folder's `index.html` at 1280x720, 30 fps. The
   music ducks under the voice and the mix is levelled to about -15 LUFS.
6. `node kiem.js <story-folder>` writes `xuat/khung-hinh.jpg`: the middle and last frame of
   every shot. Look at it before calling the export done.

After a change to `mood` or `sfx` only, skip the recording: run `node nhac.js <story-folder>` and
`node <story-folder>/xuat/ghep.js`.

Thumbnail: `node bia.js <story-folder> <seconds> "<TITLE>" "<small line>"` writes `bia.jpg`
(1280x720) from that frame. Pick a frame whose characters stand in the lower half, because the
title covers the top.

The output name is hard-coded on the `const out` line of each `ghep.js`. Change it when copying
the folder for a new story.

## Checking the result

Nobody can judge the picture from the code, so look at it.

- Before recording: serve the folder and screenshot `kiem-tra.html`. Check each shot for cut-off
  figures, objects floating above the ground and overlapping characters. `index.html?shot=N`
  shows one shot. `file:` URLs are blocked in the Playwright MCP browser, hence the server.
- `kiem-tra.html` has the shot count hard-coded. Update it when shots are added or removed.
- After export: read `xuat/khung-hinh.jpg`, and compare the video and audio stream lengths with
  `ffprobe`. The video runs about 2.8 s longer than the audio (the closing hold); any other gap
  means picture and voice have drifted.
- Claude cannot hear. Voice quality and mispronounced words are for the user to check, and the
  report must say so.

## Starting a new story

1. Copy the most recent story folder. Delete its `xuat/tieng`, `xuat/hinh`, `xuat/durs.json`,
   `xuat/quay.json` and the old mp4.
2. Replace the character constants, the shots and the transition table.
3. Update the `[data-talk]` selectors in `index.html`, the shot count in `kiem-tra.html`, the
   output name in `xuat/ghep.js`, and add the speakers to `VOICES` in `doc.js`.
4. Add the story to the table at the top of this file.

## Known traps

- **The online voices refuse requests at random.** edge-tts is an unofficial free endpoint and
  answers `NoAudioReceived` in bursts: on 2026-11-13 one run got 7 of 60 lines in 20 minutes, a
  later one read 28 lines in 20 minutes. `doc.js` waits and retries, and keeps every line it got
  in `xuat/giong-luu/` by voice and wording, so rerunning only fetches what is missing. When a
  video is needed that day anyway, run `./xuat.sh <story-folder> say`: one local voice for all.
- **A duplicate SVG attribute is ignored**: the first one wins. Pass the width to `I(w)` rather
  than adding a second `stroke-width`.
- **A recording can hang.** One run of `quay.js` sat for 13 minutes with no output and no cause
  found; the rerun was fine. If it runs far longer than the video, stop it and run it again.
- **Exported mp4 files stay out of git** (`*.mp4` is ignored). They are 53 MB and 70 MB, GitHub
  rejects any file over 100 MB, and `./xuat.sh` rebuilds them.
- Music and effects are synthesized and nobody has judged them by ear from inside this repo:
  levels are measured, taste is not. Lip movement is a loop, not synced to syllables.
- `player.js` and `xuat/ghep.js` are copies in each story. A fix to one goes into all of them.
