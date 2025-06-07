'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TabsContent } from '@/components/ui/tabs';
import PageHeader from '@/components/admin/subscriptions/PageHeader';
import StatCards from '@/components/admin/subscriptions/StatCards';
import SubscriptionTabs from '@/components/admin/subscriptions/SubscriptionTabs';
import SubscriptionCard from '@/components/admin/subscriptions/SubscriptionCard';
import useSubscriptions from '@/hooks/useSubscriptions';

export default function AdminSubscriptionsPage() {
  const {
    activeTab,
    summary,
    filteredSubscriptions,
    handleTabChange,
    handleManageSubscription,
    handleManagePlans
  } = useSubscriptions();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({ 
      y: 0, 
      opacity: 1,
      transition: { 
        delay: i * 0.1,
        duration: 0.4
      } 
    })
  };
  
  const tableRowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.4
      } 
    })
  };

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <PageHeader 
        title="Subscription Management" 
        onManagePlans={handleManagePlans}
        variants={itemVariants}
      />

      <StatCards summary={summary} cardVariants={cardVariants} />

      <SubscriptionTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        variants={itemVariants} 
      />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <TabsContent value="active" className="mt-6">
            <SubscriptionCard
              title="Active Subscriptions"
              description="Manage currently active subscription plans"
              subscriptions={filteredSubscriptions.active}
              itemVariants={itemVariants}
              tableRowVariants={tableRowVariants}
              onManage={handleManageSubscription}
              itemCount={filteredSubscriptions.active.length}
              totalCount={filteredSubscriptions.active.length}
            />
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            <SubscriptionCard
              title="Pending Subscriptions"
              description="Subscriptions that are pending activation or cancellation"
              subscriptions={filteredSubscriptions.pending}
              itemVariants={itemVariants}
              tableRowVariants={tableRowVariants}
              onManage={handleManageSubscription}
              itemCount={filteredSubscriptions.pending.length}
              totalCount={filteredSubscriptions.pending.length}
            />
          </TabsContent>
          
          <TabsContent value="expired" className="mt-6">
            <SubscriptionCard
              title="Expired Subscriptions"
              description="Subscriptions that have expired or been cancelled"
              subscriptions={filteredSubscriptions.expired}
              itemVariants={itemVariants}
              tableRowVariants={tableRowVariants}
              onManage={handleManageSubscription}
              emptyMessage="No expired subscriptions found"
              itemCount={filteredSubscriptions.expired.length}
              totalCount={filteredSubscriptions.expired.length}
            />
          </TabsContent>
          
          <TabsContent value="all" className="mt-6">
            <SubscriptionCard
              title="All Subscriptions"
              description="Complete list of all subscription records"
              subscriptions={filteredSubscriptions.all}
              itemVariants={itemVariants}
              tableRowVariants={tableRowVariants}
              onManage={handleManageSubscription}
              itemCount={filteredSubscriptions.all.length}
              totalCount={filteredSubscriptions.all.length}
            />
          </TabsContent>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}