"use client";

import React from "react";
import { Phone, Mail, MapPin, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { WhatsAppIcon, FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

interface SocialSettingsTabProps {
  phone: string;
  setPhone: (val: string) => void;
  whatsapp: string;
  setWhatsapp: (val: string) => void;
  supportEmail: string;
  setSupportEmail: (val: string) => void;
  physicalAddress: string;
  setPhysicalAddress: (val: string) => void;
  facebookUrl: string;
  setFacebookUrl: (val: string) => void;
  instagramUrl: string;
  setInstagramUrl: (val: string) => void;
  tiktokUrl: string;
  setTiktokUrl: (val: string) => void;
}

export function SocialSettingsTab({
  phone,
  setPhone,
  whatsapp,
  setWhatsapp,
  supportEmail,
  setSupportEmail,
  physicalAddress,
  setPhysicalAddress,
  facebookUrl,
  setFacebookUrl,
  instagramUrl,
  setInstagramUrl,
  tiktokUrl,
  setTiktokUrl,
}: SocialSettingsTabProps) {
  return (
    <div className="space-y-6">
      <Card variant="modern" padding="lg" className="space-y-6">
        <h2 className="text-base font-black text-neutral-900 flex items-center gap-2 border-b pb-3">
          <Phone className="w-5 h-5 text-amber-600" />
          <span>بيانات الاتصال الرسمية للمتجر</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>هاتف المبيعات وخدمة العملاء</span>
            </label>
            <input
              type="tel"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={STORE_DEFAULTS.phone}
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-left font-mono text-base lg:text-sm bg-neutral-50 focus:bg-white transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
              <span>رقم واتساب الرسمي (الدعم العائم ومبيعات المتجر)</span>
            </label>
            <input
              type="tel"
              dir="ltr"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder={STORE_DEFAULTS.whatsapp}
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-left font-mono text-base lg:text-sm bg-neutral-50 focus:bg-white transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-neutral-600" />
              <span>البريد الإلكتروني للدعم</span>
            </label>
            <input
              type="email"
              dir="ltr"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              placeholder={STORE_DEFAULTS.supportEmail}
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-left font-mono text-base lg:text-sm bg-neutral-50 focus:bg-white transition"
            />
          </div>
        </div>

        <div className="space-y-1.5 pt-4 border-t border-neutral-100">
          <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>عنوان المقر الرئيسي / صالة العرض</span>
          </label>
          <input
            type="text"
            value={physicalAddress}
            onChange={(e) => setPhysicalAddress(e.target.value)}
            placeholder="مثال: المقر الرئيسي: القاهرة، جمهورية مصر العربية"
            className="w-full p-2.5 rounded-xl border border-neutral-300 text-base lg:text-sm bg-neutral-50 focus:bg-white transition"
          />
        </div>
      </Card>

      {/* Social Media Links */}
      <Card variant="modern" padding="lg" className="space-y-6">
        <h2 className="text-base font-black text-neutral-900 flex items-center gap-2 border-b pb-3">
          <Share2 className="w-5 h-5 text-indigo-600" />
          <span>روابط حسابات التواصل الاجتماعي (Social Media Links)</span>
        </h2>

        <div className="space-y-4">
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
        </div>
      </Card>
    </div>
  );
}
