import { Star, ShieldCheck, CheckCircle2, Quote } from "lucide-react";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";

interface HomeReviewsProps {
  storeName?: string;
}

export function HomeReviews({ storeName }: HomeReviewsProps = {}) {
  const brandName = storeName || process.env.NEXT_PUBLIC_STORE_NAME || STORE_DEFAULTS.storeName || "GIZA 86";
  const reviews = [
    {
      name: "م. أحمد مصطفى",
      location: "القاهرة - المعادي",
      verified: true,
      text: "التيشيرت الأوفر سايز بجد خرافة، خامته تقيلة 240 GSM وما بتكشش بعد الغسيل خالص والياقة ثابتة. الشحن وصلني المعادي تاني يوم علطول وعاينت الخامة قبل الدفع.",
      item: "تيشيرت أوفر سايز بيزك - أسود",
    },
    {
      name: "سارة الشريف",
      location: "الإسكندرية - سموحة",
      verified: true,
      text: "طلبت الفستان الكاجوال وخامته قطن ناعم جداً ومريحة ومقاسه مضبوط بالمللي. وحولت الحساب إنستاباي والمعاملة كانت قمة في الذوق والاحترافية.",
      item: "دريس كاجوال ميدي - بيج",
    },
    {
      name: "محمود عبد العزيز",
      location: "الجيزة - الشيخ زايد",
      verified: true,
      text: "الهودي خامة ميلتون قطن محترمة تدفي بجد ومش بتعمل وبرة بعد الاستخدام المتكرر. تجربة شراء ممتازة وبإذن الله هطلب من كولكشن الشتاء دايماً.",
      item: "هودي أوفر سايز شتوي - رمادي",
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-neutral-50/70 border-t border-b border-neutral-200/80">
      <div className="layout-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-neutral-200/80 pb-6">
          <div className="space-y-2 text-right">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800 bg-white px-3 py-1 rounded-full border border-neutral-200 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>تقييمات موثقة من عملاء مصر 🇪🇬</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-950">
              ماذا يقول عملاؤنا عن خامات {brandName}؟
            </h2>
            <p className="text-sm text-neutral-600 font-medium max-w-xl">
              ثقة أكثر من 15,000 عميل في كافة محافظات الجمهورية بتجربة شراء تتيح المعاينة وفحص الخامة قبل الاستلام.
            </p>
          </div>

          {/* Rating Summary Pill */}
          <div className="flex items-center gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-neutral-200 shadow-xs self-start md:self-end">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-neutral-950 border border-amber-500/20 flex flex-col items-center justify-center font-black">
              <span className="text-base font-mono leading-none">4.9</span>
              <div className="flex text-amber-500 text-[10px] mt-0.5">★</div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-900 block mt-1">
                98% نسبة رضا العملاء
              </span>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col justify-between space-y-4 text-right"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-neutral-200" />
                </div>

                <p className="text-sm text-neutral-800 leading-relaxed font-medium min-h-[4.5rem] flex items-start">
                  &quot;{r.text}&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-neutral-950 text-sm">
                    <span>{r.name}</span>
                    {r.verified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>مشتري موثق</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-neutral-500 font-medium block mt-0.5">
                    {r.location}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 font-medium max-w-[110px] truncate">
                  {r.item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
