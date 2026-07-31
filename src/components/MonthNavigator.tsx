import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthNavigatorProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onCurrentMonth: () => void;
}

export function MonthNavigator({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
  onCurrentMonth,
}: MonthNavigatorProps) {
  const { t } = useTranslation();
  const monthName = t(`months.${currentMonth.getMonth()}`);
  const year = currentMonth.getFullYear();
  const now = new Date();
  const isCurrentMonth =
    currentMonth.getMonth() === now.getMonth() &&
    currentMonth.getFullYear() === now.getFullYear();

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 items-center justify-between rounded-lg border bg-card p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPreviousMonth}
          className="transition-colors hover:bg-gray-900 hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <h2 className="text-center text-xl font-bold">
          {monthName} {year}
        </h2>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNextMonth}
          className="transition-colors hover:bg-gray-900 hover:text-white"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <button
        type="button"
        onClick={onCurrentMonth}
        disabled={isCurrentMonth}
        aria-label={t('home.currentMonth')}
        className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground transition hover:bg-accent disabled:pointer-events-none disabled:text-muted-foreground"
      >
        <CalendarDays className="h-6 w-6" />
      </button>
    </div>
  );
}
