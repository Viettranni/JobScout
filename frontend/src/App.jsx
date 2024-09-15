import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import "./index.css";

import Layout from "./layouts/Layout";
import Home from "./layouts/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<Home />} />
          {/* <Route path="/search" element={<Services />} />
          <Route path="/cabinet" element={<Tours />} />
          <Route path="/about" element={<About />} /> */}
          {/* <Route path="/registration" element={<Registration />} /> */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
