import React from 'react';
import { motion } from 'framer-motion';
import { 
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { tableStyles, badgeStyles, buttonStyles } from '@/lib/dashboard-theme';
import UserAvatar from './UserAvatar';

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

type SubscriptionRowProps = {
  subscription: Subscription;
  index: number;
  tableRowVariants: any;
  onManage?: (subscription: Subscription) => void;
};

export default function SubscriptionRow({ 
  subscription, 
  index, 
  tableRowVariants,
  onManage
}: SubscriptionRowProps) {
  const getBadgeStyles = (plan: string) => {
    if (plan === 'premium') return badgeStyles.premium;
    if (plan === 'enterprise') return 'bg-red-100 hover:bg-red-200 text-red-800 border-red-200 hover:border-red-300';
    return '';
  };

  const getPlanBadgeVariant = (plan: string) => {
    if (plan === 'premium') return 'default';
    if (plan === 'enterprise') return 'destructive';
    return 'outline';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <Badge variant="outline" className={badgeStyles.success}>
          <span className="flex items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></span>
            {status}
          </span>
        </Badge>
      );
    }
    
    if (status === 'pending_cancellation') {
      return (
        <Badge variant="outline" className={badgeStyles.warning}>
          <span className="flex items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5"></span>
            Pending Cancellation
          </span>
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className={badgeStyles.danger}>
        <span className="flex items-center">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1.5"></span>
          {status}
        </span>
      </Badge>
    );
  };

  const getDaysLeft = (renewalDate: string) => {
    return Math.ceil((new Date(renewalDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <motion.tr
      key={subscription.id}
      custom={index}
      variants={tableRowVariants}
      className={tableStyles.row}
      whileHover={{ backgroundColor: "rgba(239, 246, 255, 0.6)" }}
    >
      <TableCell className={tableStyles.cell}>
        <div className="flex items-center gap-3">
          <UserAvatar name={subscription.user} avatar={subscription.avatar} />
          <div>
            <div className="font-medium">{subscription.user}</div>
            <div className="text-sm text-muted-foreground">{subscription.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className={tableStyles.cell}>
        <Badge 
          variant={getPlanBadgeVariant(subscription.plan)}
          className={getBadgeStyles(subscription.plan)}
        >
          {subscription.plan}
        </Badge>
      </TableCell>
      <TableCell className={tableStyles.cell}>
        {getStatusBadge(subscription.status)}
      </TableCell>
      <TableCell className={tableStyles.cell}>
        <div className="font-medium">${subscription.amount}</div>
      </TableCell>
      <TableCell className={tableStyles.cell}>
        {subscription.billingCycle}
      </TableCell>
      <TableCell className={tableStyles.cell}>
        {new Date(subscription.startDate).toLocaleDateString()}
      </TableCell>
      <TableCell className={tableStyles.cell}>
        <div className="flex flex-col">
          <div className="font-medium">
            {new Date(subscription.renewalDate).toLocaleDateString()}
          </div>
          {subscription.status === 'active' && (
            <div className="text-xs text-muted-foreground">
              {getDaysLeft(subscription.renewalDate)} days left
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className={`${tableStyles.cell} text-right`}>
        <Button 
          variant="outline" 
          size="sm"
          className={buttonStyles.outlineHover}
          onClick={() => onManage?.(subscription)}
        >
          Manage
        </Button>
      </TableCell>
    </motion.tr>
  );
}