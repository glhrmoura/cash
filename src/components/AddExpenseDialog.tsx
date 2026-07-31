import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { IconName } from 'lucide-react/dynamic';
import { Expense } from '@/types/expense';
import { ColorPicker } from '@/components/ColorPicker';
import { IconPicker } from '@/components/IconPicker';
import { useCurrencyMask } from '@/hooks/use-currency-mask';

interface AddExpenseDialogProps {
  onAddExpense: (expense: Omit<Expense, 'id' | 'userId'>) => void;
  trigger?: React.ReactNode;
}

export function AddExpenseDialog({ onAddExpense, trigger }: AddExpenseDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const { value, handleChange, getNumericValue, setFormattedValue } = useCurrencyMask();
  const [selectedIcon, setSelectedIcon] = useState<IconName>('droplets');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const newExpense: Omit<Expense, 'id' | 'userId'> = {
      title: title.trim(),
      value: getNumericValue(),
      color: selectedColor,
      icon: selectedIcon,
      createdAt: new Date().toISOString(),
      done: [],
    };

    onAddExpense(newExpense);

    setTitle('');
    setFormattedValue(null);
    setSelectedIcon('droplets');
    setSelectedColor('#3B82F6');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <div className="flex bg-primary items-center justify-center cursor-pointer h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow">
            <Plus className="w-6 h-6 text-black" />
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="w-[90%] sm:max-w-md h-[80dvh] sm:h-[90dvh] flex flex-col">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{t('expenseForm.addTitle')}</DialogTitle>
        </DialogHeader>
        <form id="add-expense-form" onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto">
          <div className="space-y-2 px-6">
            <Label htmlFor="title">{t('expenseForm.name')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('expenseForm.namePlaceholder')}
              required
            />
          </div>
          <div className="space-y-2 px-6">
            <Label htmlFor="value">{t('expenseForm.value')}</Label>
            <Input
              id="value"
              type="text"
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
        </form>
        <div className="flex gap-2 p-6 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
            {t('expenseForm.cancel')}
          </Button>
          <Button type="submit" form="add-expense-form" className="flex-1">
            {t('expenseForm.add')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
