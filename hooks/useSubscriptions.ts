import { useState } from 'react';

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

type SubscriptionSummary = {
  totalRevenue: number;
  activeSubscribers: number;
  premiumUsers: number;
  enterpriseUsers: number;
  basicUsers: number;
  freeUsers: number;
  averageRevenue: number;
  growthRate: number;
  [key: string]: any;
};

export default function useSubscriptions() {
  const [activeTab, setActiveTab] = useState('active');
  
  // Mock subscription summary data
  const summary: SubscriptionSummary = {
    totalRevenue: 84950,
    activeSubscribers: 743,
    premiumUsers: 312,
    enterpriseUsers: 48,
    basicUsers: 383,
    freeUsers: 504,
    averageRevenue: 114.33,
    growthRate: 18.4
  };
  
  // Mock subscription data
  const subscriptions: Subscription[] = [
    {
      id: '1',
      user: 'John Smith',
      email: 'john@example.com',
      plan: 'premium',
      status: 'active',
      amount: 49.99,
      billingCycle: 'monthly',
      startDate: '2025-02-15T00:00:00Z',
      renewalDate: '2025-06-15T00:00:00Z',
      avatar: null
    },
    {
      id: '2',
      user: 'Sarah Johnson',
      email: 'sarah@example.com',
      plan: 'enterprise',
      status: 'active',
      amount: 199.99,
      billingCycle: 'monthly',
      startDate: '2025-03-10T00:00:00Z',
      renewalDate: '2025-06-10T00:00:00Z',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    },
    {
      id: '3',
      user: 'Michael Brown',
      email: 'michael@example.com',
      plan: 'basic',
      status: 'active',
      amount: 19.99,
      billingCycle: 'annual',
      startDate: '2025-01-05T00:00:00Z',
      renewalDate: '2026-01-05T00:00:00Z',
      avatar: null
    },
    {
      id: '4',
      user: 'Emily Davis',
      email: 'emily@example.com',
      plan: 'premium',
      status: 'pending_cancellation',
      amount: 49.99,
      billingCycle: 'monthly',
      startDate: '2025-04-20T00:00:00Z',
      renewalDate: '2025-06-20T00:00:00Z',
      avatar: 'https://i.pravatar.cc/150?u=emily'
    },
    {
      id: '5',
      user: 'David Wilson',
      email: 'david@example.com',
      plan: 'basic',
      status: 'expired',
      amount: 19.99,
      billingCycle: 'monthly',
      startDate: '2025-01-12T00:00:00Z',
      renewalDate: '2025-05-12T00:00:00Z',
      avatar: null
    }
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleManageSubscription = (subscription: Subscription) => {
    console.log('Managing subscription:', subscription);
    // This would open a modal or navigate to edit page
  };

  const handleManagePlans = () => {
    console.log('Managing plans');
    // This would navigate to plans management page
  };

  const getFilteredSubscriptions = (status?: string) => {
    if (!status || status === 'all') return subscriptions;
    return subscriptions.filter(sub => sub.status === status);
  };

  return {
    activeTab,
    summary,
    subscriptions,
    filteredSubscriptions: {
      active: getFilteredSubscriptions('active'),
      pending: getFilteredSubscriptions('pending_cancellation'),
      expired: getFilteredSubscriptions('expired'),
      all: subscriptions
    },
    handleTabChange,
    handleManageSubscription,
    handleManagePlans
  };
}