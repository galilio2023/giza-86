/**
 * GIZA 86 Data Service (Modularized Barrel)
 * All domain operations have been decoupled into single-responsibility domain services
 * located under src/lib/services/.
 */
export * from "./services";
export * from "./domain/pricing";
export * from "./domain/errors";
export * from "./domain/variants";
export * from "./domain/whatsapp";
export * from "./domain/orders";
