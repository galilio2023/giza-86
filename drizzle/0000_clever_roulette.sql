CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"image" text NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"discount_type" varchar(20) DEFAULT 'percentage' NOT NULL,
	"discount_value" numeric(10, 2) NOT NULL,
	"min_order_value" numeric(10, 2) DEFAULT '0',
	"usage_limit" integer,
	"used_count" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"contact" varchar(150) NOT NULL,
	"type" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscribers_contact_unique" UNIQUE("contact")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" varchar(50) NOT NULL,
	"customer_name" varchar(150) NOT NULL,
	"customer_phone" varchar(20) NOT NULL,
	"alternate_phone" varchar(20),
	"governorate" varchar(50) NOT NULL,
	"city" varchar(100) NOT NULL,
	"address" text NOT NULL,
	"notes" text,
	"payment_method" varchar(50) DEFAULT 'cod' NOT NULL,
	"payment_status" varchar(50) DEFAULT 'pending' NOT NULL,
	"order_status" varchar(50) DEFAULT 'new' NOT NULL,
	"items" jsonb NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"shipping_fee" numeric(10, 2) NOT NULL,
	"discount" numeric(10, 2) DEFAULT '0',
	"coupon_code" varchar(50),
	"total" numeric(10, 2) NOT NULL,
	"tracking_number" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"fabric_details" text,
	"price" numeric(10, 2) NOT NULL,
	"sale_price" numeric(10, 2),
	"stock" integer DEFAULT 10 NOT NULL,
	"category_id" integer,
	"sizes" jsonb DEFAULT '["S","M","L","XL","2XL"]'::jsonb,
	"colors" jsonb DEFAULT '[]'::jsonb,
	"images" jsonb DEFAULT '[]'::jsonb,
	"is_featured" boolean DEFAULT false,
	"is_new" boolean DEFAULT true,
	"sku" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "store_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_name" varchar(150) NOT NULL,
	"phone" varchar(20),
	"whatsapp" varchar(20),
	"instapay_handle" varchar(100),
	"instapay_phone" varchar(20),
	"vodafone_cash_phone" varchar(20),
	"free_shipping_threshold" numeric(10, 2) DEFAULT '1200',
	"governorates_shipping" jsonb,
	"banner_notice" text,
	"is_banner_active" boolean DEFAULT true,
	"is_accepting_orders" boolean DEFAULT true,
	"is_maintenance_mode" boolean DEFAULT false,
	"support_email" varchar(100) DEFAULT 'support@giza86.com',
	"estimated_delivery_days" varchar(100) DEFAULT '1 - 3 أيام عمل لجميع المحافظات',
	"enabled_payment_methods" jsonb DEFAULT '["cod","instapay","vodafone_cash","card"]'::jsonb,
	"order_closed_message" text,
	"maintenance_message" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'user',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "account_provider_account_idx" ON "account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "categories_display_order_idx" ON "categories" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "coupons_is_active_idx" ON "coupons" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "coupons_code_active_idx" ON "coupons" USING btree ("code","is_active");--> statement-breakpoint
CREATE INDEX "newsletter_contact_idx" ON "newsletter_subscribers" USING btree ("contact");--> statement-breakpoint
CREATE INDEX "newsletter_created_at_idx" ON "newsletter_subscribers" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "orders_phone_idx" ON "orders" USING btree ("customer_phone");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("order_status");--> statement-breakpoint
CREATE INDEX "orders_payment_status_idx" ON "orders" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "orders_tracking_idx" ON "orders" USING btree ("tracking_number");--> statement-breakpoint
CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "orders_status_created_idx" ON "orders" USING btree ("order_status","created_at");--> statement-breakpoint
CREATE INDEX "products_category_id_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "products_featured_idx" ON "products" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "products_price_idx" ON "products" USING btree ("price");--> statement-breakpoint
CREATE INDEX "products_category_created_idx" ON "products" USING btree ("category_id","created_at");--> statement-breakpoint
CREATE INDEX "products_featured_created_idx" ON "products" USING btree ("is_featured","created_at");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_expires_at_idx" ON "session" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "user_role_idx" ON "user" USING btree ("role");--> statement-breakpoint
CREATE INDEX "user_created_at_idx" ON "user" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");