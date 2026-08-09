"use client";

/**
 * Last-resort boundary — replaces the root layout, so it ships its own
 * <html>/<body> and cannot rely on the app's CSS variables being applied.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF8F5",
          color: "#2B2D33",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "28rem" }}>
          <h1 style={{ fontSize: "1.5rem", margin: "1rem 0 0.5rem" }}>
            Frame Forward hit a snag
          </h1>
          <p style={{ color: "#6F6C77", lineHeight: 1.6, margin: 0 }}>
            Something broke badly enough that we had to bail out. Reloading
            usually sorts it.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1.5rem",
              borderRadius: 999,
              border: "none",
              background: "#DB8596",
              color: "#2B2D33",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest ? (
            <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "#8b8892" }}>
              Reference: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
