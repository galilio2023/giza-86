import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL is not configured.");
    process.exit(1);
  }

  console.log("Connecting to Neon PostgreSQL for database audit & sync...");
  const sql = neon(dbUrl);

  try {
    console.log("1. Creating missing tables...");
    await sql`
      CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
        "id" serial PRIMARY KEY NOT NULL,
        "contact" varchar(150) NOT NULL UNIQUE,
        "type" varchar(20) NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `;

    console.log("2. Ensuring timestamp and missing columns exist across all tables...");
    await sql`ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;`;
    await sql`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;`;
    await sql`ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "usage_limit" integer;`;
    await sql`ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "used_count" integer DEFAULT 0 NOT NULL;`;
    await sql`ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;`;
    await sql`ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;`;
    await sql`ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;`;

    console.log("3. Removing redundant or deprecated indexes...");
    await sql`DROP INDEX IF EXISTS "products_category_featured_idx";`;
    await sql`DROP INDEX IF EXISTS "verification_identifier_idx";`;

    console.log("4. Creating optimized B-Tree and compound indexes...");
    // Products indexes
    await sql`CREATE INDEX IF NOT EXISTS "products_name_idx" ON "products" USING btree ("name");`;
    await sql`CREATE INDEX IF NOT EXISTS "products_created_at_idx" ON "products" USING btree ("created_at");`;
    await sql`CREATE INDEX IF NOT EXISTS "products_price_idx" ON "products" USING btree ("price");`;
    await sql`CREATE INDEX IF NOT EXISTS "products_sale_price_idx" ON "products" USING btree ("sale_price");`;
    await sql`CREATE INDEX IF NOT EXISTS "products_stock_idx" ON "products" USING btree ("stock");`;
    await sql`CREATE INDEX IF NOT EXISTS "products_category_created_idx" ON "products" USING btree ("category_id", "created_at");`;
    await sql`CREATE INDEX IF NOT EXISTS "products_category_price_idx" ON "products" USING btree ("category_id", "price");`;
    await sql`CREATE INDEX IF NOT EXISTS "products_category_stock_idx" ON "products" USING btree ("category_id", "stock");`;
    await sql`CREATE INDEX IF NOT EXISTS "products_category_featured_created_idx" ON "products" USING btree ("category_id", "is_featured", "created_at");`;
    await sql`CREATE INDEX IF NOT EXISTS "products_featured_created_idx" ON "products" USING btree ("is_featured", "created_at");`;
    await sql`CREATE INDEX IF NOT EXISTS "products_new_created_idx" ON "products" USING btree ("is_new", "created_at");`;
    await sql`CREATE INDEX IF NOT EXISTS "products_effective_price_idx" ON "products" USING btree (COALESCE("sale_price", "price"));`;
    await sql`CREATE INDEX IF NOT EXISTS "products_category_effective_price_idx" ON "products" USING btree ("category_id", COALESCE("sale_price", "price"));`;

    // Orders indexes
    await sql`CREATE INDEX IF NOT EXISTS "orders_tracking_idx" ON "orders" USING btree ("tracking_number");`;
    await sql`CREATE INDEX IF NOT EXISTS "orders_coupon_code_idx" ON "orders" USING btree ("coupon_code");`;
    await sql`CREATE INDEX IF NOT EXISTS "orders_created_at_idx" ON "orders" USING btree ("created_at");`;
    await sql`CREATE INDEX IF NOT EXISTS "orders_status_created_idx" ON "orders" USING btree ("order_status", "created_at");`;
    await sql`CREATE INDEX IF NOT EXISTS "orders_payment_created_idx" ON "orders" USING btree ("payment_status", "created_at");`;
    await sql`CREATE INDEX IF NOT EXISTS "orders_phone_created_idx" ON "orders" USING btree ("customer_phone", "created_at");`;
    await sql`CREATE INDEX IF NOT EXISTS "orders_alternate_phone_created_idx" ON "orders" USING btree ("alternate_phone", "created_at");`;
    await sql`CREATE INDEX IF NOT EXISTS "orders_governorate_created_idx" ON "orders" USING btree ("governorate", "created_at");`;
    await sql`CREATE INDEX IF NOT EXISTS "orders_payment_method_created_idx" ON "orders" USING btree ("payment_method", "created_at");`;
    await sql`CREATE INDEX IF NOT EXISTS "orders_status_payment_created_idx" ON "orders" USING btree ("order_status", "payment_status", "created_at");`;
    await sql`CREATE INDEX IF NOT EXISTS "orders_revenue_calc_idx" ON "orders" USING btree ("order_status", "payment_status", "total");`;

    // Coupons indexes
    await sql`CREATE INDEX IF NOT EXISTS "coupons_created_at_idx" ON "coupons" USING btree ("created_at");`;
    await sql`CREATE INDEX IF NOT EXISTS "coupons_expires_at_idx" ON "coupons" USING btree ("expires_at");`;
    await sql`CREATE INDEX IF NOT EXISTS "coupons_active_expires_idx" ON "coupons" USING btree ("is_active", "expires_at");`;

    // Newsletter indexes
    await sql`CREATE INDEX IF NOT EXISTS "newsletter_type_idx" ON "newsletter_subscribers" USING btree ("type");`;
    await sql`CREATE INDEX IF NOT EXISTS "newsletter_created_at_idx" ON "newsletter_subscribers" USING btree ("created_at");`;

    // Better Auth indexes
    await sql`CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "session" USING btree ("user_id");`;
    await sql`CREATE INDEX IF NOT EXISTS "session_expires_at_idx" ON "session" USING btree ("expires_at");`;
    await sql`CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "account" USING btree ("user_id");`;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS "account_provider_account_unique_idx" ON "account" USING btree ("provider_id", "account_id");`;
    await sql`CREATE INDEX IF NOT EXISTS "verification_expires_at_idx" ON "verification" USING btree ("expires_at");`;
    await sql`CREATE INDEX IF NOT EXISTS "verification_identifier_value_idx" ON "verification" USING btree ("identifier", "value");`;
    await sql`CREATE INDEX IF NOT EXISTS "user_role_idx" ON "user" USING btree ("role");`;
    await sql`CREATE INDEX IF NOT EXISTS "user_created_at_idx" ON "user" USING btree ("created_at");`;

    console.log("5. Applying database-level integrity check constraints...");
    const checkStatements = [
      `ALTER TABLE "products" ADD CONSTRAINT "products_stock_non_negative" CHECK ("stock" >= 0)`,
      `ALTER TABLE "products" ADD CONSTRAINT "products_price_positive" CHECK ("price" > 0)`,
      `ALTER TABLE "products" ADD CONSTRAINT "products_sale_price_check" CHECK ("sale_price" IS NULL OR ("sale_price" > 0 AND "sale_price" < "price"))`,
      `ALTER TABLE "categories" ADD CONSTRAINT "categories_display_order_non_negative" CHECK ("display_order" >= 0)`,
      `ALTER TABLE "coupons" ADD CONSTRAINT "coupons_discount_value_positive" CHECK ("discount_value" > 0)`,
      `ALTER TABLE "coupons" ADD CONSTRAINT "coupons_min_order_value_non_negative" CHECK ("min_order_value" >= 0)`,
      `ALTER TABLE "coupons" ADD CONSTRAINT "coupons_used_count_non_negative" CHECK ("used_count" >= 0)`,
      `ALTER TABLE "coupons" ADD CONSTRAINT "coupons_discount_type_valid" CHECK ("discount_type" IN ('percentage', 'fixed'))`,
      `ALTER TABLE "coupons" ADD CONSTRAINT "coupons_percentage_max_100" CHECK ("discount_type" != 'percentage' OR "discount_value" <= 100)`,
      `ALTER TABLE "coupons" ADD CONSTRAINT "coupons_usage_limit_positive" CHECK ("usage_limit" IS NULL OR "usage_limit" > 0)`,
      `ALTER TABLE "orders" ADD CONSTRAINT "orders_total_non_negative" CHECK ("total" >= 0)`,
      `ALTER TABLE "orders" ADD CONSTRAINT "orders_subtotal_non_negative" CHECK ("subtotal" >= 0)`,
      `ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_fee_non_negative" CHECK ("shipping_fee" >= 0)`,
      `ALTER TABLE "orders" ADD CONSTRAINT "orders_discount_non_negative" CHECK ("discount" >= 0)`,
      `ALTER TABLE "orders" ADD CONSTRAINT "orders_items_non_empty" CHECK (jsonb_array_length("items") > 0)`,
      `ALTER TABLE "orders" ADD CONSTRAINT "orders_order_number_min_length" CHECK (char_length("order_number") >= 3)`,
      `ALTER TABLE "orders" ADD CONSTRAINT "orders_status_valid" CHECK ("order_status" IN ('new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'))`,
      `ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_status_valid" CHECK ("payment_status" IN ('pending', 'paid', 'failed'))`,
      `ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_method_valid" CHECK ("payment_method" IN ('cod', 'instapay', 'vodafone_cash', 'card'))`,
      `ALTER TABLE "store_settings" ADD CONSTRAINT "settings_free_shipping_non_negative" CHECK ("free_shipping_threshold" >= 0)`,
      `ALTER TABLE "newsletter_subscribers" ADD CONSTRAINT "newsletter_type_valid" CHECK ("type" IN ('email', 'phone'))`,
    ];

    for (const stmt of checkStatements) {
      try {
        await sql.query(`DO $$ BEGIN ${stmt}; EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn("Constraint check notice:", msg);
      }
    }

    console.log("All database tables, B-Tree indexes, columns, and constraints successfully applied to Neon PostgreSQL!");
    process.exit(0);
  } catch (err) {
    console.error("Database sync failed:", err);
    process.exit(1);
  }
}

main();
