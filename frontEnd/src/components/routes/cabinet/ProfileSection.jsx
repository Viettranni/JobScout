import React from "react";
import defaultProfileImage from "../../../assets/profile.png";
import { Link } from "react-router-dom"; // Make sure you are using React Router
import Loading from "../common/Loading";
import { useUser } from "../../context/UserContext";

const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

export function ProfileSection() {
  const { user } = useUser(); // Use the global user context

  // If user data is not yet available, show a loading message
  if (!user) {
    return <Loading message="Loading user data..." />;
  }

  const profileImageUrl = user.profileImage
    ? `${url}/${user.profileImage}`
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
