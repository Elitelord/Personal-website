import React from "react";

const Involvement = ({name, position, dates, description, onClick }) => {
  return (
    <div
      className="overflow-hidden rounded-lg p-2 laptop:p-4 first:ml-0 link"
      onClick={onClick}
    >
   
      <h1 className="mt-5 text-3xl font-medium">
        {name ? name : "Involvement Name"}
      </h1>
      <h1 className="mt-5 text-3xl font-medium">
        {position ? position : "Involvement Position"}
      </h1>
      <h2 className="text-xl opacity-50">
        {dates ? dates : "Dates"}
      </h2>
      <h2 className="text-xl opacity-50">
      {description && description.length > 0 && (
          <ul className="list-disc">
            {description.map((bullet, index) => (
              <li key={index} className="text-md my-1 opacity-70">
                {bullet}
              </li>
            ))}
          </ul>
        )}
        {/* {description ? description : "Description"} */}
      </h2>
    </div>
  );
};

export default Involvement;
