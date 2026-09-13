import { ImageResponse } from "next/og";

export const alt = "GIZA 86 | Luxury Egyptian Cotton Apparel";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          backgroundColor: "#0c0a09",
          backgroundImage: "radial-gradient(circle at 85% 15%, rgba(197, 155, 39, 0.28) 0%, transparent 60%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "rgba(197, 155, 39, 0.15)",
              border: "1px solid rgba(197, 155, 39, 0.4)",
              borderRadius: "9999px",
              padding: "8px 24px",
              fontSize: "20px",
              fontWeight: 700,
              color: "#d4af37",
            }}
          >
            <span>Authentic Giza 86 Egyptian Cotton</span>
          </div>

          <div
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#a3a3a3",
              letterSpacing: "2px",
            }}
          >
            giza86.com
          </div>
        </div>

        {/* Center Brand Title & Slogan */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "20px" }}>
            <span
              style={{
                fontSize: "84px",
                fontWeight: 900,
                color: "#c59b27",
                letterSpacing: "-2px",
              }}
            >
              GIZA 86
            </span>
            <span
              style={{
                fontSize: "40px",
                fontWeight: 800,
                color: "#737373",
              }}
            >
              EST. 2026
            </span>
          </div>

          <div
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#e5e5e5",
              maxWidth: "920px",
              lineHeight: 1.4,
            }}
          >
            Luxury Casual, Oversize & Heavyweight Apparel Made in Egypt
          </div>
        </div>

        {/* Footer Features Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #262626",
            paddingTop: "28px",
          }}
        >
          <div style={{ display: "flex", gap: "32px", fontSize: "20px", color: "#d4d4d4" }}>
            <span>Shipping Across All 27 Governorates</span>
            <span>Cash on Delivery & InstaPay</span>
          </div>

          <div
            style={{
              backgroundColor: "#c59b27",
              color: "#0c0a09",
              padding: "10px 28px",
              borderRadius: "14px",
              fontSize: "20px",
              fontWeight: 800,
            }}
          >
            Shop Collection
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

