'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Download, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboardHeader() {
  // Get current date for display
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <motion.h1 
          className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Admin Dashboard
        </motion.h1>
        <motion.div 
          className="flex items-center mt-2 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <CalendarDays className="mr-1 h-4 w-4" />
          <span>{formattedDate}</span>
        </motion.div>
      </div>
      <motion.div 
        className="flex gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button 
          variant="outline" 
          className="hover:bg-gray-100 hover:text-gray-900 transition-all"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button 
            className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white transition-all shadow-sm hover:shadow-md w-full"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}