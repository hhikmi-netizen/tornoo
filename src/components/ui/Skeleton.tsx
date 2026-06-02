import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-[#eaedf0]",
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-[22px] border border-line p-3 flex gap-4">
      <Skeleton className="w-24 h-24 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
        <div className="flex justify-between items-center mt-2">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-9 w-28 rounded-[15px]" />
        </div>
      </div>
    </div>
  );
}

export function NotifSkeleton() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-[18px] border border-line">
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}
