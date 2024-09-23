<<<<<<< HEAD
import { BrowserRouter, Route, Routes, useLocation  } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ScrollToTop from './ScrollToTop';
import PageTransition from "./transition"
=======
import { BrowserRouter, Route, Routes } from "react-router-dom";
>>>>>>> vietbe
import React from "react";
import "./index.css";

import Layout from "./components/layout/Layout";
import Home from "./components/routes/home/Home"; // in own dir
import Search from "./components/routes/search/Search";
import Cabinet from "./components/routes/cabinet/Cabinet";
import About from "./components/routes/about/About";  // in own dir
import NotFound from "./components/routes/NotFound";

<<<<<<< HEAD

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<PageTransition><Home /></PageTransition>} />
          <Route path="search" element={<PageTransition><Search /></PageTransition>} />
          <Route path="cabinet" element={<PageTransition><Cabinet /></PageTransition>} />
          <Route path="about" element={<PageTransition><About /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

=======
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

>>>>>>> vietbe
export default App;