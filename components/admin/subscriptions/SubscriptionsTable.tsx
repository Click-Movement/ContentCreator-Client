import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { tableStyles } from '@/lib/dashboard-theme';
import SubscriptionRow from './SubscriptionRow';

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

type SubscriptionsTableProps = {
  subscriptions: Subscription[];
  tableRowVariants: any;
  onManage?: (subscription: Subscription) => void;
};

export default function SubscriptionsTable({ 
  subscriptions,
  tableRowVariants,
  onManage
}: SubscriptionsTableProps) {
  return (
    <div className="rounded-md overflow-hidden border">
      <Table>
        <TableHeader>
          <TableRow className={tableStyles.headerRow}>
            <TableHead>User</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Billing Cycle</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Renewal Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription, index) => (
            <SubscriptionRow 
              key={subscription.id}
              subscription={subscription} 
              index={index}
              tableRowVariants={tableRowVariants}
              onManage={onManage}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}