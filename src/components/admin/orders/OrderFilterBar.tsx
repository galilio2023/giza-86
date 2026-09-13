import { OrderItem } from "@/types";
import { Card } from "@/components/ui/card";
import { ORDER_STATUSES } from "@/lib/egypt-constants";
import { AdminSearchInput } from "@/components/admin/ui";

interface OrderFilterBarProps {
  ordersCount: number;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  orders: OrderItem[];
  statusCounts?: Record<string, number>;
}

export function OrderFilterBar({
  ordersCount,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  orders,
  statusCounts,
}: OrderFilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
            إدارة الطلبات والشحنات
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            متابعة خط سير الشحنات، بوالص الشحن، وتأكيد تحويلات إنستاباي وفودافون كاش
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-neutral-900 text-amber-400 px-3.5 py-2 rounded-xl border border-neutral-800 shadow-xs">
            إجمالي الطلبات المسجلة: {statusCounts?.all ?? ordersCount}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card variant="modern" padding="md" className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <AdminSearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="ابحث برقم الطلب، اسم العميل، الهاتف، أو رقم البوليصة..."
        />

        {/* Status Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => onStatusFilterChange("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              statusFilter === "all"
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            الكل ({statusCounts?.all ?? ordersCount})
          </button>
          {Object.entries(ORDER_STATUSES).map(([key, value]) => {
            const count = statusCounts ? (statusCounts[key] ?? 0) : orders.filter((o) => o.orderStatus === key).length;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onStatusFilterChange(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  statusFilter === key
                    ? "bg-amber-500 text-neutral-950 shadow-xs"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {value.label} ({count})
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
