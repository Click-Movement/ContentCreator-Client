export interface UserProfile {
    id: string;
    firstName: string; // Changed to camelCase to match component usage
    lastName: string;  // Changed to camelCase to match component usage
    email: string;
    avatarUrl: string; // Changed from profile_picture_url to match component usage
    website: string;
    bio: string;
    createdAt: string;
    updatedAt: string;
  }


  export type UsageHistoryEntry = {
    date: string;
    used: number;
  };
  
  export type CurrentPlan = {
    name: string;
    maxCredits: number;
    price: string;
    renewalDate: string;
  };
  
  export type UsageDataType = {
    currentPlan: CurrentPlan;
    creditsUsed: number;
    creditsRemaining: number;
    usageHistory: UsageHistoryEntry[];
  };
  