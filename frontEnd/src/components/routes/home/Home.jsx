import React, { useEffect } from "react";
import JobSearchComponent from "./JobSearchComponent";

function Home() {
  useEffect(() => {
    document.title = "Job$cout";
  }, []);

  return (
    <div>
      <JobSearchComponent />
    </div>
  );
}

export default Home;
