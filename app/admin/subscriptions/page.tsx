import React from 'react';
import { Metadata } from 'next';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  CreditCard
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Subscription Management | Admin Dashboard',
  description: 'Manage subscription plans and user subscriptions',
};

export default function AdminSubscriptionsPage() {
  // Mock subscription summary data
  const summary = {
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
  const subscriptions = [
    {
      id: '1',
      user: 'John Smith',
      email: 'john@example.com',
      plan: 'premium',
      status: 'active',
      amount: 49.99,
      billingCycle: 'monthly',
      startDate: '2025-02-15T00:00:00Z',
      renewalDate: '2025-06-15T00:00:00Z'
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
      renewalDate: '2025-06-10T00:00:00Z'
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
      renewalDate: '2026-01-05T00:00:00Z'
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
      renewalDate: '2025-06-20T00:00:00Z'
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
      renewalDate: '2025-05-12T00:00:00Z'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Subscription Management</h1>
        <Button className="mt-4 sm:mt-0">
          <CreditCard className="mr-2 h-4 w-4" />
          Manage Plans
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              +{summary.growthRate}% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscribers
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.activeSubscribers}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Premium Users
            </CardTitle>
            <CreditCard className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.premiumUsers}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              +8% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Revenue
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.averageRevenue}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              +5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="mb-6">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
          <TabsTrigger value="all">All Subscriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
              <CardDescription>
                Manage currently active subscription plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
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
                  {subscriptions
                    .filter(sub => sub.status === 'active')
                    .map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{sub.user}</div>
                          <div className="text-sm text-muted-foreground">{sub.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          sub.plan === 'premium' ? 'default' : 
                          sub.plan === 'enterprise' ? 'destructive' : 
                          'outline'
                        }>
                          {sub.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          sub.status === 'active' ? 'default' : 
                          sub.status === 'pending_cancellation' ? 'outline' : 
                          'secondary'
                        }>
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell>${sub.amount}</TableCell>
                      <TableCell>{sub.billingCycle}</TableCell>
                      <TableCell>{new Date(sub.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(sub.renewalDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Subscriptions</CardTitle>
              <CardDescription>
                Subscriptions that are pending activation or cancellation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table structure for pending subscriptions */}
              <div className="flex justify-center py-8 text-muted-foreground">
                Showing pending subscriptions would go here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expired" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Expired Subscriptions</CardTitle>
              <CardDescription>
                Subscriptions that have expired or been cancelled
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table structure for expired subscriptions */}
              <div className="flex justify-center py-8 text-muted-foreground">
                Showing expired subscriptions would go here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Subscriptions</CardTitle>
              <CardDescription>
                Complete list of all subscription records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table structure for all subscriptions */}
              <div className="flex justify-center py-8 text-muted-foreground">
                Showing all subscriptions would go here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}