import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({ 
  children, 
  onClick, 
  className = 'btn btn-primary', 
  disabled = false,
  loading = false,
  style = {},
  ...props 
}) => {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: disabled ? 1 : 0.95,
        transition: { duration: 0.1 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ 
            display: 'inline-block', 
            marginRight: '0.5rem',
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTop: '2px solid transparent',
            borderRadius: '50%'
          }}
        />
      )}
      {children}
    </motion.button>
  );
};

export default AnimatedButton; 