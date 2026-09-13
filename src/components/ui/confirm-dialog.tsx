"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info } from "lucide-react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="max-w-md">
        <div className="flex items-start gap-4 text-right">
          {variant === "danger" ? (
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1 space-y-1">
            <DialogHeader className="border-b-0 pb-1 text-right sm:text-right">
              <DialogTitle className="text-base font-black text-neutral-900">{title}</DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-xs text-neutral-500 leading-relaxed">
              {description}
            </DialogDescription>
          </div>
        </div>

        <DialogFooter className="mt-4 sm:space-x-reverse sm:justify-start gap-2 border-t border-neutral-100 pt-3">
          <Button
            type="button"
            variant={variant === "danger" ? "danger" : "primary"}
            size="sm"
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={onClose}
          >
            {cancelText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
