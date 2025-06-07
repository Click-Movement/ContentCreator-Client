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
import { Key } from 'lucide-react';

export default function ApiTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-purple-100 shadow-lg">
        <div className="h-1 w-full bg-gradient-to-r from-purple-400 to-indigo-500"></div>
        <CardHeader className="bg-gradient-to-r from-purple-50 to-white pb-4 border-b border-purple-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-purple-100 text-purple-600">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-purple-900">API Configuration</CardTitle>
              <CardDescription className="text-purple-700">
                Manage API keys and access settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center py-12 px-4 rounded-lg border-2 border-dashed border-purple-200">
            <Key className="h-12 w-12 text-purple-300 mb-4" />
            <h3 className="text-xl font-medium text-purple-800 mb-2">API Settings Configuration</h3>
            <p className="text-purple-600 text-center mb-6">
              Generate API keys, manage access permissions, and configure rate limits
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Manage API Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}