import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import "./index.css";

import Layout from "./Layout";
import Home from "./routes/Home";
import Search from "./routes/Search";
import Cabinet from "./routes/Cabinet";
import About from "./routes/About";
import NotFound from "./routes/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cabinet" element={<Cabinet />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/registration" element={<Registration />} /> */}

          <Route path="*" element={<NotFound />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
