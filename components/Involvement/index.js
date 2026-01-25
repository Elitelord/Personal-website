import React from "react";

const Involvement = ({ name, position, dates, description, onClick }) => {
  return (
    <div
      className="cursor-pointer overflow-hidden rounded-lg p-5 laptop:p-6 transition-all duration-300 hover:scale-[1.02] bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex flex-col laptop:flex-row justify-between items-start mb-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {name ? name : "Involvement Name"}
          </h1>
          <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-1">
            {position ? position : "Involvement Position"}
          </h2>
        </div>
        <div className="mt-2 laptop:mt-0">
          <h2 className="text-sm font-medium opacity-60 bg-gray-200 dark:bg-zinc-800 px-3 py-1 rounded-full inline-block">
            {dates ? dates : "Dates"}
          </h2>
        </div>
      </div>

      <div className="text-base opacity-70 mt-4">
        {description && description.length > 0 && (
          <ul className="list-disc ml-5 space-y-2">
            {description.map((bullet, index) => (
              <li key={index} className="leading-relaxed">
                {bullet}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Involvement;
