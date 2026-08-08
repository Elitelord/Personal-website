import React from "react";

const WorkCard = ({ img, name, description, onClick }) => {
  return (
    <div
      className="group rounded-surface p-4 laptop:p-6 cursor-pointer bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 transition-colors duration-200 hover:border-gray-400 dark:hover:border-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      role="link"
      tabIndex={0}
    >
      <div className="relative rounded-control overflow-hidden w-full aspect-video border border-gray-200 dark:border-zinc-800">
        <img alt={name} className="h-full w-full object-cover" src={img} />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <h1 className="flex items-center gap-2 text-2xl laptop:text-3xl font-semibold tracking-tight text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {name ? name : "Project Name"}
          <span
            aria-hidden="true"
            className="text-lg text-gray-400 dark:text-zinc-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition duration-200"
          >
            &#8599;
          </span>
        </h1>
        <h2 className="text-lg laptop:text-xl font-normal text-gray-500 dark:text-zinc-400">
          {description ? description : "Description"}
        </h2>
      </div>
    </div>
  );
};

export default WorkCard;
