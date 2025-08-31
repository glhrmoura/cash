import React from 'react';
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
          <AlertDialogTitle>Excluir Despesa</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a conta <strong>"{expense?.title}"</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="ghost bg-background text-foreground hover:bg-gray-900 hover:text-foreground">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
