import React from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Check } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

type SettingCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  color: 'blue' | 'purple' | 'green' | 'amber';
  lastUpdated: string;
  onSave: () => void;
  isSaved: boolean;
  children: React.ReactNode;
  variants?: any;
  className?: string;
};

export default function SettingCard({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  lastUpdated, 
  onSave, 
  isSaved, 
  children,
  variants,
  className = ''
}: SettingCardProps) {
  // Color mappings for different aspects of the card
  const colorMap = {
    blue: {
      border: 'border-blue-100',
      gradient: 'from-blue-400 to-blue-600',
      header: 'from-blue-50 to-white',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      descColor: 'text-blue-700',
      buttonFrom: 'from-blue-500',
      buttonTo: 'to-blue-700',
      buttonHoverFrom: 'hover:from-blue-600',
      buttonHoverTo: 'hover:to-blue-800',
    },
    purple: {
      border: 'border-purple-100',
      gradient: 'from-purple-400 to-purple-600',
      header: 'from-purple-50 to-white',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      titleColor: 'text-purple-900',
      descColor: 'text-purple-700',
      buttonFrom: 'from-purple-500',
      buttonTo: 'to-purple-700',
      buttonHoverFrom: 'hover:from-purple-600',
      buttonHoverTo: 'hover:to-purple-800',
    },
    green: {
      border: 'border-green-100',
      gradient: 'from-green-400 to-green-600',
      header: 'from-green-50 to-white',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      descColor: 'text-green-700',
      buttonFrom: 'from-green-500',
      buttonTo: 'to-green-700',
      buttonHoverFrom: 'hover:from-green-600',
      buttonHoverTo: 'hover:to-green-800',
    },
    amber: {
      border: 'border-amber-100',
      gradient: 'from-amber-400 to-amber-600',
      header: 'from-amber-50 to-white',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      titleColor: 'text-amber-900',
      descColor: 'text-amber-700',
      buttonFrom: 'from-amber-500',
      buttonTo: 'to-amber-700',
      buttonHoverFrom: 'hover:from-amber-600',
      buttonHoverTo: 'hover:to-amber-800',
    },
  };

  const colors = colorMap[color];

  return (
    <motion.div variants={variants}>
      <Card className={`overflow-hidden ${colors.border} shadow-md hover:shadow-lg transition-all duration-300 ${className}`}>
        <div className={`h-1 w-full bg-gradient-to-r ${colors.gradient}`}></div>
        <CardHeader className={`bg-gradient-to-r ${colors.header} pb-4`}>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-md ${colors.iconBg} ${colors.iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className={colors.titleColor}>{title}</CardTitle>
              <CardDescription className={colors.descColor}>
                {description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {children}
        </CardContent>
        <CardFooter className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Last updated: {lastUpdated}
          </span>
          <Button 
            onClick={onSave}
            className={`bg-gradient-to-r ${colors.buttonFrom} ${colors.buttonTo} ${colors.buttonHoverFrom} ${colors.buttonHoverTo} text-white border-none shadow-sm flex items-center gap-2 transition-all duration-300`}
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}