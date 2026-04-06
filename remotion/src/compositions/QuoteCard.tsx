import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

type QuoteCardProps = {
  quote: string;
  accentColor: string;
  authorName: string;
};

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  accentColor,
  authorName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = quote.split("\n");

  // Card scale-in
  const cardScale = interpolate(
    frame,
    [0, 20],
    [0.9, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const cardOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out at end
  const fadeOut = interpolate(frame, [135, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          width: 900,
          padding: "80px 70px",
          backgroundColor: "#1E293B",
          borderRadius: 24,
          border: `1px solid ${accentColor}30`,
          opacity: Math.min(cardOpacity, fadeOut),
          transform: `scale(${cardScale})`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
            filter: "blur(30px)",
          }}
        />

        {/* Big opening quote mark */}
        <div
          style={{
            fontSize: 120,
            color: accentColor,
            lineHeight: 1,
            marginBottom: -20,
            opacity: interpolate(frame, [5, 25], [0, 0.3], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          &ldquo;
        </div>

        {/* Quote lines with staggered reveal */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {lines.map((line, i) => {
            const lineReveal = interpolate(
              frame,
              [20 + i * 18, 35 + i * 18],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
            );
            const lineY = interpolate(lineReveal, [0, 1], [20, 0]);

            return (
              <div
                key={i}
                style={{
                  opacity: lineReveal,
                  transform: `translateY(${lineY}px)`,
                  fontSize: line.length < 40 ? 56 : 46,
                  fontWeight: 700,
                  color: "#F8FAFC",
                  lineHeight: 1.3,
                  letterSpacing: "-0.02em",
                  marginBottom: 12,
                }}
              >
                {line}
              </div>
            );
          })}
        </div>

        {/* Author */}
        <div
          style={{
            marginTop: 50,
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: interpolate(frame, [80, 100], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: accentColor,
            }}
          />
          <span style={{ color: "#94A3B8", fontSize: 18, fontWeight: 500 }}>
            {authorName}
          </span>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 70,
            right: 70,
            height: 3,
            background: `linear-gradient(90deg, ${accentColor}, transparent)`,
            opacity: interpolate(frame, [10, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
