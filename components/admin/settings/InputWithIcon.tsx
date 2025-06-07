import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';

type InputWithIconProps = {
  id: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  icon?: LucideIcon;
  color?: string;
  type?: string;
  description?: string;
  className?: string;
};

export default function InputWithIcon({
  id,
  label,
  placeholder,
  defaultValue,
  icon: Icon,
  color = 'blue',
  type = 'text',
  description,
  className = ''
}: InputWithIconProps) {
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
          <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${colors.iconColor} h-4 w-4`} />
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={`${colors.border} ${colors.focus} ${colors.ring} ${Icon ? 'pl-10' : ''}`}
        />
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
}