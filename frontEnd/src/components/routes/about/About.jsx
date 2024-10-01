import React from "react";
import ClientsSection from "./ClientSection";
import JobScoutInfo from "./JobScoutInfo";
import JobOpportunities from "./JobOpportunities";
import TeamShowcase from "./TeamShowcase";

function About() {
  return (
    <div>
      <JobScoutInfo />
      <ClientsSection />
      <JobOpportunities />
      <TeamShowcase />
    </div>
  );
}

export default About;
