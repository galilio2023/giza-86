"use client";

import React, { useId } from "react";

interface ModanilMonogramProps {
  className?: string;
}

/**
 * MODANIL Luxury Monogram Mark (Concept 1: Architectural Interlocking M)
 * Features 3D-beveled geometric Egyptian Gold facets with light and shadow planes.
 */
export function ModanilMonogram({ className = "w-7 h-7" }: ModanilMonogramProps) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");
  const goldLight = `mono-light-${id}`;
  const goldMid = `mono-mid-${id}`;
  const goldDark = `mono-dark-${id}`;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Top/Left Highlights */}
        <linearGradient id={goldLight} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff4dc" />
          <stop offset="40%" stopColor="#e5c583" />
          <stop offset="100%" stopColor="#c59b27" />
        </linearGradient>

        {/* Primary Egyptian Metallic Gold */}
        <linearGradient id={goldMid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dfba73" />
          <stop offset="50%" stopColor="#c59b27" />
          <stop offset="100%" stopColor="#9e7514" />
        </linearGradient>

        {/* Right/Bottom Shadow Planes */}
        <linearGradient id={goldDark} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ad8318" />
          <stop offset="60%" stopColor="#7e5a0b" />
          <stop offset="100%" stopColor="#573e04" />
        </linearGradient>
      </defs>

      {/* === ARCHITECTURAL INTERLOCKING 'M' MONOGRAM (CONCEPT 1) === */}

      {/* --- Outer M: Left Vertical Pillar --- */}
      {/* Light Facet */}
      <path d="M4 27V7L6.5 5V27H4Z" fill={`url(#${goldLight})`} />
      {/* Mid Facet */}
      <path d="M6.5 5L9 7V27H6.5V5Z" fill={`url(#${goldMid})`} />
      {/* Foot Base */}
      <path d="M2.5 25H9.5V27H2.5V25Z" fill={`url(#${goldMid})`} />

      {/* --- Outer M: Right Vertical Pillar --- */}
      {/* Mid Facet */}
      <path d="M23 7L25.5 5V27H23V7Z" fill={`url(#${goldMid})`} />
      {/* Shadow Facet */}
      <path d="M25.5 5L28 7V27H25.5V5Z" fill={`url(#${goldDark})`} />
      {/* Foot Base */}
      <path d="M22.5 25H29.5V27H22.5V25Z" fill={`url(#${goldDark})`} />

      {/* --- Outer M: Descending Chevron V (Left & Right Diagonals) --- */}
      {/* Outer Left Diagonal (Descending to Center) */}
      <path d="M6.5 5L16 16.5L14.5 18L5 7.5L6.5 5Z" fill={`url(#${goldLight})`} />
      {/* Outer Right Diagonal (Descending to Center) */}
      <path d="M25.5 5L16 16.5L17.5 18L27 7.5L25.5 5Z" fill={`url(#${goldDark})`} />

      {/* --- Interlocking Inner M (Shifted Forward Layer) --- */}
      {/* Inner M Left Peak to Base */}
      <path d="M10.5 10L12.5 8V25H10.5V10Z" fill={`url(#${goldLight})`} />
      <path d="M12.5 8L14.5 10V25H12.5V8Z" fill={`url(#${goldMid})`} />

      {/* Inner M Right Peak to Base */}
      <path d="M17.5 10L19.5 8V25H17.5V10Z" fill={`url(#${goldMid})`} />
      <path d="M19.5 8L21.5 10V25H19.5V8Z" fill={`url(#${goldDark})`} />

      {/* Inner M Center Valley V (Descending to y=21) */}
      <path d="M12.5 8L16 13L16 21L14.5 21L11.5 12L12.5 8Z" fill={`url(#${goldLight})`} />
      <path d="M19.5 8L16 13L16 21L17.5 21L20.5 12L19.5 8Z" fill={`url(#${goldDark})`} />

      {/* Architectural Bevel Highlight Apex Accents */}
      <polygon points="6.5,4.5 7.2,5.5 5.8,5.5" fill="#ffffff" opacity="0.8" />
      <polygon points="25.5,4.5 26.2,5.5 24.8,5.5" fill="#ffffff" opacity="0.6" />
      <polygon points="12.5,7.5 13.2,8.5 11.8,8.5" fill="#ffffff" opacity="0.9" />
      <polygon points="19.5,7.5 20.2,8.5 18.8,8.5" fill="#ffffff" opacity="0.7" />
    </svg>
  );
}
