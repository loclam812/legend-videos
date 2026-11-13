# Legend videos

Animated Vietnamese folk tales for YouTube. Every frame is SVG drawn by code and every export
uses free tools only: no paid image, video or voice service. Each story is one folder that holds
its own copy of the engine.

| Folder | Story | Output |
|---|---|---|
| `mai-an-tiem-video/` | Mai An Tiêm (the watermelon legend), 19 shots | `su-tich-dua-hau.mp4` |
| `son-tinh-thuy-tinh-video/` | Sơn Tinh Thủy Tinh, 12 shots | `son-tinh-thuy-tinh.mp4` |

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

`doc.js` at the repo root is shared by all stories.

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
- `lines` is `[speaker, text]`. `null` is the narrator. One sentence per line, about 8 to 16
  words, so each stays on screen long enough to read.
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
- Keep the whole figure inside the frame at every camera stop. A character at scale `s` is
  about `300 * s` tall above its `y`, so a figure on a mountain top is cut off first.

## Export to mp4

Needs `node`, `ffmpeg`, Playwright with Chromium, and the macOS voice "Linh (Enhanced)"
(System Settings, Accessibility, Spoken Content, System Voice, Manage Voices, Vietnamese).

One command from the repo root does all of it:

```bash
./xuat.sh <story-folder>
```

It takes about twice the length of the video. Playwright is not installed in this repo: put
`PLAYWRIGHT_PATH=<path-to>/node_modules/playwright` in a `.env` file at the repo root (ignored
by git) and `xuat.sh` loads it.

The script runs these steps, each reading what the one before wrote:

1. `node doc.js <story-folder> say` reads every line with `say -v "Linh (Enhanced)" -r 165` and
   writes `xuat/durs.json`. Line lengths drive the whole schedule.
2. It serves the story folder on port 8765 and stops the server when it exits. It refuses to
   run if the port is already taken, because the other server would serve the wrong story.
3. `xuat/quay.js` records the page in real time.
4. `xuat/ghep.js` writes the mp4 next to the story folder's `index.html` at 1280x720, 30 fps.

The output name is hard-coded on the `const out` line of each `ghep.js`. Change it when copying
the folder for a new story.

## Checking the result

Nobody can judge the picture from the code, so look at it.

- Before recording: serve the folder and screenshot `kiem-tra.html`. Check each shot for cut-off
  figures, objects floating above the ground and overlapping characters. `index.html?shot=N`
  shows one shot. `file:` URLs are blocked in the Playwright MCP browser, hence the server.
- `kiem-tra.html` has the shot count hard-coded. Update it when shots are added or removed.
- After export: run `ffprobe` for duration and the audio stream, and sample a few frames with
  `ffmpeg -ss <t> -frames:v 1`.
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

- **edge-tts is not usable.** `doc.js` without `say` uses the free neural voices through
  `.venv/bin/edge-tts`, with a male and a female voice per character. On 2026-11-13 the endpoint
  refused most requests (`NoAudioReceived`); 7 of 60 lines came through in over 20 minutes.
  Use `say`. It is one female voice for every character.
- **A duplicate SVG attribute is ignored**: the first one wins. Pass the width to `I(w)` rather
  than adding a second `stroke-width`.
- **A recording can hang.** One run of `quay.js` sat for 13 minutes with no output and no cause
  found; the rerun was fine. If it runs far longer than the video, stop it and run it again.
- **GitHub rejects any file over 100 MB.** The exported videos are committed and are 53 MB and
  70 MB. A longer video needs a lower bitrate (`-crf` in `ghep.js`) or must stay out of git.
- No music or sound effects yet. Lip movement is a loop, not synced to syllables.
