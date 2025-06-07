// ahmadali507/projects/upwork_hourly/ContentCreator-Client/components/ui/animations.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface FadeProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export const FadeIn = ({ 
  children, 
  duration = 0.5, 
  delay = 0, 
  className = "" 
}: FadeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SlideUp = ({ 
  children, 
  duration = 0.5, 
  delay = 0, 
  className = "" 
}: FadeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SlideIn = ({ 
  children, 
  duration = 0.5, 
  delay = 0, 
  className = "" 
}: FadeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const ScaleIn = ({ 
  children, 
  duration = 0.3, 
  delay = 0, 
  className = "" 
}: FadeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};