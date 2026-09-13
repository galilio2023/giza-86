"use client";

import { SettingsSaveButton } from "./SettingsSaveButton";

interface SettingsHeaderProps {
  onSave: () => Promise<void>;
}

export function SettingsHeader({ onSave }: SettingsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-2 sm:top-4 z-30 bg-white/95 backdrop-blur-md p-3 sm:p-6 rounded-2xl border border-neutral-200 shadow-sm">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-2xl font-black text-neutral-900">
            لوحة التحكم الشاملة بالإعدادات
          </h1>
          <span className="bg-amber-100 text-amber-900 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0">
            تحكم ذكي فوري ⚡
          </span>
        </div>
        <p className="hidden sm:block text-xs text-neutral-500 mt-1">
          إدارة كافة نصوص الموقع، اللوجو، صور الهيرو، السوشيال ميديا، العروض وأسعار الشحن دون الحاجة لتعديل أي ملف برمجي
        </p>
      </div>

      <SettingsSaveButton
        onSave={onSave}
        className="flex-shrink-0 min-h-[40px] w-full sm:w-auto justify-center"
      />
    </div>
  );
}
