import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { tableStyles, badgeStyles, buttonStyles } from '@/lib/dashboard-theme';
/* eslint-disable @typescript-eslint/no-explicit-any */
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

type UserTableRowProps = {
  user: User;
  index: number;
  variants?: any;
  onActionClick?: (user: User) => void;
};

export default function UserTableRow({ user, index, variants, onActionClick }: UserTableRowProps) {
  return (
    <motion.tr
      custom={index}
      variants={variants}
      className={tableStyles.row}
      whileHover={{ backgroundColor: "rgba(239, 246, 255, 0.6)" }}
    >
      <TableCell className={`${tableStyles.cell} font-medium`}>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500/80 to-violet-500/80 flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-medium text-white">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            )}
          </div>
          <span>{user.name}</span>
        </div>
      </TableCell>
      <TableCell className={tableStyles.cell}>{user.email}</TableCell>
      <TableCell className={tableStyles.cell}>
        <Badge 
          variant={user.role === 'admin' ? 'default' : 'outline'}
          className={user.role === 'admin' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
        >
          {user.role}
        </Badge>
      </TableCell>
      <TableCell className={tableStyles.cell}>
        <Badge 
          variant={user.plan !== 'free' ? 'secondary' : 'outline'}
          className={user.plan === 'premium' ? badgeStyles.premium : ''}
        >
          {user.plan}
        </Badge>
      </TableCell>
      <TableCell className={tableStyles.cell}>
        <div className="flex items-center">
          <div className="mr-2 h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (user.credits / 50))}%` }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
            />
          </div>
          <span>{user.credits}</span>
        </div>
      </TableCell>
      <TableCell className={tableStyles.cell}>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
      <TableCell className={`${tableStyles.cell} text-right`}>
        <Button 
          variant="ghost" 
          size="icon"
          className={buttonStyles.iconButton}
          onClick={() => onActionClick?.(user)}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </TableCell>
    </motion.tr>
  );
}