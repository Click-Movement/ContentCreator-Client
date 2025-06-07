import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LucideIcon } from 'lucide-react';

type SelectOption = {
  value: string;
  label: string;
};

type SelectWithIconProps = {
  id: string;
  label: string;
  defaultValue: string;
  options: SelectOption[];
  icon?: LucideIcon;
  color?: string;
  description?: string;
  className?: string;
};

export default function SelectWithIcon({
  id,
  label,
  defaultValue,
  options,
  icon: Icon,
  color = 'blue',
  description,
  className = ''
}: SelectWithIconProps) {
  const colorMap = {
    blue: {
      border: 'border-blue-100',
      focus: 'focus:border-blue-300',
      ring: 'focus:ring-blue-200',
      iconColor: 'text-blue-400'
    },
    purple: {
      border: 'border-purple-100',
      focus: 'focus:border-purple-300',
      ring: 'focus:ring-purple-200',
      iconColor: 'text-purple-400'
    },
    green: {
      border: 'border-green-200',
      focus: 'focus:border-green-300',
      ring: 'focus:ring-green-200',
      iconColor: 'text-green-400'
    },
    amber: {
      border: 'border-amber-200',
      focus: 'focus:border-amber-300',
      ring: 'focus:ring-amber-200',
      iconColor: 'text-amber-400'
    }
  };

  const colors = colorMap[color as keyof typeof colorMap] || colorMap.blue;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${colors.iconColor} h-4 w-4 pointer-events-none z-10`} />
        )}
        <Select defaultValue={defaultValue}>
          <SelectTrigger className={`${colors.border} ${colors.focus} ${colors.ring} ${Icon ? 'pl-10' : ''}`}>
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
}