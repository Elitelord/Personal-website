import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import { unlockMinesweeper } from "../../utils/minesweeper";
import { seedFragment, step } from "./physics";
import {
  buildFragmentNode,
  collectShatterables,
  hidePageContent,
  restorePageContent,
} from "./shatter";

const DetonationContext = createContext(() => {});

export const useDetonation = () => useContext(DetonationContext);

// Tuning knobs for the whole sequence, in ms.
const TIMING = {
  flash: 750, // flash + shockwave ring
  navigateAt: 1250, // route change; debris keeps falling over the new page
  debris: 2300, // debris layer torn down
};

export const DetonationProvider = ({ children }) => {
  const router = useRouter();
  const [blast, setBlast] = useState(null); // { x, y }
  const layerRef = useRef(null);
  const pendingRef = useRef(null);
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => clearTimers, []);

  const detonate = useCallback(
    (x, y) => {
      if (timersRef.current.length) return; // already going off

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        unlockMinesweeper();
        router.push("/minesweeper");
        return;
      }

      // Nothing links to /minesweeper until it's unlocked, so Next has never
      // prefetched its chunk. Without this, the router.push below downloads and
      // parses it on the main thread mid-flight, which stalls the rAF loop and
      // freezes the debris in place for a beat.
      router.prefetch("/minesweeper");

      // Build the fragments now, while the page is still intact. The page is
      // blanked later — once the clones are actually in the DOM — so the swap
      // happens within a single frame and never flashes an empty page.
      const viewport = {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight,
      };
      const built = [];
      for (const el of collectShatterables(document.body, viewport)) {
        const piece = buildFragmentNode(el, viewport);
        if (!piece) continue;
        built.push({
          node: piece.node,
          frag: seedFragment(piece.rect, { x, y }),
        });
      }
      pendingRef.current = { items: built, viewport };

      setBlast({ x, y });

      // Flare the background grid using the tokens it already reads, so the
      // whole page lights up without adding any markup.
      const root = document.documentElement;
      root.style.setProperty("--grid-line-lit", "rgba(239, 68, 68, 0.55)");
      root.style.setProperty("--spotlight-radius", "1400px");

      timersRef.current.push(
        setTimeout(() => {
          // Deferred to here rather than fired on click: unlocking adds a
          // "Minesweeper" entry to the nav, and the nav is the one thing still
          // on screen — growing it mid-blast reflows the only stable element
          // left. At the route change the header is being rebuilt anyway.
          unlockMinesweeper();
          router.push("/minesweeper");
        }, TIMING.navigateAt),
        setTimeout(() => {
          root.style.removeProperty("--grid-line-lit");
          root.style.removeProperty("--spotlight-radius");
          clearTimers();
          setBlast(null);
        }, TIMING.debris)
      );
    },
    [router]
  );

  // Mount the clones and run the simulation.
  useEffect(() => {
    const layer = layerRef.current;
    const pending = pendingRef.current;
    pendingRef.current = null;
    if (!blast || !layer || !pending || !pending.items.length) return undefined;

    const { items, viewport } = pending;

    const batch = document.createDocumentFragment();
    items.forEach((item) => batch.appendChild(item.node));
    layer.appendChild(batch);
    // Only now that the debris is on screen does the page behind it go dark.
    const hidden = hidePageContent(document.body);

    let raf = 0;
    let last = performance.now();

    const tick = (now) => {
      // Cap dt so a stalled tab doesn't teleport everything on resume.
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      for (const item of items) {
        const f = item.frag;
        step(f, dt, viewport);
        item.node.style.transform = `translate3d(${f.x}px, ${f.y}px, 0) rotate(${f.rot}rad)`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      restorePageContent(hidden);
    };
  }, [blast]);

  return (
    <DetonationContext.Provider value={detonate}>
      {children}
      {blast && (
        <>
          <div
            className="detonation"
            aria-hidden="true"
            style={{ "--blast-x": `${blast.x}px`, "--blast-y": `${blast.y}px` }}
          >
            <div className="detonation__flash" />
            <div className="detonation__ring" />
          </div>
          <div className="debris" aria-hidden="true" ref={layerRef} />
        </>
      )}
    </DetonationContext.Provider>
  );
};

export default DetonationProvider;
