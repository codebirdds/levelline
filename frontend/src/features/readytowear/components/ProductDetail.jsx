import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Reveal } from "../../../components/animation";
import { formatCurrency } from "../../../utils/formatCurrency";
import { ROUTES } from "../../../routes/routePaths";
import { getReadyToWearBySlug } from "../mediators";
import { addCartThunk, fetchCartThunk } from "../../cart/cartSlice";
import { toast } from "react-hot-toast";
import SimpleHeader from "../../../components/layout/SimpleHeader";
import { selectUser } from "../../auth/authSlice";

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
  Red: "#c0392b",
};

const HeartIcon = ({ filled }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);

function Accordion({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-3 text-left"
      >
        <span className="font-sans text-sm font-medium text-[#414141]">{title}</span>
        <span className={`text-lg leading-none text-[#414141] transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      {open && (
        <div className="pb-3 font-sans text-sm leading-relaxed text-[#808080]">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const stateProduct = location.state?.product;

    setSelectedImage(0);
    setSelectedSize(null);
    setSelectedVariantId(null);
    setValidationError("");

    if (stateProduct) {
      setProduct(stateProduct);
      setSelectedVariantId(stateProduct.variants?.[0]?.id ?? null);
      setLoading(false);
      return () => { cancelled = true; };
    }

    setLoading(true);
    getReadyToWearBySlug(slug)
      .then((p) => {
        if (cancelled) return;
        setProduct(p || null);
        setSelectedVariantId(p?.variants?.[0]?.id ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [slug, location.state?.product]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const variants = product?.variants || [];

  const activeVariant = useMemo(() => {
    if (!variants.length) return null;
    return variants.find((v) => v.id === selectedVariantId) || variants[0];
  }, [variants, selectedVariantId]);

  const images = useMemo(() => {
    const list = activeVariant?.images?.length
      ? activeVariant.images
      : product?.images || [];
    return list
      .slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((i) => (typeof i === "string" ? i : i.url))
      .filter(Boolean);
  }, [activeVariant, product]);

  const sizes = activeVariant?.sizes || [];

  useEffect(() => {
    setSelectedImage(0);
    setSelectedSize(null);
    setValidationError("");
  }, [activeVariant?.id]);

  useEffect(() => {
    if (selectedSize) setValidationError("");
  }, [selectedSize]);

  const handleAddToCart = async (buyNow = false) => {
    setValidationError("");

    if (!selectedSize) {
      setValidationError("Please select a size to continue.");
      toast.error("Please select a size");
      return;
    }

    if (!user) {
      navigate(ROUTES.LOGIN, {
        state: {
          from: { pathname: location.pathname },
          intent: buyNow ? "buy" : "add",
        },
        replace: false,
      });
      return;
    }

    if (!activeVariant) {
      setValidationError("This product variant is currently unavailable.");
      return;
    }

    try {
      await dispatch(
        addCartThunk({
          product_id: product.id,
          product_variant_id: activeVariant.id,
          size: selectedSize,
          quantity: 1,
        })
      ).unwrap();

      dispatch(fetchCartThunk());
      toast.success("Added to bag");

      if (buyNow) navigate(ROUTES.CHECKOUT);
    } catch (err) {
      setValidationError(
        typeof err === "string" ? err : "Failed to add to cart. Please try again."
      );
      toast.error(err || "Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <>
        <SimpleHeader />
        <main className="bg-white">
          <div className="mx-auto max-w-[1200px] px-4 py-24 text-center font-sans text-sm text-[#808080] lg:px-8">
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
          <div className="mx-auto max-w-[1200px] px-4 py-24 text-center lg:px-8">
            <p className="font-sans text-lg text-[#6b6b6b]">Product not found.</p>
            <Link
              to={ROUTES.READY_TO_WEAR}
              className="mt-4 inline-block font-sans text-sm text-[#663f29] underline underline-offset-2"
            >
              Back to Ready to Wear
            </Link>
          </div>
        </main>
      </>
    );
  }

  const name = product.name || product.title;

  const basePrice = Number(product.price) || 0;
  const discountAmt = Number(product.discount_price) || 0;
  const price =
    discountAmt > 0 ? Math.max(basePrice - discountAmt, 0) : basePrice;
  const mrp = discountAmt > 0 && basePrice > 0 ? basePrice : null;
  const percentOff =
    mrp && mrp > price ? Math.round((discountAmt / basePrice) * 100) : 0;

  return (
    <>
      <SimpleHeader />
      <main className="bg-white">
        <div className="mx-auto w-full max-w-[1200px] px-4 pt-4 lg:px-8 lg:pt-5">
          <nav className="font-sans text-xs text-[#808080] lg:text-sm">
            <Link to={ROUTES.HOME} className="transition hover:text-[#663f29]">Home</Link>
            <span className="mx-1.5">/</span>
            <Link to={ROUTES.READY_TO_WEAR} className="transition hover:text-[#663f29]">Ready to Wear</Link>
            <span className="mx-1.5">/</span>
            <span className="text-[#414141]">{name}</span>
          </nav>
        </div>

        <div className="mx-auto w-full max-w-[1200px] px-4 pb-10 lg:px-8">
          {/* ✅ FIX: Changed to Flexbox to shrink-wrap to content, and center everything */}
          <div className="mt-4 flex flex-col gap-6 lg:mt-5 lg:h-[calc(100vh-140px)] lg:w-fit lg:mx-auto lg:flex-row lg:items-stretch lg:gap-12">
            
            {/* ─── LEFT: gallery ─── */}
            <Reveal
              variant="fade"
              className="flex h-full w-full min-h-0 items-center justify-center lg:w-auto"
            >
              <div className="flex h-full w-full items-stretch gap-3 lg:w-auto lg:max-w-[600px]">
                
                {/* Main image container — background tightly hugs the image */}
                <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#F5F1E9] p-4 lg:p-6">
                  {images[selectedImage] ? (
                    <img
                      src={images[selectedImage]}
                      alt={name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="grid size-full place-items-center font-sans text-xs text-[#808080]">
                      No image
                    </div>
                  )}
                </div>

                {/* Thumbnail rail — 5 images */}
                <div className="flex w-[60px] shrink-0 flex-col gap-2 overflow-hidden sm:w-[76px] lg:w-[88px] lg:gap-2.5">
                  {images.slice(0, 5).map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      aria-label={`View image ${i + 1}`}
                      className={`relative flex flex-1 w-full items-center justify-center overflow-hidden bg-[#F5F1E9] p-1 transition ${
                        selectedImage === i ? "border border-ink" : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={src} alt="" className="max-h-full max-w-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* ─── RIGHT: info + actions ─── */}
            <Reveal delay={120} className="flex min-h-0 w-full flex-col gap-3 lg:w-[420px] lg:h-full">

              <div className="min-h-0 flex-1 overflow-y-auto border border-border bg-white p-4 lg:p-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <div className="flex flex-col">
                  
                  <div className="flex items-start justify-between gap-4">
                    <h1 className="font-sans text-base font-medium text-[#414141] lg:text-lg">
                      {name}
                    </h1>
                    <button
                      onClick={() => setWishlisted((w) => !w)}
                      aria-label="Add to wishlist"
                      className={`shrink-0 transition ${
                        wishlisted ? "text-[#663f29]" : "text-[#414141] hover:text-[#663f29]"
                      }`}
                    >
                      <HeartIcon filled={wishlisted} />
                    </button>
                  </div>

                  {product.brand && (
                    <p className="mt-1 font-sans text-[11px] uppercase tracking-wide text-[#808080]">
                      {product.brand}
                    </p>
                  )}

                  <div className="mt-2">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="font-sans text-base font-bold text-[#414141] lg:text-lg">
                        {formatCurrency(price)}
                      </span>
                      {mrp && (
                        <span className="font-sans text-sm text-[#808080] line-through">
                          {formatCurrency(mrp)}
                        </span>
                      )}
                      {percentOff > 0 && (
                        <span className="font-sans text-xs font-medium text-emerald-700">
                          {percentOff}% off
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 font-sans text-[11px] text-[#808080]">
                      MRP incl. of all taxes
                    </p>
                  </div>

                  <div className="mt-3 h-px bg-border" />

                  {variants.length > 0 && (
                    <div className="mt-2.5">
                      <div className="flex items-center justify-between">
                        <p className="font-sans text-[11px] uppercase tracking-wide text-[#808080]">
                          Color
                        </p>
                        {activeVariant?.color && (
                          <span className="font-sans text-[11px] text-[#414141]">
                            {activeVariant.color}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {variants.map((v) => {
                          const swatch = v.color_code || COLOR_SWATCH[v.color] || "#cccccc";
                          const active = v.id === activeVariant?.id;
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => setSelectedVariantId(v.id)}
                              title={v.color}
                              aria-label={v.color}
                              className={`grid size-7 place-items-center rounded-sm ring-1 transition ${
                                active ? "ring-ink" : "ring-border hover:ring-[#808080]"
                              }`}
                            >
                              <span
                                className="size-5 rounded-sm"
                                style={{ backgroundColor: swatch }}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-2.5">
                    <div className="flex items-center justify-between">
                      <p className="font-sans text-[11px] uppercase tracking-wide text-[#808080]">
                        Size
                      </p>
                      <button className="font-sans text-[10px] uppercase tracking-wide text-[#414141] underline underline-offset-2 transition hover:text-[#663f29]">
                        Size Guide
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {sizes.length === 0 && (
                        <p className="font-sans text-xs text-[#808080]">No sizes available</p>
                      )}
                      {sizes.map((s) => {
                        const out = Number(s.stock) <= 0;
                        const active = selectedSize === s.size;
                        return (
                          <button
                            key={s.sku || s.size}
                            type="button"
                            disabled={out}
                            onClick={() => setSelectedSize(s.size)}
                            className={`h-8 min-w-[36px] border px-2 font-sans text-sm transition ${
                              active
                                ? "border-ink bg-ink text-cream"
                                : out
                                ? "cursor-not-allowed border-border text-[#c4c4c4] line-through"
                                : "border-border text-[#414141] hover:border-ink"
                            }`}
                          >
                            {s.size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="h-2" />
                </div>
              </div>

              {/* Actions Card */}
              <div className="shrink-0 border border-border bg-white p-3">
                <button
                  disabled={!selectedSize}
                  onClick={() => handleAddToCart(true)}
                  className="h-11 w-full bg-ink font-sans text-sm font-medium uppercase tracking-wide text-cream transition hover:bg-[#663f29] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Buy Now
                </button>
                <button
                  disabled={!selectedSize}
                  onClick={() => handleAddToCart(false)}
                  className="mt-2 h-11 w-full border border-ink bg-white font-sans text-sm font-medium uppercase tracking-wide text-[#414141] transition hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add to Bag
                </button>

                {validationError && (
                  <p
                    role="alert"
                    className="mt-2 text-center font-sans text-xs text-[#c0392b]"
                  >
                    {validationError}
                  </p>
                )}
              </div>
            </Reveal>
          </div>

          <div className="mt-4 border-t border-border w-full max-w-[1000px] mx-auto">
            <Accordion title="Product Details and Overview" defaultOpen>
              <p className="capitalize">
                {[product.material, product.fit, activeVariant?.color]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {product.description && <p className="mt-2">{product.description}</p>}
              <ul className="mt-2 space-y-1">
                {product.occasion && <li>Occasion: {product.occasion}</li>}
                {product.country_of_origin && (
                  <li>Country of origin: {product.country_of_origin}</li>
                )}
              </ul>
            </Accordion>
            <Accordion title="Delivery & Return">
              <p>Complimentary shipping across India. Free returns within 7 days of delivery.</p>
            </Accordion>
            <Accordion title="Care Instructions">
              <p>{product.care_instructions || "Dry clean only."}</p>
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