'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import PageHeader from '@/components/admin/content/PageHeader';
import ContentTabs from '@/components/admin/content/ContentTabs';
import ContentTabPanel from '@/components/admin/content/ContentTabPanel';
import EmptyContentPanel from '@/components/admin/content/EmptyContentPanel';
import useContent from '@/hooks/useContent';

export default function AdminContentPage() {
  const {
    activeTab,
    currentPage,
    searchQuery,
    filteredContent,
    handleTabChange,
    handleSearch,
    handlePageChange,
    handleFilter,
    handleCreateContent,
    handleViewContent,
    handleEditContent,
    handleDuplicateContent,
    handleArchiveContent,
    handleDeleteContent,
    handleBrowseContent,
    totalCount
  } = useContent();

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
        title="Content Management" 
        onCreateContent={handleCreateContent}
        variants={itemVariants}
      />

      <Tabs 
        value={activeTab} 
        className="mb-6"
      >
        <ContentTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          onFilter={handleFilter}
          variants={itemVariants}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="all">
              <ContentTabPanel
                title="All Content"
                description="Showing all content items across the platform"
                content={filteredContent.all}
                currentPage={currentPage}
                totalPages={2}
                showingCount={filteredContent.all.length}
                totalCount={totalCount}
                onPageChange={handlePageChange}
                tableRowVariants={tableRowVariants}
                itemVariants={itemVariants}
                onView={handleViewContent}
                onEdit={handleEditContent}
                onDuplicate={handleDuplicateContent}
                onArchive={handleArchiveContent}
                onDelete={handleDeleteContent}
              />
            </TabsContent>
            
            <TabsContent value="published">
              <ContentTabPanel
                title="Published Content"
                description="Content that is live and visible to users"
                content={filteredContent.published}
                currentPage={currentPage}
                totalPages={1}
                showingCount={filteredContent.published.length}
                totalCount={filteredContent.published.length}
                onPageChange={handlePageChange}
                tableRowVariants={tableRowVariants}
                itemVariants={itemVariants}
                onView={handleViewContent}
                onEdit={handleEditContent}
                onDuplicate={handleDuplicateContent}
                onArchive={handleArchiveContent}
                onDelete={handleDeleteContent}
              />
            </TabsContent>
            
            <TabsContent value="draft">
              <ContentTabPanel
                title="Draft Content"
                description="Content that is still being worked on"
                content={filteredContent.draft}
                currentPage={currentPage}
                totalPages={1}
                showingCount={filteredContent.draft.length}
                totalCount={filteredContent.draft.length}
                onPageChange={handlePageChange}
                tableRowVariants={tableRowVariants}
                itemVariants={itemVariants}
                onView={handleViewContent}
                onEdit={handleEditContent}
                onDuplicate={handleDuplicateContent}
                onArchive={handleArchiveContent}
                onDelete={handleDeleteContent}
              />
            </TabsContent>
            
            <TabsContent value="archived">
              <EmptyContentPanel
                title="Archived Content"
                description="Content that has been archived"
                emptyMessage="No archived content found"
                emptyDescription="Content that you archive will appear here. Archived content isn't visible to users but can be restored at any time."
                buttonText="Browse Content"
                onButtonClick={handleBrowseContent}
              />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
}