"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface UseAdminTableParamsOptions {
  baseUrl: string;
  defaultFilter?: string;
  filterParamName?: string;
  debounceMs?: number;
}

/** Manages debounced search, filtering, and pagination synchronized with Next.js URL query parameters. */
export function useAdminTableParams({
  baseUrl,
  defaultFilter = "all",
  filterParamName = "status",
  debounceMs = 400,
}: UseAdminTableParamsOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const activeFilter = searchParams.get(filterParamName) || defaultFilter;

  // Debounced search query synchronization with URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get("q") || "";
      if (searchQuery.trim() !== currentQ) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchQuery.trim()) {
          params.set("q", searchQuery.trim());
        } else {
          params.delete("q");
        }
        params.set("page", "1");
        startTransition(() => {
          router.push(`${baseUrl}?${params.toString()}`);
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, searchParams, router, baseUrl, debounceMs]);

  const handleFilterChange = (newVal: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newVal && newVal !== defaultFilter) {
      params.set(filterParamName, newVal);
    } else {
      params.delete(filterParamName);
    }
    params.set("page", "1");
    startTransition(() => {
      router.push(`${baseUrl}?${params.toString()}`);
    });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    startTransition(() => {
      router.push(`${baseUrl}?${params.toString()}`);
    });
  };

  return {
    searchQuery,
    setSearchQuery,
    activeFilter,
    handleFilterChange,
    handlePageChange,
    isPending,
    router,
    refresh: () => router.refresh(),
  };
}
