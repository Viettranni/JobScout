import React, { useState } from "react";
import DuunitoriLogo from "../../.././assets/DuunitoriLogo.png";
import LinkedInLogo from "../../.././assets/LinkedInLogo.png";
import IndeedLogo from "../../.././assets/IndeedLogo.png";
import TePalvelutLogo from "../../.././assets/TePalvelutLogo.png";
import OikotieLogo from "../../.././assets/OikotieLogo.png";
import JoblyLogo from "../../.././assets/JoblyLogo.png";

const logos = [
  {
    name: "duunitori",
    src: DuunitoriLogo,
    alt: "Duunitor logo",
    link: "https://duunitori.fi/",
  },
  {
    name: "linkedin",
    src: LinkedInLogo,
    alt: "LinkedIn logo",
    link: "https://www.linkedin.com/",
  },
  {
    name: "indeed",
    src: IndeedLogo,
    alt: "Indeed logo",
    link: "https://www.indeed.com/",
  },
  {
    name: "te-palvelut",
    src: TePalvelutLogo,
    alt: "TE-palvelut logo",
    link: "https://www.te-palvelut.fi/",
  },
  {
    name: "oikotie",
    src: OikotieLogo,
    alt: "Oikotie logo",
    link: "https://www.oikotie.fi/",
  },
  {
    name: "jobly",
    src: JoblyLogo,
    alt: "Jobly logo",
    link: "https://jobly.fi/",
  },
];

function Component() {
  const [hoveredLogo, setHoveredLogo] = useState(null);

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">SELECTED CLIENTS</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center justify-items-center">
        {logos.map((logo) => (
          <a
            key={logo.name}
            href={logo.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-[250px] h-[80px] relative flex items-center justify-center"
            onMouseEnter={() => setHoveredLogo(logo.name)}
            onMouseLeave={() => setHoveredLogo(null)}
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className={`w-full h-full object-contain transition-all duration-300 ${
                hoveredLogo === logo.name
                  ? "opacity-100 scale-110"
                  : "opacity-50 grayscale"
              }`}
            />
          </a>
        ))}
      </div>
    </div>
  );
}

export default Component;
