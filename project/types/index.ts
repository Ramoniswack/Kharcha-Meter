export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CategoryData {
  name: string;
  amount: number;
  color: string;
  icon: string;
}

export type ThemeMode = 'light' | 'dark';