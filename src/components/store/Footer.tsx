import Link from "next/link";
import { ShieldCheck, Truck, RefreshCw, PhoneCall, Mail, MapPin, Sparkles } from "lucide-react";
import { StoreSettingsItem } from "@/types";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";
import { NewsletterForm } from "@/components/store/NewsletterForm";
import { BrandLogo } from "@/components/store/BrandLogo";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

import { CategoryItem } from "@/types";

interface FooterProps {
  settings?: Partial<StoreSettingsItem>;
  categories?: CategoryItem[];
}

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

            <div className="pt-2 flex flex-col gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{settings?.physicalAddress || STORE_DEFAULTS.physicalAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>هاتف ومبيعات: {settings?.phone || STORE_DEFAULTS.phone}</span>
              </div>
              <a
                href={`https://wa.me/${(settings?.whatsapp || STORE_DEFAULTS.whatsapp).replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-amber-500 transition-colors group cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                <span>خدمة العملاء واتساب: {settings?.whatsapp || STORE_DEFAULTS.whatsapp}</span>
              </a>
              {settings?.supportEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>البريد الإلكتروني: {settings.supportEmail}</span>
                </div>
              )}

              {/* Social Links if configured */}
              {(settings?.facebookUrl || settings?.instagramUrl || settings?.tiktokUrl) && (
                <div className="flex items-center gap-2 pt-2">
                  {settings?.facebookUrl && (
                    <a
                      href={settings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-amber-100 hover:text-amber-800 text-neutral-700 text-xs font-bold transition-colors"
                    >
                      فيسبوك
                    </a>
                  )}
                  {settings?.instagramUrl && (
                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-amber-100 hover:text-amber-800 text-neutral-700 text-xs font-bold transition-colors"
                    >
                      إنستغرام
                    </a>
                  )}
                  {settings?.tiktokUrl && (
                    <a
                      href={settings.tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-amber-100 hover:text-amber-800 text-neutral-700 text-xs font-bold transition-colors"
                    >
                      تيك توك
                    </a>
                  )}
                </div>
              )}
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
