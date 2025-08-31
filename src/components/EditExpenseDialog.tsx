import React, { useState, useEffect } from 'react';
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
  onEditExpense 
}: EditExpenseDialogProps) {
  const [title, setTitle] = useState('');
  const { value, handleChange, getNumericValue, setFormattedValue } = useCurrencyMask();
  const [selectedIcon, setSelectedIcon] = useState<IconName>('droplets');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setFormattedValue(expense.value);
      setSelectedIcon(expense.icon);
      setSelectedColor(expense.color);
    }
  }, [expense, setFormattedValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !value.trim() || !expense) return;

    const updatedExpense: Expense = {
      ...expense,
      title: title.trim(),
      value: getNumericValue(),
      color: selectedColor,
      icon: selectedIcon,
      createdAt: expense.createdAt,
    };

    onEditExpense(updatedExpense);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] sm:max-w-md h-[80dvh] sm:h-[90dvh] flex flex-col">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Editar Conta</DialogTitle>
        </DialogHeader>
        <form id="edit-expense-form" onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto">
          <div className="space-y-2 px-6">
            <Label htmlFor="edit-title">Nome da Conta</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Netflix, Academia..."
              required
            />
          </div>
          <div className="space-y-2 px-6">
            <Label htmlFor="edit-value">Valor (R$)</Label>
            <Input
              id="edit-value"
              type="text"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Ex: 29,90"
              required
            />
          </div>
          <ColorPicker
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />
          <IconPicker
            selectedIcon={selectedIcon}
            onIconChange={setSelectedIcon}
            selectedColor={selectedColor}
          />
        </form>
        <div className="flex gap-2 p-6 pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            form="edit-expense-form"
            className="flex-1"
          >
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
