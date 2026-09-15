import { formatWhatsAppNumber } from "@/lib/egypt-constants";

export interface ProductWhatsAppOrderParams {
  whatsappPhone?: string | null;
  productName: string;
  productSlugOrId: string | number;
  size: string;
  colorName: string;
  quantity: number;
  totalPrice: number;
  origin?: string;
}

export interface ProductWhatsAppRestockParams {
  whatsappPhone?: string | null;
  productName: string;
  productSlugOrId: string | number;
  size?: string;
  colorName?: string;
  origin?: string;
}

/**
 * Constructs a standardized, pre-filled WhatsApp click-to-chat URL for ordering a product.
 */
export function buildProductWhatsAppOrderUrl(params: ProductWhatsAppOrderParams): string {
  const targetNumber = formatWhatsAppNumber(params.whatsappPhone);
  const baseUrl = params.origin ? params.origin.replace(/\/$/, "") : "";
  const productUrl = baseUrl ? `${baseUrl}/products/${params.productSlugOrId}` : `/products/${params.productSlugOrId}`;

  const message = [
    "مرحباً، أود طلب هذا المنتج من متجركم:",
    "",
    `- المنتج: ${params.productName}`,
    `- المقاس: ${params.size}`,
    `- اللون: ${params.colorName}`,
    `- الكمية: ${params.quantity}`,
    `- الإجمالي: ${params.totalPrice} ج.م`,
    `رابط المنتج: ${productUrl}`,
  ].join("\n");

  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Constructs a pre-filled WhatsApp click-to-chat URL for customer inquiring about a restock / reserving out-of-stock item.
 */
export function buildProductWhatsAppRestockUrl(params: ProductWhatsAppRestockParams): string {
  const targetNumber = formatWhatsAppNumber(params.whatsappPhone);
  const baseUrl = params.origin ? params.origin.replace(/\/$/, "") : "";
  const productUrl = baseUrl ? `${baseUrl}/products/${params.productSlugOrId}` : `/products/${params.productSlugOrId}`;

  const lines = [
    "مرحباً فريق خدمة العملاء،",
    "أود الاستفسار عن موعد توفر الشحنة القادمة وحجز مقاسي لهذا المنتج:",
    "",
    `- المنتج: ${params.productName}`,
  ];

  if (params.size) {
    lines.push(`- المقاس المطلوب: ${params.size}`);
  }
  if (params.colorName) {
    lines.push(`- اللون المطلوب: ${params.colorName}`);
  }

  lines.push(`رابط المنتج: ${productUrl}`);
  lines.push("");
  lines.push("يرجى إبلاغي فور توفر الدفعة الجديدة بالمخزن. شكراً لكم!");

  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/**
 * Constructs a pre-filled WhatsApp click-to-chat URL for customer inquiring about their order.
 */
export function buildOrderInquiryWhatsAppUrl(
  whatsappPhone: string | undefined | null,
  storeName: string,
  orderNumber: string
): string {
  const targetNumber = formatWhatsAppNumber(whatsappPhone);
  const message = `مرحباً خدمة عملاء ${storeName}، أود متابعة طلبي رقم: ${orderNumber}`;
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Constructs a pre-filled WhatsApp click-to-chat URL for store admin / rider contacting the customer.
 */
export function buildCustomerContactWhatsAppUrl(
  customerPhone: string,
  customerName: string,
  orderNumber: string,
  storeName: string
): string {
  const targetNumber = formatWhatsAppNumber(customerPhone);
  const message = `مرحباً ${customerName}، بخصوص طلبكم رقم ${orderNumber} من متجر ${storeName}...`;
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}

