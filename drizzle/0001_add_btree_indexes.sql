CREATE INDEX IF NOT EXISTS "products_sku_idx" ON "products" USING btree ("sku");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_stock_idx" ON "products" USING btree ("stock");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_new_created_idx" ON "products" USING btree ("is_new","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_payment_method_idx" ON "orders" USING btree ("payment_method");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_governorate_idx" ON "orders" USING btree ("governorate");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_phone_created_idx" ON "orders" USING btree ("customer_phone","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "coupons_expires_at_idx" ON "coupons" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "newsletter_type_idx" ON "newsletter_subscribers" USING btree ("type");
