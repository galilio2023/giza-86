import { z } from "zod";

export const updateSettingsSchema = z.object({
  storeName: z.string().trim().min(1).max(150).optional(),
  phone: z.string().trim().max(20).optional().nullable(),
  whatsapp: z.string().trim().max(20).optional().nullable(),
  supportEmail: z.string().email().max(100).optional().or(z.literal("")).nullable(),
  instapayHandle: z.string().trim().max(100).optional().nullable(),
  instapayPhone: z.string().trim().max(20).optional().nullable(),
  vodafoneCashPhone: z.string().trim().max(20).optional().nullable(),
  freeShippingThreshold: z.number().min(0).max(10_000_000).optional(),
  bannerNotice: z.string().trim().max(500).optional().nullable(),
  isBannerActive: z.boolean().optional(),
  isAcceptingOrders: z.boolean().optional(),
  isMaintenanceMode: z.boolean().optional(),
  estimatedDeliveryDays: z.string().trim().max(100).optional().nullable(),
  enabledPaymentMethods: z.array(z.enum(["cod", "instapay", "vodafone_cash", "card"])).optional(),
  orderClosedMessage: z.string().trim().max(500).optional().nullable(),
  maintenanceMessage: z.string().trim().max(500).optional().nullable(),
  governoratesShipping: z.record(z.string().max(50), z.number().min(0).max(10_000)).optional().nullable(),
  // Branding & Assets
  logoUrl: z.string().trim().max(1000).optional().nullable(),
  storeTagline: z.string().trim().max(300).optional().nullable(),
  storeDescription: z.string().trim().max(1000).optional().nullable(),
  // Location & Social
  physicalAddress: z.string().trim().max(300).optional().nullable(),
  landlinePhone: z.string().trim().max(30).optional().nullable(),
  secondaryPhone: z.string().trim().max(30).optional().nullable(),
  supportWhatsapp: z.string().trim().max(30).optional().nullable(),
  workingHours: z.string().trim().max(150).optional().nullable(),
  googleMapsUrl: z.string().trim().max(1000).optional().nullable(),
  telegramUrl: z.string().trim().max(500).optional().nullable(),
  facebookUrl: z.string().trim().max(500).optional().nullable(),
  instagramUrl: z.string().trim().max(500).optional().nullable(),
  tiktokUrl: z.string().trim().max(500).optional().nullable(),
  // Hero CMS
  heroBadge: z.string().trim().max(150).optional().nullable(),
  heroTitle: z.string().trim().max(200).optional().nullable(),
  heroSubtitle: z.string().trim().max(1000).optional().nullable(),
  heroBgImage: z.string().trim().max(1000).optional().nullable(),
  heroPrimaryBtnText: z.string().trim().max(100).optional().nullable(),
  heroPrimaryBtnLink: z.string().trim().max(500).optional().nullable(),
  // Special Promo Banner
  isPromoBannerActive: z.boolean().optional(),
  promoBadge: z.string().trim().max(150).optional().nullable(),
  promoTitle: z.string().trim().max(200).optional().nullable(),
  promoDescription: z.string().trim().max(1000).optional().nullable(),
  promoCouponCode: z.string().trim().max(100).optional().nullable(),
  // SEO Defaults
  seoTitle: z.string().trim().max(200).optional().nullable(),
  seoDescription: z.string().trim().max(500).optional().nullable(),
  seoKeywords: z.string().trim().max(500).optional().nullable(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
