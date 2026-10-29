import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance"; // Apna path check kar lena
import ArrowLink from "../../../components/ui/ArrowLink";
import { Reveal } from "../../../components/animation";
import { FIT } from "../content";

export default function DefiningFit() {
  const [mediaData, setMediaData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ API Call for home_define_fit
  useEffect(() => {
    const fetchFitMedia = async () => {
      try {
        const res = await api.get("v1/site-media/key/home_define_fit");
        if (res.data?.success && res.data?.data) {
          setMediaData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to load dynamic fit media, using static fallback", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFitMedia();
  }, []);

  // ✅ Fallback Logic (Agar backend se data nahi aaya)
  const isDynamic = !!mediaData && mediaData.status === "active";
  const mediaType = isDynamic ? mediaData.media_type : "video"; // Fallback is video
  
  const desktopSrc = isDynamic ? mediaData.desktop_url : FIT.video;
  const mobileSrc = isDynamic ? mediaData.mobile_url : FIT.video;

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
          preload="metadata"
        />
      );
    }
    return <img src={src} alt="Defining Fit" className={className} />;
  };

  return (
    <section className="container-x py-10 lg:py-14">
      <div className="grid items-center gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-14">
        
        {/* Media Section — fade + slide in from the right */}
        <Reveal variant="left" duration={1000}>
          <div className="relative aspect-[1173/616] overflow-hidden rounded-sm bg-[#F5F1E9]">
            {loading ? (
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="h-6 w-6 rounded-full border-2 border-brand border-t-transparent animate-spin" />
               </div>
            ) : (
              <>
                {/* ✅ Desktop Media (Hidden on Mobile) */}
                <div className="absolute inset-0 hidden md:block">
                  {renderMedia(desktopSrc, "size-full object-cover")}
                </div>

                {/* ✅ Mobile Media (Hidden on Desktop) */}
                <div className="absolute inset-0 block md:hidden">
                  {renderMedia(mobileSrc, "size-full object-cover")}
                </div>
              </>
            )}
          </div>
        </Reveal>

        {/* Text Section — fade + slide in from the left, slightly delayed */}
        <Reveal variant="right" delay={150}>
          <h2 className="font-sans text-lg font-medium text-[#6b6b6b] lg:text-md">
            {FIT.title}
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-[#808080]">
            {FIT.text}
          </p>
          <ArrowLink href={FIT.href} className="mt-8 uppercase">
            {FIT.cta}
          </ArrowLink>
        </Reveal>
        
      </div>
    </section>
  );
}