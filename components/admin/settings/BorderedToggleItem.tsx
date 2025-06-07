import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type BorderedToggleItemProps = {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
  color?: 'blue' | 'purple' | 'green' | 'amber';
  className?: string;
};

export default function BorderedToggleItem({
  id,
  label,
  description,
  defaultChecked = false,
  color = 'amber',
  className = ''
}: BorderedToggleItemProps) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-l-4 border-blue-400',
      title: 'text-blue-800',
      description: 'text-blue-600',
      switchColor: 'data-[state=checked]:bg-blue-500'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-l-4 border-purple-400',
      title: 'text-purple-800',
      description: 'text-purple-600',
      switchColor: 'data-[state=checked]:bg-purple-500'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-l-4 border-green-500',
      title: 'text-green-800',
      description: 'text-green-600',
      switchColor: 'data-[state=checked]:bg-green-500'
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-l-4 border-amber-400',
      title: 'text-amber-800',
      description: 'text-amber-600',
      switchColor: 'data-[state=checked]:bg-amber-500'
    }
  };

  const colors = colorMap[color];

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg ${colors.bg} ${colors.border} ${className}`}>
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