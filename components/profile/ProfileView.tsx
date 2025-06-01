"use client";

import { useState } from "react";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileForm from "@/components/profile/profile-form";
import { UsageStats } from "@/components/profile/usage-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CreditCard, Bell, User, CreditCardIcon, BadgeCheck, ShieldCheck, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Define a type for profile data structure
export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  website: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

// Define a type for usage history item
export interface UsageHistoryItem {
  date: string;
  used: number;
}

// Define a type for subscription plan
export interface SubscriptionPlan {
  name: string;
  maxCredits: number;
  price: string;
  renewalDate?: string;
}

// Define a type for usage data
export interface UsageData {
  currentPlan: SubscriptionPlan;
  creditsUsed: number;
  creditsRemaining: number;
  usageHistory: UsageHistoryItem[];
}

interface ProfileViewProps {
  profile: ProfileData;
  usageData: UsageData;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 80, 
      damping: 15 
    }
  }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 20 
    }
  }
};

export default function ProfileView({ profile, usageData }: ProfileViewProps) {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [showNotification, setShowNotification] = useState(true);
  // const { theme } = useTheme();
  
  // Calculate plan usage percentage
  const usagePercentage = Math.min(
    Math.round((usageData.creditsUsed / usageData.currentPlan.maxCredits) * 100),
    100
  );
  
  // Check if credits are running low (less than 20%)
  const creditsLow = usageData.creditsRemaining / usageData.currentPlan.maxCredits < 0.2;
  
  // Get appropriate plan color
  // const getPlanColor = () => {
  //   switch(usageData.currentPlan.name.toLowerCase()) {
  //     case 'professional': return 'from-blue-500 to-blue-600';
  //     case 'business': return 'from-purple-500 to-purple-600';
  //     case 'free': return 'from-slate-500 to-slate-600';
  //     default: return 'from-blue-500 to-blue-600';
  //   }
  // };

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        variants={itemVariants}
        className="mb-8"
      >
        <ProfileHeader 
          firstName={profile.firstName} 
          lastName={profile.lastName}
          avatarUrl={profile.avatarUrl}
        />
      </motion.div>
      
      <AnimatePresence>
        {showNotification && creditsLow && (
          <motion.div 
            className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md shadow-sm flex items-center justify-between"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
              <p className="text-amber-700">
                Your credits are running low. Consider upgrading your plan to avoid interruptions.
              </p>
            </div>
            <div className="flex space-x-2">
              <Link href="/pricing">
                <Button variant="outline" size="sm" className="text-amber-700 border-amber-300 bg-amber-50 hover:bg-amber-100">
                  Upgrade
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setShowNotification(false)}>
                Dismiss
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6"
        variants={itemVariants}
      >
        {/* Quick Stats Cards */}
        <motion.div 
          className="bg-white rounded-xl p-5 shadow-md border border-slate-100 flex flex-col items-center justify-center"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-blue-100 p-3 rounded-full mb-3">
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>
          <span className="text-2xl font-bold text-slate-800">{usageData.creditsRemaining.toLocaleString()}</span>
          <span className="text-sm text-slate-500">Credits Left</span>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-xl p-5 shadow-md border border-slate-100 flex flex-col items-center justify-center"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-green-100 p-3 rounded-full mb-3">
            <BadgeCheck className="h-6 w-6 text-green-600" />
          </div>
          <span className="text-2xl font-bold text-slate-800">{usageData.currentPlan.name}</span>
          <span className="text-sm text-slate-500">Current Plan</span>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-xl p-5 shadow-md border border-slate-100 flex flex-col items-center justify-center"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-amber-100 p-3 rounded-full mb-3">
            <Trophy className="h-6 w-6 text-amber-600" />
          </div>
          <span className="text-2xl font-bold text-slate-800">{usageData.usageHistory.length}</span>
          <span className="text-sm text-slate-500">Activities</span>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-xl p-5 shadow-md border border-slate-100 flex flex-col items-center justify-center"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-purple-100 p-3 rounded-full mb-3">
            <ShieldCheck className="h-6 w-6 text-purple-600" />
          </div>
          <span className="text-2xl font-bold text-slate-800">
            {new Date(usageData.currentPlan.renewalDate || "").toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <span className="text-sm text-slate-500">Renewal Date</span>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        variants={cardVariants}
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 border-b border-blue-700">
          <motion.h2 
            className="text-xl font-semibold text-white flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {selectedTab === "profile" ? (
              <>
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </>
            ) : (
              <>
                <CreditCardIcon className="h-5 w-5 mr-2" />
                Subscription & Credits
              </>
            )}
          </motion.h2>
          <motion.p 
            className="text-sm text-blue-100 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {selectedTab === "profile" 
              ? "Update your personal information and account settings" 
              : "Manage your subscription plan and monitor credit usage"}
          </motion.p>
        </div>
        
        <Tabs 
          value={selectedTab} 
          onValueChange={setSelectedTab} 
          className="p-6 md:p-8"
        >
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100">
              <TabsTrigger 
                value="profile"
                className={`${selectedTab === "profile" ? "data-[state=active]:bg-white" : ""}`}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="subscription"
                className={`${selectedTab === "subscription" ? "data-[state=active]:bg-white" : ""}`}
              >
                <CreditCardIcon className="h-4 w-4 mr-2" />
                Subscription
              </TabsTrigger>
            </TabsList>
          </motion.div>
          
          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ProfileForm 
                userId={profile.id} 
                initialData={profile} 
              />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="subscription">
            <motion.div 
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Current Plan Summary */}
              <motion.div 
                className="bg-slate-50 rounded-lg p-6 border border-slate-200"
                variants={slideUp}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <BadgeCheck className="h-5 w-5 mr-2 text-blue-600" />
                    Current Plan
                  </h3>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/pricing">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-blue-300 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        View Plans <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-gradient-to-r bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-2">
                      {usageData.currentPlan.name}
                    </span>
                    <p className="text-slate-700 text-sm">
                      {usageData.currentPlan.price}/mo · Renews on {usageData.currentPlan.renewalDate || 'N/A'}
                    </p>
                  </div>
                  
                  {creditsLow && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href="/pricing/upgrade">
                        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Upgrade Plan
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </div>
                
                {/* Credit Usage */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      Credits Used: {usageData.creditsUsed.toLocaleString()} of {usageData.currentPlan.maxCredits.toLocaleString()}
                    </span>
                    <span className={`text-sm font-medium ${creditsLow ? 'text-amber-600' : 'text-blue-600'}`}>
                      {usageData.creditsRemaining.toLocaleString()} credits remaining
                    </span>
                  </div>
                  
                  {/* Progress bar with animation */}
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${
                        usagePercentage > 80 ? 'bg-red-500' : 
                        usagePercentage > 60 ? 'bg-amber-500' : 
                        'bg-green-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${usagePercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
              
              {/* Usage Stats Component */}
              <motion.div variants={slideUp}>
                <UsageStats
                  currentPlan={usageData.currentPlan}
                  creditsUsed={usageData.creditsUsed}
                  creditsRemaining={usageData.creditsRemaining}
                  usageHistory={usageData.usageHistory}
                />
              </motion.div>
              
              {/* Plan Upgrade Banner with hover effects */}
              <motion.div 
                className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-lg shadow-md"
                variants={slideUp}
                whileHover={{ 
                  scale: 1.01,
                  transition: { duration: 0.2 }
                }}
              >
                {/* Animated background elements */}
                <motion.div 
                  className="absolute top-0 right-0 bg-white rounded-full opacity-10 w-32 h-32"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.15, 0.1],
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 8,
                    ease: "easeInOut"
                  }}
                ></motion.div>
                
                <motion.div 
                  className="absolute bottom-0 left-0 bg-white rounded-full opacity-10 w-24 h-24"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.15, 0.1],
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 6,
                    ease: "easeInOut",
                    delay: 2
                  }}
                ></motion.div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Need More Credits?</h3>
                  <p className="mb-4">Upgrade your plan to get more credits and access premium features.</p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/pricing">
                      <Button className="bg-white text-blue-700 hover:bg-blue-50">
                        View Pricing Options <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Recent activity summary */}
              <motion.div 
                className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
                variants={slideUp}
              >
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                  <h3 className="font-medium text-slate-800">Recent Activity</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {usageData.usageHistory.slice(0, 3).map((item, index) => (
                      <motion.li 
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-md mr-3">
                            <CreditCard className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">Used {item.used.toLocaleString()} credits</p>
                            <p className="text-xs text-slate-500">{item.date}</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      <motion.div 
        className="mt-6 text-center text-slate-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>Account created: {new Date(profile.createdAt).toLocaleDateString()}</p>
      </motion.div>
    </motion.div>
  );
}