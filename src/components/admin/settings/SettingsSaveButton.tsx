"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsSaveButtonProps {
  onSave: () => Promise<void>;
  label?: string;
  loadingLabel?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SettingsSaveButton({
  onSave,
  label = "حفظ التغييرات في النظام",
  loadingLabel = "جاري الحفظ...",
  size = "md",
  className = "",
}: SettingsSaveButtonProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleClick = async () => {
    setSaving(true);
    try {
      await onSave();
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant="primary"
      size={size}
      disabled={saving}
      className={`gap-2 shadow-md cursor-pointer ${className}`}
    >
      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      <span>{saving ? loadingLabel : label}</span>
    </Button>
  );
}
