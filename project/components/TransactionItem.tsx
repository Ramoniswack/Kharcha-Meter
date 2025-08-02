import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Transaction } from '@/types';
import { getCategoryIcon, getCategoryColor } from '@/utils/categoryIcons';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const { colors } = useTheme();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const amountColor = transaction.type === 'income' ? colors.success : colors.error;
  const amountPrefix = transaction.type === 'income' ? '+' : '-';
  
  // Get category icon and color
  const IconComponent = getCategoryIcon(transaction.category, transaction.type);
  const categoryColor = getCategoryColor(transaction.category, transaction.type);

  // Convert hex color to rgba for transparency that works on web and native
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: hexToRgba(categoryColor, 0.125) }]}>
          <IconComponent size={20} color={categoryColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {transaction.title}
          </Text>
          <Text style={[styles.category, { color: colors.textSecondary }]}>
            {transaction.category}
          </Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {formatDate(transaction.date)}
          </Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {amountPrefix}₹{transaction.amount.toLocaleString()}
        </Text>
        <View style={[
          styles.typeBadge, 
          { backgroundColor: transaction.type === 'income' ? colors.success : colors.error }
        ]}>
          <Text style={styles.typeText}>
            {transaction.type.toUpperCase()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    // Web-compatible shadow
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
    fontWeight: '600',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});