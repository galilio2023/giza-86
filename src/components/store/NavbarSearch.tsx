"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function NavbarSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative w-36 lg:w-40 xl:w-52">
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-900 transition cursor-pointer z-10"
        aria-label="بحث"
      >
        <Search className="w-3.5 h-3.5" />
      </button>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="ابحث عن الموديلات..."
        aria-label="البحث عن منتجات المتجر"
        className="w-full pr-8.5 pl-3.5 py-1.5 h-9 bg-neutral-100/90 hover:bg-neutral-100 border border-neutral-200/80 focus:border-neutral-950 rounded-full text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition shadow-2xs"
      />
    </form>
  );
}
