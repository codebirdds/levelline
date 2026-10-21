// Static landing-page copy + image paths. Swap for a mediator later if it moves to a CMS/API.
import { ROUTES } from "../../routes/routePaths";



const img = (name) => `/images/home/${name}`;
import HC from "./Assets/HC.png";
import VOA from "./Assets/VOA.png";
import VFS from "./Assets/VFS.png";
import RTW from "./Assets/RTW.png";
import MTM from "./Assets/MTM.png";
import RTW2 from "./Assets/RTW2.png";
import MTM2 from "./Assets/MTM2.png";
import step1 from "./Assets/step1.png";
import step2 from "./Assets/step2.png";
import step3 from "./Assets/step3.png";
import step4 from "./Assets/step4.png";
import step5 from "./Assets/step5.png";
import CP from "./Assets/CP.png";
import CP2 from "./Assets/CP2.png";
import PC from "./Assets/PC.png";
import HB from "./Assets/HB.png";
import GPF from "./Assets/GPF.png";
import HeroVIdeo from "./Assets/HeroVideo.mp4";
import defineFit from "./Assets/defineFit.mp4";
export const NAV_LEFT = [
  { label: "Custom Clothing", href: "#custom" },
  { label: "Fabrics", href: ROUTES.FABRIC },
];

export const NAV_RIGHT = [
  { label: "Services", href: ROUTES.READY_TO_WEAR },
  { label: "About Us", href: ROUTES.ABOUT },
];
export const BOOK_CTA = { label: "Book an appointment", href: "#services" }; // TODO: booking route

export const HERO = {
  image: img("hero.jpg"),
  // video: "/videos/hero.mp4", // optional – remove to use image only
  video: HeroVIdeo,
  tagline: "Elevate your style with Levelline’s modern bespoke tailoring.",
};

export const PATHS = [
  {
    title: "Ready-to-Wear",
    lines: ["Timeless pieces, ready when you are.", "Effortless style, refined craftsmanship."],
    cta: "Explore Collection",
    href: "/ready-to-wear", // TODO: shop route
    image: RTW2,
  },
  {
    title: "Made-to-Measure",
    lines: ["Your style. Your fit. Your fabric.", "Completely personalised."],
    cta: "Create Your Garment",
    href: "#",
    image: MTM2 ,
  },
];

export const STEPS = [
  { title: "Book an appointment", text: "Arrange a meeting, and we will come to you.", image: step1 },
  { title: "Choose your fabric", text: "Select from carefully curated fabrics, textures and finishes for your garment.", image: step2 },
  { title: "Get measured", text: "Our stylist takes your measurements for a fit made specifically for you.", image: step3 },
  { title: "Outfit trail", text: "Your outfit will be ready for trail in 7-10 days at your place.", image: step4 },
  { title: "Delivered to you", text: "Your finished bespoke garment is carefully prepared and delivered to your doorstep.", image: step5 },
];

export const CUSTOM_COLUMNS = [
  { title: "Luxury Style", text: "Customization lies at the core of true bespoke tailoring. From lapel silhouettes and pocket architecture to hand-selected horn buttons and silk linings, every detail is crafted around your individual aesthetic." },
  { title: "Elegant & Refined", text: "A bespoke garment offers infinite possibilities for sartorial expression. Select from a curated spectrum of lapels, cuffs, linings, hand-stitching accents, and buttons to compose a suit that reflects your unique identity while preserving a timeless, sophisticated silhouette." },
  { title: "Modern Luxury", text: "Our personalization journey invites you to co-create a garment uniquely your own. Whether navigating subtle accents or distinct design choices, every element is deliberately chosen to elevate your personal style and redefine your wardrobe." },
  { title: "Short Version", text: "Every detail commands purpose. From lapel cuts and inner linings to buttons and thread selection, personalize every element to shape a garment that flawlessly mirrors your individual taste." },
];

export const PROPORTION_CARDS = [
  { title: "Anatomical Proportioning", image: CP, text: "We study your unique physique, posture, and natural lines to construct an immaculate silhouette. From precise shoulder drop and lapel scale to coat length, every dimension is engineered to enhance your presence with effortless structure." },
  { title: "Complexion & Palette", image: CP2, text: "We evaluate skin undertones, hair contrast, and personal style to select fabrics that elevate your overall presence. By pairing subtle undertones with your natural complexion, we curate a cohesive palette that feels commanding yet understated." },
];

export const VALUE_PROPS = [
  { title: "Personalized Consultation", icon:PC, text: "Our master stylists bring curated fabric swatches and personalized sartorial guidance directly to the comfort of your home." },
  { title: "Handcrafted Bespoke", icon: HB, text: "Every garment is individually cut and precision-tailored by expert artisans to celebrate timeless luxury and fine craftsmanship." },
  { title: "Guaranteed Perfect Fit", icon: GPF, text: "Experience a true sartorial fit engineered around your unique posture, proportions, and individual style preferences." },
];

export const FIT = {
  title: "Defining Your Fit",
  image: img("fit.jpg"),
  video: defineFit, // optional – remove to use image only
  text: "The canvas between your lapel is not just a lining; it is the soul of a suit. Hand-padded by our tailors, it allows the garment to shape perfectly to your body over time. It is a slow, methodical technique that defines a true bespoke suit. Experience the difference a dedicated fit makes.",
  cta: "Explore the craftsmanship",
  href: "#",
};

export const SHOP_OPTIONS = [
  {
    title: "Home Consultation",
    text: "Personalized fitting and curated fabric selections, brought directly to your home or office.",
    cta: "Book Home Visit",
    image: HC,
    href: "#",
  },
  {
    title: "Visit Our Atelier",
    text: "Experience our private studio, explore fine imported fabrics, and consult with master tailors.",
    cta: "View Atelier Location",
    image: VOA,
    href: "#",
  },
  {
    title: "Virtual Fitting & Styling",
    text: "Connect live with our stylists from anywhere to discuss custom cuts and sartorial guidance.",
    cta: "Schedule Video Call",
    image: VFS,
    href: "#",
  },
];
// Placeholder copy from the Figma file – replace with real reviews.
export const TESTIMONIALS = [
  {
    title: "Fabric quality is absolute perfection",
    name: "Marcus Vance",
    role: "Managing Director, Dubai & London",
    avatar: img("avatar-1.jpg"),
    text: "My bespoke suit remotely from Dubai was a seamless experience. The team guided me through every detail, from selecting the wool to personalizing the inner lining and lapel cuts. The measurement and master tailoring surpassed all my expectations — the suit fits like a second skin: effortless, structured, and commanding presence in every boardroom meeting.",
    rating: 5,
  },
  {
    title: "Uncompromising luxury & master craftsmanship",
    name: "Rohan Kapoor",
    role: "Founder & CEO, Mumbai",
    avatar: img("avatar-2.jpg"),
    text: "Finding a tailor that understands modern sartorial aesthetics while preserving classic bespoke heritage is rare. Levelline's attention to detail is remarkable. The drape of the cashmere blazer, the hand-finished stitching, and the personalized consultation made the entire journey truly luxurious. It's easily the most comfortable and well-fitted garment in my wardrobe.",
    rating: 5,
  },
  {
    title: "A true benchmark in international bespoke",
    name: "Alexander Sterling",
    role: "Private Equity Partner, Geneva",
    avatar: img("avatar-3.jpg"),
    text: "As someone who travels frequently for business, I value consistency above all. Levelline combines durability, comfort, and timeless elegance delivered on every front. From the initial measurement to the final delivery, their transparency and customer service are first class. The silhouette is immaculate, and I will definitely return for my next collection with them.",
    rating: 5,
  },
];

export const SUPPORT_IMAGES = { arch: img("support-arch.jpg"), wide: img("support-wide.jpg") };

export const FOOTER = {
  collections: ["Bespoke Suits", "Custom shirts", "Tuxedos & Formal", "Outwear"],
  services: ["Home Consultation", "Atelier Appointment", "Care Guide", "Contact Us"],
};
