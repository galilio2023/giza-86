export interface ProductColor {
  name: string;
  hex: string;
  imageUrl?: string;
}

export interface ProductVariantItem {
  id?: number;
  productId?: number;
  size: string;
  colorName: string;
  colorHex: string;
  sku?: string;
  stock: number;
  price?: number | null;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  fabricDetails?: string;
  price: number;
  salePrice?: number;
  stock: number;
  categoryId: number;
  categoryName?: string;
  categorySlug?: string;
  sizes: string[];
  colors: ProductColor[];
  variants?: ProductVariantItem[];
  images: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  sku?: string;
  hasSizeGuide?: boolean;
  badgeText?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  image: string;
  description?: string;
  displayOrder?: number;
  parentId?: number | null;
  parentName?: string | null;
  children?: CategoryItem[];
  productsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string; // unique key combining productId, size, color
  productId: number;
  slug?: string;
  variantId?: number;
  name: string;
  price: number;
  salePrice?: number;
  selectedSize: string;
  selectedColor: ProductColor;
  image: string;
  quantity: number;
}

export interface OrderItem {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  alternatePhone?: string;
  governorate: string;
  city: string;
  address: string;
  notes?: string;
  paymentMethod: "cod" | "instapay" | "vodafone_cash" | "card";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "new" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
  items: {
    id?: number;
    orderId?: number;
    productId: number;
    variantId?: number;
    name: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  trackingNumber?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CouponItem {
  id: number;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  usageLimit?: number;
  usedCount?: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsletterSubscriberItem {
  id: number;
  contact: string;
  type: "email" | "phone";
  createdAt: string;
}

export interface StoreSettingsItem {
  storeName: string;
  phone: string;
  whatsapp: string;
  supportEmail?: string;
  instapayHandle: string;
  instapayPhone: string;
  vodafoneCashPhone: string;
  freeShippingThreshold: number;
  bannerNotice: string;
  isBannerActive: boolean;
  isAcceptingOrders: boolean;
  isMaintenanceMode: boolean;
  estimatedDeliveryDays: string;
  enabledPaymentMethods: ("cod" | "instapay" | "vodafone_cash" | "card")[];
  orderClosedMessage?: string;
  maintenanceMessage?: string;
  governoratesShipping?: Record<string, number>;
  // Branding & Assets
  logoUrl?: string;
  storeTagline?: string;
  storeDescription?: string;
  // Location & Social
  physicalAddress?: string;
  landlinePhone?: string;
  secondaryPhone?: string;
  supportWhatsapp?: string;
  workingHours?: string;
  googleMapsUrl?: string;
  telegramUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  // Hero CMS
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroBgImage?: string;
  heroPrimaryBtnText?: string;
  heroPrimaryBtnLink?: string;
  // Special Promo Banner
  isPromoBannerActive?: boolean;
  promoBadge?: string;
  promoTitle?: string;
  promoDescription?: string;
  promoCouponCode?: string;
  // SEO Defaults
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt?: string;
  updatedAt?: string;
}
