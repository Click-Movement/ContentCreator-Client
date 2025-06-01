import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProfileView from "@/components/profile/ProfileView";
import { getProfileData, getUsageData } from "@/lib/profile-data";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

// Correct type for page props
interface ProfilePageProps {
 params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// ✅ Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const {id} = await params;
  const profile = await getProfileData(id);

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

// ✅ Define static paths for prerendering
export function generateStaticParams(): Array<{ id: string }> {
  return [{ id: "user-1" }, { id: "user-2" }];
}

// ✅ Page component with correct types
export default async function ProfilePage({
  params,
}: ProfilePageProps) {
  const { id } =  await params;

  const profile = await getProfileData(id);
  if (!profile) {
    notFound();
  }

  const usageData = await getUsageData(id);

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8 bg-slate-50">
      <Suspense fallback={<LoadingSpinner />}>
        <ProfileView profile={profile} usageData={usageData} />
      </Suspense>
    </main>
  );
}
