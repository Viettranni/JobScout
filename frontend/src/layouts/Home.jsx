import React from "react";
import JobSearchComponent from "../components/JobSearchComponent";
import ClientsSection from "../components/ClientSection";
import JobScoutInfo from "../components/JobScoutInfo";
import JobOpportunities from "../components/JobOpportunities";

function Home() {
  return(
    <div>
    {/* Other components go here */}
        <JobSearchComponent />
        <ClientsSection />
        <JobScoutInfo />
        <JobOpportunities />
    </div>   
  );
}

export default Home;
