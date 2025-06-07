import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, ArrowUpDown, RefreshCw } from 'lucide-react';
import { buttonStyles } from '@/lib/dashboard-theme';

type UsersSearchBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
  onFilter?: (filter: string) => void;
  onSort?: (sort: string) => void;
};

export default function UsersSearchBar({
  searchValue,
  onSearchChange,
  isLoading,
  onRefresh,
  onFilter,
  onSort
}: UsersSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input 
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search users..." 
          className="pl-9" 
        />
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon"
          className={buttonStyles.outlineHover}
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className={buttonStyles.outlineHover}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onFilter?.('all')}>All Users</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilter?.('admin')}>Admins Only</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilter?.('premium')}>Premium Users</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilter?.('free')}>Free Users</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className={buttonStyles.outlineHover}
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onSort?.('name-asc')}>Name (A-Z)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort?.('name-desc')}>Name (Z-A)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort?.('date-desc')}>Date (Newest)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort?.('date-asc')}>Date (Oldest)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}