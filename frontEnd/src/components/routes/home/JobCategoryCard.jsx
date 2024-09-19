import React from "react";

function JobCategoryCard({ index, title, description, icon }) {
  return (
    <div
      key={index}
      className="flex-shrink-0 w-64 h-40 bg-primary rounded-lg p-4 flex flex-col justify-between text-white transition-all duration-300 ease-in-out hover:bg-hover"
    >
      <div className="flex items-center space-x-2">
        {icon}
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
  );
}

export default JobCategoryCard;
