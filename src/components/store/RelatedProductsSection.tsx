import { ProductCard } from "@/components/store/ProductCard";
import { ProductItem } from "@/types";

interface RelatedProductsSectionProps {
  products: ProductItem[];
}

export function RelatedProductsSection({ products }: RelatedProductsSectionProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="mb-6">
        <h3 className="text-2xl font-black text-neutral-900">قد يعجبك أيضاً</h3>
        <p className="text-xs text-neutral-500">موديلات مماثلة من نفس القسم</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
