import { Search, ScanSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from "react";

function SearchButton() {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <button
            type="submit"
            className="relative flex justify-center items-center px-3 rounded-lg bg-indigo-950 h-[60px] w-[60px] hover:bg-hover overflow-hidden"
            aria-label="Submit search"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={isHovered ? 'scan' : 'search'}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.1 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {isHovered ? (
                        <ScanSearch className="w-full h-full p-1 text-white" strokeWidth={1.5} />
                    ) : (
                        <Search className="w-full h-full p-4 text-white" strokeWidth={3} />
                    )}
                </motion.div>
            </AnimatePresence>
        </button>
    )
}

export default SearchButton;