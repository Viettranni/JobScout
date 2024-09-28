import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useAnimatedScroll() {
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
  }, [pathname]);
}

function ScrollToTop() {
  useAnimatedScroll();
  return null;
}

export default ScrollToTop;