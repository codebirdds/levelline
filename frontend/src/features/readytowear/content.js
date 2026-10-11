import readyToWear from "./assets/readyToWear.png";
import blackRacket from "./assets/blackRacket.png";
import creamPant from "./assets/creamPant.png";
import browCheckRacket from "./assets/browCheckRacket.png";
import blueShirt from "./assets/blueShirt.png";
import editorial1 from "./assets/editorial1.png";
import editorial2 from "./assets/editorial2.png";
import personalise from "./assets/personalise.png";
import premiumFabric from "./assets/premiumFabric.png";
import precisionCutting from "./assets/precisionCutting.png";
import expertStitching from "./assets/expertStitching.png";
import finalQualityCheck from "./assets/finalQualityCheck.png";
const img = (n) => `/images/rtw/${n}`;

// ───────────── Constants ─────────────

export const CATEGORIES = ["ALL", "Blazers", "Shirts", "Suits", "Trousers"];

export const SORTS = [
  { value: "featured",   label: "Featured" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest",     label: "Newest" },
];

export const COLORS = [
  "ALL", "Brown", "Grey", "Navy", "Olive",
  "Light Blue", "White", "Cream", "Charcoal", "Tan", "Black",
];

export const FABRICS = [
  "ALL", "Wool", "Wool Blend", "Cotton", "Linen", "Poplin", "Merino Wool",
];

export const PRICE_RANGES = [
  { value: "all",         label: "All Prices" },
  { value: "0-5000",      label: "Under ₹5,000" },
  { value: "5000-10000",  label: "₹5,000 - ₹10,000" },
  { value: "10000-20000", label: "₹10,000 - ₹20,000" },
  { value: "20000+",      label: "Above ₹20,000" },
];

// ───────────── Hero / Intro / Editorial ─────────────

export const RTW_HERO = {
  image: readyToWear,
  title: "Ready to Wear",
  text: "Curated garments for the modern gentleman. Explore our ready-to-wear collection and personalise each piece to suit your style.",
};

export const RTW_INTRO = {
  title: "Crafted for distinction",
  text: "Mastered tailoring isn’t just about fit—it’s about presence. Designed with exacting detail and hand-selected fabrics, every piece reflects an uncompromising commitment to quality and comfort. Step into bespoke luxury made to endure beyond the season.",
};

export const EDITORIALS = [editorial1, editorial2];

// ───────────── Products ─────────────

// All 4 images we have — cycled across dummy products
const PRODUCT_IMAGES = [browCheckRacket, blueShirt, creamPant, blackRacket];

// Hand-written seed so names/prices/categories actually make sense
const PRODUCT_SEED = [
  { title: "Brown Check Wool Blazer",   category: "Blazers",  price: 14500, color: "Brown",      fabric: "Wool",        isNew: false, featuredRank: 1, createdAt: 20240901 },
  { title: "Light Blue Oxford Shirt",   category: "Shirts",   price: 3500,  color: "Light Blue", fabric: "Cotton",      isNew: true,  featuredRank: 6, createdAt: 20241115 },
  { title: "Cream Tailored Trouser",    category: "Trousers", price: 6800,  color: "Cream",      fabric: "Wool Blend",  isNew: false, featuredRank: 4, createdAt: 20240815 },
  { title: "Black Peak Lapel Blazer",   category: "Blazers",  price: 16500, color: "Black",      fabric: "Wool",        isNew: true,  featuredRank: 2, createdAt: 20241101 },
  { title: "Blue Poplin Formal Shirt",  category: "Shirts",   price: 3200,  color: "Light Blue", fabric: "Poplin",      isNew: false, featuredRank: 8, createdAt: 20240720 },
  { title: "Cream Wool Trouser",        category: "Trousers", price: 7200,  color: "Cream",      fabric: "Wool",        isNew: true,  featuredRank: 5, createdAt: 20241110 },
  { title: "Brown Houndstooth Blazer",  category: "Blazers",  price: 15500, color: "Brown",      fabric: "Wool Blend",  isNew: false, featuredRank: 3, createdAt: 20240915 },
  { title: "Light Blue Linen Shirt",    category: "Shirts",   price: 3800,  color: "Light Blue", fabric: "Linen",       isNew: true,  featuredRank: 7, createdAt: 20241120 },
  { title: "Black Formal Trouser",      category: "Trousers", price: 6500,  color: "Black",      fabric: "Wool",        isNew: false, featuredRank: 9, createdAt: 20240710 },
  { title: "Navy Two-Piece Suit",       category: "Suits",    price: 24900, color: "Navy",       fabric: "Wool",        isNew: true,  featuredRank: 10, createdAt: 20241125 },
  { title: "Charcoal Three-Piece Suit", category: "Suits",    price: 32500, color: "Charcoal",   fabric: "Merino Wool", isNew: false, featuredRank: 11, createdAt: 20241010 },
  { title: "Olive Cotton Shirt",        category: "Shirts",   price: 3400,  color: "Olive",      fabric: "Cotton",      isNew: false, featuredRank: 12, createdAt: 20240801 },
];

export const PRODUCTS = PRODUCT_SEED.map((p, i) => ({
  id: i + 1,
  slug: p.title.toLowerCase().replace(/\s+/g, "-"),
  image: PRODUCT_IMAGES[i % PRODUCT_IMAGES.length], // cycles through the 4 images
  ...p,
}));

// ───────────── Personalise / Levelline Way ─────────────

export const PERSONALISE = {
  image: personalise,
  title: "Personalise Your Look",
  text: "From monograms to custom fits, make each piece truly yours with our personalisation services.",
  cta: "Explore customisation",
  href: "/#custom",
};

export const WAY = {
  label: "The Levelline Way",
  title: ["Thoughtfully Made,", "Beautifully Worn."],
  text: "Every garment is a reflection of our commitment to quality, detail, and timeless design. From premium hand-selected fabrics to precise tailoring, we create enduring pieces designed to move with you through every chapter of life.",
  cta: "Our process",
  href: "/#about",
  steps: [
    { title: "Premium Fabric",     text: "Choose from our curated collection of premium wools, linens.",         image: premiumFabric },
    { title: "Precision Cutting",  text: "Get measured by experts to ensure an exacting silhouette.",            image: precisionCutting },
    { title: "Expert Stitching",   text: "Skilled artisans shape your piece with meticulous attention to detail.", image: expertStitching },
    { title: "Final Quality Check",text: "Try on your custom creation and enjoy a flawless tailored fit.",       image: finalQualityCheck },
  ],
};