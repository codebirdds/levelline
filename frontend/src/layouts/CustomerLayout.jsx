import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function CustomerLayout({ scrolled = false }) {
  const footerRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // 1. Check if it's mobile screen (less than 1024px)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 2. Measure footer height ONLY on desktop
  useLayoutEffect(() => {
    if (isMobile) {
      setFooterHeight(0); // Reset on mobile
      return;
    }
    
    const f = footerRef.current;
    if (!f) return;

    const measure = () => {
      if (f.offsetHeight > 0) setFooterHeight(f.offsetHeight);
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(f);
    return () => ro.disconnect();
  }, [isMobile]);

  // 3. MOBILE LAYOUT (Normal scroll flow)
  if (isMobile) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">
          <Header scroll={scrolled} />
          <main>
            <Outlet />
          </main>
        </div>
        {/* Footer is just placed after main content here */}
        <Footer />
      </div>
    );
  }

  // 4. DESKTOP LAYOUT (Fixed Reveal Effect)
  return (
    <div className="relative">
      {/* Fixed footer — behind content */}
      <div ref={footerRef} className="fixed inset-x-0 bottom-0 z-0">
        <Footer />
      </div>

      {/* Content — opaque bg, scrolls OVER footer */}
      <div
        className="relative z-10 bg-bg min-h-screen"
        style={{
          paddingBottom: footerHeight,
          backgroundClip: "content-box",
        }}
      >
        <Header scroll={scrolled} />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}