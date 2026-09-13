import React, { useId } from "react";

export interface TikTokIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * - "badge": Vibrant Electric Midnight with Neon Cyan (#00F2FE) & Hot Magenta (#FE2C55) auras and 3D Chromatic Pop note
   * - "pure": Pure TikTok musical note vector with fill="currentColor"
   * - "obsidian": Minimalist dark Obsidian circle (#09090b) with white note
   * - "colored": Alias to "badge"
   */
  variant?: "badge" | "pure" | "obsidian" | "colored";
  className?: string;
  circleClassName?: string;
}

export function TikTokIcon({
  variant = "badge",
  className = "w-5 h-5",
  circleClassName = "transition-all",
  ...props
}: TikTokIconProps) {
  const uid = useId();
  const notePath =
    "M32.8 17.6c-2.3-.2-4.4-1.3-5.7-3.1-.4-.6-.7-1.3-.9-2.1h-4.3v17.2c0 2.4-1.9 4.3-4.3 4.3s-4.3-1.9-4.3-4.3 1.9-4.3 4.3-4.3c.5 0 1 .1 1.4.3v-4.5c-.5-.1-1-.1-1.4-.1-4.8 0-8.7 3.9-8.7 8.7s3.9 8.7 8.7 8.7 8.7-3.9 8.7-8.7V20.2c2.4 1.7 5.3 2.6 8.2 2.6v-4.4c-.6-.4-1.1-.6-1.6-.8z";

  if (variant === "pure") {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
        {...props}
      >
        <path d={notePath} />
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
        <path d={notePath} fill="#ffffff" />
      </svg>
    );
  }

  // Default ("badge" | "colored"): Vibrant Electric Neon Midnight with 3D Cyan & Magenta Pop
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
        {/* Electric Midnight Gradient */}
        <linearGradient
          id={`${uid}-tt-bg`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#16122c" />
          <stop offset="50%" stopColor="#0e0f1c" />
          <stop offset="100%" stopColor="#080811" />
        </linearGradient>

        {/* Top-Left Vibrant Electric Cyan Spotlight */}
        <radialGradient
          id={`${uid}-tt-cyan`}
          cx="20%"
          cy="20%"
          r="62%"
        >
          <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#00F2FE" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#00F2FE" stopOpacity="0" />
        </radialGradient>

        {/* Bottom-Right Neon Hot Pink Spotlight */}
        <radialGradient
          id={`${uid}-tt-pink`}
          cx="80%"
          cy="80%"
          r="62%"
        >
          <stop offset="0%" stopColor="#FE2C55" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#FE2C55" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#FE2C55" stopOpacity="0" />
        </radialGradient>

        {/* Subtle dual-color neon rim */}
        <linearGradient
          id={`${uid}-tt-rim`}
          x1="15%"
          y1="15%"
          x2="85%"
          y2="85%"
        >
          <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#00F2FE" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FE2C55" stopOpacity="0.5" />
        </linearGradient>

        {/* Specular Radial Glint */}
        <radialGradient
          id={`${uid}-tt-spec`}
          cx="38%"
          cy="18%"
          r="45%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Base Electric Circle */}
      <circle
        cx="24"
        cy="24"
        r="22"
        fill={`url(#${uid}-tt-bg)`}
        className={circleClassName}
      />
      {/* Cyan Glow Overlay */}
      <circle
        cx="24"
        cy="24"
        r="22"
        fill={`url(#${uid}-tt-cyan)`}
        pointerEvents="none"
      />
      {/* Pink Glow Overlay */}
      <circle
        cx="24"
        cy="24"
        r="22"
        fill={`url(#${uid}-tt-pink)`}
        pointerEvents="none"
      />
      {/* Integrated Dual Neon Rim */}
      <circle
        cx="24"
        cy="24"
        r="21.2"
        fill="none"
        stroke={`url(#${uid}-tt-rim)`}
        strokeWidth="1.5"
        pointerEvents="none"
      />
      {/* Specular Sheen */}
      <circle
        cx="24"
        cy="24"
        r="22"
        fill={`url(#${uid}-tt-spec)`}
        pointerEvents="none"
      />

      {/* 3D Chromatic Aberration Musical Note (Electric Cyan Displacement) */}
      <g transform="translate(-1.3, -0.7)">
        <path d={notePath} fill="#00F2FE" opacity="0.95" />
      </g>
      {/* 3D Chromatic Aberration Musical Note (Hot Magenta Displacement) */}
      <g transform="translate(1.3, 0.7)">
        <path d={notePath} fill="#FE2C55" opacity="0.95" />
      </g>
      {/* Core Crisp White Note */}
      <path d={notePath} fill="#ffffff" />
    </svg>
  );
}
