import { ProductItem } from "@/types";
import { isAccessoryProduct } from "@/lib/domain/variants";

interface ProductDescriptionSectionProps {
  product: ProductItem;
  brandName: string;
}

export function ProductDescriptionSection({
  product,
  brandName,
}: ProductDescriptionSectionProps) {
  const isAccessory = isAccessoryProduct(product);

  return (
    <div className="mt-16 bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 space-y-6">
      <h3 className="text-xl font-black text-neutral-900 border-b border-neutral-100 pb-3">
        {isAccessory ? "تفاصيل المنتج ومواصفات الجودة" : "تفاصيل المنتج ومميزات القماش"}
      </h3>
      <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
        {product.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-100 text-xs">
        <div className="bg-neutral-50 p-4 rounded-xl space-y-1">
          <h5 className="font-bold text-neutral-900">
            {isAccessory ? "إرشادات الحفاظ على المنتج والعناية به:" : "إرشادات العناية والغسيل:"}
          </h5>
          <p className="text-neutral-600 leading-relaxed">
            {isAccessory ? (
              <>
                - يُفضل الحفظ في مكان جاف وبعيداً عن الرطوبة المباشرة عند عدم الاستخدام.
                <br />
                - تجنب رش العطور أو الكحول أو المواد الكيميائية مباشرة على القطعة لضمان دوام بريقها.
                <br />
                - يُنصح بمسح القطعة بقطعة قماش قطنية ناعمة وجافة عند الحاجة لتنظيفها.
              </>
            ) : (
              <>
                - يفضل الغسيل بماء بارد عند درجة حرارة 30 مئوية للحفاظ على رونق الألياف القطنية.
                <br />
                - تجنب استخدام المبيضات أو الكلور.
                <br />
                - الكي على درجة حرارة متوسطة من الداخل.
              </>
            )}
          </p>
        </div>
        <div className="bg-neutral-50 p-4 rounded-xl space-y-1">
          <h5 className="font-bold text-neutral-900">ضمان علامة {brandName}:</h5>
          <p className="text-neutral-600 leading-relaxed">
            جميع المنتجات تخضع لفحص دقيق لمراقبة الجودة قبل الشحن للتأكد من خلوها من أي عيوب صناعة ومطابقتها لأعلى معايير المتانة والفخامة.
          </p>
        </div>
      </div>
    </div>
  );
}
