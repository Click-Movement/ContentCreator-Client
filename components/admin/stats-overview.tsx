import React from 'react';
import { 
  Users, FileText, CreditCard, TrendingUp, 
  Activity, BarChart 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsOverviewProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalContent: number;
    creditsUsed: number;
    revenue: number;
    growth: number;
  };
}

export default function AdminStatsOverview({ stats }: StatsOverviewProps) {
  const statsItems = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: <Users className="h-4 w-4 text-blue-500" />,
      change: '+12% from last month',
      trend: 'up',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: <Activity className="h-4 w-4 text-green-500" />,
      change: '+5% from last month',
      trend: 'up',
    },
    {
      title: 'Total Content Items',
      value: stats.totalContent.toLocaleString(),
      icon: <FileText className="h-4 w-4 text-amber-500" />,
      change: '+18% from last month',
      trend: 'up',
    },
    {
      title: 'Credits Used',
      value: stats.creditsUsed.toLocaleString(),
      icon: <CreditCard className="h-4 w-4 text-purple-500" />,
      change: '+22% from last month',
      trend: 'up',
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: <BarChart className="h-4 w-4 text-emerald-500" />,
      change: '+8% from last month',
      trend: 'up',
    },
    {
      title: 'Month-over-Month Growth',
      value: `${stats.growth}%`,
      icon: <TrendingUp className="h-4 w-4 text-rose-500" />,
      change: '+2.1% from last month',
      trend: 'up',
    },
  ];

  return (
    <>
      {statsItems.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {item.title}
            </CardTitle>
            {item.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className={`text-xs ${item.trend === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center mt-1`}>
              {item.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}