import React from 'react';

type UserAvatarProps = {
  name: string;
  avatar: string | null;
  size?: 'sm' | 'md' | 'lg';
};

export default function UserAvatar({ name, avatar, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-12 w-12'
  };

  const fontSizes = {
    sm: 'text-xxs',
    md: 'text-xs',
    lg: 'text-sm'
  };

  const initials = name.split(' ').map(n => n[0]).join('');

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500/80 to-violet-500/80 flex items-center justify-center overflow-hidden`}>
      {avatar ? (
        <img src={avatar} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className={`${fontSizes[size]} font-medium text-white`}>
          {initials}
        </span>
      )}
    </div>
  );
}