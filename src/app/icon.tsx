import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: "linear-gradient(135deg, #0d2d62 0%, #2e7ef7 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* T — horizontal bar */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 7,
            width: 18,
            height: 4,
            borderRadius: 2,
            background: "white",
          }}
        />
        {/* T — vertical bar */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 13,
            width: 6,
            height: 12,
            borderRadius: 3,
            background: "white",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
