import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import ExpenseItemSkeleton from '@/components/ExpenseItemSkeleton';
import ExpensesSummarySkeleton from '@/components/ExpensesSummarySkeleton';

export function AppLoadingSkeleton() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="app-header fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      </header>

      <div className="app-main mx-auto max-w-2xl space-y-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </Card>

        <ExpensesSummarySkeleton />

        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>

        <div className="space-y-3">
          <ExpenseItemSkeleton />
          <ExpenseItemSkeleton />
          <ExpenseItemSkeleton />
        </div>
      </div>
    </div>
  );
}
