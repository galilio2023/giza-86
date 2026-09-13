"use client";

import { useEffect } from "react";

/**
 * Locks page scrolling while `active` is true.
 * Extracted from CartDrawer and QuickViewModal to eliminate duplication.
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    document.documentElement.classList.add("scroll-locked");
    document.body.classList.add("scroll-locked");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.classList.remove("scroll-locked");
      document.body.classList.remove("scroll-locked");
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [active]);
}
