import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";

async function main() {
  const args = process.argv.slice(2);
  const nameArg = args.find((a) => a.startsWith("--name="))?.split("=")[1];
  const emailArg = args.find((a) => a.startsWith("--email="))?.split("=")[1];
  const passwordArg = args.find((a) => a.startsWith("--password="))?.split("=")[1];

  const name = nameArg || "مدير متجر MODANIL";
  const email = emailArg || process.env.ADMIN_EMAIL || "admin@modanil.com";
  const password = passwordArg || process.env.ADMIN_PASSWORD || "ModanilAdmin2026!";

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL environment variable is missing in .env.local");
    process.exit(1);
  }

  console.log("Connecting to PostgreSQL to provision admin account...");
  const sql = neon(dbUrl);
  const db = drizzle(sql, { schema });

  try {
    const cleanEmail = email.trim().toLowerCase();
    const existing = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, cleanEmail))
      .limit(1);

    if (existing.length > 0) {
      console.log("User already exists. Ensuring admin role...");
      await db
        .update(schema.user)
        .set({ role: "admin", name })
        .where(eq(schema.user.email, cleanEmail));
      console.log("User " + cleanEmail + " role confirmed as admin.");
    } else {
      console.log("Creating new admin user account in database...");
      const { hashPassword } = await import("better-auth/crypto");
      const adminId = `admin-${Date.now().toString(36)}`;
      
      await db.insert(schema.user).values({
        id: adminId,
        name,
        email: cleanEmail,
        emailVerified: true,
        role: "admin",
      });

      const hashedPassword = await hashPassword(password);
      await db.insert(schema.account).values({
        id: `account-${Date.now().toString(36)}`,
        accountId: adminId,
        providerId: "credential",
        userId: adminId,
        password: hashedPassword,
      });

      console.log("Successfully created and elevated admin account: " + cleanEmail);
    }

    console.log("Admin account provisioned successfully!");
    console.log("Email: " + cleanEmail);
    console.log("Role: admin");
    process.exit(0);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Failed to create admin:", msg);
    process.exit(1);
  }
}

main();
