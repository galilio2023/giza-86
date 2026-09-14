CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer,
	"variant_id" integer,
	"name" varchar(255) NOT NULL,
	"size" varchar(50) NOT NULL,
	"color" varchar(100) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "order_items_qty_positive" CHECK ("order_items"."quantity" > 0),
	CONSTRAINT "order_items_price_non_negative" CHECK ("order_items"."price" >= 0)
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"size" varchar(50) NOT NULL,
	"color_name" varchar(100) NOT NULL,
	"color_hex" varchar(20) DEFAULT '#000000' NOT NULL,
	"sku" varchar(100) NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"price" numeric(10, 2),
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_variants_sku_unique" UNIQUE("sku"),
	CONSTRAINT "variants_stock_non_negative" CHECK ("product_variants"."stock" >= 0)
);
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_sku_unique";--> statement-breakpoint
DROP INDEX "products_category_featured_idx";--> statement-breakpoint
DROP INDEX "verification_identifier_idx";--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "has_size_guide" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "badge_text" varchar(50);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "logo_url" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "store_tagline" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "store_description" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "physical_address" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "landline_phone" varchar(30);--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "secondary_phone" varchar(30);--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "support_whatsapp" varchar(30);--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "working_hours" varchar(150);--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "google_maps_url" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "telegram_url" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "facebook_url" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "instagram_url" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "tiktok_url" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "hero_badge" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "hero_title" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "hero_subtitle" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "hero_bg_image" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "hero_primary_btn_text" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "hero_primary_btn_link" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "is_promo_banner_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "promo_badge" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "promo_title" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "promo_description" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "promo_coupon_code" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "seo_title" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "seo_description" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "seo_keywords" text;--> statement-breakpoint
ALTER TABLE "store_settings" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "order_items_order_id_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_items_product_id_idx" ON "order_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "order_items_variant_id_idx" ON "order_items" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "variants_product_id_idx" ON "product_variants" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "variants_sku_idx" ON "product_variants" USING btree ("sku");--> statement-breakpoint
CREATE UNIQUE INDEX "variants_product_size_color_idx" ON "product_variants" USING btree ("product_id","size","color_name");--> statement-breakpoint
CREATE INDEX "orders_revenue_calc_idx" ON "orders" USING btree ("order_status","payment_status","total");--> statement-breakpoint
CREATE INDEX "products_name_idx" ON "products" USING btree ("name");--> statement-breakpoint
CREATE INDEX "products_effective_price_idx" ON "products" USING btree (COALESCE("sale_price", "price"));--> statement-breakpoint
CREATE INDEX "products_category_effective_price_idx" ON "products" USING btree ("category_id",COALESCE("sale_price", "price"));--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_display_order_non_negative" CHECK ("categories"."display_order" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_items_non_empty" CHECK (jsonb_array_length("orders"."items") > 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_order_number_min_length" CHECK (char_length("orders"."order_number") >= 3);--> statement-breakpoint
ALTER TABLE "store_settings" ADD CONSTRAINT "settings_free_shipping_non_negative" CHECK ("store_settings"."free_shipping_threshold" >= 0);