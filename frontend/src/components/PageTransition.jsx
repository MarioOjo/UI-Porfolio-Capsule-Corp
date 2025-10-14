import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();

  // Consistent "Power Up" animation for all pages - DBZ style
  const pageVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.9, 
      rotateY: 15,
      filter: 'blur(8px)'
    },
    in: { 
      opacity: 1, 
      scale: 1, 
      rotateY: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: "easeOut",
        scale: {
          type: "spring",
          stiffness: 100,
          damping: 15
        }
      }
    },
    out: { 
      opacity: 0, 
      scale: 1.05, 
      rotateY: -15,
      filter: 'blur(4px)',
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="w-full"
    >
      {/* Consistent energy aura effect for all pages */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 0.2, 0],
          scale: [0.8, 1.2, 1.5],
        }}
        transition={{ 
          duration: 0.5,
          ease: "easeOut"
        }}
        style={{
          background: 'radial-gradient(circle, rgba(255,165,0,0.08) 0%, rgba(255,69,0,0.05) 40%, transparent 70%)'
        }}
      />
      
      {children}
    </motion.div>
  );
};

export default PageTransition;