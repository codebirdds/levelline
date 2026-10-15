// ─────────────────────────────────────────────────────────────
// ABOUT PAGE — content
// Reuses images already available in readytowear/assets.
// ─────────────────────────────────────────────────────────────
import aboutHero from "./assets/about.png";
import editorial1 from "../readytowear/assets/editorial1.png";
import editorial2 from "../readytowear/assets/editorial2.png";
import expertStitching from "../readytowear/assets/expertStitching.png";
import precisionCutting from "../readytowear/assets/precisionCutting.png";
import premiumFabric from "../readytowear/assets/premiumFabric.png";
import personalise from "../readytowear/assets/personalise.png";
import finalQualityCheck from "../readytowear/assets/finalQualityCheck.png";
import readyToWear from "../readytowear/assets/readyToWear.png";

// ── Store / atelier photos (StoreStrip) ──
export const ABOUT_HERO = {
  image: aboutHero,                    // tailor's table — matches the reference
  eyebrow: "The Art of Bespoke",
  title: "About Us",
  text: "Crafting refined garments tailored to your individuality, where timeless elegance meets modern sophistication.",
};

export const STORE_IMAGES = [
  editorial1,
  expertStitching,
  precisionCutting,
  editorial2,
];

// ── SplitSection imagery (previously fake /images/about/*.jpg) ──
export const ABOUT_SPLIT_IMAGES = {
  redefining: premiumFabric,
  levellineWay: personalise,
};

// ── Services grid ──
export const SERVICES = [
  {
    title: "Fabrics & Materials",
    text: "Premium fabrics, textures and colours from around the world.",
    iconKey: "fabric",
  },
  {
    title: "Shop & Customize",
    text: "Choose from our curated collection or personalize every detail.",
    iconKey: "scissors",
  },
  {
    title: "Consultation",
    text: "Get expert guidance from our stylists, online or at your doorstep.",
    iconKey: "chat",
  },
  {
    title: "Measurements",
    text: "Precision fitting with care, for a look that feels made for you.",
    iconKey: "ruler",
  },
  {
    title: "Design & Preview",
    text: "Visualize your look with our design support and AI preview.",
    iconKey: "eye",
  },
  {
    title: "Production & Quality",
    text: "Crafted by skilled artisans with uncompromising quality.",
    iconKey: "shield",
  },
  {
    title: "Atelier at Your Doorstep",
    text: "Convenient home visits for a personalized experience.",
    iconKey: "home",
  },
  {
    title: "Final Delivery",
    text: "Your bespoke wardrobe, delivered with care, right to your door.",
    iconKey: "truck",
  },
];



// ── Extra editorial imagery (optional use elsewhere) ──
export const ABOUT_IMAGES = {
  premiumFabric,
  personalise,
  finalQualityCheck,
  readyToWear,
};