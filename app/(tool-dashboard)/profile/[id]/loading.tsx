import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8 bg-slate-50">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div>
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-60 mt-2" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        {/* Form Skeleton */}
        <Card className="mt-6">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          
          <div className="p-6 md:p-8">
            {/* Profile Image Skeleton */}
            <Card className="p-6 border border-slate-200">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-60" />
                  <Skeleton className="h-8 w-28 mt-2" />
                </div>
              </div>
            </Card>
            
            {/* Form Fields Skeleton */}
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-24 w-full" />
              </div>
              
              <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}