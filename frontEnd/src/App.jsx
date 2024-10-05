import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ScrollToTop from "./components/routes/common/ScrollToTop";
import PageTransition from "./transition";
import React from "react";
import "./index.css";

import Layout from "./components/layout/Layout";
import Home from "./components/routes/home/Home"; // in own dir
import Search from "./components/routes/search/Search";
import Cabinet from "./components/routes/cabinet/Cabinet";
import About from "./components/routes/about/About"; // in own dir
import Profile from "./components/routes/profile/Profile";
import NotFound from "./components/routes/common/NotFound";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="search"
            element={
              <PageTransition>
                <Search />
              </PageTransition>
            }
          />
          <Route
            path="cabinet"
            element={
              <PageTransition>
                <Cabinet />
              </PageTransition>
            }
          />
          <Route
            path="about"
            element={
              <PageTransition>
                <About />
              </PageTransition>
            }
          />
          <Route
            path="profile"
            element={
              <PageTransition>
                <Profile />
              </PageTransition>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />
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

export default App;
