import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconName } from 'lucide-react/dynamic';
import { Expense } from '@/types/expense';
import { ColorPicker } from '@/components/ColorPicker';
import { IconPicker } from '@/components/IconPicker';
import { useCurrencyMask } from '@/hooks/use-currency-mask';
import { blockPointerEvents, blurActiveElement, waitForKeyboardClose } from '@/utils/ios-keyboard';

interface EditExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: Expense | null;
  onEditExpense: (expense: Expense) => void;
}

export function EditExpenseDialog({
  open,
  onOpenChange,
  expense,
  onEditExpense,
}: EditExpenseDialogProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const { value, handleChange, getNumericValue, setFormattedValue } = useCurrencyMask();
  const [selectedIcon, setSelectedIcon] = useState<IconName>('droplets');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (expense && open) {
      setTitle(expense.title);
      setFormattedValue(expense.value);
      setSelectedIcon(expense.icon);
      setSelectedColor(expense.color);
      setClosing(false);
    }
  }, [expense, open, setFormattedValue]);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const closeSafely = async (afterBlur?: () => void) => {
    if (closing) return;
    setClosing(true);
    blurActiveElement();
    afterBlur?.();
    await waitForKeyboardClose();
    blockPointerEvents();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !expense || closing) return;

    const updatedExpense: Expense = {
      ...expense,
      title: title.trim(),
      value: getNumericValue(),
      color: selectedColor,
      icon: selectedIcon,
      createdAt: expense.createdAt,
    };

    await closeSafely(() => onEditExpense(updatedExpense));
  };

  if (!open || !expense) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          void closeSafely();
        }
      }}
    >
      <div
        className="flex h-[min(80dvh,40rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold tracking-tight">{t('expenseForm.editTitle')}</h2>
          <button
            type="button"
            onClick={() => void closeSafely()}
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground"
            aria-label={t('expenseForm.cancel')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-4 flex-1 overflow-y-auto py-4">
            <div className="space-y-2 px-6">
              <Label htmlFor="edit-title">{t('expenseForm.name')}</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('expenseForm.namePlaceholder')}
                required
              />
            </div>
            <div className="space-y-2 px-6">
              <Label htmlFor="edit-value">{t('expenseForm.value')}</Label>
              <Input
                id="edit-value"
                type="text"
                inputMode="decimal"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={t('expenseForm.valuePlaceholder')}
              />
            </div>
            <ColorPicker selectedColor={selectedColor} onColorChange={setSelectedColor} />
            <IconPicker
              selectedIcon={selectedIcon}
              onIconChange={setSelectedIcon}
              selectedColor={selectedColor}
            />
          </div>
          <div className="flex gap-2 border-t border-border p-6 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => void closeSafely()}
              className="flex-1"
              disabled={closing}
            >
              {t('expenseForm.cancel')}
            </Button>
            <Button type="submit" className="flex-1" disabled={closing}>
              {t('expenseForm.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
