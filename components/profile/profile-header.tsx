"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

export default function ProfileHeader({ firstName, lastName, avatarUrl }: ProfileHeaderProps) {
  const displayName = `${firstName} ${lastName}`;
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="text-lg font-bold bg-blue-100 text-blue-700">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{displayName}</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences</p>
        </div>
      </div>
      
      <Button variant="outline" size="sm" asChild>
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}