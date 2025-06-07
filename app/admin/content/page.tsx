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
import { 
  Search, 
  PlusCircle, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  ChevronDown
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Content Management | Admin Dashboard',
  description: 'Manage all content across the platform',
};

export default function AdminContentPage() {
  // Mock content data - would be fetched from your database
  const content = [
    {
      id: '1',
      title: 'How to Optimize Your SEO Strategy',
      type: 'Article',
      author: 'John Smith',
      status: 'Published',
      creditsUsed: 45,
      createdAt: '2025-05-01T00:00:00Z'
    },
    {
      id: '2',
      title: 'AI Writing Tips for Beginners',
      type: 'Guide',
      author: 'Sarah Johnson',
      status: 'Published',
      creditsUsed: 68,
      createdAt: '2025-05-03T00:00:00Z'
    },
    {
      id: '3',
      title: 'Content Marketing Trends 2025',
      type: 'Report',
      author: 'Michael Brown',
      status: 'Draft',
      creditsUsed: 32,
      createdAt: '2025-05-10T00:00:00Z'
    },
    {
      id: '4',
      title: 'Email Subject Lines That Convert',
      type: 'Newsletter',
      author: 'Emily Davis',
      status: 'Published',
      creditsUsed: 28,
      createdAt: '2025-05-15T00:00:00Z'
    },
    {
      id: '5',
      title: 'Social Media Content Calendar',
      type: 'Template',
      author: 'David Wilson',
      status: 'Published',
      creditsUsed: 15,
      createdAt: '2025-05-20T00:00:00Z'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Content Management</h1>
        <Button className="mt-4 sm:mt-0">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Content
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          
          <div className="flex mt-4 sm:mt-0 w-full max-w-sm items-center">
            <Input 
              placeholder="Search content..." 
              className="mr-2" 
            />
            <Button variant="outline" size="icon" className="mr-2">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Content</CardTitle>
              <CardDescription>
                Showing all content items across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Credits Used</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {content.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.author}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === 'Published' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.creditsUsed}</TableCell>
                      <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-center space-x-2 py-4 mt-4">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="published">
          <Card>
            <CardHeader>
              <CardTitle>Published Content</CardTitle>
              <CardDescription>
                Content that is live and visible to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table structure for published content */}
              <div className="flex justify-center py-8 text-muted-foreground">
                Showing published content would go here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="draft">
          <Card>
            <CardHeader>
              <CardTitle>Draft Content</CardTitle>
              <CardDescription>
                Content that is still being worked on
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table structure for draft content */}
              <div className="flex justify-center py-8 text-muted-foreground">
                Showing draft content would go here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="archived">
          <Card>
            <CardHeader>
              <CardTitle>Archived Content</CardTitle>
              <CardDescription>
                Content that has been archived
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table structure for archived content */}
              <div className="flex justify-center py-8 text-muted-foreground">
                Showing archived content would go here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}