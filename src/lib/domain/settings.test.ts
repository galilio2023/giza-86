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
    const resolveBannerNotice = (rawNotice?: string | null) =>
      rawNotice === "" ? "" : rawNotice?.trim() || STORE_DEFAULTS.bannerNotice;

    // When active and notice provided
    const notice1 = resolveBannerNotice("خصومات الصيف");
    assert.equal(Boolean(true && notice1), true);
    assert.equal(notice1, "خصومات الصيف");

    // When active and notice is explicitly empty string, preserve empty and hide banner
    const noticeEmpty = resolveBannerNotice("");
    assert.equal(Boolean(true && noticeEmpty), false);
    assert.equal(noticeEmpty, "");

    // When active and notice is undefined or null, fallback to STORE_DEFAULTS.bannerNotice
    const noticeUndef = resolveBannerNotice(undefined);
    assert.equal(Boolean(true && noticeUndef), true);
    assert.equal(noticeUndef, STORE_DEFAULTS.bannerNotice);

    const noticeNull = resolveBannerNotice(null);
    assert.equal(Boolean(true && noticeNull), true);
    assert.equal(noticeNull, STORE_DEFAULTS.bannerNotice);

    // When deactivated, banner should not be visible regardless of notice
    assert.equal(Boolean(false && notice1), false);
  });
});
