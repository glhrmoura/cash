import { useState, useEffect } from 'react';
import { MonthNavigator } from '@/components/MonthNavigator';
import { ExpensesList } from '@/components/ExpensesList';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/auth';
import { expenseService, GUEST_USER_ID } from '@/services/expense';
import { Expense } from '@/types/expense';

const Index = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = user?.uid ?? GUEST_USER_ID;

  const getMonthKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  useEffect(() => {
    let cancelled = false;
    let unsubscribe = () => {};

    const setup = async () => {
      setLoading(true);

      if (user) {
        try {
          await expenseService.migrateGuestExpenses(user.uid);
        } catch (error) {
          console.error('Error migrating guest expenses:', error);
        }
      }

      if (cancelled) return;

      unsubscribe = expenseService.subscribeToExpenses(userId, (nextExpenses) => {
        setExpenses(nextExpenses);
        setLoading(false);
      });
    };

    setup();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [user, userId]);

  const currentMonthKey = getMonthKey(currentMonth);
  const currentMonthPaid = new Set(
    expenses
      .filter(expense => expense.done.includes(currentMonthKey))
      .map(expense => expense.id)
  );

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  const handleTogglePaid = async (expenseId: string) => {
    const expense = expenses.find(exp => exp.id === expenseId);
    if (!expense) return;

    const isCurrentlyPaid = expense.done.includes(currentMonthKey);
    const previousDone = expense.done;
    const nextDone = isCurrentlyPaid
      ? expense.done.filter((month) => month !== currentMonthKey)
      : [...expense.done, currentMonthKey];

    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === expenseId ? { ...exp, done: nextDone } : exp
      )
    );

    try {
      await expenseService.updateExpense(expenseId, { done: nextDone }, userId);
    } catch (error) {
      console.error('Error updating expense done status:', error);
      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === expenseId ? { ...exp, done: previousDone } : exp
        )
      );
    }
  };

  const handleAddExpense = async (newExpense: Omit<Expense, 'id' | 'userId'>) => {
    try {
      const expenseWithUser = {
        ...newExpense,
        userId
      };
      await expenseService.addExpense(expenseWithUser);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleEditExpense = async (editedExpense: Expense) => {
    try {
      await expenseService.updateExpense(editedExpense.id, editedExpense, userId);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await expenseService.deleteExpense(expenseId, userId);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <div className="app-main mx-auto max-w-2xl space-y-6">
        <MonthNavigator
          currentMonth={currentMonth}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          onCurrentMonth={handleCurrentMonth}
        />
        <ExpensesList
          expenses={expenses}
          paidExpenses={currentMonthPaid}
          loading={loading}
          onTogglePaid={handleTogglePaid}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
          onAddExpense={handleAddExpense}
        />
      </div>
      <div className="app-fab fixed right-6 z-50">
        <AddExpenseDialog onAddExpense={handleAddExpense} />
      </div>
    </div>
  );
};

export default Index;
