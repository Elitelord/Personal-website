import React, { useEffect, useMemo, useState } from "react";

const PIECES = 70;

// Reuses the board's number palette so a win feels like part of the same game
// rather than a generic celebration.
const COLORS = [
  "#2563eb", // blue-600
  "#059669", // emerald-600
  "#dc2626", // red-600
  "#6d28d9", // violet-700
  "#b45309", // amber-700
  "#0e7490", // cyan-700
];

const rand = (min, max) => min + Math.random() * (max - min);

/**
 * `runId` should change on every win so a fresh burst is generated. Randomness
 * is client-only, but this component is only ever mounted in response to a win,
 * so it never renders during SSR.
 */
const Confetti = ({ runId }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const pieces = useMemo(
    () =>
      Array.from({ length: PIECES }, (_, i) => ({
        id: i,
        left: rand(0, 100),
        delay: rand(0, 700),
        duration: rand(2200, 3800),
        drift: rand(-90, 90),
        spin: rand(-720, 720),
        size: rand(5, 11),
        color: COLORS[i % COLORS.length],
        round: i % 3 === 0,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runId]
  );

  if (!enabled) return null;

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti__piece"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 1.6}px`,
            background: p.color,
            borderRadius: p.round ? "9999px" : "1px",
            animationDelay: `${p.delay}ms`,
            animationDuration: `${p.duration}ms`,
            "--drift": `${p.drift}px`,
            "--spin": `${p.spin}deg`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
