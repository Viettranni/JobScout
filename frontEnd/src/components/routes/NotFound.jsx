<<<<<<< HEAD
import React, { useEffect } from "react";

function NotFound() {

  useEffect(() => {document.title = "You're Off the Map!"}, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-2xl font-semibold text-blue-800 mb-6">Page Not Found</p>
        <div className="mb-8">
          <p className="text-blue-700">Oops! The page you're looking for doesn't exist.</p>
          <p className="text-blue-700">It might have been moved or deleted.</p>
        </div>
        <a 
          href="/" 
          className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Home
        </a>
      </div>
    </div>
  )
=======
import React from "react";

function NotFound() {
  return <div>This is NotFound</div>;
>>>>>>> vietbe
}

export default NotFound;