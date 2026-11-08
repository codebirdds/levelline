// Placeholder garment art generated on the fly ("seed:<piece>?c=<hex>") so the demo needs no image files.
// Replace with real uploads/URLs any time — the engine only sees an opaque image reference string.
const shade = (hex, amt) => {
  const n = parseInt(hex.replace("#", ""), 16);
  const f = (v) => Math.max(0, Math.min(255, v + amt));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join("")}`;
};
const ST = (c) => `stroke="${shade(c, -60)}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"`;
const svg = (w, h, inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${inner}</svg>`;
const circle = (cx, cy, r, fill = "#f6f1e7", c = "#888") => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${shade(c, -70)}" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`;
const mirror = (w, inner) => `<g transform="translate(${w} 0) scale(-1 1)">${inner}</g>`;
const collar = (w, h, lw, tip, c, extra = "") => {
  const L = `<path d="M0 0 L${lw} 0 L${lw + 4} ${h * 0.7} L${tip} ${h} Z" fill="${shade(c, 6)}" ${ST(c)}/>`;
  return svg(w, h, L + mirror(w, L) + extra);
};

// soft side shading, so fabric tinting visibly PRESERVES it
const SHADE = `<defs><linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".2"/><stop offset=".2" stop-color="#000" stop-opacity="0"/><stop offset=".8" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient></defs>`;
const shaded = (d, c) => `${SHADE}<path d="${d}" fill="${c}" ${ST(c)}/><path d="${d}" fill="url(#sh)"/>`;
const tile = (inner) => svg(8, 8, `<rect width="8" height="8" fill="#fff"/>${inner}`);

const PIECES = {
  "tex-oxford": () => tile('<path d="M0 0H4V4H0zM4 4H8V8H4z" fill="#000" opacity=".07"/>'),
  "tex-twill": () => tile('<path d="M0 8L8 0M-2 2L2 -2M6 10L10 6" stroke="#000" stroke-opacity=".1" stroke-width="1"/>'),
  "tex-linen": () => tile('<path d="M0 2H5M3 5H8M1 7H4" stroke="#000" stroke-opacity=".09" stroke-width=".8"/>'),
  "tex-herringbone": () => tile('<path d="M0 4L2 2L4 4L6 2L8 4M0 8L2 6L4 8L6 6L8 8" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".8"/>'),
  body: (c) => svg(600, 1000, shaded("M70 0 Q300 45 530 0 L600 1000 L0 1000 Z", c)),
  "body-modern": (c) => svg(600, 1000, shaded("M95 0 Q300 70 505 0 L600 1000 L0 1000 Z", c)),
  "sleeve-l": (c) => svg(170, 760, shaded("M170 0 L170 760 L20 760 Q0 330 0 110 Z", shade(c, -6))),
  "sleeve-r": (c) => svg(170, 760, mirror(170, shaded("M170 0 L170 760 L20 760 Q0 330 0 110 Z", shade(c, -6)))),
  "cuff-single": (c) => svg(146, 80, `<rect x="2" y="2" width="142" height="76" rx="10" fill="${shade(c, 4)}" ${ST(c)}/>${circle(118, 40, 7)}`),
  "cuff-double": (c) => svg(146, 110, `<rect x="2" y="2" width="142" height="106" rx="10" fill="${shade(c, 4)}" ${ST(c)}/>${circle(118, 32, 7)}${circle(118, 78, 7)}`),
  "cuff-french": (c) => svg(146, 130, `<rect x="2" y="2" width="142" height="126" rx="10" fill="${shade(c, 4)}" ${ST(c)}/><path d="M2 65 H144" ${ST(c)}/>${circle(104, 32, 8, "#c9a961", "#c9a961")}${circle(104, 98, 8, "#c9a961", "#c9a961")}`),
  "placket-standard": (c) => svg(60, 930, `<rect x="1" y="0" width="58" height="930" fill="${shade(c, 5)}" ${ST(c)}/><path d="M9 0 V930 M51 0 V930" ${ST(c)} opacity=".5"/>`),
  "placket-concealed": (c) => svg(60, 930, `<rect x="1" y="0" width="58" height="930" fill="${c}" opacity=".95"/><path d="M30 0 V930" ${ST(c)} opacity=".35"/>`),
  "buttons-standard": (c) => svg(24, 840, Array.from({ length: 7 }, (_, i) => circle(12, 60 + i * 120, 9, "#f6f1e7", c)).join("")),
  "buttons-concealed": (c) => svg(24, 840, Array.from({ length: 7 }, (_, i) => `<circle cx="12" cy="${60 + i * 120}" r="3" fill="${shade(c, -25)}" opacity=".35"/>`).join("")),
  "pocket-single": (c) => svg(120, 135, `<path d="M1 1 H119 V105 L60 134 L1 105 Z" fill="${shade(c, 4)}" ${ST(c)}/>`),
  "pocket-double": (c) => { const p = (x) => `<path d="M${x + 1} 1 H${x + 119} V105 L${x + 60} 134 L${x + 1} 105 Z" fill="${shade(c, 4)}" ${ST(c)}/>`; return svg(340, 135, p(0) + p(220)); },
  "collar-classic": (c) => collar(300, 140, 148, 60, c),
  "collar-modern": (c) => collar(270, 125, 132, 70, c),
  "collar-spread": (c) => collar(360, 135, 172, 40, c),
  "collar-buttondown": (c) => collar(300, 140, 148, 60, c, circle(48, 102, 6) + circle(252, 102, 6)),
  leg: (c) => svg(230, 1050, `${shaded("M0 0 H230 L205 1050 H30 Z", c)}<path d="M115 0 V1050" ${ST(c)} opacity=".25"/>`),
  waistband: (c) => svg(480, 80, `<rect x="2" y="2" width="476" height="76" rx="6" fill="${shade(c, 8)}" ${ST(c)}/>${circle(240, 40, 9, "#d8d2c4", c)}`),
  "pleats-single": (c) => svg(80, 140, `<path d="M40 0 Q55 70 40 140" fill="none" ${ST(c)}/>`),
  "pleats-double": (c) => svg(130, 140, `<path d="M40 0 Q55 70 40 140 M90 0 Q105 70 90 140" fill="none" ${ST(c)}/>`),
  hem: (c) => svg(226, 60, `<rect x="2" y="2" width="222" height="56" fill="${shade(c, -14)}" ${ST(c)}/>`),
};

export const isSeedRef = (ref) => typeof ref === "string" && ref.startsWith("seed:");
export const seedExists = (ref) => PIECES[ref.slice(5).split("?")[0]] !== undefined;
export const seedRef = (key, color) => `seed:${key}${color ? `?c=${color}` : ""}`;

const cache = new Map();
export function seedDataUrl(ref) {
  if (cache.has(ref)) return cache.get(ref);
  const [key, query = ""] = ref.slice(5).split("?");
  const c = `#${new URLSearchParams(query).get("c") || "f4f6fa"}`;
  const make = PIECES[key];
  const url = make ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(make(c))}` : "";
  cache.set(ref, url);
  return url;
}
