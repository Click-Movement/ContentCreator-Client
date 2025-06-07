import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { buttonStyles } from '@/lib/dashboard-theme';
/* eslint-disable @typescript-eslint/no-explicit-any */
type PaginationProps = {
  currentPage: number;
  totalPages: number;
  itemsShowing: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  variants?: any;
};

export default function Pagination({
  currentPage,
  totalPages,
  itemsShowing,
  totalItems,
  onPageChange,
  variants
}: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageButtons = () => {
    // Simplified pagination - just showing current and next page
    // Could be expanded to show more page numbers
    return (
      <>
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
      </>
    );
  };

  return (
    <motion.div 
      className="flex items-center justify-between mt-6"
      variants={variants}
    >
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{itemsShowing}</span> of <span className="font-medium">{totalItems}</span> users
      </p>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          className={buttonStyles.outlineHover}
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        
        {renderPageButtons()}
        
        <Button 
          variant="outline" 
          size="sm"
          className={buttonStyles.outlineHover}
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
}