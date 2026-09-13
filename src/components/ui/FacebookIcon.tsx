import React, { useId } from "react";

export interface FacebookIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * - "badge": Signature Happy Royal-to-Electric Blue jewel gradient (#18ACFE -> #0163E0 -> #0052CC) with specular depth
   * - "pure": Pure Facebook "f" vector with fill="currentColor"
   * - "obsidian": Minimalist dark Obsidian circle (#09090b) with white icon
   * - "colored": Alias to "badge"
   */
  variant?: "badge" | "pure" | "obsidian" | "colored";
  className?: string;
  circleClassName?: string;
}

export function FacebookIcon({
  variant = "badge",
  className = "w-5 h-5",
  circleClassName = "transition-all",
  ...props
}: FacebookIconProps) {
  const uid = useId();
  const fPath =
    "M27.5 37V24h4.4l.7-5.1h-5.1v-3.3c0-1.5.4-2.5 2.6-2.5H33V8.6c-.5-.1-2.1-.2-4-.2-4 0-6.7 2.4-6.7 6.9v3.6h-4.4V24h4.4v13h4.2z";

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
        <path d={fPath} />
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
        <path d={fPath} fill="#ffffff" />
      </svg>
    );
  }

  // Default ("badge" | "colored"): Happy Vibrant Royal-to-Electric Blue Jewel with Specular Depth
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
        {/* Vibrant Royal-to-Electric Blue Gradient */}
        <linearGradient
          id={`${uid}-fb-grad`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#18ACFE" />
          <stop offset="60%" stopColor="#0163E0" />
          <stop offset="100%" stopColor="#0052CC" />
        </linearGradient>

        {/* Specular Radial Glint */}
        <radialGradient
          id={`${uid}-fb-spec`}
          cx="38%"
          cy="22%"
          r="50%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        {/* Soft Contrast Drop Shadow for the "f" */}
        <filter id={`${uid}-fb-shadow`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#001844" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Base Gradient Circle */}
      <circle
        cx="24"
        cy="24"
        r="22"
        fill={`url(#${uid}-fb-grad)`}
        className={circleClassName}
      />
      {/* Specular Highlight Overlay */}
      <circle
        cx="24"
        cy="24"
        r="22"
        fill={`url(#${uid}-fb-spec)`}
        pointerEvents="none"
      />
      {/* Crisp White "f" */}
      <path
        d={fPath}
        fill="#ffffff"
        filter={`url(#${uid}-fb-shadow)`}
      />
    </svg>
  );
}
