import { useState } from 'react';
import { ExpenseItem } from './ExpenseItem';
import { EditExpenseDialog } from './EditExpenseDialog';
import { DeleteExpenseDialog } from './DeleteExpenseDialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Wallet } from 'lucide-react';
import { Expense } from '@/types/expense';
import ExpenseItemSkeleton from './ExpenseItemSkeleton';
import ExpensesSummarySkeleton from './ExpensesSummarySkeleton';

interface ExpensesListProps {
  expenses: Expense[];
  paidExpenses: Set<string>;
  loading: boolean;
  onTogglePaid: (id: string) => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

export function ExpensesList({
  expenses,
  paidExpenses,
  loading,
  onTogglePaid,
  onEditExpense,
  onDeleteExpense,
}: ExpensesListProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleEdit = (id: string) => {
    const expense = expenses.find(exp => exp.id === id);
    if (expense) {
      setSelectedExpense(expense);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    const expense = expenses.find(exp => exp.id === id);
    if (expense) {
      setSelectedExpense(expense);
      setDeleteDialogOpen(true);
    }
  };

  const handleEditSubmit = (expense: Expense) => {
    onEditExpense(expense);
    setEditDialogOpen(false);
    setSelectedExpense(null);
  };

  const handleDeleteConfirm = (id: string) => {
    onDeleteExpense(id);
    setDeleteDialogOpen(false);
    setSelectedExpense(null);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const totalValue = expenses.reduce((sum, expense) => sum + expense.value, 0);
  const paidValue = expenses
    .filter(expense => paidExpenses.has(expense.id))
    .reduce((sum, expense) => sum + expense.value, 0);
  const unpaidValue = expenses
    .filter(expense => !paidExpenses.has(expense.id))
    .reduce((sum, expense) => sum + expense.value, 0);

  return (
    <div className="space-y-4">
      {loading ? (
        <ExpensesSummarySkeleton />
      ) : (
        <Card className="p-4 bg-card/50">
          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-4 md:text-center">
            <div className="flex justify-between items-center md:flex-col md:justify-center">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-lg font-bold">R$ {formatCurrency(totalValue)}</p>
            </div>
            <div className="flex justify-between items-center md:flex-col md:justify-center">
              <p className="text-sm text-muted-foreground">Pago</p>
              <p className="text-lg font-bold text-success">R$ {formatCurrency(paidValue)}</p>
            </div>
            <div className="flex justify-between items-center md:flex-col md:justify-center">
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-lg font-bold text-destructive">R$ {formatCurrency(unpaidValue)}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Despesas</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSortOrder}
          className="flex items-center gap-2"
        >
          <ArrowUpDown className="w-4 h-4" />
          {sortOrder === 'desc' ? 'Mais recentes' : 'Mais antigas'}
        </Button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <>
            <ExpenseItemSkeleton />
            <ExpenseItemSkeleton />
            <ExpenseItemSkeleton />
          </>
        ) : expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Wallet className="h-10 w-10 text-muted-foreground/50" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Nenhuma despesa ainda</p>
              <p className="text-sm text-muted-foreground">
                Adicione sua primeira despesa para começar
              </p>
            </div>
          </div>
        ) : (
          expenses
            .sort((a, b) => {
              const aIsPaid = paidExpenses.has(a.id);
              const bIsPaid = paidExpenses.has(b.id);
              
              if (aIsPaid && !bIsPaid) return 1;
              if (!aIsPaid && bIsPaid) return -1;
              
              const timeDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              return sortOrder === 'desc' ? timeDiff : -timeDiff;
            })
            .map((expense) => (
              <ExpenseItem
                key={expense.id}
                id={expense.id}
                title={expense.title}
                value={expense.value}
                color={expense.color}
                icon={expense.icon}
                isPaid={paidExpenses.has(expense.id)}
                onTogglePaid={onTogglePaid}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
        )}
      </div>

      <EditExpenseDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        expense={selectedExpense}
        onEditExpense={handleEditSubmit}
      />

      <DeleteExpenseDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        expense={selectedExpense}
        onConfirmDelete={handleDeleteConfirm}
      />
    </div>
  );
}