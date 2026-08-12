import { useEffect, useState } from "react";

export const BESTS_KEY = "minesweeperBests";
export const BESTS_EVENT = "minesweeper:bests";

const read = () => {
  try {
    const raw = window.localStorage.getItem(BESTS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    // Corrupt entry or storage disabled — treat as "no bests yet".
    return {};
  }
};

/**
 * Stores `seconds` for a difficulty if it beats what's there.
 * Returns true when a new best was set, so the UI can say so.
 */
export function recordBest(difficulty, seconds) {
  if (typeof window === "undefined") return false;

  const bests = read();
  const previous = bests[difficulty];
  if (typeof previous === "number" && previous <= seconds) return false;

  try {
    window.localStorage.setItem(
      BESTS_KEY,
      JSON.stringify({ ...bests, [difficulty]: seconds })
    );
  } catch (err) {
    return false;
  }

  window.dispatchEvent(new Event(BESTS_EVENT));
  return true;
}

/**
 * Empty on the server and on the first client render, then filled in an effect —
 * reading localStorage during render would desync from the server's markup.
 */
export function useMinesweeperBests() {
  const [bests, setBests] = useState({});

  useEffect(() => {
    const sync = () => setBests(read());
    sync();
    window.addEventListener(BESTS_EVENT, sync);
    window.addEventListener("storage", sync); // another tab
    return () => {
      window.removeEventListener(BESTS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return bests;
}
