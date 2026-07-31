import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface IconPickerProps {
  selectedIcon: IconName;
  onIconChange: (icon: IconName) => void;
  selectedColor: string;
  label?: string;
}

const iconOptions: IconName[] = [
  'droplets',
  'zap',
  'wifi',
  'car',
  'shopping-cart',
  'phone',
  'home',
  'utensils',
  'graduation-cap',
  'heart',
  'building',
  'credit-card',
  'gamepad-2',
  'music',
  'shirt',
  'book',
  'coffee',
  'pizza',
  'beer',
  'cigarette',
  'pill',
  'gift',
  'plane',
  'hotel',
  'camera',
  'gamepad',
  'tv',
  'headphones',
  'laptop',
  'smartphone',
  'watch',
  'glasses',
  'dumbbell',
  'bike',
  'dog',
  'flower',
  'hammer',
  'wrench',
  'paintbrush',
  'bookmark',
  'star',
];

export function IconPicker({ selectedIcon, onIconChange, selectedColor, label }: IconPickerProps) {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const visibleIcons = showAll ? iconOptions : iconOptions.slice(0, 16);

  return (
    <div className="space-y-2 px-6">
      <Label>{label ?? t('expenseForm.icon')}</Label>
      <div className="grid grid-cols-4 gap-2">
        {visibleIcons.map((icon) => (
          <button
            key={icon}
            type="button"
            onClick={() => onIconChange(icon)}
            className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
              selectedIcon === icon
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: selectedColor }}
            >
              <DynamicIcon name={icon} className="w-4 h-4 text-white" />
            </div>
          </button>
        ))}
      </div>
      {iconOptions.length > 16 && (
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
              {t('expenseForm.showLess')}
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              {t('expenseForm.showMore')}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
