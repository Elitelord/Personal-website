// Pure game logic — no React, no DOM. Every function returns new state rather
// than mutating, so the board can live in React state and compare cheaply.

// Expert is classically 30 wide x 16 tall, which cannot fit the content column
// without scrolling sideways while you play. Reshaped to 25 wide x 19 tall —
// 475 cells against the classic 480, so with the same 99 mines the density is
// 20.8% vs 20.6%, i.e. the difficulty is effectively unchanged.
export const DIFFICULTIES = {
  beginner: { label: "Beginner", rows: 9, cols: 9, mines: 10 },
  intermediate: { label: "Intermediate", rows: 16, cols: 16, mines: 40 },
  expert: { label: "Expert", rows: 19, cols: 25, mines: 99 },
};

export const GAME_STATE = {
  IDLE: "idle", // no click yet, mines not placed
  PLAYING: "playing",
  WON: "won",
  LOST: "lost",
};

const makeCell = () => ({
  mine: false,
  revealed: false,
  flagged: false,
  adjacent: 0,
  exploded: false, // the specific mine that ended the game
});

export function createBoard(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, makeCell)
  );
}

const cloneCells = (cells) => cells.map((row) => row.map((cell) => ({ ...cell })));

function forEachNeighbor(rows, cols, r, c, fn) {
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      fn(nr, nc);
    }
  }
}

/**
 * Mines are placed only after the first click, and never on that cell or its
 * neighbours — so the first click is always safe *and* always opens an area
 * rather than a lone number.
 */
export function placeMines(cells, rows, cols, mineCount, safeR, safeC) {
  const next = cloneCells(cells);

  const forbidden = new Set([`${safeR},${safeC}`]);
  forEachNeighbor(rows, cols, safeR, safeC, (nr, nc) =>
    forbidden.add(`${nr},${nc}`)
  );

  const candidates = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!forbidden.has(`${r},${c}`)) candidates.push([r, c]);
    }
  }

  // Clamp so a mis-specified preset can never loop forever.
  const toPlace = Math.min(mineCount, candidates.length);

  // Partial Fisher-Yates: only shuffle as many as we need.
  for (let i = 0; i < toPlace; i++) {
    const j = i + Math.floor(Math.random() * (candidates.length - i));
    const tmp = candidates[i];
    candidates[i] = candidates[j];
    candidates[j] = tmp;
    const [r, c] = candidates[i];
    next[r][c].mine = true;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (next[r][c].mine) continue;
      let count = 0;
      forEachNeighbor(rows, cols, r, c, (nr, nc) => {
        if (next[nr][nc].mine) count++;
      });
      next[r][c].adjacent = count;
    }
  }

  return next;
}

/**
 * Reveals a cell, flood-filling through zero-adjacency regions.
 * Iterative rather than recursive — Expert is 480 cells and a single empty
 * region can span most of the board.
 */
export function revealCell(cells, rows, cols, r, c) {
  const start = cells[r][c];
  if (start.revealed || start.flagged) {
    return { cells, hitMine: false, changed: false };
  }

  const next = cloneCells(cells);

  if (next[r][c].mine) {
    next[r][c].revealed = true;
    next[r][c].exploded = true;
    return { cells: next, hitMine: true, changed: true };
  }

  const stack = [[r, c]];
  const seen = new Set([`${r},${c}`]);

  while (stack.length) {
    const [cr, cc] = stack.pop();
    const cell = next[cr][cc];
    if (cell.flagged || cell.revealed) continue;

    cell.revealed = true;

    // Only empty cells open their neighbours.
    if (cell.adjacent === 0) {
      forEachNeighbor(rows, cols, cr, cc, (nr, nc) => {
        const key = `${nr},${nc}`;
        if (seen.has(key)) return;
        const n = next[nr][nc];
        if (n.revealed || n.flagged || n.mine) return;
        seen.add(key);
        stack.push([nr, nc]);
      });
    }
  }

  return { cells: next, hitMine: false, changed: true };
}

/**
 * The unrevealed, unflagged neighbours a chord on this cell would open — used
 * to highlight them while the button is held down.
 * Returns [] for anything that isn't a revealed number.
 */
export function chordTargets(cells, rows, cols, r, c) {
  const cell = cells[r][c];
  if (!cell.revealed || cell.mine || cell.adjacent === 0) return [];

  const targets = [];
  forEachNeighbor(rows, cols, r, c, (nr, nc) => {
    const n = cells[nr][nc];
    if (!n.revealed && !n.flagged) targets.push([nr, nc]);
  });
  return targets;
}

/** True when the surrounding flags match the number, i.e. a chord would fire. */
export function isChordSatisfied(cells, rows, cols, r, c) {
  const cell = cells[r][c];
  if (!cell.revealed || cell.mine || cell.adjacent === 0) return false;

  let flags = 0;
  forEachNeighbor(rows, cols, r, c, (nr, nc) => {
    if (cells[nr][nc].flagged) flags++;
  });
  return flags === cell.adjacent;
}

/**
 * Opens every unflagged neighbour of a satisfied number. Deliberately does not
 * check whether the flags are *correct* — misflagging and chording is how you
 * lose, exactly as in the real game.
 */
export function chordCell(cells, rows, cols, r, c) {
  if (!isChordSatisfied(cells, rows, cols, r, c)) {
    return { cells, hitMine: false, changed: false };
  }

  const targets = chordTargets(cells, rows, cols, r, c);
  if (!targets.length) return { cells, hitMine: false, changed: false };

  let next = cells;
  let hitMine = false;
  for (const [nr, nc] of targets) {
    const out = revealCell(next, rows, cols, nr, nc);
    next = out.cells;
    if (out.hitMine) hitMine = true;
  }

  return { cells: next, hitMine, changed: true };
}

export function toggleFlag(cells, r, c) {
  if (cells[r][c].revealed) return cells;
  const next = cloneCells(cells);
  next[r][c].flagged = !next[r][c].flagged;
  return next;
}

/** Won when every non-mine cell is revealed. Flags are irrelevant. */
export function checkWin(cells) {
  for (const row of cells) {
    for (const cell of row) {
      if (!cell.mine && !cell.revealed) return false;
    }
  }
  return true;
}

/** On loss: show every mine, and mark flags that were wrong. */
export function revealAllMines(cells) {
  return cells.map((row) =>
    row.map((cell) => {
      if (cell.mine && !cell.flagged) return { ...cell, revealed: true };
      return cell;
    })
  );
}

export function countFlags(cells) {
  let n = 0;
  for (const row of cells) {
    for (const cell of row) if (cell.flagged) n++;
  }
  return n;
}
