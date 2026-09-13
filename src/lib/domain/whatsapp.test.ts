import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildProductWhatsAppOrderUrl,
  buildOrderInquiryWhatsAppUrl,
  buildCustomerContactWhatsAppUrl,
} from "./whatsapp";

describe("Domain WhatsApp URL Builder", () => {
  it("should generate a valid wa.me URL with encoded product details", () => {
    const url = buildProductWhatsAppOrderUrl({
      whatsappPhone: "01012345678",
      productName: "تيشيرت أوفر سايز بيسك",
      productSlugOrId: "oversized-basic-tee",
      size: "L",
      colorName: "أسود",
      quantity: 2,
      totalPrice: 900,
      origin: "https://giza86.com",
    });

    assert.ok(url.startsWith("https://wa.me/201012345678?text="));
    const decodedText = decodeURIComponent(url.replace("https://wa.me/201012345678?text=", ""));
    assert.ok(decodedText.includes("تيشيرت أوفر سايز بيسك"));
    assert.ok(decodedText.includes("المقاس: L"));
    assert.ok(decodedText.includes("اللون: أسود"));
    assert.ok(decodedText.includes("الكمية: 2"));
    assert.ok(decodedText.includes("الإجمالي: 900 ج.م"));
    assert.ok(decodedText.includes("https://giza86.com/products/oversized-basic-tee"));
  });

  it("should use fallback store WhatsApp number when not specified", () => {
    const url = buildProductWhatsAppOrderUrl({
      productName: "هودي شتوي ميلتون",
      productSlugOrId: 42,
      size: "XL",
      colorName: "رمادي",
      quantity: 1,
      totalPrice: 650,
    });

    assert.ok(url.startsWith("https://wa.me/"));
    const decoded = decodeURIComponent(url);
    assert.ok(decoded.includes("/products/42"));
  });

  it("should generate a valid order inquiry WhatsApp URL", () => {
    const url = buildOrderInquiryWhatsAppUrl("01099998888", "GIZA 86", "ORD-12345");
    assert.ok(url.startsWith("https://wa.me/201099998888?text="));
    const decoded = decodeURIComponent(url);
    assert.ok(decoded.includes("ORD-12345"));
    assert.ok(decoded.includes("GIZA 86"));
  });

  it("should generate a valid customer contact WhatsApp URL for riders/admins", () => {
    const url = buildCustomerContactWhatsAppUrl("01234567890", "أحمد محمود", "ORD-999", "متجر نيلية");
    assert.ok(url.startsWith("https://wa.me/201234567890?text="));
    const decoded = decodeURIComponent(url);
    assert.ok(decoded.includes("أحمد محمود"));
    assert.ok(decoded.includes("ORD-999"));
  });
});
