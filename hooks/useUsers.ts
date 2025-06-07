import { useState, useEffect } from 'react';

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

export default function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSort, setActiveSort] = useState('date-desc');
  
  // Mock user data
  const mockUsers = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'user',
      plan: 'free',
      credits: 850,
      createdAt: '2025-01-15T00:00:00Z',
      avatar: null
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'admin',
      plan: 'premium',
      credits: 3200,
      createdAt: '2025-02-10T00:00:00Z',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael@example.com',
      role: 'user',
      plan: 'basic',
      credits: 1500,
      createdAt: '2025-03-05T00:00:00Z',
      avatar: 'https://i.pravatar.cc/150?u=michael'
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily@example.com',
      role: 'user',
      plan: 'premium',
      credits: 2800,
      createdAt: '2025-04-20T00:00:00Z',
      avatar: null
    },
    {
      id: '5',
      name: 'David Wilson',
      email: 'david@example.com',
      role: 'user',
      plan: 'free',
      credits: 750,
      createdAt: '2025-05-12T00:00:00Z',
      avatar: 'https://i.pravatar.cc/150?u=david'
    }
  ];

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    // In a real application, you'd trigger a search with debounce
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    // In a real application, you'd apply the filter to your data
  };

  const handleSortChange = (sort: string) => {
    setActiveSort(sort);
    // In a real application, you'd sort your data
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real application, you'd fetch the data for the selected page
  };

  const handleUserAction = (user: User) => {
    console.log('User action:', user);
    // Handle user actions like edit, delete, etc.
  };

  const handleAddUser = () => {
    console.log('Add user');
    // Open a modal or navigate to create user form
  };

  return {
    users,
    isLoading,
    searchValue,
    currentPage,
    activeFilter,
    activeSort,
    handleRefresh,
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    handleUserAction,
    handleAddUser,
    totalItems: 50, // Mocked total items
    itemsShowing: users.length,
    totalPages: 2, // Mocked total pages
  };
}