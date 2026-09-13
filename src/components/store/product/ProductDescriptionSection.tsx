import { ProductItem } from "@/types";

interface ProductDescriptionSectionProps {
  product: ProductItem;
  brandName: string;
}

export function ProductDescriptionSection({
  product,
  brandName,
}: ProductDescriptionSectionProps) {
  return (
    <div className="mt-16 bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 space-y-6">
      <h3 className="text-xl font-black text-neutral-900 border-b border-neutral-100 pb-3">
        تفاصيل المنتج ومميزات القماش
      </h3>
      <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
        {product.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-100 text-xs">
        <div className="bg-neutral-50 p-4 rounded-xl space-y-1">
          <h5 className="font-bold text-neutral-900">إرشادات العناية والغسيل:</h5>
          <p className="text-neutral-600">
            - يفضل الغسيل بماء بارد عند درجة حرارة 30 مئوية للحفاظ على رونق الألياف القطنية.
            <br />
            - تجنب استخدام المبيضات أو الكلور.
            <br />
            - الكي على درجة حرارة متوسطة من الداخل.
          </p>
        </div>
        <div className="bg-neutral-50 p-4 rounded-xl space-y-1">
          <h5 className="font-bold text-neutral-900">ضمان علامة {brandName}:</h5>
          <p className="text-neutral-600">
            جميع المنتجات تخضع لفحص دقيق لمراقبة الجودة قبل الشحن للتأكد من خلوها من أي عيوب صناعة وتطابق المقاس بدقة مع المعايير المصرية والعالمية.
          </p>
        </div>
      </div>
    </div>
  );
}
