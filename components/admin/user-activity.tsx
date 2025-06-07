'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Jan', users: 400, content: 240, credits: 1200 },
  { name: 'Feb', users: 300, content: 139, credits: 980 },
  { name: 'Mar', users: 200, content: 980, credits: 2000 },
  { name: 'Apr', users: 278, content: 390, credits: 1500 },
  { name: 'May', users: 189, content: 480, credits: 1800 },
  { name: 'Jun', users: 239, content: 380, credits: 1700 },
  { name: 'Jul', users: 349, content: 430, credits: 2100 },
];

export default function AdminUserActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Activity</CardTitle>
        <CardDescription>
          Track user engagement, content creation, and credit usage over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="30days">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="7days">7 days</TabsTrigger>
              <TabsTrigger value="30days">30 days</TabsTrigger>
              <TabsTrigger value="90days">90 days</TabsTrigger>
              <TabsTrigger value="1year">1 year</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="7days" className="space-y-4">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="content" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="credits" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          {/* Other tab content would be similar */}
          <TabsContent value="30days">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="content" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="credits" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="90days">
            {/* Similar chart with 90 days data */}
          </TabsContent>
          <TabsContent value="1year">
            {/* Similar chart with yearly data */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}