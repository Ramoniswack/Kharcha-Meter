import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
  icon: React.ReactNode;
}

export function SummaryCard({ title, amount, type, icon }: SummaryCardProps) {
  const { colors } = useTheme();
  
  const getAmountColor = () => {
    switch (type) {
      case 'income':
        return colors.success;
      case 'expense':
        return colors.error;
      default:
        return colors.text;
    }
  };

  // Convert hex color to rgba for transparency that works on web and native
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: hexToRgba(getAmountColor(), 0.125) }]}>
          {icon}
        </View>
        <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
      </View>
      <Text style={[styles.amount, { color: getAmountColor() }]}>
        {type === 'expense' && amount > 0 ? '-' : ''}₹{Math.abs(amount).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 100,
    // Web-compatible shadow
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 'auto',
  },
});