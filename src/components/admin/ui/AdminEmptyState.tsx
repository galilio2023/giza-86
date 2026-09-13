"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { PackageOpen, LucideIcon } from "lucide-react";

export interface AdminEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function AdminEmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
}: AdminEmptyStateProps) {
  return (
    <Card variant="modern" padding="lg" className="text-center py-16">
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-neutral-800 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </Card>
  );
}
