import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ExpensesSummarySkeleton: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-card via-card/80 to-background/40 p-5 shadow-[inset_0_1px_0_0_hsl(var(--foreground)/0.04)]">
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center gap-2 px-1">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-7 w-16" />
        </div>
        <div className="relative flex flex-col items-center gap-2 px-1">
          <div className="pointer-events-none absolute inset-y-1 left-0 w-px bg-border/80" />
          <div className="pointer-events-none absolute inset-y-1 right-0 w-px bg-border/80" />
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-7 w-16" />
        </div>
        <div className="flex flex-col items-center gap-2 px-1">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-7 w-16" />
        </div>
      </div>
    </div>
  );
};

export default ExpensesSummarySkeleton;
