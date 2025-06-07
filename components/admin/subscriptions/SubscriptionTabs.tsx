import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
/* eslint-disable @typescript-eslint/no-explicit-any */
type SubscriptionTabsProps = {
  activeTab: string;
  onTabChange: (value: string) => void;
  variants?: any;
};

export default function SubscriptionTabs({ 
  activeTab, 
  onTabChange, 
  variants 
}: SubscriptionTabsProps) {
  return (
    <motion.div variants={variants}>
      <Tabs 
        value={activeTab}
        onValueChange={onTabChange}
        className="mb-6"
      >
        <TabsList className="bg-blue-50/80 p-1">
          <TabsTrigger 
            value="active"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-300"
          >
            Active
          </TabsTrigger>
          <TabsTrigger 
            value="pending"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-300"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger 
            value="expired"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-300"
          >
            Expired
          </TabsTrigger>
          <TabsTrigger 
            value="all"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-300"
          >
            All Subscriptions
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </motion.div>
  );
}