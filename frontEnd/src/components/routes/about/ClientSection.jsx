<<<<<<< HEAD
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
=======
import React from "react";

const clientLogos = [
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/51bb9ce42fe8eb0fe7f7ecc57aa8ec6b71e16f5cecf32806fe80afe619de236f?placeholderIfAbsent=true&apiKey=4bc34976a91d45169acbfea9a1c1cef5",
    alt: "Client logo 1",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/5850e2d44ce006cfd863ae4028f03630ff4f1fbee4578e39f36095e7abff25f9?placeholderIfAbsent=true&apiKey=4bc34976a91d45169acbfea9a1c1cef5",
    alt: "Client logo 2",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/bd034f78d444461e1a8336a8a60917d5742600d2232e2cd77665e241b7f9fe8f?placeholderIfAbsent=true&apiKey=4bc34976a91d45169acbfea9a1c1cef5",
    alt: "Client logo 3",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/5f749740dda97b2c4a51ba479cca3e282010d04fd60a7c04778bc44b950305cf?placeholderIfAbsent=true&apiKey=4bc34976a91d45169acbfea9a1c1cef5",
    alt: "Client logo 4",
  },
  //   { src: "http://b.io/ext_15-", alt: "Client logo 5" },
  //   { src: "http://b.io/ext_16-", alt: "Client logo 6" },
];

const ClientLogo = ({ src, alt, className = "" }) => (
  <img
    loading="lazy"
    src={src}
    alt={alt}
    className={`object-contain w-60 h-30 ${className}`} // Fixed size for all logos
  />
);

const ClientsSection = () => {
  return (
    <section className="flex flex-col items-center px-20 pt-24 pb-16 bg-white max-md:px-5 max-md:pb-8">
      <header className="text-center mb-10">
        <h2 className="text-2xl font-semibold text-indigo-950">
          SELECTED CLIENTS
        </h2>
      </header>
      <div className="flex flex-wrap justify-center gap-10">
        {clientLogos.map((logo, index) => (
          <ClientLogo key={index} {...logo} />
        ))}
      </div>
    </section>
  );
};

export default ClientsSection;
>>>>>>> vietbe
