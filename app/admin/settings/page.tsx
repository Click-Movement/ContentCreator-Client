'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent } from '@/components/ui/tabs';

// Import our modular components
import SettingsHeader from '@/components/admin/settings/SettingsHeader';
import SettingsTabs from '@/components/admin/settings/SettingsTabs';
import GeneralTab from '@/components/admin/settings/tabs/GeneralTab';
import PlansTab from '@/components/admin/settings/tabs/PlansTab';
import ApiTab from '@/components/admin/settings/tabs/ApiTab';
import NotificationsTab from '@/components/admin/settings/tabs/NotificationsTab';
import SecurityTab from '@/components/admin/settings/tabs/SecurityTab';

export default function AdminSettingsPage() {
  const [saveStatus, setSaveStatus] = useState<Record<string, boolean>>({});

  const handleSave = (section: string) => {
    setSaveStatus({ ...saveStatus, [section]: true });
    
    // Reset success status after 2 seconds
    setTimeout(() => {
      setSaveStatus((prev) => ({ ...prev, [section]: false }));
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SettingsHeader lastUpdated="June 7, 2025" />

      <Tabs defaultValue="general" className="mb-8">
        <SettingsTabs />
        
        <TabsContent value="general" className="mt-8">
          <GeneralTab 
            containerVariants={containerVariants}
            itemVariants={itemVariants}
            saveStatus={saveStatus}
            handleSave={handleSave}
          />
        </TabsContent>
        
        <TabsContent value="plans" className="mt-6">
          <PlansTab />
        </TabsContent>
        
        <TabsContent value="api" className="mt-6">
          <ApiTab />
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <NotificationsTab 
            saveStatus={saveStatus}
            handleSave={handleSave}
          />
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <SecurityTab 
            saveStatus={saveStatus}
            handleSave={handleSave}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}