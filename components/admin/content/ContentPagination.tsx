import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { buttonStyles } from '@/lib/dashboard-theme';

type ContentPaginationProps = {
  currentPage: number;
  totalPages: number;
  showingCount: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  variants?: any;
};

export default function ContentPagination({
  currentPage,
  totalPages,
  showingCount,
  totalCount,
  onPageChange,
  variants
}: ContentPaginationProps) {
  return (
    <motion.div 
      className="flex items-center justify-between mt-6"
      variants={variants}
    >
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{showingCount}</span> of <span className="font-medium">{totalCount}</span> items
      </p>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          className={buttonStyles.outlineHover}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className={currentPage === 1 ? "bg-blue-50 text-blue-600 border-blue-200" : buttonStyles.outlineHover}
          onClick={() => onPageChange(1)}
        >
          1
        </Button>
        
        {totalPages > 1 && (
          <Button 
            variant="outline" 
            size="sm"
            className={currentPage === 2 ? "bg-blue-50 text-blue-600 border-blue-200" : buttonStyles.outlineHover}
            onClick={() => onPageChange(2)}
          >
            2
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm"
          className={buttonStyles.outlineHover}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
}