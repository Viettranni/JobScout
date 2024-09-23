import React from "react";
import { useState } from "react";
import Step1 from "../../../assets/opp1.png";
import Step2 from "../../../assets/opp2.png";
import Step3 from "../../../assets/opp3.png";
import Gif1 from "../../../assets/step1video.gif";

const FeatureCard = ({ staticImage, gifImage, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
      <div className="flex flex-col grow items-center text-2xl font-bold text-center text-indigo-950 max-md:mt-10">
        {/* Restrict hover effect to the image container only */}
        <div
          className="px-7 pb-0 text-xl aspect-square w-[400px] h-[400px] max-md:w-[300px] max-md:h-[300px] overflow-hidden rounded-3xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={isHovered ? gifImage : staticImage}
            alt={title}
            className={`object-contain w-full h-full rounded-3xl transition-transform duration-300 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
        </div>
        <h2 className="mt-7 leading-[50px]">{title}</h2>
        {/* Apply a thinner font for the description */}
        <p className="self-stretch mt-5 font-light">{description}</p>
      </div>
    </article>
  );
};

const features = [
  {
    staticImage: Step1, // Static image
    gifImage: Gif1, // Path to the GIF
    title: "Create your account",
    description:
      "Sign up now to personalize your job search experience and unlock all features.",
  },
  {
    staticImage: Step2,
    gifImage: Gif1,
    title: "Explore Jobs You Need",
    description:
      "Browse and filter job listings tailored to your skills and career goals.",
  },
  {
    staticImage: Step3,
    gifImage: Gif1,
    title: "View Your Saved Jobs in the Cabinet",
    description:
      "Keep track of jobs you’ve saved and revisit them as you search for the perfect opportunity.",
  },
];

const JobOpportunities = () => {
  return (
    <main className="flex overflow-hidden flex-col px-16 py-20 bg-white max-md:px-5">
      <h1 className="text-4xl font-bold leading-none text-center text-indigo-950 max-md:mr-2 max-md:max-w-full">
        Stay ahead—be the first to discover new job opportunities.
      </h1>
      <section className="mt-16 max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              staticImage={feature.staticImage}
              gifImage={feature.gifImage}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default JobOpportunities;
