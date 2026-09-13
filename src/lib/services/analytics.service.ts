import { OrderItem } from "@/types";
import { isDatabaseConfigured, db } from "@/db";
import { orders, products } from "@/db/schema";
import { sql } from "drizzle-orm";
import { memoryOrders, memoryProducts } from "@/lib/repositories/memory-store";
import { getOrders } from "./orders.service";

export interface GovernorateStat {
  region: string;
  count: number;
  percentage: number;
  colorClass: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  aov: number;
  newOrdersCount: number;
  lowStockCount: number;
  recentOrders: OrderItem[];
  governoratesDistribution: GovernorateStat[];
}

const REGION_MAPPING: Record<string, string> = {
  "القاهرة": "القاهرة الكبرى (القاهرة، الجيزة، القليوبية)",
  "الجيزة": "القاهرة الكبرى (القاهرة، الجيزة، القليوبية)",
  "القليوبية": "القاهرة الكبرى (القاهرة، الجيزة، القليوبية)",
  "الإسكندرية": "الإسكندرية والساحل الشمالي",
  "مطروح": "الإسكندرية والساحل الشمالي",
  "الدقهلية": "محافظات الدلتا والقناة",
  "الغربية": "محافظات الدلتا والقناة",
  "الشرقية": "محافظات الدلتا والقناة",
  "المنوفية": "محافظات الدلتا والقناة",
  "كفر الشيخ": "محافظات الدلتا والقناة",
  "دمياط": "محافظات الدلتا والقناة",
  "البحيرة": "محافظات الدلتا والقناة",
  "بورسعيد": "محافظات الدلتا والقناة",
  "الإسماعيلية": "محافظات الدلتا والقناة",
  "السويس": "محافظات الدلتا والقناة",
};

export function calculateGovernorateDistribution(
  orderList: Array<{ governorate: string; count?: number }>
): GovernorateStat[] {
  const regions = [
    { region: "القاهرة الكبرى (القاهرة، الجيزة، القليوبية)", colorClass: "bg-amber-500", count: 0 },
    { region: "الإسكندرية والساحل الشمالي", colorClass: "bg-blue-500", count: 0 },
    { region: "محافظات الدلتا والقناة", colorClass: "bg-emerald-500", count: 0 },
    { region: "مدن الصعيد والمحافظات الحدودية", colorClass: "bg-purple-500", count: 0 },
  ];

  const total = orderList.reduce((sum, o) => sum + (o.count ?? 1), 0);
  if (total === 0) {
    return regions.map((r) => ({ ...r, percentage: 0 }));
  }

  for (const o of orderList) {
    const qty = o.count ?? 1;
    const matchedRegion = REGION_MAPPING[o.governorate] || "مدن الصعيد والمحافظات الحدودية";
    const found = regions.find((r) => r.region === matchedRegion);
    if (found) {
      found.count += qty;
    } else {
      regions[3].count += qty;
    }
  }

  return regions.map((r) => ({
    region: r.region,
    colorClass: r.colorClass,
    count: r.count,
    percentage: Math.round((r.count / total) * 100),
  }));
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isDatabaseConfigured || !db) {
    const validOrders = memoryOrders.filter(
      (o) => o.orderStatus !== "cancelled" && o.orderStatus !== "returned" && o.paymentStatus !== "failed"
    );
    const totalRevenue = validOrders.reduce((acc, o) => acc + o.total, 0);
    const totalOrders = memoryOrders.length;
    const aov = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;
    const newOrdersCount = memoryOrders.filter((o) => o.orderStatus === "new").length;
    const lowStockCount = memoryProducts.filter((p) => p.stock <= 10).length;
    const recentOrders = memoryOrders.slice(0, 5);
    const governoratesDistribution = calculateGovernorateDistribution(memoryOrders);

    return {
      totalRevenue,
      totalOrders,
      aov,
      newOrdersCount,
      lowStockCount,
      recentOrders,
      governoratesDistribution,
    };
  }

  try {
    const [orderMetrics, stockMetrics, recentOrders, govCounts] = await Promise.all([
      db
        .select({
          totalRevenue: sql<number>`COALESCE(SUM(CASE WHEN ${orders.orderStatus} NOT IN ('cancelled', 'returned') AND ${orders.paymentStatus} != 'failed' THEN ${orders.total}::numeric ELSE 0 END), 0)::numeric`,
          totalOrders: sql<number>`COUNT(*)::int`,
          validOrdersCount: sql<number>`COUNT(CASE WHEN ${orders.orderStatus} NOT IN ('cancelled', 'returned') AND ${orders.paymentStatus} != 'failed' THEN 1 END)::int`,
          newOrdersCount: sql<number>`COUNT(CASE WHEN ${orders.orderStatus} = 'new' THEN 1 END)::int`,
        })
        .from(orders),
      db
        .select({
          lowStockCount: sql<number>`COUNT(*)::int`,
        })
        .from(products)
        .where(sql`${products.stock} <= 10`),
      getOrders({ limit: 5 }),
      db
        .select({
          governorate: orders.governorate,
          count: sql<number>`COUNT(*)::int`,
        })
        .from(orders)
        .groupBy(orders.governorate),
    ]);

    const totalRev = Number(orderMetrics[0]?.totalRevenue || 0);
    const totalOrd = Number(orderMetrics[0]?.totalOrders || 0);
    const validOrd = Number(orderMetrics[0]?.validOrdersCount || 0);
    const aov = validOrd > 0 ? Math.round(totalRev / validOrd) : 0;
    const newOrd = Number(orderMetrics[0]?.newOrdersCount || 0);
    const lowStock = Number(stockMetrics[0]?.lowStockCount || 0);
    const governoratesDistribution = calculateGovernorateDistribution(govCounts);

    return {
      totalRevenue: totalRev,
      totalOrders: totalOrd,
      aov,
      newOrdersCount: newOrd,
      lowStockCount: lowStock,
      recentOrders,
      governoratesDistribution,
    };
  } catch (error) {
    console.error("Database query failed in getDashboardStats:", error);
    throw error;
  }
}
