import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // ✅ 1. iOS Safari ko bolo ki wo scroll position yaad na rakhe
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // ✅ 2. Forcefully top pe scroll karo (instant behavior)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" // 'smooth' ya 'auto' ki jagah 'instant' use karo iOS ke liye
    });
    
    // ✅ 3. Ek chota sa backup timeout bhi laga do (kabhi kabhi DOM render hone me time lagta hai)
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);

  }, [pathname]);

  return null;
}