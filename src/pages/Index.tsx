import { useState, useEffect } from 'react';
import { MonthNavigator } from '@/components/MonthNavigator';
import { ExpensesList } from '@/components/ExpensesList';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/auth';
import { expenseService } from '@/services/expense';
import { Expense } from '@/types/expense';

const Index = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const getMonthKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!user) return;

    const unsubscribeExpenses = expenseService.subscribeToExpenses(user.uid, (expenses) => {
      setExpenses(expenses);
    });

    return () => {
      unsubscribeExpenses();
    };
  }, [user]);

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

  const handleTogglePaid = async (expenseId: string) => {
    if (!user) return;
    
    const expense = expenses.find(exp => exp.id === expenseId);
    if (!expense) return;
    
    const isCurrentlyPaid = expense.done.includes(currentMonthKey);
    
    try {
      await expenseService.toggleExpenseDone(expenseId, currentMonthKey, !isCurrentlyPaid);
    } catch (error) {
      console.error('Error updating expense done status:', error);
    }
  };

  const handleAddExpense = async (newExpense: Omit<Expense, 'id' | 'userId'>) => {
    if (!user) return;
    
    try {
      const expenseWithUser = {
        ...newExpense,
        userId: user.uid
      };
      await expenseService.addExpense(expenseWithUser);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleEditExpense = async (editedExpense: Expense) => {
    try {
      await expenseService.updateExpense(editedExpense.id, editedExpense);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!user) return;
    
    try {
      await expenseService.deleteExpense(expenseId);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <div className="container max-w-2xl mx-auto p-4 space-y-6">
        <MonthNavigator
          currentMonth={currentMonth}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />
        <ExpensesList
          expenses={expenses}
          paidExpenses={currentMonthPaid}
          onTogglePaid={handleTogglePaid}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
        />
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <AddExpenseDialog onAddExpense={handleAddExpense} />
      </div>
    </div>
  );
};

export default Index;
