import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Expense } from '@/types/expense';

interface DeleteExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: Expense | null;
  onConfirmDelete: (id: string) => void;
}

export function DeleteExpenseDialog({
  open,
  onOpenChange,
  expense,
  onConfirmDelete,
}: DeleteExpenseDialogProps) {
  const { t } = useTranslation();

  const handleConfirm = () => {
    if (expense) {
      onConfirmDelete(expense.id);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteExpense.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteExpense.description', { title: expense?.title ?? '' })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="ghost bg-background text-foreground hover:bg-gray-900 hover:text-foreground">
            {t('deleteExpense.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t('deleteExpense.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
