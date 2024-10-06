import PageLink from "./PageLink";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "../context/contextProvider";

const pageLinks = [
  { id: 1, href: "/", text: "Home" },
  { id: 2, href: "/search", text: "Search" },
  { id: 3, href: "/cabinet", text: "Cabinet" },
  { id: 4, href: "/about", text: "About" },
];

const PageLinks = ({
  parentClass,
  itemClass,
  isSearchButtonSpecial = false,
}) => {
  // Framer motion variants for the bounce animation (all nav links)
  const linkAnimation = {
    rest: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.3 } },
  };

  const { isAuthenticated } = useAuth();

  // Simplified search button style
  const searchButtonClass =
    "inline-flex items-center justify-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br shadow-lg shadow-blue-500/50 font-medium rounded-lg text-lg px-5 py-2";

  return (
    <div className={`flex items-center ${parentClass}`}>
      {pageLinks
        .filter((link) => link.text !== "Cabinet" || isAuthenticated) // Filter out Cabinet link if user is not authenticated
        .map((link) => {
          const isSearchLink = link.text === "Search"; // Check if the current link is Search

          // Apply special class only for the "Search" button when isSearchButtonSpecial is true
          const appliedClass =
            isSearchLink && isSearchButtonSpecial
              ? searchButtonClass
              : itemClass;

          return (
            <motion.div
              key={link.id}
              variants={linkAnimation}
              initial="rest"
              whileHover="hover"
              className="inline-block"
            >
              <PageLink link={link} itemClass={appliedClass} />
            </motion.div>
          );
        })}
    </div>
  );
};

export default PageLinks;
