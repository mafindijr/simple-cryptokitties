"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-gradient-to-r from-white/[0.08] via-white/[0.14] to-white/[0.08] bg-[length:220%_100%] animate-shimmer",
        className
      )}
      {...props}
    />
  );
}

export function KittyCardSkeleton() {
  return (
    <div className="gradient-border overflow-hidden rounded-2xl">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-14 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

export function KittyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="kitty-grid">
      {Array.from({ length: count }).map((_, i) => (
        <KittyCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="gradient-border rounded-2xl p-6">
      <Skeleton className="h-5 w-32 mb-2" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-7">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="md:col-span-2 xl:col-span-3 gradient-border rounded-2xl p-6">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-64 mb-4" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        <div className="gradient-border rounded-2xl p-6">
          <Skeleton className="h-5 w-32 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
      <KittyGridSkeleton count={6} />
    </div>
  );
}
