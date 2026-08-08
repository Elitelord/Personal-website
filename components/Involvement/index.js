import React from "react";

// A spec-sheet row rather than a card: dates in a fixed mono column on the left,
// everything else on the right, separated by hairlines. Matches the Skills list
// on the resume page. Collapses to a single column below `tablet`, where the
// date sits above the org name.
const Involvement = ({ name, position, dates, description, onClick, children }) => {
  return (
    <div
      className={`grid grid-cols-1 tablet:grid-cols-[9rem_1fr] gap-x-8 gap-y-1 py-6 border-b border-gray-200 dark:border-zinc-800 ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div className="font-mono text-xs text-gray-400 dark:text-zinc-500 tablet:pt-1.5 whitespace-nowrap">
        {dates ? dates : "Dates"}
      </div>

      <div>
        <h3 className="text-lg laptop:text-xl font-semibold text-gray-900 dark:text-gray-100 leading-snug">
          {name ? name : "Involvement Name"}
        </h3>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
          {position ? position : "Involvement Position"}
        </p>

        {description && description.length > 0 && (
          <ul className="list-disc ml-4 mt-3 space-y-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400 marker:text-gray-300 dark:marker:text-zinc-600">
            {description.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        )}

        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
};

export default Involvement;
