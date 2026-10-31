import { useEffect, useState, useRef } from "react";
import api from "../../../api/axiosInstance"; 
import { HERO } from "../content";

// ✅ iOS BULLETPROOF VIDEO COMPONENT
const AutoPlayVideo = ({ src, poster, className }) => {
  const videoRef = useRef(null);

  // Force muted on mount (React sometimes forgets)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, []);

  // Force play when the video is finally ready to be played
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
      poster={poster}
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

export default function HeroBanner() {
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
    const fetchHeroMedia = async () => {
      try {
        const res = await api.get("v1/site-media/key/home_hero");
        if (res.data?.success && res.data?.data) {
          setMediaData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to load dynamic hero media", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroMedia();
  }, []);

  const isDynamic = !!mediaData && mediaData.status === "active";
  const mediaType = isDynamic ? mediaData.media_type : (HERO.video ? "video" : "image");
  
  const desktopSrc = isDynamic ? mediaData.desktop_url : (HERO.video || HERO.image);
  const mobileSrc = isDynamic ? mediaData.mobile_url : (HERO.video || HERO.image);
  const activeSrc = isMobile ? (mobileSrc || desktopSrc) : desktopSrc;
  const poster = isDynamic ? "" : HERO.image;

  const renderMedia = (src, className) => {
    if (!src) return null;
    if (mediaType === "video") {
      return <AutoPlayVideo src={src} poster={poster} className={className} />;
    }
    return <img src={src} alt="Hero" className={className} />;
  };

  if (loading) return <section className="h-[100svh] min-h-[560px] w-full bg-ink" />;

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink">
      <div className="absolute inset-0">
        {renderMedia(activeSrc, "size-full object-cover")}
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