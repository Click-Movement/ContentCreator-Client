import React from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { cardStyles } from '@/lib/dashboard-theme';
import SubscriptionsTable from './SubscriptionsTable';

type Subscription = {
  id: string;
  user: string;
  email: string;
  plan: string;
  status: string;
  amount: number;
  billingCycle: string;
  startDate: string;
  renewalDate: string;
  avatar: string | null;
};
/* eslint-disable @typescript-eslint/no-explicit-any */
type SubscriptionCardProps = {
  title: string;
  description: string;
  subscriptions: Subscription[];
  itemVariants: any;
  tableRowVariants: any;
  onManage?: (subscription: Subscription) => void;
  emptyMessage?: string;
  itemCount?: number;
  totalCount?: number;
};

export default function SubscriptionCard({
  title,
  description,
  subscriptions,
  itemVariants,
  tableRowVariants,
  onManage,
  emptyMessage = "No subscriptions to display",
  itemCount,
  totalCount
}: SubscriptionCardProps) {
  return (
    <Card className={cardStyles.baseStyles}>
      <CardHeader className={cardStyles.gradientHeader}>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="mt-1">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subscriptions.length > 0 ? (
          <SubscriptionsTable
            subscriptions={subscriptions}
            tableRowVariants={tableRowVariants}
            onManage={onManage}
          />
        ) : (
          <div className="flex justify-center py-12 text-muted-foreground">
            {emptyMessage}
          </div>
        )}
        
        <motion.div
          className="flex items-center justify-between mt-6"
          variants={itemVariants}
        >
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{itemCount || subscriptions.length}</span> of{" "}
            <span className="font-medium">{totalCount || subscriptions.length}</span> subscriptions
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}