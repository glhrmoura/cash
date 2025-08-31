import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  label?: string;
}

const colorOptions = [
  '#3B82F6',
  '#F59E0B',
  '#8B5CF6',
  '#EF4444',
  '#10B981',
  '#6B7280',
  '#DC2626',
  '#EC4899',
  '#6366F1',
  '#059669',
  '#7C3AED',
  '#DB2777',
  '#0891B2',
  '#CA8A04',
  '#BE185D',
  '#84CC16',
  '#F97316',
  '#06B6D4',
  '#8B5A2B',
  '#1F2937',
  '#FBBF24',
  '#A78BFA',
  '#34D399',
  '#FB7185',
  '#60A5FA',
  '#FDE047',
  '#C084FC',
  '#4ADE80',
  '#F87171',
  '#A3E635',
  '#22D3EE',
  '#D8B4FE',
  '#86EFAC',
  '#FCA5A5',
];

export function ColorPicker({ selectedColor, onColorChange, label = 'Cor' }: ColorPickerProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleColors = showAll ? colorOptions : colorOptions.slice(0, 12);

  return (
    <div className="space-y-2 px-6">
      <Label>{label}</Label>
      <div className="grid grid-cols-6 gap-2">
        {visibleColors.map((color, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onColorChange(color)}
            className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-105 ${
              selectedColor === color 
                ? 'border-primary ring-2 ring-primary/20' 
                : 'border-border hover:border-primary/50'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      {colorOptions.length > 12 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-2 hover:bg-muted/30 hover:text-muted-foreground transition-colors"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Ver menos
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Ver mais
            </>
          )}
        </Button>
      )}
    </div>
  );
}
