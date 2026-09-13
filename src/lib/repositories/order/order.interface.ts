import { OrderItem } from "@/types";

export interface GetOrdersOptions {
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  governorate?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface OrdersPageResult {
  orders: OrderItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface TrackOrderResult {
  orderNumber: string;
  orderStatus: OrderItem["orderStatus"];
  paymentStatus: OrderItem["paymentStatus"];
  paymentMethod: OrderItem["paymentMethod"];
  customerName: string;
  governorate: string;
  city: string;
  address: string;
  trackingNumber?: string;
  items: OrderItem["items"];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  createdAt: string;
}

export interface CreateOrderInput {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  alternatePhone?: string | null;
  governorate: string;
  city: string;
  address: string;
  notes?: string | null;
  paymentMethod: OrderItem["paymentMethod"];
  paymentStatus?: OrderItem["paymentStatus"];
  orderStatus?: OrderItem["orderStatus"];
  items: {
    productId: number;
    variantId?: number | null;
    name: string;
    size: string;
    color: string;
    price?: number;
    quantity: number;
    image?: string | null;
  }[];
  couponCode?: string | null;
}

export interface PersistOrderInput {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  alternatePhone?: string | null;
  governorate: string;
  city: string;
  address: string;
  notes?: string | null;
  paymentMethod: OrderItem["paymentMethod"];
  paymentStatus?: OrderItem["paymentStatus"];
  orderStatus?: OrderItem["orderStatus"];
  items: OrderItem["items"];
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string | null;
  total: number;
  variantDeductions: { variantId: number; quantity: number }[];
  productDeductions: { productId: number; quantity: number }[];
}

export interface UpdateOrderStatusInput {
  orderStatus?: OrderItem["orderStatus"];
  paymentStatus?: OrderItem["paymentStatus"];
  trackingNumber?: string;
}

export interface IOrderRepository {
  findMany(options?: GetOrdersOptions): Promise<OrderItem[]>;
  findWithCount(options?: GetOrdersOptions): Promise<OrdersPageResult>;
  findById(orderNumberOrId: string | number, allowNumericId?: boolean): Promise<OrderItem | null>;
  getStatusCounts(): Promise<Record<string, number>>;
  track(orderNumber: string, phone: string): Promise<TrackOrderResult | null>;
  create(data: PersistOrderInput): Promise<OrderItem>;
  updateStatus(idOrOrderNumber: number | string, input: UpdateOrderStatusInput): Promise<OrderItem | null>;
}
