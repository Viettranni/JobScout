import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function searchHook() {
  const [searchTerm, setSearchTerm] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build the query string using both search term and city
    const query = new URLSearchParams({
      searchTerm: searchTerm || "",
      city: city || "",
    }).toString();

    // Navigate to the search results page with the query params
    navigate(`/search?${query}`);
  };

  return {
    searchTerm,
    setSearchTerm,
    city,
    setCity,
    handleSubmit,
  };
}
