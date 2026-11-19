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

// Advanced Gradients for realistic depth
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
  // Realistic collar with inner band and fold
  const L = `
    <path d="M${w/2} 0 L${w/2 - lw} 0 Q${w/2 - lw/2} ${h*0.4} ${w/2 - tip} ${h} L${w/2} ${h*0.7} Z" fill="${shade(c, 5)}" ${ST(c, 1.5)}/>
    <path d="M${w/2} 0 L${w/2 - lw} 0 Q${w/2 - lw/2} ${h*0.4} ${w/2 - tip} ${h} L${w/2} ${h*0.7} Z" fill="url(#shadeSide)" opacity="0.5"/>
  `;
  return svg(w, h, SHADE + L + mirror(w, L));
};

const PIECES = {
  // --- PREMIUM TEXTURES ---
  "tex-oxford": () => svg(10, 10, `<rect width="10" height="10" fill="#fff"/><path d="M0 5H10M5 0V10" stroke="#000" stroke-opacity=".08" stroke-width="2"/>`),
  "tex-twill": () => svg(10, 10, `<rect width="10" height="10" fill="#fff"/><path d="M0 10L10 0" stroke="#000" stroke-opacity=".1" stroke-width="2"/>`),
  "tex-linen": () => svg(10, 10, `<rect width="10" height="10" fill="#fff"/><path d="M0 2H4M6 6H10M2 8H8" stroke="#000" stroke-opacity=".1" stroke-width="1.5"/>`),
  "tex-herringbone": () => svg(10, 10, `<rect width="10" height="10" fill="#fff"/><path d="M0 5L3 2L6 5L9 2" fill="none" stroke="#000" stroke-opacity=".1" stroke-width="1.5"/>`),

  // --- PREMIUM MODEL ---
  "model-base": (c) => svg(800, 1200, `
    ${SHADE}
    <!-- Neck -->
    <path d="M320 0 L480 0 L480 120 Q400 150 320 120 Z" fill="url(#skinGrad)"/>
    <path d="M320 120 Q400 150 480 120 L480 100 Q400 130 320 100 Z" fill="#d4a373" opacity="0.4"/> <!-- Neck Shadow -->
    <!-- Torso (Under shirt) -->
    <path d="M320 120 Q250 150 150 250 L100 800 L700 800 L650 250 Q550 150 480 120 Z" fill="url(#skinGrad)"/>
    <!-- Grey Pants -->
    <path d="M100 800 L700 800 L750 1200 L50 1200 Z" fill="#4a4e57"/>
    <path d="M100 800 L700 800 L750 1200 L50 1200 Z" fill="url(#shadeSide)"/>
    <path d="M400 800 L400 1200" stroke="#2f3b57" stroke-width="4"/>
  `),

  // --- PREMIUM SHIRT PARTS ---
  // The body has a realistic curve and fold lines
  body: (c) => svg(600, 1000, `
    ${SHADE}
    <!-- Main Body Base -->
    <path d="M70 0 Q300 50 530 0 L580 950 Q300 1000 20 950 Z" fill="${c}" ${ST(c, 2.5)}/>
    <!-- Depth Shadows -->
    <path d="M70 0 Q300 50 530 0 L580 950 Q300 1000 20 950 Z" fill="url(#shadeSide)"/>
    <path d="M70 0 Q300 50 530 0 L580 950 Q300 1000 20 950 Z" fill="url(#shadeBottom)"/>
    <!-- Armhole Seams (Curves indicating sleeves attach) -->
    <path d="M70 0 Q100 150 120 250" fill="none" stroke="${shade(c, -30)}" stroke-width="2" opacity="0.4"/>
    <path d="M530 0 Q500 150 480 250" fill="none" stroke="${shade(c, -30)}" stroke-width="2" opacity="0.4"/>
    <!-- Fabric Folds (Subtle lines) -->
    <path d="M150 300 Q170 500 130 800 M450 300 Q430 500 470 800" fill="none" stroke="${shade(c, -20)}" stroke-width="1.5" opacity="0.3"/>
    <path d="M300 50 V980" stroke="${shade(c, -40)}" stroke-width="2" opacity="0.5"/> <!-- Center Placket Line -->
  `),

  // Realistic tapered sleeve with elbow fold
  "sleeve-l": (c) => svg(180, 760, `
    ${SHADE}
    <path d="M180 0 Q150 300 140 760 L30 760 Q20 400 0 120 Z" fill="${shade(c, -5)}" ${ST(c, 2.5)}/>
    <path d="M180 0 Q150 300 140 760 L30 760 Q20 400 0 120 Z" fill="url(#shadeSide)"/>
    <!-- Elbow Fold -->
    <path d="M120 380 Q80 400 60 380" fill="none" stroke="${shade(c, -30)}" stroke-width="2" opacity="0.4"/>
  `),
  "sleeve-r": (c) => svg(180, 760, `
    ${SHADE}
    <path d="M0 0 Q30 300 40 760 L150 760 Q160 400 180 120 Z" fill="${shade(c, -5)}" ${ST(c, 2.5)}/>
    <path d="M0 0 Q30 300 40 760 L150 760 Q160 400 180 120 Z" fill="url(#shadeSide)"/>
    <!-- Elbow Fold -->
    <path d="M60 380 Q100 400 120 380" fill="none" stroke="${shade(c, -30)}" stroke-width="2" opacity="0.4"/>
  `),

  // Collar with realistic folds
  "collar-classic": (c) => collarShape(320, 150, 150, 60, c),
  "collar-modern": (c) => collarShape(280, 130, 130, 75, c),
  "collar-spread": (c) => collarShape(380, 145, 180, 35, c),
  "collar-buttondown": (c) => svg(320, 150, collarShape(320, 150, 150, 60, c).replace('</svg>', '') + `<circle cx="50" cy="110" r="5" fill="#fff" ${ST(c, 1)}/><circle cx="270" cy="110" r="5" fill="#fff" ${ST(c, 1)}/></svg>`),

  // Cuffs with 3D look
  "cuff-single": (c) => svg(150, 80, `${SHADE}<rect x="2" y="2" width="146" height="76" rx="6" fill="${shade(c, 8)}" ${ST(c, 2)}/><rect x="2" y="2" width="146" height="76" rx="6" fill="url(#shadeSide)"/>${circle(120, 40, 7)}`),
  "cuff-double": (c) => svg(150, 110, `${SHADE}<rect x="2" y="2" width="146" height="106" rx="6" fill="${shade(c, 8)}" ${ST(c, 2)}/><rect x="2" y="2" width="146" height="106" rx="6" fill="url(#shadeSide)"/>${circle(120, 30, 7)}${circle(120, 80, 7)}`),
  "cuff-french": (c) => svg(150, 130, `${SHADE}<rect x="2" y="2" width="146" height="126" rx="6" fill="${shade(c, 8)}" ${ST(c, 2)}/><rect x="2" y="2" width="146" height="126" rx="6" fill="url(#shadeSide)"/><path d="M2 65 H148" ${ST(c)}/>${circle(110, 32, 8, "#c9a961", "#c9a961")}${circle(110, 98, 8, "#c9a961", "#c9a961")}`),

  // Placket
  "placket-standard": (c) => svg(60, 950, `${SHADE}<rect x="1" y="0" width="58" height="950" fill="${shade(c, 6)}" ${ST(c, 1.5)}/><rect x="1" y="0" width="58" height="950" fill="url(#shadeSide)"/><path d="M10 0 V950 M50 0 V950" stroke="${shade(c, -30)}" stroke-width="1.5" opacity=".6"/>`),
  "placket-concealed": (c) => svg(60, 950, `<rect x="1" y="0" width="58" height="950" fill="${c}" opacity=".98"/><path d="M30 0 V950" ${ST(c)} opacity=".4"/>`),

  // Buttons with shine
  "buttons-standard": (c) => svg(24, 850, Array.from({ length: 7 }, (_, i) => `
    <g transform="translate(12, ${60 + i * 125})">
      <circle cx="0" cy="0" r="9" fill="#fff" stroke="#ccc" stroke-width="1"/>
      <circle cx="-2" cy="-2" r="3" fill="#fff" opacity="0.8"/>
      <circle cx="0" cy="0" r="9" fill="url(#shadeSide)" opacity="0.3"/>
    </g>
  `).join("")),

  // Pocket
  "pocket-single": (c) => svg(130, 140, `${SHADE}<path d="M2 2 H128 V110 L65 138 L2 110 Z" fill="${shade(c, 8)}" ${ST(c, 1.5)}/><path d="M2 2 H128 V110 L65 138 L2 110 Z" fill="url(#shadeSide)"/><path d="M2 2 H128" stroke="${shade(c, -40)}" stroke-width="2"/>`),

  // Trousers
  leg: (c) => svg(240, 1050, `${SHADE}<path d="M0 0 H240 L210 1050 H30 Z" fill="${c}" ${ST(c)}/><path d="M0 0 H240 L210 1050 H30 Z" fill="url(#shadeSide)"/><path d="M120 0 V1050" ${ST(c)} opacity=".2"/>`),
  waistband: (c) => svg(500, 80, `<rect x="2" y="2" width="496" height="76" rx="4" fill="${shade(c, 10)}" ${ST(c)}/>${circle(250, 40, 9, "#d8d2c4", c)}`),
  "pleats-single": (c) => svg(80, 140, `<path d="M40 0 Q55 70 40 140" fill="none" ${ST(c)}/>`),
  "pleats-double": (c) => svg(140, 140, `<path d="M40 0 Q55 70 40 140 M100 0 Q115 70 100 140" fill="none" ${ST(c)}/>`),
  hem: (c) => svg(240, 60, `<rect x="2" y="2" width="236" height="56" fill="${shade(c, -15)}" ${ST(c)}/>`),
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