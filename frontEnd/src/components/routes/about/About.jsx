import React from "react";
import ClientsSection from "./ClientSection";
import JobScoutInfo from "./JobScoutInfo";
import JobOpportunities from "./JobOpportunities";

function About() {
  return (
    <div>
      <JobScoutInfo />
      <ClientsSection />
      <JobOpportunities />
    </div>
  );
}

export default About;
