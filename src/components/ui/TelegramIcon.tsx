import React, { useId } from "react";

export interface TelegramIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * - "badge": Signature Sky-to-Cobalt Blue jewel gradient (#2AABEE -> #229ED9 -> #1E88E5) with specular depth
   * - "pure": Pure Telegram paper plane vector with fill="currentColor"
   * - "obsidian": Minimalist dark Obsidian circle (#09090b) with white icon
   * - "colored": Alias to "badge"
   */
  variant?: "badge" | "pure" | "obsidian" | "colored";
  className?: string;
  circleClassName?: string;
}

export function TelegramIcon({
  variant = "badge",
  className = "w-5 h-5",
  circleClassName = "transition-all",
  ...props
}: TelegramIconProps) {
  const uid = useId();
  const planePath =
    "M9.88 23.77l6.63 2.47 2.56 8.24c.26.83.84.97 1.34.45l3.66-3.53 7.6 5.61c1.4.77 2.4.37 2.75-1.3l4.98-23.46c.51-2.05-.78-2.96-2.12-2.35L4.76 21.36c-2 .8-1.98 1.92-.36 2.41zm15.8-8.22L17.5 22.8c-.8.61-1.6 1.18-.75 2.03l6.57-5.91c.71-.64 1.37-.29.83.19z";

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
        <path d={planePath} />
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
        <path d={planePath} fill="#ffffff" />
      </svg>
    );
  }

  // Default ("badge" | "colored"): Sky-to-Cobalt Blue Jewel with Specular Depth
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
        <linearGradient
          id={`${uid}-tg-grad`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#2AABEE" />
          <stop offset="60%" stopColor="#229ED9" />
          <stop offset="100%" stopColor="#1E88E5" />
        </linearGradient>

        <radialGradient
          id={`${uid}-tg-spec`}
          cx="38%"
          cy="22%"
          r="50%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        <filter id={`${uid}-tg-shadow`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#0d47a1" floodOpacity="0.3" />
        </filter>
      </defs>

      <circle
        cx="24"
        cy="24"
        r="22"
        fill={`url(#${uid}-tg-grad)`}
        className={circleClassName}
      />
      <circle
        cx="24"
        cy="24"
        r="22"
        fill={`url(#${uid}-tg-spec)`}
        pointerEvents="none"
      />
      <path
        d={planePath}
        fill="#ffffff"
        filter={`url(#${uid}-tg-shadow)`}
      />
    </svg>
  );
}
