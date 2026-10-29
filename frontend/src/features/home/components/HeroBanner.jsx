import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance"; // Path check kar lena
import { HERO } from "../content";

export default function HeroBanner() {
  const [mediaData, setMediaData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ API Call for home_hero
  useEffect(() => {
    const fetchHeroMedia = async () => {
      try {
        const res = await api.get("v1/site-media/key/home_hero");
        if (res.data?.success && res.data?.data) {
          setMediaData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to load dynamic hero media, using static fallback", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroMedia();
  }, []);

  // ✅ Fallback Logic
  const isDynamic = !!mediaData && mediaData.status === "active";
  const mediaType = isDynamic ? mediaData.media_type : (HERO.video ? "video" : "image");
  
  const desktopSrc = isDynamic ? mediaData.desktop_url : (HERO.video || HERO.image);
  const mobileSrc = isDynamic ? mediaData.mobile_url : (HERO.video || HERO.image);
  const poster = isDynamic ? "" : HERO.image;

  // ✅ Helper to render Video or Image
  const renderMedia = (src, className) => {
    if (!src) return null;
    
    if (mediaType === "video") {
      return (
        <video
          key={src} // ✅ Key add karna zaroori hai source change ke liye
          className={className}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
        />
      );
    }
    return <img key={src} src={src} alt="Hero" className={className} />;
  };

  // Don't flash the screen while loading first time
  if (loading) return <section className="h-[100svh] min-h-[560px] w-full bg-ink" />;

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink">
      
      {/* ✅ Desktop Media (Hidden on Mobile) */}
      <div className="absolute inset-0 hidden md:block">
        {renderMedia(desktopSrc, "size-full object-cover")}
      </div>

      {/* ✅ Mobile Media (Hidden on Desktop) */}
      <div className="absolute inset-0 block md:hidden">
        {renderMedia(mobileSrc, "size-full object-cover")}
      </div>

      <div className="absolute inset-0 bg-black/55"></div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#020202] to-transparent" />

      <div className="relative z-10 flex h-full flex-col items-center justify-end px-5 pb-6 text-center lg:pb-10">
        <h1 className="font-serif text-3xl uppercase leading-[0.95] tracking-tight text-cream/95 lg:text-4xl">
          The <br /> Art of Style
        </h1>
        <p className="mt-2 max-w-xl font-serif text-base text-cream/85 lg:mt-3 lg:text-sm">
          {HERO.tagline}
        </p>
      </div>
    </section>
  );
}