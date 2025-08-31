import { IconName } from 'lucide-react/dynamic';

export interface Expense {
  id: string;
  title: string;
  value: number;
  color: string;
  icon: IconName;
  createdAt: string;
  userId: string;
  done: string[];
}
