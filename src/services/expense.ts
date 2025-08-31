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

export const expenseService = {
  async addExpense(expense: Omit<Expense, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, EXPENSES_COLLECTION), expense);
    return docRef.id;
  },

  async updateExpense(expenseId: string, updates: Partial<Expense>): Promise<void> {
    const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
    await updateDoc(expenseRef, updates);
  },

  async toggleExpenseDone(expenseId: string, monthKey: string, isDone: boolean): Promise<void> {
    const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
    const expenseDoc = await getDocs(query(
      collection(db, EXPENSES_COLLECTION),
      where('__name__', '==', expenseId)
    ));
    
    if (!expenseDoc.empty) {
      const currentDone = expenseDoc.docs[0].data().done || [];
      let newDone: string[];
      
      if (isDone) {
        newDone = currentDone.includes(monthKey) ? currentDone : [...currentDone, monthKey];
      } else {
        newDone = currentDone.filter((month: string) => month !== monthKey);
      }
      
      await updateDoc(expenseRef, { done: newDone });
    }
  },

  async deleteExpense(expenseId: string): Promise<void> {
    const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
    await deleteDoc(expenseRef);
  },

  async getExpenses(userId: string): Promise<Expense[]> {
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


};
