import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { buttonStyles } from '@/lib/dashboard-theme';

type PageHeaderProps = {
  title: string;
  onCreateContent?: () => void;
  variants?: any;
};

export default function PageHeader({ title, onCreateContent, variants }: PageHeaderProps) {
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
        onClick={onCreateContent}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Content
      </Button>
    </motion.div>
  );
}