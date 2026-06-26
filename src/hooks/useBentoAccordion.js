/* ============================================================
   useBentoAccordion.js
   Manages the active feature index for both Bento Grid
   (desktop hover) and Accordion (mobile tap) layouts.

   BRIEF CONSTRAINT — Context Lock:
   "If a user is hovering a bento-node on desktop and resizes
   past the mobile breakpoint, the active index must transfer
   to the Accordion so the corresponding panel opens smoothly."

   This hook owns that transfer entirely. Components only
   read state and call the provided handlers.
   ============================================================ */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useBreakpoint } from './useBreakpoint.js';
import { featuresData }  from '../data/index.js';

const TOTAL_FEATURES = featuresData.length;

/**
 * useBentoAccordion(options?)
 *
 * @param {{ defaultIndex?: number }} options
 *   defaultIndex  — which feature panel is open on first render
 *                   (accordion) or pre-highlighted (bento).
 *                   Defaults to -1 (none active).
 *
 * @returns {{
 *   activeIndex:       number,          // -1 = none
 *   isDesktop:         boolean,
 *   isMobile:          boolean,
 *   isTablet:          boolean,
 *   // Bento handlers (desktop hover)
 *   onBentoEnter:      (index: number) => void,
 *   onBentoLeave:      (index: number) => void,
 *   // Accordion handlers (mobile tap)
 *   onAccordionToggle: (index: number) => void,
 *   // Derived helpers for rendering
 *   isActive:          (index: number) => boolean,
 *   isOpen:            (index: number) => boolean,   // alias for accordion
 * }}
 */
export function useBentoAccordion({ defaultIndex = -1 } = {}) {
  const { isDesktop, isMobile, isTablet, breakpoint } = useBreakpoint();

  /**
   * Single active index shared across both layouts.
   * -1 means no panel is active / open.
   */
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  /**
   * Track the previous breakpoint to detect layout transitions.
   * We use a ref so the comparison inside the effect doesn't
   * itself cause re-renders.
   */
  const prevBreakpointRef = useRef(breakpoint);

  /* ── Context Lock Transfer ─────────────────────────────────
     When the viewport crosses from desktop → mobile/tablet,
     the activeIndex is already set (from hover). We preserve
     it so the Accordion opens on that same panel.
     When transitioning back to desktop, we keep the last
     accordion index so the bento highlights match.
     No reset — smooth continuity in both directions.
  ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    const prev = prevBreakpointRef.current;
    const next = breakpoint;

    if (prev === next) return; // no layout change, nothing to transfer

    // On any layout transition: if there's an active index, it
    // persists naturally because we never reset it here.
    // The only special case is: if somehow activeIndex is out of
    // range (e.g. data changed), clamp it.
    setActiveIndex(prev => {
      if (prev === -1) return -1;
      if (prev >= TOTAL_FEATURES) return TOTAL_FEATURES - 1;
      return prev; // preserve — this IS the context transfer
    });

    prevBreakpointRef.current = next;
  }, [breakpoint]);


  /* ── Bento Handlers (desktop) ──────────────────────────── */

  const onBentoEnter = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  /**
   * onBentoLeave: clear active state only if the leaving node
   * is still the active one (prevents flicker when cursor
   * briefly passes through a gap between nodes).
   */
  const onBentoLeave = useCallback((index) => {
    setActiveIndex(prev => (prev === index ? -1 : prev));
  }, []);


  /* ── Accordion Handler (mobile / tablet) ───────────────── */

  /**
   * Toggle: tap the open panel → closes it (-1).
   *         tap a different panel → opens it.
   */
  const onAccordionToggle = useCallback((index) => {
    setActiveIndex(prev => (prev === index ? -1 : index));
  }, []);


  /* ── Derived helpers ───────────────────────────────────── */

  const isActive = useCallback(
    (index) => activeIndex === index,
    [activeIndex]
  );

  // "isOpen" is a semantic alias — same logic, accordion-flavoured name
  const isOpen = isActive;

  return {
    activeIndex,
    isDesktop,
    isMobile,
    isTablet,
    onBentoEnter,
    onBentoLeave,
    onAccordionToggle,
    isActive,
    isOpen,
  };
}

export default useBentoAccordion;
