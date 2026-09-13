"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

interface HomeFAQProps {
  storeName?: string;
  whatsapp?: string;
}

export function HomeFAQ({ storeName, whatsapp }: HomeFAQProps = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const rawName = storeName || process.env.NEXT_PUBLIC_STORE_NAME || STORE_DEFAULTS.storeName;
  const brandName = (rawName && rawName !== "GIZA 86") ? rawName : "MODANIL";
  const currentWhatsApp = whatsapp || STORE_DEFAULTS.whatsapp;

  const faqs = [
    {
      q: "هل يمكنني فتح الشحنة ومعاينة جودة النسيج والمقاس قبل الدفع؟",
      a: `نعم بكل تأكيد! نحن في ${brandName} نثق تماماً في جودة النسيج والتقفيل؛ لذلك يتيح لك مندوب الشحن فحص القطع والتأكد من الخامة والمقاس قبل دفع أي مبلغ، والدفع متاح نقداً أو عبر إنستاباي فور المعاينة.`,
    },
    {
      q: "كم تستغرق مدة التوصيل لمحافظتي؟",
      a: "تصل الشحنات خلال 24 إلى 48 ساعة فقط لمحافظات القاهرة، الجيزة، والإسكندرية. وخلال 2 إلى 4 أيام عمل لكافة محافظات الدلتا، القناة، والصعيد عبر شركاء شحن معتمدين وسريعين.",
    },
    {
      q: "ما هي طرق الدفع المدعومة عند إتمام الطلب؟",
      a: "نوفر لك مرونة كاملة: الدفع نقداً عند الاستلام (COD)، تحويل لحظي عبر تطبيق إنستاباي (InstaPay)، محفظة فودافون كاش، وبطاقات الدفع البنكية وكروت ميزة الوطنية بأعلى معايير الأمان المشفر.",
    },
    {
      q: "ما هي سياسة الاستبدال والاسترجاع؟",
      a: "نوفر لك مهلة 14 يوماً كاملة للاستبدال أو الاسترجاع في حال الرغبة في تبديل المقاس أو اللون أو الموديل. كل ما عليك هو التواصل مع فريق خدمة العملاء عبر الواتساب ويصلك مندوب الاستبدال حتى باب بيتك.",
    },
    {
      q: "كيف أعرف مقاسي المناسب في التيشيرتات الأوفر سايز والهوديز؟",
      a: "جميع موديلاتنا مصممة بقصات Relaxed & Oversized مريحة وفقاً للمقاسات القياسية المصرية. يمكنك تصفح دليل المقاسات المرفق في صفحة كل منتج، أو استشارة فريقنا عبر الواتساب لتحديد المقاس المثالي لوزنك وطولك بدقة.",
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-neutral-200/80">
      <div className="layout-container max-w-4xl">
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800 bg-neutral-100 px-3 py-1 rounded-full">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>الأسئلة الشائعة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950">
            كل ما تحتاج معرفته عن تجربة التسوق
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium max-w-lg mx-auto">
            إجابات واضحة وشفافة على أبرز الأسئلة المتعلقة بالشحن، المعاينة، وطرق الدفع.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-neutral-200/90 overflow-hidden transition-colors bg-white shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-right font-black text-sm sm:text-base text-neutral-900 hover:text-amber-600 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="leading-snug">{faq.q}</span>
                  <div
                    className={`w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0 transition-transform duration-300 mr-3 ${
                      isOpen ? "rotate-180 bg-amber-50 text-amber-600" : "text-neutral-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-right text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium border-t border-neutral-100 bg-neutral-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Customer Help Callout */}
        <div className="mt-10 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-[#c59b27]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right shadow-xl">
          <div className="space-y-1">
            <h4 className="font-black text-sm sm:text-base text-white">لديك استفسار خاص بالمقاسات أو طلبك؟</h4>
            <p className="text-xs text-neutral-400">فريق خدمة عملاء {brandName} متاح عبر الواتساب للرد الفوري والمساعدة على مدار الساعة</p>
          </div>
          <a
            href={`https://wa.me/${currentWhatsApp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-neutral-950 hover:bg-neutral-900 text-white border border-[#c59b27] hover:border-amber-400 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all duration-300 flex-shrink-0 group active:scale-95"
          >
            <WhatsAppIcon className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
            <span className="group-hover:text-amber-300 transition-colors">تواصل فوراً عبر الواتساب</span>
          </a>
        </div>
      </div>
    </section>
  );
}
