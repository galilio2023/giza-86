import Link from "next/link";
import { ShieldCheck, Truck, RefreshCw, PhoneCall, Mail, MapPin, Sparkles, Clock } from "lucide-react";
import { StoreSettingsItem } from "@/types";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";
import { NewsletterForm } from "@/components/store/NewsletterForm";
import { BrandLogo } from "@/components/store/BrandLogo";
import { WhatsAppIcon, FacebookIcon, InstagramIcon, TikTokIcon, TelegramIcon } from "@/components/ui/SocialIcons";

import { CategoryItem } from "@/types";

interface FooterProps {
  settings?: Partial<StoreSettingsItem>;
  categories?: CategoryItem[];
}

/** Renders the comprehensive store footer with trust guarantees, newsletter subscription, contact links, and social channels. */
export function Footer({ settings, categories }: FooterProps = {}) {
  return (
    <footer className="store-footer pt-16 pb-8">
      {/* Trust & Guarantee Highlights (tailored for Egypt) */}
      <div className="layout-container pb-12 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="flex items-center gap-4 p-4 rounded-2xl store-footer-card">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-foreground font-bold text-sm">قطن مصري 100% أصيل</h4>
              <p className="text-muted-foreground text-xs mt-0.5">
                أعلى درجات الجودة، خياطة متينة وألوان ثابتة تدوم طويلاً
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl store-footer-card">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-foreground font-bold text-sm">شحن لكافة محافظات مصر</h4>
              <p className="text-muted-foreground text-xs mt-0.5">
                توصيل سريع من يوم إلى 3 أيام مع إمكانية المعاينة قبل الاستلام
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl store-footer-card">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-foreground font-bold text-sm">استبدال واسترجاع سهل</h4>
              <p className="text-muted-foreground text-xs mt-0.5">
                مهلة 14 يوماً للاستبدال أو الاسترجاع في حال عدم مناسبة المقاس
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VIP Club & Newsletter Subscription Bar */}
      <div className="layout-container py-10 border-b border-border">
        <div className="p-6 sm:p-8 rounded-3xl store-footer-card flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center lg:text-right max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-neutral-900 text-xs font-bold bg-white px-3 py-1 rounded-full border border-neutral-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>نادي عملاء {settings?.storeName || STORE_DEFAULTS.storeName} الحصري</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-foreground">
              اشترك واحصل على خصم فوري 10% على طلبك القادم
            </h3>
            <p className="text-xs text-muted-foreground">
              كن أول من يعلم بإطلاق التشكيلات الموسمية الحصرية والتخفيضات السرية عبر الواتساب أو الإيميل.
            </p>
          </div>

          <div className="w-full lg:w-96">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="layout-container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col text-right space-y-1">
              <BrandLogo name={settings?.storeName} logoUrl={settings?.logoUrl} size="lg" showSubtext={false} />
              <span className="text-xs text-muted-foreground tracking-wider">
                {settings?.storeTagline || STORE_DEFAULTS.storeTagline}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm font-medium">
              {settings?.storeDescription || STORE_DEFAULTS.storeDescription}
            </p>

            <div className="pt-2 flex flex-col gap-2.5 text-xs text-muted-foreground">
              {/* Physical Location & Google Maps Link */}
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span>{settings?.physicalAddress || STORE_DEFAULTS.physicalAddress}</span>
                  {settings?.googleMapsUrl && (
                    <div>
                      <a
                        href={settings.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <MapPin className="w-3 h-3 text-amber-600" />
                        <span>فتح الموقع على خرائط Google Maps ↗</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Working Hours */}
              {settings?.workingHours && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>مواعيد العمل: {settings.workingHours}</span>
                </div>
              )}

              {/* Phone Channels */}
              <div className="space-y-1 pt-1 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <a
                    href={`tel:${(settings?.phone || STORE_DEFAULTS.phone).replace(/\s+/g, "")}`}
                    className="hover:text-amber-700 transition-colors"
                  >
                    هاتف المبيعات: <span dir="ltr" className="font-mono font-medium">{settings?.phone || STORE_DEFAULTS.phone}</span>
                  </a>
                </div>

                {settings?.secondaryPhone && (
                  <div className="flex items-center gap-2 pr-6">
                    <a
                      href={`tel:${settings.secondaryPhone.replace(/\s+/g, "")}`}
                      className="hover:text-amber-700 transition-colors text-[11px]"
                    >
                      خط بديل / طوارئ: <span dir="ltr" className="font-mono font-medium">{settings.secondaryPhone}</span>
                    </a>
                  </div>
                )}

                {settings?.landlinePhone && (
                  <div className="flex items-center gap-2 pr-6">
                    <a
                      href={`tel:${settings.landlinePhone.replace(/\s+/g, "")}`}
                      className="hover:text-amber-700 transition-colors text-[11px]"
                    >
                      الخط الأرضي: <span dir="ltr" className="font-mono font-medium">{settings.landlinePhone}</span>
                    </a>
                  </div>
                )}
              </div>

              {/* WhatsApp Channels */}
              <div className="space-y-1 pt-1 border-t border-border/40">
                <a
                  href={`https://wa.me/${(settings?.whatsapp || STORE_DEFAULTS.whatsapp).replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-amber-700 transition-colors group cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                  <span>واتساب المبيعات والاستفسار: <strong dir="ltr" className="font-mono font-bold">{settings?.whatsapp || STORE_DEFAULTS.whatsapp}</strong></span>
                </a>

                {settings?.supportWhatsapp && settings.supportWhatsapp !== settings?.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.supportWhatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-emerald-700 transition-colors group cursor-pointer text-[11px]"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 flex-shrink-0 transition-transform group-hover:scale-110" />
                    <span>واتساب الاستبدال وخدمة ما بعد البيع: <strong dir="ltr" className="font-mono font-bold">{settings.supportWhatsapp}</strong></span>
                  </a>
                )}
              </div>

              {/* Support Email */}
              {settings?.supportEmail && (
                <a
                  href={`mailto:${settings.supportEmail}`}
                  className="flex items-center gap-2 hover:text-amber-700 transition-colors pt-1 border-t border-border/40"
                >
                  <Mail className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>البريد الرسمي: {settings.supportEmail}</span>
                </a>
              )}

              {/* Social Media Channels (Vibrant Happy Badges) */}
              <div className="pt-3 border-t border-border/60">
                <span className="block text-xs font-bold text-muted-foreground mb-3">
                  تواصل وتابعنا على منصات التواصل الاجتماعي:
                </span>
                <div className="flex items-center gap-3.5 flex-wrap">
                  {(settings?.facebookUrl || STORE_DEFAULTS.facebookUrl) && (
                    <a
                      href={settings?.facebookUrl || STORE_DEFAULTS.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="فيسبوك"
                      title="فيسبوك - صفحة المتجر الرسمية"
                      className="group relative block cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
                    >
                      <FacebookIcon className="w-10 h-10 drop-shadow-[0_4px_10px_rgba(24,119,242,0.35)] group-hover:drop-shadow-[0_6px_20px_rgba(24,119,242,0.65)] transition-all duration-300" />
                    </a>
                  )}
                  {(settings?.instagramUrl || STORE_DEFAULTS.instagramUrl) && (
                    <a
                      href={settings?.instagramUrl || STORE_DEFAULTS.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="إنستغرام"
                      title="إنستغرام - أحدث الموديلات والإطلالات"
                      className="group relative block cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
                    >
                      <InstagramIcon className="w-10 h-10 drop-shadow-[0_4px_10px_rgba(225,48,108,0.35)] group-hover:drop-shadow-[0_6px_20px_rgba(225,48,108,0.65)] transition-all duration-300" />
                    </a>
                  )}
                  {(settings?.tiktokUrl || STORE_DEFAULTS.tiktokUrl) && (
                    <a
                      href={settings?.tiktokUrl || STORE_DEFAULTS.tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="تيك توك"
                      title="تيك توك - فيديوهات وتنسيقات الموديلات"
                      className="group relative block cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
                    >
                      <TikTokIcon className="w-10 h-10 drop-shadow-[0_4px_10px_rgba(0,242,254,0.30)] group-hover:drop-shadow-[0_6px_20px_rgba(254,44,85,0.60)] transition-all duration-300" />
                    </a>
                  )}
                  {settings?.telegramUrl && (
                    <a
                      href={settings.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="تيليجرام"
                      title="قناة تيليجرام الرسمية - أحدث العروض والتشكيلات"
                      className="group relative block cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
                    >
                      <TelegramIcon className="w-10 h-10 drop-shadow-[0_4px_10px_rgba(42,171,238,0.35)] group-hover:drop-shadow-[0_6px_20px_rgba(42,171,238,0.65)] transition-all duration-300" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-foreground font-bold text-sm">أقسام المتجر</h5>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {categories && categories.length > 0 ? (
                categories.slice(0, 5).map((c) => (
                  <li key={c.id}>
                    <Link href={`/products?category=${c.slug}`} className="hover:text-amber-700 transition">
                      {c.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/products?category=oversized-tshirts" className="hover:text-amber-700 transition">
                      تيشيرتات وأوفر سايز
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?category=hoodies-sweatshirts" className="hover:text-amber-700 transition">
                      هوديز وسويت شيرت
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?category=casual-shirts" className="hover:text-amber-700 transition">
                      قمصان كاجوال وكتان
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?category=pants-sweatpants" className="hover:text-amber-700 transition">
                      بناطيل وكارجو
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?category=women-collection" className="hover:text-amber-700 transition">
                      ملابس نسائية
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h5 className="text-foreground font-bold text-sm">خدمة العملاء</h5>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-amber-700 transition">
                  جدول المقاسات بالسنتيمتر
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-amber-700 transition">
                  تتبع حالة الطلب
                </Link>
              </li>
              <li>
                <span>طرق الدفع: إنستاباي - كاش - فودافون كاش</span>
              </li>
              <li>
                <span>الشحن لكافة الـ 27 محافظة</span>
              </li>
            </ul>
          </div>

          {/* Guarantees & Values */}
          <div className="space-y-3">
            <h5 className="text-foreground font-bold text-sm">ضمان الجودة المصرية</h5>
            <div className="p-4 rounded-2xl store-footer-card space-y-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                جميع منسوجاتنا مصنوعة من قطن مصري 100% طويل التيلة، خاضعة لفحص الجودة قبل الشحن لكافة محافظات مصر.
              </p>
              <div className="text-xs font-bold text-amber-700 pt-1">
                صُنع بكل فخر في جمهورية مصر العربية 🇪🇬
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Payment Badges */}
      <div className="layout-container pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} {settings?.storeName || STORE_DEFAULTS.storeName} - فخر الصناعة والقطن المصري. جميع الحقوق محفوظة.</p>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="store-footer-badge px-3 py-1 rounded-lg text-xs font-semibold">
            إنستاباي InstaPay ⚡
          </span>
          <span className="store-footer-badge px-3 py-1 rounded-lg text-xs font-semibold">
            فودافون كاش
          </span>
          <span className="store-footer-badge px-3 py-1 rounded-lg text-xs font-semibold">
            كارت ميزة
          </span>
          <span className="store-footer-badge px-3 py-1 rounded-lg text-xs font-semibold">
            كاش عند الاستلام (COD)
          </span>
        </div>
      </div>
    </footer>
  );
}
