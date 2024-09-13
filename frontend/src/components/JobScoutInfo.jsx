import React from "react";

function JobScoutInfo() {
  return (
    <section className="flex overflow-hidden flex-col justify-center items-center px-16 py-28 bg-white max-md:px-5 max-md:py-12">
      <div className="w-full max-w-[1276px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <InfoContent />
          <InfoImage />
        </div>
      </div>
    </section>
  );
}

function InfoContent() {
  return (
    <div className="flex flex-col w-[66%] max-md:ml-0 max-md:w-full">
      <div className="flex flex-col self-stretch my-auto text-indigo-950 max-md:mt-10 max-md:max-w-full">
        <h1 className="text-4xl font-bold leading-[50px] max-md:max-w-full">
          Empower Your Job Search with JobScout's Custom Solutions
        </h1>
        <p className="self-start mt-12 text-3xl max-md:mt-10 max-md:max-w-full">
          JobScout is your ultimate job-searching platform, designed to
          streamline your job hunt by providing all the latest job postings in
          one convenient place.
        </p>
      </div>
    </div>
  );
}

function InfoImage() {
  return (
    <div className="flex flex-col ml-5 w-[34%] max-md:ml-0 max-md:w-full">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ecf8b504f438121755bf68da3a0aafb52b58034d1a76ddd8f710b0c2d5d77e38?placeholderIfAbsent=true&apiKey=4bc34976a91d45169acbfea9a1c1cef5"
        alt="JobScout platform illustration"
        className="object-contain w-full aspect-square max-md:mt-10"
      />
    </div>
  );
}

export default JobScoutInfo;
