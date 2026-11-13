import { seedRef } from "./seedAssets.js";
import { DEFAULT_CANVAS } from "../engine/coordinateUtils.js";

// Node: `fabric` = the fabric REGION this node is made of (null = not fabric, e.g. buttons).
const node = (id, name, image, x, y, width, height, zIndex, visible = true, fabric = "main") => ({
  id, name, image, x, y, width, height, rotation: 0, visible, zIndex, locked: false, fabric,
});
const opt = (groupId, id, name, priceDelta = 0, updates = {}) => ({ id, groupId, name, priceDelta, updates });
const group = (id, name, defaultOptionId, options) => ({ id, name, defaultOptionId, options });

const SHIRT_FABRICS = [
  { id: "white-poplin", name: "White Poplin", color: "#ffffff", priceDelta: 0 },
  { id: "pink-oxford", name: "Pink Oxford", color: "#f2c4cf", texture: "seed:tex-oxford", tile: 0.7, priceDelta: 200 },
  { id: "sky-twill", name: "Sky Blue Twill", color: "#b9d3ec", texture: "seed:tex-twill", tile: 0.8, priceDelta: 150 },
  { id: "mint-linen", name: "Mint Linen", color: "#cfe6d8", texture: "seed:tex-linen", tile: 0.9, priceDelta: 300 },
  { id: "sand-herringbone", name: "Sand Herringbone", color: "#e2d3b7", texture: "seed:tex-herringbone", tile: 0.8, priceDelta: 350 },
  { id: "lavender-poplin", name: "Lavender Poplin", color: "#d9d0ec", priceDelta: 100 },
  // per-region rule: body in pink Oxford, collar + cuffs ("contrast" region) in white
  { id: "pink-white-collar", name: "Pink Oxford, White Collar", color: "#f2c4cf", texture: "seed:tex-oxford", tile: 0.7, priceDelta: 400, regions: { contrast: { color: "#ffffff", texture: null } } },
  { id: "navy-twill", name: "Navy Twill", color: "#3b4a6b", texture: "seed:tex-twill", tile: 0.8, priceDelta: 250 },
];
/** MINIMAL IMAGE TEST: body + collar, no fabrics, no rules. */
/** MINIMAL IMAGE TEST: body + collar images, WITH color changing! */
export function imageTestShirtTemplate(productId) {
  const u = (k) => `/customizer/${k}`; // Points to public/customizer/
  
  return {
    productId,
    canvas: { ...DEFAULT_CANVAS }, // 1000 x 1400
    baseImage: "",
    fabrics: SHIRT_FABRICS.map((f) => ({ ...f })), // 👈 USE THE COLORS
    defaultFabricId: "white-poplin",               // 👈 START WHITE
    
    sections: [
      { id: "fabric", title: "Fabric Color", kind: "fabric" }, // 👈 SHOW FABRIC SELECTOR
      { id: "collar", title: "Collar Style", groupIds: ["collar-style"] }
    ],
    
    nodes: [
      // Notice the last parameter is now "main" instead of null!
      // This tells the engine to apply the CSS color tint to these images.
      node("body", "Shirt", u("body.png"), 200, 230, 600, 1000, 1, true, "main"),
      node("collar", "Collar", u("collar-point.png"), 350, 220, 300, 140, 2, true, "main"),
    ],
    
    groups: [
      group("collar-style", "Collar Style", "point-collar", [
        opt("collar-style", "point-collar", "Point Collar", 0),
        opt("collar-style", "spread-collar", "Spread Collar", 0, {
          collar: { type: "image", image: u("collar-spread.png") },
        }),
      ]),
    ],
    rules: [],
  };
}
// export function shirtTemplate(productId, fabricId = "white-poplin") {
//   const r = (k) => seedRef(k, "ffffff");
//   return {
//     productId,
//     canvas: { ...DEFAULT_CANVAS },
//     baseImage: r("body"),
//     fabrics: SHIRT_FABRICS.map((f) => ({ ...f })),
//     defaultFabricId: fabricId,
//     sections: [
//       { id: "fabric", title: "Fabric", kind: "fabric" },
//       { id: "collar", title: "Collar", groupIds: ["collar-style"] },
//       { id: "cuff", title: "Cuff", groupIds: ["cuff-style"] },
//       { id: "pocket", title: "Pocket", groupIds: ["pocket-style"] },
//       { id: "placket", title: "Placket", groupIds: ["placket-style"] },
//       { id: "fit", title: "Fit & Size", groupIds: ["fit-style", "size"] },
//     ],
//     nodes: [
//       node("left-sleeve", "Left Sleeve", r("sleeve-l"), 70, 250, 170, 760, 1),
//       node("right-sleeve", "Right Sleeve", r("sleeve-r"), 760, 250, 170, 760, 1),
//       node("body", "Main Body", r("body"), 200, 230, 600, 1000, 2),
//       node("left-cuff", "Left Cuff", r("cuff-single"), 82, 1000, 146, 80, 3, true, "contrast"),
//       node("right-cuff", "Right Cuff", r("cuff-single"), 772, 1000, 146, 80, 3, true, "contrast"),
//       node("placket", "Placket", r("placket-standard"), 470, 300, 60, 930, 4),
//       node("pocket", "Pocket", r("pocket-single"), 585, 420, 120, 135, 5, false),
//       node("buttons", "Buttons", r("buttons-standard"), 488, 330, 24, 840, 6, true, null),
//       node("collar", "Collar", r("collar-classic"), 350, 185, 300, 140, 7, true, "contrast"),
//     ],
//     groups: [
//       group("collar-style", "Collar Style", "classic-collar", [
//         opt("collar-style", "classic-collar", "Point Collar"),
//         opt("collar-style", "modern-collar", "Modern Collar", 300, {
//           collar: { type: "both", image: r("collar-modern"), geometry: { x: 365, y: 192, width: 270, height: 125 } },
//           body: { type: "image", image: r("body-modern") },
//           "left-sleeve": { type: "position", geometry: { y: 244 } },
//           "right-sleeve": { type: "position", geometry: { y: 244 } },
//           buttons: { type: "position", geometry: { y: 340 } },
//           "left-cuff": { type: "none" },
//         }),
//         opt("collar-style", "spread-collar", "Spread Collar", 400, {
//           collar: { type: "both", image: r("collar-spread"), geometry: { x: 320, y: 188, width: 360, height: 135 } },
//           buttons: { type: "position", geometry: { y: 336 } },
//         }),
//         opt("collar-style", "button-down-collar", "Button Down Collar", 250, {
//           collar: { type: "image", image: r("collar-buttondown") },
//         }),
//       ]),
//       group("cuff-style", "Cuff Style", "single-cuff", [
//         opt("cuff-style", "single-cuff", "Single Cuff"),
//         opt("cuff-style", "double-cuff", "Double Cuff", 200, {
//           "left-cuff": { type: "both", image: r("cuff-double"), geometry: { y: 985, height: 110 } },
//           "right-cuff": { type: "both", image: r("cuff-double"), geometry: { y: 985, height: 110 } },
//         }),
//         opt("cuff-style", "french-cuff", "French Cuff", 500, {
//           "left-cuff": { type: "both", image: r("cuff-french"), geometry: { y: 975, height: 130 } },
//           "right-cuff": { type: "both", image: r("cuff-french"), geometry: { y: 975, height: 130 } },
//         }),
//       ]),
//       group("pocket-style", "Pocket Style", "no-pocket", [
//         opt("pocket-style", "no-pocket", "No Pocket"),
//         opt("pocket-style", "single-pocket", "Standard Pocket", 100, { pocket: { type: "position", visible: true } }),
//         opt("pocket-style", "double-pocket", "Double Pocket", 180, {
//           pocket: { type: "both", image: r("pocket-double"), geometry: { x: 330, width: 340 }, visible: true },
//         }),
//       ]),
//       group("placket-style", "Placket Style", "standard-placket", [
//         opt("placket-style", "standard-placket", "Standard Placket"),
//         opt("placket-style", "concealed-placket", "Concealed Placket", 350, {
//           placket: { type: "image", image: r("placket-concealed") },
//           buttons: { type: "both", image: r("buttons-concealed"), geometry: { y: 345 } },
//         }),
//       ]),
//       group("fit-style", "Fit", "classic-fit", [
//         opt("fit-style", "classic-fit", "Classic Fit"),
//         opt("fit-style", "slim-fit", "Slim Fit", 0, {
//           body: { type: "position", geometry: { x: 225, width: 550 } },
//           "left-sleeve": { type: "position", geometry: { x: 95, width: 150 } },
//           "right-sleeve": { type: "position", geometry: { x: 755, width: 150 } },
//           "left-cuff": { type: "position", geometry: { x: 107, width: 126 } },
//           "right-cuff": { type: "position", geometry: { x: 767, width: 126 } },
//         }),
//       ]),
//       group("size", "Size", "size-m", ["S", "M", "L", "XL"].map((s) => opt("size", `size-${s.toLowerCase()}`, s))),
//     ],
//     rules: [
//       { id: "rule-concealed-needs-collar", type: "requires", optionId: "concealed-placket", targetOptionIds: ["modern-collar", "spread-collar"], message: "" },
//       { id: "rule-double-pocket-vs-concealed", type: "excludes", optionId: "double-pocket", targetOptionIds: ["concealed-placket"], message: "" },
//     ],
//   };
// }






export function shirtTemplate(productId, fabricId = "white-poplin") {
  const u = (k) => `/customizer/${k}`; // Points to public/customizer/
  
  return {
    productId,
    canvas: { ...DEFAULT_CANVAS }, // 1000 x 1400
    baseImage: "",
    fabrics: SHIRT_FABRICS.map((f) => ({ ...f })),
    defaultFabricId: fabricId,
    
    // Sirf wahi sections jo images ke hisaab se kaam karte hain
    sections: [
      { id: "fabric", title: "Fabric Color", kind: "fabric" },
      { id: "collar", title: "Collar Style", groupIds: ["collar-style"] },
    ],
    
    nodes: [
      // 1. Base Model (Skin won't tint because fabric is null)
      node("model-base", "Male Model", u("model-base.png"), 150, 100, 700, 1200, 0, true, null),

      // 2. Sleeves
      node("left-sleeve", "Left Sleeve", u("sleeve-left.png"), 110, 300, 180, 600, 1, true, "main"),
      node("right-sleeve", "Right Sleeve", u("sleeve-right.png"), 710, 300, 180, 600, 1, true, "main"),
      
      // 3. Main Body (Torso + Sleeves attached)
      node("body", "Main Body", u("body.png"), 250, 280, 500, 650, 2, true, "main"),
      
      // 4. Collar (Point Collar by default)
      node("collar", "Collar", u("collar-point.png"), 380, 240, 240, 120, 7, true, "contrast"),
    ],
    
    groups: [
      group("collar-style", "Collar Style", "classic-collar", [
        opt("collar-style", "classic-collar", "Point Collar"),
        opt("collar-style", "spread-collar", "Spread Collar", 400, {
          collar: { type: "image", image: u("collar-spread.png") },
        }),
      ]),
    ],
    
    // No rules needed for this simple setup
    rules: [],
  };
}

/** MINIMAL JACKET OVERLAY TEST: fixed model + isolated jacket PNG. */
export function jacketImageTestTemplate(productId) {
  const u = (k) => `/customizer/${k}`;

  return {
    productId,
    canvas: { ...DEFAULT_CANVAS }, // 1000 x 1400
    baseImage: "",
    fabrics: [],
    defaultFabricId: null,
    sections: [],
    nodes: [
      // Both PNGs use the same full-canvas framing: 1060 x 1484 (same aspect ratio).
      node("model-base", "Fixed Model", u("model-base.png"), 0, 0, 1000, 1400, 0, true, null),
      node("jacket-body", "Jacket Body", u("jacket-body.png"), 0, 0, 1000, 1400, 1, true, null),
    ],
    groups: [],
    rules: [],
  };
}

const TROUSER_FABRICS = [
  { id: "charcoal", name: "Charcoal Wool", color: "#4a4e57", texture: "seed:tex-twill", tile: 0.8, priceDelta: 0 },
  { id: "navy", name: "Navy Wool", color: "#2f3b57", texture: "seed:tex-twill", tile: 0.8, priceDelta: 200 },
  { id: "stone", name: "Stone Cotton", color: "#cfc8b8", texture: "seed:tex-oxford", tile: 0.7, priceDelta: 100 },
];

export function trouserTemplate(productId, fabricId = "charcoal") {
  const r = (k) => seedRef(k, "ffffff");
  return {
    productId,
    canvas: { ...DEFAULT_CANVAS },
    baseImage: r("leg"),
    fabrics: TROUSER_FABRICS.map((f) => ({ ...f })),
    defaultFabricId: fabricId,
    sections: [
      { id: "fabric", title: "Fabric", kind: "fabric" },
      { id: "fit", title: "Fit", groupIds: ["fit"] },
      { id: "pleats", title: "Pleats", groupIds: ["pleats-style"] },
      { id: "hem", title: "Hem", groupIds: ["hem-style"] },
    ],
    nodes: [
      node("left-leg", "Left Leg", r("leg"), 260, 250, 230, 1050, 1),
      node("right-leg", "Right Leg", r("leg"), 510, 250, 230, 1050, 1),
      node("left-hem", "Left Hem", r("hem"), 263, 1240, 224, 60, 2, false),
      node("right-hem", "Right Hem", r("hem"), 513, 1240, 224, 60, 2, false),
      node("waistband", "Waistband", r("waistband"), 260, 180, 480, 80, 3),
      node("pleats", "Pleats", r("pleats-single"), 300, 270, 80, 140, 4, false, null),
    ],
    groups: [
      group("fit", "Fit", "slim-fit", [
        opt("fit", "slim-fit", "Slim Fit"),
        opt("fit", "regular-fit", "Regular Fit", 0, {
          "left-leg": { type: "position", geometry: { x: 240, width: 255 } },
          "right-leg": { type: "position", geometry: { x: 505, width: 255 } },
          waistband: { type: "position", geometry: { x: 240, width: 520 } },
        }),
      ]),
      group("pleats-style", "Pleats", "flat-front", [
        opt("pleats-style", "flat-front", "Flat Front"),
        opt("pleats-style", "single-pleat", "Single Pleat", 150, { pleats: { type: "position", visible: true } }),
        opt("pleats-style", "double-pleat", "Double Pleat", 250, {
          pleats: { type: "both", image: r("pleats-double"), geometry: { width: 130 }, visible: true },
        }),
      ]),
      group("hem-style", "Hem", "plain-hem", [
        opt("hem-style", "plain-hem", "Plain Hem"),
        opt("hem-style", "cuffed-hem", "Cuffed Hem", 200, {
          "left-hem": { type: "position", visible: true },
          "right-hem": { type: "position", visible: true },
        }),
      ]),
    ],
    rules: [],
  };
}

export const blankTemplate = (productId) => ({
  productId, canvas: { ...DEFAULT_CANVAS }, baseImage: "", nodes: [], groups: [], rules: [], fabrics: [], defaultFabricId: null, sections: [],
});

export const PRESETS = {
  shirt: { label: "Shirt layout", build: shirtTemplate },
  trousers: { label: "Trousers layout", build: trouserTemplate },
  blank: { label: "Blank (add nodes yourself)", build: blankTemplate },
    imageTest: { label: "Image test (Body + Collar)", build: imageTestShirtTemplate },
  jacketImageTest: { label: "Jacket overlay test", build: jacketImageTestTemplate }, // <--- ADD THIS

};

const DEMO = [
  { id: "presidential-oxford-shirt", name: "Presidential Oxford Shirt", category: "Shirts", basePrice: 5200, preset: "shirt", fabric: "pink-oxford", description: "Our signature Oxford weave with a refined, structured hand-feel." },
  { id: "classic-formal-shirt", name: "Classic Formal Shirt", category: "Shirts", basePrice: 4200, preset: "shirt", fabric: "sky-twill", description: "A timeless formal shirt in fine two-ply cotton." },
  { id: "modern-slim-fit-shirt", name: "Modern Slim Fit Shirt", category: "Shirts", basePrice: 4600, preset: "shirt", fabric: "white-poplin", description: "Cut closer to the body for a sharp, contemporary line." },
  { id: "premium-business-shirt", name: "Premium Business Shirt", category: "Shirts", basePrice: 5800, preset: "shirt", fabric: "sand-herringbone", description: "Long-staple Egyptian cotton made for the boardroom." },
  { id: "tailored-formal-trousers", name: "Tailored Formal Trousers", category: "Trousers", basePrice: 6400, preset: "trousers", fabric: "charcoal", description: "Hand-finished trousers with a clean, elegant drape." },
    { id: "image-test-shirt", name: "Image Test Shirt", category: "Shirts", basePrice: 2000, preset: "imageTest", description: "Real PNG images, no seed SVGs, no fabrics." },
  { id: "jacket-overlay-test", name: "Jacket Overlay Test", category: "Jackets", basePrice: 0, preset: "jacketImageTest", description: "Fixed model with aligned transparent jacket overlay." },
];

/** Seeds products + drafts + one published version each, so the customer panel works immediately. */
export function buildSeed() {
  const now = new Date().toISOString();
  const products = [], drafts = {}, versions = {};
  for (const d of DEMO) {
    const template = PRESETS[d.preset].build(d.id, d.fabric);
    const versionId = `ver_${d.id}_1`;
    products.push({ id: d.id, name: d.name, description: d.description, category: d.category, basePrice: d.basePrice, status: "published", publishedVersionId: versionId, createdAt: now, updatedAt: now });
    drafts[d.id] = template;
    versions[versionId] = { id: versionId, productId: d.id, number: 1, publishedAt: now, template: JSON.parse(JSON.stringify(template)) };
  }
  return { products, drafts, versions };
}
