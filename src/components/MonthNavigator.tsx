import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthNavigatorProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function MonthNavigator({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
}: MonthNavigatorProps) {
  const { t } = useTranslation();
  const monthName = t(`months.${currentMonth.getMonth()}`);
  const year = currentMonth.getFullYear();

  return (
    <div className="flex items-center justify-between bg-card p-4 rounded-lg border">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPreviousMonth}
        className="hover:bg-gray-900 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <h2 className="text-xl font-bold text-center">
        {monthName} {year}
      </h2>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNextMonth}
        className="hover:bg-gray-900 hover:text-white transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
