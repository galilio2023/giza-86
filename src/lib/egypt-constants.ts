import type { StoreSettingsItem } from "@/types";

// Egyptian Governorates & Standard Shipping Rates (EGP)
export interface GovernorateShipping {
  id: string;
  name: string;
  rate: number;
  deliveryDays: string;
  region: "القاهرة الكبرى" | "الإسكندرية والساحل" | "وجه بحري والدلتا" | "مدن القناة" | "شمال الصعيد" | "جنوب الصعيد" | "المحافظات الحدودية";
}

export const EGYPTIAN_GOVERNORATES: GovernorateShipping[] = [
  { id: "cairo", name: "القاهرة", rate: 45, deliveryDays: "1 - 2 يوم عمل", region: "القاهرة الكبرى" },
  { id: "giza", name: "الجيزة", rate: 45, deliveryDays: "1 - 2 يوم عمل", region: "القاهرة الكبرى" },
  { id: "alexandria", name: "الإسكندرية", rate: 55, deliveryDays: "2 - 3 أيام عمل", region: "الإسكندرية والساحل" },
  { id: "qalyubia", name: "القليوبية", rate: 50, deliveryDays: "2 - 3 أيام عمل", region: "القاهرة الكبرى" },
  { id: "sharqia", name: "الشرقية", rate: 55, deliveryDays: "2 - 3 أيام عمل", region: "وجه بحري والدلتا" },
  { id: "dakahlia", name: "الدقهلية (المنصورة)", rate: 55, deliveryDays: "2 - 3 أيام عمل", region: "وجه بحري والدلتا" },
  { id: "gharbia", name: "الغربية (طنطا والسنطة)", rate: 55, deliveryDays: "2 - 3 أيام عمل", region: "وجه بحري والدلتا" },
  { id: "monufia", name: "المنوفية", rate: 55, deliveryDays: "2 - 3 أيام عمل", region: "وجه بحري والدلتا" },
  { id: "beheira", name: "البحيرة (دمنهور)", rate: 55, deliveryDays: "2 - 3 أيام عمل", region: "وجه بحري والدلتا" },
  { id: "kafr_el_sheikh", name: "كفر الشيخ", rate: 60, deliveryDays: "2 - 4 أيام عمل", region: "وجه بحري والدلتا" },
  { id: "damietta", name: "دمياط", rate: 60, deliveryDays: "2 - 4 أيام عمل", region: "وجه بحري والدلتا" },
  { id: "port_said", name: "بورسعيد", rate: 60, deliveryDays: "2 - 3 أيام عمل", region: "مدن القناة" },
  { id: "ismailia", name: "الإسماعيلية", rate: 60, deliveryDays: "2 - 3 أيام عمل", region: "مدن القناة" },
  { id: "suez", name: "السويس", rate: 60, deliveryDays: "2 - 3 أيام عمل", region: "مدن القناة" },
  { id: "fayoum", name: "الفيوم", rate: 65, deliveryDays: "2 - 4 أيام عمل", region: "شمال الصعيد" },
  { id: "beni_suef", name: "بني سويف", rate: 65, deliveryDays: "2 - 4 أيام عمل", region: "شمال الصعيد" },
  { id: "minya", name: "المنيا", rate: 70, deliveryDays: "3 - 5 أيام عمل", region: "شمال الصعيد" },
  { id: "asyut", name: "أسيوط", rate: 75, deliveryDays: "3 - 5 أيام عمل", region: "جنوب الصعيد" },
  { id: "sohag", name: "سوهاج", rate: 80, deliveryDays: "3 - 5 أيام عمل", region: "جنوب الصعيد" },
  { id: "qena", name: "قنا", rate: 85, deliveryDays: "3 - 5 أيام عمل", region: "جنوب الصعيد" },
  { id: "luxor", name: "الأقصر", rate: 85, deliveryDays: "3 - 5 أيام عمل", region: "جنوب الصعيد" },
  { id: "aswan", name: "أسوان", rate: 90, deliveryDays: "4 - 6 أيام عمل", region: "جنوب الصعيد" },
  { id: "red_sea", name: "البحر الأحمر (الغردقة)", rate: 85, deliveryDays: "3 - 5 أيام عمل", region: "المحافظات الحدودية" },
  { id: "matrouh", name: "مطروح والساحل الشمالي", rate: 80, deliveryDays: "3 - 5 أيام عمل", region: "الإسكندرية والساحل" },
  { id: "south_sinai", name: "جنوب سيناء (شرم الشيخ)", rate: 95, deliveryDays: "4 - 6 أيام عمل", region: "المحافظات الحدودية" },
  { id: "north_sinai", name: "شمال سيناء (العريش)", rate: 95, deliveryDays: "4 - 6 أيام عمل", region: "المحافظات الحدودية" },
  { id: "new_valley", name: "الوادي الجديد", rate: 95, deliveryDays: "4 - 6 أيام عمل", region: "المحافظات الحدودية" },
];

export const PAYMENT_METHODS = [
  {
    id: "cod",
    title: "الدفع نقدياً عند الاستلام (COD)",
    description: "ادفع كاش لمندوب الشحن عند معاينة واستلام طلبك",
    badge: "الأكثر طلباً في مصر",
    icon: "Banknote",
  },
  {
    id: "instapay",
    title: "إنستاباي (InstaPay)",
    description: "تحويل فوري بدون أي مصاريف إضافية لحساب المتجر على إنستاباي",
    badge: "سريع ومجاني",
    icon: "Zap",
  },
  {
    id: "vodafone_cash",
    title: "فودافون كاش ومحافظ المحمول",
    description: "تحويل مباشر من محفظتك الذكية (فودافون، أورنج، اتصالات، وي كاش)",
    badge: "متوفر 24/7",
    icon: "Smartphone",
  },
  {
    id: "card",
    title: "بطاقة بنكية / كارت ميزة",
    description: "فيزا وماستركارد وكارت ميزة الوطني عبر بوابة دفع مؤمنة بالكامل",
    badge: "آمن 100%",
    icon: "CreditCard",
  },
];

export const PAYMENT_METHOD_NAMES: Record<string, string> = {
  cod: "الدفع نقداً عند الاستلام",
  instapay: "تحويل إنستاباي InstaPay",
  vodafone_cash: "فودافون كاش ومحافظ المحمول",
  card: "بطاقة بنكية / كارت ميزة",
};

export const PAYMENT_METHOD_SHORT_NAMES: Record<string, string> = {
  cod: "عند الاستلام",
  instapay: "إنستاباي",
  vodafone_cash: "فودافون كاش",
  card: "بطاقة بنكية",
};

/** Returns localized Arabic name or abbreviated label for a payment method identifier. */
export function getPaymentMethodName(method: string, short = false): string {
  if (short) {
    return PAYMENT_METHOD_SHORT_NAMES[method] || method;
  }
  return PAYMENT_METHOD_NAMES[method] || method;
}

export const ORDER_STATUSES: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: "طلب جديد", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  confirmed: { label: "تم التأكيد", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200" },
  processing: { label: "قيد التجهيز والتغليف", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  shipped: { label: "خرج مع مندوب الشحن", color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  delivered: { label: "تم التوصيل بنجاح", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  cancelled: { label: "ملغي", color: "text-rose-700", bg: "bg-rose-50 border-rose-200" },
  returned: { label: "مرتجع", color: "text-neutral-700", bg: "bg-neutral-100 border-neutral-300" },
};

// Centralized Store Default Constants (DRY Principle - Single Source of Truth)
export const STORE_DEFAULTS = {
  storeName: process.env.NEXT_PUBLIC_STORE_NAME || "MODANIL",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://modanil.vercel.app",
  phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "01002081676",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201002081676",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@modanil.com",
  instapayHandle: process.env.NEXT_PUBLIC_INSTAPAY_HANDLE || "modanil.eg@instapay",
  vodafoneCashPhone: process.env.NEXT_PUBLIC_VODAFONE_CASH || "01002081676",
  freeShippingThreshold: 1200,
  estimatedDeliveryDays: "1 - 3 أيام عمل",
  currency: "ج.م",
  bannerNotice: "🔥 شحن سريع لجميع الـ 27 محافظة | جودة القطن المصري 100% | الدفع عند الاستلام وإنستاباي",
  isBannerActive: true,
  orderClosedMessage: "نعتذر، المتجر لا يستقبل طلبات جديدة في الوقت الحالي للصيانة والتحديث. يرجى مراجعتنا لاحقاً.",
  maintenanceMessage: "المتجر في وضع الصيانة والتحديث الدوري. سنعاود العمل قريباً جداً.",
  // Branding & Assets
  logoUrl: "/images/modanil-logo.svg",
  storeTagline: "أزياء راقية بلمسة عصرية وأصالة القطن المصري الفاخر",
  storeDescription: "مودانيل (MODANIL) تقدم أحدث صيحات الموضة والكاجوال والأوفر سايز المصنوعة من أفخر أنسجة القطن المصري والقصات العصرية المتطورة. شحن سريع لكافة محافظات مصر.",
  // Location & Social
  physicalAddress: "المقر الرئيسي: القاهرة، جمهورية مصر العربية",
  landlinePhone: process.env.NEXT_PUBLIC_LANDLINE_PHONE || "",
  secondaryPhone: process.env.NEXT_PUBLIC_SECONDARY_PHONE || "",
  supportWhatsapp: process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201002081676",
  workingHours: "يومياً من 11:00 ص حتى 11:00 م (خدمة العملاء والمعاينة)",
  googleMapsUrl: "",
  telegramUrl: "",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  tiktokUrl: "https://tiktok.com",
  // Hero CMS
  heroBadge: "تشكيلة 2026 - قطن مصري فاخر",
  heroTitle: "أزياء عصرية راقية",
  heroSubtitle: "اكتشف تشكيلة التيشيرتات الأوفر سايز، الهوديز، والقمصان الكتان المصنوعة بأعلى مواصفات النسيج المصري الأصيل. شحن لجميع المحافظات ومعاينة مجانية قبل الدفع.",
  heroBgImage: "/images/hero-bg.jpg",
  heroPrimaryBtnText: "تسوق الكولكشن",
  heroPrimaryBtnLink: "/products",
  // Special Promo Banner
  isPromoBannerActive: true,
  promoBadge: "عرض خاص لعملاء مصر 🇪🇬",
  promoTitle: "خصم 20% إضافي على إجمالي سلة المشتريات!",
  promoDescription: "استخدم كود الخصم عند صفحة إتمام الطلب للحصول على الخصم فورياً لكافة الطلبات فوق 600 ج.م.",
  promoCouponCode: "EGYPT20",
  // SEO Defaults
  seoTitle: "مودانيل | متجر الأزياء والقطن المصري الفاخر",
  seoDescription: "تسوق تشكيلة الأزياء الكاجوال والأوفر سايز والهوديز من مودانيل MODANIL المصنوعة من أفخر قطن مصري. شحن لكافة المحافظات ودفع عند الاستلام وإنستاباي.",
  seoKeywords: "مودانيل, MODANIL, قطن مصري, أزياء رجالي, ملابس كاجوال, أوفر سايز, هوديز, قمصان كتان, إنستاباي, فودافون كاش",
} as const;

/**
 * Normalizes user input into a clean 11-digit Egyptian phone number (e.g. "010XXXXXXXX")
 * - Converts Arabic/Indic numerals (٠١٢٣٤٥٦٧٨٩) to standard ASCII (0-9)
 * - Removes spaces, dashes, parentheses, dots
 * - Strips leading "+20", "0020", or "20" international prefix if present
 * - Ensures number starts with "0"
 */
export function normalizeEgyptianPhone(phone: string): string {
  if (!phone) return "";

  // Convert Arabic-Indic digits to ASCII
  const asciiPhone = phone.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));

  // Strip non-digit characters except leading plus
  let cleaned = asciiPhone.replace(/[^\d+]/g, "");

  // Handle international prefixes (+20, 0020, 20)
  if (cleaned.startsWith("+20")) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith("0020")) {
    cleaned = cleaned.slice(4);
  } else if (cleaned.startsWith("20") && cleaned.length === 12 && /^(10|11|12|15)/.test(cleaned.slice(2))) {
    cleaned = cleaned.slice(2);
  }

  // Ensure leading zero for valid 10-digit mobile body
  if (cleaned.length === 10 && /^(10|11|12|15)/.test(cleaned)) {
    cleaned = "0" + cleaned;
  }

  return cleaned;
}

/** Validates whether a phone number matches standard Egyptian mobile prefixes (010, 011, 012, 015) and contains exactly 11 digits. */
export function isValidEgyptianPhone(phone: string): boolean {
  const normalized = normalizeEgyptianPhone(phone);
  const egPhoneRegex = /^(010|011|012|015)\d{8}$/;
  return egPhoneRegex.test(normalized);
}

/** Formats an Egyptian phone number into international format for WhatsApp wa.me links (e.g. 2010XXXXXXXX). */
export function formatWhatsAppNumber(phone?: string | null): string {
  const rawNumber = phone || STORE_DEFAULTS.whatsapp;
  const cleaned = rawNumber.replace(/\D/g, "");
  return cleaned.startsWith("20") ? cleaned : `20${cleaned.replace(/^0/, "")}`;
}

/**
 * Resolves store settings with fallback defaults from STORE_DEFAULTS.
 * Ensures all consumer components and pages receive complete, non-null settings
 * without repeating manual fallback chains.
 */
export function resolveStoreSettings(settings?: Partial<StoreSettingsItem> | null): StoreSettingsItem {
  return {
    storeName: settings?.storeName || STORE_DEFAULTS.storeName,
    phone: settings?.phone || STORE_DEFAULTS.phone,
    whatsapp: settings?.whatsapp || STORE_DEFAULTS.whatsapp,
    supportEmail: settings?.supportEmail || STORE_DEFAULTS.supportEmail,
    instapayHandle: settings?.instapayHandle || STORE_DEFAULTS.instapayHandle,
    instapayPhone: settings?.instapayPhone || STORE_DEFAULTS.phone,
    vodafoneCashPhone: settings?.vodafoneCashPhone || STORE_DEFAULTS.vodafoneCashPhone,
    freeShippingThreshold:
      typeof settings?.freeShippingThreshold === "number"
        ? settings.freeShippingThreshold
        : STORE_DEFAULTS.freeShippingThreshold,
    bannerNotice: settings?.bannerNotice ?? STORE_DEFAULTS.bannerNotice,
    isBannerActive: settings?.isBannerActive ?? STORE_DEFAULTS.isBannerActive,
    isAcceptingOrders: settings?.isAcceptingOrders ?? true,
    isMaintenanceMode: settings?.isMaintenanceMode ?? false,
    estimatedDeliveryDays: settings?.estimatedDeliveryDays || STORE_DEFAULTS.estimatedDeliveryDays,
    enabledPaymentMethods:
      settings?.enabledPaymentMethods && settings.enabledPaymentMethods.length > 0
        ? settings.enabledPaymentMethods
        : ["cod", "instapay", "vodafone_cash", "card"],
    orderClosedMessage: settings?.orderClosedMessage || STORE_DEFAULTS.orderClosedMessage,
    maintenanceMessage: settings?.maintenanceMessage || STORE_DEFAULTS.maintenanceMessage,
    governoratesShipping: settings?.governoratesShipping,
    logoUrl: settings?.logoUrl || STORE_DEFAULTS.logoUrl,
    storeTagline: settings?.storeTagline || STORE_DEFAULTS.storeTagline,
    storeDescription: settings?.storeDescription || STORE_DEFAULTS.storeDescription,
    physicalAddress: settings?.physicalAddress || STORE_DEFAULTS.physicalAddress,
    landlinePhone: settings?.landlinePhone ?? STORE_DEFAULTS.landlinePhone,
    secondaryPhone: settings?.secondaryPhone ?? STORE_DEFAULTS.secondaryPhone,
    supportWhatsapp: settings?.supportWhatsapp || settings?.whatsapp || STORE_DEFAULTS.supportWhatsapp,
    workingHours: settings?.workingHours || STORE_DEFAULTS.workingHours,
    googleMapsUrl: settings?.googleMapsUrl ?? STORE_DEFAULTS.googleMapsUrl,
    telegramUrl: settings?.telegramUrl ?? STORE_DEFAULTS.telegramUrl,
    facebookUrl: settings?.facebookUrl || STORE_DEFAULTS.facebookUrl,
    instagramUrl: settings?.instagramUrl || STORE_DEFAULTS.instagramUrl,
    tiktokUrl: settings?.tiktokUrl || STORE_DEFAULTS.tiktokUrl,
    heroBadge: settings?.heroBadge || STORE_DEFAULTS.heroBadge,
    heroTitle: settings?.heroTitle || STORE_DEFAULTS.heroTitle,
    heroSubtitle: settings?.heroSubtitle || STORE_DEFAULTS.heroSubtitle,
    heroBgImage: settings?.heroBgImage || STORE_DEFAULTS.heroBgImage,
    heroPrimaryBtnText: settings?.heroPrimaryBtnText || STORE_DEFAULTS.heroPrimaryBtnText,
    heroPrimaryBtnLink: settings?.heroPrimaryBtnLink || STORE_DEFAULTS.heroPrimaryBtnLink,
    isPromoBannerActive: settings?.isPromoBannerActive ?? STORE_DEFAULTS.isPromoBannerActive,
    promoBadge: settings?.promoBadge || STORE_DEFAULTS.promoBadge,
    promoTitle: settings?.promoTitle || STORE_DEFAULTS.promoTitle,
    promoDescription: settings?.promoDescription || STORE_DEFAULTS.promoDescription,
    promoCouponCode: settings?.promoCouponCode || STORE_DEFAULTS.promoCouponCode,
    seoTitle: settings?.seoTitle || STORE_DEFAULTS.seoTitle,
    seoDescription: settings?.seoDescription || STORE_DEFAULTS.seoDescription,
    seoKeywords: settings?.seoKeywords || STORE_DEFAULTS.seoKeywords,
    createdAt: settings?.createdAt,
    updatedAt: settings?.updatedAt,
  };
}


