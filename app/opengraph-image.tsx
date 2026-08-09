import { ImageResponse } from "next/og";

export const alt = "Frame Forward — Photography that gives back.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social card for the landing page, drawn in brand colours. */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FAF8F5",
          padding: "72px",
          position: "relative",
        }}
      >
        {/* Soft brand washes */}
        <div
          style={{
            position: "absolute",
            top: -180,
            left: -140,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "#DCB0B9",
            opacity: 0.55,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            right: -120,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: "#BDD4D3",
            opacity: 0.6,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#DB8596",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              color: "#2B2D33",
              letterSpacing: -0.5,
              display: "flex",
            }}
          >
            frame forward
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 86,
              fontWeight: 700,
              color: "#2B2D33",
              lineHeight: 1.05,
              letterSpacing: -2.5,
              maxWidth: 900,
              display: "flex",
            }}
          >
            Photography that gives back.
          </div>
          <div
            style={{
              marginTop: 20,
              width: 320,
              height: 10,
              borderRadius: 999,
              background: "#DB8596",
              display: "flex",
            }}
          />
          <div
            style={{
              marginTop: 32,
              fontSize: 30,
              color: "#6F6C77",
              maxWidth: 860,
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            Student photographers share their work with nonprofits — and earn
            community service hours for every photo used.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 24,
            color: "#6F9D9B",
            fontWeight: 600,
          }}
        >
          Teens with a vision. Nonprofits with a mission.
        </div>
      </div>
    ),
    size,
  );
}
