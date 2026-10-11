import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Reveal } from "../../../components/animation";
import { formatCurrency } from "../../../utils/formatCurrency";
import { ROUTES } from "../../../routes/routePaths";
import { getReadyToWearBySlug } from "../mediators";
import { addItem } from "../../checkout/checkoutSlice";
import SimpleHeader from "../../../components/layout/SimpleHeader";

const SIZES = [28, 30, 32, 34];

const COLOR_SWATCH = {
  Brown: "#6b4a2a",
  Grey: "#6e6e6e",
  Navy: "#1f2a44",
  "Midnight Blue": "#1b2236",
  Olive: "#5a5f3a",
  "Light Blue": "#8fb4d6",
  White: "#f4f4f4",
  Cream: "#efe6d3",
  Charcoal: "#3a3a3a",
  Tan: "#c19a6b",
  Black: "#1a1a1a",
};

const HeartIcon = ({ filled }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);

const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

function Accordion({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
      >
        <span className="font-sans text-sm font-medium text-[#414141]">{title}</span>
        <span className={`text-lg leading-none text-[#414141] transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      {open && (
        <div className="pb-4 font-sans text-sm leading-relaxed text-[#808080]">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [pincode, setPincode] = useState("");
  const [wishlisted, setWishlisted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSelectedImage(0);
    setSelectedSize(null);
    getReadyToWearBySlug(slug)
      .then((p) => { if (!cancelled) setProduct(p || null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (loading) {
    return (
      <>
        <SimpleHeader />
        <main className="bg-white">
          <div className="container-x py-24 text-center font-sans text-sm text-[#808080]">
            Loading…
          </div>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <SimpleHeader />
        <main className="bg-white">
          <div className="container-x py-24 text-center">
            <p className="font-sans text-lg text-[#6b6b6b]">Product not found.</p>
            <Link to={ROUTES.READY_TO_WEAR} className="mt-4 inline-block font-sans text-sm text-[#663f29] underline underline-offset-2">
              Back to Ready to Wear
            </Link>
          </div>
        </main>
      </>
    );
  }

  const images = [product.image, product.image, product.image, product.image];
  const swatch = COLOR_SWATCH[product.color] || "#cccccc";

  return (
    <>
      <SimpleHeader />
      <main className="bg-white">
        {/* Breadcrumb row */}
        <div className="container-x pt-4 lg:pt-5">
          <nav className="font-sans text-xs text-[#808080] lg:text-sm">
            <Link to={ROUTES.HOME} className="transition hover:text-[#663f29]">Home</Link>
            <span className="mx-1.5">/</span>
            <Link to={ROUTES.READY_TO_WEAR} className="transition hover:text-[#663f29]">Ready to Wear</Link>
            <span className="mx-1.5">/</span>
            <span className="text-[#414141]">{product.title}</span>
          </nav>
        </div>

        <div className="container-x pb-10">
          <div className="mt-4 grid gap-8 lg:mt-5 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_440px] xl:gap-14">

            {/* ─── LEFT: gallery ─── */}
         <Reveal
  variant="fade"
  className="grid grid-cols-[minmax(0,1fr)_68px] gap-3 sm:grid-cols-[minmax(0,1fr)_84px] lg:h-[560px] lg:grid-cols-[minmax(0,1fr)_96px] lg:gap-4"
>
  {/* Main image — fills full height on desktop */}
  <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F1E9] lg:aspect-auto lg:h-full">
    <img
      src={images[selectedImage]}
      alt={product.title}
      className="absolute inset-0 size-full object-contain"
    />
  </div>

  {/* Thumbnails — 4 equal rows on desktop, matching the main image height */}
  <div className="flex flex-col gap-2 lg:grid lg:h-full lg:grid-rows-4 lg:gap-3">
    {images.map((src, i) => (
      <button
        key={i}
        onClick={() => setSelectedImage(i)}
        aria-label={`View image ${i + 1}`}
        className={`relative aspect-square overflow-hidden bg-[#F5F1E9] transition lg:aspect-auto lg:h-full ${
          selectedImage === i ? "ring-1 ring-ink" : "opacity-70 hover:opacity-100"
        }`}
      >
        <img src={src} alt="" className="absolute inset-0 size-full object-contain" />
      </button>
    ))}
  </div>
</Reveal>

            {/* ─── RIGHT: info card + ADD TO BAG card ─── */}
            <Reveal delay={120} className="flex flex-col gap-3">

              {/* Info card */}
              <div className="border border-border bg-white p-5 lg:p-6">
                {/* Title + wishlist */}
                <div className="flex items-start justify-between gap-4">
                  <h1 className="font-sans text-lg font-medium text-[#414141] lg:text-xl">
                    {product.title}
                  </h1>
                  <button
                    onClick={() => setWishlisted((w) => !w)}
                    aria-label="Add to wishlist"
                    className={`shrink-0 transition ${wishlisted ? "text-[#663f29]" : "text-[#414141] hover:text-[#663f29]"}`}
                  >
                    <HeartIcon filled={wishlisted} />
                  </button>
                </div>

                {/* Price */}
                <div className="mt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-sans text-base font-bold text-[#414141] lg:text-lg">
                      {formatCurrency(product.price)}
                    </span>
                    {product.mrp && product.mrp > product.price && (
                      <span className="font-sans text-sm text-[#808080] line-through">
                        {formatCurrency(product.mrp)}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-sans text-xs text-[#808080]">
                    MRP incl. of all taxes
                  </p>
                </div>

                <div className="mt-4 h-px bg-border" />

                {/* Color */}
                <div className="mt-4">
                  <p className="font-sans text-xs uppercase tracking-wide text-[#808080]">Color</p>
                  <div className="mt-2">
                    <span
                      title={product.color}
                      className="inline-block size-7 rounded-sm ring-1 ring-border"
                      style={{ backgroundColor: swatch }}
                    />
                  </div>
                </div>

                {/* Size */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <p className="font-sans text-xs uppercase tracking-wide text-[#808080]">Size</p>
                    <button className="font-sans text-[11px] uppercase tracking-wide text-[#414141] underline underline-offset-2 transition hover:text-[#663f29]">
                      Size Guide
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {SIZES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`h-9 min-w-[40px] border px-2.5 font-sans text-sm transition ${
                          selectedSize === s
                            ? "border-ink bg-ink text-cream"
                            : "border-border text-[#414141] hover:border-ink"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 h-px bg-border" />

                {/* Pincode */}
                <div className="mt-4">
                  <p className="font-sans text-sm text-[#808080]">
                    Enter Pincode To Check Delivery Date
                  </p>
                  <div className="mt-2 flex">
                    <div className="relative flex-1">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#b0b0b0]">
                        <PinIcon />
                      </span>
                      <input
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="Enter your shipping pincode"
                        inputMode="numeric"
                        className="h-10 w-full border border-border bg-white pl-9 pr-3 font-sans text-sm text-[#414141] outline-none placeholder:text-[#b0b0b0] focus:border-ink"
                      />
                    </div>
                    <button className="h-10 bg-ink px-4 font-sans text-xs font-medium uppercase tracking-wide text-cream transition hover:bg-[#663f29]">
                      Check
                    </button>
                  </div>
                </div>
              </div>

              {/* ADD TO BAG + BUY NOW */}
              <div className="border border-border bg-white p-3">
                <button
                  disabled={!selectedSize}
                  onClick={() => {
                    dispatch(addItem({ product, size: selectedSize }));
                    navigate(ROUTES.CHECKOUT);
                  }}
                  className="h-12 w-full bg-ink font-sans text-sm font-medium uppercase tracking-wide text-cream transition hover:bg-[#663f29] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Buy Now
                </button>
                <button
                  disabled={!selectedSize}
                  onClick={() => {
                    dispatch(addItem({ product, size: selectedSize }));
                  }}
                  className="mt-2 h-12 w-full border border-ink bg-white font-sans text-sm font-medium uppercase tracking-wide text-[#414141] transition hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add to Bag
                </button>
                {!selectedSize && (
                  <p className="mt-2 text-center font-sans text-xs text-[#c0392b]">
                    Please select a size
                  </p>
                )}
              </div>
            </Reveal>
          </div>

          {/* Accordions */}
          <div className="mt-6 border-t border-border">
            <Accordion title="Product Details and Overview" defaultOpen>
              <p className="capitalize">{product.fabric} · {product.color}</p>
              <p className="mt-2">
                Crafted from premium {product.fabric?.toLowerCase() || "fabric"} with a refined finish.
                A timeless piece designed to move with you through every season.
              </p>
            </Accordion>
            <Accordion title="Delivery & Return">
              <p>Complimentary shipping across India. Free returns within 7 days of delivery.</p>
            </Accordion>
            <Accordion title="Contact Us">
              <p>
                Need help? Reach us at{" "}
                <a href="mailto:care@levelline.com" className="text-[#663f29] underline underline-offset-2">
                  care@levelline.com
                </a>{" "}
                or call +91 90000 00000.
              </p>
            </Accordion>
          </div>
        </div>
      </main>
    </>
  );
}