import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

type LineProps = {
  text: string;
  index: number;
  totalLines: number;
  accentColor: string;
};

const AnimatedLine: React.FC<LineProps> = ({
  text,
  index,
  totalLines,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const revealStart = 10 + index * 22;
  const revealProgress = interpolate(
    frame,
    [revealStart, revealStart + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const fadeOutStart = 120 + index * 3;
  const fadeOut = interpolate(frame, [fadeOutStart, fadeOutStart + 15], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const yMove = interpolate(revealProgress, [0, 1], [30, 0]);

  const isBold = index === totalLines - 2 || index === totalLines - 1;

  return (
    <div
      style={{
        opacity: Math.min(revealProgress, fadeOut),
        transform: `translateY(${yMove}px)`,
        fontSize: isBold ? 52 : 42,
        fontWeight: isBold ? 700 : 400,
        color: isBold ? accentColor : "#E2E8F0",
        lineHeight: 1.4,
        letterSpacing: "-0.02em",
        padding: "4px 0",
        textAlign: "center",
      }}
    >
      {text}
    </div>
  );
};

type TextRevealVideoProps = {
  lines: string[];
  accentColor: string;
  authorName: string;
  authorHandle: string;
};

export const TextRevealVideo: React.FC<TextRevealVideoProps> = ({
  lines,
  accentColor,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();

  const authorOpacity = interpolate(frame, [110, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const authorFadeOut = interpolate(frame, [140, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Subtle gradient orb in background */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`,
          top: "20%",
          left: "30%",
          filter: "blur(40px)",
        }}
      />

      {/* Main text */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 1,
        }}
      >
        {lines.map((line, i) => (
          <AnimatedLine
            key={i}
            text={line}
            index={i}
            totalLines={lines.length}
            accentColor={accentColor}
          />
        ))}
      </div>

      {/* Author attribution */}
      <div
        style={{
          marginTop: 60,
          opacity: Math.min(authorOpacity, authorFadeOut),
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: accentColor,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 18,
            fontWeight: 700,
            color: "#0F172A",
          }}
        >
          {authorName[0]}
        </div>
        <div>
          <div style={{ color: "#E2E8F0", fontSize: 16, fontWeight: 600 }}>
            {authorName}
          </div>
          <div style={{ color: "#94A3B8", fontSize: 14 }}>{authorHandle}</div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};
