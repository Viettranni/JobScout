import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function useAnimatedScroll(trigger) {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      const c = document.documentElement.scrollTop || document.body.scrollTop;
      if (c > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, c - c / 20);
      }
    };
    scrollToTop();
  }, [pathname, trigger]); // Add the 'trigger' as a dependency
}

function ScrollToTop({ trigger }) {
  useAnimatedScroll(trigger); // Pass the trigger to the scroll function
  return null;
}

export default ScrollToTop;
