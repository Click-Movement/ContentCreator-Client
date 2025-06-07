'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';

// Mock data for recent content
const recentContent = [
  {
    id: 'c-001',
    title: 'Top 10 AI Tools for 2025',
    authorName: 'John Smith',
    authorId: 'u-123',
    type: 'Article',
    status: 'Published',
    date: '2025-06-01T14:23:00Z',
    creditsUsed: 45
  },
  {
    id: 'c-002',
    title: 'How to Improve Your SEO Strategy',
    authorName: 'Emily Chen',
    authorId: 'u-456',
    type: 'Blog Post',
    status: 'Published',
    date: '2025-06-01T11:05:00Z',
    creditsUsed: 32
  },
  {
    id: 'c-003',
    title: 'Ultimate Guide to Content Repurposing',
    authorName: 'Michael Rodriguez',
    authorId: 'u-789',
    type: 'Guide',
    status: 'Draft',
    date: '2025-05-31T09:45:00Z',
    creditsUsed: 67
  },
  {
    id: 'c-004',
    title: 'Email Marketing Tips for Higher Conversion',
    authorName: 'Sarah Johnson',
    authorId: 'u-101',
    type: 'Newsletter',
    status: 'Published',
    date: '2025-05-30T16:20:00Z',
    creditsUsed: 28
  },
  {
    id: 'c-005',
    title: 'Social Media Content Calendar Template',
    authorName: 'David Wilson',
    authorId: 'u-112',
    type: 'Template',
    status: 'Published',
    date: '2025-05-30T10:15:00Z',
    creditsUsed: 15
  },
];

export default function AdminRecentContent() {
  const tableVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="overflow-hidden border-gray-200 hover:border-gray-300 transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Content</CardTitle>
              <CardDescription>
                Latest content created on the platform
              </CardDescription>
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white transition-all shadow-md hover:shadow-lg"
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <motion.div
              variants={tableVariants}
              initial="hidden"
              animate="show"
            >
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="font-semibold">Author</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Credits</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentContent.map((content) => (
                    <motion.tr 
                      key={content.id} 
                      variants={rowVariants}
                      className="hover:bg-gray-50/80 transition-colors border-b hover:shadow-sm"
                    >
                      <TableCell className="font-medium">{content.title}</TableCell>
                      <TableCell>{content.authorName}</TableCell>
                      <TableCell>{content.type}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={content.status === 'Published' ? 'default' : 'secondary'}
                          className={content.status === 'Published' 
                            ? 'bg-green-100 hover:bg-green-200 text-green-800 border-green-200 hover:border-green-300' 
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-200 hover:border-amber-300'
                          }
                        >
                          {content.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(content.date).toLocaleDateString()}</TableCell>
                      <TableCell>{content.creditsUsed}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}