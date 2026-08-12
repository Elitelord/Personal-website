// Picks what on the page becomes debris, and builds the flying clones.
//
// Fragments are real DOM clones positioned by each source's own
// getBoundingClientRect(). Rasterising the page (html2canvas / foreignObject)
// is not an option here: the project cards and the LeetCode card are
// cross-origin images that taint the canvas, the sticky header uses
// backdrop-filter, the marquee and grid use mask-image, and next/font faces
// don't resolve inside a foreignObject.

/** Never shatter these, or anything inside them. */
const EXCLUDE = [
  "[data-no-shatter]",
  ".grid-bg",
  ".mine-layer",
  ".detonation",
  ".debris",
  "script",
  "style",
  "head",
].join(", ");

export const LIMITS = {
  maxFragments: 100,
  minArea: 120, // px² — ignore slivers
  maxAreaRatio: 0.55, // ignore anything covering most of the viewport
};

/**
 * Left alone when the page is blanked: the layers that must keep painting, and
 * nodes where hiding would be wrong rather than merely pointless.
 * `next-route-announcer` is Next's live region — hiding it silences the
 * screen-reader announcement of the page we're navigating to.
 */
const KEEP_PAINTED = [
  "[data-no-shatter]",
  ".grid-bg",
  ".mine-layer",
  ".detonation",
  ".debris",
  "next-route-announcer",
  "script",
  "style",
  "link",
  "meta",
  "template",
].join(", ");

// getComputedStyle is the expensive part of collection and every element gets
// looked at several times (once as a candidate, again as an ancestor of its
// descendants). The returned declaration is a live view, so caching it is safe.
const styleCache = new WeakMap();
const styleOf = (el) => {
  let cs = styleCache.get(el);
  if (!cs) {
    cs = window.getComputedStyle(el);
    styleCache.set(el, cs);
  }
  return cs;
};

/**
 * The part of `el` that is actually on screen: its own rect, clipped by the
 * viewport and by every scrolling or overflow-hidden ancestor.
 *
 * Without this a fragment is its *layout* box, not its visible one. The
 * Timeline's event bars run to 2,760px inside a 1,265px viewport because they
 * live in a horizontally-scrolled container, and `cloneNode` copies neither the
 * container's `overflow` nor its `scrollLeft` — so the clone would reveal the
 * whole bar and fly a piece four times wider than anything that was on screen.
 *
 * Returns the visible box in viewport coordinates plus the offset of that box
 * within the element, which is what lets the clone be re-clipped to match.
 */
export function visibleRect(el, viewport) {
  const r = el.getBoundingClientRect();
  let left = r.left;
  let top = r.top;
  let right = r.right;
  let bottom = r.bottom;

  for (let p = el.parentElement; p; p = p.parentElement) {
    const cs = styleOf(p);
    if (cs.overflowX === "visible" && cs.overflowY === "visible") continue;
    const pr = p.getBoundingClientRect();
    if (cs.overflowX !== "visible") {
      left = Math.max(left, pr.left);
      right = Math.min(right, pr.right);
    }
    if (cs.overflowY !== "visible") {
      top = Math.max(top, pr.top);
      bottom = Math.min(bottom, pr.bottom);
    }
  }

  left = Math.max(left, 0);
  top = Math.max(top, 0);
  right = Math.min(right, viewport.w);
  bottom = Math.min(bottom, viewport.h);

  return {
    x: left,
    y: top,
    w: Math.max(0, right - left),
    h: Math.max(0, bottom - top),
    offsetX: left - r.left, // how far into the element the visible box starts
    offsetY: top - r.top,
    fullW: r.width,
    fullH: r.height,
  };
}

const isTransparent = (color) =>
  !color || color === "transparent" || /rgba\(\s*0,\s*0,\s*0,\s*0\s*\)/.test(color);

const hasOwnText = (el) => {
  for (const node of el.childNodes) {
    if (node.nodeType === 3 && node.textContent.trim().length) return true;
  }
  return false;
};

/**
 * True when the element paints a *surface* — a filled or fully outlined box,
 * or an image. A surface has to fly as one piece carrying its contents, since
 * its fill sits behind them.
 *
 * A border on all four sides counts; a single hairline rule does not. That
 * distinction matters: the resume's spec-sheet rows are grid containers whose
 * only paint is a 1px `border-top`, and treating that as a surface made each
 * row swallow its nine children and fly as a slab — three slabs for the whole
 * screen instead of the rows of text you can actually read.
 */
function isSurface(el, cs) {
  const tag = el.tagName.toLowerCase();
  if (tag === "img" || tag === "svg" || tag === "canvas" || tag === "video")
    return true;
  if (!isTransparent(cs.backgroundColor)) return true;
  if (cs.backgroundImage && cs.backgroundImage !== "none") return true;
  return (
    parseFloat(cs.borderTopWidth) > 0 &&
    parseFloat(cs.borderRightWidth) > 0 &&
    parseFloat(cs.borderBottomWidth) > 0 &&
    parseFloat(cs.borderLeftWidth) > 0
  );
}

/**
 * Collects the elements to shatter, walking top-down and letting the first
 * acceptable element **claim its whole subtree**.
 *
 * That claim rule is the important part. An earlier version collected pure
 * leaves and then dropped any element containing another candidate — which
 * quietly deleted every filled container from the debris. A Timeline bar is a
 * coloured box wrapping a text label, so the label flew off and the bar itself
 * stayed painted where it was, reading as "the original stayed put and a copy
 * shot out of it". Claiming the subtree makes the bar fly as a bar, and makes
 * duplicate fragments structurally impossible: no picked element can contain
 * another.
 *
 * Collection is still *below* container level. Because each fragment is placed
 * by its own rect, this sidesteps three problems at once: the marquee is
 * mid-animation (a container clone would restart its 40s scroll and jump, a
 * per-chip rect already has the transform baked in), the Timeline lives in a
 * horizontally-scrolled box that cloneNode won't reproduce, and the header is
 * sticky-offset from its layout position. Oversized wrappers fail the area cap
 * and are descended through, so those cases still resolve to small pieces.
 */
export function collectShatterables(root, viewport) {
  if (!root) return [];

  const viewportArea = viewport.w * viewport.h;
  const claimed = [];

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(el) {
      if (el.closest(EXCLUDE)) return NodeFilter.FILTER_REJECT;
      // Already flying inside an ancestor's fragment.
      if (claimed.some((c) => c.contains(el))) return NodeFilter.FILTER_REJECT;

      const cs = styleOf(el);
      if (
        cs.display === "none" ||
        cs.visibility === "hidden" ||
        parseFloat(cs.opacity) === 0
      ) {
        return NodeFilter.FILTER_REJECT; // skip the subtree too
      }
      // Fixed things (dev Edit button, modals) aren't part of the page body.
      if (cs.position === "fixed") return NodeFilter.FILTER_REJECT;

      // Measured on what's visible, not what's laid out — an element scrolled
      // mostly out of its container is a sliver, and must be treated as one.
      const rect = visibleRect(el, viewport);
      // Nothing on screen — but keep descending, children may be positioned
      // outside their parent and still be visible.
      if (rect.w <= 0 || rect.h <= 0) return NodeFilter.FILTER_SKIP;

      const area = rect.w * rect.h;
      if (area < LIMITS.minArea) return NodeFilter.FILTER_SKIP;
      // Too big to read as a fragment — descend and shatter what's inside.
      if (area > viewportArea * LIMITS.maxAreaRatio) return NodeFilter.FILTER_SKIP;

      if (isSurface(el, cs) || hasOwnText(el)) {
        claimed.push(el);
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_SKIP;
    },
  });

  let picked = [];
  while (walker.nextNode()) picked.push(walker.currentNode);

  if (picked.length > LIMITS.maxFragments) {
    picked = picked
      .map((el) => {
        const r = visibleRect(el, viewport);
        return { el, area: r.w * r.h };
      })
      .sort((a, b) => b.area - a.area) // drop the smallest first
      .slice(0, LIMITS.maxFragments)
      .map((entry) => entry.el);
  }

  return picked;
}

/**
 * Builds a flying fragment for `el`: a clipping wrapper the size of the part
 * that was on screen, holding a clone of the element offset so the right
 * portion shows through. The wrapper is what the physics moves.
 *
 * The wrapper exists purely to re-create the clipping the clone lost — an
 * ancestor's `overflow: hidden` and the viewport edges. For anything fully in
 * view it's a plain box the same size as the element.
 *
 * Returns { node, rect } or null if nothing of the element is visible.
 */
export function buildFragmentNode(el, viewport) {
  const v = visibleRect(el, viewport);
  if (v.w <= 0 || v.h <= 0) return null;

  const clone = el.cloneNode(true);

  // Clones must not be interactive, focusable, or announced.
  clone.removeAttribute("id");
  if (clone.querySelectorAll) {
    clone.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
    clone
      .querySelectorAll("a, button, input, select, textarea")
      .forEach((n) => n.setAttribute("tabindex", "-1"));
  }

  const cs = clone.style;
  cs.position = "absolute";
  cs.left = `${-v.offsetX}px`;
  cs.top = `${-v.offsetY}px`;
  cs.width = `${v.fullW}px`;
  cs.height = `${v.fullH}px`;
  cs.margin = "0";
  // The rect already has any transform baked in — re-applying it would move
  // the clone a second time. Same for animations: the marquee would restart.
  cs.transform = "none";
  cs.transition = "none";
  cs.animation = "none";

  const node = document.createElement("div");
  node.setAttribute("aria-hidden", "true");
  const ws = node.style;
  ws.position = "absolute";
  ws.left = "0";
  ws.top = "0";
  ws.width = `${v.w}px`;
  ws.height = `${v.h}px`;
  ws.overflow = "hidden";
  ws.transform = `translate3d(${v.x}px, ${v.y}px, 0)`;
  ws.pointerEvents = "none";
  ws.willChange = "transform";
  node.appendChild(clone);

  return { node, rect: { x: v.x, y: v.y, w: v.w, h: v.h } };
}

/**
 * Blanks the page behind the debris, keeping only the nav and the effect
 * layers.
 *
 * Hiding just the collected sources is not enough: anything the collector
 * passed over (too small, too large to fly, a wrapper with a hairline it never
 * claimed) would keep painting under the debris. So this walks down from the
 * root and hides the highest element in each branch that doesn't contain
 * something we need to keep — a handful of nodes rather than hundreds.
 *
 * `visibility: hidden` rather than `display: none` on purpose: layout is
 * preserved, so the page doesn't reflow and the scroll position doesn't jump
 * out from under the fragments mid-flight.
 *
 * Returns the elements it touched so they can be restored. Nothing here needs
 * restoring today — the route change throws the whole subtree away — but React
 * reuses host nodes when the old and new trees line up, and an inline
 * `visibility: hidden` riding across a route change would leave part of the
 * incoming page permanently invisible. Cheap insurance against a bug that
 * would be miserable to track down.
 */
export function hidePageContent(root) {
  const hidden = [];
  if (!root) return hidden;

  const walk = (el) => {
    for (const child of Array.from(el.children)) {
      if (child.matches(KEEP_PAINTED)) continue;
      // Something we have to keep lives below here, so go around it.
      if (child.querySelector(KEEP_PAINTED)) {
        walk(child);
        continue;
      }
      child.style.visibility = "hidden";
      hidden.push(child);
    }
  };

  walk(root);
  return hidden;
}

/** Undoes hidePageContent. Safe on detached nodes. */
export function restorePageContent(hidden) {
  if (!hidden) return;
  hidden.forEach((el) => el.style.removeProperty("visibility"));
}
