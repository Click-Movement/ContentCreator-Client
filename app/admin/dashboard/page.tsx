import React from 'react';
import { Metadata } from 'next';
import AdminDashboardHeader from '@/components/admin/header';
import AdminStatsOverview from '@/components/admin/stats-overview';
import AdminUserActivity from '@/components/admin/user-activity';
import AdminSystemStatus from '@/components/admin/system-status';
import AdminRecentContent from '@/components/admin/recent-content';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Content Creator',
  description: 'Administrative dashboard for Content Creator platform management',
};

export default async function AdminDashboardPage() {
  // Mock data for demonstration purposes
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalContent: 5628,
    creditsUsed: 128950,
    revenue: 12489.50,
    growth: 12.4
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AdminDashboardHeader />
      
      <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
        <AdminStatsOverview stats={stats} />
      </div>
      
      <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdminUserActivity />
        </div>
        <div>
          <AdminSystemStatus />
        </div>
      </div>
      
      <div className="mt-8">
        <AdminRecentContent />
      </div>
    </div>
  );
}
