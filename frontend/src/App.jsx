import React from "react";
import "./index.css";

import Navbar from "./components/Navbar";
import JobSearchComponent from "./components/JobSearchComponent";
import ClientsSection from "./components/ClientSection";
import JobScoutInfo from "./components/JobScoutInfo";
import JobOpportunities from "./components/JobOpportunities";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div>
      <Navbar />
      {/* Other components go here */}
      <JobSearchComponent />
      <ClientsSection />
      <JobScoutInfo />
      <JobOpportunities />
      <Footer />
    </div>
  );
};

export default App;
