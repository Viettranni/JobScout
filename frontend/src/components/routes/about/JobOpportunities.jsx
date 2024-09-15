import React from "react";

const FeatureCard = ({ image, title, description }) => (
  <article className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
    <div className="flex flex-col grow items-center text-2xl font-bold text-center text-indigo-950 max-md:mt-10">
      <div className="px-7 pb-0 text-xl rounded-3xl aspect-square bg-zinc-300 leading-[50px] w-[324px] max-md:pt-24 max-md:pb-28 max-md:pl-5">
        {image}
      </div>
      <h2 className="mt-7 leading-[50px]">{title}</h2>
      <p className="self-stretch mt-5">{description}</p>
    </div>
  </article>
);

const features = [
  {
    image: "pic of creating account",
    title: "Create your account",
    description:
      "Sign up now to personalize your job search experience and unlock all features.",
  },
  {
    image: "pic of exploring",
    title: "Explore Jobs You Need",
    description:
      "Browse and filter job listings tailored to your skills and career goals.",
  },
  {
    image: "pic of checking notif",
    title: "Get Instant Notifications",
    description:
      "Stay informed with real-time alerts whenever new jobs matching your criteria are posted.",
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
              image={feature.image}
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
