import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '@/types';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    error: string;
    warning: string;
    income: string;
    expense: string;
    muted: string;
  };
}

const lightColors = {
  background: '#FEFEFE',
  surface: '#FFFFFF',
  primary: '#1E3A8A', // Professional deep blue
  secondary: '#0F766E', // Teal
  accent: '#7C3AED', // Purple
  text: '#0F172A',
  textSecondary: '#475569',
  border: '#E2E8F0',
  success: '#10B981',
  error: '#DC2626',
  warning: '#D97706',
  income: '#10B981',
  expense: '#DC2626',
  muted: '#F1F5F9',
};

const darkColors = {
  background: '#0F172A',
  surface: '#1E293B',
  primary: '#3B82F6', // Brighter blue for dark mode
  secondary: '#14B8A6', // Brighter teal
  accent: '#8B5CF6', // Brighter purple
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#334155',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  income: '#10B981',
  expense: '#EF4444',
  muted: '#334155',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}