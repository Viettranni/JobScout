import React from "react";
import ClientsSection from "./ClientSection";
import JobScoutInfo from "./JobScoutInfo";
import JobOpportunities from "./JobOpportunities";

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