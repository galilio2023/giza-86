import Image from "next/image";
import Link from "next/link";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

interface BrandLogoProps {
  name?: string;
  logoUrl?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showSubtext?: boolean;
}

export function BrandLogo({
  name,
  logoUrl,
  className = "",
  size = "md",
  showSubtext = true,
}: BrandLogoProps) {
  const brandName = (name || process.env.NEXT_PUBLIC_STORE_NAME || STORE_DEFAULTS.storeName || "GIZA 86").trim();

  // Split into first word (styled in luxury gold/amber) and remaining words
  const parts = brandName.split(" ");
  const firstWord = parts[0] || brandName;
  const restOfName = parts.slice(1).join(" ");

  const sizeClasses = {
    sm: "text-lg sm:text-xl",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
  }[size];

  const logoHeightClasses = {
    sm: "h-7 w-auto max-w-[120px]",
    md: "h-8 sm:h-9 w-auto max-w-[150px]",
    lg: "h-10 sm:h-12 w-auto max-w-[200px]",
  }[size];

  return (
    <Link href="/" className={`flex items-center gap-2 shrink-0 select-none whitespace-nowrap ${className}`}>
      {logoUrl ? (
        <div className={`relative ${logoHeightClasses} flex items-center shrink-0`}>
          <Image
            src={logoUrl}
            alt={brandName}
            width={180}
            height={48}
            className={`${logoHeightClasses} object-contain w-auto`}
            unoptimized={!logoUrl.startsWith("/") && !logoUrl.includes("res.cloudinary.com")}
          />
        </div>
      ) : (
        <span className={`${sizeClasses} font-black tracking-tight text-neutral-950 inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap`}>
          <span className="text-amber-600 whitespace-nowrap">{firstWord}</span>
          {restOfName && <span className="text-neutral-950 whitespace-nowrap">{restOfName}</span>}
        </span>
      )}
      {showSubtext && (
        <span className="hidden xl:inline-block text-[10px] tracking-wider text-neutral-400 uppercase font-semibold border-r border-neutral-200 pr-2 mr-1 whitespace-nowrap">
          Egyptian Cotton
        </span>
      )}
    </Link>
  );
}
