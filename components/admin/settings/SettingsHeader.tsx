import React from 'react';
import { motion } from 'framer-motion';

type SettingsHeaderProps = {
  lastUpdated: string;
};

export default function SettingsHeader({ lastUpdated }: SettingsHeaderProps) {
  return (
    <motion.div 
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Settings
      </h1>
      <div className="text-sm text-gray-500 mt-2 sm:mt-0">
        Last updated: {lastUpdated}
      </div>
    </motion.div>
  );
}