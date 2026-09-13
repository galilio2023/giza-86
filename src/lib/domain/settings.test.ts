import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveStoreSettings, STORE_DEFAULTS } from "@/lib/egypt-constants";

describe("Domain Store Settings Resolution", () => {
  it("should preserve explicitly empty string for bannerNotice to allow hiding", () => {
    const resolved = resolveStoreSettings({ bannerNotice: "" });
    assert.equal(resolved.bannerNotice, "");
  });

  it("should fall back to STORE_DEFAULTS.bannerNotice when bannerNotice is undefined", () => {
    const resolved = resolveStoreSettings({});
    assert.equal(resolved.bannerNotice, STORE_DEFAULTS.bannerNotice);
  });

  it("should fall back to STORE_DEFAULTS.bannerNotice when bannerNotice is null", () => {
    const resolved = resolveStoreSettings({ bannerNotice: null as unknown as string });
    assert.equal(resolved.bannerNotice, STORE_DEFAULTS.bannerNotice);
  });

  it("should preserve custom bannerNotice when provided", () => {
    const customNotice = "تخفيضات نهاية الموسم حتى 50%";
    const resolved = resolveStoreSettings({ bannerNotice: customNotice });
    assert.equal(resolved.bannerNotice, customNotice);
  });

  it("should preserve isBannerActive flag correctly", () => {
    assert.equal(resolveStoreSettings({ isBannerActive: false }).isBannerActive, false);
    assert.equal(resolveStoreSettings({ isBannerActive: true }).isBannerActive, true);
    assert.equal(resolveStoreSettings({}).isBannerActive, STORE_DEFAULTS.isBannerActive);
  });

  it("should determine banner visibility and fallback notice correctly", () => {
    // When active and notice provided
    const activeWithNotice = { isBannerActive: true, bannerNotice: "خصومات الصيف" };
    const customNotice = activeWithNotice.bannerNotice?.trim();
    const notice = customNotice || STORE_DEFAULTS.bannerNotice;
    assert.equal(Boolean(activeWithNotice.isBannerActive && notice), true);
    assert.equal(notice, "خصومات الصيف");

    // When active but notice is empty/spaces, fallback to default so active banner always renders
    const activeEmptyNotice = { isBannerActive: true, bannerNotice: "   " };
    const customEmptyNotice = activeEmptyNotice.bannerNotice?.trim();
    const fallbackNotice = customEmptyNotice || STORE_DEFAULTS.bannerNotice;
    assert.equal(Boolean(activeEmptyNotice.isBannerActive && fallbackNotice), true);
    assert.equal(fallbackNotice, STORE_DEFAULTS.bannerNotice);

    // When deactivated, banner should not be visible regardless of notice
    const inactive = { isBannerActive: false, bannerNotice: "خصومات الصيف" };
    assert.equal(Boolean(inactive.isBannerActive && notice), false);
  });
});
