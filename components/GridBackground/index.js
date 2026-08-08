import React, { useEffect, useRef, useState } from "react";

const GridBackground = () => {
  // The spotlight layer only mounts once we have seen a real mouse move.
  // Gating on the event rather than `(pointer: fine)` means touch devices
  // (pointerType "touch") never activate it, hybrid devices activate only
  // when a mouse is actually used, and we never paint a spotlight frozen
  // in the middle of the screen before the user has moved anything.
  const [interactive, setInteractive] = useState(false);
  const spotlightRef = useRef(null);
  const frameRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const activatedRef = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;

    const flush = () => {
      frameRef.current = null;
      const { x, y } = pointerRef.current;
      root.style.setProperty("--mx", `${x}px`);
      root.style.setProperty("--my", `${y}px`);
    };

    const handleMove = (e) => {
      if (reducedMotion.matches) return;
      if (e.pointerType && e.pointerType !== "mouse") return;

      pointerRef.current = { x: e.clientX, y: e.clientY };
      if (!activatedRef.current) {
        activatedRef.current = true;
        setInteractive(true);
      }
      if (spotlightRef.current) {
        spotlightRef.current.dataset.active = "true";
      }
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(flush);
      }
    };

    const handleLeave = () => {
      if (spotlightRef.current) {
        spotlightRef.current.dataset.active = "false";
      }
    };

    const handleReducedMotionChange = () => {
      if (reducedMotion.matches) {
        activatedRef.current = false;
        setInteractive(false);
      }
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("pointerleave", handleLeave);
    reducedMotion.addEventListener("change", handleReducedMotionChange);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerleave", handleLeave);
      reducedMotion.removeEventListener("change", handleReducedMotionChange);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      root.style.removeProperty("--mx");
      root.style.removeProperty("--my");
    };
  }, []);

  return (
    <div className="grid-bg" aria-hidden="true">
      <div className="grid-bg__base" />
      {interactive && (
        <div ref={spotlightRef} className="grid-bg__spotlight" data-active="true" />
      )}
    </div>
  );
};

export default GridBackground;
