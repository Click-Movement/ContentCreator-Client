import { useState } from 'react';

type ContentItem = {
  id: string;
  title: string;
  type: string;
  author: string;
  status: string;
  creditsUsed: number;
  createdAt: string;
};

export default function useContent() {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock content data - would be fetched from your database
  const content = [
    {
      id: '1',
      title: 'How to Optimize Your SEO Strategy',
      type: 'Article',
      author: 'John Smith',
      status: 'Published',
      creditsUsed: 45,
      createdAt: '2025-05-01T14:23:00Z'
    },
    {
      id: '2',
      title: 'AI Writing Tips for Beginners',
      type: 'Guide',
      author: 'Sarah Johnson',
      status: 'Published',
      creditsUsed: 68,
      createdAt: '2025-05-03T11:05:00Z'
    },
    {
      id: '3',
      title: 'Content Marketing Trends 2025',
      type: 'Report',
      author: 'Michael Brown',
      status: 'Draft',
      creditsUsed: 32,
      createdAt: '2025-05-10T09:45:00Z'
    },
    {
      id: '4',
      title: 'Email Subject Lines That Convert',
      type: 'Newsletter',
      author: 'Emily Davis',
      status: 'Published',
      creditsUsed: 28,
      createdAt: '2025-05-15T16:20:00Z'
    },
    {
      id: '5',
      title: 'Social Media Content Calendar',
      type: 'Template',
      author: 'David Wilson',
      status: 'Published',
      creditsUsed: 15,
      createdAt: '2025-05-20T10:15:00Z'
    }
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, you'd perform a search here
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real app, you'd fetch the data for the selected page
  };

  const handleFilter = () => {
    console.log('Filter content');
    // In a real app, you'd open a filter modal or dropdown
  };

  const handleCreateContent = () => {
    console.log('Create content');
    // In a real app, you'd navigate to content creation page
  };

  const handleViewContent = (item: ContentItem) => {
    console.log('View content', item);
    // In a real app, you'd navigate to content details page
  };

  const handleEditContent = (item: ContentItem) => {
    console.log('Edit content', item);
    // In a real app, you'd navigate to content edit page
  };

  const handleDuplicateContent = (item: ContentItem) => {
    console.log('Duplicate content', item);
    // In a real app, you'd duplicate the content
  };

  const handleArchiveContent = (item: ContentItem) => {
    console.log('Archive content', item);
    // In a real app, you'd archive the content
  };

  const handleDeleteContent = (item: ContentItem) => {
    console.log('Delete content', item);
    // In a real app, you'd delete the content after confirmation
  };

  const handleBrowseContent = () => {
    setActiveTab('all');
    // In a real app, you might navigate or change filters
  };

  const getFilteredContent = (status?: string) => {
    if (!status || status === 'all') return content;
    return content.filter(item => item.status === status);
  };

  return {
    activeTab,
    currentPage,
    searchQuery,
    content,
    filteredContent: {
      all: content,
      published: getFilteredContent('Published'),
      draft: getFilteredContent('Draft'),
      archived: []  // Mocked as empty for now
    },
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
    totalCount: 42  // Mocked total number of content items
  };
}