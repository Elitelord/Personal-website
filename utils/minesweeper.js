import { useEffect, useState } from "react";

export const UNLOCK_KEY = "minesweeperUnlocked";
export const UNLOCK_EVENT = "minesweeper:unlocked";

/** Records the discovery and tells any mounted listeners in this tab. */
export function unlockMinesweeper() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(UNLOCK_KEY, "1");
  } catch (err) {
    // Private mode / storage disabled — the egg still works this session.
  }
  window.dispatchEvent(new Event(UNLOCK_EVENT));
}

/**
 * Always false on the server and on the first client render, then flips in an
 * effect. Reading localStorage during render would produce markup that differs
 * from the server's and trip a hydration mismatch.
 */
export function useMinesweeperUnlocked() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        setUnlocked(window.localStorage.getItem(UNLOCK_KEY) === "1");
      } catch (err) {
        setUnlocked(false);
      }
    };

    read();
    window.addEventListener(UNLOCK_EVENT, read);
    window.addEventListener("storage", read); // unlocked in another tab

    return () => {
      window.removeEventListener(UNLOCK_EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, []);

  return unlocked;
}
