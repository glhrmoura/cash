import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Expense } from '@/types/expense';

const EXPENSES_COLLECTION = 'expenses';
const LOCAL_STORAGE_KEY = 'cash:guest:expenses';

export const GUEST_USER_ID = 'guest';

type ExpensesListener = (expenses: Expense[]) => void;

const localListeners = new Set<ExpensesListener>();

const isGuest = (userId: string) => userId === GUEST_USER_ID;

const readLocalExpenses = (): Expense[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalExpenses = (expenses: Expense[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(expenses));
  localListeners.forEach((listener) => listener([...expenses].sort((a, b) => (
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ))));
};

const getSortedLocalExpenses = () => (
  [...readLocalExpenses()].sort((a, b) => (
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ))
);

export const expenseService = {
  async addExpense(expense: Omit<Expense, 'id'>): Promise<string> {
    if (isGuest(expense.userId)) {
      const id = crypto.randomUUID();
      const expenses = readLocalExpenses();
      expenses.push({ ...expense, id });
      writeLocalExpenses(expenses);
      return id;
    }

    const docRef = await addDoc(collection(db, EXPENSES_COLLECTION), expense);
    return docRef.id;
  },

  async updateExpense(expenseId: string, updates: Partial<Expense>, userId?: string): Promise<void> {
    if (userId && isGuest(userId)) {
      const expenses = readLocalExpenses();
      const index = expenses.findIndex((expense) => expense.id === expenseId);
      if (index === -1) return;
      expenses[index] = { ...expenses[index], ...updates, id: expenseId };
      writeLocalExpenses(expenses);
      return;
    }

    const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
    await updateDoc(expenseRef, updates);
  },

  async deleteExpense(expenseId: string, userId?: string): Promise<void> {
    if (userId && isGuest(userId)) {
      const expenses = readLocalExpenses().filter((expense) => expense.id !== expenseId);
      writeLocalExpenses(expenses);
      return;
    }

    const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
    await deleteDoc(expenseRef);
  },

  async getExpenses(userId: string): Promise<Expense[]> {
    if (isGuest(userId)) {
      return getSortedLocalExpenses();
    }

    const q = query(
      collection(db, EXPENSES_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Expense));
  },

  subscribeToExpenses(userId: string, callback: (expenses: Expense[]) => void): Unsubscribe {
    if (isGuest(userId)) {
      localListeners.add(callback);
      callback(getSortedLocalExpenses());
      return () => {
        localListeners.delete(callback);
      };
    }

    const q = query(
      collection(db, EXPENSES_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const expenses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Expense));
      callback(expenses);
    });
  },

  async migrateGuestExpenses(userId: string): Promise<void> {
    const guestExpenses = readLocalExpenses();
    if (guestExpenses.length === 0) return;

    await Promise.all(
      guestExpenses.map(async (expense) => {
        await addDoc(collection(db, EXPENSES_COLLECTION), {
          title: expense.title,
          value: expense.value,
          color: expense.color,
          icon: expense.icon,
          createdAt: expense.createdAt,
          userId,
          done: expense.done,
        });
      })
    );

    localStorage.removeItem(LOCAL_STORAGE_KEY);
  },
};
