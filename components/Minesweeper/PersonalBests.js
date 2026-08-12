import React from "react";
import { DIFFICULTIES } from "./engine";
import { useMinesweeperBests } from "../../utils/minesweeperBests";

/**
 * Times set on this site, kept in localStorage. Separate from the
 * minesweeper.online panel below it — these are two different things and
 * shouldn't read as one table.
 */
const PersonalBests = () => {
  const bests = useMinesweeperBests();
  const rows = Object.entries(DIFFICULTIES).filter(
    ([key]) => typeof bests[key] === "number"
  );

  return (
    <div className="mt-16">
      <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-gray-400 dark:text-zinc-500 mb-2">
        Your best times here
      </h2>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-zinc-400 border-t border-gray-200 dark:border-zinc-800 pt-4">
          No wins yet — clear a board and your time shows up here. Saved in this
          browser only.
        </p>
      ) : (
        <dl className="border-t border-gray-200 dark:border-zinc-800">
          {rows.map(([key, preset]) => (
            <div
              key={key}
              className="grid grid-cols-1 tablet:grid-cols-[9rem_1fr] gap-x-8 gap-y-1 py-4 border-b border-gray-200 dark:border-zinc-800"
            >
              <dt className="font-mono text-xs uppercase tracking-[0.15em] text-gray-400 dark:text-zinc-500 pt-0.5">
                {preset.label}
              </dt>
              <dd className="font-mono text-sm text-gray-700 dark:text-gray-300">
                {Number(bests[key]).toFixed(2)}s
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
};

export default PersonalBests;
