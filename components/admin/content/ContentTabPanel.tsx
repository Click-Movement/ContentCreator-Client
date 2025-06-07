import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { cardStyles } from '@/lib/dashboard-theme';
import ContentTable from './ContentTable';
import ContentPagination from './ContentPagination';

type ContentItem = {
  id: string;
  title: string;
  type: string;
  author: string;
  status: string;
  creditsUsed: number;
  createdAt: string;
};
/* eslint-disable @typescript-eslint/no-explicit-any */
type ContentTabPanelProps = {
  title: string;
  description: string;
  content: ContentItem[];
  currentPage: number;
  totalPages: number;
  showingCount: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  tableRowVariants: any;
  itemVariants: any;
  onView?: (item: ContentItem) => void;
  onEdit?: (item: ContentItem) => void;
  onDuplicate?: (item: ContentItem) => void;
  onArchive?: (item: ContentItem) => void;
  onDelete?: (item: ContentItem) => void;
};

export default function ContentTabPanel({
  title,
  description,
  content,
  currentPage,
  totalPages,
  showingCount,
  totalCount,
  onPageChange,
  tableRowVariants,
  itemVariants,
  onView,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete
}: ContentTabPanelProps) {
  return (
    <Card className={cardStyles.baseStyles}>
      <CardHeader className={`pb-2 ${cardStyles.gradientHeader}`}>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="mt-1">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ContentTable 
          content={content}
          tableRowVariants={tableRowVariants}
          onView={onView}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onArchive={onArchive}
          onDelete={onDelete}
        />

        <ContentPagination
          currentPage={currentPage}
          totalPages={totalPages}
          showingCount={showingCount}
          totalCount={totalCount}
          onPageChange={onPageChange}
          variants={itemVariants}
        />
      </CardContent>
    </Card>
  );
}