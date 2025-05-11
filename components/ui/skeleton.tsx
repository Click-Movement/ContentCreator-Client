import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-gray-200 dark:bg-gray-700",
        className
      )}
    />
  );
}

export function SkeletonText({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-4 w-full", className)} />;
}

export function SkeletonTitle({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-7 w-3/4 mb-4", className)} />;
}

export function SkeletonButton({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-10 w-full rounded-lg", className)} />;
}

export function SkeletonPersonaCard() {
  return (
    <div className="flex flex-col space-y-3 p-4 border border-gray-200 rounded-lg">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

export function SkeletonContentLoader() {
  return (
    <div className="space-y-6 w-full">
      <SkeletonTitle />
      <div className="space-y-3">
        <SkeletonText />
        <SkeletonText />
        <SkeletonText className="w-4/5" />
      </div>
      <div className="space-y-3">
        <SkeletonText />
        <SkeletonText />
        <SkeletonText className="w-3/4" />
      </div>
      <div className="space-y-3">
        <SkeletonText />
        <SkeletonText className="w-5/6" />
      </div>
    </div>
  );
}

export function SkeletonPersonaSelector() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-1/4 mb-1" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

export function SkeletonRewriteForm() {
  return (
    <div className="space-y-6">
      <SkeletonPersonaSelector />
      
      <div className="space-y-1">
        <Skeleton className="h-5 w-1/5" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      
      <div className="space-y-1">
        <Skeleton className="h-5 w-1/5" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <div className="flex space-x-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
      
      <Skeleton className="h-12 w-full rounded-lg mt-6" />
    </div>
  );
}

export function SkeletonRewriteResult() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-6 w-24" />
        <SkeletonTitle className="h-8 w-5/6" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-4">
          <SkeletonText />
          <SkeletonText />
          <SkeletonText className="w-11/12" />
          <SkeletonText className="w-4/5" />
        </div>
        <div className="space-y-4 mt-4">
          <SkeletonText />
          <SkeletonText />
          <SkeletonText className="w-3/4" />
        </div>
        <div className="space-y-4 mt-4">
          <SkeletonText />
          <SkeletonText className="w-5/6" />
          <SkeletonText className="w-11/12" />
          <SkeletonText className="w-4/5" />
        </div>
      </div>
      
      <div className="flex space-x-4">
        <Skeleton className="h-11 w-40 rounded-lg" />
        <Skeleton className="h-11 w-40 rounded-lg" />
      </div>
    </div>
  );
}