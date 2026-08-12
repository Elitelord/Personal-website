import React from "react";
import data from "../../data/portfolio.json";

/**
 * minesweeper.online renders profiles client-side over socket.io — there is no
 * REST endpoint to proxy — so these are maintained by hand in portfolio.json.
 * Renders nothing at all until that block exists, so the page never ships
 * placeholder numbers.
 */
const MinesweeperStats = () => {
  const stats = data.minesweeper;
  const modes = stats && stats.modes ? stats.modes.filter((m) => m.bestTime) : [];
  if (!modes.length) return null;

  return (
    <div className="mt-16">
      <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-gray-400 dark:text-zinc-500 mb-2">
        minesweeper.online
      </h2>

      <dl className="border-t border-gray-200 dark:border-zinc-800">
        {modes.map((mode) => (
          <div
            key={mode.label}
            className="grid grid-cols-1 tablet:grid-cols-[9rem_1fr] gap-x-8 gap-y-1 py-4 border-b border-gray-200 dark:border-zinc-800"
          >
            <dt className="font-mono text-xs uppercase tracking-[0.15em] text-gray-400 dark:text-zinc-500 pt-0.5">
              {mode.label}
            </dt>
            <dd className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-mono">{mode.bestTime}</span>
              {mode.rank && (
                <span className="text-gray-500 dark:text-zinc-400">
                  {"  ·  rank "}
                  <span className="font-mono">{mode.rank}</span>
                  {mode.outOf && (
                    <>
                      {" of "}
                      <span className="font-mono">{mode.outOf}</span>
                    </>
                  )}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      {stats.profileUrl && (
        <a
          href={stats.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 font-mono text-xs text-blue-600 dark:text-blue-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-black rounded-control"
        >
          View profile &#8599;
        </a>
      )}
    </div>
  );
};

export default MinesweeperStats;
