import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import SearchButton from './SearchButton';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (searchTerm.trim() === '') return

    // Send the search query to the backend here

    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-4 justify-between py-2 pr-2 pl-6 mt-6 bg-white rounded-lg max-md:pl-4 max-md:max-w-full"
    >
      <label htmlFor="jobSearch" className="sr-only">
        Search for any job
      </label>
      <input
        id="jobSearch"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for any job..."
        className="my-auto text-xl text-neutral-500 bg-transparent border-none outline-none flex-grow"
        aria-label="Search for any job"
      />
      <SearchButton />
    </form>
  );
}

export default SearchBar;
