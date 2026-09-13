"use client";

import React, { useId } from "react";

interface CottonEmblemProps {
  className?: string;
  variant?: "gold" | "monochrome" | "outline";
}

/**
 * Egyptian Cotton Blossom Luxury Emblem
 * Inspired by authentic Giza long-staple cotton fibers and the heritage royal calyx.
 * Fully scalable vector mark with dynamic linear gradient and accessible semantics.
 */
export function CottonEmblem({
  className = "w-7 h-7",
  variant = "gold",
}: CottonEmblemProps) {
  const rawId = useId();
  // Sanitize React useId colons for valid SVG ID references
  const gradientId = `cotton-gold-grad-${rawId.replace(/:/g, "")}`;
  const highlightId = `cotton-gold-hi-${rawId.replace(/:/g, "")}`;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Signature Egyptian Metallic Gold 3-Stop Gradient */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dfba73" />
          <stop offset="50%" stopColor="#c59b27" />
          <stop offset="100%" stopColor="#9e7514" />
        </linearGradient>

        {/* Lighter Top Highlight */}
        <linearGradient id={highlightId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f7e7c4" />
          <stop offset="70%" stopColor="#dfba73" />
          <stop offset="100%" stopColor="#c59b27" />
        </linearGradient>
      </defs>

      {/* Top Cotton Pod (Fluffy Long-Staple Lobe) */}
      <path
        d="M16 4C13.2 4 11 6.2 11 9C11 9.8 11.2 10.6 11.5 11.3C12.8 10.5 14.3 10 16 10C17.7 10 19.2 10.5 20.5 11.3C20.8 10.6 21 9.8 21 9C21 6.2 18.8 4 16 4Z"
        fill={`url(#${highlightId})`}
      />

      {/* Left Cotton Pod Lobe */}
      <path
        d="M7 13.5C7 10.7 9.2 8.5 12 8.5C12.5 8.5 13.1 8.6 13.6 8.8C12.6 10.1 12 11.7 12 13.5C12 15.3 12.6 16.9 13.6 18.2C13.1 18.4 12.5 18.5 12 18.5C9.2 18.5 7 16.3 7 13.5Z"
        fill={`url(#${gradientId})`}
      />

      {/* Right Cotton Pod Lobe */}
      <path
        d="M25 13.5C25 10.7 22.8 8.5 20 8.5C19.5 8.5 18.9 8.6 18.4 8.8C19.4 10.1 20 11.7 20 13.5C20 15.3 19.4 16.9 18.4 18.2C18.9 18.4 19.5 18.5 20 18.5C22.8 18.5 25 16.3 25 13.5Z"
        fill={`url(#${gradientId})`}
      />

      {/* Center Cotton Blossom Heart */}
      <path
        d="M16 9C13.5 9 11.5 11 11.5 13.5C11.5 16 13.5 18 16 18C18.5 18 20.5 16 20.5 13.5C20.5 11 18.5 9 16 9Z"
        fill={`url(#${highlightId})`}
        fillOpacity="0.95"
      />

      {/* Royal Calyx / Golden Sepals (Cradling Bracts) */}
      <path
        d="M5.5 17.5C7.2 20.8 10.5 22.8 14.2 23.3L13.2 26.8C13.1 27.3 13.5 27.8 14 27.8H18C18.5 27.8 18.9 27.3 18.8 26.8L17.8 23.3C21.5 22.8 24.8 20.8 26.5 17.5C24.2 19 20.8 19.8 16 19C11.2 19.8 7.8 19 5.5 17.5Z"
        fill={`url(#${gradientId})`}
      />

      {/* Center Stem Core Accent */}
      <path
        d="M16 23.5V26.8"
        stroke="#8e6810"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Subtle Central Gold Starburst Seed Accent */}
      <circle cx="16" cy="13.5" r="1.2" fill="#8e6810" opacity="0.6" />
    </svg>
  );
}
