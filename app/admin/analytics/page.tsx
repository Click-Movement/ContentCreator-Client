'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Download,
  TrendingUp,
  Activity,
  Users,
  DollarSign,
  CreditCard,
  ArrowUp
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Mock data for trends
  const monthlyTrends = [
    { month: 'Jan', users: 65, content: 52, revenue: 48 },
    { month: 'Feb', users: 59, content: 55, revenue: 45 },
    { month: 'Mar', users: 80, content: 67, revenue: 60 },
    { month: 'Apr', users: 81, content: 70, revenue: 65 },
    { month: 'May', users: 75, content: 73, revenue: 68 },
    { month: 'Jun', users: 85, content: 80, revenue: 75 },
    { month: 'Jul', users: 90, content: 85, revenue: 78 },
    { month: 'Aug', users: 95, content: 87, revenue: 82 },
    { month: 'Sep', users: 100, content: 90, revenue: 85 },
    { month: 'Oct', users: 105, content: 95, revenue: 90 },
    { month: 'Nov', users: 110, content: 97, revenue: 92 },
    { month: 'Dec', users: 115, content: 100, revenue: 95 }
  ];
  
  // Calculate trends: current vs previous month
  const getCurrentTrend = (data: any[], key: string) => {
    const latestMonth = data[data.length - 1];
    const previousMonth = data[data.length - 2];
    const change = ((latestMonth[key] - previousMonth[key]) / previousMonth[key]) * 100;
    return {
      latest: latestMonth[key],
      change: change.toFixed(1)
    };
  };

  const userTrend = getCurrentTrend(monthlyTrends, 'users');
  const contentTrend = getCurrentTrend(monthlyTrends, 'content');
  const revenueTrend = getCurrentTrend(monthlyTrends, 'revenue');

  // Data for simplified distribution visualization
  const revenueBreakdown = [
    { name: 'Premium', value: 42, color: 'bg-blue-400' },
    { name: 'Basic', value: 28, color: 'bg-purple-400' },
    { name: 'Enterprise', value: 18, color: 'bg-green-400' },
    { name: 'Other', value: 12, color: 'bg-amber-400' }
  ];

  const creditUsage = [
    { name: 'Articles', value: 45, color: 'bg-amber-400' },
    { name: 'Social', value: 25, color: 'bg-green-400' },
    { name: 'Emails', value: 20, color: 'bg-blue-400' },
    { name: 'Other', value: 10, color: 'bg-purple-400' }
  ];

  // Simple horizontal bar visualization component
  const SimpleBarVisualization = ({ data }: { data: any[] }) => {
    return (
      <div className="space-y-4 pt-2">
        {data.map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{item.name}</span>
              <span className="text-gray-500">{item.value}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${item.color}`}
                style={{ width: `${item.value}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Simple trend indicator component
  const TrendIndicator = ({ 
    value, 
    change, 
    label, 
    color 
  }: { 
    value: number | string, 
    change: string, 
    label: string, 
    color: string 
  }) => {
    const isPositive = parseFloat(change) >= 0;
    return (
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <div className={`text-2xl font-bold ${color}`}>{value}</div>
          <div className={`flex items-center text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? (
              <ArrowUp className="h-3 w-3 mr-0.5" />
            ) : (
              <TrendingUp className="h-3 w-3 mr-0.5 transform rotate-180" />
            )}
            {isPositive ? '+' : ''}{change}%
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">{label}</div>
      </div>
    );
  };

  // Monthly data table component
  const MonthlyDataTable = ({ data }: { data: any[] }) => {
    return (
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 font-medium text-gray-500">Month</th>
              <th className="text-right py-3 font-medium text-blue-600">Users</th>
              <th className="text-right py-3 font-medium text-purple-600">Content</th>
              <th className="text-right py-3 font-medium text-green-600">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data.slice().reverse().map((month, i) => (
              <motion.tr 
                key={month.month}
                className="border-b border-gray-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <td className="py-3 font-medium">{month.month}</td>
                <td className="text-right py-3 text-blue-600">{month.users}</td>
                <td className="text-right py-3 text-purple-600">{month.content}</td>
                <td className="text-right py-3 text-green-600">${month.revenue}k</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Trend mini-visualization
  const TrendMini = ({ values, color }: { values: number[], color: string }) => {
    // Normalize values between 0 and 100 for display
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const normalized = values.map(v => range ? ((v - min) / range) * 100 : 50);

    return (
      <div className="flex items-end h-8 space-x-0.5 mt-2">
        {normalized.map((value, i) => (
          <motion.div
            key={i}
            className={`w-2 ${color}`}
            style={{ height: `${Math.max(15, value)}%` }}
            initial={{ height: 0 }}
            animate={{ height: `${Math.max(15, value)}%` }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button 
            variant="outline" 
            className="border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
          >
            <Calendar className="mr-2 h-4 w-4 text-blue-500" />
            <span className="text-blue-700">Date Range</span>
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-transparent shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 hover:translate-y-[-5px]">
            <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-blue-900">Total Users</CardTitle>
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <Users className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TrendIndicator 
                value="24,582" 
                change="+12.5" 
                label="From last month" 
                color="text-blue-800" 
              />
              <TrendMini 
                values={monthlyTrends.slice(-6).map(d => d.users)} 
                color="bg-blue-400" 
              />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-transparent shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 hover:translate-y-[-5px]">
            <div className="h-1 w-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-purple-900">Active Sessions</CardTitle>
                <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TrendIndicator 
                value="3,428" 
                change="+8.2" 
                label="From last week" 
                color="text-purple-800" 
              />
              <TrendMini 
                values={[3150, 3100, 3200, 3300, 3250, 3428]} 
                color="bg-purple-400" 
              />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-transparent shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 hover:translate-y-[-5px]">
            <div className="h-1 w-full bg-gradient-to-r from-green-400 to-green-600"></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-green-900">Monthly Revenue</CardTitle>
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TrendIndicator 
                value="$47,518" 
                change="+15.3" 
                label="From last month" 
                color="text-green-800" 
              />
              <TrendMini 
                values={monthlyTrends.slice(-6).map(d => d.revenue)} 
                color="bg-green-400" 
              />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-transparent shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-amber-50 to-amber-100 hover:translate-y-[-5px]">
            <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-amber-600"></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-amber-900">Credits Used</CardTitle>
                <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                  <CreditCard className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TrendIndicator 
                value="165,842" 
                change="+22.1" 
                label="From last month" 
                color="text-amber-800" 
              />
              <TrendMini 
                values={[120000, 130000, 145000, 155000, 150000, 165842]} 
                color="bg-amber-400" 
              />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="bg-gradient-to-r from-gray-100 to-slate-100 p-1 rounded-xl">
          {["overview", "users", "content", "revenue", "credits"].map((tab) => (
            <TabsTrigger 
              key={tab}
              value={tab}
              className="capitalize data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-300 px-4 py-2"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="overview" className="mt-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="col-span-1 md:col-span-2" variants={itemVariants}>
              <Card className="overflow-hidden border-none shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                  <CardTitle className="text-blue-800">Platform Overview</CardTitle>
                  <CardDescription className="text-blue-600">
                    Key metrics for the last 12 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MonthlyDataTable data={monthlyTrends} />
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-blue-100 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
                  <CardTitle className="text-blue-700">User Growth</CardTitle>
                  <CardDescription className="text-blue-600">
                    Monthly new user registrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Last month:</span>
                      <span className="text-sm font-medium">{userTrend.latest} new users</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Monthly average:</span>
                      <span className="text-sm font-medium">
                        {Math.round(monthlyTrends.reduce((acc, curr) => acc + curr.users, 0) / monthlyTrends.length)} users
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Growth rate:</span>
                      <span className="text-sm font-medium text-green-600">+{userTrend.change}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-blue-50 pt-4">
                    <div className="text-sm font-medium mb-2">Monthly trend (last 6 months)</div>
                    <div className="flex items-end h-24 space-x-2">
                      {monthlyTrends.slice(-6).map((month, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <motion.div 
                            className="w-full bg-blue-400 rounded-t"
                            style={{ height: `${month.users}%` }}
                            initial={{ height: 0 }}
                            animate={{ height: `${month.users}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                          />
                          <span className="text-xs text-gray-500 mt-1">{month.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-purple-100 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 pb-4">
                  <CardTitle className="text-purple-700">Content Production</CardTitle>
                  <CardDescription className="text-purple-600">
                    Content items created per month
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Last month:</span>
                      <span className="text-sm font-medium">{contentTrend.latest} items</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Monthly average:</span>
                      <span className="text-sm font-medium">
                        {Math.round(monthlyTrends.reduce((acc, curr) => acc + curr.content, 0) / monthlyTrends.length)} items
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Growth rate:</span>
                      <span className="text-sm font-medium text-green-600">+{contentTrend.change}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-purple-50 pt-4">
                    <div className="text-sm font-medium mb-2">Monthly trend (last 6 months)</div>
                    <div className="flex items-end h-24 space-x-2">
                      {monthlyTrends.slice(-6).map((month, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <motion.div 
                            className="w-full bg-purple-400 rounded-t"
                            style={{ height: `${month.content}%` }}
                            initial={{ height: 0 }}
                            animate={{ height: `${month.content}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                          />
                          <span className="text-xs text-gray-500 mt-1">{month.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-green-100 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 pb-4">
                  <CardTitle className="text-green-700">Revenue Breakdown</CardTitle>
                  <CardDescription className="text-green-600">
                    Revenue by subscription plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-green-700">$47,518</div>
                    <div className="text-sm text-gray-500">Total monthly revenue</div>
                  </div>
                  
                  <SimpleBarVisualization data={revenueBreakdown} />
                  
                  <div className="mt-6 border-t border-green-50 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Highest plan</div>
                        <div className="font-medium">Premium ($19,957)</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Monthly target</div>
                        <div className="font-medium text-green-600">108% achieved</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-amber-100 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 pb-4">
                  <CardTitle className="text-amber-700">Credit Usage</CardTitle>
                  <CardDescription className="text-amber-600">
                    Credit consumption by feature
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-amber-700">165,842</div>
                    <div className="text-sm text-gray-500">Total credits used</div>
                  </div>
                  
                  <SimpleBarVisualization data={creditUsage} />
                  
                  <div className="mt-6 border-t border-amber-50 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Most used</div>
                        <div className="font-medium">Articles (74,629)</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Credits per user</div>
                        <div className="font-medium">132 avg</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-blue-100 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-200">
                <CardTitle className="text-blue-700">User Analytics</CardTitle>
                <CardDescription className="text-blue-600">
                  Detailed user growth and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="border-blue-100 bg-blue-50 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-blue-700">New Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-800">1,245</div>
                      <div className="text-xs text-blue-600 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +8.5% from last month
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-blue-100 bg-blue-50 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-blue-700">Active Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-800">8,392</div>
                      <div className="text-xs text-blue-600 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +12.3% from last month
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-blue-100 bg-blue-50 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-blue-700">Churn Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-800">3.2%</div>
                      <div className="text-xs text-green-600 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1 transform rotate-180" />
                        -0.8% from last month
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="border rounded-md p-6">
                  <h3 className="font-medium text-lg mb-4">User Growth Trend</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium text-gray-500">Month</th>
                        <th className="text-right py-2 font-medium text-gray-500">New Users</th>
                        <th className="text-right py-2 font-medium text-gray-500">Growth</th>
                        <th className="text-right py-2 font-medium text-gray-500">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyTrends.slice(-6).reverse().map((month, i) => {
                        const prevMonth = i < monthlyTrends.slice(-6).length - 1 ? 
                          monthlyTrends.slice(-6).reverse()[i+1].users : 0;
                        const growth = prevMonth ? ((month.users - prevMonth) / prevMonth * 100).toFixed(1) : "0";
                        const isPositive = parseFloat(growth) >= 0;
                        
                        return (
                          <motion.tr 
                            key={month.month}
                            className="border-b border-gray-100"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <td className="py-3">{month.month}</td>
                            <td className="text-right py-3">{month.users}</td>
                            <td className="text-right py-3">
                              <span className={isPositive ? "text-green-600" : "text-red-500"}>
                                {isPositive ? "+" : ""}{growth}%
                              </span>
                            </td>
                            <td className="text-right py-3">
                              <div className="inline-flex h-5 w-24 ml-auto">
                                <div className="w-full bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div 
                                    className={`h-full ${isPositive ? "bg-green-400" : "bg-red-400"}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(Math.abs(parseFloat(growth) * 3), 100)}%` }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                  />
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="content" className="mt-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-purple-100 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50 border-b border-purple-200">
                <CardTitle className="text-purple-700">Content Analytics</CardTitle>
                <CardDescription className="text-purple-600">
                  Content creation and usage statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="border-purple-100 bg-purple-50 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-purple-700">Total Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-800">12,583</div>
                      <div className="text-xs text-purple-600 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +15.2% from last month
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-purple-100 bg-purple-50 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-purple-700">Avg. Quality Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-800">4.8/5</div>
                      <div className="text-xs text-purple-600 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +0.3 points from last month
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-purple-100 bg-purple-50 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-purple-700">Popular Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-purple-800">AI, Marketing</div>
                      <div className="text-xs text-purple-600">
                        Based on last 30 days
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="border rounded-md p-6">
                  <h3 className="font-medium text-lg mb-4">Content Production</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Monthly Production</h4>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-medium text-gray-500">Month</th>
                            <th className="text-right py-2 font-medium text-gray-500">Content Items</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthlyTrends.slice(-6).reverse().map((month, i) => (
                            <motion.tr 
                              key={month.month}
                              className="border-b border-gray-100"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <td className="py-3">{month.month}</td>
                              <td className="text-right py-3 text-purple-600">{month.content}</td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Content Distribution</h4>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Articles</span>
                            <span className="text-gray-500">42%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-purple-400"
                              initial={{ width: 0 }}
                              animate={{ width: "42%" }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Social Posts</span>
                            <span className="text-gray-500">28%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-purple-400"
                              initial={{ width: 0 }}
                              animate={{ width: "28%" }}
                              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Emails</span>
                            <span className="text-gray-500">18%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-purple-400"
                              initial={{ width: 0 }}
                              animate={{ width: "18%" }}
                              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Other</span>
                            <span className="text-gray-500">12%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-purple-400"
                              initial={{ width: 0 }}
                              animate={{ width: "12%" }}
                              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="revenue" className="mt-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-green-100 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-100 to-green-50 border-b border-green-200">
                <CardTitle className="text-green-700">Revenue Analytics</CardTitle>
                <CardDescription className="text-green-600">
                  Detailed financial performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="border-green-100 bg-green-50 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-green-700">Monthly Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-800">$47,518</div>
                      <div className="text-xs text-green-600 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +15.3% from last month
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-green-100 bg-green-50 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-green-700">Avg. Transaction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-800">$49.99</div>
                      <div className="text-xs text-green-600 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +2.5% from last month
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-green-100 bg-green-50 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-green-700">Conversion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-800">8.7%</div>
                      <div className="text-xs text-green-600 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +0.5% from last month
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-md p-6">
                    <h3 className="font-medium text-lg mb-4">Revenue Breakdown</h3>
                    <SimpleBarVisualization data={revenueBreakdown} />
                    
                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Monthly target</div>
                          <div className="font-medium text-green-600">$44,000 (108% achieved)</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">YTD revenue</div>
                          <div className="font-medium">$384,572</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-6">
                    <h3 className="font-medium text-lg mb-4">Monthly Revenue Trend</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium text-gray-500">Month</th>
                          <th className="text-right py-2 font-medium text-gray-500">Revenue</th>
                          <th className="text-right py-2 font-medium text-gray-500">Growth</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyTrends.slice(-6).reverse().map((month, i) => {
                          const prevMonth = i < monthlyTrends.slice(-6).length - 1 ? 
                            monthlyTrends.slice(-6).reverse()[i+1].revenue : 0;
                          const growth = prevMonth ? ((month.revenue - prevMonth) / prevMonth * 100).toFixed(1) : "0";
                          
                          return (
                            <motion.tr 
                              key={month.month}
                              className="border-b border-gray-100"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <td className="py-3">{month.month}</td>
                              <td className="text-right py-3">${month.revenue}k</td>
                              <td className="text-right py-3 text-green-600">+{growth}%</td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="credits" className="mt-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-amber-100 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-100 to-amber-50 border-b border-amber-200">
                <CardTitle className="text-amber-700">Credits Usage Analytics</CardTitle>
                <CardDescription className="text-amber-600">
                  Detailed credit consumption metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="border-amber-100 bg-amber-50 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-amber-700">Total Credits Used</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-amber-800">165,842</div>
                      <div className="text-xs text-amber-600 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +22.1% from last month
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-amber-100 bg-amber-50 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-amber-700">Avg. Per User</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-amber-800">132</div>
                      <div className="text-xs text-amber-600 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +8.2% from last month
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-amber-100 bg-amber-50 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-amber-700">Credit Efficiency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-amber-800">94%</div>
                      <div className="text-xs text-amber-600 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +2.5% from last month
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-md p-6">
                    <h3 className="font-medium text-lg mb-4">Credit Usage Distribution</h3>
                    <SimpleBarVisualization data={creditUsage} />
                    
                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Most efficient use</div>
                          <div className="font-medium">Articles (96% efficiency)</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Least efficient use</div>
                          <div className="font-medium">Social (87% efficiency)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-6">
                    <h3 className="font-medium text-lg mb-4">Credit Usage Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Credits purchased</span>
                        <span className="text-sm">180,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Credits used</span>
                        <span className="text-sm text-amber-600">165,842</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Credits remaining</span>
                        <span className="text-sm">14,158</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Average cost per credit</span>
                        <span className="text-sm">$0.012</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total credit value</span>
                        <span className="text-sm">$1,990</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full mt-4">
                        <motion.div
                          className="h-full bg-amber-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(165842 / 180000) * 100}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 text-center mt-1">
                        92% of purchased credits used
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}