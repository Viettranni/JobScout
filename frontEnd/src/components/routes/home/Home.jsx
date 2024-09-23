<<<<<<< HEAD
import React, { useEffect } from "react";
import JobSearchComponent from "./SearchComponent";

function Home() {

  useEffect(() => {document.title = 'Job$cout'}, [])

=======
import React from "react";
import JobSearchComponent from "./JobSearchComponent";

function Home() {
>>>>>>> vietbe
  return(
    <div>
        <JobSearchComponent />
    </div>   
  );
}

export default Home;
