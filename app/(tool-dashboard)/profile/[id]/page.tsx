import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileForm from "@/components/profile/profile-form";
import { UsageStats } from "@/components/profile/usage-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define a type for profile data structure
interface ProfileData {
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
interface UsageHistoryItem {
  date: string;
  used: number;
}

// Define a type for subscription plan
interface SubscriptionPlan {
  name: string;
  maxCredits: number;
  price: string;
  renewalDate?: string;
}

// Define a type for usage data
interface UsageData {
  currentPlan: SubscriptionPlan;
  creditsUsed: number;
  creditsRemaining: number;
  usageHistory: UsageHistoryItem[];
}

// Define a type for the dummy profiles object
interface ProfilesCollection {
  [key: string]: ProfileData;
}

// Define a type for the usage data collection
interface UsageDataCollection {
  [key: string]: UsageData;
}

interface ProfilePageProps {
  params: { id: string };
}

// Example dummy profile data
const dummyProfiles: ProfilesCollection = {
  "user-1": {
    id: "user-1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
    website: "https://johndoe.com",
    bio: "Content creator and AI enthusiast. I write about technology and AI advancements.",
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-05-20T00:00:00Z"
  },
  "user-2": {
    id: "user-2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    website: "https://sarahjohnson.dev",
    bio: "Digital marketer and blogger with a passion for SEO optimization and content strategy.",
    createdAt: "2023-02-10T00:00:00Z",
    updatedAt: "2023-06-15T00:00:00Z"
  }
};

// Dummy usage data (in a real app, this would come from your database)
const dummyUsageData: UsageDataCollection = {
  "user-1": {
    currentPlan: {
      name: "Professional",
      maxCredits: 10000,
      price: "$29.99",
      renewalDate: "June 15, 2025"
    },
    creditsUsed: 3450,
    creditsRemaining: 6550,
    usageHistory: [
      { date: "May 28, 2025", used: 450 },
      { date: "May 25, 2025", used: 1200 },
      { date: "May 20, 2025", used: 800 },
      { date: "May 15, 2025", used: 1000 }
    ]
  },
  "user-2": {
    currentPlan: {
      name: "Basic",
      maxCredits: 5000,
      price: "$14.99",
      renewalDate: "June 10, 2025"
    },
    creditsUsed: 4200,
    creditsRemaining: 800,
    usageHistory: [
      { date: "May 29, 2025", used: 700 },
      { date: "May 24, 2025", used: 1500 },
      { date: "May 18, 2025", used: 1200 },
      { date: "May 12, 2025", used: 800 }
    ]
  }
};

// Default usage data for when a user doesn't have usage records
const defaultUsageData: UsageData = {
  currentPlan: { name: "Free", maxCredits: 1000, price: "$0" },
  creditsUsed: 0,
  creditsRemaining: 1000,
  usageHistory: []
};

// Generate metadata for SEO
export function generateMetadata({ params }: ProfilePageProps): Metadata {
  const profile = dummyProfiles[params.id];
  
  if (!profile) {
    return {
      title: "Profile Not Found",
    };
  }

  const name = 
    profile.firstName && profile.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : "User Profile";

  return {
    title: `${name} | Content Creator`,
    description: `Manage profile settings for ${name}`,
  };
}

// Define which IDs should be generated at build time
export function generateStaticParams(): Array<{ id: string }> {
  return [
    { id: "user-1" },
    { id: "user-2" }
  ];
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { id } = params;
  
  // Get profile data (dummy data for now)
  const profile = dummyProfiles[id];
  
  // Get usage data with proper type safety
  const usageData = id in dummyUsageData 
    ? dummyUsageData[id] 
    : defaultUsageData;

  if (!profile) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8 bg-slate-50">
      <div className="w-full max-w-4xl mx-auto">
        <ProfileHeader 
          firstName={profile.firstName} 
          lastName={profile.lastName}
          avatarUrl={profile.avatarUrl}
        />
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-blue-800">Account Management</h2>
            <p className="text-sm text-blue-600 mt-1">Update your profile and view your subscription details</p>
          </div>
          
          <Tabs defaultValue="profile" className="p-6 md:p-8">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="subscription">Subscription & Credits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <ProfileForm 
                userId={id} 
                initialData={profile} 
              />
            </TabsContent>
            
            <TabsContent value="subscription">
              <UsageStats
                currentPlan={usageData.currentPlan}
                creditsUsed={usageData.creditsUsed}
                creditsRemaining={usageData.creditsRemaining}
                usageHistory={usageData.usageHistory}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}