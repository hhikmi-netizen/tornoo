import { CardSkeleton } from "@/components/ui/Skeleton";

export default function ClientLoading() {
  return (
    <div className="bg-white min-h-svh px-4 pt-20 space-y-3">
      {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
    </div>
  );
}
