import React from 'react';
import { Metadata } from 'next';
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
  BarChart,
  LineChart,
  PieChart
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Analytics | Admin Dashboard',
  description: 'Platform analytics and insights',
};

export default function AdminAnalyticsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="credits">Credits Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
                <CardDescription>
                  Key metrics for the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] w-full flex items-center justify-center bg-slate-100 rounded-md">
                <div className="flex flex-col items-center">
                  <LineChart className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Line chart showing key metrics over time would go here
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>
                  New user registrations over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] w-full flex items-center justify-center bg-slate-100 rounded-md">
                <div className="flex flex-col items-center">
                  <BarChart className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Bar chart showing user growth would go here
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Production</CardTitle>
                <CardDescription>
                  Content created by type and day
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] w-full flex items-center justify-center bg-slate-100 rounded-md">
                <div className="flex flex-col items-center">
                  <BarChart className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Bar chart showing content production would go here
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>
                  Revenue by subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] w-full flex items-center justify-center bg-slate-100 rounded-md">
                <div className="flex flex-col items-center">
                  <PieChart className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Pie chart showing revenue breakdown would go here
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Credit Usage</CardTitle>
                <CardDescription>
                  Credit consumption by feature
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] w-full flex items-center justify-center bg-slate-100 rounded-md">
                <div className="flex flex-col items-center">
                  <PieChart className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Pie chart showing credit usage would go here
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>
                Detailed user growth and engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-8 text-muted-foreground">
                Detailed user analytics would go here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Analytics</CardTitle>
              <CardDescription>
                Content creation and usage statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-8 text-muted-foreground">
                Detailed content analytics would go here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>
                Detailed financial performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-8 text-muted-foreground">
                Detailed revenue analytics would go here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="credits" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Credits Usage Analytics</CardTitle>
              <CardDescription>
                Detailed credit consumption metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-8 text-muted-foreground">
                Detailed credits usage analytics would go here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}