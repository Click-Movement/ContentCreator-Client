'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Zap, Database, Server, Cpu } from 'lucide-react';

export default function AdminSystemStatus() {
  const services = [
    {
      name: 'API Services',
      status: 'operational',
      icon: <Zap className="h-4 w-4" />,
      latency: '24ms',
      color: 'text-blue-500'
    },
    {
      name: 'Database',
      status: 'operational',
      icon: <Database className="h-4 w-4" />,
      latency: '45ms',
      color: 'text-green-500'
    },
    {
      name: 'Content Storage',
      status: 'operational',
      icon: <Server className="h-4 w-4" />,
      latency: '32ms',
      color: 'text-amber-500'
    },
    {
      name: 'AI Processing',
      status: 'degraded',
      icon: <Cpu className="h-4 w-4" />,
      latency: '128ms',
      color: 'text-red-500'
    }
  ];
  
  const progressVariants = {
    initial: {
      width: 0
    },
    animate: {
      width: '72%',
      transition: {
        duration: 1,
        ease: 'easeInOut'
      }
    }
  };
  
  const staggerVariants = {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    initial: { 
      opacity: 0, 
      x: -20 
    },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4
      } 
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="overflow-hidden border-gray-200 hover:border-gray-300 transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current status of platform services
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <motion.div 
            className="space-y-4"
            variants={staggerVariants}
            initial="initial"
            animate="animate"
          >
            {services.map((service, index) => (
              <motion.div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02, 
                  backgroundColor: 'rgba(243, 244, 246, 1)' 
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`${service.color}`}>
                    {service.icon}
                  </div>
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-muted-foreground">{service.latency}</span>
                  <Badge 
                    variant={service.status === 'operational' ? 'outline' : 'destructive'}
                    className={`transition-all ${
                      service.status === 'operational' 
                        ? 'bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 border-green-200' 
                        : ''
                    }`}
                  >
                    {service.status === 'operational' ? (
                      <div className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        <span>Operational</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        <span>Degraded</span>
                      </div>
                    )}
                  </Badge>
                </div>
              </motion.div>
            ))}

            <div className="pt-4 border-t mt-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Resources Usage</h4>
                <span className="text-xs text-muted-foreground">72%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-2 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" 
                  variants={progressVariants}
                  initial="initial"
                  animate="animate"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                CPU and memory usage across all instances.
              </p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}