import React from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';
import { cardStyles } from '@/lib/dashboard-theme';
import { LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  bgColor: string;
  iconBg: string;
  index: number;
  variants: any;
};

export default function StatCard({ 
  title, 
  value, 
  change, 
  icon, 
  bgColor, 
  iconBg,
  index,
  variants
}: StatCardProps) {
  return (
    <motion.div
      custom={index}
      variants={variants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className={`overflow-hidden ${cardStyles.baseStyles}`}>
        <div className={`h-1 w-full bg-gradient-to-r ${bgColor}`}></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {title}
          </CardTitle>
          <div className={`rounded-full p-2 ${iconBg}`}>
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <motion.div 
            className="flex items-center mt-1 text-xs text-green-500"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <ArrowUpRight className="mr-1 h-3 w-3" />
            {change}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}