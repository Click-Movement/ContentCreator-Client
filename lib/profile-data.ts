import { ProfileData, UsageData } from "@/components/profile/ProfileView";

// Define a type for the dummy profiles object
interface ProfilesCollection {
  [key: string]: ProfileData;
}

// Define a type for the usage data collection
interface UsageDataCollection {
  [key: string]: UsageData;
}

// Example dummy profile data
export const dummyProfiles: ProfilesCollection = {
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
export const dummyUsageData: UsageDataCollection = {
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
export const defaultUsageData: UsageData = {
  currentPlan: { name: "Free", maxCredits: 1000, price: "$0" },
  creditsUsed: 0,
  creditsRemaining: 1000,
  usageHistory: []
};

// Function to get profile data by ID
export async function getProfileData(id: string): Promise<ProfileData | null> {
  // In a real app, this would be a database query
  return dummyProfiles[id] || null;
}

// Function to get usage data by ID
export async function getUsageData(id: string): Promise<UsageData> {
  // In a real app, this would be a database query
  return id in dummyUsageData ? dummyUsageData[id] : defaultUsageData;
}