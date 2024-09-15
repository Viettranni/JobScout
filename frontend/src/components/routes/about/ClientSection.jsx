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
