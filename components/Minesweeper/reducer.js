import {
  DIFFICULTIES,
  GAME_STATE,
  checkWin,
  chordCell,
  createBoard,
  placeMines,
  revealAllMines,
  revealCell,
  toggleFlag,
  // Explicit extension so this module can also be imported directly by Node
  // for testing, not only through webpack's resolver.
} from "./engine.js";

/**
 * All board state moves through this reducer so every action is applied to the
 * *latest* state. With plain setState the handlers closed over `cells`, so a
 * flag immediately followed by a click computed the reveal from pre-flag state
 * and silently discarded the flag — any two rapid interactions could lose one.
 *
 * Pure: the caller passes `now` rather than the reducer reading the clock.
 */

export const createInitialState = (difficulty) => {
  const { rows, cols } = DIFFICULTIES[difficulty];
  return {
    difficulty,
    cells: createBoard(rows, cols),
    status: GAME_STATE.IDLE,
    startedAt: null,
    finalTime: null,
  };
};

const isOver = (status) =>
  status === GAME_STATE.WON || status === GAME_STATE.LOST;

const elapsed = (startedAt, now) =>
  startedAt ? Number(((now - startedAt) / 1000).toFixed(2)) : 0;

export function reducer(state, action) {
  if (action.type === "reset") {
    return createInitialState(action.difficulty || state.difficulty);
  }

  if (isOver(state.status)) return state;

  const { rows, cols, mines } = DIFFICULTIES[state.difficulty];

  switch (action.type) {
    case "flag": {
      const { r, c } = action;
      if (state.cells[r][c].revealed) return state;
      return { ...state, cells: toggleFlag(state.cells, r, c) };
    }

    case "reveal": {
      const { r, c, now } = action;

      let cells = state.cells;
      let status = state.status;
      let startedAt = state.startedAt;

      // Mines are placed on the first reveal so it can never be a loss.
      if (status === GAME_STATE.IDLE) {
        cells = placeMines(cells, rows, cols, mines, r, c);
        status = GAME_STATE.PLAYING;
        startedAt = now;
      }

      const res = revealCell(cells, rows, cols, r, c);
      if (!res.changed && status === state.status) return state;

      if (res.hitMine) {
        return {
          ...state,
          cells: revealAllMines(res.cells),
          status: GAME_STATE.LOST,
          startedAt,
        };
      }

      if (checkWin(res.cells)) {
        return {
          ...state,
          cells: res.cells,
          status: GAME_STATE.WON,
          startedAt,
          finalTime: elapsed(startedAt, now),
        };
      }

      return { ...state, cells: res.cells, status, startedAt };
    }

    case "chord": {
      const { r, c, now } = action;
      const res = chordCell(state.cells, rows, cols, r, c);
      if (!res.changed) return state;

      if (res.hitMine) {
        return {
          ...state,
          cells: revealAllMines(res.cells),
          status: GAME_STATE.LOST,
        };
      }

      if (checkWin(res.cells)) {
        return {
          ...state,
          cells: res.cells,
          status: GAME_STATE.WON,
          finalTime: elapsed(state.startedAt, now),
        };
      }

      return { ...state, cells: res.cells };
    }

    default:
      return state;
  }
}
