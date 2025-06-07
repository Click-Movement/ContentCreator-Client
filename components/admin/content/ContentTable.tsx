import React from 'react';
import { motion } from 'framer-motion';
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Eye, 
  Edit, 
  Trash2,
  ChevronDown,
  FileText,
  FileCode,
  FileImage,
  Mail
} from 'lucide-react';
import { tableStyles, badgeStyles, buttonStyles } from '@/lib/dashboard-theme';

type ContentItem = {
  id: string;
  title: string;
  type: string;
  author: string;
  status: string;
  creditsUsed: number;
  createdAt: string;
};

type ContentTableProps = {
  content: ContentItem[];
  tableRowVariants: any;
  onView?: (item: ContentItem) => void;
  onEdit?: (item: ContentItem) => void;
  onDuplicate?: (item: ContentItem) => void;
  onArchive?: (item: ContentItem) => void;
  onDelete?: (item: ContentItem) => void;
};

export default function ContentTable({ 
  content,
  tableRowVariants,
  onView,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete
}: ContentTableProps) {
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'Article':
        return <FileText className="h-4 w-4" />;
      case 'Guide':
        return <FileCode className="h-4 w-4" />;
      case 'Report':
        return <FileText className="h-4 w-4" />;
      case 'Newsletter':
        return <Mail className="h-4 w-4" />;
      case 'Template':
        return <FileImage className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="rounded-md overflow-hidden border">
      <Table>
        <TableHeader>
          <TableRow className={tableStyles.headerRow}>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {content.map((item, index) => (
            <motion.tr
              key={item.id}
              custom={index}
              variants={tableRowVariants}
              className={tableStyles.row}
              whileHover={{ backgroundColor: "rgba(239, 246, 255, 0.6)" }}
            >
              <TableCell className={`${tableStyles.cell} font-medium`}>{item.title}</TableCell>
              <TableCell className={tableStyles.cell}>
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600">
                    {getContentIcon(item.type)}
                  </span>
                  {item.type}
                </div>
              </TableCell>
              <TableCell className={tableStyles.cell}>{item.author}</TableCell>
              <TableCell className={tableStyles.cell}>
                <Badge 
                  variant={item.status === 'Published' ? 'default' : 'secondary'}
                  className={
                    item.status === 'Published' ? badgeStyles.success :
                    item.status === 'Draft' ? badgeStyles.warning : ''
                  }
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className={tableStyles.cell}>
                <div className="flex flex-col">
                  <span>{item.creditsUsed}</span>
                  <div className="mt-1 h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (item.creditsUsed / 1))}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell className={tableStyles.cell}>
                <div className="flex flex-col">
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </TableCell>
              <TableCell className={`${tableStyles.cell} text-right`}>
                <div className="flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 ${buttonStyles.iconButton}`}
                    onClick={() => onView?.(item)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 ${buttonStyles.iconButton}`}
                    onClick={() => onEdit?.(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${buttonStyles.iconButton}`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onDuplicate?.(item)}>
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onArchive?.(item)}>
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => onDelete?.(item)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}