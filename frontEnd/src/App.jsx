import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
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
import CoverLetterDisplay from "./components/routes/profile/CoverLetterDisplay";

import { ProtectedRoute } from "./components/context/ProtectedRoute";
import { AuthProvider } from "./components/context/contextProvider";
import { UserProvider } from "./components/context/UserContext";

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
              <ProtectedRoute>
                <PageTransition>
                  <Cabinet />
                </PageTransition>
              </ProtectedRoute>
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
              <ProtectedRoute>
                <PageTransition>
                  <Profile />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cover-letter"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <CoverLetterDisplay />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/not-found"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AnimatedRoutes />
        </BrowserRouter>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
