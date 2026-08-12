import React, { useEffect, useRef, useState } from "react";
import { useDetonation } from "../Detonation";
import { findNearestMine, shouldRetain } from "./mines";

// Anything the mine must never cover. If the cursor is over one of these we
// hide the mine entirely, which is what guarantees it can't intercept a click
// meant for a link, button, or line of text.
const BLOCKING_SELECTOR =
  'a, button, input, textarea, select, label, img, svg, h1, h2, h3, h4, h5, p, li, dt, dd, span, [role="link"], [role="grid"], [role="button"]';

const GridBackground = () => {
  // The spotlight layer only mounts once we have seen a real mouse move.
  // Gating on the event rather than `(pointer: fine)` means touch devices
  // (pointerType "touch") never activate it, hybrid devices activate only
  // when a mouse is actually used, and we never paint a spotlight frozen
  // in the middle of the screen before the user has moved anything.
  const [interactive, setInteractive] = useState(false);
  const [mineReady, setMineReady] = useState(false);
  const spotlightRef = useRef(null);
  const mineRef = useRef(null);
  const frameRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const overBackgroundRef = useRef(false);
  const activatedRef = useRef(false);
  const mineActivatedRef = useRef(false);
  const minePosRef = useRef(null);
  const hoveringMineRef = useRef(false);

  const detonate = useDetonation();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;

    // Cached because it's read every frame; --grid-size changes at 1024px.
    let cellSize = 28;
    let spotRadius = 200;
    const readTokens = () => {
      const cs = getComputedStyle(root);
      cellSize = parseFloat(cs.getPropertyValue("--grid-size")) || 28;
      spotRadius = parseFloat(cs.getPropertyValue("--spotlight-radius")) || 200;
    };
    readTokens();

    const flush = () => {
      frameRef.current = null;
      const { x, y } = pointerRef.current;

      if (!reducedMotion.matches) {
        root.style.setProperty("--mx", `${x}px`);
        root.style.setProperty("--my", `${y}px`);
      }

      const mineEl = mineRef.current;
      if (!mineEl) return;

      if (!overBackgroundRef.current) {
        mineEl.dataset.visible = "false";
        minePosRef.current = null;
        return;
      }

      // While the cursor is on the mine — or still anywhere near the one
      // already showing — leave it exactly where it is. Re-picking "nearest"
      // every frame made the target jump between cells as you approached it.
      if (
        minePosRef.current &&
        (hoveringMineRef.current ||
          shouldRetain(minePosRef.current, x, y, spotRadius))
      ) {
        mineEl.dataset.visible = "true";
        return;
      }

      // clientWidth/Height, not innerWidth/Height. The grid layer is
      // `position: fixed; inset: 0`, so it spans the viewport *excluding* the
      // scrollbar, and its `background-position: center` centres on that box.
      // innerWidth includes the scrollbar, which on a scrolling page shifted
      // the computed origin by half a scrollbar width and pushed every mine
      // off-centre from the squares it's supposed to sit in.
      const best = findNearestMine(
        x,
        y,
        cellSize,
        spotRadius,
        root.clientWidth,
        root.clientHeight
      );

      if (!best) {
        mineEl.dataset.visible = "false";
        minePosRef.current = null;
        return;
      }

      minePosRef.current = best;
      mineEl.style.setProperty("--mine-x", `${best.px}px`);
      mineEl.style.setProperty("--mine-y", `${best.py}px`);
      mineEl.dataset.visible = "true";
    };

    const handleMove = (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;

      pointerRef.current = { x: e.clientX, y: e.clientY };

      // The mine is itself a <button> wrapping an <svg>, both of which are in
      // BLOCKING_SELECTOR — so without this it classifies itself as "not
      // background" the moment you touch it, hides, drops pointer-events, and
      // reappears once the cursor lands on what was underneath. That flicker is
      // why it could never be clicked.
      const onMine = !!(
        e.target &&
        e.target.closest &&
        e.target.closest(".mine-cell")
      );
      hoveringMineRef.current = onMine;
      overBackgroundRef.current =
        onMine || (!!e.target && !e.target.closest(BLOCKING_SELECTOR));

      // The spotlight is motion, so it stays gated on reduced-motion. A static
      // mine glyph is not, and gating it too would make the easter egg
      // undiscoverable for those users.
      if (!reducedMotion.matches) {
        if (!activatedRef.current) {
          activatedRef.current = true;
          setInteractive(true);
        }
        if (spotlightRef.current) {
          spotlightRef.current.dataset.active = "true";
        }
      }

      if (!mineActivatedRef.current) {
        mineActivatedRef.current = true;
        setMineReady(true);
      }

      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(flush);
      }
    };

    const handleLeave = () => {
      if (spotlightRef.current) {
        spotlightRef.current.dataset.active = "false";
      }
      if (mineRef.current) {
        mineRef.current.dataset.visible = "false";
      }
      overBackgroundRef.current = false;
      minePosRef.current = null;
    };

    const handleReducedMotionChange = () => {
      if (reducedMotion.matches) {
        activatedRef.current = false;
        setInteractive(false);
      }
    };

    // Cell geometry moves with the viewport, so a retained mine is stale.
    const handleResize = () => {
      readTokens();
      minePosRef.current = null;
      if (mineRef.current) mineRef.current.dataset.visible = "false";
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("resize", handleResize);
    document.addEventListener("pointerleave", handleLeave);
    reducedMotion.addEventListener("change", handleReducedMotionChange);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("resize", handleResize);
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

  const firedRef = useRef(false);

  const fire = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    const pos = minePosRef.current || pointerRef.current;
    if (mineRef.current) mineRef.current.dataset.visible = "false";
    detonate(pos.px ?? pos.x, pos.py ?? pos.y);
  };

  // Fires on pointerdown rather than click: a click needs press and release on
  // the same element, and a frame in between could move or hide the mine.
  const handleMinePointerDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    fire();
  };

  // Keyboard still arrives as a click; firedRef stops it double-firing.
  const handleMineClick = () => fire();

  return (
    <>
      <div className="grid-bg" aria-hidden="true">
        <div className="grid-bg__base" />
        {interactive && (
          <div ref={spotlightRef} className="grid-bg__spotlight" data-active="true" />
        )}
      </div>

      {mineReady && (
        <div className="mine-layer">
          <button
            ref={mineRef}
            type="button"
            data-visible="false"
            onPointerDown={handleMinePointerDown}
            onClick={handleMineClick}
            className="mine-cell"
            aria-label="A mine. Click it."
            title="Don't."
          >
            {/* The body is centred on the viewBox centre so the part that reads
                as "the bomb" sits dead centre in the grid square; the short fuse
                just pokes out of the top-right. */}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="8" fill="currentColor" />
              <path
                d="M17.4 6.6l1.5-1.5"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              <circle cx="20.3" cy="3.7" r="1.5" fill="currentColor" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default GridBackground;
