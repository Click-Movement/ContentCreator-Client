/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User, Settings, HelpCircle } from "lucide-react"
import { createClient } from "@/supabase/client"

export default function UserProfileDropdown() {
  const router = useRouter()
const [user, setUser] = useState<{
    id: string;
    email?: string;
    app_metadata: {
        provider?: string;
        [key: string]: any;
    };
    user_metadata: {
        full_name?: string;
        avatar_url?: string;
        [key: string]: any;
    };
    aud: string;
    [key: string]: any;
} | null>(null)
  const [loading, setLoading] = useState(true)

  // Simple approach - just like middleware
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = await createClient()
        
        // Use the same method as in middleware - keep it simple!
        const { data: { user }, error } = await supabase.auth.getUser(); 
        console.log("User fetched:", user)
        
        if (error) {
          console.error("Error fetching user:", error.message)
          setUser(null)
        } else {
          setUser(user)
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleSignOut = async () => {
    try {
      const supabase = await createClient()
      await supabase.auth.signOut()
      router.push('/auth/signin')
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "U"
    
    if (user.user_metadata?.full_name) {
      const nameParts = user.user_metadata.full_name.split(" ")
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      } else if (nameParts[0]) {
        return nameParts[0][0].toUpperCase()
      }
    }
    
    if (user.email) {
      return user.email[0].toUpperCase()
    }
    
    return "U"
  }

  if (loading) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    )
  }

  if (!user) {
    return (
      <button 
        onClick={() => router.push('/auth/signin')}
        className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-4 rounded-md text-sm font-medium transition-all duration-200"
      >
        Sign In
      </button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label="User menu"
        >
          <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-800">
            <AvatarImage 
              src={user.user_metadata?.avatar_url || ""} 
              alt="User avatar" 
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline-block text-sm font-medium">
            {user.user_metadata?.full_name || user.email?.split('@')[0] || "User"}
          </span>
          <svg className="hidden md:block h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-2.5 border-b">
          <p className="font-medium truncate">
            {user.user_metadata?.full_name || user.email?.split('@')[0] || "User"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user.email}
          </p>
        </div>
        
        <DropdownMenuItem 
          onClick={() => router.push('/')} 
          className="cursor-pointer gap-2"
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => router.push('/')} 
          className="cursor-pointer gap-2"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => router.push('/')} 
          className="cursor-pointer gap-2"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleSignOut} 
          className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}