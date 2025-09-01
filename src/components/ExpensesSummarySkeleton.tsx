import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

const ExpensesSummarySkeleton: React.FC = () => {
  return (
    <Card className="p-4 bg-card/50">
      <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-4 md:text-center">
        <div className="flex justify-between items-center md:flex-col md:justify-center">
          <p className="text-sm text-muted-foreground">Total</p>
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex justify-between items-center md:flex-col md:justify-center">
          <p className="text-sm text-muted-foreground">Pago</p>
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex justify-between items-center md:flex-col md:justify-center">
          <p className="text-sm text-muted-foreground">Pendentes</p>
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </Card>
  );
};

export default ExpensesSummarySkeleton;
