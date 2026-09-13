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
});
