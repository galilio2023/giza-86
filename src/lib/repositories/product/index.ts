import { isDatabaseConfigured, db } from "@/db";
import { IProductRepository } from "./product.interface";
import { DrizzleProductRepository } from "./drizzle-product.repository";
import { MemoryProductRepository } from "./memory-product.repository";

export * from "./product.interface";
export * from "./product.conditions";
export * from "./memory-product.repository";
export * from "./drizzle-product.repository";

let repositoryInstance: IProductRepository | null = null;

export function getProductRepository(): IProductRepository {
  if (!repositoryInstance) {
    repositoryInstance =
      isDatabaseConfigured && db
        ? new DrizzleProductRepository()
        : new MemoryProductRepository();
  }
  return repositoryInstance;
}
