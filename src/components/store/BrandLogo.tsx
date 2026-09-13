import Image from "next/image";
import Link from "next/link";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";
import { ModanilMonogram } from "@/components/ui/ModanilMonogram";

export interface BrandLogoProps {
  name?: string;
  logoUrl?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showSubtext?: boolean;
  subtext?: string;
  isDark?: boolean;
  href?: string;
  showEmblem?: boolean;
}

/**
 * Splits multi-word brand names intelligently.
 * Single-word brand names (like MODANIL or مودانيل) stay unified and solid.
 */
function splitBrandName(brandName: string) {
  const trimmed = brandName.trim();

  const parts = trimmed.split(/\s+/);
  if (parts.length <= 1) {
    return {
      firstPart: trimmed,
      secondPart: "",
      highlightSecond: false,
    };
  }

  // Common Arabic prefixes where the trailing words form the actual brand name
  const arabicPrefixes = ["متجر", "براند", "محل", "بوتيك", "دار"];
  if (arabicPrefixes.includes(parts[0]) && parts.length >= 2) {
    return {
      firstPart: parts[0],
      secondPart: parts.slice(1).join(" "),
      highlightSecond: true,
    };
  }

  return {
    firstPart: parts[0],
    secondPart: parts.slice(1).join(" "),
    highlightSecond: false,
  };
}

export function BrandLogo({
  name,
  logoUrl,
  className = "",
  size = "md",
  showSubtext = false,
  subtext,
  isDark = false,
  href = "/",
  showEmblem = true,
}: BrandLogoProps) {
  const brandName = (name || process.env.NEXT_PUBLIC_STORE_NAME || STORE_DEFAULTS.storeName || "MODANIL").trim();
  const rawLogoUrl = logoUrl !== undefined ? logoUrl : STORE_DEFAULTS.logoUrl;
  
  // Choose dark or light vector logo asset automatically
  const resolvedLogoUrl = isDark && rawLogoUrl === "/images/modanil-logo.svg"
    ? "/images/modanil-logo-dark.svg"
    : rawLogoUrl;

  const { firstPart, secondPart, highlightSecond } = splitBrandName(brandName);

  const sizeClasses = {
    sm: "text-lg sm:text-xl",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
  }[size];

  const emblemSizeClasses = {
    sm: "w-5 h-5 sm:w-6 sm:h-6",
    md: "w-6 h-6 sm:w-7 sm:h-7",
    lg: "w-8 h-8 sm:w-9 sm:h-9",
  }[size];

  const logoHeightClasses = {
    sm: "h-7 w-auto max-w-[130px]",
    md: "h-8 sm:h-9 w-auto max-w-[160px]",
    lg: "h-10 sm:h-12 w-auto max-w-[220px]",
  }[size];

  const neutralTextColor = isDark ? "text-white" : "text-neutral-950";
  const subtextColor = isDark ? "text-neutral-400 border-neutral-800" : "text-neutral-500 border-neutral-200";

  return (
    <Link
      href={href}
      className={`group flex items-center gap-2.5 shrink-0 select-none whitespace-nowrap ${className}`}
      aria-label={`${brandName} - الصفحة الرئيسية`}
    >
      {resolvedLogoUrl ? (
        <div className={`relative ${logoHeightClasses} flex items-center shrink-0`}>
          <Image
            src={resolvedLogoUrl}
            alt={brandName}
            width={180}
            height={48}
            priority
            className={`${logoHeightClasses} object-contain w-auto`}
            unoptimized={!resolvedLogoUrl.startsWith("/") && !resolvedLogoUrl.includes("res.cloudinary.com")}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {showEmblem && <ModanilMonogram className={emblemSizeClasses} />}
          <span
            className={`${sizeClasses} font-black tracking-tight inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap`}
          >
            {highlightSecond ? (
              <>
                <span className={`${neutralTextColor} whitespace-nowrap`}>{firstPart}</span>
                <span className="text-gradient-gold whitespace-nowrap drop-shadow-xs">{secondPart}</span>
              </>
            ) : (
              <>
                <span className="text-gradient-gold whitespace-nowrap drop-shadow-xs">{firstPart}</span>
                {secondPart && <span className={`${neutralTextColor} whitespace-nowrap`}>{secondPart}</span>}
              </>
            )}
          </span>
        </div>
      )}

      {showSubtext && (
        <span
          className={`hidden sm:inline-block text-[10px] tracking-wider uppercase font-bold border-s ps-2 ms-1 whitespace-nowrap ${subtextColor}`}
        >
          {subtext || "قطن مصري فاخر"}
        </span>
      )}
    </Link>
  );
}
