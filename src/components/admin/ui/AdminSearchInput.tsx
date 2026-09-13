"use client";

import { Search, X } from "lucide-react";

interface AdminSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Unified search input component for admin data tables.
 * Provides consistent styling, search icon positioning, and one-click clear functionality.
 */
export function AdminSearchInput({
  value,
  onChange,
  placeholder = "ابحث هنا...",
  className = "w-full sm:w-80",
}: AdminSearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none transition"
      />
      <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="مسح البحث"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
