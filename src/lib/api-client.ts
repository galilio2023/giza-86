/**
 * GIZA 86 Typed API Client
 * Eliminates raw fetch() boilerplate from client components with type-safe
 * request/response handling and consistent error extraction.
 */


import type { CreateProductInput, UpdateProductInput } from "@/lib/validations/product.schema";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/lib/validations/category.schema";
import type { CreateCouponInput, UpdateCouponInput } from "@/lib/validations/coupon.schema";
import type { CreateOrderInput } from "@/lib/validations/order.schema";
import type { UpdateSettingsInput } from "@/lib/validations/settings.schema";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      data.error || `Request failed with status ${res.status}`,
      res.status,
      data.code
    );
  }

  return data as T;
}

function get<T>(url: string): Promise<T> {
  return request<T>(url, { method: "GET" });
}

function post<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function put<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

function patch<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

function del<T>(url: string): Promise<T> {
  return request<T>(url, { method: "DELETE" });
}

export { request as apiFetch };

export const api = {
  products: {
    get: (id: string | number) => get<import("@/types").ProductItem>(`/api/products/${id}`),
    create: (data: CreateProductInput) => post<import("@/types").ProductItem>("/api/products", data),
    update: (id: number, data: UpdateProductInput) => put<import("@/types").ProductItem>(`/api/products/${id}`, data),
    delete: (id: number) => del<{ success: boolean }>(`/api/products/${id}`),
  },
  orders: {
    create: (data: CreateOrderInput) => post<import("@/types").OrderItem>("/api/orders", data),
    update: (id: number, data: Partial<Pick<import("@/types").OrderItem, "orderStatus" | "paymentStatus" | "trackingNumber">>) =>
      patch<import("@/types").OrderItem>(`/api/orders/${id}`, data),
    track: (data: { orderNumber: string; phone: string }) =>
      post<import("@/lib/repositories/order.repository").TrackOrderResult>("/api/orders/track", data),
  },
  categories: {
    getAll: () => get<import("@/types").CategoryItem[]>("/api/categories"),
    create: (data: CreateCategoryInput) => post<import("@/types").CategoryItem>("/api/categories", data),
    update: (id: number, data: UpdateCategoryInput) => put<import("@/types").CategoryItem>(`/api/categories/${id}`, data),
    delete: (id: number) => del<{ success: boolean }>(`/api/categories/${id}`),
  },
  coupons: {
    create: (data: CreateCouponInput) => post<import("@/types").CouponItem>("/api/coupons", data),
    update: (id: number, data: UpdateCouponInput) => put<import("@/types").CouponItem>(`/api/coupons/${id}`, data),
    delete: (id: number) => del<{ success: boolean }>(`/api/coupons/${id}`),
    validate: (data: { code: string; subtotal: number }) =>
      post<{ valid: boolean; discount: number; message: string }>("/api/coupons/validate", data),
  },
  settings: {
    get: () => get<import("@/types").StoreSettingsItem>("/api/settings"),
    update: (data: UpdateSettingsInput) => put<import("@/types").StoreSettingsItem>("/api/settings", data),
  },
  stats: {
    get: () => get<import("@/lib/services/analytics.service").DashboardStats>("/api/admin/stats"),
  },
} as const;
