import React from 'react';
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  CreditCard,
} from 'lucide-react';
import StatCard from './StatCard';
/* eslint-disable @typescript-eslint/no-explicit-any */
type StatCardsProps = {
  summary: {
    totalRevenue: number;
    activeSubscribers: number;
    premiumUsers: number;
    averageRevenue: number;
    growthRate: number;
    [key: string]: any;
  };
  cardVariants: any;
};

export default function StatCards({ summary, cardVariants }: StatCardsProps) {
  const statsItems = [
    {
      title: "Total Revenue",
      value: `$${summary.totalRevenue.toLocaleString()}`,
      change: `+${summary.growthRate}% from last month`,
      icon: <DollarSign className="h-4 w-4" />,
      bgColor: "from-green-500 to-emerald-500",
      iconBg: "bg-green-100 text-green-600"
    },
    {
      title: "Active Subscribers",
      value: summary.activeSubscribers,
      change: "+12% from last month",
      icon: <Users className="h-4 w-4" />,
      bgColor: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-100 text-blue-600"
    },
    {
      title: "Premium Users",
      value: summary.premiumUsers,
      change: "+8% from last month",
      icon: <CreditCard className="h-4 w-4" />,
      bgColor: "from-violet-500 to-purple-500",
      iconBg: "bg-violet-100 text-violet-600"
    },
    {
      title: "Average Revenue",
      value: `$${summary.averageRevenue}`,
      change: "+5% from last month",
      icon: <BarChart3 className="h-4 w-4" />,
      bgColor: "from-amber-500 to-yellow-500",
      iconBg: "bg-amber-100 text-amber-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {statsItems.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          bgColor={stat.bgColor}
          iconBg={stat.iconBg}
          index={index}
          variants={cardVariants}
        />
      ))}
    </div>
  );
}