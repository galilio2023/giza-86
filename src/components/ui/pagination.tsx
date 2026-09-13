"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isPending?: boolean;
  variant?: "full" | "compact";
  totalCount?: number;
  currentCount?: number;
  itemLabel?: string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isPending = false,
  variant = "full",
  totalCount,
  currentCount,
  itemLabel = "عنصر",
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-neutral-100 bg-neutral-50/50",
          className
        )}
      >
        {currentCount !== undefined && (
          <div className="text-xs text-neutral-500 font-medium">
            عرض {currentCount} من أصل {totalCount ?? currentCount} {itemLabel}
          </div>
        )}
        <div className="flex items-center gap-1.5" dir="ltr">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isPending}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-neutral-200 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            السابق
          </button>
          <span className="text-xs font-bold px-2 text-neutral-700">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isPending}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-neutral-200 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            التالي
          </button>
        </div>
      </div>
    );
  }

  // Full numbered pagination with ellipsis
  const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2
  );

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={cn("flex items-center justify-center gap-2 pt-8 pb-4", className)}
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isPending}
        className="px-3.5 py-2 rounded-xl text-xs font-bold border border-neutral-200 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
        aria-label="الانتقال إلى الصفحة السابقة"
      >
        السابق
      </button>

      <div className="flex items-center gap-1">
        {visiblePages.map((p, idx, arr) => {
          const prev = arr[idx - 1];
          return (
            <React.Fragment key={p}>
              {prev && p - prev > 1 && (
                <span className="text-neutral-400 px-1 select-none" aria-hidden="true">
                  ...
                </span>
              )}
              <button
                type="button"
                onClick={() => onPageChange(p)}
                disabled={isPending}
                aria-current={p === currentPage ? "page" : undefined}
                className={cn(
                  "w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer",
                  p === currentPage
                    ? "bg-neutral-950 text-white shadow-xs"
                    : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                )}
              >
                {p}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isPending}
        className="px-3.5 py-2 rounded-xl text-xs font-bold border border-neutral-200 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
        aria-label="الانتقال إلى الصفحة التالية"
      >
        التالي
      </button>
    </nav>
  );
}
