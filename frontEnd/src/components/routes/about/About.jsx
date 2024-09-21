import React, { useEffect } from "react";
import ClientsSection from "./ClientSection";
import JobScoutInfo from "./JobScoutInfo";
import JobOpportunities from "./JobOpportunities";

function About() {

  useEffect(() => {document.title = 'Our Job Trailblazers'}, [])

    return(
      <div>
          <ClientsSection />
          <JobScoutInfo />
          <JobOpportunities />
      </div>   
    );
  }
  
  export default About;