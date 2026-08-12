import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import Confetti from "./Confetti";
import { recordBest } from "../../utils/minesweeperBests";
import { createInitialState, reducer } from "./reducer";
import { DIFFICULTIES, GAME_STATE, chordTargets, countFlags } from "./engine";

// Written out in full so Tailwind's scanner can see each class literally.
// This is the one place multi-hue colour is genuinely semantic.
const NUMBER_COLORS = {
  1: "text-blue-600 dark:text-blue-400",
  2: "text-emerald-600 dark:text-emerald-400",
  3: "text-red-600 dark:text-red-400",
  4: "text-violet-700 dark:text-violet-400",
  5: "text-amber-700 dark:text-amber-500",
  6: "text-cyan-700 dark:text-cyan-400",
  7: "text-gray-800 dark:text-gray-200",
  8: "text-gray-500 dark:text-gray-400",
};

const LONG_PRESS_MS = 450;

const MineIcon = () => (
  <svg viewBox="0 0 20 20" className="w-[60%] h-[60%]" fill="currentColor" aria-hidden="true">
    <path d="M9.25 1.5h1.5v3h-1.5zM9.25 15.5h1.5v3h-1.5zM1.5 9.25h3v1.5h-3zM15.5 9.25h3v1.5h-3zM3.7 4.76l1.06-1.06 2.12 2.12-1.06 1.06zM14.12 14.18l1.06-1.06 2.12 2.12-1.06 1.06zM4.76 16.3l-1.06-1.06 2.12-2.12 1.06 1.06zM15.18 5.88l-1.06-1.06 2.12-2.12 1.06 1.06z" />
    <circle cx="10" cy="10" r="4.25" />
  </svg>
);

const FlagIcon = ({ className = "w-[60%] h-[60%]" }) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
    <path d="M6 2.5v15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <path d="M6.9 3.4l7 2.9-7 2.9z" fill="currentColor" />
  </svg>
);

const pad = (n, len = 3) => String(Math.max(0, Math.min(999, n))).padStart(len, "0");

const Minesweeper = () => {
  // Every board mutation goes through the reducer, so each action sees the
  // latest state rather than whatever the handler closed over.
  const [state, dispatch] = useReducer(
    reducer,
    "beginner",
    createInitialState
  );
  const { difficulty, cells, status, finalTime } = state;
  const { rows, cols, mines, label } = DIFFICULTIES[difficulty];

  const [seconds, setSeconds] = useState(0);
  const [flagMode, setFlagMode] = useState(false);
  const [winRun, setWinRun] = useState(0);
  // Below `tablet` only Beginner is offered — a 16- or 30-row board on a phone
  // is either unreadably small or scrolls while you play. Starts false so the
  // server and first client render agree.
  const [compact, setCompact] = useState(false);

  const longPressRef = useRef(null);
  const longPressFiredRef = useRef(false);
  // Cells highlighted while a chord is held down, as "r,c" keys.
  const [chordPreview, setChordPreview] = useState(null);
  const chordOriginRef = useRef(null);
  // True from the moment a chord press starts until the button comes up,
  // regardless of which cell the cursor is currently over.
  const chordActiveRef = useRef(false);

  const reset = useCallback((key) => {
    dispatch({ type: "reset", difficulty: key });
    setSeconds(0);
  }, []);

  const changeDifficulty = (key) => reset(key);

  // Timer runs only while playing; cleared on win, loss, and unmount.
  useEffect(() => {
    if (status !== GAME_STATE.PLAYING) return undefined;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  // Fires once per transition into WON, so chorded wins count too.
  const prevStatusRef = useRef(status);
  useEffect(() => {
    if (prevStatusRef.current !== GAME_STATE.WON && status === GAME_STATE.WON) {
      setWinRun((n) => n + 1);
      if (finalTime !== null) recordBest(difficulty, finalTime);
    }
    prevStatusRef.current = status;
  }, [status, finalTime, difficulty]);

  useEffect(() => {
    return () => {
      if (longPressRef.current) clearTimeout(longPressRef.current);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setCompact(mq.matches);
    sync();
    // `change` alone is the textbook approach, but it's a single signal — if it
    // is ever missed (a resize during load, a throttled background tab) the
    // board stays latched to the width it first saw. `resize` re-syncs cheaply.
    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  // Shrinking to a phone while on Expert would leave an unplayable board.
  useEffect(() => {
    if (compact && difficulty !== "beginner") reset("beginner");
  }, [compact, difficulty, reset]);

  const isOver = status === GAME_STATE.WON || status === GAME_STATE.LOST;

  const doReveal = (r, c) =>
    dispatch({ type: "reveal", r, c, now: Date.now() });

  const doFlag = (r, c) => dispatch({ type: "flag", r, c });

  // --- Chording -----------------------------------------------------------
  // Hold on a revealed number to preview which neighbours would open; release
  // to fire it, but only if the surrounding flags match the number.

  // Targets whichever number the cursor is currently over. Called again on
  // every cell the pointer enters while the button is down, so dragging from
  // one number to the next moves the preview instead of cancelling it.
  const aimChord = (r, c) => {
    if (isOver) return false;
    const cell = cells[r][c];
    if (!cell.revealed || cell.mine || cell.adjacent === 0) {
      chordOriginRef.current = null;
      setChordPreview(null);
      return false;
    }
    const targets = chordTargets(cells, rows, cols, r, c);
    chordOriginRef.current = { r, c };
    setChordPreview(new Set(targets.map(([tr, tc]) => `${tr},${tc}`)));
    return true;
  };

  const clearChord = () => {
    chordActiveRef.current = false;
    chordOriginRef.current = null;
    setChordPreview(null);
  };

  const releaseChord = () => {
    const origin = chordOriginRef.current;
    clearChord();
    if (!origin || isOver) return;

    // No need to suppress the click that follows: a chord origin is always an
    // already-revealed number, and both `reveal` and `flag` on a revealed cell
    // are no-ops in the reducer. A sticky suppression flag would instead
    // swallow a later genuine click whenever no click followed the chord.
    dispatch({ type: "chord", r: origin.r, c: origin.c, now: Date.now() });
  };

  // Releasing anywhere else must cancel rather than leave the board stuck
  // highlighted. Always mounted, not gated on there being a preview: the chord
  // can be armed (left held) with no preview showing, and releasing off the
  // board still has to disarm it.
  useEffect(() => {
    // `mouseup` is needed as well as `pointerup` because pointerup only fires
    // once *every* button is up.
    const onUp = (e) => {
      if (e.type === "mouseup" && e.button !== 0) return;
      // For a mouse the authoritative release is `mouseup`. The browser fires
      // `pointerup` *first*, so disarming here would clear the chord before the
      // cell's own onMouseUp ever ran, and releasing would do nothing. Touch
      // still relies on pointerup, since it has no mouse events.
      if (e.type === "pointerup" && e.pointerType === "mouse") return;
      clearChord();
    };
    window.addEventListener("mouseup", onUp);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (r, c) => {
    // A touch long-press already flagged this cell.
    if (longPressFiredRef.current) {
      longPressFiredRef.current = false;
      return;
    }
    if (flagMode) doFlag(r, c);
    else doReveal(r, c);
  };

  const handleContextMenu = (e) => e.preventDefault();

  // --- Mouse ---------------------------------------------------------------
  // Deliberately mousedown/mouseup rather than pointerdown/pointerup. Per the
  // Pointer Events spec, for mouse `pointerdown` only fires on the transition
  // from *no* buttons pressed — pressing a second button while one is already
  // held reports as `pointermove`, and the matching release does too. So with
  // the right button held, the left button's pointerdown/pointerup never
  // arrived and the chord only ran once the right button came up. The mouse
  // events fire per button unconditionally.

  const handleMouseDown = (e, r, c) => {
    if (isOver) return;

    // Right button flags on press, so it can stay held while you carry on.
    if (e.button === 2) {
      if (!cells[r][c].revealed) doFlag(r, c);
      return;
    }

    if (e.button !== 0) return;

    // Arm the chord on *any* cell, not just revealed ones. Pressing left+right
    // together on a hidden cell flags it and then drags onto a number — if the
    // press had to land on a number to arm, that gesture would do nothing.
    // `aimChord` simply clears the preview while the cursor is over a cell that
    // isn't a number, and picks one up as soon as it reaches one.
    chordActiveRef.current = true;
    aimChord(r, c);
  };

  const handleMouseUp = (e) => {
    if (e.button !== 0) return; // right release does nothing; the flag is placed
    if (chordActiveRef.current) {
      releaseChord();
      chordActiveRef.current = false;
    }
  };

  // Drag-through: retarget the preview onto whatever number we're now over.
  const handleMouseEnter = (e, r, c) => {
    if (!chordActiveRef.current) return;
    if ((e.buttons & 1) === 0) {
      // Left button came up somewhere off the board.
      clearChord();
      return;
    }
    aimChord(r, c);
  };

  // --- Touch ---------------------------------------------------------------

  const cancelLongPress = () => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  };

  const handlePointerDown = (e, r, c) => {
    if (isOver || e.pointerType === "mouse") return;

    if (cells[r][c].revealed) {
      chordActiveRef.current = true;
      aimChord(r, c);
      return;
    }

    // Long-press to flag. Touch also gets the flag-mode toggle, since
    // long-press alone is undiscoverable.
    longPressFiredRef.current = false;
    longPressRef.current = setTimeout(() => {
      longPressFiredRef.current = true;
      doFlag(r, c);
    }, LONG_PRESS_MS);
  };

  const handlePointerUp = (e) => {
    if (e.pointerType === "mouse") return;
    cancelLongPress();
    if (chordActiveRef.current) {
      releaseChord();
      chordActiveRef.current = false;
    }
  };

  // Must NOT cancel a chord — leaving a cell is how you drag onto the next
  // number, and mouseenter retargets.
  const handlePointerLeave = () => cancelLongPress();

  const minesLeft = mines - countFlags(cells);

  const statusLabel =
    status === GAME_STATE.WON
      ? "Cleared"
      : status === GAME_STATE.LOST
      ? "Boom"
      : status === GAME_STATE.PLAYING
      ? "Playing"
      : "Ready";

  return (
    // `w-max max-w-full` shrinks this column to the board's own width (capped
    // so a wide board still scrolls rather than overflowing), and `mx-auto`
    // centres it. That's what puts the two counters directly above the board's
    // top-left and top-right corners instead of the page's.
    <div className="w-max max-w-full mx-auto">
      {/* Controls — every button lives here so the scoreboard row stays narrow
          enough that the board, not the buttons, sets this column's width. */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {Object.entries(DIFFICULTIES)
          .filter(([key]) => !compact || key === "beginner")
          .map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => changeDifficulty(key)}
              aria-pressed={difficulty === key}
              className={`text-sm px-3.5 py-2 rounded-control border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-black ${
                difficulty === key
                  ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                  : "border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:border-gray-500 dark:hover:border-zinc-500"
              }`}
            >
              {preset.label}
            </button>
          ))}

        <span
          aria-hidden="true"
          className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-1"
        />

        <button
          type="button"
          onClick={() => setFlagMode((f) => !f)}
          aria-pressed={flagMode}
          className={`flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-control border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-black ${
            flagMode
              ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
              : "border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:border-gray-500 dark:hover:border-zinc-500"
          }`}
        >
          <FlagIcon className="w-[18px] h-[18px]" />
          Flag
        </button>

        <button
          type="button"
          onClick={() => reset()}
          className="text-sm px-3.5 py-2 rounded-control border border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:border-gray-500 dark:hover:border-zinc-500 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-black"
        >
          New game
        </button>
      </div>

      {/* Nested so this block is sized by the board alone. On Beginner the
          controls row is wider than the board, and without this the counters
          would align to the controls' corners rather than the board's. */}
      <div className="w-max max-w-full mx-auto">
      {/* Counters sit flush with the board's corners */}
      <div className="flex items-center justify-between gap-4 mb-2">
        <span
          className="text-2xl font-semibold tabular-nums tracking-tight text-gray-800 dark:text-gray-100"
          aria-label={`${minesLeft} mines remaining`}
        >
          {pad(minesLeft)}
        </span>

        <span
          className="text-2xl font-semibold tabular-nums tracking-tight text-gray-800 dark:text-gray-100"
          aria-label={`${seconds} seconds elapsed`}
        >
          {pad(seconds)}
        </span>
      </div>

      {/* Board. The gap colour IS the grid line — it was dark:bg-zinc-800, the
          same as an unrevealed cell, so in dark mode the squares had no visible
          boundaries. Scrolls within itself so the page never scrolls sideways. */}
      <div className="overflow-x-auto custom-scrollbar pb-2">
        <div
          role="grid"
          aria-label={`Minesweeper board, ${label}, ${rows} by ${cols}`}
          className="grid gap-px bg-gray-300 dark:bg-zinc-600 border border-gray-300 dark:border-zinc-600 rounded-control p-px w-max"
          style={{ gridTemplateColumns: `repeat(${cols}, var(--ms-cell))` }}
        >
          {cells.map((row, r) =>
            row.map((cell, c) => {
              const showNumber = cell.revealed && !cell.mine && cell.adjacent > 0;

              // Background and text colour are kept separate so a cell never
              // carries two competing text-* classes — with both applied, which
              // one wins depends on stylesheet order rather than intent, and
              // number colours would silently lose.
              const previewed =
                chordPreview && chordPreview.has(`${r},${c}`);

              let surface;
              if (cell.exploded) {
                surface = "bg-red-500";
              } else if (cell.revealed) {
                surface = "bg-white dark:bg-zinc-900";
              } else if (previewed) {
                // Deliberately NOT the gap colour — it used to be exactly
                // gray-300 / zinc-600, which is what the gaps are painted in,
                // so a highlighted run swallowed its own grid lines.
                surface = "bg-blue-200 dark:bg-blue-900";
              } else {
                surface =
                  "bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700";
              }
              // zinc-900 revealed vs zinc-800 hidden against a zinc-600 gap
              // gives visible squares and a readable revealed/hidden contrast.

              let ink;
              if (showNumber) {
                ink = NUMBER_COLORS[cell.adjacent];
              } else if (cell.exploded) {
                ink = "text-white";
              } else if (cell.revealed) {
                ink = "text-gray-500 dark:text-zinc-400";
              } else {
                ink = "text-blue-600 dark:text-blue-400";
              }

              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  disabled={isOver}
                  onClick={() => handleClick(r, c)}
                  onContextMenu={handleContextMenu}
                  onMouseDown={(e) => handleMouseDown(e, r, c)}
                  onMouseEnter={(e) => handleMouseEnter(e, r, c)}
                  onMouseUp={handleMouseUp}
                  onPointerDown={(e) => handlePointerDown(e, r, c)}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerLeave}
                  onPointerCancel={handlePointerLeave}
                  aria-label={
                    cell.revealed
                      ? cell.mine
                        ? "Mine"
                        : `Revealed, ${cell.adjacent} adjacent mines`
                      : cell.flagged
                      ? "Flagged cell"
                      : "Hidden cell"
                  }
                  className={`h-[var(--ms-cell)] w-[var(--ms-cell)] flex items-center justify-center font-mono font-medium leading-none select-none transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 ${surface} ${ink}`}
                  style={{ fontSize: "calc(var(--ms-cell) * 0.5)" }}
                >
                  {cell.flagged && !cell.revealed && <FlagIcon />}
                  {cell.revealed && cell.mine && <MineIcon />}
                  {showNumber ? cell.adjacent : null}
                </button>
              );
            })
          )}
        </div>
      </div>

        <p
          className="mt-3 text-sm text-gray-500 dark:text-zinc-400"
          role="status"
          aria-live="polite"
        >
          {statusLabel}
          {status === GAME_STATE.WON &&
            finalTime !== null &&
            ` — ${label} in ${finalTime.toFixed(2)}s`}
        </p>
      </div>

      {status === GAME_STATE.WON && <Confetti runId={winRun} />}
    </div>
  );
};

export default Minesweeper;
