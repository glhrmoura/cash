import React from 'react';
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
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const monthName = monthNames[currentMonth.getMonth()];
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