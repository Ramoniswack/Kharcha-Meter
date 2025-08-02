import { Transaction, CategoryData } from '@/types';
import { expenseCategoryNames, incomeCategoryNames } from './categoryIcons';

export const dummyTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Salary',
    amount: 5000,
    type: 'income',
    category: 'Salary',
    date: '2025-01-15T09:00:00.000Z',
    notes: 'Monthly salary deposit'
  },
  {
    id: '2',
    title: 'Grocery Shopping',
    amount: 150,
    type: 'expense',
    category: 'Food',
    date: '2025-01-14T18:30:00.000Z',
    notes: 'Weekly groceries from supermarket'
  },
  {
    id: '3',
    title: 'Freelance Work',
    amount: 800,
    type: 'income',
    category: 'Freelance',
    date: '2025-01-13T14:20:00.000Z',
    notes: 'Web development project payment'
  },
  {
    id: '4',
    title: 'Electric Bill',
    amount: 120,
    type: 'expense',
    category: 'Utilities',
    date: '2025-01-12T10:15:00.000Z',
    notes: 'Monthly electricity bill'
  },
  {
    id: '5',
    title: 'Coffee',
    amount: 15,
    type: 'expense',
    category: 'Food',
    date: '2025-01-11T08:45:00.000Z',
    notes: 'Morning coffee at cafe'
  },
  {
    id: '6',
    title: 'Investment Return',
    amount: 300,
    type: 'income',
    category: 'Investment',
    date: '2025-01-10T16:00:00.000Z',
    notes: 'Dividend payment'
  },
  {
    id: '7',
    title: 'Gas Station',
    amount: 60,
    type: 'expense',
    category: 'Transportation',
    date: '2025-01-09T19:20:00.000Z',
    notes: 'Fuel for car'
  },
  {
    id: '8',
    title: 'Bonus',
    amount: 1000,
    type: 'income',
    category: 'Salary',
    date: '2025-01-08T11:30:00.000Z',
    notes: 'Performance bonus'
  }
];

export const expenseCategories = expenseCategoryNames;

export const incomeCategories = incomeCategoryNames;

export const getCategoryData = (transactions: Transaction[]): CategoryData[] => {
  const categoryMap = new Map<string, number>();
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(transaction => {
      const current = categoryMap.get(transaction.category) || 0;
      categoryMap.set(transaction.category, current + transaction.amount);
    });

  const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#F97316', '#EC4899', '#6B7280'];
  
  return Array.from(categoryMap.entries()).map(([name, amount], index) => ({
    name,
    amount,
    color: colors[index % colors.length],
    icon: 'circle' // Simple default icon
  }));
};