import React from "react";
import profileImage from "../../../assets/profile.png";

export function ProfileSection() {
  return (
    <div className="bg-blue-600 text-white p-6 rounded-lg mb-8">
      <div className="flex items-center">
        <img
          src={profileImage}
          alt="Abdul Jabaar"
          width={80}
          height={80}
          className="rounded-full mr-4"
        />
        <div>
          <h1 className="text-2xl font-bold">Abdul Jabaar</h1>
          <p>Email: Abdulka@givemeurmoney.com</p>
          <p>Phone: +358524379993</p>
        </div>
      </div>
    </div>
  );
}
