import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import avatarSaed from "../../../assets/default.png";
import avatarViet from "../../../assets/default.png";
import avatarPavel from "../../../assets/default.png";
import avatarIvan from "../../../assets/default.png";

export default function Component() {
  const teamMembers = [
    {
      name: "Saed Abukar",
      role: "Backend Developer",
      linkedin: "#",
      github: "#",
      color: "bg-blue-500",
      image: avatarSaed,
    },
    {
      name: "Ivan Budanov",
      role: "Frontend Developer",
      linkedin: "#",
      github: "https://github.com/BudaOP",
      color: "bg-purple-500",
      image: avatarIvan,
    },
    {
      name: "Viet Tran",
      role: "Backend Developer",
      linkedin: "#",
      github: "#",
      color: "bg-green-500",
      image: avatarViet,
    },
    {
      name: "Pavel Degterev",
      role: "Frontend Developer",
      linkedin: "#",
      github: "#",
      color: "bg-red-500",
      image: avatarPavel,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className={`relative w-full max-w-xl transform ${
              index % 2 === 0
                ? "md:self-start" // Left-aligned for even indices
                : "md:self-end" // Right-aligned for odd indices
            } ${
              index === 1
                ? "md:translate-y-16"
                : index === 2
                ? "md:-translate-y-16"
                : ""
            } mb-8`} // Adds bottom space between cards
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className={`h-28 ${member.color}`}></div>
              <div className="px-6 py-6 flex items-center">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white -mt-20 mr-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </div>
              <div className="px-6 py-4 flex justify-between items-center border-t">
                <div className="flex space-x-3">
                  <a
                    href={member.linkedin}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaLinkedin size={24} />
                  </a>
                  <a
                    href={member.github}
                    className="text-gray-800 hover:text-gray-600"
                  >
                    <FaGithub size={24} />
                  </a>
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
