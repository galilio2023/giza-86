import { pgTable, serial, text, varchar, numeric, integer, boolean, timestamp, jsonb, index, uniqueIndex, check } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ================= BETTER AUTH TABLES =================
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("user_role_idx").on(table.role),
  index("user_created_at_idx").on(table.createdAt),
]);

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
}, (table) => [
  // B-Tree index on foreign key userId to eliminate sequential table scans
  index("session_user_id_idx").on(table.userId),
  // B-Tree index on expiresAt for session pruning queries
  index("session_expires_at_idx").on(table.expiresAt),
]);

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  // B-Tree index on foreign key userId to accelerate cascade deletions and profile joins
  index("account_user_id_idx").on(table.userId),
  // Compound unique B-Tree index on (providerId, accountId) for O(1) OAuth and credential lookups
  uniqueIndex("account_provider_account_unique_idx").on(table.providerId, table.accountId),
]);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  // B-Tree index for verification cleanup & expiration queries
  index("verification_expires_at_idx").on(table.expiresAt),
  // Compound B-Tree index for exact identifier and token verification (covers prefix queries on identifier)
  index("verification_identifier_value_idx").on(table.identifier, table.value),
]);

// ================= STORE TABLES =================
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  image: text("image").notNull(),
  description: text("description"),
  displayOrder: integer("display_order").default(0),
  parentId: integer("parent_id").references((): any => categories.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  // B-Tree index for sorting categories by display order
  index("categories_display_order_idx").on(table.displayOrder),
  // B-Tree index for parent-child relationship lookups
  index("categories_parent_id_idx").on(table.parentId),
  // Database-level integrity check constraint
  check("categories_display_order_non_negative", sql`${table.displayOrder} >= 0`),
]);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  fabricDetails: text("fabric_details"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric("sale_price", { precision: 10, scale: 2 }),
  stock: integer("stock").notNull().default(10),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  sizes: jsonb("sizes").$type<string[]>().default(["S", "M", "L", "XL", "2XL"]),
  colors: jsonb("colors").$type<{ name: string; hex: string; imageUrl?: string }[]>().default([]),
  images: jsonb("images").$type<string[]>().default([]),
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(true),
  sku: varchar("sku", { length: 50 }),
  hasSizeGuide: boolean("has_size_guide").default(true),
  badgeText: varchar("badge_text", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("products_name_idx").on(table.name),
  index("products_created_at_idx").on(table.createdAt),
  index("products_price_idx").on(table.price),
  index("products_sale_price_idx").on(table.salePrice),
  index("products_stock_idx").on(table.stock),
  // High-performance compound B-Tree indexes for store listing & filtering
  index("products_category_created_idx").on(table.categoryId, table.createdAt),
  index("products_category_price_idx").on(table.categoryId, table.price),
  index("products_category_stock_idx").on(table.categoryId, table.stock),
  // products_category_featured_created_idx covers (categoryId, isFeatured) prefix
  index("products_category_featured_created_idx").on(table.categoryId, table.isFeatured, table.createdAt),
  index("products_featured_created_idx").on(table.isFeatured, table.createdAt),
  index("products_new_created_idx").on(table.isNew, table.createdAt),
  // B-Tree expression indexes for O(log N) price ordering with COALESCE(salePrice, price)
  index("products_effective_price_idx").on(sql`COALESCE(${table.salePrice}, ${table.price})`),
  index("products_category_effective_price_idx").on(table.categoryId, sql`COALESCE(${table.salePrice}, ${table.price})`),
  // Database-level integrity check constraints
  check("products_stock_non_negative", sql`${table.stock} >= 0`),
  check("products_price_positive", sql`${table.price} > 0`),
  check("products_sale_price_check", sql`${table.salePrice} IS NULL OR (${table.salePrice} > 0 AND ${table.salePrice} < ${table.price})`),
]);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  customerName: varchar("customer_name", { length: 150 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  alternatePhone: varchar("alternate_phone", { length: 20 }),
  governorate: varchar("governorate", { length: 50 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  address: text("address").notNull(),
  notes: text("notes"),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull().default("cod"),
  paymentStatus: varchar("payment_status", { length: 50 }).notNull().default("pending"),
  orderStatus: varchar("order_status", { length: 50 }).notNull().default("new"),
  // Architectural Pattern: Denormalized immutable invoice snapshot stored as JSONB for rapid
  // single-query receipt rendering without multi-table joins.
  items: jsonb("items").$type<{
    productId: number;
    name: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image: string;
  }[]>().notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingFee: numeric("shipping_fee", { precision: 10, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 10, scale: 2 }).default("0"),
  couponCode: varchar("coupon_code", { length: 50 }),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("orders_tracking_idx").on(table.trackingNumber),
  index("orders_coupon_code_idx").on(table.couponCode),
  index("orders_created_at_idx").on(table.createdAt),
  // Optimized compound B-Tree indexes: leftmost prefix indexes cover single-column lookups
  index("orders_status_created_idx").on(table.orderStatus, table.createdAt),
  index("orders_payment_created_idx").on(table.paymentStatus, table.createdAt),
  index("orders_phone_created_idx").on(table.customerPhone, table.createdAt),
  index("orders_alternate_phone_created_idx").on(table.alternatePhone, table.createdAt),
  index("orders_governorate_created_idx").on(table.governorate, table.createdAt),
  index("orders_payment_method_created_idx").on(table.paymentMethod, table.createdAt),
  index("orders_status_payment_created_idx").on(table.orderStatus, table.paymentStatus, table.createdAt),
  // Composite B-Tree index for index-only revenue calculation in dashboard analytics
  index("orders_revenue_calc_idx").on(table.orderStatus, table.paymentStatus, table.total),
  // Database-level financial integrity check constraints
  check("orders_total_non_negative", sql`${table.total} >= 0`),
  check("orders_subtotal_non_negative", sql`${table.subtotal} >= 0`),
  check("orders_shipping_fee_non_negative", sql`${table.shippingFee} >= 0`),
  check("orders_discount_non_negative", sql`${table.discount} >= 0`),
  check("orders_items_non_empty", sql`jsonb_array_length(${table.items}) > 0`),
  check("orders_order_number_min_length", sql`char_length(${table.orderNumber}) >= 3`),
  // Database-level domain enum check constraints
  check(
    "orders_status_valid",
    sql`${table.orderStatus} IN ('new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')`
  ),
  check("orders_payment_status_valid", sql`${table.paymentStatus} IN ('pending', 'paid', 'failed')`),
  check(
    "orders_payment_method_valid",
    sql`${table.paymentMethod} IN ('cod', 'instapay', 'vodafone_cash', 'card')`
  ),
]);

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  discountType: varchar("discount_type", { length: 20 }).notNull().default("percentage"),
  discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
  minOrderValue: numeric("min_order_value", { precision: 10, scale: 2 }).default("0"),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").default(0).notNull(),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("coupons_created_at_idx").on(table.createdAt),
  index("coupons_expires_at_idx").on(table.expiresAt),
  // B-Tree range index for querying active non-expired coupons
  index("coupons_active_expires_idx").on(table.isActive, table.expiresAt),
  // Coupon integrity check constraints
  check("coupons_discount_value_positive", sql`${table.discountValue} > 0`),
  check("coupons_min_order_value_non_negative", sql`${table.minOrderValue} >= 0`),
  check("coupons_used_count_non_negative", sql`${table.usedCount} >= 0`),
  check("coupons_discount_type_valid", sql`${table.discountType} IN ('percentage', 'fixed')`),
  check(
    "coupons_percentage_max_100",
    sql`${table.discountType} != 'percentage' OR ${table.discountValue} <= 100`
  ),
  check("coupons_usage_limit_positive", sql`${table.usageLimit} IS NULL OR ${table.usageLimit} > 0`),
]);

export const storeSettings = pgTable("store_settings", {
  id: serial("id").primaryKey(),
  storeName: varchar("store_name", { length: 150 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  whatsapp: varchar("whatsapp", { length: 20 }),
  instapayHandle: varchar("instapay_handle", { length: 100 }),
  instapayPhone: varchar("instapay_phone", { length: 20 }),
  vodafoneCashPhone: varchar("vodafone_cash_phone", { length: 20 }),
  freeShippingThreshold: numeric("free_shipping_threshold", { precision: 10, scale: 2 }).default("1200"),
  governoratesShipping: jsonb("governorates_shipping").$type<Record<string, number>>(),
  bannerNotice: text("banner_notice"),
  isBannerActive: boolean("is_banner_active").default(true),
  isAcceptingOrders: boolean("is_accepting_orders").default(true),
  isMaintenanceMode: boolean("is_maintenance_mode").default(false),
  supportEmail: varchar("support_email", { length: 100 }).default("support@giza86.com"),
  estimatedDeliveryDays: varchar("estimated_delivery_days", { length: 100 }).default("1 - 3 أيام عمل لجميع المحافظات"),
  enabledPaymentMethods: jsonb("enabled_payment_methods").$type<string[]>().default(["cod", "instapay", "vodafone_cash", "card"]),
  orderClosedMessage: text("order_closed_message"),
  maintenanceMessage: text("maintenance_message"),
  // Branding & Assets
  logoUrl: text("logo_url"),
  storeTagline: text("store_tagline"),
  storeDescription: text("store_description"),
  // Location & Social
  physicalAddress: text("physical_address"),
  landlinePhone: varchar("landline_phone", { length: 30 }),
  secondaryPhone: varchar("secondary_phone", { length: 30 }),
  supportWhatsapp: varchar("support_whatsapp", { length: 30 }),
  workingHours: varchar("working_hours", { length: 150 }),
  googleMapsUrl: text("google_maps_url"),
  telegramUrl: text("telegram_url"),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  tiktokUrl: text("tiktok_url"),
  // Hero CMS
  heroBadge: text("hero_badge"),
  heroTitle: text("hero_title"),
  heroSubtitle: text("hero_subtitle"),
  heroBgImage: text("hero_bg_image"),
  heroPrimaryBtnText: text("hero_primary_btn_text"),
  heroPrimaryBtnLink: text("hero_primary_btn_link"),
  // Special Promo Banner
  isPromoBannerActive: boolean("is_promo_banner_active").default(true),
  promoBadge: text("promo_badge"),
  promoTitle: text("promo_title"),
  promoDescription: text("promo_description"),
  promoCouponCode: text("promo_coupon_code"),
  // SEO Defaults
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  seoKeywords: text("seo_keywords"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  check("settings_free_shipping_non_negative", sql`${table.freeShippingThreshold} >= 0`),
]);

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  contact: varchar("contact", { length: 150 }).notNull().unique(),
  type: varchar("type", { length: 20 }).notNull(), // 'email' | 'phone'
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("newsletter_type_idx").on(table.type),
  index("newsletter_created_at_idx").on(table.createdAt),
  check("newsletter_type_valid", sql`${table.type} IN ('email', 'phone')`),
]);

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  size: varchar("size", { length: 50 }).notNull(),
  colorName: varchar("color_name", { length: 100 }).notNull(),
  colorHex: varchar("color_hex", { length: 20 }).notNull().default("#000000"),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  stock: integer("stock").notNull().default(0),
  price: numeric("price", { precision: 10, scale: 2 }),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("variants_product_id_idx").on(table.productId),
  index("variants_sku_idx").on(table.sku),
  uniqueIndex("variants_product_size_color_idx").on(table.productId, table.size, table.colorName),
  check("variants_stock_non_negative", sql`${table.stock} >= 0`),
]);

// Architectural Pattern: Normalized relational table for cross-product sales analytics,
// foreign key constraints, and relational joins. Synchronized atomically during checkout.
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  variantId: integer("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
  name: varchar("name", { length: 255 }).notNull(),
  size: varchar("size", { length: 50 }).notNull(),
  color: varchar("color", { length: 100 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  image: text("image").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("order_items_order_id_idx").on(table.orderId),
  index("order_items_product_id_idx").on(table.productId),
  index("order_items_variant_id_idx").on(table.variantId),
  check("order_items_qty_positive", sql`${table.quantity} > 0`),
  check("order_items_price_non_negative", sql`${table.price} >= 0`),
]);

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  orderItems: many(orderItems),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  itemsRel: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItemRow = typeof orderItems.$inferSelect;
export type NewOrderItemRow = typeof orderItems.$inferInsert;
export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;
export type StoreSettings = typeof storeSettings.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

