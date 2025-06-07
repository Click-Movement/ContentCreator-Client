import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProfileView from "@/components/profile/ProfileView";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { getUserProfile, getUserUsageData } from "@/actions/actions.user";
import { UsageDataType, UserProfile } from "@/types/types";

// Correct type for page props
interface ProfilePageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// ✅ Generate metadata for the page using the real server action
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params;
  
  // Use the real server action instead of the mock function
  const { profile, error } = await getUserProfile(id as string);

  if (error || !profile) {
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

// ✅ Page component with correct types
export default async function ProfilePage({
  params,
}: ProfilePageProps) {
  const { id } = await params;

  const profileData = await getUserProfile(id as string); 
  const userUsageData = await getUserUsageData(id as string);
  
  // Add proper error handling
  if (!profileData || profileData.error || !profileData.profile) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8 bg-slate-50">
      <Suspense fallback={<LoadingSpinner />}>
        <ProfileView profile={profileData.profile as UserProfile} usageData={userUsageData.usageData as UsageDataType} />
      </Suspense>
    </main>
  );
}