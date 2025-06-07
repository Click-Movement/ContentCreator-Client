import React from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

export default function PlansTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-blue-100 shadow-lg">
        <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white pb-4 border-b border-blue-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-blue-100 text-blue-600">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-blue-900">Subscription Plans</CardTitle>
              <CardDescription className="text-blue-700">
                Configure pricing and feature availability for different plans
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center py-12 px-4 rounded-lg border-2 border-dashed border-blue-200">
            <CreditCard className="h-12 w-12 text-blue-300 mb-4" />
            <h3 className="text-xl font-medium text-blue-800 mb-2">Subscription Plans Configuration</h3>
            <p className="text-blue-600 text-center mb-6">
              Set up your pricing tiers, feature availability, and subscription options
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Configure Subscription Plans
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}