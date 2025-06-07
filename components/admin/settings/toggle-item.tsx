// filepath: /home/ahmadali507/projects/upwork_hourly/ContentCreator-Client/components/admin/settings/ToggleItem.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type ToggleItemProps = {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
  color?: 'blue' | 'purple' | 'green' | 'amber';
  className?: string;
};

export default function ToggleItem({
  id,
  label,
  description,
  defaultChecked = false,
  color = 'blue',
  className = ''
}: ToggleItemProps) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      title: 'text-blue-800',
      description: 'text-blue-600',
      switchColor: 'data-[state=checked]:bg-blue-500'
    },
    purple: {
      bg: 'bg-purple-50',
      title: 'text-purple-800',
      description: 'text-purple-600',
      switchColor: 'data-[state=checked]:bg-purple-500'
    },
    green: {
      bg: 'bg-green-50',
      title: 'text-green-800',
      description: 'text-green-600',
      switchColor: 'data-[state=checked]:bg-green-500'
    },
    amber: {
      bg: 'bg-amber-50',
      title: 'text-amber-800',
      description: 'text-amber-600',
      switchColor: 'data-[state=checked]:bg-amber-500'
    }
  };

  const colors = colorMap[color];

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${colors.bg} ${className}`}>
      <div>
        <Label htmlFor={id} className={`text-sm font-medium ${colors.title}`}>
          {label}
        </Label>
        <p className={`text-xs ${colors.description}`}>
          {description}
        </p>
      </div>
      <Switch id={id} className={colors.switchColor} defaultChecked={defaultChecked} />
    </div>
  );
}