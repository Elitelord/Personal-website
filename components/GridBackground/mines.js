// Pure geometry + placement for the hidden mines, kept out of the component so
// it can be tested without a DOM.

// Tuned together so a mine is visible on roughly a quarter of background
// positions: often enough to be found by anyone who moves the cursor around,
// rare enough to still read as a discovery rather than page furniture.
/** Roughly 1 cell in this many is a mine. */
export const MINE_DENSITY = 90;
/** How far out (in cells) to look for the nearest mine. */
export const SEARCH_CELLS = 5;
/** A mine only shows this far into the lit area, as a fraction of the radius. */
export const REVEAL_FRACTION = 0.45;
/**
 * Once shown, a mine is kept until the cursor gets this far away — deliberately
 * larger than REVEAL_FRACTION. Without that hysteresis, "nearest" flips to a
 * different cell as you move toward one and the target jumps out from under the
 * cursor, which is what made the bomb feel impossible to click.
 */
export const RETAIN_FRACTION = 0.95;

/** True while an already-visible mine should stay put. */
export function shouldRetain(current, x, y, spotRadius) {
  if (!current) return false;
  return Math.hypot(current.px - x, current.py - y) <= spotRadius * RETAIN_FRACTION;
}

/**
 * Deterministic per cell, so a given spot on the grid is always the same mine
 * or always empty — it must not flicker as the cursor moves across it.
 */
export function isMineCell(cx, cy) {
  let h = Math.imul(cx | 0, 374761393) + Math.imul(cy | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) % MINE_DENSITY === 0;
}

/**
 * The background grid is a fixed layer with `background-position: center
 * center`, so tile boundaries start half a cell either side of the viewport
 * centre. Everything here has to agree with that or the glyph sits off-grid.
 */
export function gridOrigin(viewportW, viewportH, cellSize) {
  return {
    originX: viewportW / 2 - cellSize / 2,
    originY: viewportH / 2 - cellSize / 2,
  };
}

export function cellAt(x, y, cellSize, viewportW, viewportH) {
  const { originX, originY } = gridOrigin(viewportW, viewportH, cellSize);
  return {
    cx: Math.floor((x - originX) / cellSize),
    cy: Math.floor((y - originY) / cellSize),
  };
}

export function cellCenter(cx, cy, cellSize, viewportW, viewportH) {
  const { originX, originY } = gridOrigin(viewportW, viewportH, cellSize);
  return {
    px: originX + (cx + 0.5) * cellSize,
    py: originY + (cy + 0.5) * cellSize,
  };
}

/**
 * Nearest mine to the cursor, or null when none is close enough to be inside
 * the lit part of the spotlight.
 */
export function findNearestMine(x, y, cellSize, spotRadius, viewportW, viewportH) {
  const { cx, cy } = cellAt(x, y, cellSize, viewportW, viewportH);

  let best = null;
  let bestDist = Infinity;

  for (let dy = -SEARCH_CELLS; dy <= SEARCH_CELLS; dy++) {
    for (let dx = -SEARCH_CELLS; dx <= SEARCH_CELLS; dx++) {
      const mx = cx + dx;
      const my = cy + dy;
      if (!isMineCell(mx, my)) continue;
      const { px, py } = cellCenter(mx, my, cellSize, viewportW, viewportH);
      const dist = Math.hypot(px - x, py - y);
      if (dist < bestDist) {
        bestDist = dist;
        best = { px, py, cx: mx, cy: my };
      }
    }
  }

  if (!best || bestDist > spotRadius * REVEAL_FRACTION) return null;
  return best;
}
