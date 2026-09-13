CREATE INDEX IF NOT EXISTS "products_category_price_idx" ON "products" USING btree ("category_id","price");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_category_featured_idx" ON "products" USING btree ("category_id","is_featured");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_coupon_code_idx" ON "orders" USING btree ("coupon_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_payment_created_idx" ON "orders" USING btree ("payment_status","created_at");
