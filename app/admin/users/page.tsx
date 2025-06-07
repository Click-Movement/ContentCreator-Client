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
import { Input } from '@/components/ui/input';
import { Search, UserPlus, MoreHorizontal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'User Management | Admin Dashboard',
  description: 'Manage users, roles, and permissions',
};

export default function AdminUsersPage() {
  // Mock user data - would be fetched from your database
  const users = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'user',
      plan: 'free',
      credits: 850,
      createdAt: '2025-01-15T00:00:00Z'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'admin',
      plan: 'premium',
      credits: 3200,
      createdAt: '2025-02-10T00:00:00Z'
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael@example.com',
      role: 'user',
      plan: 'basic',
      credits: 1500,
      createdAt: '2025-03-05T00:00:00Z'
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily@example.com',
      role: 'user',
      plan: 'premium',
      credits: 2800,
      createdAt: '2025-04-20T00:00:00Z'
    },
    {
      id: '5',
      name: 'David Wilson',
      email: 'david@example.com',
      role: 'user',
      plan: 'free',
      credits: 750,
      createdAt: '2025-05-12T00:00:00Z'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <Button className="mt-4 sm:mt-0">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Users</CardTitle>
            <div className="flex w-full max-w-sm items-center">
              <Input 
                placeholder="Search users..." 
                className="mr-2" 
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            Manage your users and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.plan !== 'free' ? 'secondary' : 'outline'}>
                      {user.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.credits}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-center space-x-2 py-4">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}