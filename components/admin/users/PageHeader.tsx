import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { buttonStyles } from '@/lib/dashboard-theme';
/* eslint-disable @typescript-eslint/no-explicit-any */
type PageHeaderProps = {
  title: string;
  onAddUser?: () => void;
  variants?: any;
};

export default function PageHeader({ title, onAddUser, variants }: PageHeaderProps) {
  return (
    <motion.div 
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
      variants={variants}
    >
      <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
        {title}
      </h1>
      <Button 
        className={`mt-4 sm:mt-0 ${buttonStyles.primary}`}
        onClick={onAddUser}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Add New User
      </Button>
    </motion.div>
  );
}