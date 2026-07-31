import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExpenseItem } from './ExpenseItem';
import { EditExpenseDialog } from './EditExpenseDialog';
import { DeleteExpenseDialog } from './DeleteExpenseDialog';
import { AddExpenseDialog } from './AddExpenseDialog';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Plus, Wallet } from 'lucide-react';
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
  onAddExpense: (expense: Omit<Expense, 'id' | 'userId'>) => void;
}

export function ExpensesList({
  expenses,
  paidExpenses,
  loading,
  onTogglePaid,
  onEditExpense,
  onDeleteExpense,
  onAddExpense,
}: ExpensesListProps) {
  const { t, i18n } = useTranslation();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleEdit = (id: string) => {
    const expense = expenses.find((exp) => exp.id === id);
    if (expense) {
      setSelectedExpense(expense);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    const expense = expenses.find((exp) => exp.id === id);
    if (expense) {
      setSelectedExpense(expense);
      setDeleteDialogOpen(true);
    }
  };

  const handleEditSubmit = (expense: Expense) => {
    onEditExpense(expense);
  };

  const handleEditOpenChange = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      window.setTimeout(() => {
        setSelectedExpense(null);
      }, 300);
    }
  };

  const handleDeleteConfirm = (id: string) => {
    onDeleteExpense(id);
    setDeleteDialogOpen(false);
    setSelectedExpense(null);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat(i18n.language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const totalValue = expenses.reduce((sum, expense) => sum + (expense.value ?? 0), 0);
  const paidValue = expenses
    .filter((expense) => paidExpenses.has(expense.id))
    .reduce((sum, expense) => sum + (expense.value ?? 0), 0);
  const unpaidValue = expenses
    .filter((expense) => !paidExpenses.has(expense.id))
    .reduce((sum, expense) => sum + (expense.value ?? 0), 0);
  const hasAnyValue = expenses.some((expense) => expense.value != null && expense.value !== 0);

  return (
    <div className="space-y-4">
      {loading ? (
        <ExpensesSummarySkeleton />
      ) : hasAnyValue ? (
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-card via-card/80 to-background/40 p-5 shadow-[inset_0_1px_0_0_hsl(var(--foreground)/0.04)]">
          <div className="grid grid-cols-3 gap-2">
            <div className="px-1 text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {t('home.total')}
              </p>
              <p className="mt-2 text-xl font-semibold tabular-nums tracking-tight text-foreground">
                R$ {formatCurrency(totalValue)}
              </p>
            </div>
            <div className="relative px-1 text-center">
              <div className="pointer-events-none absolute inset-y-1 left-0 w-px bg-border/80" />
              <div className="pointer-events-none absolute inset-y-1 right-0 w-px bg-border/80" />
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {t('home.paid')}
              </p>
              <p className="mt-2 text-xl font-semibold tabular-nums tracking-tight text-success">
                R$ {formatCurrency(paidValue)}
              </p>
            </div>
            <div className="px-1 text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {t('home.pending')}
              </p>
              <p className="mt-2 text-xl font-semibold tabular-nums tracking-tight text-destructive">
                R$ {formatCurrency(unpaidValue)}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {!loading && expenses.length > 0 && (
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{t('home.expenses')}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortOrder === 'desc' ? t('home.sortNewest') : t('home.sortOldest')}
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <>
            <ExpenseItemSkeleton />
            <ExpenseItemSkeleton />
            <ExpenseItemSkeleton />
          </>
        ) : expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Wallet className="h-10 w-10 text-white" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">{t('home.emptyTitle')}</p>
              <p className="text-sm text-muted-foreground">{t('home.emptyDescription')}</p>
            </div>
            <AddExpenseDialog
              onAddExpense={onAddExpense}
              trigger={
                <Button className="mt-2">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('home.addExpense')}
                </Button>
              }
            />
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
        onOpenChange={handleEditOpenChange}
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
