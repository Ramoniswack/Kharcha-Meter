import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { CategoryData } from '@/types';

interface CategoryChartProps {
  data: CategoryData[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  const { colors } = useTheme();
  
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>Expense Breakdown</Text>
      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const percentage = (item.amount / total) * 100;
          return (
            <View key={item.name} style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
                <Text style={[styles.categoryName, { color: colors.text }]}>{item.name}</Text>
              </View>
              <View style={styles.amountContainer}>
                <Text style={[styles.amount, { color: colors.text }]}>₹{item.amount}</Text>
                <Text style={[styles.percentage, { color: colors.textSecondary }]}>
                  {percentage.toFixed(1)}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    // Web-compatible shadow
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartContainer: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  percentage: {
    fontSize: 12,
    marginTop: 2,
  },
});