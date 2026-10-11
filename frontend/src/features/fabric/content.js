import premiumFabric from "../readytowear/assets/premiumFabric.png";
import blueShirt from "../readytowear/assets/blueShirt.png";
import blackRacket from "../readytowear/assets/blackRacket.png";
import browCheckRacket from "../readytowear/assets/browCheckRacket.png";
import creamPant from "../readytowear/assets/creamPant.png";

// TODO: replace placeholder imports with real images when assets land

export const FABRIC_HERO = {
  image: premiumFabric,
  label: "THE FINEST SELECTION",
  title: "Our Fabrics",
  text: "Explore a curated collection of premium fabrics, each chosen for its quality, texture and timeless appeal. Find the perfect fabric to bring your vision to life.",
};

export const CATEGORY_IMAGES = {
  Shirt: blueShirt,
  Suit: blackRacket,
  Blazer: browCheckRacket,
  Pants: creamPant,
  Sherwani: browCheckRacket,
  Bundi: blackRacket,
  Custom: premiumFabric,
};

// Dummy fabric swatches — cycled from the four placeholders we have
const SWATCH = [browCheckRacket, creamPant, blackRacket, blueShirt];
const pick = (i) => SWATCH[i % SWATCH.length];

const SEED = [
  { name: "Houndstooth",         material: "Twill",   desc: "A deep burgundy wool fabric with a rich colour and luxurious textured finish. Its distinctive tone adds personality while maintaining an elegant and sophisticated appearance. Ideal for statement suits, evening jackets and special-occasion tailoring.", features: ["premium", "soft", "durable", "timeless"] },
  { name: "Prince of Wales",     material: "Cotton",  desc: "A classic black and white check woven from soft Italian cotton. Versatile and refined.", features: ["premium", "durable", "timeless"] },
  { name: "Charcoal Twill",      material: "Twill",   desc: "A tightly woven charcoal twill with a subtle sheen. Holds shape beautifully.", features: ["premium", "durable"] },
  { name: "Herringbone",         material: "Twill",   desc: "Warm charcoal herringbone with a fine chevron pattern. A quiet classic.", features: ["premium", "timeless"] },
  { name: "Navy Windowpane",     material: "Twill",   desc: "Deep navy with a fine windowpane check. Understated but never boring.", features: ["premium", "soft", "timeless"] },
  { name: "Camel Premium Wool",  material: "Others",  desc: "A soft camel wool with a natural drape. Exceptionally warm and elegant.", features: ["premium", "soft", "timeless"] },
  { name: "Navy Flannel",        material: "Others",  desc: "Brushed navy flannel with a soft hand. Ideal for cooler months.", features: ["soft", "durable"] },
  { name: "Sky Blue Plaid Wool", material: "Cotton",  desc: "Sky blue plaid woven from fine wool. Fresh and structured.", features: ["premium", "durable", "timeless"] },
  { name: "Black Prince Check",  material: "Twill",   desc: "Black tonal check with a matte finish. Quietly assertive.", features: ["premium", "durable"] },
];

export const FABRICS = SEED.map((f, i) => ({
  id: `fabric-${i + 1}`,
  ...f,
  image: pick(i),
  category: "Shirt", // for now, all swatches belong to the Shirt category
}));

export const FABRIC_CTA = {
  title: "Bring your fabric to life",
  subtitle: "Book a consultation with a Levelline atelier and feel the cloth for yourself.",
  cta: "Book an appointment",
  href: "/#custom",
};