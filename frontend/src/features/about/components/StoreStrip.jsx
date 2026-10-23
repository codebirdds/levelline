/** Full-bleed photo strip with continuous auto-scroll. */
export default function StoreStrip({ images = [], className = "" }) {
  if (!images.length) return null;

  // ✅ Double the images to create a seamless infinite loop
  const marqueeImages = [...images, ...images];

  return (
    <section className={`overflow-hidden ${className}`}>
      {/* CSS Animation for the marquee */}
      <style>{`
        @keyframes infinite-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: infinite-scroll 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-full overflow-hidden">
        {/* ✅ The inner track takes full width (w-max) and loops continuously */}
        <div
          className="flex w-max animate-marquee gap-3 px-5 lg:gap-[1.04vw] lg:px-0"
          style={{ willChange: "transform" }}
        >
          {marqueeImages.map((src, i) => (
            <div
              key={src + i}
              className="aspect-[577/376] w-[78vw] shrink-0 overflow-hidden sm:w-[45vw] lg:w-[26vw]"
            >
              <img 
                src={src} 
                alt="" 
                loading="lazy" 
                className="size-full object-cover" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}