"use client";

import { useEffect, useRef } from "react";

interface CatalogScrollRestorationProps {
  currentPage: number;
  targetId?: string;
  fallbackTargetId?: string;
  offset?: number;
}

export function CatalogScrollRestoration({
  currentPage,
  targetId = "catalog-top",
  fallbackTargetId = "main-content",
  offset = -20,
}: CatalogScrollRestorationProps) {
  const prevPageRef = useRef(currentPage);

  useEffect(() => {
    if (prevPageRef.current !== currentPage) {
      prevPageRef.current = currentPage;
      if (typeof window !== "undefined") {
        const topEl = document.getElementById(targetId) || document.getElementById(fallbackTargetId);
        if (topEl) {
          const y = topEl.getBoundingClientRect().top + window.pageYOffset + offset;
          window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }
  }, [currentPage, targetId, fallbackTargetId, offset]);

  return null;
}
