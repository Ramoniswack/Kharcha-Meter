import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { router } from 'expo-router';
import { Edit3 } from 'lucide-react-native';
import { Transaction } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { colors } = useTheme();

  const handleEdit = () => {
    router.push({
      pathname: '/edit-transaction',
      params: { id: transaction.id }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.transactionInfo}>
        <View style={styles.header}>
          <Text style={[styles.description, { color: colors.text }]}>
            {transaction.title}
          </Text>
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Edit3 size={16} color={colors.text} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.category, { color: colors.textSecondary }]}>
          {transaction.category}
        </Text>
      </View>
      
      <View style={styles.amountContainer}>
        <Text 
          style={[
            styles.amount, 
            { color: transaction.type === 'income' ? colors.success : colors.error }
          ]}
        >
          {transaction.type === 'income' ? '+' : '-'}₹{Math.abs(transaction.amount).toFixed(2)}
        </Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {new Date(transaction.date).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  transactionInfo: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  editButton: {
    padding: 4,
    marginLeft: 8,
  },
  category: {
    fontSize: 14,
    marginTop: 4,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  date: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default TransactionItem;
