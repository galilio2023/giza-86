"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkItem {
  label: string;
  href: string;
  highlight?: boolean;
}

interface NavbarLinksProps {
  navLinks: NavLinkItem[];
}

export function NavbarLinks({ navLinks }: NavbarLinksProps) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-0.5 xl:gap-1.5 text-xs font-bold text-neutral-700">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`px-2 xl:px-3 py-1.5 rounded-xl transition-all whitespace-nowrap text-xs font-bold ${
              link.highlight
                ? "text-rose-600 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/60 shadow-xs"
                : isActive
                ? "text-white bg-neutral-950 shadow-xs font-bold"
                : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
