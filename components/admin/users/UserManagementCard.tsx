import React from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { cardStyles } from '@/lib/dashboard-theme';
import UsersSearchBar from './UsersSearchBar';
import UsersTable from './UsersTable';
import Pagination from './Pagination';

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

type UserManagementCardProps = {
  users: User[];
  searchValue: string;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  itemsShowing: number;
  totalItems: number;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onFilter?: (filter: string) => void;
  onSort?: (sort: string) => void;
  onUserAction?: (user: User) => void;
  onPageChange: (page: number) => void;
  itemVariants: any;
  tableRowVariants: any;
};

export default function UserManagementCard({
  users,
  searchValue,
  isLoading,
  currentPage,
  totalPages,
  itemsShowing,
  totalItems,
  onSearchChange,
  onRefresh,
  onFilter,
  onSort,
  onUserAction,
  onPageChange,
  itemVariants,
  tableRowVariants
}: UserManagementCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className={`mb-6 ${cardStyles.baseStyles}`}>
        <CardHeader className={`pb-3 ${cardStyles.gradientHeader}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription className="mt-1">
                Manage your users and their permissions
              </CardDescription>
            </div>
            
            <UsersSearchBar
              searchValue={searchValue}
              onSearchChange={onSearchChange}
              isLoading={isLoading}
              onRefresh={onRefresh}
              onFilter={onFilter}
              onSort={onSort}
            />
          </div>
        </CardHeader>
        
        <CardContent>
          <UsersTable 
            users={users} 
            rowVariants={tableRowVariants} 
            onUserAction={onUserAction} 
          />

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            itemsShowing={itemsShowing}
            totalItems={totalItems}
            onPageChange={onPageChange}
            variants={itemVariants}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}