import React from 'react';
import {
  // Expense category icons
  UtensilsCrossed as Food,
  Car as Transportation,
  Zap as Utilities,
  GamepadIcon as Entertainment,
  Heart as Healthcare,
  ShoppingBag as Shopping,
  GraduationCap as Education,
  MoreHorizontal as Other,
  // Income category icons
  Banknote as Salary,
  Laptop as Freelance,
  TrendingUp as Investment,
  Building2 as Business,
  Gift as GiftIcon,
  DollarSign
} from 'lucide-react-native';

export interface CategoryConfig {
  name: string;
  icon: React.ComponentType<{size?: number, color?: string}>;
  color: string;
}

export const expenseCategories: CategoryConfig[] = [
  {
    name: 'Food',
    icon: Food,
    color: '#FF6B6B'
  },
  {
    name: 'Transportation',
    icon: Transportation, 
    color: '#4ECDC4'
  },
  {
    name: 'Utilities',
    icon: Utilities,
    color: '#45B7D1'
  },
  {
    name: 'Entertainment',
    icon: Entertainment,
    color: '#96CEB4'
  },
  {
    name: 'Healthcare',
    icon: Healthcare,
    color: '#FFEAA7'
  },
  {
    name: 'Shopping',
    icon: Shopping,
    color: '#DDA0DD'
  },
  {
    name: 'Education',
    icon: Education,
    color: '#98D8C8'
  },
  {
    name: 'Other',
    icon: Other,
    color: '#A0A0A0'
  }
];

export const incomeCategories: CategoryConfig[] = [
  {
    name: 'Salary',
    icon: Salary,
    color: '#00B894'
  },
  {
    name: 'Freelance',
    icon: Freelance,
    color: '#6C5CE7'
  },
  {
    name: 'Investment',
    icon: Investment,
    color: '#A29BFE'
  },
  {
    name: 'Business',
    icon: Business,
    color: '#FD79A8'
  },
  {
    name: 'Gift',
    icon: GiftIcon,
    color: '#FDCB6E'
  },
  {
    name: 'Other',
    icon: Other,
    color: '#A0A0A0'
  }
];

// Helper function to get category config by name
export const getCategoryConfig = (categoryName: string, type: 'income' | 'expense'): CategoryConfig => {
  const categories = type === 'income' ? incomeCategories : expenseCategories;
  return categories.find(cat => cat.name === categoryName) || {
    name: categoryName,
    icon: Other,
    color: '#A0A0A0'
  };
};

// Get category icon component
export const getCategoryIcon = (categoryName: string, type: 'income' | 'expense') => {
  const config = getCategoryConfig(categoryName, type);
  return config.icon;
};

// Get category color
export const getCategoryColor = (categoryName: string, type: 'income' | 'expense') => {
  const config = getCategoryConfig(categoryName, type);
  return config.color;
};

// Export legacy arrays for backward compatibility
export const expenseCategoryNames = expenseCategories.map(cat => cat.name);
export const incomeCategoryNames = incomeCategories.map(cat => cat.name);
