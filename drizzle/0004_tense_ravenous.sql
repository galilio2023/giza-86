DROP INDEX "account_provider_account_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "account_provider_account_unique_idx" ON "account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "orders_alternate_phone_created_idx" ON "orders" USING btree ("alternate_phone","created_at");--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_discount_type_valid" CHECK ("coupons"."discount_type" IN ('percentage', 'fixed'));--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_percentage_max_100" CHECK ("coupons"."discount_type" != 'percentage' OR "coupons"."discount_value" <= 100);--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_usage_limit_positive" CHECK ("coupons"."usage_limit" IS NULL OR "coupons"."usage_limit" > 0);--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ADD CONSTRAINT "newsletter_type_valid" CHECK ("newsletter_subscribers"."type" IN ('email', 'phone'));--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_status_valid" CHECK ("orders"."order_status" IN ('new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'));--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_status_valid" CHECK ("orders"."payment_status" IN ('pending', 'paid', 'failed'));--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_method_valid" CHECK ("orders"."payment_method" IN ('cod', 'instapay', 'vodafone_cash', 'card'));