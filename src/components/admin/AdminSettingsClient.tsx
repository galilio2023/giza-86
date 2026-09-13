"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Truck, 
  Store, 
  CreditCard, 
  Power, 
  Megaphone, 
  Share2, 
  Search, 
  LayoutTemplate 
} from "lucide-react";
import { EGYPTIAN_GOVERNORATES, STORE_DEFAULTS } from "@/lib/egypt-constants";
import { getErrorMessage } from "@/lib/utils";
import { StoreSettingsItem } from "@/types";
import { toast } from "sonner";
import { uploadImageFile } from "@/lib/upload-client";
import { api } from "@/lib/api-client";

import { SettingsHeader } from "./settings/SettingsHeader";
import { SettingsSaveButton } from "./settings/SettingsSaveButton";

import { GeneralSettingsTab } from "./settings/GeneralSettingsTab";
import { HeroSettingsTab } from "./settings/HeroSettingsTab";
import { PromoSettingsTab } from "./settings/PromoSettingsTab";
import { SocialSettingsTab } from "./settings/SocialSettingsTab";
import { ShippingSettingsTab } from "./settings/ShippingSettingsTab";
import { PaymentsSettingsTab } from "./settings/PaymentsSettingsTab";
import { EmergencySettingsTab } from "./settings/EmergencySettingsTab";
import { SeoSettingsTab } from "./settings/SeoSettingsTab";

interface AdminSettingsClientProps {
  initialSettings: StoreSettingsItem;
}

interface SettingsFormData {
  // Operational Switches
  isAcceptingOrders: boolean;
  isBannerActive: boolean;
  isMaintenanceMode: boolean;
  orderClosedMessage: string;
  maintenanceMessage: string;
  enabledPaymentMethods: ("cod" | "instapay" | "vodafone_cash" | "card")[];

  // Store Info & Brand Assets
  storeName: string;
  logoUrl: string;
  storeTagline: string;
  storeDescription: string;

  // Contact & Social
  phone: string;
  whatsapp: string;
  supportEmail: string;
  physicalAddress: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;

  // Hero CMS
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBgImage: string;
  heroPrimaryBtnText: string;
  heroPrimaryBtnLink: string;

  // Special Promo Offer Banner
  isPromoBannerActive: boolean;
  promoBadge: string;
  promoTitle: string;
  promoDescription: string;
  promoCouponCode: string;

  // Payment Details
  instapayHandle: string;
  vodafoneCashPhone: string;

  // Shipping & Notice
  freeShippingThreshold: string;
  estimatedDeliveryDays: string;
  bannerNotice: string;

  // 27 Governorates Custom Shipping Rates
  governoratesRates: Record<string, number>;

  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export function AdminSettingsClient({ initialSettings }: AdminSettingsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "general" | "hero" | "promos" | "social" | "shipping" | "payments" | "emergency" | "seo"
  >("general");

  const [formData, setFormData] = useState<SettingsFormData>(() => {
    const initialRates: Record<string, number> = {};
    EGYPTIAN_GOVERNORATES.forEach((gov) => {
      initialRates[gov.name] = initialSettings.governoratesShipping?.[gov.name] ?? gov.rate;
    });

    return {
      isAcceptingOrders: initialSettings.isAcceptingOrders ?? true,
      isBannerActive: initialSettings.isBannerActive ?? true,
      isMaintenanceMode: initialSettings.isMaintenanceMode ?? false,
      orderClosedMessage:
        initialSettings.orderClosedMessage ||
        "نعتذر عن استقبال طلبات جديدة مؤقتاً بسبب الإجازة السنوية أو جرد المخزون.",
      maintenanceMessage:
        initialSettings.maintenanceMessage ||
        "المتجر قيد التحديث الموسمي حالياً. يمكنك التواصل معنا عبر واتساب للاستفسارات.",
      enabledPaymentMethods: initialSettings.enabledPaymentMethods || [
        "cod",
        "instapay",
        "vodafone_cash",
        "card",
      ],

      storeName: initialSettings.storeName || STORE_DEFAULTS.storeName,
      logoUrl: initialSettings.logoUrl || "",
      storeTagline: initialSettings.storeTagline || STORE_DEFAULTS.storeTagline,
      storeDescription: initialSettings.storeDescription || STORE_DEFAULTS.storeDescription,

      phone: initialSettings.phone || STORE_DEFAULTS.phone,
      whatsapp: initialSettings.whatsapp || STORE_DEFAULTS.whatsapp,
      supportEmail: initialSettings.supportEmail || STORE_DEFAULTS.supportEmail,
      physicalAddress: initialSettings.physicalAddress || STORE_DEFAULTS.physicalAddress,
      facebookUrl: initialSettings.facebookUrl || STORE_DEFAULTS.facebookUrl,
      instagramUrl: initialSettings.instagramUrl || STORE_DEFAULTS.instagramUrl,
      tiktokUrl: initialSettings.tiktokUrl || STORE_DEFAULTS.tiktokUrl,

      heroBadge: initialSettings.heroBadge || STORE_DEFAULTS.heroBadge,
      heroTitle: initialSettings.heroTitle || STORE_DEFAULTS.heroTitle,
      heroSubtitle: initialSettings.heroSubtitle || STORE_DEFAULTS.heroSubtitle,
      heroBgImage: initialSettings.heroBgImage || STORE_DEFAULTS.heroBgImage,
      heroPrimaryBtnText:
        initialSettings.heroPrimaryBtnText || STORE_DEFAULTS.heroPrimaryBtnText,
      heroPrimaryBtnLink:
        initialSettings.heroPrimaryBtnLink || STORE_DEFAULTS.heroPrimaryBtnLink,

      isPromoBannerActive: initialSettings.isPromoBannerActive ?? true,
      promoBadge: initialSettings.promoBadge || STORE_DEFAULTS.promoBadge,
      promoTitle: initialSettings.promoTitle || STORE_DEFAULTS.promoTitle,
      promoDescription: initialSettings.promoDescription || STORE_DEFAULTS.promoDescription,
      promoCouponCode: initialSettings.promoCouponCode || STORE_DEFAULTS.promoCouponCode,

      instapayHandle: initialSettings.instapayHandle || STORE_DEFAULTS.instapayHandle,
      vodafoneCashPhone: initialSettings.vodafoneCashPhone || STORE_DEFAULTS.vodafoneCashPhone,

      freeShippingThreshold: String(
        initialSettings.freeShippingThreshold || STORE_DEFAULTS.freeShippingThreshold
      ),
      estimatedDeliveryDays:
        initialSettings.estimatedDeliveryDays || STORE_DEFAULTS.estimatedDeliveryDays,
      bannerNotice: initialSettings.bannerNotice ?? STORE_DEFAULTS.bannerNotice,

      governoratesRates: initialRates,

      seoTitle: initialSettings.seoTitle || STORE_DEFAULTS.seoTitle,
      seoDescription: initialSettings.seoDescription || STORE_DEFAULTS.seoDescription,
      seoKeywords: initialSettings.seoKeywords || STORE_DEFAULTS.seoKeywords,
    };
  });

  const setField = <K extends keyof SettingsFormData>(key: K) => (val: SettingsFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHeroBg, setUploadingHeroBg] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroBgInputRef = useRef<HTMLInputElement>(null);

  const handleUploadImage = async (file: File, type: "logo" | "heroBg") => {
    const setUploading = type === "logo" ? setUploadingLogo : setUploadingHeroBg;
    setUploading(true);

    try {
      const data = await uploadImageFile(file);
      if (type === "logo") {
        setField("logoUrl")(data.url);
        toast.success("تم رفع لوجو المتجر بنجاح وحفظه!");
      } else {
        setField("heroBgImage")(data.url);
        toast.success("تم رفع خلفية الهيرو بنجاح وحفظها!");
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "فشل في رفع الصورة"));
    } finally {
      setUploading(false);
    }
  };

  const handleTogglePaymentMethod = (method: "cod" | "instapay" | "vodafone_cash" | "card") => {
    setFormData((prev) => {
      const current = prev.enabledPaymentMethods;
      if (current.includes(method)) {
        if (current.length === 1) {
          toast.error("يجب تفعيل وسيلة دفع واحدة على الأقل في المتجر");
          return prev;
        }
        return {
          ...prev,
          enabledPaymentMethods: current.filter((m) => m !== method),
        };
      }
      return {
        ...prev,
        enabledPaymentMethods: [...current, method],
      };
    });
  };

  const handleRateChange = (govName: string, newRate: number) => {
    setFormData((prev) => ({
      ...prev,
      governoratesRates: {
        ...prev.governoratesRates,
        [govName]: newRate,
      },
    }));
  };

  const handleSaveAll = async () => {
    try {
      await api.settings.update({
        storeName: formData.storeName,
        logoUrl: formData.logoUrl || null,
        storeTagline: formData.storeTagline || null,
        storeDescription: formData.storeDescription || null,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        supportEmail: formData.supportEmail,
        physicalAddress: formData.physicalAddress || null,
        facebookUrl: formData.facebookUrl || null,
        instagramUrl: formData.instagramUrl || null,
        tiktokUrl: formData.tiktokUrl || null,
        heroBadge: formData.heroBadge || null,
        heroTitle: formData.heroTitle || null,
        heroSubtitle: formData.heroSubtitle || null,
        heroBgImage: formData.heroBgImage || null,
        heroPrimaryBtnText: formData.heroPrimaryBtnText || null,
        heroPrimaryBtnLink: formData.heroPrimaryBtnLink || null,
        isPromoBannerActive: formData.isPromoBannerActive,
        promoBadge: formData.promoBadge || null,
        promoTitle: formData.promoTitle || null,
        promoDescription: formData.promoDescription || null,
        promoCouponCode: formData.promoCouponCode || null,
        instapayHandle: formData.instapayHandle,
        vodafoneCashPhone: formData.vodafoneCashPhone,
        freeShippingThreshold:
          Number(formData.freeShippingThreshold) || STORE_DEFAULTS.freeShippingThreshold,
        estimatedDeliveryDays: formData.estimatedDeliveryDays,
        bannerNotice: formData.bannerNotice,
        isBannerActive: formData.isBannerActive,
        isAcceptingOrders: formData.isAcceptingOrders,
        isMaintenanceMode: formData.isMaintenanceMode,
        enabledPaymentMethods: formData.enabledPaymentMethods,
        orderClosedMessage: formData.orderClosedMessage,
        maintenanceMessage: formData.maintenanceMessage,
        governoratesShipping: formData.governoratesRates,
        seoTitle: formData.seoTitle || null,
        seoDescription: formData.seoDescription || null,
        seoKeywords: formData.seoKeywords || null,
      });

      router.refresh();
      toast.success("تم حفظ كافة إعدادات وتخصيصات المتجر بنجاح في قاعدة البيانات!");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "حدث خطأ أثناء حفظ الإعدادات"));
      throw err;
    }
  };

  const tabs = [
    { id: "general" as const, label: "الهوية والشعار", icon: Store },
    { id: "hero" as const, label: "واجهة الهيرو الرئيسية", icon: LayoutTemplate },
    { id: "promos" as const, label: "الإعلانات والعروض", icon: Megaphone },
    { id: "social" as const, label: "التواصل والسوشيال", icon: Share2 },
    { id: "shipping" as const, label: "الشحن والمحافظات", icon: Truck },
    { id: "payments" as const, label: "طرق وبوابات الدفع", icon: CreditCard },
    { id: "emergency" as const, label: "مفاتيح التشغيل والطوارئ", icon: Power },
    { id: "seo" as const, label: "محركات البحث (SEO)", icon: Search },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Hidden file inputs for Cloudinary uploads */}
      <input
        type="file"
        ref={logoInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUploadImage(file, "logo");
          if (e.target) e.target.value = "";
        }}
      />
      <input
        type="file"
        ref={heroBgInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUploadImage(file, "heroBg");
          if (e.target) e.target.value = "";
        }}
      />

      {/* Sticky Header with Save Button (leaf component) */}
      <SettingsHeader onSave={handleSaveAll} />

      {/* Modern Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-neutral-200 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-neutral-500"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: GENERAL & LOGO ================= */}
      {activeTab === "general" && (
        <GeneralSettingsTab
          storeName={formData.storeName}
          setStoreName={setField("storeName")}
          storeTagline={formData.storeTagline}
          setStoreTagline={setField("storeTagline")}
          storeDescription={formData.storeDescription}
          setStoreDescription={setField("storeDescription")}
          logoUrl={formData.logoUrl}
          setLogoUrl={setField("logoUrl")}
          uploadingLogo={uploadingLogo}
          onUploadLogoClick={() => logoInputRef.current?.click()}
        />
      )}

      {/* ================= TAB 2: HERO SECTION CMS ================= */}
      {activeTab === "hero" && (
        <HeroSettingsTab
          heroBadge={formData.heroBadge}
          setHeroBadge={setField("heroBadge")}
          heroTitle={formData.heroTitle}
          setHeroTitle={setField("heroTitle")}
          heroSubtitle={formData.heroSubtitle}
          setHeroSubtitle={setField("heroSubtitle")}
          heroBgImage={formData.heroBgImage}
          setHeroBgImage={setField("heroBgImage")}
          heroPrimaryBtnText={formData.heroPrimaryBtnText}
          setHeroPrimaryBtnText={setField("heroPrimaryBtnText")}
          heroPrimaryBtnLink={formData.heroPrimaryBtnLink}
          setHeroPrimaryBtnLink={setField("heroPrimaryBtnLink")}
          uploadingHeroBg={uploadingHeroBg}
          onUploadHeroBgClick={() => heroBgInputRef.current?.click()}
        />
      )}

      {/* ================= TAB 3: BANNERS & PROMOTIONS ================= */}
      {activeTab === "promos" && (
        <PromoSettingsTab
          isBannerActive={formData.isBannerActive}
          setIsBannerActive={setField("isBannerActive")}
          bannerNotice={formData.bannerNotice}
          setBannerNotice={setField("bannerNotice")}
          isPromoBannerActive={formData.isPromoBannerActive}
          setIsPromoBannerActive={setField("isPromoBannerActive")}
          promoBadge={formData.promoBadge}
          setPromoBadge={setField("promoBadge")}
          promoCouponCode={formData.promoCouponCode}
          setPromoCouponCode={setField("promoCouponCode")}
          promoTitle={formData.promoTitle}
          setPromoTitle={setField("promoTitle")}
          promoDescription={formData.promoDescription}
          setPromoDescription={setField("promoDescription")}
        />
      )}

      {/* ================= TAB 4: CONTACT & SOCIAL ================= */}
      {activeTab === "social" && (
        <SocialSettingsTab
          phone={formData.phone}
          setPhone={setField("phone")}
          whatsapp={formData.whatsapp}
          setWhatsapp={setField("whatsapp")}
          supportEmail={formData.supportEmail}
          setSupportEmail={setField("supportEmail")}
          physicalAddress={formData.physicalAddress}
          setPhysicalAddress={setField("physicalAddress")}
          facebookUrl={formData.facebookUrl}
          setFacebookUrl={setField("facebookUrl")}
          instagramUrl={formData.instagramUrl}
          setInstagramUrl={setField("instagramUrl")}
          tiktokUrl={formData.tiktokUrl}
          setTiktokUrl={setField("tiktokUrl")}
        />
      )}

      {/* ================= TAB 5: SHIPPING & GOVERNORATES ================= */}
      {activeTab === "shipping" && (
        <ShippingSettingsTab
          freeShippingThreshold={formData.freeShippingThreshold}
          setFreeShippingThreshold={setField("freeShippingThreshold")}
          estimatedDeliveryDays={formData.estimatedDeliveryDays}
          setEstimatedDeliveryDays={setField("estimatedDeliveryDays")}
          governoratesRates={formData.governoratesRates}
          onRateChange={handleRateChange}
        />
      )}

      {/* ================= TAB 6: PAYMENT GATEWAYS ================= */}
      {activeTab === "payments" && (
        <PaymentsSettingsTab
          enabledPaymentMethods={formData.enabledPaymentMethods}
          onTogglePaymentMethod={handleTogglePaymentMethod}
          instapayHandle={formData.instapayHandle}
          setInstapayHandle={setField("instapayHandle")}
          vodafoneCashPhone={formData.vodafoneCashPhone}
          setVodafoneCashPhone={setField("vodafoneCashPhone")}
        />
      )}

      {/* ================= TAB 7: EMERGENCY & KILL SWITCHES ================= */}
      {activeTab === "emergency" && (
        <EmergencySettingsTab
          isAcceptingOrders={formData.isAcceptingOrders}
          setIsAcceptingOrders={setField("isAcceptingOrders")}
          orderClosedMessage={formData.orderClosedMessage}
          setOrderClosedMessage={setField("orderClosedMessage")}
          isMaintenanceMode={formData.isMaintenanceMode}
          setIsMaintenanceMode={setField("isMaintenanceMode")}
          maintenanceMessage={formData.maintenanceMessage}
          setMaintenanceMessage={setField("maintenanceMessage")}
        />
      )}

      {/* ================= TAB 8: SEO & SEARCH ================= */}
      {activeTab === "seo" && (
        <SeoSettingsTab
          storeName={formData.storeName}
          seoTitle={formData.seoTitle}
          setSeoTitle={setField("seoTitle")}
          seoDescription={formData.seoDescription}
          setSeoDescription={setField("seoDescription")}
          seoKeywords={formData.seoKeywords}
          setSeoKeywords={setField("seoKeywords")}
        />
      )}

      {/* Bottom Save Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
        <SettingsSaveButton
          onSave={handleSaveAll}
          size="lg"
          label="حفظ وتطبيق التغييرات فورا"
          loadingLabel="جاري الحفظ والربط..."
          className="shadow-lg px-8"
        />
      </div>
    </div>
  );
}

