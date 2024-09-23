import React, { useState } from "react";
<<<<<<< HEAD
import { searchHook } from '@/components/routes/searchHook'
import SearchButton from './SearchButton';

function SearchBar() {
  const { searchTerm, setSearchTerm, handleSubmit } = searchHook()

=======

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };
>>>>>>> vietbe

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
<<<<<<< HEAD
      <SearchButton />
=======
      <button
        type="submit"
        className="flex justify-center items-center px-3 rounded-lg bg-indigo-950 h-[60px] w-[60px] hover:bg-blue-900"
        aria-label="Submit search"
      >
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b7e90b84f0a6b9c832e54981051a677d08bd4353be69657bc6fc5e1ac4f0f093?placeholderIfAbsent=true&apiKey=4bc34976a91d45169acbfea9a1c1cef5"
          alt="search icon"
          className="object-contain w-6 aspect-square"
        />
      </button>
>>>>>>> vietbe
    </form>
  );
}

export default SearchBar;
