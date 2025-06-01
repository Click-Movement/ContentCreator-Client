"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import UserProfileDropdown from "@/components/UserProfileDropdown"
import { Menu, X } from "lucide-react"

export default function NavBar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Don't show navbar on auth pages
  if (pathname?.startsWith('/auth/')) {
    return null
  }
  
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') {
      return true
    }
    return path !== '/' && pathname?.startsWith(path)
  }
  
  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm bg-white/90 dark:bg-gray-950/90">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Content Rewriter
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link 
              href="/"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                isActive('/') 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/rewrite"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                isActive('/rewrite') 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Rewrites
            </Link>
            <Link 
              href="/about"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                isActive('/about') 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              About
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          
          {/* Right side items - only show user profile, remove API key button */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <UserProfileDropdown />
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2 border-t border-gray-200 dark:border-gray-800">
            <Link 
              href="/"
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                isActive('/') 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/rewrite"
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                isActive('/rewrite') 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Rewrites
            </Link>
            <Link 
              href="/about"
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                isActive('/about') 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            
            <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-800">
              <div className="px-3 py-2">
                <UserProfileDropdown />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}