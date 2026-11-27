# Legend videos

Animated Vietnamese folk tales and, since 2026-11-20, short science stories about the Earth's past, for YouTube. Every export uses free tools only: no paid image,
video or voice service. Every story folder ends in `-giay` (paper-cut; `-giay-en` for an English cut) or `-hoathinh` (cartoon): its picture is built from images a local model
generates (see "Paper-cut stories").

The older stories drew every frame as SVG by code. That engine and its stories (`mai-an-tiem-video/`,
`son-tinh-thuy-tinh-video/`, `thanh-giong-video/`, the root scripts `nhac.js`, `soat.js`, `kiem.js`, `bia.js`,
`xuat.sh`) were removed on 2026-11-20 and are in git history up to `f77217d`.

Talk to the user in Vietnamese. Narration and on-screen text are Vietnamese. Code, comments and
commit messages are English.

## Paper-cut stories

The look of every story (the user chose it on 2026-11-19): every moving
thing is a separate paper layer that a local model generates, and code moves the layers.
Since 2026-11-20 there is a second look: a folder ending in `-hoathinh` is the flat 2D
stick-figure story-time cartoon the user chose (people are người que whose clothes follow
the story). Its `anh.js` sets `module.exports.style` to the stick-figure string (see
`100-nghin-nam-hoathinh/anh.js`) and its `canh.js` passes `look: "toon"` to `start`, which
drops the paper drop shadows, grain and vignette and draws flat caption cards. In the toon
look `cutOut` in `giay/may.js` also eats the grey contact shadow the model paints under
every `pg-` puppet (grey reachable from empty space below; outlines and coloured fills stop
it), because no prompt ever removed it.

A third look is the storybook one, `look: "storybook"` passed to `start` in `canh.js`: yellow Montserrat
captions in short chunks that crossfade, paper labels (`chip`), torn-sheet, black-band and iris
transitions. An English cut of a story is its own folder with the same `anh/`, `anh.js` and scenes, an
English `loi.js` and English labels in `canh.js` (`tien-su-hoat-hinh-en/` is the English cut of
`tien-su-hoat-hinh/`). A Vietnamese cut of an English story is made the same way, in a folder ending in
`-vi` (`vi-khuan-trong-co-the-giay-vi/`), and takes its `TEMPO` and narrator from what the user chose for
the script (`xuat/content.json` of the English folder: its tempo and its `nam` or `nu`), not from the
default narrator and speed.

| Folder | Story | Output |
|---|---|---|
| `bach-dang-giay/` | Bạch Đằng 938 (Ngô Quyền), 23 shots | `bach-dang-giay.mp4` |
| `an-khe-giay/` | Ăn khế trả vàng, 19 shots | `an-khe-giay.mp4` |
| `mai-an-tiem-giay/` | Mai An Tiêm, 19 shots | `mai-an-tiem-giay.mp4` |
| `son-tinh-giay/` | Sơn Tinh Thủy Tinh, 19 shots | `son-tinh-giay.mp4` |
| `thanh-giong-giay/` | Thánh Gióng, 19 shots | `thanh-giong-giay.mp4` |
| `thien-thach-giay/` | Ten minutes after the asteroid that killed the dinosaurs, 19 shots | `thien-thach-giay.mp4` |
| `300-trieu-nam-giay/` | If you woke up 300 million years ago: wide, 47 shots, about 9 minutes | `300-trieu-nam-giay.mp4` |
| `100-nghin-nam-giay/` | How long would you survive 100,000 years ago?, 20 shots | `100-nghin-nam-giay.mp4` |
| `100-nghin-nam-hoathinh/` | The same story in the cartoon look (người que), 20 shots | `100-nghin-nam-hoathinh.mp4` |
| `thien-thach-giay-en/` | English cut of the asteroid short, read by Kokoro | `thien-thach-giay-en.mp4` |
| `300-trieu-nam-giay-en/` | English cut of the 300-million-year video, read by Kokoro at its own pace (8.5 minutes, past the 8-minute mark for mid-roll ads) | `300-trieu-nam-giay-en.mp4` |
| `chuon-chuon-giay-en/`, `cuon-chieu-giay-en/`, `than-da-giay-en/`, `chay-rung-giay-en/`, `ca-map-giay-en/` | Five tall Shorts cut from the 300-million-year video (Meganeura, Arthropleura, coal, wildfires, sharks), 30 to 45 s each: new scripts, the long video's layers copied and laid out again for 1080x1920 | `<folder>.mp4` |
| `megalodon-dai-giay-en/`, `megalodon-can-giay-en/`, `megalodon-tuyet-chung-giay-en/` | Three Megalodon Shorts (size, bite, extinction), 17 to 27 s, testing a new hook: the animal and the claim are on screen at frame 0, no opening scene | `<folder>.mp4` |
| `titanoboa-giay-en/`, `quetzalcoatlus-giay-en/`, `dunkleosteus-giay-en/` | Three "real monsters" Shorts in the same hook format, 27 to 29 s; upload texts in `kenh/dang/quai-vat.md` | `<folder>.mp4` |

The stories share some layers (skies, sea, ground, hut, King Hùng): the png or jpg is copied into each
story's `anh/` and its prompt repeated in `anh.js`, so every folder still builds on its own.

A paper-cut story folder holds three files and `anh/`; the engine is shared in `giay/`:

- `loi.js`: `const SHOTS = [{ label, mood, hot, lines: [[speaker, text]] }]`. One short sentence
  per shot in a short. A speaker other than `null` needs an entry in `VOICES` of `doc.js`. The last shot is
  labelled `kết` and shows the title card. `const SUBS = false` burns in no subtitles and leaves only the paper labels on things in the picture (the
  user asked for that on the science stories). `const LANG = "en"` makes it an English story (see Narration);
  an English cut is its own `-en` folder with copies of `anh/`, `anh.js` and `canh.js`, its labels and title card in English.
  <!-- labelled `kết` and shows the title card. `const VOICE = "en-US-AndrewNeural"` names the edge-tts voice
  that reads the narrator and anyone unlisted: a story in another language needs it.
  `const SUBS = false` burns in no subtitles and leaves only the paper labels on things in the picture (the
  user asked for that on the science stories, which will also be made in English). -->
  `const WIDE = true` in this file makes the story 1920x1080
  instead of 1080x1920: a long video, several sentences per shot, subtitles along the bottom.
- `anh.js`: the layers, built with `plate` (full-frame backdrop, stored as jpg), `prop` and `puppet`
  (painted on flat magenta and stored as png, so the page can key them out). A wide story passes
  `[1536, 864]` to `plate`. A story that is not a folk tale sets `module.exports.style`, because the
  default look asks for Vietnamese woodblock motifs. `drawn("ve-….js", [w, h])` is a keyed layer that
  a script in the story folder draws on the same magenta instead of the model (`sinh.js` runs it when
  the png is missing; `soat.js` checks only its size): for a machine whose parts the model will not
  put in the right places or in the right number, as the engine and the rocket of
  `ten-lua-elon-musk/` (`ve-co.js`, `ve-sls.js`, measured from frames of the source video).
- `canh.js`: `PLATES`, `CUTS` and `SCENES`, then `start({ plates, cuts, scenes, card })`. A scene
  serves one or more shots in a row and draws them with `draw(ts, i, u, line, v)`: seconds since the
  scene began, which of its shots is playing, seconds into that shot, which sentence of the shot is
  being read and seconds into that sentence. A sheet of paper slides across when
  the scene changes; in the storybook look each scene's `cut` chooses how it enters, and the change is centred
  on the first frame of the new scene's first shot: it covers the old shot in the last part of the half-second
  gap and uncovers the new one in its first (the lengths are `half` in `giay/may.js`, 0.36 s a side at most),
  so what a scene draws in its first 0.2 s is still under the cover.
- `giay/may.js` is the engine: `P(name, x, y, w, { rot, flip, alpha })` draws a layer with its
  bottom centre at (x, y) on the 1080x1920 frame, and there are `plate`, `sea`, `rays`, `tag`,
  `ring`, `bubble`, `shards`, `confetti`, `sparkles`, `tears`, `pop`, `hop`, `sm`, and `space` and `globe`
  for views from orbit. Everything drawn
  must be a function of the time passed in: no CSS animation, no `Date`, no state between frames.

Build a story from the repo root, in this order:

```bash
set -a; . ./.env; set +a
node giay/sinh.js <story-folder> all     # the layers that are missing; <name>:<seed> redoes one
node doc.js <story-folder>               # narration into xuat/tieng and xuat/durs.json
node giay/nhac.js <story-folder> [off]   # xuat/am.m4a: narration over the music, or narration only with "off"
node giay/quay.js <story-folder> sheet   # xuat/kiem.jpg: three frames of every shot. Look at it.
node giay/khung.js <story-folder> all:0.5 # xuat/khung/: a full-size still of every shot. Read them too.
node giay/quay.js <story-folder>         # <story-folder>/<story-folder>.mp4 and .srt (subtitle timeline)
```

- `node giay/capcut.js <story-folder>` (CapCut closed) writes a CapCut draft named after the story into
  `~/Movies/CapCut/User Data/Projects/com.lveditor.draft/`: the mp4 muted, `xuat/loi-ke.wav`,
  `xuat/nhac.wav` and the `.srt` cues on four tracks, so another language needs no new recording. It
  points at the files in the story folder and copies nothing. An existing draft is replaced only with
  `force`. The draft format is unpublished: `giay/capcut-mau.json` is an empty draft from CapCut 9.8.0
  for macOS, and a later CapCut may refuse it. The voice plays at full level and the music at half, without the
  ducking and loudness pass of `am.m4a`.
- Generation uses `mflux` with FLUX.2 klein 4B (Apache 2.0, so the output may be monetised). The
  tool and the 15 GB model live outside the repo in `~/ai-models/`. A layer takes 20 to 40 s on an
  idle machine and minutes on a busy one, and the machine is slow meanwhile.
- Look at every generated layer before placing it. Note which way a puppet faces (`pg-chim` flies
  left as generated) and record it in the story's `canh.js`. Draw puppets in front of and below
  the scenery they must not cover; the captions sit at about 1320 to 1430 px.
- The lengths in `durs.json` come from the real voice. To lay out a story while the voice is still
  being fetched, write estimated lengths there (about `1100 + 62 * letters` ms per line); `doc.js`
  overwrites the file when it finishes.
- `giay/nhac.js` plays one unbroken pentatonic piece and only adds or drops layers with the mood. `const MUSIC = "<piece>"` in
  `loi.js` picks one of its `PIECES` (`song`, the default, and `air`, `earth`, `fire`, `water`, `stone`: each its own instruments, tempo, key and melody), so Shorts posted day after day do not share one tune (the user asked on 2026-11-25).
  The root `nhac.js` restarts a random melody at every mood change, which sounds harsh in a cut of
  short shots, and the user disliked it.
- `giay/quay.js` steps the page frame by frame (`window.renderAt(seconds)`), so no frame is dropped.
  `.env` needs `PLAYWRIGHT_PATH`. When Playwright reports `Executable doesn't exist`, its own
  Chromium build is gone from `~/Library/Caches/ms-playwright`: reinstall it, or put
  `CHROME=<path to another chrome-headless-shell>` in `.env`. Every recorder in the repo reads it.
- `giay/khung.js` takes full-size single frames where the sheet is too small (its cells are 216x384 px):
  `node giay/khung.js <story-folder> all:0.5` is one still of every shot mid-narration, `<label>:<fraction>` a
  share of a shot's narration, `<label>:+0.5` the first frame of the next shot, `<label>:cut` every recorded
  frame across the scene change after it (in `xuat/khung/cut-<label>/`), a bare number seconds from the start;
  with `mp4` before the moments it pulls the same frames from the recorded file, under the same names in
  `xuat/khung/mp4/` (git ignores `xuat/khung/`, and every run of `quay.js` empties it). Take stills of every
  place where things meet before the recording: a flaw found in a still costs a minute, after the recording it
  costs the recording.
- A scene change is motion, and one still of it shows nothing wrong even when it pops or doubles. Before a
  recording take `<label>:cut` for one change of each kind the story uses and look at the frames side by side
  (tile them eight at most to a picture: the command is at the top of `giay/khung.js`); after it run
  `node giay/nhay.js <story-folder>` (needs no `.env`), which lists every frame that jumps from both its
  neighbours — there must be none where the story has a transition — and the frame-to-frame steps across the
  end of every shot. From the storybook restyle (2026-11-23) until 2026-11-24 its sheet and iris covered the
  old page, uncovered it and covered it again in every recording, and four cuts of `ten-lua-elon-musk/` went
  out with it because only single moments had been checked; the user saw it at once ("Chuyển cảnh đang bị
  duplicate").
- A story retold from a source video (`ten-lua-elon-musk/`, from one of the user's TikTok explainers) is read
  first: one frame a second, tiled into contact sheets, in a scratch directory outside the repo. Its captions
  are retold in other words, each sentence keeps a note of what the screen showed then (`sourceNotes` in
  `content.json`), and each scene is built on that picture; a machine the source draws is drawn by code,
  measured on its frames. `/kichban` and `/chuanbi` have the steps.
- What the model gets wrong, so check for it: a sky plate often comes back as a sheet of paper with a
  pale border (draw it enlarged, see `back` in `300-trieu-nam-giay/canh.js`, or draw it by code, as
  `space` does); slim standing puppets are much taller than wide ones at the same width; an animal
  described as prehistoric comes back as a two-legged dinosaur unless the prompt says four legs and
  "not a dinosaur"; a globe shows today's continents, so `globe` draws hand-sketched outlines instead.
- Science stories state figures, from published estimates named in a comment at the top of each `loi.js`.
  On 2026-11-23 a web search checked every claim in the two science stories and the wording was softened where
  it overstated (the 4.5 km wave was brief, the heated sky is debated, oxygen as the cause of giant insects is a
  hypothesis). It read search summaries, not the papers, and some claims (the 20 km/s speed, the 3000 km to
  Tanis, the sharks, crinoids and cockroaches) found no source. The Vietnamese mp4s were recorded before that fix.
- Captions cover about 1320 to 1430 px in a short and the bottom 160 px in a wide story.
- The caption chunker (`chunks` in `giay/may.js`) was tuned for Vietnamese. Its rule that a storybook caption
  does not end on a word of three letters or fewer moves an English word such as "out," to the start of the
  next caption ("…the cold air | out, while…"). Reword the line, as shot 8 of `tien-su-hoat-hinh-en/loi.js`
  does, rather than change the engine, which would move the captions of every recorded story. The browser
  breaks a storybook caption that runs to two lines at its width middle (`text-wrap: balance`), which in
  Vietnamese often falls inside a compound ("CÁC NHÀ KHOA / HỌC"): word the line, or glue the words as one
  hot phrase, until every caption breaks between words, and measure the chunks in the page's caption box
  before recording, as `vi-khuan-trong-co-the-giay-vi/loi.js` does.
- A caption takes 0.28 s to fade in, and a chunk lasts its line's speaking time in proportion to its letters, so
  before recording an English cut list the length of every caption: one under about half a second is a flash.
  "…at the same time: that is regenerative cooling." left "that is" on screen for 0.33 s; shot 16 of
  `ten-lua-elon-musk-en/loi.js` now ends on the name as its own sentence.
- The machine has 24 GB and swaps heavily when other apps are open: run one heavy job at a time
  (generation or recording, not both). On 2026-11-20 Claude Code stopped both for low memory.
- Generated pictures are not checked against history or custom: costumes, ships and helmets are the
  model's guess from the prompt.

The earlier SVG cuts of Bạch Đằng (wide and vertical) and a 3D-film-style still cut (`bach-dang-ai/`) were
removed on 2026-11-20; they are in git history up to `f77217d`.

## The staged commands

Four slash commands wrap that order with a review pause between stages. `content.json`
at the repo root (gitignored) carries the script, the settings and the status between
them: `/kichban <tệp kịch bản|video|nội dung> <voice-over> [nu|nam|linh] [speed=] [music=]
[style=] [format=] [len=] [folder=]` writes it (the script verbatim; a video is read from its captions and
retold in other words); `/chuanbi` analyses the script, writes the
folder's `loi.js`/`anh.js`/`canh.js` plus `VOICES` entries in `doc.js` for new speakers
and estimated `durs.json`, then — after asking — generates the layers (rerunning it
resumes; `sinh.js all` only makes missing files) and fits the scenes to them in
full-size stills; `/soatanh` checks every layer with
`node giay/soat.js <folder>` and with its own eyes (every cut-out of a real thing beside the frame of the
source, part for part and counted), fixes the `LEFT` facings, writes the
per-image status and offers `sinh.js <name>:<seed>` for the bad ones; `/quay` records
voice → music → `kiem.jpg` sheet → full-size stills, saves `status.pausedAt = "sheet"` and WAITS — `/quay
tiep` resumes straight at the recording if voice, music and sheet are still fresh. It
refuses when an image's mtime no longer matches its checked status. `soat.js` checks the
cheap facts (file, size, mtime): exit 0 all pass, 1 something off, 2 `anh.js` broken.
`node doc.js <folder> nam` makes Nam Minh the narrator instead of Hoài My.

## Setup

Needs `node`, `ffmpeg`, Playwright with a Chromium build, and `edge-tts` in a venv at the repo root
(`.venv/bin/edge-tts`, from `pip install edge-tts`). Playwright is not installed in this repo: `.env` at
the repo root (ignored by git) holds `PLAYWRIGHT_PATH=<path-to>/node_modules/playwright` and, when needed,
`CHROME`.

English narration needs Kokoro-82M (code and weights Apache 2.0) in a Python 3.12 venv outside the repo:
`uv venv ~/ai-models/kokoro --python 3.12`, then `uv pip install kokoro==0.9.4 soundfile` and the spaCy
`en_core_web_sm` 3.8.0 wheel into it. The model (about 330 MB) downloads into `~/ai-models/hf` on first use.

## Narration

`node doc.js <story-folder>` reads every line into `xuat/tieng` and writes `xuat/durs.json`; line lengths
drive the whole schedule. The narrator and women are `vi-VN-HoaiMyNeural`, men are `vi-VN-NamMinhNeural`,
each character with its own pitch in the `VOICES` table of `doc.js`.

- `const TEMPO = 1.1` in a story's `loi.js` reads it 10 % faster (the user asked for that on the two
  science stories). It is applied to the saved recordings, so changing it needs no network.
  An English cut does not take the Vietnamese cut's speed unasked: `ten-lua-elon-musk/` reads at 1.5 and
  `ten-lua-elon-musk-en/` at 1.3 (about 220 words a minute), both the user's choice — the second given on
  2026-11-24 after the English cut had been recorded at the 1.5 of the Vietnamese one (about 253 words a
  minute). Ask which speed an English cut should read at before recording it.
- `const VOICE = "<edge-tts voice>"` in a story's `loi.js` makes that voice the narrator and the voice of anyone
  unlisted, whatever `nam` says. The voice cache is keyed on the voice, so an English cut never reuses the
  Vietnamese recordings.
- A caption, and a label placed by letters, can miss an English word by up to a second ("SLS" follows "RS-25",
  which takes a second to say). `ten-lua-elon-musk-en/canh.js` hangs its labels on the voice's own word marks
  instead: a `HEARD` table of when each phrase is spoken, read from edge-tts's `WordBoundary` events (the Python
  API, `edge_tts.Communicate(text, voice, boundary="WordBoundary")`; the CLI writes sentence cues only) and
  scaled by `said()` to the line as `TEMPO` reads it. The table holds the wording each line was read from, so a
  reworded line falls back to the letter count until its marks are read again; `said()` finds its phrase as
  spelled, capitalisation included.
- **The online voices refuse requests at random.** edge-tts is an unofficial free endpoint and answers
  `NoAudioReceived` in bursts. `doc.js` waits and retries, and keeps every line it got in
  `xuat/giong-luu/` by voice and wording, so rerunning only fetches what is missing.
  `node doc.js <story-folder> say` uses the local macOS voice "Linh (Enhanced)" instead: one voice for all.
- **edge-tts may not be licensed for monetised videos.** Microsoft staff say commercial use of these voices
  without a paid Azure Speech resource may breach its terms. A story meant to earn money uses Kokoro or the
  user's own voice.
- A story with `const LANG = "en"` is read by Kokoro (`giay/doc_en.py`, voice `EN_VOICE` in `doc.js`, now
  `af_heart`) in one run on this machine, offline after the first run downloads the model, cached in `xuat/giong-luu/` like the online voices.
- A recording of the user's own at `<story-folder>/thu/<shot label>-<line index>.wav` (or `.m4a`, `.mp3`)
  replaces that line, in any language, and is not sped up by `TEMPO`. Rerun `doc.js`, `giay/nhac.js` and
  `giay/quay.js` after adding one.
- A time range in an outline the user gives ("0:00–0:30 – Hook") sizes that part. Never read a clock mark
  out or show it as a label.

## Checking the result

- Nobody can judge the picture from the code: look at `xuat/kiem.jpg` and at full-size stills
  (`giay/khung.js`) before the full recording, and compare the video and audio stream lengths with `ffprobe`
  after it, then run `node giay/nhay.js <story-folder>`: an isolated jump at a scene change means the
  recording is not done.
- Claude cannot hear. Voice quality, mispronounced words and the music are for the user to check, and
  the report must say so. The music is synthesized: its level is measured, its taste is not.
- **Exported mp4 files stay out of git** (`*.mp4` is ignored): GitHub rejects any file over 100 MB.
