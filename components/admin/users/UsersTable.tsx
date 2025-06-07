import React from 'react';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

import { tableStyles } from '@/lib/dashboard-theme';
import UserTableRow from './UserTableRow';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  credits: number;
  createdAt: string;
  avatar: string | null;
};
/* eslint-disable @typescript-eslint/no-explicit-any */

type UsersTableProps = {
  users: User[];
  rowVariants: any;
  onUserAction?: (user: User) => void;
};

export default function UsersTable({ users, rowVariants, onUserAction }: UsersTableProps) {
  return (
    <div className="rounded-md overflow-hidden border">
      <Table>
        <TableHeader>
          <TableRow className={tableStyles.headerRow}>
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
          {users.map((user, index) => (
            <UserTableRow 
              key={user.id}
              user={user}
              index={index}
              variants={rowVariants}
              onActionClick={onUserAction}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}