import React from "react";

const WorkCard = ({ img, name, description, onClick }) => {
  return (
    <div
      className="group overflow-hidden rounded-2xl p-4 laptop:p-6 transition-all duration-300 ease-out hover:bg-slate-100 dark:hover:bg-zinc-900 hover:shadow-2xl hover:-translate-y-2 cursor-pointer border border-transparent dark:hover:border-zinc-800"
      onClick={onClick}
    >
      <div className="relative rounded-xl overflow-hidden transition-all ease-out duration-500 w-full aspect-video shadow-lg">
        <img
          alt={name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform ease-out duration-500"
          src={img}
        />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <h1 className="text-2xl laptop:text-3xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-fuchsia-400 transition-colors duration-300">
          {name ? name : "Project Name"}
        </h1>
        <h2 className="text-lg laptop:text-xl font-medium text-slate-600 dark:text-slate-300">
          {description ? description : "Description"}
        </h2>
      </div>
    </div>
  );
};

export default WorkCard;
