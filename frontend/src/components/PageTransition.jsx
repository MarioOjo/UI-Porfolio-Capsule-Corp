// PageTransition.js
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: 20
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0
  },
  out: {
    opacity: 0,
    scale: 1.02,
    y: -20
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};

const PageTransition = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={window.location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;