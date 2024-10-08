import React, { useEffect, useState } from "react";
import defaultProfileImage from "../../../assets/profile.png";
import axios from "axios";
import { Link } from "react-router-dom"; // Make sure you are using React Router
import Loading from "../common/Loading";

export function ProfileSection() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Function to fetch user profile data
    const fetchProfile = async () => {
      try {
        const profileResponse = await axios.get(
          "http://localhost:4000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Add Authorization header with token
            },
          }
        );
        setUser(profileResponse.data); // Set the profile data to the `user` state
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile(); // Call the function to fetch profile data when component mounts
  }, []); // Empty dependency array to run this effect only once on mount

  // If user data is not yet available, show a loading message
  if (!user) {
    return <Loading message="Loading user data..." />;
  }

  // Determine the profile image to use: user's uploaded image or the default one
  const profileImageUrl = user.profileImage
    ? `http://localhost:4000${user.profileImage}`
    : defaultProfileImage;

  // Render user profile
  return (
    <div className="bg-blue-600 text-white p-6 rounded-lg mb-8">
      <div className="flex items-center">
        <img
          src={profileImageUrl}
          alt={`${user.firstname} ${user.lastname}`}
          width={80}
          height={80}
          className="rounded-full mr-4"
        />
        <div>
          <h1 className="text-2xl font-bold">
            {user.firstname} {user.lastname}
          </h1>
          <p>Email: {user.email}</p>

          {/* Additional information with link to profile page */}
          <p className="text-sm italic mt-2">
            More info available on the profile page.{" "}
            <Link
              to="/profile"
              className="text-blue-300 hover:text-blue-100 underline ml-2"
            >
              View Profile
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
