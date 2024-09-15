import React from "react";
import ClientsSection from "../components/ClientSection";
import JobScoutInfo from "../components/JobScoutInfo";
import JobOpportunities from "../components/JobOpportunities";

function About() {
    return(
      <div>
          <ClientsSection />
          <JobScoutInfo />
          <JobOpportunities />
      </div>   
    );
  }
  
  export default About;