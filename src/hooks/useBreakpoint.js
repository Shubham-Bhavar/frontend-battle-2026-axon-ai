/* ============================================================
   useBreakpoint.js
   Detects current viewport breakpoint via ResizeObserver on
   document.documentElement. Returns a stable string label and
   boolean shorthands. Never triggers global re-renders beyond
   the consuming component.
   ============================================================ */

import { useState, useEffect, useCallback } from 'react';

/* ── Breakpoint thresholds (mirrors variables.css comments) ─ */
const BREAKPOINTS = {
  MOBILE:  480,   // ≤ 480px
  TABLET:  1024,  // 481px – 1023px
  DESKTOP: 1024,  // ≥ 1024px
};

/**
 * Derives a stable breakpoint label from a pixel width.
 * @param {number} width
 * @returns {'mobile' | 'tablet' | 'desktop'}
 */
function getBreakpoint(width) {
  if (width <= BREAKPOINTS.MOBILE)  return 'mobile';
  if (width < BREAKPOINTS.DESKTOP)  return 'tablet';
  return 'desktop';
}

/**
 * useBreakpoint()
 *
 * @returns {{
 *   breakpoint: 'mobile' | 'tablet' | 'desktop',
 *   isMobile:   boolean,
 *   isTablet:   boolean,
 *   isDesktop:  boolean,
 *   width:      number,
 * }}
 */
export function useBreakpoint() {
  const [state, setState] = useState(() => {
    // SSR-safe: fall back to 0 width on server
    const width = typeof window !== 'undefined' ? window.innerWidth : 0;
    return { width, breakpoint: getBreakpoint(width) };
  });

  const handleResize = useCallback((width) => {
    const next = getBreakpoint(width);
    setState(prev => {
      // Only update state when the breakpoint label actually changes,
      // preventing needless re-renders on sub-breakpoint pixel shifts.
      if (prev.breakpoint === next && prev.width === width) return prev;
      return { width, breakpoint: next };
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // ResizeObserver on <html> is more reliable than window resize
    // for capturing viewport changes caused by scrollbar appearance.
    const ro = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;
      // Use contentRect.width as it excludes scrollbar
      handleResize(entry.contentRect.width);
    });

    ro.observe(document.documentElement);

    // Sync immediately in case the initial SSR guess was wrong
    handleResize(window.innerWidth);

    return () => ro.disconnect();
  }, [handleResize]);

  return {
    breakpoint: state.breakpoint,
    isMobile:   state.breakpoint === 'mobile',
    isTablet:   state.breakpoint === 'tablet',
    isDesktop:  state.breakpoint === 'desktop',
    width:      state.width,
  };
}

export default useBreakpoint;
