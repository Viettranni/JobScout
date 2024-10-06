import React from "react";
import emptypage from "../../../assets/emptypage.jpg";
import { Link } from "react-router-dom";

export default function EmptyState({ title, message, actionText, link }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <img src={emptypage} alt="Empty state" className="w-64 h-64 mb-8" />
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
      <p className="text-gray-600 text-center mb-6">{message}</p>
      <Link
        to="/search"
        className="bg-indigo-950 text-white px-6 py-2 rounded-md hover:bg-hover"
      >
        {actionText}
      </Link>
    </div>
  );
}
