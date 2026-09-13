import { ProductItem } from "@/types";

export interface GetProductsOptions {
  categorySlug?: string;
  categoryId?: number;
  featured?: boolean;
  onSale?: boolean;
  inStock?: boolean;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "newest" | "price-asc" | "price-desc" | "oldest";
  limit?: number;
  offset?: number;
}

export interface ProductsPageResult {
  products: ProductItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface IProductRepository {
  findMany(options?: GetProductsOptions): Promise<ProductItem[]>;
  findWithCount(options?: GetProductsOptions): Promise<ProductsPageResult>;
  findById(idOrSlug: string | number): Promise<ProductItem | null>;
  findByIds(ids: number[]): Promise<ProductItem[]>;
  getRelated(categoryId: number, currentProductId: number, limit?: number): Promise<ProductItem[]>;
  getLowStock(threshold?: number, limit?: number): Promise<ProductItem[]>;
  create(data: Omit<ProductItem, "id" | "createdAt" | "updatedAt">): Promise<ProductItem>;
  update(id: number, data: Partial<ProductItem>): Promise<ProductItem | null>;
  delete(id: number): Promise<boolean>;
}
