DROP INDEX "coupons_is_active_idx";--> statement-breakpoint
DROP INDEX "coupons_code_active_idx";--> statement-breakpoint
DROP INDEX "newsletter_contact_idx";--> statement-breakpoint
DROP INDEX "orders_phone_idx";--> statement-breakpoint
DROP INDEX "orders_status_idx";--> statement-breakpoint
DROP INDEX "orders_payment_status_idx";--> statement-breakpoint
DROP INDEX "products_category_id_idx";--> statement-breakpoint
DROP INDEX "products_featured_idx";--> statement-breakpoint
CREATE INDEX "coupons_created_at_idx" ON "coupons" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "coupons_expires_at_idx" ON "coupons" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "coupons_active_expires_idx" ON "coupons" USING btree ("is_active","expires_at");--> statement-breakpoint
CREATE INDEX "newsletter_type_idx" ON "newsletter_subscribers" USING btree ("type");--> statement-breakpoint
CREATE INDEX "orders_coupon_code_idx" ON "orders" USING btree ("coupon_code");--> statement-breakpoint
CREATE INDEX "orders_payment_created_idx" ON "orders" USING btree ("payment_status","created_at");--> statement-breakpoint
CREATE INDEX "orders_phone_created_idx" ON "orders" USING btree ("customer_phone","created_at");--> statement-breakpoint
CREATE INDEX "orders_governorate_created_idx" ON "orders" USING btree ("governorate","created_at");--> statement-breakpoint
CREATE INDEX "orders_payment_method_created_idx" ON "orders" USING btree ("payment_method","created_at");--> statement-breakpoint
CREATE INDEX "orders_status_payment_created_idx" ON "orders" USING btree ("order_status","payment_status","created_at");--> statement-breakpoint
CREATE INDEX "products_sale_price_idx" ON "products" USING btree ("sale_price");--> statement-breakpoint
CREATE INDEX "products_stock_idx" ON "products" USING btree ("stock");--> statement-breakpoint
CREATE INDEX "products_category_price_idx" ON "products" USING btree ("category_id","price");--> statement-breakpoint
CREATE INDEX "products_category_stock_idx" ON "products" USING btree ("category_id","stock");--> statement-breakpoint
CREATE INDEX "products_category_featured_idx" ON "products" USING btree ("category_id","is_featured");--> statement-breakpoint
CREATE INDEX "products_category_featured_created_idx" ON "products" USING btree ("category_id","is_featured","created_at");--> statement-breakpoint
CREATE INDEX "products_new_created_idx" ON "products" USING btree ("is_new","created_at");--> statement-breakpoint
CREATE INDEX "verification_expires_at_idx" ON "verification" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "verification_identifier_value_idx" ON "verification" USING btree ("identifier","value");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_sku_unique" UNIQUE("sku");--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_discount_value_positive" CHECK ("coupons"."discount_value" > 0);--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_min_order_value_non_negative" CHECK ("coupons"."min_order_value" >= 0);--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_used_count_non_negative" CHECK ("coupons"."used_count" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_total_non_negative" CHECK ("orders"."total" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_subtotal_non_negative" CHECK ("orders"."subtotal" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_fee_non_negative" CHECK ("orders"."shipping_fee" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_discount_non_negative" CHECK ("orders"."discount" >= 0);--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_stock_non_negative" CHECK ("products"."stock" >= 0);--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_price_positive" CHECK ("products"."price" > 0);--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_sale_price_check" CHECK ("products"."sale_price" IS NULL OR ("products"."sale_price" > 0 AND "products"."sale_price" < "products"."price"));