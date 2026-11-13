const NS = "http://www.w3.org/2000/svg";
const layer = document.getElementById("scenes");
const capWho = document.querySelector("#cap .who");
const capTxt = document.querySelector("#cap .txt");
const label = document.getElementById("label");
const PITCH = { "An Tiêm": 0.8, "Vua Hùng": 0.55, "Nàng Ba": 1.4, "Con trai": 1.8 };

const scenes = SHOTS.map((shot) => {
  const g = document.createElementNS(NS, "g");
  g.setAttribute("class", "scene");
  // keeps characters waiting off-frame from showing while a scene slides in
  g.setAttribute("clip-path", "url(#frame)");
  g.innerHTML = `<g class="cam">${shot.art}</g>`;
  layer.appendChild(g);
  return g;
});

let run = 0;
let idx = -1;
let voiceOn = false;

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));
const readTime = (text) => 900 + text.length * 85;
// window.DURS is injected by the mp4 export: per-line durations that match the recorded narration
const DURS = window.DURS || null;
const lineTime = (i, j) => (DURS ? DURS[i][j] : readTime(SHOTS[i].lines[j][1]));
const shotTime = (i) => SHOTS[i].lines.reduce((sum, _, j) => sum + lineTime(i, j), 500);

function camT([cx, cy, z]) {
  cx = Math.min(Math.max(cx, 800 / z), 1600 - 800 / z);
  cy = Math.min(Math.max(cy, 450 / z), 900 - 450 / z);
  return `translate(${800 - cx * z}px, ${450 - cy * z}px) scale(${z})`;
}

function setCap(who, text) {
  capWho.textContent = who ? who + ": " : "";
  capTxt.textContent = who ? `“${text}”` : text;
}

function show(i) {
  const old = scenes[idx];
  const g = scenes[i];
  const shot = SHOTS[i];
  if (old && old !== g) {
    old.dataset.out = shot.tr || "fade";
    old.classList.replace("on", "prev");
    setTimeout(() => old.classList.remove("prev"), 1300);
  }
  idx = i;
  g.dataset.tr = shot.tr || "fade";
  g.classList.remove("prev", "on");
  layer.appendChild(g);
  void g.getBoundingClientRect();
  g.classList.add("on");
  const cam = g.firstElementChild;
  cam.getAnimations().forEach((a) => a.cancel());
  cam.animate([{ transform: camT(shot.cam[0]) }, { transform: camT(shot.cam[1]) }],
    { duration: shotTime(i), fill: "forwards", easing: shot.ease || "ease-in-out" });
  label.textContent = `Cảnh ${shot.label} (${i + 1}/${SHOTS.length})`;
}

function speak(who, text) {
  return new Promise((done) => {
    const line = new SpeechSynthesisUtterance(text);
    line.lang = "vi-VN";
    line.rate = 0.9;
    line.pitch = PITCH[who] || 1;
    line.onend = line.onerror = done;
    speechSynthesis.speak(line);
  });
}

async function play(from = 0) {
  const mine = ++run;
  speechSynthesis.cancel();
  // silent playback follows an absolute schedule so timer drift cannot pull it away from the audio track
  let due = performance.now();
  const until = (ms) => { due += ms; return sleep(Math.max(0, due - performance.now())); };
  for (let i = Math.max(0, from); i < SHOTS.length; i++) {
    show(i);
    for (const [j, [who, text]] of SHOTS[i].lines.entries()) {
      setCap(who, text);
      scenes[i].dataset.talk = who || "";
      if (voiceOn) { await speak(who, text); due = performance.now(); } else await until(lineTime(i, j));
      if (mine !== run) return;
    }
    scenes[i].dataset.talk = "";
    await until(500);
    if (mine !== run) return;
  }
  setCap(null, "Hết");
  await sleep(2000);
  if (window.recDone) window.recDone();
}

function jump(delta) {
  play(Math.min(Math.max(idx + delta, 0), SHOTS.length - 1));
}

document.getElementById("play").onclick = () => { voiceOn = false; play(0); };
document.getElementById("playVoice").onclick = () => { voiceOn = true; play(0); };
document.getElementById("prev").onclick = () => jump(-1);
document.getElementById("next").onclick = () => jump(1);
document.getElementById("full").onclick = () => document.getElementById("stage").requestFullscreen();
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") jump(1);
  if (e.key === "ArrowLeft") jump(-1);
  if (e.key === "f") document.getElementById("stage").requestFullscreen();
});

const start = parseInt(new URLSearchParams(location.search).get("shot"), 10);
show(start >= 0 && start < SHOTS.length ? start : 0);
