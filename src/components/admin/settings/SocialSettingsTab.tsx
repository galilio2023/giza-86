"use client";

import React from "react";
import { Phone, PhoneCall, Smartphone, Mail, MapPin, Share2, Clock, Map, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { WhatsAppIcon, FacebookIcon, InstagramIcon, TikTokIcon, TelegramIcon } from "@/components/ui/SocialIcons";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

interface SocialSettingsTabProps {
  phone: string;
  setPhone: (val: string) => void;
  landlinePhone: string;
  setLandlinePhone: (val: string) => void;
  secondaryPhone: string;
  setSecondaryPhone: (val: string) => void;
  whatsapp: string;
  setWhatsapp: (val: string) => void;
  supportWhatsapp: string;
  setSupportWhatsapp: (val: string) => void;
  supportEmail: string;
  setSupportEmail: (val: string) => void;
  physicalAddress: string;
  setPhysicalAddress: (val: string) => void;
  workingHours: string;
  setWorkingHours: (val: string) => void;
  googleMapsUrl: string;
  setGoogleMapsUrl: (val: string) => void;
  facebookUrl: string;
  setFacebookUrl: (val: string) => void;
  instagramUrl: string;
  setInstagramUrl: (val: string) => void;
  tiktokUrl: string;
  setTiktokUrl: (val: string) => void;
  telegramUrl: string;
  setTelegramUrl: (val: string) => void;
}

export function SocialSettingsTab({
  phone,
  setPhone,
  landlinePhone,
  setLandlinePhone,
  secondaryPhone,
  setSecondaryPhone,
  whatsapp,
  setWhatsapp,
  supportWhatsapp,
  setSupportWhatsapp,
  supportEmail,
  setSupportEmail,
  physicalAddress,
  setPhysicalAddress,
  workingHours,
  setWorkingHours,
  googleMapsUrl,
  setGoogleMapsUrl,
  facebookUrl,
  setFacebookUrl,
  instagramUrl,
  setInstagramUrl,
  tiktokUrl,
  setTiktokUrl,
  telegramUrl,
  setTelegramUrl,
}: SocialSettingsTabProps) {
  return (
    <div className="space-y-6">
      {/* 1. Official Contact Numbers & WhatsApp Channels */}
      <Card variant="modern" padding="lg" className="space-y-6">
        <div>
          <h2 className="text-base font-black text-neutral-900 flex items-center gap-2 border-b pb-3">
            <Phone className="w-5 h-5 text-amber-600" />
            <span>بيانات الاتصال وأرقام الهواتف الرسمية</span>
          </h2>
          <p className="text-xs text-neutral-700 mt-2 font-medium">
            تظهر هذه الأرقام في تذييل الموقع (Footer)، فواتير الطلبات، وصفحات المساعدة لتعزيز المصداقية والأمان لدى العملاء.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Sales Phone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>هاتف المبيعات والاستفسار الرئيسي</span>
            </label>
            <input
              type="tel"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={STORE_DEFAULTS.phone}
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-left font-mono text-base lg:text-sm bg-neutral-50 focus:bg-white transition"
            />
            <span className="text-[10px] text-neutral-600">الرقم الأساسي للاتصال المباشر (مثل: 01002081676)</span>
          </div>

          {/* Secondary Mobile Phone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>خط محمول إضافي / شبكة بديلة (اختياري)</span>
            </label>
            <input
              type="tel"
              dir="ltr"
              value={secondaryPhone}
              onChange={(e) => setSecondaryPhone(e.target.value)}
              placeholder="011XXXXXXXX أو 012XXXXXXXX"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-left font-mono text-base lg:text-sm bg-neutral-50 focus:bg-white transition"
            />
            <span className="text-[10px] text-neutral-600">خط طوارئ إضافي لضمان وصول العملاء في أي وقت</span>
          </div>

          {/* Landline Phone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
              <span>الخط الأرضي للشركة / صالة العرض (اختياري)</span>
            </label>
            <input
              type="tel"
              dir="ltr"
              value={landlinePhone}
              onChange={(e) => setLandlinePhone(e.target.value)}
              placeholder="022XXXXXXX أو 03XXXXXXX"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-left font-mono text-base lg:text-sm bg-neutral-50 focus:bg-white transition"
            />
            <span className="text-[10px] text-neutral-600">وجود خط أرضي يرفع تقييم وثقة المتجر في نظر المشترين والشركات</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
          {/* Main WhatsApp (Sales & Floating Button) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
              <span>واتساب المبيعات وزر الدعم العائم</span>
            </label>
            <input
              type="tel"
              dir="ltr"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder={STORE_DEFAULTS.whatsapp}
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-left font-mono text-base lg:text-sm bg-neutral-50 focus:bg-white transition"
            />
            <span className="text-[10px] text-neutral-600">الرقم الذي يستقبل رسائل زر واتساب السريع وزر مشاركة المنتجات</span>
          </div>

          {/* Support & Returns WhatsApp */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <WhatsAppIcon className="w-4 h-4 flex-shrink-0 text-emerald-500" />
              <span>واتساب خدمة ما بعد البيع والاسترجاع</span>
            </label>
            <input
              type="tel"
              dir="ltr"
              value={supportWhatsapp}
              onChange={(e) => setSupportWhatsapp(e.target.value)}
              placeholder={STORE_DEFAULTS.whatsapp}
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-left font-mono text-base lg:text-sm bg-neutral-50 focus:bg-white transition"
            />
            <span className="text-[10px] text-neutral-600">مخصص لطلبات الاستبدال، المقاسات، والشكاوى لتنظيم فريق العمل</span>
          </div>

          {/* Support Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-neutral-600" />
              <span>البريد الإلكتروني الرسمي للدعم</span>
            </label>
            <input
              type="email"
              dir="ltr"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              placeholder={STORE_DEFAULTS.supportEmail}
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-left font-mono text-base lg:text-sm bg-neutral-50 focus:bg-white transition"
            />
            <span className="text-[10px] text-neutral-600">للمراسلات الرسمية والشكاوى الموثقة</span>
          </div>
        </div>
      </Card>

      {/* 2. Physical Location, Working Hours & Google Maps */}
      <Card variant="modern" padding="lg" className="space-y-6">
        <div>
          <h2 className="text-base font-black text-neutral-900 flex items-center gap-2 border-b pb-3">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>المقر الفعلي، صالة العرض وساعات العمل</span>
          </h2>
          <p className="text-xs text-neutral-700 mt-2 font-medium">
            عرض العنوان الفعلي ورابط خرائط جوجل يمنح المتجر مكانة مرموقة لدى محركات بحث جوجل (Local SEO) ويزيد ثقة العميل في الاستلام والمعاينة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Physical Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>عنوان المقر / المعرض الفعلي</span>
            </label>
            <input
              type="text"
              value={physicalAddress}
              onChange={(e) => setPhysicalAddress(e.target.value)}
              placeholder="مثال: المعادي - شارع النصر، القاهرة، مصر"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-base lg:text-sm bg-neutral-50 focus:bg-white transition"
            />
            <span className="text-[10px] text-neutral-600">العنوان المطبوع في أسفل الصفحات وإيصالات الاستلام</span>
          </div>

          {/* Working Hours */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>مواعيد وساعات العمل واستقبال الاتصالات</span>
            </label>
            <input
              type="text"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              placeholder="يومياً من 11:00 ص حتى 11:00 م (خدمة العملاء والمعاينة)"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-base lg:text-sm bg-neutral-50 focus:bg-white transition"
            />
            <span className="text-[10px] text-neutral-600">أوقات عمل خدمة العملاء والرد على الهواتف والواتساب</span>
          </div>
        </div>

        {/* Google Maps URL */}
        <div className="space-y-1.5 pt-2">
          <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
            <Map className="w-4 h-4 text-rose-600" />
            <span>رابط الموقع على خرائط جوجل (Google Maps URL)</span>
          </label>
          <input
            type="url"
            dir="ltr"
            value={googleMapsUrl}
            onChange={(e) => setGoogleMapsUrl(e.target.value)}
            placeholder="https://maps.google.com/?q=..."
            className="w-full p-2.5 rounded-xl border border-neutral-300 text-left font-mono text-base lg:text-sm bg-neutral-50 focus:bg-white transition"
          />
          <span className="text-[10px] text-neutral-600">
            عند إضافته، سيظهر زر مباشر &quot;عرض موقعنا على الخريطة&quot; في الفوتر لتسهيل وصول العملاء إليكم بنقرة واحدة
          </span>
        </div>
      </Card>

      {/* 3. Social Media & Messaging Channels */}
      <Card variant="modern" padding="lg" className="space-y-6">
        <div>
          <h2 className="text-base font-black text-neutral-900 flex items-center gap-2 border-b pb-3">
            <Share2 className="w-5 h-5 text-indigo-600" />
            <span>روابط منصات التواصل الاجتماعي وقنوات البث</span>
          </h2>
          <p className="text-xs text-neutral-700 mt-2 font-medium">
            اربط صفحات الماركة الرسمية لتمكين المتابعين من الوصول لجديد العروض والتشكيلات الحصرية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <FacebookIcon className="w-4 h-4 flex-shrink-0" />
              <span>رابط صفحة فيسبوك (Facebook URL)</span>
            </label>
            <input
              type="url"
              dir="ltr"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/your-store"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-left font-mono text-base lg:text-sm bg-neutral-50 focus:bg-white transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <InstagramIcon className="w-4 h-4 flex-shrink-0" />
              <span>رابط حساب إنستغرام (Instagram URL)</span>
            </label>
            <input
              type="url"
              dir="ltr"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/your-store"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-left font-mono text-base lg:text-sm bg-neutral-50 focus:bg-white transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <TikTokIcon className="w-4 h-4 flex-shrink-0" />
              <span>رابط حساب تيك توك (TikTok URL)</span>
            </label>
            <input
              type="url"
              dir="ltr"
              value={tiktokUrl}
              onChange={(e) => setTiktokUrl(e.target.value)}
              placeholder="https://tiktok.com/@your-store"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-left font-mono text-base lg:text-sm bg-neutral-50 focus:bg-white transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <TelegramIcon className="w-4 h-4 flex-shrink-0" />
              <span>رابط قناة أو حساب تيليجرام (Telegram Channel)</span>
            </label>
            <input
              type="url"
              dir="ltr"
              value={telegramUrl}
              onChange={(e) => setTelegramUrl(e.target.value)}
              placeholder="https://t.me/your-channel"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-left font-mono text-base lg:text-sm bg-neutral-50 focus:bg-white transition"
            />
            <span className="text-[10px] text-neutral-600">مثالي للبث المباشر لأحدث العروض والموديلات الجديدة</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
