import React from "react";
import { Pagination } from "@/components/ui/pagination";

export interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount?: number;
  currentCount: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
}

export function AdminPagination({
  currentPage,
  totalPages,
  totalCount,
  currentCount,
  itemLabel = "عنصر",
  onPageChange,
}: AdminPaginationProps) {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={totalCount}
      currentCount={currentCount}
      itemLabel={itemLabel}
      onPageChange={onPageChange}
      variant="compact"
    />
  );
}
