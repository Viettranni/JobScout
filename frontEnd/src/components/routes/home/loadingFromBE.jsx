import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function loadingHook() {
  const navigate = useNavigate()

  const handleSubmit = async (searchTerm) => {

    // Send the search query to the backend here
    // This is where you would typically make an API call

    navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
  }

  return {
    handleSubmit
  }
}