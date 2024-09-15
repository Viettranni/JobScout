import React from "react";

function JobCategoryCard({ title, newJobs, icon }) {
  return (
    <article className="flex flex-col items-start p-4 rounded-xl bg-indigo-950 aspect-[4/3] text-white">
      <img
        loading="lazy"
        src={icon}
        alt={`${title} category icon`}
        className="object-contain w-22 h-22 mb-8"
      />
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {newJobs !== null && (
        <p className="text-xs">{newJobs} new jobs posted last week</p>
      )}
    </article>
  );
}

export default JobCategoryCard;
