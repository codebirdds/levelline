import { seedRef } from "./seedAssets.js";
import { DEFAULT_CANVAS } from "../engine/coordinateUtils.js";

const node = (id, name, image, x, y, width, height, zIndex, visible = true, fabric = "main", view = "front", extra = {}) => ({
  id, name, image, x, y, width, height, rotation: 0, visible, zIndex, locked: false, fabric, view,
  useVariants: false, imageVariants: [], ...extra,
});
const opt = (groupId, id, name, priceDelta = 0, updates = {}) => ({ id, groupId, name, priceDelta, updates });
const group = (id, name, defaultOptionId, options) => ({ id, name, defaultOptionId, options });

const SHIRT_FABRICS = [
  { id: "white-poplin", name: "White Poplin", color: "#ffffff", priceDelta: 0 },
  { id: "pink-oxford", name: "Pink Oxford", color: "#f2c4cf", texture: "seed:tex-oxford", tile: 0.7, priceDelta: 200 },
  { id: "sky-twill", name: "Sky Blue Twill", color: "#b9d3ec", texture: "seed:tex-twill", tile: 0.8, priceDelta: 150 },
  { id: "mint-linen", name: "Mint Linen", color: "#cfe6d8", texture: "seed:tex-linen", tile: 0.9, priceDelta: 300 },
  { id: "navy-twill", name: "Navy Twill", color: "#3b4a6b", texture: "seed:tex-twill", tile: 0.8, priceDelta: 250 },
];

export function realFrontShirtTemplate(productId, fabricId = "white-poplin") {
  const u = (k) => `/customizer/${k}`; 
  
  // Aapka diya hua exact geometry
  const collarGeo = { x: 60, y: -23, width: 872, height: 1212 };

  return {
    productId, canvas: { ...DEFAULT_CANVAS }, baseImage: "",
    fabrics: SHIRT_FABRICS.map((f) => ({ ...f })), defaultFabricId: fabricId,
    sections: [
      { id: "fabric", title: "Fabric Color", kind: "fabric" },
      { id: "collar", title: "Collar Style", groupIds: ["collar-style"] },
      { id: "pocket", title: "Pocket Style", groupIds: ["pocket-style"] },
    ],
    nodes: [
      // 1. MODEL (Aapke diye hue coordinates)
      node("model-base", "Male Model", u("model-base.png"), 74, 50, 849, 1253, 0, true, null, "front"),
      
      // 2. SHIRT BODY (Aapke diye hue coordinates)
      node("body-front", "Shirt Body", u("body-front.png"), 59, -26, 872, 1218, 1, true, "main", "front"),
      
      // 3. COLLAR (Aapke diye hue coordinates)
      node("collar-front", "Collar", u("collar-point.png"), collarGeo.x, collarGeo.y, collarGeo.width, collarGeo.height, 2, true, "main", "front"),
      
      // 4. POCKET (Scale ke hisaab se adjust kiya hai)
      node("pocket-front", "Pocket", u("pocket-point.png"), 340, 520, 160, 190, 3, false, "main", "front"),
    ],
    groups: [
      group("collar-style", "Collar Style", "collar-point", [
        opt("collar-style", "collar-point", "Point Collar", 0, { "collar-front": { type: "both", image: u("collar-point.png"), geometry: collarGeo } }),
        opt("collar-style", "collar-spread", "Spread Collar", 0, { "collar-front": { type: "both", image: u("collar-spread.png"), geometry: collarGeo } }),
        opt("collar-style", "collar-cutaway", "Cutaway Collar", 0, { "collar-front": { type: "both", image: u("collar-cutaway.png"), geometry: collarGeo } }),
        opt("collar-style", "collar-buttondown", "Button Down", 0, { "collar-front": { type: "both", image: u("collar-buttondown.png"), geometry: collarGeo } }),
        opt("collar-style", "collar-band", "Band Collar", 0, { "collar-front": { type: "both", image: u("collar-band.png"), geometry: collarGeo } }),
        opt("collar-style", "collar-club", "Club Collar", 0, { "collar-front": { type: "both", image: u("collar-club.png"), geometry: collarGeo } }),
        opt("collar-style", "collar-wing", "Wing Collar", 0, { "collar-front": { type: "both", image: u("collar-wing.png"), geometry: collarGeo } }),
      ]),
      group("pocket-style", "Pocket Style", "no-pocket", [
        opt("pocket-style", "no-pocket", "No Pocket", 0, { "pocket-front": { type: "position", visible: false } }),
        opt("pocket-style", "pocket-point", "Point Pocket", 100, { "pocket-front": { type: "both", image: u("pocket-point.png"), visible: true } }),
        opt("pocket-style", "pocket-rounded", "Rounded Pocket", 150, { "pocket-front": { type: "both", image: u("pocket-rounded.png"), visible: true } }),
        opt("pocket-style", "pocket-square", "Square Pocket", 100, { "pocket-front": { type: "both", image: u("pocket-square.png"), visible: true } }),
      ]),
    ],
    rules: [],
  };
}

export function imageTestShirtTemplate(productId) {
  const u = (k) => `/customizer/${k}`;
  return {
    productId, canvas: { ...DEFAULT_CANVAS }, baseImage: "",
    fabrics: SHIRT_FABRICS.map((f) => ({ ...f })), defaultFabricId: "white-poplin",
    sections: [
      { id: "fabric", title: "Fabric", kind: "fabric" },
      { id: "collar", title: "Collar Style", groupIds: ["collar-style"] },
    ],
    nodes: [
      node("body", "Shirt", u("body-front.png"), 200, 200, 600, 1000, 1, true, "main", "front"),
      node("collar", "Collar", u("collar-point.png"), 320, 190, 360, 180, 2, true, "main", "front"),
    ],
    groups: [
      group("collar-style", "Collar Style", "point-collar", [
        opt("collar-style", "point-collar", "Point Collar", 0),
      ]),
    ],
    rules: [],
  };
}

export function shirtTemplate(productId, fabricId = "white-poplin") {
  const u = (k) => `/customizer/${k}`;
  const r = (k) => seedRef(k, "ffffff");
  return {
    productId, canvas: { ...DEFAULT_CANVAS }, baseImage: "",
    fabrics: SHIRT_FABRICS.map((f) => ({ ...f })), defaultFabricId: fabricId,
    sections: [
      { id: "fabric", title: "Fabric", kind: "fabric" },
      { id: "collar", title: "Collar Style", groupIds: ["collar-style"] },
    ],
    nodes: [
      node("model-base", "Male Model", u("model-base.png"), 150, 100, 700, 1200, 0, true, null, "front"),
      node("left-sleeve", "Left Sleeve", u("sleeve-left.png"), 110, 300, 180, 600, 1, true, "main", "front"),
      node("right-sleeve", "Right Sleeve", u("sleeve-right.png"), 710, 300, 180, 600, 1, true, "main", "front"),
      node("body", "Main Body", u("body-front.png"), 250, 280, 500, 650, 2, true, "main", "front"),
      node("collar", "Collar", u("collar-point.png"), 380, 240, 240, 120, 7, true, "main", "front"),
      node("back-model", "Back Model", r("model-back"), 150, 100, 700, 1200, 0, true, null, "back"),
      node("back-shirt", "Back Shirt", r("body-back"), 250, 280, 500, 650, 1, true, "main", "back"),
    ],
    groups: [
      group("collar-style", "Collar Style", "classic-collar", [
        opt("collar-style", "classic-collar", "Point Collar"),
        opt("collar-style", "spread-collar", "Spread Collar", 400, { collar: { type: "image", image: u("collar-spread.png") } }),
      ]),
    ],
    rules: [],
  };
}

export function jacketImageTestTemplate(productId) {
  const u = (k) => `/customizer/${k}`;
  return {
    productId, canvas: { ...DEFAULT_CANVAS }, baseImage: "",
    fabrics: [], defaultFabricId: null, sections: [],
    nodes: [
      node("model-base", "Fixed Model", u("model-base.png"), 0, 0, 1000, 1400, 0, true, null, "front"),
      node("jacket-body", "Jacket Body", u("jacket-body.png"), 0, 0, 1000, 1400, 1, true, null, "front"),
    ],
    groups: [], rules: [],
  };
}

export function trouserTemplate(productId, fabricId = "charcoal") {
  const r = (k) => seedRef(k, "ffffff");
  return {
    productId, canvas: { ...DEFAULT_CANVAS }, baseImage: r("leg"),
    fabrics: [
      { id: "charcoal", name: "Charcoal Wool", color: "#4a4e57", texture: "seed:tex-twill", tile: 0.8, priceDelta: 0 },
      { id: "navy", name: "Navy Wool", color: "#2f3b57", texture: "seed:tex-twill", tile: 0.8, priceDelta: 200 },
      { id: "stone", name: "Stone Cotton", color: "#cfc8b8", texture: "seed:tex-oxford", tile: 0.7, priceDelta: 100 },
    ],
    defaultFabricId: fabricId,
    sections: [
      { id: "fabric", title: "Fabric", kind: "fabric" },
      { id: "fit", title: "Fit", groupIds: ["fit"] },
      { id: "pleats", title: "Pleats", groupIds: ["pleats-style"] },
      { id: "hem", title: "Hem", groupIds: ["hem-style"] },
    ],
    nodes: [
      node("left-leg", "Left Leg", r("leg"), 260, 250, 230, 1050, 1, true, "main", "front"),
      node("right-leg", "Right Leg", r("leg"), 510, 250, 230, 1050, 1, true, "main", "front"),
      node("left-hem", "Left Hem", r("hem"), 263, 1240, 224, 60, 2, false, "main", "front"),
      node("right-hem", "Right Hem", r("hem"), 513, 1240, 224, 60, 2, false, "main", "front"),
      node("waistband", "Waistband", r("waistband"), 260, 180, 480, 80, 3, true, "main", "front"),
      node("pleats", "Pleats", r("pleats-single"), 300, 270, 80, 140, 4, false, null, "front"),
      node("product-leg", "Flat Leg", r("leg"), 260, 250, 230, 1050, 1, true, "main", "product"),
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
        opt("pleats-style", "double-pleat", "Double Pleat", 250, { pleats: { type: "both", image: r("pleats-double"), geometry: { width: 130 }, visible: true } }),
      ]),
      group("hem-style", "Hem", "plain-hem", [
        opt("hem-style", "plain-hem", "Plain Hem"),
        opt("hem-style", "cuffed-hem", "Cuffed Hem", 200, { "left-hem": { type: "position", visible: true }, "right-hem": { type: "position", visible: true } }),
      ]),
    ],
    rules: [],
  };
}

export const blankTemplate = (productId) => ({
  productId, canvas: { ...DEFAULT_CANVAS }, baseImage: "", nodes: [], groups: [], rules: [], fabrics: [], defaultFabricId: null, sections: [],
});

export const PRESETS = {
  frontViewShirt: { label: "Real Front View Shirt (Images)", build: realFrontShirtTemplate },
  shirt: { label: "Shirt layout (Model)", build: shirtTemplate },
  trousers: { label: "Trousers layout", build: trouserTemplate },
  blank: { label: "Blank (add nodes yourself)", build: blankTemplate },
  imageTest: { label: "Image test (Body + Collar)", build: imageTestShirtTemplate },
  jacketImageTest: { label: "Jacket overlay test", build: jacketImageTestTemplate },
};

const DEMO = [
  { id: "real-front-shirt", name: "Real Front Shirt", category: "Shirts", basePrice: 4500, preset: "frontViewShirt", fabric: "white-poplin", description: "Real front view with multiple collars and pockets.", hasFlatView: false },
  { id: "presidential-oxford-shirt", name: "Presidential Oxford Shirt", category: "Shirts", basePrice: 5200, preset: "shirt", fabric: "pink-oxford", description: "Our signature Oxford weave with a refined, structured hand-feel.", hasFlatView: true },
  { id: "classic-formal-shirt", name: "Classic Formal Shirt", category: "Shirts", basePrice: 4200, preset: "shirt", fabric: "sky-twill", description: "A timeless formal shirt in fine two-ply cotton.", hasFlatView: false },
  { id: "modern-slim-fit-shirt", name: "Modern Slim Fit Shirt", category: "Shirts", basePrice: 4600, preset: "shirt", fabric: "white-poplin", description: "Cut closer to the body for a sharp, contemporary line.", hasFlatView: false },
  { id: "premium-business-shirt", name: "Premium Business Shirt", category: "Shirts", basePrice: 5800, preset: "shirt", fabric: "sand-herringbone", description: "Long-staple Egyptian cotton made for the boardroom.", hasFlatView: false },
  { id: "tailored-formal-trousers", name: "Tailored Formal Trousers", category: "Trousers", basePrice: 6400, preset: "trousers", fabric: "charcoal", description: "Hand-finished trousers with a clean, elegant drape.", hasFlatView: false },
  { id: "image-test-shirt", name: "Image Test Shirt", category: "Shirts", basePrice: 2000, preset: "imageTest", description: "Real PNG images, no seed SVGs, no fabrics.", hasFlatView: false },
  { id: "jacket-overlay-test", name: "Jacket Overlay Test", category: "Jackets", basePrice: 0, preset: "jacketImageTest", description: "Fixed model with aligned transparent jacket overlay.", hasFlatView: false },
];

export function buildSeed() {
  const now = new Date().toISOString();
  const products = [], drafts = {}, versions = {};
  for (const d of DEMO) {
    const template = PRESETS[d.preset].build(d.id, d.fabric);
    const versionId = `ver_${d.id}_1`;
    products.push({ id: d.id, name: d.name, description: d.description, category: d.category, basePrice: d.basePrice, status: "published", publishedVersionId: versionId, hasFlatView: !!d.hasFlatView, createdAt: now, updatedAt: now });
    drafts[d.id] = template;
    versions[versionId] = { id: versionId, productId: d.id, number: 1, publishedAt: now, template: JSON.parse(JSON.stringify(template)) };
  }
  return { products, drafts, versions };
}
