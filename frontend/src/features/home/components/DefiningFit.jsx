import { useEffect, useState, useRef } from "react";
import api from "../../../api/axiosInstance"; 
import ArrowLink from "../../../components/ui/ArrowLink";
import { Reveal } from "../../../components/animation";
import { FIT } from "../content";

// ✅ iOS BULLETPROOF VIDEO COMPONENT
const AutoPlayVideo = ({ src, className }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, []);

  const handleCanPlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("iOS blocked autoplay on canplay:", err);
      });
    }
  };

  return (
    <video
      ref={videoRef}
      className={`${className} pointer-events-none`}
      autoPlay
      muted
      loop
      playsInline
      webkit-playsinline="true"
      preload="auto"
      controls={false}
      onCanPlay={handleCanPlay} // ✅ Triggers play exactly when iOS is ready
    >
      <source src={src} type="video/mp4" />
    </video>
  );
};

export default function DefiningFit() {
  const [mediaData, setMediaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchFitMedia = async () => {
      try {
        const res = await api.get("v1/site-media/key/home_define_fit");
        if (res.data?.success && res.data?.data) {
          setMediaData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to load dynamic fit media", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFitMedia();
  }, []);

  const isDynamic = !!mediaData && mediaData.status === "active";
  const mediaType = isDynamic ? mediaData.media_type : "video"; 
  
  const desktopSrc = isDynamic ? mediaData.desktop_url : FIT.video;
  const mobileSrc = isDynamic ? mediaData.mobile_url : FIT.video;
  const activeSrc = isMobile ? (mobileSrc || desktopSrc) : desktopSrc;

  const renderMedia = (src, className) => {
    if (!src) return null;
    if (mediaType === "video") {
      return <AutoPlayVideo src={src} className={className} />;
    }
    return <img src={src} alt="Defining Fit" className={className} />;
  };

  return (
    <section className="container-x py-10 lg:py-14">
      <div className="grid items-center gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-14">
        
        <Reveal variant="left" duration={1000}>
          <div className="relative aspect-[1173/616] overflow-hidden rounded-sm bg-[#F5F1E9]">
            {loading ? (
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="h-6 w-6 rounded-full border-2 border-brand border-t-transparent animate-spin" />
               </div>
            ) : (
              <div className="absolute inset-0">
                {renderMedia(activeSrc, "size-full object-cover")}
              </div>
            )}
          </div>
        </Reveal>

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