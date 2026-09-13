import { neon, Pool } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzleWs } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

export const isDatabaseConfigured = Boolean(
  connectionString &&
  !connectionString.includes("placeholder") &&
  connectionString.startsWith("postgres")
);

const globalForDb = globalThis as unknown as {
  db?: ReturnType<typeof drizzleHttp<typeof schema>>;
  dbPool?: ReturnType<typeof drizzleWs<typeof schema>>;
};

/**
 * Neon HTTP client — stateless, ideal for serverless reads and single-query operations.
 * Used by default across all Server Components and read-only Route Handlers.
 */
export const db =
  globalForDb.db ??
  (isDatabaseConfigured
    ? drizzleHttp(neon(connectionString!), { schema })
    : (null as unknown as ReturnType<typeof drizzleHttp<typeof schema>>));

/**
 * Neon WebSocket Pool client — maintains a connection pool for interactive multi-statement
 * ACID transactions with lower latency than HTTP round-trips.
 * Used for checkout order creation and status updates that require atomic stock decrements.
 */
export const dbPool =
  globalForDb.dbPool ??
  (isDatabaseConfigured
    ? drizzleWs(new Pool({ connectionString: connectionString! }), { schema })
    : (null as unknown as ReturnType<typeof drizzleWs<typeof schema>>));

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
  globalForDb.dbPool = dbPool;
}
