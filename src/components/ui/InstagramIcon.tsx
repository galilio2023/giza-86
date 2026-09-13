import React, { useId } from "react";

export interface InstagramIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * - "badge": Signature Happy Instagram Sunset/Rainbow gradient (#FFD521 -> #FF6B35 -> #FF1361 -> #D91A80 -> #8A2387) with specular depth
   * - "pure": Pure Instagram camera vector with stroke="currentColor"
   * - "obsidian": Minimalist dark Obsidian circle (#09090b) with white camera glyph
   * - "colored": Alias to "badge"
   */
  variant?: "badge" | "pure" | "obsidian" | "colored";
  className?: string;
  circleClassName?: string;
}

export function InstagramIcon({
  variant = "badge",
  className = "w-5 h-5",
  circleClassName = "transition-all",
  ...props
}: InstagramIconProps) {
  const uid = useId();

  if (variant === "pure") {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
        {...props}
      >
        <rect
          x="12"
          y="12"
          width="24"
          height="24"
          rx="6.5"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <circle
          cx="24"
          cy="24"
          r="5.5"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <circle
          cx="31.2"
          cy="16.8"
          r="1.4"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (variant === "obsidian") {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
        {...props}
      >
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="#09090b"
          className={circleClassName}
        />
        <rect
          x="13"
          y="13"
          width="22"
          height="22"
          rx="6"
          stroke="#ffffff"
          strokeWidth="2.2"
        />
        <circle
          cx="24"
          cy="24"
          r="5"
          stroke="#ffffff"
          strokeWidth="2.2"
        />
        <circle
          cx="30.5"
          cy="17.5"
          r="1.3"
          fill="#ffffff"
        />
      </svg>
    );
  }

  // Default ("badge" | "colored"): Joyful Sunset Festival Gradient with Specular Depth & Violet Glow
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <defs>
        {/* Full Rich Sunset/Berry Gradient */}
        <linearGradient
          id={`${uid}-ig-grad`}
          x1="12%"
          y1="100%"
          x2="88%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#FFD521" />
          <stop offset="22%" stopColor="#FF6B35" />
          <stop offset="46%" stopColor="#FF1361" />
          <stop offset="72%" stopColor="#D91A80" />
          <stop offset="100%" stopColor="#8A2387" />
        </linearGradient>

        {/* Upper-Right Violet/Indigo Sheen */}
        <radialGradient
          id={`${uid}-ig-corner`}
          cx="86%"
          cy="14%"
          r="65%"
        >
          <stop offset="0%" stopColor="#405DE6" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#405DE6" stopOpacity="0" />
        </radialGradient>

        {/* Specular Radial Glint */}
        <radialGradient
          id={`${uid}-ig-spec`}
          cx="32%"
          cy="18%"
          r="48%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        {/* Soft Drop Shadow for the camera glyph */}
        <filter id={`${uid}-ig-shadow`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1.2" floodColor="#3f001f" floodOpacity="0.32" />
        </filter>
      </defs>

      {/* Base Sunset Circle */}
      <circle
        cx="24"
        cy="24"
        r="22"
        fill={`url(#${uid}-ig-grad)`}
        className={circleClassName}
      />
      {/* Corner Indigo Overlay */}
      <circle
        cx="24"
        cy="24"
        r="22"
        fill={`url(#${uid}-ig-corner)`}
        pointerEvents="none"
      />
      {/* Specular Highlight Overlay */}
      <circle
        cx="24"
        cy="24"
        r="22"
        fill={`url(#${uid}-ig-spec)`}
        pointerEvents="none"
      />

      {/* Camera Glyph */}
      <g filter={`url(#${uid}-ig-shadow)`}>
        <rect
          x="13"
          y="13"
          width="22"
          height="22"
          rx="6"
          stroke="#ffffff"
          strokeWidth="2.3"
        />
        <circle
          cx="24"
          cy="24"
          r="5.2"
          stroke="#ffffff"
          strokeWidth="2.3"
        />
        <circle
          cx="30.5"
          cy="17.5"
          r="1.35"
          fill="#ffffff"
        />
      </g>
    </svg>
  );
}
