import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 0,
    scale: 1
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: 10,
    scale: 1
  }
};

const pageTransition = {
  type: 'intera',
  ease: 'anticipate',
  duration: 0.6
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;