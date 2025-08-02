import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import TransactionItem from '@/components/TransactionItem';
import { Transaction } from '@/types';
import { 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Calendar
} from 'lucide-react-native';

export default function HistoryScreen() {
  const { colors } = useTheme();
  const { transactions, loading, refreshing, loadTransactions } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || transaction.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.amount - a.amount;
      }
    });

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Transaction History</Text>
        
        <View style={styles.searchContainer}>
          <View style={[styles.searchInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchText, { color: colors.text }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search transactions..."
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: filterType === 'all' ? colors.primary : colors.surface,
                borderColor: colors.border
              }
            ]}
            onPress={() => setFilterType('all')}
          >
            <Filter size={16} color={filterType === 'all' ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[
              styles.filterButtonText,
              { color: filterType === 'all' ? '#FFFFFF' : colors.textSecondary }
            ]}>
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: filterType === 'income' ? colors.success : colors.surface,
                borderColor: colors.border
              }
            ]}
            onPress={() => setFilterType('income')}
          >
            <TrendingUp size={16} color={filterType === 'income' ? '#FFFFFF' : colors.success} />
            <Text style={[
              styles.filterButtonText,
              { color: filterType === 'income' ? '#FFFFFF' : colors.success }
            ]}>
              Income
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: filterType === 'expense' ? colors.error : colors.surface,
                borderColor: colors.border
              }
            ]}
            onPress={() => setFilterType('expense')}
          >
            <TrendingDown size={16} color={filterType === 'expense' ? '#FFFFFF' : colors.error} />
            <Text style={[
              styles.filterButtonText,
              { color: filterType === 'expense' ? '#FFFFFF' : colors.error }
            ]}>
              Expense
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Income</Text>
            <Text style={[styles.summaryAmount, { color: colors.success }]}>
              +₹{totalIncome.toLocaleString()}
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Expense</Text>
            <Text style={[styles.summaryAmount, { color: colors.error }]}>
              -₹{totalExpense.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.transactionsList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadTransactions}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              {loading ? 'Loading transactions...' : 'No transactions found'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  transactionsList: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
  },
});