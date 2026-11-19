# Legend videos

Animated Vietnamese folk tales for YouTube. Every export uses free tools only: no paid image,
video or voice service. The story folders draw every frame as SVG by code; `bach-dang-ai/` is the
exception and builds its picture from images a local model generates (see "Generated-image cuts"). Each story is one folder that holds
its own copy of the engine.

| Folder | Story | Output |
|---|---|---|
| `mai-an-tiem-video/` | Mai An Tiêm (the watermelon legend), 19 shots | `su-tich-dua-hau.mp4` |
| `son-tinh-thuy-tinh-video/` | Sơn Tinh Thủy Tinh, 12 shots | `son-tinh-thuy-tinh.mp4` |
| `thanh-giong-video/` | Thánh Gióng, 12 shots | `thanh-giong.mp4` |
| `bach-dang-video/` | Bạch Đằng 938 (Ngô Quyền), 15 shots | `bach-dang.mp4` |
| `bach-dang-shorts/` | The same story as a 9:16 short, 22 shots and an end card | `bach-dang-shorts.mp4` |
| `bach-dang-ai/` | The same short from generated images: a 3D-film look and a paper-cut look | `bach-dang-ai.mp4`, `bach-dang-giay.mp4` |

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
`soat.js` (checks a shot list), `kiem.js` (contact sheet), `bia.js` (thumbnail), `xuat.sh` (runs
the whole export).

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

## Two cuts of one story

Bạch Đằng has a wide cut and a vertical cut that share one set of drawings.

- `bach-dang-video/shots-a.js` pushes no shots. It holds the builders and `ART`, one function per
  scene: `ART.wreck(o)` returns the SVG. `bach-dang-video/shots-b.js` is the wide shot list.
- `bach-dang-shorts/` has its own `shots-b.js`, `index.html`, `player.js`, `kiem-tra.html` and
  `xuat/`. Its `helpers.js`, `people.js` and `shots-a.js` are symlinks into `bach-dang-video/`, so
  `cp -r` of that folder copies links, not files. Its shots set `tr` inline through `V(label, tr, ...)`:
  no transition table and no title card.
- The vertical frame is a 506.25x900 window on the same 1600x900 art, so `cam` stops mean the same
  thing in both cuts. At zoom `z` it shows `506 / z` units of width: two figures further apart
  than that cannot share a shot. It records at 1080x1920.
- Anything that happens once (a tide, a ship sinking, a walk-in) takes `{ t, d, at }`: seconds,
  delay, or `at: "start" | "end"` to hold it. A 3 s vertical shot passes a short `t` or an `at`,
  never the wide cut's timing.
- Vertical shots have one short sentence each. `hot: ["cọc", ...]` colours those caption words
  yellow. Captions are upper case, two to four words at a time, at 62 % of the height: keep the
  subject above that. `tr: "whip"` is a fast blurred slide, only in the vertical player.
- `ring(x, y, r, delay)` and `arrow(x1, y1, x2, y2, delay)` draw the dotted yellow call-outs.
- The keyframes and `[data-talk]` selectors exist in both `index.html` files: change both.

## Generated-image cuts

`bach-dang-ai/` holds two more cuts of the Bạch Đằng short. Both take their shot list, narration and
line lengths from `bach-dang-shorts/` (run its export first), so only the picture differs.

- `sinh.js` generates the images into `anh/` with `mflux` and FLUX.2 klein 4B (Apache 2.0, so the
  output may be monetised). The tool and the 15 GB model live outside the repo in `~/ai-models/`.
  `node bach-dang-ai/sinh.js all` makes what is missing; `node bach-dang-ai/sinh.js c-5b:31` redoes
  one image with another seed. An image takes 20 s on an idle machine and several minutes on a busy
  one, and the machine is slow meanwhile.
- A character stays the same person across shots through `refs`: the shot is generated from a
  portrait (`ngo`, `thao`, `king`). A shot with no people must use the `empty` style, or the model
  paints a face into the landscape.
- `nhac.js` writes `am.m4a`: the narration over one unbroken pentatonic piece. The shared `nhac.js`
  at the repo root restarts its random melody at every mood change, which sounds harsh in a cut of
  3 s shots.
- 3D-film cut: `index.html` shows one image per shot and moves it by code (camera, water ripple,
  mist, fire). `LOOK` in that file holds the camera stops, rippling areas and effects per shot.
  `node bach-dang-ai/quay.js` writes `bach-dang-ai.mp4`; `quay.js sheet` writes `kiem.jpg`.
- Paper-cut cut: `giay.html` builds 13 scenes from separate paper layers. Plates (`pl-*`, `pc-sky`)
  fill the frame; props (`pc-*`) and puppets (`pg-*`) are generated on flat magenta and keyed out in
  the page, so each can move on its own. `SCENES` holds the choreography and `FLIP` records which
  way each generated piece faces. `node bach-dang-ai/giay-quay.js` writes `bach-dang-giay.mp4`;
  `giay-quay.js sheet` writes `giay-kiem.jpg`.
- Run everything from the repo root with `.env` loaded, in this order:

  ```bash
  set -a; . ./.env; set +a
  node bach-dang-ai/sinh.js all      # only when images are missing
  node bach-dang-ai/nhac.js          # am.m4a
  node bach-dang-ai/giay-quay.js     # or quay.js
  ```

  `.env` needs `PLAYWRIGHT_PATH`, as for `xuat.sh`. When Playwright reports `Executable doesn't
  exist`, its own Chromium build is gone from `~/Library/Caches/ms-playwright`: either reinstall it
  (`npx playwright install chromium` where Playwright lives) or put `CHROME=<path to another
  chrome-headless-shell>` in `.env`. Only the two recorders here read `CHROME`; `xuat.sh` does not.
- Both recorders step the page frame by frame (`window.renderAt(seconds)`), so no frame is dropped.
  Everything in those pages must be a function of time: no CSS animation, no `Date`.
- Keyed layers stay PNG; every other image is stored as JPEG to keep the repo small.
- Generated pictures are not checked against history: costumes, ships and helmets are the model's
  guess from the prompt. Look at every image before using it.

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
5. `xuat/ghep.js` writes the mp4 next to the story folder's `index.html` at the recorded size (1280x720 wide, 1080x1920 vertical). The two Bạch Đằng cuts write 25 fps, the rate Playwright records at; the older stories still write 30 fps and repeat every sixth frame. The
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

- `node soat.js <story-folder>` checks the shot list before any voice or recording is spent:
  camera stops, speakers missing from `VOICES`, transitions, `hot` words. A warning that a camera
  stop is clamped means the player will show a different framing from the one written.
- Before recording: serve the folder and screenshot `kiem-tra.html`. Check each shot for cut-off
  figures, objects floating above the ground and overlapping characters. `index.html?shot=N`
  shows one shot. `file:` URLs are blocked in the Playwright MCP browser, hence the server.
- `kiem-tra.html` has the shot count hard-coded. Update it when shots are added or removed.
- After export: read `xuat/khung-hinh.jpg`, and compare the video and audio stream lengths with
  `ffprobe`. The video runs about 1.7 s longer than the audio (the closing hold); any other gap
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
  `bach-dang-shorts/player.js` differs on purpose (frame size, captions): port fixes by hand.
