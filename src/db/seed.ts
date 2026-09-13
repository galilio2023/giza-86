import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_COUPONS, 
  INITIAL_SETTINGS 
} from "./seed-data";
import { hashPassword } from "better-auth/crypto";

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  console.log("Connecting to Neon PostgreSQL...");
  const sql = neon(dbUrl);
  const db = drizzle(sql, { schema });

  console.log("Seeding categories...");
  for (const cat of INITIAL_CATEGORIES) {
    await db
      .insert(schema.categories)
      .values({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
        description: cat.description,
        displayOrder: cat.displayOrder,
      })
      .onConflictDoUpdate({
        target: schema.categories.id,
        set: {
          name: cat.name,
          slug: cat.slug,
          image: cat.image,
          description: cat.description,
          displayOrder: cat.displayOrder,
        },
      });
  }

  console.log("Seeding products...");
  for (const prod of INITIAL_PRODUCTS) {
    await db
      .insert(schema.products)
      .values({
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        fabricDetails: prod.fabricDetails,
        price: String(prod.price),
        salePrice: prod.salePrice ? String(prod.salePrice) : null,
        stock: prod.stock,
        categoryId: prod.categoryId,
        sizes: prod.sizes,
        colors: prod.colors,
        images: prod.images,
        isFeatured: prod.isFeatured,
        isNew: prod.isNew,
        sku: prod.sku,
      })
      .onConflictDoUpdate({
        target: schema.products.id,
        set: {
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          fabricDetails: prod.fabricDetails,
          price: String(prod.price),
          salePrice: prod.salePrice ? String(prod.salePrice) : null,
          stock: prod.stock,
          categoryId: prod.categoryId,
          sizes: prod.sizes,
          colors: prod.colors,
          images: prod.images,
          isFeatured: prod.isFeatured,
          isNew: prod.isNew,
          sku: prod.sku,
        },
      });

    if (prod.variants && prod.variants.length > 0) {
      for (const v of prod.variants) {
        await db
          .insert(schema.productVariants)
          .values({
            productId: prod.id,
            size: v.size,
            colorName: v.colorName,
            colorHex: v.colorHex,
            sku: v.sku || `${prod.sku || "SKU"}-${v.size}-${v.colorName}`.replace(/\s+/g, ""),
            stock: v.stock,
            price: v.price ? String(v.price) : null,
            imageUrl: v.imageUrl,
          })
          .onConflictDoUpdate({
            target: schema.productVariants.sku,
            set: {
              size: v.size,
              colorName: v.colorName,
              colorHex: v.colorHex,
              stock: v.stock,
              price: v.price ? String(v.price) : null,
              imageUrl: v.imageUrl,
            },
          });
      }
    }
  }

  console.log("Seeding initial orders...");
  for (const ord of INITIAL_ORDERS) {
    const [insertedOrder] = await db
      .insert(schema.orders)
      .values({
        orderNumber: ord.orderNumber,
        customerName: ord.customerName,
        customerPhone: ord.customerPhone,
        alternatePhone: ord.alternatePhone,
        governorate: ord.governorate,
        city: ord.city,
        address: ord.address,
        notes: ord.notes,
        paymentMethod: ord.paymentMethod,
        paymentStatus: ord.paymentStatus,
        orderStatus: ord.orderStatus,
        items: ord.items,
        subtotal: String(ord.subtotal),
        shippingFee: String(ord.shippingFee),
        discount: String(ord.discount),
        couponCode: ord.couponCode,
        total: String(ord.total),
        trackingNumber: ord.trackingNumber,
      })
      .onConflictDoUpdate({
        target: schema.orders.orderNumber,
        set: {
          customerName: ord.customerName,
          customerPhone: ord.customerPhone,
          alternatePhone: ord.alternatePhone,
          governorate: ord.governorate,
          city: ord.city,
          address: ord.address,
          notes: ord.notes,
          paymentMethod: ord.paymentMethod,
          paymentStatus: ord.paymentStatus,
          orderStatus: ord.orderStatus,
          items: ord.items,
          subtotal: String(ord.subtotal),
          shippingFee: String(ord.shippingFee),
          discount: String(ord.discount),
          couponCode: ord.couponCode,
          total: String(ord.total),
          trackingNumber: ord.trackingNumber,
        },
      })
      .returning({ id: schema.orders.id });

    if (insertedOrder) {
      for (const item of ord.items) {
        await db.insert(schema.orderItems).values({
          orderId: insertedOrder.id,
          productId: item.productId,
          variantId: item.variantId || null,
          name: item.name,
          size: item.size,
          color: item.color,
          price: String(item.price),
          quantity: item.quantity,
          image: item.image,
        });
      }
    }
  }

  console.log("Seeding coupons...");
  for (const coup of INITIAL_COUPONS) {
    await db
      .insert(schema.coupons)
      .values({
        code: coup.code,
        discountType: coup.discountType,
        discountValue: String(coup.discountValue),
        minOrderValue: String(coup.minOrderValue),
        usageLimit: coup.usageLimit ?? null,
        usedCount: coup.usedCount ?? 0,
        isActive: coup.isActive,
      })
      .onConflictDoUpdate({
        target: schema.coupons.code,
        set: {
          discountType: coup.discountType,
          discountValue: String(coup.discountValue),
          minOrderValue: String(coup.minOrderValue),
          usageLimit: coup.usageLimit ?? null,
          isActive: coup.isActive,
        },
      });
  }

  console.log("Seeding store settings...");
  const existingSettings = await db.select().from(schema.storeSettings).limit(1);
  if (existingSettings.length > 0) {
    await db
      .update(schema.storeSettings)
      .set({
        storeName: INITIAL_SETTINGS.storeName,
        phone: INITIAL_SETTINGS.phone,
        whatsapp: INITIAL_SETTINGS.whatsapp,
        instapayHandle: INITIAL_SETTINGS.instapayHandle,
        instapayPhone: INITIAL_SETTINGS.instapayPhone,
        vodafoneCashPhone: INITIAL_SETTINGS.vodafoneCashPhone,
        freeShippingThreshold: String(INITIAL_SETTINGS.freeShippingThreshold),
        bannerNotice: INITIAL_SETTINGS.bannerNotice,
      });
  } else {
    await db
      .insert(schema.storeSettings)
      .values({
        storeName: INITIAL_SETTINGS.storeName,
        phone: INITIAL_SETTINGS.phone,
        whatsapp: INITIAL_SETTINGS.whatsapp,
        instapayHandle: INITIAL_SETTINGS.instapayHandle,
        instapayPhone: INITIAL_SETTINGS.instapayPhone,
        vodafoneCashPhone: INITIAL_SETTINGS.vodafoneCashPhone,
        freeShippingThreshold: String(INITIAL_SETTINGS.freeShippingThreshold),
        bannerNotice: INITIAL_SETTINGS.bannerNotice,
      });
  }

  console.log("Seeding default administrator account...");
  try {
    const adminEmail = "admin@giza86.com";
    const adminPass = "Giza86Admin2026!";
    const adminId = "admin-giza86-system";

    await db
      .insert(schema.user)
      .values({
        id: adminId,
        name: "مدير المتجر",
        email: adminEmail,
        emailVerified: true,
        role: "admin",
      })
      .onConflictDoUpdate({
        target: schema.user.email,
        set: {
          role: "admin",
        },
      });

    const hashedPassword = await hashPassword(adminPass);
    await db
      .insert(schema.account)
      .values({
        id: "admin-account-system",
        accountId: adminId,
        providerId: "credential",
        userId: adminId,
        password: hashedPassword,
      })
      .onConflictDoUpdate({
        target: schema.account.id,
        set: {
          password: hashedPassword,
        },
      });
    console.log("Admin account seeded successfully (admin@giza86.com).");
  } catch (adminErr) {
    console.warn("Notice: Admin account seed warning:", adminErr);
  }

  console.log("Syncing PostgreSQL ID sequences...");
  try {
    await sql`SELECT setval('categories_id_seq', COALESCE((SELECT MAX(id) FROM categories), 1), true)`;
    await sql`SELECT setval('products_id_seq', COALESCE((SELECT MAX(id) FROM products), 1), true)`;
  } catch (seqErr) {
    console.warn("Notice: Sequence sync warning (can be normal if tables use custom sequence):", seqErr);
  }

  console.log("Database seeded and updated successfully with GIZA 86 Egyptian clothes catalog!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
