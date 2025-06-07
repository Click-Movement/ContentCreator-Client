import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  CreditCard,
  Key,
  Bell,
  Shield,
} from 'lucide-react';

const tabItems = [
  { value: "general", icon: Settings, label: "General" },
  { value: "plans", icon: CreditCard, label: "Plans & Pricing" },
  { value: "api", icon: Key, label: "API Settings" },
  { value: "notifications", icon: Bell, label: "Notifications" },
  { value: "security", icon: Shield, label: "Security" }
];

export default function SettingsTabs() {
  return (
    <TabsList className="bg-gradient-to-r from-gray-100 to-slate-100 p-1 rounded-xl w-full overflow-x-auto flex-nowrap">
      {tabItems.map(({ value, icon: Icon, label }) => (
        <TabsTrigger 
          key={value}
          value={value}
          className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-300 px-4 py-2 flex items-center gap-2"
        >
          <Icon className="h-4 w-4" /> {label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}