import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconName } from 'lucide-react/dynamic';
import { Expense } from '@/types/expense';
import { ColorPicker } from '@/components/ColorPicker';
import { IconPicker } from '@/components/IconPicker';
import { useCurrencyMask } from '@/hooks/use-currency-mask';

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

  useEffect(() => {
    if (expense && open) {
      setTitle(expense.title);
      setFormattedValue(expense.value);
      setSelectedIcon(expense.icon);
      setSelectedColor(expense.color);
    }
  }, [expense, open, setFormattedValue]);

  const closeDialog = () => {
    const active = document.activeElement;
    if (active instanceof HTMLElement) {
      active.blur();
    }
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !expense) return;

    const updatedExpense: Expense = {
      ...expense,
      title: title.trim(),
      value: getNumericValue(),
      color: selectedColor,
      icon: selectedIcon,
      createdAt: expense.createdAt,
    };

    const active = document.activeElement;
    if (active instanceof HTMLElement) {
      active.blur();
    }

    onEditExpense(updatedExpense);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[90%] sm:max-w-md h-[80dvh] sm:h-[90dvh] flex flex-col"
        onCloseAutoFocus={(event) => event.preventDefault()}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{t('expenseForm.editTitle')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="space-y-4 flex-1 overflow-y-auto">
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
          <div className="flex gap-2 p-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={closeDialog} className="flex-1">
              {t('expenseForm.cancel')}
            </Button>
            <Button type="submit" className="flex-1">
              {t('expenseForm.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
