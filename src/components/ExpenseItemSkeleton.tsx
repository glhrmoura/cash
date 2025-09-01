import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ExpenseItemSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
      <div className="flex items-center space-x-3 flex-1">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="w-6 h-6 rounded" />
        <Skeleton className="w-6 h-6 rounded" />
      </div>
    </div>
  );
};

export default ExpenseItemSkeleton;
