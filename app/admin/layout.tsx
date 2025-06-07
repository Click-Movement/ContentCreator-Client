'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CreditCard, 
  Settings, 
  BarChart, 
  BellRing, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { dashboardTheme } from '@/lib/dashboard-theme';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  const navigationItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Users', href: '/admin/users', icon: <Users className="h-5 w-5" /> },
    { name: 'Content', href: '/admin/content', icon: <FileText className="h-5 w-5" /> },
    { name: 'Subscriptions', href: '/admin/subscriptions', icon: <CreditCard className="h-5 w-5" /> },
    { name: 'Analytics', href: '/admin/analytics', icon: <BarChart className="h-5 w-5" /> },
    { name: 'Settings', href: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <motion.div 
        className="hidden md:flex md:w-64 md:flex-col"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r bg-white">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-br from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Content Creator
              </span>
            </Link>
          </div>
          <div className="mt-8 flex-1 flex flex-col">
            <nav className="flex-1 px-4 pb-4 space-y-2">
              {navigationItems.map((item, index) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative group ${
                      isActive 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="sidebar-indicator"
                        className="absolute left-0 w-1 h-full bg-blue-600 rounded-r-md"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div className={`mr-3 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'}`}>
                      {item.icon}
                    </div>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200">
            <Button variant="outline" className="w-full justify-start text-gray-600 hover:text-red-600 hover:border-red-200">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white shadow-sm z-20 border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                aria-label="Toggle menu"
              >
                {isMobileNavOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
            
            <div className="ml-auto flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full relative transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
              >
                <BellRing className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </Button>
              
              <Avatar className="h-9 w-9 transition-transform hover:scale-105">
                <AvatarImage src="/admin-avatar.png" alt="Admin" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-600 text-white font-medium">
                  AD
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        {/* Mobile Navigation Overlay */}
        <div 
          className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-10 transition-opacity duration-300 md:hidden ${
            isMobileNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMobileNavOpen(false)}
        />
        
        {/* Mobile Navigation Menu */}
        <motion.div 
          className={`fixed top-0 left-0 h-full w-64 bg-white z-20 md:hidden transform transition-transform duration-300 ease-in-out ${
            isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          initial={false}
          animate={isMobileNavOpen ? { x: 0 } : { x: -320 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-br from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Content Creator
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileNavOpen(false)}
              className="text-gray-500"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="p-4 space-y-2">
            {navigationItems.map((item, index) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <div className={`mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {item.icon}
                  </div>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </motion.div>
        
        {/* Main content area */}
        <motion.main 
          className="flex-1 overflow-y-auto bg-gray-50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}