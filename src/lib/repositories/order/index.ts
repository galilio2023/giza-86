import { isDatabaseConfigured, db } from "@/db";
import { IOrderRepository } from "./order.interface";
import { DrizzleOrderRepository } from "./drizzle-order.repository";
import { MemoryOrderRepository } from "./memory-order.repository";

export * from "./order.interface";
export * from "./order.conditions";
export * from "./memory-order.repository";
export * from "./drizzle-order.repository";

let orderRepositoryInstance: IOrderRepository | null = null;

/** Returns the singleton order repository instance (Drizzle PostgreSQL or in-memory fallback). */
export function getOrderRepository(): IOrderRepository {
  if (!orderRepositoryInstance) {
    orderRepositoryInstance =
      isDatabaseConfigured && db
        ? new DrizzleOrderRepository()
        : new MemoryOrderRepository();
  }
  return orderRepositoryInstance;
}
