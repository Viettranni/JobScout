import React, { useState } from "react";
import DuunitoriLogo from "../../.././assets/DuunitoriLogo.png";
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

function ClientSection() {
  const [hoveredLogo, setHoveredLogo] = useState(null);

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
        SELECTED CLIENTS
      </h2>

      {/* First row with three logos */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-16 mb-8 md:mb-12">
        {logos.slice(0, 3).map((logo) => (
          <a
            key={logo.name}
            href={logo.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-[180px] md:max-w-[300px] h-[80px] md:h-[120px] flex items-center justify-center"
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

      {/* Second row with two logos */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-16">
        {logos.slice(3, 5).map((logo) => (
          <a
            key={logo.name}
            href={logo.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-[180px] md:max-w-[300px] h-[80px] md:h-[120px] flex items-center justify-center"
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

export default ClientSection;
