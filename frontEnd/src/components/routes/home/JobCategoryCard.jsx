import React from "react";
import { useNavigate } from "react-router-dom";

function JobCategoryCard({ title, newJobs, icon, description }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to the search page with the selected category as the search term
    const query = new URLSearchParams({
      searchTerm: title,
    }).toString();

    console.log(`/search?${query}`); // Debug URL construction
    navigate(`/search?${query}`);
  };

  return (
    <div
      className="flex-1 min-w-[200px] h-40 bg-primary rounded-lg p-4 flex flex-col justify-between text-white transition-all duration-300 ease-in-out hover:bg-hover job-card-cursor"
      onClick={handleCardClick}
    >
      <div className="flex items-center space-x-2">
        {icon}
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {description && (
        <p className="text-sm text-gray-300 mt-4">{description}</p>
      )}
    </div>
  );
}

export default JobCategoryCard;
