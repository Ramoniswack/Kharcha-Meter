import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DatabaseService } from '../services/database';
import { useAuth } from './AuthContext';
import { Transaction, CategoryData } from '../types';
import { getCategoryData, dummyTransactions } from '../utils/dummyData';

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  return url && key && 
         url !== 'your_supabase_url_here' && 
         key !== 'your_supabase_anon_key_here';
};

interface DataContextType {
  transactions: Transaction[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  
  // Data operations
  loadTransactions: () => Promise<void>;
  createTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<boolean>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  
  // Computed data
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryData: CategoryData[];
  recentTransactions: Transaction[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Use dummy data when Supabase is not configured
      setTransactions(dummyTransactions);
      return;
    }
    
    if (user) {
      loadTransactions();
    } else {
      setTransactions([]);
    }
  }, [user]);

  const loadTransactions = async () => {
    if (!isSupabaseConfigured()) {
      // Use dummy data when Supabase is not configured
      setTransactions(dummyTransactions);
      setRefreshing(false);
      return;
    }
    
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await DatabaseService.getTransactions(user.id);
      setTransactions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const createTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      // Mock success for demo mode
      console.log('Demo mode: Transaction would be created:', transaction);
      return true;
    }
    
    if (!user) return false;

    try {
      const newTransaction = await DatabaseService.createTransaction(transaction, user.id);
      if (newTransaction) {
        setTransactions(prev => [newTransaction, ...prev]);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Failed to create transaction');
      console.error('Error creating transaction:', err);
      return false;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>): Promise<boolean> => {
    try {
      const updatedTransaction = await DatabaseService.updateTransaction(id, updates);
      if (updatedTransaction) {
        setTransactions(prev => 
          prev.map(t => t.id === id ? updatedTransaction : t)
        );
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Failed to update transaction');
      console.error('Error updating transaction:', err);
      return false;
    }
  };

  const deleteTransaction = async (id: string): Promise<boolean> => {
    try {
      const success = await DatabaseService.deleteTransaction(id);
      if (success) {
        setTransactions(prev => prev.filter(t => t.id !== id));
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Failed to delete transaction');
      console.error('Error deleting transaction:', err);
      return false;
    }
  };

  // Computed values
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  const recentTransactions = transactions.slice(0, 5);
  const categoryData = getCategoryData(transactions);

  const refreshTransactions = async () => {
    setRefreshing(true);
    await loadTransactions();
  };

  return (
    <DataContext.Provider
      value={{
        transactions,
        loading,
        refreshing,
        error,
        loadTransactions: refreshTransactions,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        totalIncome,
        totalExpense,
        balance,
        categoryData,
        recentTransactions,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
