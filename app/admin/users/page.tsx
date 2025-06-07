'use client'

import React from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/admin/users/PageHeader';
import UserManagementCard from '@/components/admin/users/UserManagementCard';
import useUsers from '@/hooks/useUsers';

export default function AdminUsersPage() {
  const {
    users,
    isLoading,
    searchValue,
    currentPage,
    handleRefresh,
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    handleUserAction,
    handleAddUser,
    totalItems,
    itemsShowing,
    totalPages,
  } = useUsers();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.4
      } 
    })
  };

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <PageHeader 
        title="User Management"
        onAddUser={handleAddUser}
        variants={itemVariants}
      />

      <UserManagementCard
        users={users}
        searchValue={searchValue}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsShowing={itemsShowing}
        totalItems={totalItems}
        onSearchChange={handleSearchChange}
        onRefresh={handleRefresh}
        onFilter={handleFilterChange}
        onSort={handleSortChange}
        onUserAction={handleUserAction}
        onPageChange={handlePageChange}
        itemVariants={itemVariants}
        tableRowVariants={tableRowVariants}
      />
    </motion.div>
  );
}