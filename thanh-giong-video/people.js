// swing = [degrees, seconds, delaySeconds]: the part rocks between its pose and pose + degrees
const sw = (p, ox, oy) => (p ? ` class="swing" style="transform-origin:${ox}px ${oy}px;--a:${p[0]}deg;--t:${p[1]}s;--d:${p[2] || 0}s"` : "");

function arm(sx, hx, hy, color, swing, held) {
  const side = sx < 0 ? -1 : 1;
  const d = `M${sx} -182Q${(sx + hx) / 2 + side * 9} ${(-182 + hy) / 2 + 13} ${hx} ${hy}`;
  return `<g${sw(swing, sx, -182)}><path d="${d}" fill="none" stroke="${INK}" stroke-width="21" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="13" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="9" fill="${color}" ${I(4)}/>${held}</g>`;
}

// walk = [dx, seconds, delaySeconds, dy]: the person walks in from that offset to the posed spot
// flat = 1 drops the ground shadow, for a figure that lies down, rides or flies
function person(o) {
  const { x, y, s = 1, flip = 0, tunic = "#8a5a34", trim = "#5b3a20", long = 0, hair = "knot", mood = "smile", aL = [-46, -105], aR = [46, -105], beard = 0, crown = 0, extra = "",
    hat = "", tone = null, name = "", wL = null, wR = null, hL = "", hR = "", nod = null, lean = null, body = "bob", walk = null, flat = 0 } = o;
  const hem = long ? -30 : -95;
  const skin = tone ? tone[0] : "url(#skinG)";
  const [armL, armR] = tone || ["#f0b888", "#d0946a"];
  const robe = `M-42 ${hem}C-49 ${hem - 40} -45 -150 -34 -190Q0 -204 34 -190C45 -150 49 ${hem - 40} 42 ${hem}Q0 ${hem + 9} -42 ${hem}Z`;
  const mouth = {
    smile: `<path d="M-11 -217q11 10 22 0" fill="none" ${I(3.5)}/>`,
    sad: `<path d="M-10 -211q10 -9 20 0" fill="none" ${I(3.5)}/>`,
    angry: `<path d="M-10 -212q10 -5 20 0" fill="none" ${I(3.5)}/>`,
    open: `<path d="M-11 -219q11 19 22 0z" fill="#7a2018" ${I(3)}/>`,
  }[mood];
  const brows = {
    smile: "M-20 -247q8 -6 15 -1M5 -248q8 -5 15 1",
    open: "M-20 -250q8 -6 15 -1M5 -251q8 -5 15 1",
    sad: "M-21 -244l15 -6M6 -250l15 6",
    angry: "M-21 -251l15 8M6 -243l15 -8",
  }[mood];
  const hairBack = hair === "long" ? `<path d="M-37 -242C-52 -180 -46 -140 -38 -122H38C46 -140 52 -180 37 -242Z" fill="${DARK}" ${I(4)}/>` : "";
  const hairTop = `<path d="M-33 -236C-37 -282 37 -282 33 -236C36 -224 33 -218 29 -215C29 -240 10 -256 -10 -250C-22 -247 -29 -238 -29 -215C-33 -218 -36 -224 -33 -236Z" fill="${crown ? "#d9d4c8" : DARK}" ${I(3.5)}/>`;
  const knot = hair === "knot" && !crown ? `<circle cx="2" cy="-279" r="12" fill="${DARK}" ${I(3.5)}/><path d="M-10 -268h24" stroke="#b5382a" stroke-width="6"/>` : "";
  const crownS = crown ? [-48, -24, 0, 24, 48].map((a, i) => `<g transform="rotate(${a} 0 -250)"><ellipse cx="0" cy="-306" rx="10" ry="33" fill="${i % 2 ? "#f2c14e" : "#b5382a"}" ${I(3)}/><path d="M0 -334V-280" fill="none" stroke="${INK}" stroke-width="2"/></g>`).join("")
    + `<path d="M-35 -256q35 -16 70 0" fill="none" stroke="${INK}" stroke-width="16"/><path d="M-35 -256q35 -16 70 0" fill="none" stroke="#f2c14e" stroke-width="10"/><circle cx="0" cy="-264" r="5" fill="#b5382a"/>` : "";
  const beardS = beard ? `<path d="M-20 -214Q-18 -168 0 -160Q18 -168 20 -214Q0 -196 -20 -214Z" fill="#e6e1d6" ${I(3)}/>` : "";
  const royal = crown ? `<path d="M-41 ${hem - 12}Q0 ${hem - 3} 41 ${hem - 12}" fill="none" stroke="#f2c14e" stroke-width="7"/><path d="M0 -176V${hem - 8}" fill="none" stroke="#f2c14e" stroke-width="5"/>` : "";
  const steps = walk ? Math.max(2, Math.round(walk[1] / 0.3)) : 0;
  const leg = (ox, rev) => (walk ? ` class="step" style="transform-origin:${ox}px ${hem}px;--n:${steps};--d:${walk[2] || 0}s;animation-direction:${rev ? "alternate-reverse" : "alternate"}"` : "");
  const delay = ((Math.abs(x) % 7) / 3).toFixed(2);
  const figure = `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"${name ? ` data-name="${name}"` : ""}>
    ${flat ? "" : `<ellipse cx="34" cy="2" rx="78" ry="10" fill="#3a2010" opacity=".3"/>`}
    <g class="${body}" style="animation-delay:-${delay}s">
    <g fill="${skin}" ${I(4)}${leg(-14, 0)}><path d="M-24 ${hem}L-21 -7H-5L-4 ${hem}Z"/><ellipse cx="-14" cy="-4" rx="15" ry="6"/></g>
    <g fill="${skin}" ${I(4)}${leg(14, 1)}><path d="M4 ${hem}L5 -7H21L24 ${hem}Z"/><ellipse cx="14" cy="-4" rx="15" ry="6"/></g>
    <g${sw(lean, 0, -100)}>
    ${hairBack}
    <path d="${robe}" fill="${tunic}" ${I()}/>
    <path d="M9 ${hem + 6}C11 -100 11 -160 9 -197Q22 -196 34 -190C45 -150 49 ${hem - 40} 42 ${hem}Q25 ${hem + 6} 9 ${hem + 6}Z" fill="#2a1608" opacity=".2"/>
    <path d="M-14 ${hem - 4}C-17 ${hem - 28} -12 ${hem - 40} -15 ${hem - 52}M17 ${hem - 4}C20 ${hem - 26} 15 ${hem - 38} 18 ${hem - 50}" fill="none" stroke="#2a1608" stroke-width="3" stroke-linecap="round" opacity=".45"/>
    <path d="M-12 -198L0 -176L12 -198Z" fill="${skin}" ${I(3.5)}/>${royal}
    <path d="M-42 -142Q0 -133 43 -142" fill="none" stroke="${INK}" stroke-width="15"/><path d="M-42 -142Q0 -133 43 -142" fill="none" stroke="${trim}" stroke-width="9"/>
    <path d="M-7 -135l-6 26M-1 -134l3 27" fill="none" stroke="${trim}" stroke-width="6" stroke-linecap="round"/><circle cx="-4" cy="-137" r="7" fill="${trim}" ${I(3)}/>
    <path d="M-37 -186C-46 -150 -48 ${hem - 40} -43 ${hem - 6}" fill="none" stroke="#ffe0a0" stroke-width="3" stroke-linecap="round" opacity=".8"/>
    ${extra}
    ${arm(-30, aL[0], aL[1], armL, wL, hL)}${arm(30, aR[0], aR[1], armR, wR, hR)}
    <g${sw(nod, 0, -205)}>
      <rect x="-8" y="-208" width="16" height="16" fill="${skin}" ${I(4)}/>
      <ellipse cx="-33" cy="-230" rx="6" ry="9" fill="${armL}" ${I(3)}/><ellipse cx="33" cy="-230" rx="6" ry="9" fill="${armR}" ${I(3)}/>
      <ellipse cx="0" cy="-232" rx="33" ry="35" fill="${skin}" ${I(4.5)}/>
      ${hairTop}${knot}${crownS}${hat}
      <circle cx="-19" cy="-221" r="7" fill="#e8705a" opacity=".28"/><circle cx="19" cy="-221" r="7" fill="#e8705a" opacity=".28"/>
      <g class="blink" style="animation-delay:-${delay * 2}s"><ellipse cx="-12" cy="-233" rx="6.5" ry="5.5" fill="#fffaf0" ${I(2.5)}/><ellipse cx="12" cy="-233" rx="6.5" ry="5.5" fill="#fffaf0" ${I(2.5)}/>
      <circle cx="-12" cy="-232" r="3.4" fill="${DARK}"/><circle cx="12" cy="-232" r="3.4" fill="${DARK}"/></g>
      <path d="${brows}" fill="none" stroke="${DARK}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M-3 -226q3 5 6 0" fill="none" stroke="#9a5a3a" stroke-width="2.5" stroke-linecap="round"/>
      <g class="mouth">${mouth}</g>${beardS}
      <path d="M-31 -246C-37 -228 -33 -212 -25 -204" fill="none" stroke="#ffe0a0" stroke-width="3" stroke-linecap="round" opacity=".8"/>
    </g>
    </g>
  </g></g>`;
  return walk ? `<g class="walk" style="--dx:${walk[0]}px;--dy:${walk[3] || 0}px;--t:${walk[1]}s;--d:${walk[2] || 0}s">${figure}</g>` : figure;
}

const KING = (o) => person({ name: "Vua Hùng", tunic: "#b5382a", trim: "#f2c14e", long: 1, crown: 1, beard: 1, ...o });
const EXTRA = (o) => person({ tunic: o.c || "#6f7f4a", ...o });

// an object that pops into view after a delay, growing from its own base point
const pop = (svg, x, y, d) => `<g class="pop" style="transform-origin:${x}px ${y}px;--d:${d}s">${svg}</g>`;
