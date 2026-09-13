import { StoreSettingsItem } from "@/types";
import { INITIAL_SETTINGS } from "@/db/seed-data";
import { isDatabaseConfigured, db } from "@/db";
import { storeSettings } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { STORE_DEFAULTS } from "@/lib/egypt-constants";
import { memorySettings } from "./memory-store";

export interface ISettingsRepository {
  get(): Promise<StoreSettingsItem>;
  update(data: Partial<StoreSettingsItem>): Promise<StoreSettingsItem>;
}

export class MemorySettingsRepository implements ISettingsRepository {
  async get(): Promise<StoreSettingsItem> {
    return { ...memorySettings };
  }

  async update(data: Partial<StoreSettingsItem>): Promise<StoreSettingsItem> {
    Object.assign(memorySettings, data);
    return { ...memorySettings };
  }
}

export class DrizzleSettingsRepository implements ISettingsRepository {
  async get(): Promise<StoreSettingsItem> {
    const rows = await db.select().from(storeSettings).orderBy(asc(storeSettings.id)).limit(1);

    if (rows.length === 0) {
      const [inserted] = await db
        .insert(storeSettings)
        .values({
          storeName: INITIAL_SETTINGS.storeName,
          phone: INITIAL_SETTINGS.phone,
          whatsapp: INITIAL_SETTINGS.whatsapp,
          supportEmail: INITIAL_SETTINGS.supportEmail,
          instapayHandle: INITIAL_SETTINGS.instapayHandle,
          instapayPhone: INITIAL_SETTINGS.instapayPhone,
          vodafoneCashPhone: INITIAL_SETTINGS.vodafoneCashPhone,
          freeShippingThreshold: String(INITIAL_SETTINGS.freeShippingThreshold),
          bannerNotice: INITIAL_SETTINGS.bannerNotice,
          isBannerActive: INITIAL_SETTINGS.isBannerActive,
          isAcceptingOrders: INITIAL_SETTINGS.isAcceptingOrders,
          isMaintenanceMode: INITIAL_SETTINGS.isMaintenanceMode,
          estimatedDeliveryDays: INITIAL_SETTINGS.estimatedDeliveryDays,
          enabledPaymentMethods: INITIAL_SETTINGS.enabledPaymentMethods,
          orderClosedMessage: INITIAL_SETTINGS.orderClosedMessage,
          maintenanceMessage: INITIAL_SETTINGS.maintenanceMessage,
          governoratesShipping: INITIAL_SETTINGS.governoratesShipping,
          logoUrl: INITIAL_SETTINGS.logoUrl,
          storeTagline: INITIAL_SETTINGS.storeTagline,
          storeDescription: INITIAL_SETTINGS.storeDescription,
          physicalAddress: INITIAL_SETTINGS.physicalAddress,
          facebookUrl: INITIAL_SETTINGS.facebookUrl,
          instagramUrl: INITIAL_SETTINGS.instagramUrl,
          tiktokUrl: INITIAL_SETTINGS.tiktokUrl,
          heroBadge: INITIAL_SETTINGS.heroBadge,
          heroTitle: INITIAL_SETTINGS.heroTitle,
          heroSubtitle: INITIAL_SETTINGS.heroSubtitle,
          heroBgImage: INITIAL_SETTINGS.heroBgImage,
          heroPrimaryBtnText: INITIAL_SETTINGS.heroPrimaryBtnText,
          heroPrimaryBtnLink: INITIAL_SETTINGS.heroPrimaryBtnLink,
          isPromoBannerActive: INITIAL_SETTINGS.isPromoBannerActive,
          promoBadge: INITIAL_SETTINGS.promoBadge,
          promoTitle: INITIAL_SETTINGS.promoTitle,
          promoDescription: INITIAL_SETTINGS.promoDescription,
          promoCouponCode: INITIAL_SETTINGS.promoCouponCode,
          seoTitle: INITIAL_SETTINGS.seoTitle,
          seoDescription: INITIAL_SETTINGS.seoDescription,
          seoKeywords: INITIAL_SETTINGS.seoKeywords,
        })
        .returning();

      return this.mapRowToItem(inserted);
    }

    return this.mapRowToItem(rows[0]);
  }

  async update(newSettings: Partial<StoreSettingsItem>): Promise<StoreSettingsItem> {
    const existing = await db.select({ id: storeSettings.id }).from(storeSettings).orderBy(asc(storeSettings.id)).limit(1);

    const updatePayload: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (newSettings.storeName !== undefined) updatePayload.storeName = newSettings.storeName;
    if (newSettings.phone !== undefined) updatePayload.phone = newSettings.phone;
    if (newSettings.whatsapp !== undefined) updatePayload.whatsapp = newSettings.whatsapp;
    if (newSettings.supportEmail !== undefined) updatePayload.supportEmail = newSettings.supportEmail;
    if (newSettings.instapayHandle !== undefined) updatePayload.instapayHandle = newSettings.instapayHandle;
    if (newSettings.instapayPhone !== undefined) updatePayload.instapayPhone = newSettings.instapayPhone;
    if (newSettings.vodafoneCashPhone !== undefined) updatePayload.vodafoneCashPhone = newSettings.vodafoneCashPhone;
    if (newSettings.freeShippingThreshold !== undefined) updatePayload.freeShippingThreshold = String(newSettings.freeShippingThreshold);
    if (newSettings.bannerNotice !== undefined) updatePayload.bannerNotice = newSettings.bannerNotice;
    if (newSettings.isBannerActive !== undefined) updatePayload.isBannerActive = newSettings.isBannerActive;
    if (newSettings.isAcceptingOrders !== undefined) updatePayload.isAcceptingOrders = newSettings.isAcceptingOrders;
    if (newSettings.isMaintenanceMode !== undefined) updatePayload.isMaintenanceMode = newSettings.isMaintenanceMode;
    if (newSettings.estimatedDeliveryDays !== undefined) updatePayload.estimatedDeliveryDays = newSettings.estimatedDeliveryDays;
    if (newSettings.enabledPaymentMethods !== undefined) updatePayload.enabledPaymentMethods = newSettings.enabledPaymentMethods;
    if (newSettings.orderClosedMessage !== undefined) updatePayload.orderClosedMessage = newSettings.orderClosedMessage;
    if (newSettings.maintenanceMessage !== undefined) updatePayload.maintenanceMessage = newSettings.maintenanceMessage;
    if (newSettings.governoratesShipping !== undefined) updatePayload.governoratesShipping = newSettings.governoratesShipping;
    if (newSettings.logoUrl !== undefined) updatePayload.logoUrl = newSettings.logoUrl;
    if (newSettings.storeTagline !== undefined) updatePayload.storeTagline = newSettings.storeTagline;
    if (newSettings.storeDescription !== undefined) updatePayload.storeDescription = newSettings.storeDescription;
    if (newSettings.physicalAddress !== undefined) updatePayload.physicalAddress = newSettings.physicalAddress;
    if (newSettings.facebookUrl !== undefined) updatePayload.facebookUrl = newSettings.facebookUrl;
    if (newSettings.instagramUrl !== undefined) updatePayload.instagramUrl = newSettings.instagramUrl;
    if (newSettings.tiktokUrl !== undefined) updatePayload.tiktokUrl = newSettings.tiktokUrl;
    if (newSettings.heroBadge !== undefined) updatePayload.heroBadge = newSettings.heroBadge;
    if (newSettings.heroTitle !== undefined) updatePayload.heroTitle = newSettings.heroTitle;
    if (newSettings.heroSubtitle !== undefined) updatePayload.heroSubtitle = newSettings.heroSubtitle;
    if (newSettings.heroBgImage !== undefined) updatePayload.heroBgImage = newSettings.heroBgImage;
    if (newSettings.heroPrimaryBtnText !== undefined) updatePayload.heroPrimaryBtnText = newSettings.heroPrimaryBtnText;
    if (newSettings.heroPrimaryBtnLink !== undefined) updatePayload.heroPrimaryBtnLink = newSettings.heroPrimaryBtnLink;
    if (newSettings.isPromoBannerActive !== undefined) updatePayload.isPromoBannerActive = newSettings.isPromoBannerActive;
    if (newSettings.promoBadge !== undefined) updatePayload.promoBadge = newSettings.promoBadge;
    if (newSettings.promoTitle !== undefined) updatePayload.promoTitle = newSettings.promoTitle;
    if (newSettings.promoDescription !== undefined) updatePayload.promoDescription = newSettings.promoDescription;
    if (newSettings.promoCouponCode !== undefined) updatePayload.promoCouponCode = newSettings.promoCouponCode;
    if (newSettings.seoTitle !== undefined) updatePayload.seoTitle = newSettings.seoTitle;
    if (newSettings.seoDescription !== undefined) updatePayload.seoDescription = newSettings.seoDescription;
    if (newSettings.seoKeywords !== undefined) updatePayload.seoKeywords = newSettings.seoKeywords;

    if (existing.length === 0) {
      const [inserted] = await db
        .insert(storeSettings)
        .values({
          storeName: newSettings.storeName || INITIAL_SETTINGS.storeName,
          ...updatePayload,
        })
        .returning();
      return this.mapRowToItem(inserted);
    }

    const [updated] = await db
      .update(storeSettings)
      .set(updatePayload)
      .where(eq(storeSettings.id, existing[0].id))
      .returning();

    return this.mapRowToItem(updated);
  }

  private mapRowToItem(s: typeof storeSettings.$inferSelect): StoreSettingsItem {
    const effectiveStoreName = s.storeName || process.env.NEXT_PUBLIC_STORE_NAME || STORE_DEFAULTS.storeName;
    return {
      storeName: effectiveStoreName,
      phone: s.phone || STORE_DEFAULTS.phone,
      whatsapp: s.whatsapp || STORE_DEFAULTS.whatsapp,
      supportEmail: s.supportEmail || STORE_DEFAULTS.supportEmail,
      instapayHandle: s.instapayHandle || STORE_DEFAULTS.instapayHandle,
      instapayPhone: s.instapayPhone || STORE_DEFAULTS.phone,
      vodafoneCashPhone: s.vodafoneCashPhone || STORE_DEFAULTS.vodafoneCashPhone,
      freeShippingThreshold: Number(s.freeShippingThreshold || STORE_DEFAULTS.freeShippingThreshold),
      bannerNotice: s.bannerNotice || STORE_DEFAULTS.bannerNotice,
      isBannerActive: s.isBannerActive ?? true,
      isAcceptingOrders: s.isAcceptingOrders ?? true,
      isMaintenanceMode: s.isMaintenanceMode ?? false,
      estimatedDeliveryDays: s.estimatedDeliveryDays || STORE_DEFAULTS.estimatedDeliveryDays,
      enabledPaymentMethods: (s.enabledPaymentMethods as StoreSettingsItem["enabledPaymentMethods"]) || ["cod", "instapay", "vodafone_cash", "card"],
      orderClosedMessage: s.orderClosedMessage ?? undefined,
      maintenanceMessage: s.maintenanceMessage ?? undefined,
      governoratesShipping: s.governoratesShipping || undefined,
      logoUrl: s.logoUrl ?? undefined,
      storeTagline: s.storeTagline || STORE_DEFAULTS.storeTagline,
      storeDescription: s.storeDescription || STORE_DEFAULTS.storeDescription,
      physicalAddress: s.physicalAddress || STORE_DEFAULTS.physicalAddress,
      facebookUrl: s.facebookUrl || STORE_DEFAULTS.facebookUrl,
      instagramUrl: s.instagramUrl || STORE_DEFAULTS.instagramUrl,
      tiktokUrl: s.tiktokUrl || STORE_DEFAULTS.tiktokUrl,
      heroBadge: s.heroBadge || STORE_DEFAULTS.heroBadge,
      heroTitle: s.heroTitle || STORE_DEFAULTS.heroTitle,
      heroSubtitle: s.heroSubtitle || STORE_DEFAULTS.heroSubtitle,
      heroBgImage: s.heroBgImage || STORE_DEFAULTS.heroBgImage,
      heroPrimaryBtnText: s.heroPrimaryBtnText || STORE_DEFAULTS.heroPrimaryBtnText,
      heroPrimaryBtnLink: s.heroPrimaryBtnLink || STORE_DEFAULTS.heroPrimaryBtnLink,
      isPromoBannerActive: s.isPromoBannerActive ?? true,
      promoBadge: s.promoBadge || STORE_DEFAULTS.promoBadge,
      promoTitle: s.promoTitle || STORE_DEFAULTS.promoTitle,
      promoDescription: s.promoDescription || STORE_DEFAULTS.promoDescription,
      promoCouponCode: s.promoCouponCode || STORE_DEFAULTS.promoCouponCode,
      seoTitle: s.seoTitle || STORE_DEFAULTS.seoTitle,
      seoDescription: s.seoDescription || STORE_DEFAULTS.seoDescription,
      seoKeywords: s.seoKeywords || STORE_DEFAULTS.seoKeywords,
      createdAt: s.createdAt?.toISOString(),
      updatedAt: s.updatedAt?.toISOString(),
    };
  }
}

let settingsRepositoryInstance: ISettingsRepository | null = null;

export function getSettingsRepository(): ISettingsRepository {
  if (!settingsRepositoryInstance) {
    settingsRepositoryInstance =
      isDatabaseConfigured && db
        ? new DrizzleSettingsRepository()
        : new MemorySettingsRepository();
  }
  return settingsRepositoryInstance;
}
