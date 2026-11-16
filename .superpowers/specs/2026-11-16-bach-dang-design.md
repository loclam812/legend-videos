# Bạch Đằng 938: one story, two cuts

## Intent

Add a fourth story to the series: Ngô Quyền's victory over the Southern Han fleet on the Bạch Đằng
river in 938. The user reviewed a vertical short of the Mai An Tiêm legend made by someone else
(3D-rendered images, 97 s, 1080x1920, captions of two to four words with yellow keywords, shots of
about four seconds) and wants to try that way of cutting a video, next to the usual long form.
The 3D look is out of reach and out of scope: every frame stays SVG drawn by code.

## Goals

- `bach-dang-video/bach-dang.mp4`: 16:9, 1280x720, 4 to 5 minutes, same look and pacing as the
  three existing stories.
- `bach-dang-shorts/bach-dang-shorts.mp4`: 9:16, 1080x1920, 80 to 100 seconds, cut like the
  reference short.
- Both cuts show the same drawings, so the characters match and the art is drawn once.
- Both export with the existing command: `./xuat.sh bach-dang-video`, `./xuat.sh bach-dang-shorts`.

## Non-goals

- No 3D, no generated images, no paid service.
- No vertical cut of the three older stories.
- No thumbnail for the vertical cut (`bia.js` stays 1280x720).
- No change to the narration speed or to `nhac.js`.

## Anti-goals

- The vertical cut must not be a centre crop of the wide video: every vertical shot is framed on
  purpose, and no figure or caption is cut by the frame edge.
- The older stories must export exactly as before.
- Narration must not state invented history (see Story).

## Constraints

- Project rules in `CLAUDE.md`: outlines through `I(w)`, shared defs for depth, `shadow()` under
  standing figures, one tunic and trim colour per character, every figure moves, nothing sits
  unchanged for more than about 2.5 s, whole figure inside the frame at every camera stop.
- Narration and captions are Vietnamese. Code, comments and docs are English.
- `doc.js` and `nhac.js` read exactly `helpers.js`, `people.js`, `shots-a.js`, `shots-b.js` from
  the story folder and evaluate them for `SHOTS`.
- `player.js` and `xuat/ghep.js` are copies per story.

## Approaches

1. **One set of drawings, two cuts (chosen by the user).** The wide shots are drawn on the usual
   1600x900 canvas. The vertical cut is a 506.25x900 window onto the same drawings, with its own
   camera stops, lines and transitions. Draws once; the vertical framing is limited by the wide art.
2. **Two folders with separate art.** Best vertical compositions, but twice the drawing and nothing
   keeps the two versions alike.
3. **Crop the exported wide mp4 with ffmpeg.** Rejected: captions and figures get cut and the
   pacing cannot change.

The user picked 1. Where a vertical shot cannot be framed from wide art, a scene is drawn for it
alone.

## Design

### Folders (my call)

`bach-dang-video/` is a normal story folder copied from `thanh-giong-video/`.

`bach-dang-shorts/` is a thin second folder, so every root script keeps taking one folder argument:

- `helpers.js`, `people.js`, `shots-a.js`: relative symlinks to the files in `bach-dang-video/`.
- `shots-b.js`, `index.html`, `player.js`, `kiem-tra.html`, `xuat/quay.js`, `xuat/ghep.js`: its own.

To make the art shareable, `shots-a.js` holds the story builders and one named function per scene
in a `const ART = { ... }` object, and pushes nothing. Each function takes an options object and
returns the SVG, so a cut passes its own timing: a wide shot plays the whole tide over 20 s, a
vertical shot asks for the same scene with the event fitted to 3 s, or frozen at its start or end.
`bach-dang-video/shots-b.js` holds the wide `SHOTS` (each `art: ART.name({...})`), the transition
table and the title and end cards. This differs
from the older stories, where both files push shots; `CLAUDE.md` gets a note.

### Vertical player (`bach-dang-shorts/`)

- `viewBox="0 0 506.25 900"`; the frame clip, vignette and grain rects use the same size. The art
  keeps its 1600x900 coordinates, so `cam` stops mean the same thing in both cuts.
- `camT` uses 253.125 and 450 as both the clamp half-extents and the centre offset, where the wide
  player uses 800 and 450. Zoom stays at 1 or above.
- Everything else sized for the wide frame moves with it: the `zoom` transform origin, the caption
  font size (set from the frame height, not `vw`) and the iframe size in `kiem-tra.html`.
- Captions: sans-serif, weight 900, upper case, white with a dark outline, centred at about 62 %
  of the height. `chunks(text, 16)` gives two to four words at a time, timed by share of letters
  as today. A shot may carry `hot: ["cọc", ...]`; the player colours those words `#f6c453`.
  No speaker prefix. The text sent to the voice is unchanged, so `doc.js` needs no change for it.
- New transition `whip`: a 0.25 s horizontal slide with horizontal blur. `fade`, `zoom` and
  `black` stay; `slide` distance becomes the vertical frame width.
- `ring(x, y, r)` and `arrow(x1, y1, x2, y2)` in `shots-a.js` draw the dotted yellow call-outs.
- `xuat/quay.js` records at 1080x1920. `xuat/ghep.js` differs only in the output name.
- The first shot is a hook over the battle at its peak, with no title card. The last is a short
  end card that fits 506 units of width.

### Shared scripts

- `kiem.js`: the tile keeps the mp4's aspect: 480x270 for a wide video as today, 270x480 for a
  vertical one.
- `doc.js`: add the new speakers to `VOICES`.
- `CLAUDE.md`: story table, the two-cut layout, the `ART` convention, `hot` and `whip`.

### Story

Facts used, all from the standard account (Đại Việt sử ký toàn thư):

1. 937: Kiều Công Tiễn kills Dương Đình Nghệ and takes his place.
2. Ngô Quyền, Dương Đình Nghệ's general and son-in-law, marches from Ái Châu and kills him.
3. Kiều Công Tiễn had asked Southern Han for help. Its king Lưu Cung sends his son Lưu Hoằng
   Tháo with a fleet and waits at the border with reserves.
4. Ngô Quyền has large stakes cut, tipped with iron and planted in the river mouth, hidden at
   high tide.
5. Light boats provoke the fleet at high tide and retreat past the stakes.
6. The tide falls. Ngô Quyền attacks; the heavy ships break on the stakes. Hoằng Tháo dies.
7. Lưu Cung withdraws. In 939 Ngô Quyền takes the title of king at Cổ Loa, ending over a
   thousand years of northern rule.

Dialogue is limited to short lines that paraphrase the speech the chronicle attributes to Ngô
Quyền before the battle (Hoằng Tháo is a foolish boy; his men come from far and are tired; with
Kiều Công Tiễn dead they have no inside ally and have already lost heart; plant iron-tipped stakes
and none will escape). Nobody else speaks: the narrator carries the rest.

Wide cut: title card, about 12 story shots, end card. Vertical cut: about 25 shots of 3 to 4 s,
one short sentence each, drawn from the same scenes as close framings.

### New drawing work

- Characters: Ngô Quyền (armour-coloured tunic, topknot with headband, short beard), Lưu Hoằng
  Tháo (different helmet and colour), Lưu Cung (crown), Việt soldiers, Southern Han soldiers,
  woodcutters. Speakers get `[data-talk]` selectors in both `index.html` files.
- Scenery: wide river with far bank and limestone hills, iron-tipped stakes, a stake field whose
  water level rises and falls, a large war junk, light boats (the existing `boat()`), a ship
  tilting and sinking, arrows, fire on water.
- New keyframes for the tide and for a ship breaking.

### Risks

- Recording 1080x1920 in real time with the grain filter and a blur may drop frames. The first
  build step is a spike: record ten seconds of a busy vertical shot and check the frame rate. If
  it stutters, record at 720x1280 and let `ghep.js` scale up, or drop the grain in the vertical cut.
- The two cuts need about 70 voice lines from an endpoint that refuses in bursts. `./xuat.sh
  <folder> say` is the same-day fallback.
- Symlinks are fine for `node`, `python3 -m http.server` and git on macOS, but `cp -r` of the
  shorts folder copies links, not files. `CLAUDE.md` says so.

## Left to the builder

- Shot list, wording, camera stops, colours, moods and sound cues.
- Which wide scenes need a vertical-only drawing.
- How the blur of `whip` is made (CSS filter or an SVG filter).

## Checking

- Contact sheets of both `kiem-tra.html` pages before recording; `xuat/khung-hinh.jpg` after.
- `ffprobe`: frame size and the video/audio length gap of each mp4.
- `./xuat.sh thanh-giong-video` is not rerun; `kiem.js` is checked against its existing mp4.
- Voice, pronunciation, music and effects cannot be judged here: the user listens.
