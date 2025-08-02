import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { SummaryCard } from '@/components/SummaryCard';
import { CategoryChart } from '@/components/CategoryChart';
import TransactionItem from '@/components/TransactionItem';
import { router } from 'expo-router';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  User
} from 'lucide-react-native';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { 
    totalIncome, 
    totalExpense, 
    balance, 
    recentTransactions, 
    categoryData,
    refreshing,
    loadTransactions 
  } = useData();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadTransactions}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.userSection}>
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => router.push('/(tabs)/profile')}
              >
                <User size={24} color={colors.primary} />
              </TouchableOpacity>
              <View>
                <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                  Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
                </Text>
                <Text style={[styles.appName, { color: colors.text }]}>KharchaMeter</Text>
              </View>
            </View>
            <Image 
              source={require('@/assets/images/KharchaMeter.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.summaryContainer}>
          <SummaryCard
            title="Total Balance"
            amount={balance}
            type="balance"
            icon={<Wallet size={20} color={colors.primary} />}
          />
          <View style={styles.summaryRow}>
            <SummaryCard
              title="Income"
              amount={totalIncome}
              type="income"
              icon={<TrendingUp size={20} color={colors.success} />}
            />
            <SummaryCard
              title="Expenses"
              amount={totalExpense}
              type="expense"
              icon={<TrendingDown size={20} color={colors.error} />}
            />
          </View>
        </View>

        {categoryData.length > 0 && <CategoryChart data={categoryData} />}

        <View style={[styles.recentSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
          <View style={styles.transactionsList}>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No transactions yet. Add your first transaction!
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 20, // Reduced from 60 to remove excessive padding
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '500',
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  logo: {
    width: 50,
    height: 50,
  },
  summaryContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  recentSection: {
    margin: 16,
    borderRadius: 12,
    paddingTop: 16,
    // Web-compatible shadow
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  transactionsList: {
    gap: 4,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
});