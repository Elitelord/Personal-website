import React from "react";

const ServiceCard = ({ name, description }) => {
  return (
    <div className="w-full p-2 mob:p-4 rounded-control transition-colors ease-out duration-200 hover:bg-gray-50 dark:hover:bg-zinc-900 link">
      <h1 className="text-3xl">{name ? name : "Heading"}</h1>
      <p className="mt-5 opacity-40 text-xl">
        {description
          ? description
          : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "}
      </p>
    </div>
  );
};

export default ServiceCard;
