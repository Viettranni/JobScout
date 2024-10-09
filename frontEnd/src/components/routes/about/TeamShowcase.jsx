import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import avatarSaed from "../../../assets/Saed-profile.png";
import avatarViet from "../../../assets/Viet-profile.jpeg";
import avatarPavel from "../../../assets/Pavel-profile.jpg";
import avatarIvan from "../../../assets/Ivan-profile.jpg";
import Saedback from "../../../assets/saedback.png";
import Vietback from "../../../assets/vietback.png";
import Pavelback from "../../../assets/pavelback.png";
import Ivanback from "../../../assets/ivanback.png";

export default function Component() {
  const teamMembers = [
    {
      name: "Saed Abukar",
      role: "Backend Developer",
      linkedin: "https://www.linkedin.com/in/saed-abukar-a1bb592b5/",
      github: "https://github.com/SaedAbukar",
      background: Saedback,
      image: avatarSaed,
      email: "saed.a.abukar@gmail.com", // Replace with Saed's email
    },
    {
      name: "Ivan Budanov",
      role: "Frontend Developer",
      linkedin: "https://www.linkedin.com/in/ivan-budanov/",
      github: "https://github.com/BudaOP",
      background: Ivanback,
      image: avatarIvan,
      email: "ivan.budanov@example.com", // Replace with Ivan's email
    },
    {
      name: "Viet Tran",
      role: "Backend Developer",
      linkedin: "https://www.linkedin.com/in/viet-tran-826399262/",
      github: "https://github.com/Viettranni",
      background: Vietback,
      image: avatarViet,
      email: "vttranviett@gmail.com", // Replace with Viet's email
    },
    {
      name: "Pavel Degterev",
      role: "Frontend Developer",
      linkedin: "https://www.linkedin.com/in/pavel-degterev/",
      github: "https://github.com/Pawaffle",
      background: Pavelback,
      image: avatarPavel,
      email: "pdegterev@gmail.com", // Replace with Pavel's email
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      {/* Section Title */}
      <h2 className="text-3xl font-bold text-center mb-12 text-indigo-950">
        Meet Our Team
      </h2>

      {/* Team Member Cards */}
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
              {/* Background image for card header */}
              <div
                className="h-28 w-full bg-cover bg-top"
                style={{ backgroundImage: `url(${member.background})` }}
              ></div>
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
                {/* Contact Button with mailto: link */}
                <a
                  href={`mailto:${member.email}?subject=Hello%20${member.name}`}
                >
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">
                    Contact
                  </button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
