"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  CheckCircle2,
  ChevronDown,
  Layers,
  Shirt,
  ShoppingBag,
  Tag,
  Settings,
  Truck,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Store,
  ExternalLink,
  Clock,
  Flame,
  Check,
  CreditCard,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

interface SectionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  category: "basics" | "catalog" | "orders" | "settings";
  keywords?: string[];
  content: React.ReactNode;
}

export function AdminGuideClient({ storeName = "MODANIL" }: { storeName?: string }) {
  const currentStore = (storeName && storeName !== "GIZA 86") ? storeName : "MODANIL";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [expandedSection, setExpandedSection] = useState<string>("daily-routine");
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    "check-orders": false,
    "confirm-phone": false,
    "print-slips": false,
    "check-stock": false,
    "whatsapp-reply": false,
  });

  const toggleChecklist = (id: string) => {
    const willComplete = !checklist[id];
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
    if (willComplete) {
      toast.success("تم إنجاز المهمة بنجاح ✓");
    }
  };

  const sections: SectionItem[] = useMemo(
    () => [
      {
        id: "daily-routine",
        title: "1. روتين العمل اليومي للمسؤول (المهام الصباحية)",
        subtitle: "كيف تفتح لوحة الإدارة يومياً وتدير العمليات في 5 دقائق",
        icon: Clock,
        category: "basics",
        keywords: ["روتين", "صباح", "تأكيد", "بوليصة", "شحن", "واتساب", "تجهيز", "فواتير", "مهام"],
        content: (
          <div className="space-y-4 text-xs leading-relaxed text-neutral-700">
            <p className="text-sm font-semibold text-neutral-900">
              أهلاً بك في لوحة تحكم متجر <span className="text-amber-600 font-bold">{storeName}</span>! لإدارة المتجر بأعلى كفاءة ومنع أي تأخير على العملاء، احرص على تطبيق هذا الروتين البسيط كل صباح:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center text-[10px]">1</span>
                  <span>متابعة الطلبات الجديدة</span>
                </div>
                <p className="text-neutral-600 text-[11px]">
                  افتح قسم <strong>إدارة الطلبات</strong> وافرز الحالات على <strong>جديد</strong> للتواصل مع أصحابها وتأكيد المقاس والعنوان فوراً.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>تجهيز الشحنات وطباعتها</span>
                </div>
                <p className="text-neutral-600 text-[11px]">
                  انقل الطلبات المؤكدة إلى <strong>جاري التجهيز</strong> واطبع بوالص الشحن بنقرة واحدة لشركات الشحن ومندوبي التوصيل.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-900 font-bold">
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">3</span>
                  <span>تنبيهات انخفاض المخزون</span>
                </div>
                <p className="text-neutral-600 text-[11px]">
                  راجع جدول <strong>المخزون المنخفض</strong> في الصفحة الرئيسية لطلب كميات جديدة قبل نفاد الموديلات الأكثر طلباً.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 text-white space-y-2 mt-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>قاعدة التجارة الإلكترونية الذهبية في مصر:</span>
              </div>
              <p className="text-neutral-300 text-xs">
                الاتصال بالعميل لتأكيد الطلب هاتفياً في غضون <strong>15 إلى 30 دقيقة</strong> من تقديمه يرفع نسبة استلام الشحنة إلى أكثر من <strong>95%</strong>، ويقلل المرتجعات لأدنى حد ممكن!
              </p>
            </div>
          </div>
        ),
      },

      {
        id: "categories-setup",
        title: "2. إدارة الأقسام والكاتالوج (Categories)",
        subtitle: "كيف تنشئ قسماً جديداً وتنظمه في القوائم والصفحة الرئيسية",
        icon: Layers,
        category: "catalog",
        keywords: ["أقسام", "تصنيفات", "إكسسوارات", "ملابس", "شنط", "حقائب", "سلاسل", "ترتيب", "slug"],
        content: (
          <div className="space-y-4 text-xs leading-relaxed text-neutral-700">
            <p>
              الأقسام هي الطريقة الأساسية التي يتنقل بها العميل داخل متجرك. يمكنك إنشاء أقسام لأي نوع من المنتجات: ملابس قطنية، هوديز، قمصان، وأيضاً <strong>إكسسوارات، شنط، توك شعر، محافظ، أو هدايا</strong>.
            </p>

            <div className="space-y-2 border-r-2 border-amber-500 pr-3 my-2">
              <h4 className="font-bold text-neutral-900 text-xs">خطوات إنشاء قسم جديد بنجاح:</h4>
              <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-neutral-600">
                <li>
                  انتقل إلى صفحة <strong>الأقسام والتصنيفات</strong> من القائمة الجانبية.
                </li>
                <li>
                  انقر على زر <strong>إضافة قسم جديد</strong> في أعلى الصفحة.
                </li>
                <li>
                  اكتب <strong>اسم القسم</strong> باللغة العربية (مثال: <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-900 font-bold">شنط وحقائب كاجوال</code> أو <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-900 font-bold">إكسسوارات وتوك شعر</code>).
                </li>
                <li>
                  حدد <strong>الرابط الدائم (Slug)</strong> باللغة الإنجليزية بحروف صغيرة وبدون مسافات (مثال: <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-neutral-900">bags</code> أو <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-neutral-900">accessories</code>).
                </li>
                <li>
                  ضع رابط صورة جذاب أو ارفع صورة تمثل القسم (نسبة الأبعاد المفضلة: عمودية 3:4).
                </li>
                <li>
                  حدد <strong>ترتيب الظهور</strong> (رقم 1 يظهر أولاً في شريط الموقع والصفحة الرئيسية).
                </li>
              </ol>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-950 block">أين يظهر القسم الجديد تلقائياً للعميل؟</strong>
                <span className="text-neutral-600 text-[11px]">
                  بمجرد حفظ القسم، سيظهر تلقائياً في القائمة المنسدلة العلوية (Navbar)، والقائمة الجانبية للموبايل، وشبكة أقسام الصفحة الرئيسية، وقائمة الفلترة في الكتالوج دون الحاجة لكتابة أي كود!
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/admin/categories"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition"
              >
                <span>فتح صفحة إدارة الأقسام الآن</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ),
      },

      {
        id: "products-apparel-vs-accessories",
        title: "3. إضافة وإدارة المنتجات (الملابس vs الإكسسوارات)",
        subtitle: "كيف تضبط المقاسات، الألوان، شارات المنتجات، ودليل المقاسات بدقة",
        icon: Shirt,
        category: "catalog",
        keywords: ["منتجات", "مقاسات", "مقاس موحد", "one size", "شارات", "جدول مقاسات", "ألوان", "مخزون", "باركود", "sku"],
        content: (
          <div className="space-y-4 text-xs leading-relaxed text-neutral-700">
            <p>
              تم تطوير نموذج إضافة المنتجات ليكون فائق الذكاء: فهو يدعم الملابس التقليدية بكل مقاساتها، وكذلك يدعم الإكسسوارات والشنط والمنتجات ذات <strong>المقاس الموحد (One Size)</strong> بكل بساطة.
            </p>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Clothes */}
              <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 space-y-2.5 shadow-xs">
                <div className="flex items-center gap-2 text-neutral-950 font-bold border-b pb-2">
                  <Shirt className="w-4 h-4 text-amber-600" />
                  <span>طريقة إضافة منتج ملابس (T-Shirts / Hoodies)</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-neutral-600">
                  <li>
                    • انقر على زر النمط السريع: <strong>ملابس (S-2XL)</strong>.
                  </li>
                  <li>
                    • اترك خيار <strong>تفعيل جدول مقاسات الملابس بالسنتيمتر</strong> مفعلاً ليتمكن العميل من رؤية جدول قياسات الصدر والوزن.
                  </li>
                  <li>
                    • في خانة مواصفات الخامة، اختر اقتراحاً مثل: <strong>قطن مصري 100% فاخر معالج</strong>.
                  </li>
                  <li>
                    • شارة المنتج: يمكنك تركها لتعرض تلقائياً <strong>قطن جيزة 86 🇪🇬</strong>.
                  </li>
                </ul>
              </div>

              {/* Accessories */}
              <div className="p-4 rounded-2xl bg-white border border-amber-200/80 bg-amber-50/20 space-y-2.5 shadow-xs">
                <div className="flex items-center gap-2 text-amber-950 font-bold border-b border-amber-200/60 pb-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>طريقة إضافة إكسسوار (شنطة / توكة شعر / محفظة)</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-neutral-600">
                  <li>
                    • انقر على زر النمط السريع: <strong>مقاس موحد (One Size)</strong>.
                  </li>
                  <li>
                    • النظام سيقوم تلقائياً بـ <strong>إلغاء جدول مقاسات الملابس</strong> حتى لا يظهر للعميل جدول مقاسات ملابس محير لمنتج إكسسوار!
                  </li>
                  <li>
                    • اختر شارة مميزة بنقرة واحدة: <strong>إكسسوار حصري ✨</strong> أو <strong>جلد طبيعي 💼</strong> أو <strong>صناعة يدوية 🧵</strong>.
                  </li>
                  <li>
                    • صفحة المنتج ستعرض للعميل تلقائياً <strong>إرشادات الحفاظ على بريق الإكسسوار</strong> بدلاً من تعليمات غسيل الملابس القطنية.
                  </li>
                </ul>
              </div>
            </div>

            {/* Variants and Stock */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
              <h5 className="font-bold text-neutral-900 text-xs">إدارة الألوان وصور المتغيرات:</h5>
              <p className="text-[11px] text-neutral-600">
                عند إضافة ألوان للمنتج (مثل: أسود، كحلي، جملي، ذهبي)، يمكنك ربط كل لون بالصورة المطابقة له من صور المنتج. عندما ينقر العميل على اللون في الموقع، ستتحول صورة العرض الرئيسية تلقائياً للون الذي اختاره!
              </p>
              <p className="text-[11px] text-neutral-600">
                يمكنك استخدام زر <strong>تعيين كمية موحدة للكل</strong> في جدول المتغيرات لتعيين المخزون لجميع المقاسات والألوان بنقرة واحدة (مثلاً 10 قطع من كل لون ومقاس).
              </p>
            </div>

            <div className="pt-1">
              <Link
                href="/admin/products"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition"
              >
                <span>فتح صفحة إدارة المنتجات الآن</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ),
      },

      {
        id: "orders-lifecycle",
        title: "4. دورة حياة الطلبات والطباعة والتوصيل",
        subtitle: "من لحظة نقر العميل على 'تأكيد الطلب' وحتى تحصيل الأموال من المندوب",
        icon: ShoppingBag,
        category: "orders",
        keywords: ["طلبات", "شحن", "بوليصة", "فاتورة", "تأكيد", "توصيل", "حالات", "تتبع", "بوالص", "طابعة", "طباعة"],
        content: (
          <div className="space-y-4 text-xs leading-relaxed text-neutral-700">
            <p>
              تم تصميم نظام إدارة الطلبات ليتوافق بدقة 100% مع واقع شركات الشحن والدفع عند الاستلام (COD) في جمهورية مصر العربية.
            </p>

            {/* Workflow Steps */}
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-bold text-xs shrink-0">
                  1. جديد (New)
                </span>
                <div>
                  <strong className="text-neutral-900 block">الطلب تم تقديمه للتو من الموقع أو عبر واتساب</strong>
                  <span className="text-[11px] text-neutral-600">
                    العميل ينتظر التأكيد. افتح تفاصيل الطلب واتصل به هاتفياً أو راسله على الواتساب للتأكد من العنوان وتطابق المقاس.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs shrink-0">
                  2. مؤكد (Confirmed)
                </span>
                <div>
                  <strong className="text-neutral-900 block">تم التأكيد مع العميل بنجاح</strong>
                  <span className="text-[11px] text-neutral-600">
                    حول الحالة إلى &quot;مؤكد&quot;. هذا يخبر فريق التجهيز بأن الطلب جاهز للتعبئة والتغليف.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs shrink-0">
                  3. جاري التجهيز (Processing)
                </span>
                <div>
                  <strong className="text-neutral-900 block">تجهيز الشحنة وطباعة البوليصة</strong>
                  <span className="text-[11px] text-neutral-600">
                    انقر على زر <strong>طباعة الفاتورة / البوليصة (Print Receipt)</strong> داخل تفاصيل الطلب لتحصل على بوليصة شحن A4 مصممة باحتراف تحتوي على باركود الطلب وبيانات العميل والمبلغ المطلوب تحصيله.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 font-bold text-xs shrink-0">
                  4. تم الشحن (Shipped)
                </span>
                <div>
                  <strong className="text-neutral-900 block">تم تسليم الطرد لشركة الشحن أو المندوب</strong>
                  <span className="text-[11px] text-neutral-600">
                    أدخل <strong>رقم التتبع (Tracking Number)</strong> في خانة التتبع بالطلب حتى يتمكن العميل من تتبع شحنته ذاتياً عبر صفحة <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">/track</code>.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs shrink-0">
                  5. تم التوصيل (Delivered)
                </span>
                <div>
                  <strong className="text-neutral-900 block">تم استلام العميل وتحصيل المبلغ بالكامل</strong>
                  <span className="text-[11px] text-neutral-600">
                    مبروك! هذا الطلب يضاف تلقائياً لأرباح وإيرادات المتجر في الإحصائيات.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition"
              >
                <span>فتح صفحة إدارة الطلبات الآن</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ),
      },

      {
        id: "shipping-rates-egypt",
        title: "5. أسعار الشحن لمحافظات مصر الـ 27 والشحن المجاني",
        subtitle: "كيف تضبط تكلفة التوصيل لكل محافظة وتفعل عروض الشحن المجاني",
        icon: Truck,
        category: "settings",
        keywords: ["شحن", "محافظات", "أسعار الشحن", "القاهرة", "الجيزة", "الإسكندرية", "الصعيد", "شحن مجاني", "delivery", "shipping"],
        content: (
          <div className="space-y-4 text-xs leading-relaxed text-neutral-700">
            <p>
              يحتوي النظام على خريطة شحن ديناميكية تشمل جميع محافظات مصر الـ 27 (من القاهرة والإسكندرية وحتى أسوان والوادي الجديد والمحافظات الحدودية).
            </p>

            <div className="space-y-2 border-r-2 border-emerald-500 pr-3 my-2">
              <h4 className="font-bold text-neutral-900 text-xs">كيفية تعديل أسعار الشحن من اللوحة:</h4>
              <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-neutral-600">
                <li>
                  انتقل إلى <strong>إعدادات المتجر والشحن</strong> من القائمة الجانبية.
                </li>
                <li>
                  اختر تبويب <strong>الشحن والمحافظات</strong>.
                </li>
                <li>
                  ستجد قائمة بكل محافظة وسعر الشحن المخصص لها بالجنيه المصري (مثال: القاهرة 50 ج.م، الإسكندرية 60 ج.م، الصعيد 75 ج.م).
                </li>
                <li>
                  يمكنك تعديل أي سعر مباشرة، أو استخدام أزرار التعيين السريع للمجموعات (القاهرة الكبرى، محافظات الدلتا، الصعيد، المحافظات الحدودية).
                </li>
                <li>
                  اضبط <strong>حد الشحن المجاني (Free Shipping Threshold)</strong> (مثال: 1200 ج.م). إذا تجاوزت سلة العميل هذا الرقم، تصبح مصاريف الشحن 0 ج.م تلقائياً كحافز قوي للشراء!
                </li>
              </ol>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-950 block">حساب فوري وتلقائي عند الدفع:</strong>
                <span className="text-neutral-600 text-[11px]">
                  بمجرد أن يختار العميل محافظته في صفحة إتمام الطلب (Checkout)، يقوم النظام تلقائياً بتحديث إجمالي الفاتورة وقيمة الشحن فوراً دون الحاجة لإعادة تحميل الصفحة.
                </span>
              </div>
            </div>

            <div className="pt-1">
              <Link
                href="/admin/settings"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition"
              >
                <span>ضبط أسعار الشحن الآن</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ),
      },

      {
        id: "coupons-and-marketing",
        title: "6. كوبونات الخصم والعروض الترويجية والبانر",
        subtitle: "كيف تطلق حملات تخفيض وتفعل شريط الإعلانات أعلى الموقع",
        icon: Tag,
        category: "catalog",
        keywords: ["كوبونات", "خصم", "عروض", "بروموكود", "بانر", "شريط إعلاني", "promo code", "تخفيضات"],
        content: (
          <div className="space-y-4 text-xs leading-relaxed text-neutral-700">
            <p>
              العروض الترويجية هي أقوى وسيلة لتحفيز العملاء على إنهاء الشراء وزيادة قيمة سلة التسوق.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white border border-neutral-200 space-y-1.5">
                <span className="font-bold text-neutral-900 text-xs block">كوبون نسبة مئوية (%)</span>
                <p className="text-[11px] text-neutral-600">
                  مثال: كود <code className="bg-neutral-100 font-bold px-1 rounded text-rose-600">SUMMER15</code> لخصم 15% من إجمالي قيمة المنتجات. يمكنك وضع حد أقصى للخصم.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-neutral-200 space-y-1.5">
                <span className="font-bold text-neutral-900 text-xs block">كوبون مبلغ ثابت (ج.م)</span>
                <p className="text-[11px] text-neutral-600">
                  مثال: كود <code className="bg-neutral-100 font-bold px-1 rounded text-emerald-600">EGP100</code> لخصم 100 جنيه فوراً عند تجاوز السلة مبلغ 1000 جنيه.
                </p>
              </div>
            </div>

            <div className="space-y-2 border-r-2 border-rose-500 pr-3 my-2">
              <h4 className="font-bold text-neutral-900 text-xs">شروط وحماية الكوبونات:</h4>
              <ul className="space-y-1 text-[11px] text-neutral-600">
                <li>• <strong>حد أدنى للطلب:</strong> لمنع استغلال الكوبون في طلبات صغيرة جداً.</li>
                <li>• <strong>أقصى عدد مرات استخدام:</strong> مثلاً لأول 50 عميل فقط، ويتعطل الكوبون بعد ذلك تلقائياً.</li>
                <li>• <strong>تاريخ انتهاء الصلاحية:</strong> ينتهي الكوبون تلقائياً بعد التاريخ والساعة المحددة.</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-900 text-white space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>شريط الإعلانات العلوي والبانر الترويجي:</span>
              </div>
              <p className="text-neutral-300 text-[11px]">
                من صفحة <strong>إعدادات المتجر</strong> ← تبويب <strong>البانر الترويجي</strong>، يمكنك كتابة نص الإعلان الذي يظهر في أعلى الموقع بالكامل (مثال: <em>🔥 شحن مجاني لفترة محدودة على جميع الطلبات فوق 1000 ج.م كود: FREESHIP</em>).
              </p>
            </div>

            <div className="pt-1">
              <Link
                href="/admin/coupons"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition"
              >
                <span>فتح صفحة كوبونات الخصم الآن</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ),
      },

      {
        id: "payments-and-settings",
        title: "7. بوابات الدفع المصرية وإعدادات المتجر الكاملة",
        subtitle: "ضبط الدفع عند الاستلام، إنستاباي InstaPay، فودافون كاش، وواتساب المتجر",
        icon: Settings,
        category: "settings",
        keywords: ["دفع", "كاش", "عند الاستلام", "cod", "انستاباي", "instapay", "فودافون كاش", "فيزا", "ميزة", "مرتجع", "بنوك"],
        content: (
          <div className="space-y-4 text-xs leading-relaxed text-neutral-700">
            <p>
              يدعم المتجر خيارات الدفع الأكثر موثوقية وشعبية في مصر لضمان إتمام كل عميل لطلبه بالطريقة المفضلة لديه:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white border border-neutral-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-neutral-900">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>الدفع عند الاستلام (COD)</span>
                </div>
                <p className="text-neutral-600 text-[11px]">
                  الخيار المفضل لـ 80% من المستهلكين في مصر. يدفع العميل للمندوب نقداً بعد استلام الطرد ومعاينته.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-neutral-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-neutral-900">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  <span>إنستاباي (InstaPay)</span>
                </div>
                <p className="text-neutral-600 text-[11px]">
                  التحويل البنكي واللحظي عبر تطبيق إنستاباي. في إعدادات المتجر يمكنك وضع عنوان إنستاباي (IPA Handle) ورقم هاتف الحساب.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-neutral-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-neutral-900">
                  <PhoneCall className="w-4 h-4 text-rose-600" />
                  <span>فودافون كاش ومحافظ الهاتف</span>
                </div>
                <p className="text-neutral-600 text-[11px]">
                  التحويل السريع عبر محافظ المحمول (فودافون كاش، أورنج كاش، اتصالات كاش، وي باي). يظهر رقم محفظة المتجر للعميل بوضوح.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-neutral-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-neutral-900">
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>الطلب المباشر عبر واتساب</span>
                </div>
                <p className="text-neutral-600 text-[11px]">
                  يوجد زر واتساب في كل صفحة منتج، يفتح شات محادثة للعميل مع رسالة جاهزة بها اسم المنتج والمقاس واللون والسعر تلقائياً!
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl space-y-2">
              <strong className="text-amber-950 block">صيغة أرقام الهواتف الصحيحة في الإعدادات:</strong>
              <p className="text-neutral-600 text-[11px]">
                احرص على كتابة رقم هاتف الواتساب ورقم خدمة العملاء بصيغة الهاتف المصري (11 رقماً تبدأ بـ 010 أو 011 أو 012 أو 015) أو بالصيغة الدولية (+2010xxxxxxxx) ليعمل رابط الواتساب والاتصال بسلاسة ودون انقطاع.
              </p>
            </div>

            <div className="pt-1">
              <Link
                href="/admin/settings"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition"
              >
                <span>فتح صفحة إعدادات المتجر الكاملة</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ),
      },
    ],
    [storeName]
  );

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sections.filter((s) => {
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.keywords?.some((k) => k.toLowerCase().includes(q));

      const matchesTab = activeTab === "all" || s.category === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [sections, searchQuery, activeTab]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-neutral-950 text-white p-6 sm:p-10 relative overflow-hidden shadow-xl border border-neutral-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>الدليل التدريبي التفاعلي الشامل للمتجر</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-snug">
            دليل تشغيل وإدارة متجر {storeName} 💡
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium">
            مرجع تفصيلي خطوة بخطوة باللغة العربية لكل شخص يتعامل مع لوحة تحكم المتجر لإدارة الموديلات، الإكسسوارات، الشحن، الطلبات، وطرق الدفع في السوق المصري.
          </p>

          {/* Quick Search */}
          <div className="pt-2 relative max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الدليل (مثال: إكسسوار، بوليصة، إنستاباي، شحن)..."
              className="w-full bg-neutral-900/90 border border-neutral-700/80 rounded-2xl pr-10 pl-4 py-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 shadow-inner"
            />
          </div>
        </div>

        {/* Scrim / Subtle Glow */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Interactive Morning Checklist Widget */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2 text-neutral-900 font-black text-sm sm:text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>قائمة المهام الصباحية اليومية للمشغل (5 دقائق يومياً)</span>
          </div>
          <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
            تم إنجاز {Object.values(checklist).filter(Boolean).length} من 5 مهام
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { id: "check-orders", label: "مراجعة الطلبات الجديدة" },
            { id: "confirm-phone", label: "الاتصال لتأكيد المقاسات" },
            { id: "print-slips", label: "طباعة بوالص الشحن" },
            { id: "check-stock", label: "فحص تنبيهات المخزون" },
            { id: "whatsapp-reply", label: "الرد على استفسارات واتساب" },
          ].map((item) => {
            const isChecked = checklist[item.id];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleChecklist(item.id)}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition text-right cursor-pointer select-none ${
                  isChecked
                    ? "bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs"
                    : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition flex-shrink-0 ${
                    isChecked
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-neutral-300 bg-white"
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className={isChecked ? "line-through opacity-80" : ""}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: "all", label: "كافة الأقسام والدروس" },
          { id: "basics", label: "الأساسيات والروتين" },
          { id: "catalog", label: "المنتجات والأقسام" },
          { id: "orders", label: "الطلبات والشحن" },
          { id: "settings", label: "الإعدادات والدفع" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? "bg-neutral-950 text-white shadow-xs"
                : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Accordion / Step-by-Step Sections */}
      <div className="space-y-4">
        {filteredSections.map((section) => {
          const Icon = section.icon;
          const isOpen = expandedSection === section.id;

          return (
            <div
              key={section.id}
              className={`rounded-3xl bg-white border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "border-amber-400/80 shadow-md ring-1 ring-amber-400/20"
                  : "border-neutral-200/90 shadow-2xs hover:border-neutral-300"
              }`}
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => setExpandedSection(isOpen ? "" : section.id)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-right cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors flex-shrink-0 ${
                      isOpen ? "bg-amber-500 text-neutral-950 shadow-xs" : "bg-neutral-100 text-neutral-700 group-hover:bg-neutral-200"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-black text-neutral-900 group-hover:text-amber-600 transition truncate">
                      {section.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-neutral-500 truncate mt-0.5">
                      {section.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 mr-2">
                  <span
                    className={`hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isOpen ? "bg-amber-100 text-amber-900" : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {isOpen ? "إخفاء التفاصيل" : "قراءة الشرح"}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-amber-600" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Accordion Body */}
              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-neutral-100 bg-neutral-50/40">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}

        {filteredSections.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-neutral-200 p-6 space-y-3">
            <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto" />
            <h4 className="font-bold text-neutral-900 text-sm">لم يتم العثور على نتائج مطابقة لبحثك</h4>
            <p className="text-neutral-500 text-xs">جرب البحث بكلمات أخرى مثل: &quot;مقاس&quot;، &quot;شحن&quot;، &quot;بوليصة&quot;، &quot;كوبون&quot;، أو &quot;منتج&quot;.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
              }}
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition"
            >
              عرض كافة الأقسام
            </button>
          </div>
        )}
      </div>

      {/* Quick Access Cheat-Sheet Footer */}
      <div className="p-6 rounded-3xl bg-neutral-900 text-white border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2 font-black text-sm text-amber-400">
            <Store className="w-4 h-4 text-amber-400" />
            <span>روابط سريعة لأهم شاشات الإدارة</span>
          </div>
          <span className="text-[11px] text-neutral-400">انقر للذهاب المباشر للوظيفة المطلوبة</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs font-bold">
          <Link
            href="/admin/products"
            className="p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition flex flex-col justify-between gap-2 border border-neutral-700/60"
          >
            <Shirt className="w-4 h-4 text-amber-400" />
            <span>إضافة وتعديل المنتجات</span>
          </Link>

          <Link
            href="/admin/orders"
            className="p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition flex flex-col justify-between gap-2 border border-neutral-700/60"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>متابعة وطباعة الطلبات</span>
          </Link>

          <Link
            href="/admin/categories"
            className="p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition flex flex-col justify-between gap-2 border border-neutral-700/60"
          >
            <Layers className="w-4 h-4 text-sky-400" />
            <span>أقسام المتجر والإكسسوارات</span>
          </Link>

          <Link
            href="/admin/coupons"
            className="p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition flex flex-col justify-between gap-2 border border-neutral-700/60"
          >
            <Tag className="w-4 h-4 text-rose-400" />
            <span>كوبونات الخصم والعروض</span>
          </Link>

          <Link
            href="/admin/settings"
            className="p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition flex flex-col justify-between gap-2 border border-neutral-700/60"
          >
            <Truck className="w-4 h-4 text-purple-400" />
            <span>أسعار الشحن للمحافظات</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 hover:text-amber-200 transition flex flex-col justify-between gap-2 border border-neutral-700/60"
          >
            <ExternalLink className="w-4 h-4 text-amber-400" />
            <span>معاينة متجر العملاء ↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
