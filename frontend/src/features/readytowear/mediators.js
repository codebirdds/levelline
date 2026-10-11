import api from "../../api/axiosInstance";
import { READY_TO_WEAR } from "./endpoints";

import blackRacket from "./assets/blackRacket.png";
import creamPant from "./assets/creamPant.png";
import browCheckRacket from "./assets/browCheckRacket.png";
import blueShirt from "./assets/blueShirt.png";
import editorial1 from "./assets/editorial1.png";
import editorial2 from "./assets/editorial2.png";
const USE_MOCK = true;

// Cycle through the 4 product images we actually have
const IMG = [browCheckRacket, blueShirt, creamPant, blackRacket];
const pick = (i) => IMG[i % IMG.length];

const MOCK = [
  // ── Blazers / Jackets ─────────────────────────────
  {
    id: 1,
    slug: "dark-brown-wool-check-tailored-jacket",
    title: "Dark Brown Wool Check Tailored Jacket",
    price: 9400,
    mrp: 12500,
    category: "Blazers",
    color: "Brown",
    fabric: "Wool",
    image: pick(0),
  },
  {
    id: 2,
    slug: "charcoal-grey-textured-blazer",
    title: "Charcoal Grey Textured Blazer",
    price: 10500,
    mrp: 14000,
    category: "Blazers",
    color: "Grey",
    fabric: "Wool Blend",
    image: pick(1),
  },
  {
    id: 3,
    slug: "navy-blue-wool-double-breasted-jacket",
    title: "Navy Blue Wool Double-Breasted Jacket",
    price: 12000,
    mrp: 16000,
    category: "Blazers",
    color: "Navy",
    fabric: "Wool",
    image: pick(2),
  },
  {
    id: 4,
    slug: "olive-green-wool-blazer",
    title: "Olive Green Wool Blazer",
    price: 9800,
    mrp: 13000,
    category: "Blazers",
    color: "Olive",
    fabric: "Wool",
    image: pick(3),
  },

  // ── Shirts ────────────────────────────────────────
  {
    id: 5,
    slug: "light-blue-fine-cotton-oxford-shirt",
    title: "Light Blue Fine Cotton Oxford Shirt",
    price: 4500,
    mrp: 6000,
    category: "Shirts",
    color: "Light Blue",
    fabric: "Cotton",
    image: pick(4),
  },
  {
    id: 6,
    slug: "white-egyptian-cotton-shirt",
    title: "White Egyptian Cotton Shirt",
    price: 3800,
    mrp: 5000,
    category: "Shirts",
    color: "White",
    fabric: "Cotton",
    image: pick(5),
  },
  {
    id: 7,
    slug: "olive-linen-casual-shirt",
    title: "Olive Linen Casual Shirt",
    price: 4200,
    mrp: 5500,
    category: "Shirts",
    color: "Olive",
    fabric: "Linen",
    image: pick(6),
  },
  {
    id: 8,
    slug: "cream-poplin-dress-shirt",
    title: "Cream Poplin Dress Shirt",
    price: 4800,
    mrp: 6500,
    category: "Shirts",
    color: "Cream",
    fabric: "Poplin",
    image: pick(7),
  },

  // ── Suits ─────────────────────────────────────────
  {
    id: 9,
    slug: "midnight-blue-three-piece-suit",
    title: "Midnight Blue Three-Piece Suit",
    price: 24500,
    mrp: 32000,
    category: "Suits",
    color: "Midnight Blue",
    fabric: "Wool",
    image: pick(8),
  },
  {
    id: 10,
    slug: "charcoal-two-piece-business-suit",
    title: "Charcoal Two-Piece Business Suit",
    price: 18900,
    mrp: 25000,
    category: "Suits",
    color: "Charcoal",
    fabric: "Wool",
    image: pick(9),
  },
  {
    id: 11,
    slug: "tan-houndstooth-suit",
    title: "Tan Houndstooth Suit",
    price: 21000,
    mrp: 28000,
    category: "Suits",
    color: "Tan",
    fabric: "Wool",
    image: pick(10),
  },
  {
    id: 12,
    slug: "black-tuxedo-suit",
    title: "Black Classic Tuxedo Suit",
    price: 26500,
    mrp: 35000,
    category: "Suits",
    color: "Black",
    fabric: "Wool",
    image: pick(11),
  },

  // ── Trousers ──────────────────────────────────────
  {
    id: 13,
    slug: "cream-beige-cotton-chino-trousers",
    title: "Cream Beige Cotton Chino Trousers",
    price: 3200,
    mrp: 4500,
    category: "Trousers",
    color: "Cream",
    fabric: "Cotton",
    image: pick(12),
  },
  {
    id: 14,
    slug: "charcoal-wool-pleated-trousers",
    title: "Charcoal Wool Pleated Trousers",
    price: 5800,
    mrp: 7500,
    category: "Trousers",
    color: "Charcoal",
    fabric: "Wool",
    image: pick(13),
  },
  {
    id: 15,
    slug: "navy-slim-fit-dress-trousers",
    title: "Navy Slim-Fit Dress Trousers",
    price: 4900,
    mrp: 6500,
    category: "Trousers",
    color: "Navy",
    fabric: "Wool",
    image: pick(14),
  },
  {
    id: 16,
    slug: "black-merino-wool-trousers",
    title: "Black Merino Wool Trousers",
    price: 6200,
    mrp: 8000,
    category: "Trousers",
    color: "Black",
    fabric: "Merino Wool",
    image: pick(15),
  },
];

// Editorial blocks used by ProductGrid when in "featured" mode
// (category=ALL, sort=featured). Reuses the same 4 images for now.
export const EDITORIALS = [
  { id: "ed-1", image: pick(0) },
  { id: "ed-2", image: pick(1) },
  { id: "ed-3", image: pick(2) },
  { id: "ed-4", image: pick(3) },
];

const call = ({ method, url }, { data, params, args = [] } = {}) => {
  const resolvedUrl = typeof url === "function" ? url(...args) : url;
  return api({ method, url: resolvedUrl, data, params }).then((r) => r.data);
};

export const listReadyToWear = async () =>
  USE_MOCK ? [...MOCK] : call(READY_TO_WEAR.LIST);

export const getReadyToWearById = async (id) => {
  if (USE_MOCK) return MOCK.find((p) => p.id === Number(id));
  return call(READY_TO_WEAR.DETAIL, { args: [id] });
};

export const getReadyToWearBySlug = async (slug) => {
  if (USE_MOCK) return MOCK.find((p) => p.slug === slug);
  return call(READY_TO_WEAR.DETAIL_BY_SLUG, { args: [slug] });
};