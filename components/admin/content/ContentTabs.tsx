import React from 'react';
import { motion } from 'framer-motion';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { buttonStyles } from '@/lib/dashboard-theme';

type ContentTabsProps = {
  activeTab: string;
  onTabChange: (value: string) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onFilter: () => void;
  variants?: any;
};

export default function ContentTabs({ 
  activeTab, 
  onTabChange, 
  onSearch, 
  searchQuery, 
  onFilter,
  variants 
}: ContentTabsProps) {
  return (
    <motion.div variants={variants}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <TabsList className="bg-blue-50/80 p-1 mb-4 sm:mb-0">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-300"
            onClick={() => onTabChange('all')}
          >
            All Content
          </TabsTrigger>
          <TabsTrigger 
            value="published" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-300"
            onClick={() => onTabChange('published')}
          >
            Published
          </TabsTrigger>
          <TabsTrigger 
            value="draft" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-300"
            onClick={() => onTabChange('draft')}
          >
            Drafts
          </TabsTrigger>
          <TabsTrigger 
            value="archived" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-300"
            onClick={() => onTabChange('archived')}
          >
            Archived
          </TabsTrigger>
        </TabsList>
        
        <div className="flex w-full sm:w-auto sm:max-w-sm items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search content..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className={`mr-2 ${buttonStyles.outlineHover}`}
            onClick={() => onSearch(searchQuery)}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className={buttonStyles.outlineHover}
            onClick={onFilter}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}