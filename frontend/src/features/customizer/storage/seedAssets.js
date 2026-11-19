// Premium Vector Art Generated on the fly
const shade = (hex, amt) => {
  const n = parseInt(hex.replace("#", ""), 16);
  const f = (v) => Math.max(0, Math.min(255, v + amt));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join("")}`;
};

const ST = (c, w = 2) => `stroke="${shade(c, -60)}" stroke-width="${w}" vector-effect="non-scaling-stroke" stroke-linejoin="round"`;
const svg = (w, h, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${inner}</svg>`;
const mirror = (w, inner) => `<g transform="translate(${w} 0) scale(-1 1)">${inner}</g>`;
const circle = (cx, cy, r, fill = "#fff", c = "#888") => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${shade(c, -40)}" stroke-width="1.5"/>`;

const SHADE = `
  <defs>
    <linearGradient id="shadeSide" x1="0" x2="1">
      <stop offset="0" stop-color="#000" stop-opacity=".15"/>
      <stop offset=".2" stop-color="#000" stop-opacity="0"/>
      <stop offset=".8" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".15"/>
    </linearGradient>
    <linearGradient id="shadeBottom" x1="0" x2="0" y1="0" y2="1">
      <stop offset=".6" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".15"/>
    </linearGradient>
    <linearGradient id="skinGrad" x1="0" x2="1">
      <stop offset="0" stop-color="#e8c3a8"/>
      <stop offset=".5" stop-color="#f4d4bd"/>
      <stop offset="1" stop-color="#e8c3a8"/>
    </linearGradient>
  </defs>
`;

const collarShape = (w, h, lw, tip, c) => {
  const L = `
    <path d="M${w/2} 0 L${w/2 - lw} 0 Q${w/2 - lw/2} ${h*0.4} ${w/2 - tip} ${h} L${w/2} ${h*0.7} Z" fill="${shade(c, 5)}" ${ST(c, 1.5)}/>
    <path d="M${w/2} 0 L${w/2 - lw} 0 Q${w/2 - lw/2} ${h*0.4} ${w/2 - tip} ${h} L${w/2} ${h*0.7} Z" fill="url(#shadeSide)" opacity="0.5"/>
  `;
  return svg(w, h, SHADE + L + mirror(w, L));
};

const PIECES = {
  "tex-oxford": () => svg(10, 10, `<rect width="10" height="10" fill="#fff"/><path d="M0 5H10M5 0V10" stroke="#000" stroke-opacity=".08" stroke-width="2"/>`),
  "tex-twill": () => svg(10, 10, `<rect width="10" height="10" fill="#fff"/><path d="M0 10L10 0" stroke="#000" stroke-opacity=".1" stroke-width="2"/>`),
  "tex-linen": () => svg(10, 10, `<rect width="10" height="10" fill="#fff"/><path d="M0 2H4M6 6H10M2 8H8" stroke="#000" stroke-opacity=".1" stroke-width="1.5"/>`),
  "tex-herringbone": () => svg(10, 10, `<rect width="10" height="10" fill="#fff"/><path d="M0 5L3 2L6 5L9 2" fill="none" stroke="#000" stroke-opacity=".1" stroke-width="1.5"/>`),

  "model-base": (c) => svg(800, 1200, `
    ${SHADE}
    <path d="M320 0 L480 0 L480 120 Q400 150 320 120 Z" fill="url(#skinGrad)"/>
    <path d="M320 120 Q250 150 150 250 L100 800 L700 800 L650 250 Q550 150 480 120 Z" fill="url(#skinGrad)"/>
    <path d="M100 800 L700 800 L750 1200 L50 1200 Z" fill="#4a4e57"/>
  `),

  // ?? NEW: Back view model & flat lay
  "model-back": (c) => svg(800, 1200, `
    ${SHADE}
    <!-- Neck -->
    <path d="M320 0 L480 0 L480 120 Q400 150 320 120 Z" fill="url(#skinGrad)"/>
    <!-- Hair -->
    <path d="M280 0 Q400 -50 520 0 Q520 80 480 100 Q400 120 320 100 Q280 80 280 0 Z" fill="#4a2e15"/>
    <!-- Torso -->
    <path d="M320 120 Q250 150 150 250 L100 800 L700 800 L650 250 Q550 150 480 120 Z" fill="url(#skinGrad)"/>
    <!-- Pants -->
    <path d="M100 800 L700 800 L750 1200 L50 1200 Z" fill="#4a4e57"/>
  `),

  body: (c) => svg(600, 1000, `
    ${SHADE}
    <path d="M70 0 Q300 50 530 0 L580 950 Q300 1000 20 950 Z" fill="${c}" ${ST(c, 2.5)}/>
    <path d="M70 0 Q300 50 530 0 L580 950 Q300 1000 20 950 Z" fill="url(#shadeSide)"/>
    <path d="M300 50 V980" stroke="${shade(c, -40)}" stroke-width="2" opacity="0.5"/> 
  `),

  "body-back": (c) => svg(600, 1000, `
    ${SHADE}
    <path d="M70 0 Q300 50 530 0 L580 950 Q300 1000 20 950 Z" fill="${c}" ${ST(c, 2.5)}/>
    <path d="M70 0 Q300 50 530 0 L580 950 Q300 1000 20 950 Z" fill="url(#shadeSide)"/>
    <!-- Back Yoke -->
    <path d="M70 0 Q300 100 530 0" fill="none" stroke="${shade(c, -30)}" stroke-width="2" opacity="0.4"/>
  `),

  "sleeve-l": (c) => svg(180, 760, `<path d="M180 0 Q150 300 140 760 L30 760 Q20 400 0 120 Z" fill="${shade(c, -5)}" ${ST(c, 2.5)}/><path d="M180 0 Q150 300 140 760 L30 760 Q20 400 0 120 Z" fill="url(#shadeSide)"/>`),
  "sleeve-r": (c) => svg(180, 760, `<path d="M0 0 Q30 300 40 760 L150 760 Q160 400 180 120 Z" fill="${shade(c, -5)}" ${ST(c, 2.5)}/><path d="M0 0 Q30 300 40 760 L150 760 Q160 400 180 120 Z" fill="url(#shadeSide)"/>`),
  "collar-classic": (c) => collarShape(320, 150, 150, 60, c),
  "collar-spread": (c) => collarShape(380, 145, 180, 35, c),
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
