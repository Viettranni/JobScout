import { loadingHook } from './loadingFromBE'
import React from "react";

function JobCategoryCard({ index, title, description, icon }) {
  const { handleSubmit } = loadingHook()

  const handleClick = () => {
    setSearchTermAndSubmit(title)
  }

  return (
    <div
      key={index}
      className="flex-1 min-w-[200px] h-40 bg-primary rounded-lg p-4 flex flex-col justify-between text-white transition-all duration-300 ease-in-out hover:bg-hover"
      onClick={() => { handleSubmit(title) }}
    >
      <div className="flex items-center space-x-2">
        {icon}
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <p className="text-sm text-gray-300 mt-4">{description}</p>
    </div>
  );
}

export default JobCategoryCard;
