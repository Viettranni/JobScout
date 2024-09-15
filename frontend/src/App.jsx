import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import "./index.css";

import Layout from "./components/layout/Layout";
import Home from "./components/routes/home/Home"; // in own dir
import Search from "./components/routes/search/Search";
import Cabinet from "./components/routes/cabinet/Cabinet";
import About from "./components/routes/about/About";  // in own dir
import NotFound from "./components/routes/NotFound";

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
