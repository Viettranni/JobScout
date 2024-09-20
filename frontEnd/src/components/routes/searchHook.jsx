import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function searchHook() {
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (searchTerm.trim() === '') return

    // Send the search query to the backend here
    // This is where you would typically make an API call

    navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
  }

  return {
    searchTerm,
    setSearchTerm,
    handleSubmit
  }
}