import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axiosInstance"; // Apna path check kar lena
import { ROUTES } from "../../../routes/routePaths";
import { Reveal, ImageReveal } from "../../../components/animation";
import { RTW_HERO } from "../content";

export default function RtwHero() {
  const [mediaData, setMediaData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ API Call for ready_to_wear_hero
  useEffect(() => {
    const fetchRtwHeroMedia = async () => {
      try {
        const res = await api.get("v1/site-media/key/ready_to_wear_hero");
        if (res.data?.success && res.data?.data) {
          setMediaData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to load dynamic RTW hero, using static fallback", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRtwHeroMedia();
  }, []);

  // ✅ Fallback Logic
  const isDynamic = !!mediaData && mediaData.status === "active";
  const mediaType = isDynamic ? mediaData.media_type : "image"; // Fallback is static image
  
  const desktopSrc = isDynamic ? mediaData.desktop_url : RTW_HERO.image;
  const mobileSrc = isDynamic ? mediaData.mobile_url : RTW_HERO.image;

  // Helper to render Video or Image
  const renderMedia = (src, className) => {
    if (!src) return null;
    
    if (mediaType === "video") {
      return (
        <video
          src={src}
          className={className}
          autoPlay
          muted
          loop
          playsInline
        />
      );
    }
    return <img src={src} alt="Ready to Wear" className={className} />;
  };

  return (
    <section className="relative isolate h-[70svh] w-full overflow-hidden">
      
      {/* ✅ Dynamic Media inside ImageReveal (Animation stays intact) */}
      <ImageReveal variant="zoom" scaleFrom={1.08} duration={1600} className="absolute inset-0 -z-10">
        {loading ? (
          <div className="size-full bg-ink" /> // Loading placeholder
        ) : (
          <>
            {/* ✅ Desktop Media */}
            <div className="absolute inset-0 hidden md:block">
              {renderMedia(desktopSrc, "size-full object-cover object-top")}
            </div>

            {/* ✅ Mobile Media */}
            <div className="absolute inset-0 block md:hidden">
              {renderMedia(mobileSrc, "size-full object-cover object-top")}
            </div>
          </>
        )}
      </ImageReveal>

      {/* Gradient Overlays (Z-index ensure karne ke liye -z-10 ke baad) */}
      <div className="absolute inset-0 -z-10 bg-ink/40" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-ink/60 to-transparent" />

      {/* Text Content */}
      <div className="absolute inset-x-0 inset-y-100 bottom-0 px-3 pb-8 sm:px-5 lg:px-[2%] lg:pb-6">
        <Reveal variant="fade" delay={100}>
          <nav aria-label="Breadcrumb" className="font-sans text-[10px] font-medium text-[#DEDEDE] lg:text-xs">
            <Link to={ROUTES.HOME} className="transition hover:text-gold">Home</Link>
            <span className="mx-1.5">/</span>
            <span>Ready-to-wear</span>
          </nav>
        </Reveal>
        <Reveal delay={200}>
          <h1 className="mt-2 font-sans text-2xl font-semibold text-[#C7C7C7] sm:text-3xl lg:text-4xl">
            {RTW_HERO.title}
          </h1>
        </Reveal>
        <Reveal delay={350}>
          <p className="mt-3 max-w-[479px] font-sans text-xs font-medium leading-relaxed text-[#C3C3C3] sm:text-sm lg:mt-4 lg:text-sm lg:leading-[24px]">
            {RTW_HERO.text}
          </p>
        </Reveal>
      </div>
    </section>
  );
}