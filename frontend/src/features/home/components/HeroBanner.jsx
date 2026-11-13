import { useEffect, useRef } from "react";

const AutoPlayVideo = ({ src, poster, className }) => {
  const videoRef = useRef(null);

  // Fallback: try to play after metadata loads (belt-and-suspenders)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptPlay = () => {
      video.play().catch((err) => {
        // This is expected if Low Power Mode is on or other strict conditions apply.
        console.log("Autoplay prevented by browser policy:", err.name);
      });
    };

    // If the video is already ready, play now.
    if (video.readyState >= 1) {
      attemptPlay();
    } else {
      video.addEventListener("loadedmetadata", attemptPlay, { once: true });
    }

    return () => video.removeEventListener("loadedmetadata", attemptPlay);
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={`${className} pointer-events-none`}
      poster={poster}
      // 1. Use the `src` attribute directly, not a <source> child.
      src={src}
      // 2. Core autoplay attributes
      autoPlay
      muted
      loop
      playsInline
      // 3. Let Safari manage loading – it honors "metadata"
      preload="metadata"
      controls={false}
    />
  );
};